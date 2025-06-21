import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/generated/prisma';
import { logger } from '@/server-utils/logger';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password, rememberMe } = body;

  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return new NextResponse(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tokenExpiration = rememberMe ? '7d' : '1h';

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: tokenExpiration,
    });

    const { password: _, ...userWithoutPassword } = user;

    const response = new NextResponse(
      JSON.stringify({
        user: userWithoutPassword,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; ${process.env.NODE_ENV === 'development' ? '' : 'Secure;'} Path=/; Max-Age=${rememberMe ? 604800 : 3600}; SameSite=Strict`
    );
    return response;
  } catch (error) {
    logger.error('Error logging in user:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
