// deleteMessage.ts — mjuk sletting av melding via deletedAt-felt

import prisma from "@/lib/prisma";

/**
 * Slett ei melding (mjuk sletting — set deletedAt).
 * Berre avsendar eller ein av conversation-partane kan slette.
 */
export async function deleteMessage(
  messageId: string,
  userId: string,
): Promise<{ success: boolean; message?: any; error?: string }> {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { senderId: true, conversationId: true, deletedAt: true },
  });

  if (!message) {
    return { success: false, error: "Melding ikkje funnen" };
  }

  if (message.deletedAt) {
    return { success: false, error: "Meldinga er allereie sletta" };
  }

  // Berre avsendar kan slette
  if (message.senderId !== userId) {
    return { success: false, error: "Du kan berre slette eigne meldingar" };
  }

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: { deletedAt: new Date() },
    include: {
      sender: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return { success: true, message: updated };
}
