import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyAuthToken } from '@/server-utils/auth';
import { logger } from '@/server-utils/logger';

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        middleName: true,
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
