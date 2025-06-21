import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return new NextResponse(JSON.stringify({ message: 'No token provided' }), {
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
