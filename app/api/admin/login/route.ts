import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, computeSignature } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const password = body?.password;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Admin password is not configured on the server' },
      { status: 500 }
    );
  }
  if (password !== adminPassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const signature = await computeSignature(adminPassword);
  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, signature, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
