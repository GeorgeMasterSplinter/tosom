import { NextRequest, NextResponse } from 'next/server';

/**
 * ToSom — Admin Session API
 * 
 * GET /api/admin/session
 * Sjekkar om admin_token-cookie er gyldig.
 */

export async function GET(req: NextRequest) {
  const hasToken = req.cookies.get('admin_token')?.value === 'valid';

  return NextResponse.json({ authenticated: hasToken });
}