import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { logger } from '@/server-utils/logger';

export async function GET(Request: NextRequest) {
  const prisma = new PrismaClient();
  const token = Request.cookies.get('token')?.value;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const path = Request.nextUrl.pathname;
  const customerId = path.split('/').pop();
  try {
    if (customerId && !isNaN(Number(customerId))) {
      const customer = await prisma.customer.findUnique({
        where: { id: Number(customerId) },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
      if (!customer) {
        return new NextResponse(JSON.stringify({ error: 'Customer not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new NextResponse(JSON.stringify(customer), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });
    return new NextResponse(JSON.stringify(customers), {
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
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const data = await request.json();
    const { firstName, lastName, email, phone } = data;

    if (!firstName || !lastName || !email || !phone) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
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

export async function PUT(request: NextRequest) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const data = await request.json();
    const { id, firstName, lastName, email, phone } = data;

    if (!id || !firstName || !lastName || !email || !phone) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updateData: any = {};
    if (firstName) {
      updateData.firstName = firstName;
    }
    if (lastName) {
      updateData.lastName = lastName;
    }
    if (email) {
      updateData.email = email;
    }
    if (phone) {
      updateData.phone = phone;
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    return new NextResponse(JSON.stringify(updatedCustomer), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error updating customer:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const path = request.nextUrl.pathname;
    const customerId = path.split('/').pop();

    if (!customerId || isNaN(Number(customerId))) {
      return new NextResponse(JSON.stringify({ error: 'Invalid customer ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await prisma.customer.delete({
      where: { id: Number(customerId) },
    });

    return new NextResponse(JSON.stringify({ message: 'Customer deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Error deleting customer:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
