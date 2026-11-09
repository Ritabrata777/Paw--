// ============================================================
// PAWTRACE — Animal Search API
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { ApiResponse, SearchResult } from '@/types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SearchResult>>> {
  try {
    const query = request.nextUrl.searchParams.get('q') || '';

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: { animals: [], total: 0, query },
      });
    }

    const animals = store.searchAnimals(query);

    return NextResponse.json({
      success: true,
      data: {
        animals,
        total: animals.length,
        query,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
