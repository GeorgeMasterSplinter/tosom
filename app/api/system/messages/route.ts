// app/api/system/messages/route.ts — GET /api/system/messages
// Returner ulesse systemmeldingar og notifikasjonar for innlogga bruker.
// Brukast av journey, chat og dashboard for å vise viktige oppdateringar.

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "@/lib/auth/session";
import { captureError } from "@/lib/system/errors";
import { logInfo } from "@/lib/system/log";

export const dynamic = 'force-dynamic';

/**
 * GET /api/system/messages
 * 
 * Query params:
 *   unreadOnly: boolean (optional) — bare returner ulesse meldinger
 * 
 * Response:
 * {
 *   success: true,
 *   data: {
 *     notifications: Array<{ id, type, message, readAt, createdAt }>,
 *     systemMessages: Array<{ id, content, type, createdAt }>,
 *     unreadCount: number
 *   }
 * }
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user.id;
    const url = new URL(request.url);
    const unreadOnly = url.searchParams.get("unreadOnly") === "true";

    // Hent notifikasjonar for brukeren
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { readAt: null } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        message: true,
        metadata: true,
        readAt: true,
        createdAt: true,
      },
      take: 20, // maks 20 meldinger per hending
    });

    // Hent systemmeldingar fra SystemMessage-tabellen (globale meldinger)
    const systemMessages = await prisma.systemMessage.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        type: true,
        createdAt: true,
      },
      take: 10,
    });

    // Rekn ulesse notifikasjonar
    const unreadCount = await prisma.notification.count({
      where: { userId, readAt: null },
    });

    await logInfo("system/messages fetched", "system_messages", { userId, unreadOnly });

    return NextResponse.json(
      {
        success: true,
        data: {
          notifications,
          systemMessages,
          unreadCount,
        },
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await captureError(error, {
      module: "system",
      message: "GET /api/system/messages failed",
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * POST /api/system/messages/mark-read — mark en notifikasjon som lese
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = session.user.id;
    let body: { notificationId?: string; all?: boolean };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Ugyldig forespørsel — manglende body" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { notificationId, all } = body;

    if (all) {
      // Marker alle som lese
      await prisma.notification.updateMany({
        where: { userId, readAt: null },
        data: { readAt: new Date() },
      });
    } else if (notificationId) {
      // Marker éin notifikasjon som lese
      const notification = await prisma.notification.findFirst({
        where: { id: notificationId, userId },
      });

      if (!notification) {
        return NextResponse.json(
          { success: false, error: "Notifikasjon ikke funnet" },
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: { readAt: new Date() },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Manglende notificationId eller all=true" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(
      { success: true, data: { message: "Markert som lese" } },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    await captureError(error, {
      module: "system",
      message: "POST /api/system/messages/mark-read failed",
    });
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}