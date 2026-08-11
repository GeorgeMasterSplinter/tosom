/**
 * ToSom — Admin brukar-oppsett
 * 
 * POST /api/admin/setup
 * Lagar admin-brukar dersom han ikke eksisterer.
 * 
 * Bruk: Kall ein gong etter deploy eller reset.
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const ADMIN_EMAIL = 'admin@tosom.no';

    // Sjekk om admin allereie finst
    const existing = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Admin-brukar finst allereie',
        adminId: existing.id,
      });
    }

    // Opprett admin-brukar
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
      message: 'Admin-brukar oppretta',
      adminId: admin.id,
      adminEmail: admin.email,
    });
  } catch (error) {
    console.error('Admin oppsett feila:', error);
    return NextResponse.json(
      { error: 'Kunne ikke opprette admin-brukar' },
      { status: 500 }
    );
  }
}