import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { verifyAuthToken } from '@/server-utils/auth';
import { logger } from '@/server-utils/logger';

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  const userId = await verifyAuthToken(request);
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const search = searchParams.get('search') ?? '';

    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { middleName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const totalCount = await prisma.customer.count({
      where: whereClause,
    });

    const customers = await prisma.customer.findMany({
      where: whereClause,
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }],
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      customers,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching customers:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const userId = await verifyAuthToken(request);
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const data = await request.json();
    const { firstName, middleName, lastName, email, phone } = data;

    if (!firstName || !lastName || !email || !phone) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        firstName,
        middleName,
        lastName,
        email,
        phone,
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return new NextResponse(JSON.stringify(newCustomer), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error creating customer:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
