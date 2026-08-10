import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCookie } from '@/lib/auth/admin-jwt';

export async function GET(req: NextRequest) {
  const payload = verifyAdminCookie(req);

  return NextResponse.json({ authenticated: !!payload });
}