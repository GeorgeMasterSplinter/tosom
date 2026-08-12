import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth } from '@/lib/auth/requireAuth';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  // Admin-autorisasjon (same mønster som app/api/admin/users/[id]/route.ts)
  const result = await requireAuth(request);
  if (result instanceof NextResponse) return result;

  if (result.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Forbidden — kun admin kan utføre denne handlingen' },
      { status: 403 }
    );
  }

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

    // Reset or create JourneyProgress
    await prisma.journeyProgress.upsert({
      where: { userId: id },
      create: {
        userId: id,
        phase: "EARLY",
        day: 1,
        completedDays: 0,
      },
      update: {
        phase: "EARLY",
        day: 1,
        completedDays: 0,
      },
    });

    // Delete all milestones for this user
    await prisma.journeyMilestone.deleteMany({
      where: { progress: { userId: id } }
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Error in reset journey:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}


