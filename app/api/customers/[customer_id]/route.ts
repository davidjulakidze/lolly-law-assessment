import { NextRequest } from 'next/server';
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
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (customer_id && isNaN(Number(customer_id))) {
      return new Response(JSON.stringify({ error: 'Invalid customer ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const customer = await prisma.customer.findUnique({
      where: { id: Number(customer_id) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!customer) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error fetching customer:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ customer_id: string }> }
) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  const { customer_id } = await params;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (customer_id && isNaN(Number(customer_id))) {
      return new Response(JSON.stringify({ error: 'Invalid customer ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const data = await request.json();
    const { firstName, lastName, email, phone } = data;

    if (!firstName || !lastName || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: Number(customer_id) },
      data: { firstName, lastName, email, phone },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify(updatedCustomer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error updating customer:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ customer_id: string }> }
) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  const { customer_id } = await params;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    if (customer_id && isNaN(Number(customer_id))) {
      return new Response(JSON.stringify({ error: 'Invalid customer ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    await prisma.customer.delete({
      where: { id: Number(customer_id) },
    });

    return new Response(JSON.stringify({ message: 'Customer deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error deleting customer:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
