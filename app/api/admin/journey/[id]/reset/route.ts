import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reset journey - nullify journey fields and delete journey tasks
    await prisma.user.update({
      where: { id },
      data: {
        journeyStatus: "NOT_STARTED",
        // Reset any journey-related fields you have
        onboardingStep: 1,
      }
    });

    // Delete all journey tasks for this user
    await prisma.journeyTask.deleteMany({
      where: { userId: id }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in reset journey:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
