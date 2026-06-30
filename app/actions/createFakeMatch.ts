/**
 * ToSom — Fake Match Server Action
 * Lager ein dummy-brukar og conversation for testing.
 */

"use server";

import prisma from "@/lib/prisma";

export async function createFakeMatch() {
  // Opprett eller hent eksisterande testbrukar (userA)
  let userA = await prisma.user.findFirst({
    where: { email: { startsWith: "test@" } },
    select: { id: true },
  });

  if (!userA) {
    // Opprett testbrukar om ingen finst
    const created = await prisma.user.create({
      data: {
        id: "1",
        email: "test@tosom.no",
        createdAt: new Date(),
        profile: {
          create: {
            identityName: "Testbrukar A",
            age: 30,
            bio: "Testbrukar for matching",
            interests: ["Utvikling", "AI"],
            matchTags: [],
          },
        },
      },
      select: { id: true },
    });
    userA = created;
  }

  // Opprett dummy-brukar for match (userB)
  let userB = await prisma.user.upsert({
    where: { id: "999" },
    update: {},
    create: {
      id: "999",
      email: "test999@tosom.no",
      createdAt: new Date(),
      profile: {
        create: {
          identityName: "Testbrukar B",
          age: 28,
          bio: "Testbrukar for matching",
          interests: ["Musikk", "Reiser"],
          matchTags: [],
        },
      },
    },
    select: { id: true },
  });

  // Opprett conversation
  const convo = await prisma.conversation.create({
    data: {
      userAId: userA.id,
      userBId: userB.id,
    },
  });

  // Opprett første melding frå userA
  await prisma.message.create({
    data: {
      conversationId: convo.id,
      senderId: userA.id,
      content: "Hei! Dette er ein test-samtale 😊",
      type: "user",
    },
  });

  // Opprett next-auth session for userA (dev kun)
  const existingSession = await prisma.session.findFirst({
    where: { userId: userA.id },
    select: { id: true },
  });

  if (!existingSession) {
    await prisma.session.create({
      data: {
        id: `dev-session-${userA.id}`,
        userId: userA.id,
        sessionToken: "dev-session-token-" + userA.id,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
  }

  // Oppdater også account for NextAuth adapter
  await prisma.account.upsert({
    where: {
      provider_providerAccountId: {
        provider: "credentials",
        providerAccountId: userA.id,
      },
    },
    create: {
      id: `dev-account-${userA.id}`,
      userId: userA.id,
      type: "credentials",
      provider: "credentials",
      providerAccountId: userA.id,
      access_token: "dev-token",
      refresh_token: "dev-refresh",
      expires_at: Math.floor(Date.now() / 1000) + 86400,
      token_type: "Bearer",
      scope: "read write",
    },
    update: {
      access_token: "dev-token",
      refresh_token: "dev-refresh",
      expires_at: Math.floor(Date.now() / 1000) + 86400,
    },
  });

  console.log("FAKE MATCH CREATED:", { userAId: userA.id, userBId: userB.id, convoId: convo.id });

  return convo.id;
}