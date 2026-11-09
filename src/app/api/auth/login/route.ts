// ============================================================
// PAWTRACE — Auth Login API
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { store } from '@/lib/db/store';
import { createToken } from '@/lib/auth';
import type { ApiResponse, User } from '@/types';

interface LoginResponse {
  user: Omit<User, 'updatedAt'>;
  token: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<LoginResponse>>> {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, password' },
        { status: 400 }
      );
    }

    const user = store.getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Dev mode: any password works
    const token = await createToken(user);

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('pawtrace-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
      message: 'Login successful',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
