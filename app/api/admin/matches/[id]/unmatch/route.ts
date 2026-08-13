import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAdmin } from '@/lib/auth/requireAuth';
import { recordAdminAction } from '@/lib/admin/audit';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  // STEG 9.1 FIX: Bruk konsolidert requireAdmin()
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  try {
    const match = await prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      return new Response(JSON.stringify({ error: "Match not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    await prisma.match.update({
      where: { id },
      data: {
        status: "ended",
      },
    });

    // STEG 9.2 FIX: Logg destruktiv admin-handling
    await recordAdminAction(auth.user.id, 'CONTENT_DELETE', { matchId: id, action: 'unmatch' });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in force unmatch:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}