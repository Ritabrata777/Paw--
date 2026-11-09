// ============================================================
// PAWTRACE — Single Device API
// ============================================================

import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { ApiResponse, Device } from '@/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<Device>>> {
  try {
    const { id } = await params;
    const device = store.getDeviceById(id);

    if (!device) {
      return NextResponse.json(
        { success: false, error: 'Device not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: device });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch device';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
