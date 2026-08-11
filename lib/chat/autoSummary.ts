// autoSummary.ts — stub for framtidig auto-conversation summary
// (ingen AI-implementasjon ennå)

import prisma from "@/lib/prisma";

/**
 * Oppsummerer ei conversation med placeholder-text.
 * Framtida: vil bruke AI til å generere eit oppsummeringsuttrekk.
 */
export async function summarizeConversationStub(
  conversationId: string,
): Promise<{ success: boolean; summary?: string; error?: string }> {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      select: { content: true, senderId: true, createdAt: true },
      take: 100,
    });

    const total = messages.length;
    const userMessages = messages.filter((m) => m.senderId !== conversationId);

    // Placeholder — ingen AI
    const summary = `[Stub] Denne samtalen har ${total} meldingar. AI-oppsamling kjem seinare.`;

    return { success: true, summary };
  } catch (error) {
    console.error("[autoSummary] Feil:", error);
    return { success: false, error: "Kunne ikke oppsummere samtalen" };
  }
}
