import { NextRequest, NextResponse } from 'next/server';
import { createSessionToken, passwordMatches, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!(await passwordMatches(password))) {
    return NextResponse.json(
      { error: 'Nieprawidłowe hasło.' },
      { status: 401 }
    );
  }
  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
