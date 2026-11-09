// ============================================================
// PAWTRACE — Auth Signup API
// ============================================================

import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { store } from '@/lib/db/store';
import { createToken } from '@/lib/auth';
import type { ApiResponse, User } from '@/types';

interface SignupResponse {
  user: Omit<User, 'updatedAt'>;
  token: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SignupResponse>>> {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, password' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = store.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user in store
    const now = new Date().toISOString();
    const newUser: User = {
      id: `user-${String(store.users.length + 1).padStart(3, '0')}`,
      email,
      name,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    };
    store.users.push(newUser);

    const token = await createToken(newUser);

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('pawtrace-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            avatarUrl: newUser.avatarUrl,
            role: newUser.role,
            createdAt: newUser.createdAt,
          },
          token,
        },
        message: 'Account created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
