// ============================================================
// PAWTRACE — Saved Animals API
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import type { ApiResponse, SavedAnimal } from '@/types';

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SavedAnimal[]>>> {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required query parameter: userId' },
        { status: 400 }
      );
    }

    const savedAnimals = store.getSavedAnimals(userId);

    return NextResponse.json({ success: true, data: savedAnimals });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch saved animals';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SavedAnimal>>> {
  try {
    const body = await request.json();
    const { userId, animalId } = body;

    if (!userId || !animalId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, animalId' },
        { status: 400 }
      );
    }

    // Verify animal exists
    const animal = store.getAnimalById(animalId);
    if (!animal) {
      return NextResponse.json(
        { success: false, error: 'Animal not found' },
        { status: 404 }
      );
    }

    const saved = store.saveAnimal(userId, animalId);

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save animal';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ removed: boolean }>>> {
  try {
    const body = await request.json();
    const { userId, animalId } = body;

    if (!userId || !animalId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, animalId' },
        { status: 400 }
      );
    }

    const removed = store.unsaveAnimal(userId, animalId);

    if (!removed) {
      return NextResponse.json(
        { success: false, error: 'Saved animal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { removed: true },
      message: 'Animal unsaved successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to unsave animal';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
