import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/auth/admin-jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_PROD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin-oppsett manglende i miljøvariabler' },
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: 'Ugyldige innloggingsopplysninger' },
        { status: 401 }
      );
    }

    const token = await signAdminToken(email);

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 timer (kortere enn tidligere 24h for bedre sikkerhet)
      path: '/',
    });

    return response;
  } catch {
      return NextResponse.json(
        { error: 'Ugyldig forespørsel' },
        { status: 400 }
      );
  }
}