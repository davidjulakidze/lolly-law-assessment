import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@/generated/prisma';
import { logger } from '@/server-utils/logger';

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  try {
    const body = await request.json();
    const { firstName, middleName, lastName, email, password } = body;
    if (!firstName || !lastName || !email || !password) {
      return new NextResponse(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (password.length < 6) {
      return new NextResponse(JSON.stringify({ error: 'Password must be at least 6 characters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await prisma.user.create({
      data: {
        firstName,
        middleName,
        lastName,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: 'User created successfully',
        user: newUser,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    logger.error('Error creating user:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}
