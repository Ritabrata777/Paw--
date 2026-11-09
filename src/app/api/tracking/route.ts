// ============================================================
// PAWTRACE — Tracking API (Animals with GPS Data)
// ============================================================

import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { Animal, ApiResponse, GPSLocation } from '@/types';

type TrackedAnimal = Animal & { lastLocation?: GPSLocation };

export async function GET(): Promise<NextResponse<ApiResponse<TrackedAnimal[]>>> {
  try {
    const animalsWithLocations = store.getAnimalsWithLocations();

    // Filter to only animals that have GPS devices
    const tracked = animalsWithLocations.filter(
      (a) => a.deviceId
    ) as TrackedAnimal[];

    return NextResponse.json({ success: true, data: tracked });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tracking data';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
