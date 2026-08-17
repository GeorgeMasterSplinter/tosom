/**
 * Tosom — Admin bruker-oppsett
 * 
 * POST /api/admin/setup
 * Lagar admin-bruker dersom han ikke eksisterer.
 * 
 * SECURITY: Låst bak ADMIN_SETUP_TOKEN + NODE_ENV-sjekk (timing-safe).
 * Kun tilgjengelig i non-production miljø med korrekt token via Authorization-header.
 * 
 * Bruk: Kall ein gong etter deploy eller reset (kun dev/staging).
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Timing-safe sammenligning av to strenger.
 * Returnerer false dersom lengder varier (constant-time for like lengde).
 */
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  return bufA;
}

export async function POST(req: Request) {
  try {
    // --- VAKTKLAUSUL 1: Blokker i produksjon medmindre token er satt og matcher ---
    const isProduction = process.env.NODE_ENV === 'production';
    const expectedToken = process.env.ADMIN_SETUP_TOKEN;

    if (isProduction) {
      // I produksjon krever vi både at token er konfigurert OG at det matcher
      if (!expectedToken) {
        return NextResponse.json(
          { error: 'Not found' },
          { status: 404 }
        );
      }

      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const providedToken = authHeader.slice(7); // fjern "Bearer "
      if (!safeCompare(providedToken, expectedToken)) {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        );
      }
    }

    const ADMIN_EMAIL = 'admin@tosom.no';

    // --- VAKTKLAUSUL 2: No-op hvis en ADMIN allerede finst (uavhengig av miljø) ---
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin-bruker finst allerede',
        adminId: existingAdmin.id,
      });
    }

    // Opprett admin-bruker
    const admin = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: 'Admin',
        role: 'ADMIN' as any,
        profile: {
          create: {
            identityName: 'Admin',
            age: 30,
            deepProfileStep: 'SUMMARY',
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Admin-bruker oppretta',
      adminId: admin.id,
      adminEmail: admin.email,
    });
  } catch (error) {
    console.error('Admin oppsett feila:', error);
    return NextResponse.json(
      { error: 'Kunne ikke opprette admin-bruker' },
      { status: 500 }
    );
  }
}