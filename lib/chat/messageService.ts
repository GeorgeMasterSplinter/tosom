/**
 * ToSom — Message Service
 * 
 * Sentralisert meldingshandsaming med Pusher-sanntid.
 */

import { prisma } from '@/lib/prisma';
import { getPusherServer, triggerConversationUpdated } from '@/lib/pusher/server';

export interface MessagePayload {
  conversationId: string;
  senderId: string;
  content: string;
}

/**
 * Send melding — lagrar i DB + trigger Pusher
 */
export async function sendMessage(payload: MessagePayload) {
  const { conversationId, senderId, content } = payload;

  // Verifiser at samtalen eksisterer og brukaren har tilgang
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userAId: true, userBId: true },
  });

  if (!convo || (convo.userAId !== senderId && convo.userBId !== senderId)) {
    throw new Error('UNAUTHORIZED');
  }

  // Lagre melding i databasen
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          profile: { select: { identityName: true } },
        },
      },
      categoryQuestion: {
        select: {
          id: true,
          text: true,
          category: {
            select: {
              name: true,
              key: true,
              icon: true,
            },
          },
        },
      },
    },
  });

  // Oppdater updatedAt på samtalen
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  // Trigger Pusher — ny melding
  const pusher = getPusherServer();
  await pusher.trigger(`conversation-${conversationId}`, 'new-message', message);

  // Trigger Pusher — conversation oppdatert for mottakar
  const receiverId = convo.userAId === senderId ? convo.userBId : convo.userAId;
  await triggerConversationUpdated(receiverId, conversationId);

  return message;
}

/**
 * Hent meldingar for ei samtale
 */
export async function getMessages(conversationId: string, userId: string) {
  const convo = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { userAId: true, userBId: true },
  });

  if (!convo || (convo.userAId !== userId && convo.userBId !== userId)) {
    throw new Error('UNAUTHORIZED');
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' as const },
    include: {
      sender: {
        select: {
          id: true,
          profile: { select: { identityName: true } },
        },
      },
      categoryQuestion: {
        select: {
          id: true,
          text: true,
          category: {
            select: {
              name: true,
              key: true,
              icon: true,
            },
          },
        },
      },
    },
  });

  return messages;
}