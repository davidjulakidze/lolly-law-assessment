import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { logger } from '@/server-utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customer_id: string }> }
) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  const { customer_id } = await params;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (customer_id && isNaN(Number(customer_id))) {
      return new NextResponse(JSON.stringify({ error: 'Invalid customer ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const matters = await prisma.matter.findMany({
      where: { customerId: Number(customer_id) },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        customerId: true,
      },
    });
    return new NextResponse(JSON.stringify(matters), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching matters:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ customer_id: string }> }
) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  const { customer_id } = await params;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (customer_id && isNaN(Number(customer_id))) {
      return new NextResponse(JSON.stringify({ error: 'Invalid customer ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const body = await request.json();
    const { title, description, status } = body;
    if (!title || !status) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const matter = await prisma.matter.create({
      data: {
        title,
        description,
        status,
        customerId: Number(customer_id),
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        customerId: true,
      },
    });

    return new NextResponse(JSON.stringify(matter), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error creating matter:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
