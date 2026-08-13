import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAdmin } from '@/lib/auth/requireAuth';
import { recordAdminAction } from '@/lib/admin/audit';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  // STEG 9.1 FIX: Bruk konsolidert requireAdmin() i stedet for inline requireAuth()+role-sjekk
  const result = await requireAdmin(request);
  if (result instanceof NextResponse) return result;

  const adminId = result.user.id;
  const { id } = await context.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    // Reset onboarding
    await prisma.user.update({
      where: { id },
      data: {
        onboardingStep: 1,
        onboardingComplete: false,
      }
    });

    // B4 — JourneyProgress er match-scoped: slett alle journey-rekorder for brukeren
    // (nye reiser opprettes automatisk når brukeren matches)
    const journeys = await prisma.journeyProgress.findMany({
      where: { userId: id },
      select: { id: true },
    });

    for (const j of journeys) {
      await prisma.journeyMilestone.deleteMany({ where: { progressId: j.id } });
    }

    if (journeys.length > 0) {
      await prisma.journeyProgress.deleteMany({ where: { userId: id } });
    }

    // STEG 9.2 FIX: Logg destruktiv admin-handling
    await recordAdminAction(adminId, 'JOURNEY_RESET', { targetUserId: id, deletedJourneys: journeys.length });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in reset journey:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}