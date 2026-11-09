// ============================================================
// PAWTRACE — Community Feed API
// ============================================================

import { NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { Animal, ApiResponse, Sighting } from '@/types';

interface CommunityFeed {
  recentSightings: Sighting[];
  recentlyRegistered: Animal[];
  animalsWithoutCollars: Animal[];
}

export async function GET(): Promise<NextResponse<ApiResponse<CommunityFeed>>> {
  try {
    // Recent sightings (last 10)
    const recentSightings = store.getSightings({ limit: 10 });

    // Recently registered animals (last 5)
    const { animals: allAnimals } = store.getAnimals();
    const recentlyRegistered = [...allAnimals]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    // Animals without collars
    const { animals: nocollarAnimals } = store.getAnimals({ hasDevice: false });

    return NextResponse.json({
      success: true,
      data: {
        recentSightings,
        recentlyRegistered,
        animalsWithoutCollars: nocollarAnimals,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch community feed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
