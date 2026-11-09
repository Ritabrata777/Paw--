// ============================================================
// PAWTRACE — Devices API (List)
// ============================================================

import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { ApiResponse, Device } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<Device[]>>> {
  try {
    const devices = store.getDevices();
    return NextResponse.json({ success: true, data: devices });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch devices';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
