import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { adminAuthGuard } from "@/lib/auth/adminAuthGuard";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminAuthGuard();
  if (auth) return auth;

  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const nextStep = user.onboardingStep + 1;

    await prisma.user.update({
      where: { id },
      data: {
        onboardingStep: nextStep,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in advance to next step:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
