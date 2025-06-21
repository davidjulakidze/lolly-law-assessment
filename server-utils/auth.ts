import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { User } from '@/types';

export interface AuthResult {
  user: User | null;
  authenticated: boolean;
}

export async function getServerSideAuth(): Promise<AuthResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { user: null, authenticated: false };
  }

  try {
    // Fetch user data from API
    const userResponse = await fetch(`${process.env.url}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
    });

    if (userResponse.ok) {
      const user = await userResponse.json();
      return { user, authenticated: true };
    }

    return { user: null, authenticated: false };
  } catch {
    return { user: null, authenticated: false };
  }
}

export async function verifyAuthToken(request: NextRequest): Promise<number | null> {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return null;
  }
  const user = jwt.verify(token, process.env.JWT_SECRET!);

  if (!user || typeof user !== 'object' || !('userId' in user)) {
    return null;
  }
  if (typeof user.userId !== 'number') {
    return null;
  }
  return user.userId;
}
