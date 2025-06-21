import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@/generated/prisma';
import { logger } from '@/server-utils/logger';

export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const token = cookies.find(cookie => cookie.name === 'token')?.value;
  const prisma = new PrismaClient();
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);

    if (!user || typeof user !== 'object' || !('userId' in user)) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    if (!userInfo) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify(userInfo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching user info:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
