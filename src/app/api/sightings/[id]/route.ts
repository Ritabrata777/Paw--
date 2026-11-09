// ============================================================
// PAWTRACE — Single Sighting API (Get & Update)
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { ApiResponse, Sighting, SightingStatus } from '@/types';

const VALID_STATUSES: SightingStatus[] = ['pending', 'confirmed', 'rejected', 'needs_review'];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Sighting>>> {
  try {
    const { id } = await params;
    const sightings = store.getSightings();
    const sighting = sightings.find((s) => s.id === id);

    if (!sighting) {
      return NextResponse.json(
        { success: false, error: 'Sighting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: sighting });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sighting';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Sighting>>> {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, verifiedBy } = body;

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    // Find the sighting in the store directly
    const sighting = store.sightings.find((s) => s.id === id);

    if (!sighting) {
      return NextResponse.json(
        { success: false, error: 'Sighting not found' },
        { status: 404 }
      );
    }

    // Update the sighting in-place
    if (status) sighting.status = status;
    if (verifiedBy) {
      sighting.verifiedBy = verifiedBy;
      sighting.verifiedAt = new Date().toISOString();
    }
    sighting.updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, data: sighting });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update sighting';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
