import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/server-utils/auth';

export async function POST(request: NextRequest) {
  const userId = await verifyAuthToken(request);
  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const response = new NextResponse(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  response.headers.set(
    'Set-Cookie',
    'token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Strict'
  );
  return response;
}
