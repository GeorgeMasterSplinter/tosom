// media.ts — bildeopplasting via UploadThing og meldingstype "image"

import prisma from "@/lib/prisma";

/**
 * Opprettar ei bilde-melding etter opplasting.
 */
export async function createImageMessage(
  conversationId: string,
  senderId: string,
  imageUrl: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content: imageUrl,
        type: "image",
      },
    });
    return { success: true, messageId: message.id };
  } catch (error) {
    console.error("[media] Feil ved oppretting av bilde-melding:", error);
    return { success: false, error: "Kunne ikke sende bilde" };
  }
}

/**
 * Validerer at ein bruker kan sende bilde i ei conversation.
 */
export function canSendImage(conversationAgeHours: number): boolean {
  // Bilete tillate etter 24 timar i conversationen (kan konfigurerast seinare)
  return conversationAgeHours >= 24;
}

/**
 * Hentar bilde-URL frå ei melding dersom typen er "image".
 */
export function getMediaUrl(message: { type: string; content: string }): string | null {
  if (message.type !== "image") return null;
  return message.content;
}
