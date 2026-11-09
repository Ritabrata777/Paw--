// ============================================================
// PAWTRACE — GPS Telemetry Ingestion API
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { ApiResponse, GPSLocation, TelemetryPayload } from '@/types';

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GPSLocation>>> {
  try {
    const body: TelemetryPayload = await request.json();
    const { device_id, latitude, longitude, altitude, satellites, timestamp, battery_level } = body;

    // Validate required fields
    if (!device_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: device_id' },
        { status: 400 }
      );
    }

    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { success: false, error: 'Invalid latitude: must be a number between -90 and 90' },
        { status: 400 }
      );
    }

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { success: false, error: 'Invalid longitude: must be a number between -180 and 180' },
        { status: 400 }
      );
    }

    if (!timestamp) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: timestamp' },
        { status: 400 }
      );
    }

    // Verify device exists
    const device = store.getDeviceById(device_id);
    if (!device) {
      return NextResponse.json(
        { success: false, error: `Device "${device_id}" not found` },
        { status: 404 }
      );
    }

    const location: GPSLocation = {
      id: `loc-${Date.now()}`,
      deviceId: device_id,
      latitude,
      longitude,
      altitude,
      satellites,
      batteryLevel: battery_level,
      timestamp,
      createdAt: new Date().toISOString(),
    };

    store.addLocation(location);

    return NextResponse.json(
      { success: true, data: location, message: 'Telemetry recorded' },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to process telemetry';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
