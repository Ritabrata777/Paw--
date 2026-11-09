// ============================================================
// PAWTRACE — Sightings API (List & Create)
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { ApiResponse, Sighting } from '@/types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Sighting[]>>> {
  try {
    const { searchParams } = request.nextUrl;

    const status = searchParams.get('status') || undefined;
    const animalId = searchParams.get('animalId') || undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : undefined;

    const sightings = store.getSightings({ status, animalId, limit });

    return NextResponse.json({ success: true, data: sightings });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sightings';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Sighting>>> {
  try {
    const body = await request.json();
    const { animalId, reportedBy, species, photoUrl, latitude, longitude, locality, notes, sightedAt } = body;

    if (!species || !locality || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: species, locality, latitude, longitude' },
        { status: 400 }
      );
    }

    if (!['dog', 'cat'].includes(species)) {
      return NextResponse.json(
        { success: false, error: 'Species must be "dog" or "cat"' },
        { status: 400 }
      );
    }

    const sighting = store.createSighting({
      animalId: animalId || undefined,
      reportedBy: reportedBy || 'user-001',
      species,
      photoUrl: photoUrl || undefined,
      latitude,
      longitude,
      locality,
      notes: notes || undefined,
      sightedAt: sightedAt || new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: sighting }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create sighting';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
