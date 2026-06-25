/**
 * ToSom — Superbrukar-innlogging (dev/staging kun)
 * 
 * POST /api/super-login
 * - Godtar e-post + passord (ikkje magic-link)
 * - Sjekk at brukar har role = "admin" (Prisma Role enum)
 * - Berre aktiv i dev/staging-miljø
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Role } from '@prisma/client';

// Berre aktiv i dev/staging
const ALLOWED_ENVIRONMENTS = ['development', 'staging'];

export async function POST(req: NextRequest) {
  // Sjekk miljø
  const env = process.env.NODE_ENV || 'development';
  if (!ALLOWED_ENVIRONMENTS.includes(env)) {
    return NextResponse.json(
      { error: 'Super-login er berre tilgjengeleg i dev/staging' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const email = (body.email as string)?.trim().toLowerCase();
    const password = (body.password as string)?.trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Manglande e-post eller passord' },
        { status: 400 }
      );
    }

    // Finn admin-brukar med e-post og passord
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password, // I produktion: bcrypt.compare(password, user.password)
        role: 'ADMIN' as Role,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Ugyldig innlogging eller ikkje admin-brukar' },
        { status: 401 }
      );
    }

    // Generer session token
    const sessionToken = Buffer.from(
      JSON.stringify({
        userId: user.id,
        role: user.role,
        iat: Date.now(),
        exp: Date.now() + 60 * 60 * 24 * 7 * 1000, // 7 dagar
      })
    ).toString('base64url');

    // Logg innlogging (audit)
    console.log(`[SUPER-LOGIN] Admin-brukar ${email} logga inn ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      userId: user.id,
      redirect: '/dashboard',
      role: user.role,
    }, {
      headers: {
        'Set-Cookie': `tosom.super-session=${sessionToken}; Path=/; HttpOnly; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
      },
    });
  } catch (err) {
    console.error('Super-login feil:', err);
    return NextResponse.json(
      { error: 'Kunne ikkje logge inn' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/super-login — Returner liste over admin-brukarar (kun admin)
 */
export async function GET(req: NextRequest) {
  const env = process.env.NODE_ENV || 'development';
  if (!ALLOWED_ENVIRONMENTS.includes(env)) {
    return NextResponse.json({ users: [] });
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: 'ADMIN' as Role },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error('Admin-brukar-liste feil:', err);
    return NextResponse.json({ users: [] });
  }
}
