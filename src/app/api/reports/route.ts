// ============================================================
// PAWTRACE — Reports API (List & Create)
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { AnimalReport, ApiResponse, ReportCategory } from '@/types';

const VALID_CATEGORIES: ReportCategory[] = [
  'injured',
  'missing',
  'needs_assistance',
  'damaged_collar',
  'missing_collar',
];

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AnimalReport[]>>> {
  try {
    const { searchParams } = request.nextUrl;

    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;

    const reports = store.getReports({ status, category });

    return NextResponse.json({ success: true, data: reports });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reports';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<AnimalReport>>> {
  try {
    const body = await request.json();
    const { animalId, reportedBy, category, description, photoUrl, latitude, longitude, locality } = body;

    if (!category || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: category, description' },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { success: false, error: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` },
        { status: 400 }
      );
    }

    const report = store.createReport({
      animalId: animalId || undefined,
      reportedBy: reportedBy || 'user-001',
      category,
      description,
      photoUrl: photoUrl || undefined,
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      locality: locality || undefined,
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create report';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
