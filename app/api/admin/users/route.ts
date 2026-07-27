/**
 * ToSom — Admin Users API
 * Hent brukarar frå database med admin-autentisering.
 */

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/users
 * Query params: page, search
 */
export async function GET(request: Request) {
  try {
    // Auth-sjekk — berre ADMIN kan aksessere
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (session.user as any).role || 'USER';
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const search = url.searchParams.get('search') || '';
    const limit = 20;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { profile: { identityName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          verified: true,
          bannedAt: true,
          createdAt: true,
          onboardingComplete: true,
          deepProfileComplete: true,
          profile: { select: { identityName: true, age: true, photoUrl: true } },
          _count: {
            select: {
              matchesA: true,
              matchesB: true,
              conversationsA: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' as const },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/admin/users feil:', error);
    return NextResponse.json(
      { error: 'Intern serverfeil' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id] — Ban/unban/verifisere brukar
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

    const body = await request.json();
    const { action, reason } = body as {
      action: 'ban' | 'unban' | 'verify' | 'flag' | 'remove-flag';
      reason?: string;
    };

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    let updatedUser;
    switch (action) {
      case 'ban':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { bannedAt: new Date() },
          select: { id: true, email: true, bannedAt: true },
        });
        break;
      case 'unban':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { bannedAt: null },
          select: { id: true, email: true, bannedAt: true },
        });
        break;
      case 'verify':
        updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { verified: true },
          select: { id: true, email: true, verified: true },
        });
        break;
      default:
        return NextResponse.json({ error: 'Ugyldig action' }, { status: 400 });
    }

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        action: action === 'ban' ? 'USER_BAN' : action === 'unban' ? 'USER_UNBAN' : 'USER_VERIFY',
        metadata: JSON.stringify({ targetUserId: userId, reason }),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('PATCH /api/admin/users/[id] feil:', error);
    return NextResponse.json(
      { error: 'Intern serverfeil' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id] — Slett brukar (soft delete)
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const userId = url.pathname.split('/').pop();

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), bannedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: 'Brukar sletta (soft delete)' });
  } catch (error) {
    console.error('DELETE /api/admin/users/[id] feil:', error);
    return NextResponse.json(
      { error: 'Intern serverfeil' },
      { status: 500 }
    );
  }
}