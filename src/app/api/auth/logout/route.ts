// ============================================================
// PAWTRACE — Auth Logout API
// ============================================================

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { ApiResponse } from '@/types';

export async function POST(): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const cookieStore = await cookies();
    cookieStore.set('pawtrace-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Logged out successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
