/**
 * ToSom Admin Users API
 * 
 * Hentar brukarliste frå databasen med paginering, filter og sortering.
 * Berre tilgjengeleg for admin (krevar admin_token-cookie).
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

/** Sjekk om admin er autentisert */
function isAdmin(req: NextRequest): boolean {
  const adminToken = req.cookies.get('admin_token')?.value;
  return !!adminToken;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Uautorisert' }, { status: 401 });
  }

  try {
    // Parsar query-parameterar
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const search = url.searchParams.get('search')?.trim() || '';
    const role = url.searchParams.get('role') as 'USER' | 'ADMIN' | null;
    const verified = url.searchParams.get('verified');
    const banned = url.searchParams.get('banned');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    // Beregn offset for paginering
    const offset = (page - 1) * limit;

    // Bygg WHERE-clause dynamisk
    const where: any = {};
    
    if (role) where.role = role;
    if (verified === 'true') where.verified = true;
    if (verified === 'false') where.verified = false;
    if (banned === 'true') where.bannedAt = { not: null };
    if (banned === 'false') where.bannedAt = null;

    // Søking i email og name
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { firstName: { contains: search, mode: 'insensitive' } } },
        { profile: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Validér sort-kolonnar
    const allowedSortColumns = ['createdAt', 'email', 'role', 'verified', 'onboardingComplete'];
    const validSortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'createdAt';

    // Hentar brukarar med relasjonar
    const users = await prisma.user.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { [validSortColumn]: sortOrder },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        verified: true,
        bannedAt: true,
        deletedAt: true,
        onboardingStep: true,
        onboardingComplete: true,
        deepProfileComplete: true,
        createdAt: true,
        updatedAt: true,
        lastMatchAt: true,
        lockedUntil: true,
        profile: {
          select: {
            firstName: true,
            lastName: true,
            age: true,
            photoUrl: true,
          },
        },
        _count: {
          select: {
            matchesA: true,
            matchesB: true,
            conversationsA: true,
          },
        },
      },
    });

    // Hentar totalt antal for paginering
    const total = await prisma.user.count({ where });

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: offset + users.length < total,
        hasPrev: page > 1,
      },
      filters: { search, role, verified, banned },
    });

  } catch (error) {
    console.error('[AdminUsers] Feil ved henting av brukarliste:', error);
    return NextResponse.json(
      { error: 'Kunne ikkje hente brukarliste' },
      { status: 500 }
    );
  }
}