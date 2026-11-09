// ============================================================
// PAWTRACE — Auth Me API (Current User)
// ============================================================

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { store } from '@/lib/db/store';
import { verifyToken } from '@/lib/auth';
import type { ApiResponse, User } from '@/types';

export async function GET(): Promise<NextResponse<ApiResponse<User>>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pawtrace-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = store.getUserById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Authentication check failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
