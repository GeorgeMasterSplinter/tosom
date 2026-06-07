import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuthGuard } from '@/lib/auth/adminAuthGuard';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminAuthGuard();
  if (auth) return auth;

  const { id } = await params;
  try {
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to mark as reviewed' }, { status: 500 });
  }
}
