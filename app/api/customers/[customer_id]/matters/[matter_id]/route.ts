import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { logger } from '@/server-utils/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ customer_id: string; matter_id: string }> }
) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  const { customer_id, matter_id } = await params;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    if (isNaN(Number(customer_id)) || isNaN(Number(matter_id))) {
      return new NextResponse(JSON.stringify({ error: 'Invalid customer or matter ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const matter = await prisma.matter.findUnique({
      where: {
        id: Number(matter_id),
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

    if (!matter) {
      return new NextResponse(JSON.stringify({ error: 'Matter not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify(matter), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching matter:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ customer_id: string; matter_id: string }> }
) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  const { customer_id, matter_id } = await params;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    if (isNaN(Number(customer_id)) || isNaN(Number(matter_id))) {
      return new NextResponse(JSON.stringify({ error: 'Invalid customer or matter ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const { title, description, status } = data;
    const updatedMatter = await prisma.matter.update({
      where: {
        id: Number(matter_id),
        customerId: Number(customer_id),
      },
      data: {
        title,
        description,
        status,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        customerId: true,
      },
    });

    return new NextResponse(JSON.stringify(updatedMatter), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error updating matter:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ customer_id: string; matter_id: string }> }
) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  const { customer_id, matter_id } = await params;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    if (isNaN(Number(customer_id)) || isNaN(Number(matter_id))) {
      return new NextResponse(JSON.stringify({ error: 'Invalid customer or matter ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await prisma.matter.delete({
      where: {
        id: Number(matter_id),
        customerId: Number(customer_id),
      },
    });

    return new NextResponse(JSON.stringify({ message: 'Matter deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error deleting matter:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
