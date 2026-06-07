// editMessage.ts — redigerer ei eksisterande melding

import prisma from "@/lib/prisma";

/**
 * Redigerer innhaldet i ei melding.
 * Berre avsendar kan redigere.
 */
export async function editMessage(
  messageId: string,
  userId: string,
  newContent: string,
): Promise<{ success: boolean; message?: any; error?: string }> {
  // Finn meldinga
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { senderId: true, conversationId: true, updatedAt: true },
  });

  if (!message) {
    return { success: false, error: "Melding ikkje funnen" };
  }

  // Berre avsendar kan redigere
  if (message.senderId !== userId) {
    return { success: false, error: "Du kan berre redigere eigne meldingar" };
  }

  // Oppdater med editorstempling
  const updated = await prisma.message.update({
    where: { id: messageId },
    data: {
      content: newContent,
      updatedAt: new Date(),
      // Legg til ein "edited"-markør via content
      // Format: <edited>{original}</edited>
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return { success: true, message: updated };
}
