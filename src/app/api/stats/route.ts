// ============================================================
// PAWTRACE — Community Stats API
// ============================================================

import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { ApiResponse, CommunityStats } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<CommunityStats>>> {
  try {
    const stats = store.getStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
