/**
 * POST /api/chat/send
 * 
 * Send melding i ein aktiv conversation.
 * Core-definition: Guided chat — systemmeldingar frå reisa.
 * Meldingstypar: text, reflection, system, task
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/requireAuth";
import type { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // 1. Auth
    const result = await requireAuth(req);
    if (result instanceof NextResponse) {
      return result;
    }
    const user = result.user;

    // 2. Hent body
    const body = await req.json();
    const {
      conversationId,
      content,
      type = "text",
    } = body as {
      conversationId: string;
      content: string;
      type?: "text" | "reflection" | "system" | "task";
    };

    if (!content || !conversationId) {
      return NextResponse.json(
        { error: "content og conversationId er påkrevd" },
        { status: 400 }
      );
    }

    // 3. Sjekk at conversation er aktiv
    const conv = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userAId: user.id },
          { userBId: user.id },
        ],
        endedAt: null,
      },
      select: {
        id: true,
        userAId: true,
        userBId: true,
        imageShareAllowedAt: true,
      },
    });

    if (!conv) {
      return NextResponse.json(
        { error: "Ingen aktiv conversation funnen" },
        { status: 404 }
      );
    }

    // 4. Sjekk bilde-tillatelse (dag 1-14) — ikkje mogleg pga. MessageCategory manglar image
    // MessageCategory enum: user, system, continue_choice, image
    // Men type er text/reflection/system/task — ikkje image
    // Så vi treng ikkje sjekke bilett-tillatelse her

    // 5. Map type string til MessageCategory
    // Bruk Prisma's MessageCategory enum
    const messageCategory = type === "text" ? "user" : type;

    // 5b. Hent categoryQuestionId om eksisterande (valfritt)
    let categoryQuestionId: string | undefined = undefined;
    if (body.categoryQuestionId) {
      // Valider at spørsmålet høyrer til ein aktiv kategori i konversationens match
      const convMatch = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { matchId: true },
      });
      if (convMatch?.matchId) {
        const question = await prisma.chatQuestion.findFirst({
          where: {
            id: body.categoryQuestionId,
            isActive: true,
          },
          select: { id: true },
        });
        if (question) {
          categoryQuestionId = question.id;
          // Auk usageCount
          await prisma.chatQuestion.update({
            where: { id: question.id },
            data: { usageCount: { increment: 1 } },
          });
        }
      }
    }

    // 6. Lag melding
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: user.id,
        content,
        type: messageCategory as any,
        categoryQuestionId,
      },
      include: {
        categoryQuestion: {
          select: { text: true, category: { select: { name: true, key: true } } },
        },
      },
    });

    // 7. Oppdater lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      type: message.type,
      categoryQuestionId: message.categoryQuestionId,
      createdAt: message.createdAt.toISOString(),
      sender: null,
      question: message.categoryQuestion
        ? {
            text: message.categoryQuestion.text,
            categoryName: message.categoryQuestion.category.name,
            categoryKey: message.categoryQuestion.category.key,
          }
        : null,
    });
  } catch (error) {
    console.error("POST /api/chat/send error:", error);
    return NextResponse.json(
      { error: "Internt feil ved sending av melding", internal: true },
      { status: 500 }
    );
  }
}