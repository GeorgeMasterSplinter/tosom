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

    // Mark journey as completed
    await prisma.user.update({
      where: { id },
      data: {
        onboardingStep: 999,
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in mark journey as completed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
