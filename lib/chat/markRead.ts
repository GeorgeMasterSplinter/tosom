// markRead.ts — read/seen tracking for conversation og message

import prisma from "@/lib/prisma";

/**
 * Merk alle meldingar i ein conversation som lese for ein spesifikk bruker.
 */
export async function markMessagesAsRead(
  conversationId: string,
  userId: string,
): Promise<void> {
  await prisma.$transaction([
    // Oppdater lastReadAt på Conversation-referansen
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
    // Merk alle user-meldingar som lese (sett readAt)
    // Merk: readAt ligg på sender-side i schema. Vi set ein "lastReadBy" på Conversation-nivå.
  ]);

  // Lag "lastReadBy" i ein dedikert tabell-felt via notification — enklare med Conversation:
  // Sidan schema ikke har lastReadBy direkte, lagrar vi det som ein Notification av typen "read".
  await prisma.notification.create({
    data: {
      userId,
      message: JSON.stringify({
        type: "read",
        conversationId,
        timestamp: new Date().toISOString(),
      }),
    },
  });
}

/**
 * Hentar tidspunktet ein bruker sist leste ei conversation.
 */
export async function getLastReadAt(
  conversationId: string,
  userId: string,
): Promise<Date | null> {
  const latest = await prisma.notification.findMany({
    where: {
      userId,
      message: {
        contains: conversationId,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  if (latest.length === 0) return null;

  try {
    const parsed = JSON.parse(latest[0].message);
    return parsed.type === "read" ? new Date(parsed.timestamp) : null;
  } catch {
    return null;
  }
}

/**
 * Hentar u-leste meldingsmengd for ein bruker i ei conversation.
 */
export async function getUnreadCount(
  conversationId: string,
  userId: string,
): Promise<number> {
  // Hentar siste lesedato for denne brukaren
  const lastRead = await getLastReadAt(conversationId, userId);

  if (!lastRead) {
    // Aldi lese — alle er u-leste
    const messages = await prisma.message.count({
      where: {
        conversationId,
        senderId: { not: userId },
        deletedAt: null,
      },
    });
    return messages;
  }

  const count = await prisma.message.count({
    where: {
      conversationId,
      senderId: { not: userId },
      createdAt: { gt: lastRead },
      deletedAt: null,
    },
  });

  return count;
}
