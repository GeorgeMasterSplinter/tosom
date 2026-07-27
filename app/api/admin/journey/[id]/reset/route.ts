import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
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
        completedSteps: 0,
        totalSteps: 36,
      },
      update: {
        phase: "EARLY",
        day: 1,
        completedSteps: 0,
        totalSteps: 36,
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


