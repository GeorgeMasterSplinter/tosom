import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAuth';
import { sendWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/email/test
 * Body: { userId: string }
 * Sender velkommen-epost til valgt bruker for SMTP-test.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId kreves' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, profile: { select: { identityName: true, firstName: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: 'Bruker ikke funnet' }, { status: 404 });
    }

    const displayName = user.profile?.identityName || user.profile?.firstName || user.name || 'Der';

    const result = await sendWelcomeEmail(user.email, displayName);

    return NextResponse.json({
      success: result.success,
      email: user.email,
      error: result.error || null,
    });
  } catch (error) {
    console.error('POST /api/admin/email/test error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
