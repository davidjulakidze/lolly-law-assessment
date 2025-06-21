import { logger } from "@/server-utils/logger";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const path = request.nextUrl.pathname;
  const customerId = path.split('/').pop();
  
  try {
    if (customerId && !isNaN(Number(customerId))) {
      const matters = await prisma.matters.findMany({
        where: { customerId: Number(customerId) },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          createdAt: true,
        },
      });
      return new NextResponse(JSON.stringify(matters), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new NextResponse(JSON.stringify({ error: 'Invalid customer ID' }), {
      status: 400,
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
