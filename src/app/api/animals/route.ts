// ============================================================
// PAWTRACE — Animals API (List & Create)
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { Animal, ApiResponse } from '@/types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ animals: Animal[]; total: number; page: number; pageSize: number }>>> {
  try {
    const { searchParams } = request.nextUrl;

    const species = searchParams.get('species') || undefined;
    const hasDeviceParam = searchParams.get('hasDevice');
    const locality = searchParams.get('locality') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    const hasDevice =
      hasDeviceParam === 'true' ? true : hasDeviceParam === 'false' ? false : undefined;

    const { animals, total } = store.getAnimals({
      species,
      hasDevice,
      locality,
      search,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: {
        animals,
        total,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch animals';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Animal>>> {
  try {
    const body = await request.json();
    const { name, species, description, locality, approximateAge, gender, deviceId, primaryPhoto, registeredBy } = body;

    if (!name || !species || !locality) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, species, locality' },
        { status: 400 }
      );
    }

    if (!['dog', 'cat'].includes(species)) {
      return NextResponse.json(
        { success: false, error: 'Species must be "dog" or "cat"' },
        { status: 400 }
      );
    }

    const animal = store.createAnimal({
      name,
      species,
      description: description || '',
      locality,
      approximateAge: approximateAge || undefined,
      gender: gender || 'unknown',
      deviceId: deviceId || undefined,
      primaryPhoto: primaryPhoto || '/images/animals/placeholder.jpg',
      registeredBy: registeredBy || 'user-001',
    });

    return NextResponse.json({ success: true, data: animal }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create animal';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
