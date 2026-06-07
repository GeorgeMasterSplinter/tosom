import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { adminAuthGuard } from "@/lib/auth/adminAuthGuard";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminAuthGuard();
  if (auth) return auth;

  const { id } = await params;
  try {
    // Find match
    const match = await prisma.match.findUnique({
      where: { id }
    });

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Reset matchScore, matchReason and set status to PENDING
    await prisma.match.update({
      where: { id },
      data: {
        status: "PENDING",
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in reset match:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
