// ============================================================
// PAWTRACE — Single Animal API
// ============================================================

import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { Animal, ApiResponse, GPSLocation } from '@/types';

interface AnimalDetail extends Animal {
  lastLocation?: GPSLocation;
  locationHistory: GPSLocation[];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<AnimalDetail>>> {
  try {
    const { id } = await params;
    const animal = store.getAnimalById(id);

    if (!animal) {
      return NextResponse.json(
        { success: false, error: 'Animal not found' },
        { status: 404 }
      );
    }

    let lastLocation: GPSLocation | undefined;
    let locationHistory: GPSLocation[] = [];

    if (animal.deviceId) {
      lastLocation = store.getLatestLocation(animal.deviceId);
      locationHistory = store.getLocationHistory(animal.deviceId);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...animal,
        lastLocation,
        locationHistory,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch animal';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
