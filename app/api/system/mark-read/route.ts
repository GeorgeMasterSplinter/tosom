/**
 * POST /api/system/mark-read
 *
 * Markerer den innloggede brukerens uleste systemmeldinger som lest.
 * Massevarianten av POST /api/notifications/[id]/read (som markerer én).
 * Bruk av: components/NotificationCenter.tsx:27
 *
 * Krav fra ACT v6 steg 2.1 Del C:
 * - Bruk samme modell/felt som notifications/[id]/read
 * - Klienten sender ingen body og bruker ikke responsen (fire-and-forget)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { markAllRead } from "@/lib/notifications/dispatcher";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const result = await requireAuth(req);
    if (result instanceof NextResponse) return result;
    const userId = result.user.id;

    // Samme modell som notifications/[id]/read: Notification.readAt
    await markAllRead(userId);

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("POST /api/system/mark-read error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}