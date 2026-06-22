/**
 * ToSom — Conversation Service
 * 
 * Sentralisert samtalehandsaming.
 */

import { prisma } from '@/lib/prisma';

export interface ConversationWithOtherUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    sender: {
      id: string;
      profile: { identityName: string | null };
    };
  } | null;
  otherUser: {
    id: string;
    email: string;
    identityName: string | null;
    photoUrl: string | null;
  };
}

/**
 * Hent alle samtalar for ein bruker
 */
export async function getUserConversations(userId: string): Promise<ConversationWithOtherUser[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { userAId: userId },
        { userBId: userId },
      ],
    },
    include: {
      userA: {
        select: {
          id: true,
          email: true,
          profile: { select: { identityName: true, photoUrl: true } },
        },
      },
      userB: {
        select: {
          id: true,
          email: true,
          profile: { select: { identityName: true, photoUrl: true } },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' as const },
        include: {
          sender: {
            select: {
              id: true,
              profile: { select: { identityName: true } },
            },
          },
        },
      },
    },
    orderBy: { updatedAt: 'desc' as const },
  });

  const result: ConversationWithOtherUser[] = [];

  for (const convo of conversations) {
    const otherUser = convo.userAId === userId ? convo.userB : convo.userA;
    const otherProfile = otherUser.profile;

    result.push({
      id: convo.id,
      createdAt: convo.createdAt.toISOString(),
      updatedAt: convo.updatedAt.toISOString(),
      lastMessage: convo.messages[0]
        ? {
            id: convo.messages[0].id,
            content: convo.messages[0].content,
            createdAt: convo.messages[0].createdAt.toISOString(),
            senderId: convo.messages[0].senderId,
            sender: {
              id: convo.messages[0].sender.id,
              profile: { identityName: convo.messages[0].sender.profile?.identityName ?? null },
            },
          }
        : null,
      otherUser: {
        id: otherUser.id,
        email: otherUser.email,
        identityName: otherProfile?.identityName ?? null,
        photoUrl: otherProfile?.photoUrl ?? null,
      },
    });
  }

  return result;
}

/**
 * Opprett eller finn eksisterande samtale mellom to brukarar
 */
export async function getOrCreateConversation(userId: string, otherUserId: string) {
  if (userId === otherUserId) {
    throw new Error('CANNOT_CREATE_SAME_USER');
  }

  let convo = await prisma.conversation.findFirst({
    where: {
      OR: [
        { userAId: userId, userBId: otherUserId },
        { userAId: otherUserId, userBId: userId },
      ],
    },
  });

  if (!convo) {
    convo = await prisma.conversation.create({
      data: {
        userAId: userId,
        userBId: otherUserId,
      },
    });
  }

  return convo;
}