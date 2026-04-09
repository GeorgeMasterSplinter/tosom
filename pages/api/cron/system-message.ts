import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const now = new Date();

  const matches = await prisma.match.findMany({
    include: {
      user: true,
      matchUser: true,
    },
  });

  for (const m of matches) {
    const chatUntil = new Date(m.chatUntil);
    const diffDays = Math.ceil((chatUntil - now) / (1000 * 60 * 60 * 24));

    // 14-dagers varsel
    if (diffDays === 14) {
      await prisma.systemMessage.create({
        data: {
          userId: m.userId,
          matchId: m.id,
          type: "14_day_warning",
          content: "Du har 14 dager igjen av chat-fasen.",
        },
      });
    }

    // 7-dagers varsel
    if (diffDays === 7) {
      await prisma.systemMessage.create({
        data: {
          userId: m.userId,
          matchId: m.id,
          type: "7_day_warning",
          content: "Du har 7 dager igjen av chat-fasen.",
        },
      });
    }

    // 1-dags varsel
    if (diffDays === 1) {
      await prisma.systemMessage.create({
        data: {
          userId: m.userId,
          matchId: m.id,
          type: "1_day_warning",
          content: "Chatten avsluttes i morgen.",
        },
      });
    }

    // Chat avsluttet
    if (now > chatUntil) {
      await prisma.systemMessage.create({
        data: {
          userId: m.userId,
          matchId: m.id,
          type: "chat_closed",
          content: "Chatten er nå avsluttet. Gå til dashboardet for å ta et valg.",
        },
      });
    }

    // Partner har valgt JA
    if (m.decision_userA === "YES" && m.decision_userB === null) {
      await prisma.systemMessage.create({
        data: {
          userId: m.matchUserId,
          matchId: m.id,
          type: "partner_yes",
          content: "Matchen din har valgt JA. Du kan nå ta ditt valg.",
        },
      });
    }

    // Partner har valgt NEI
    if (m.decision_userA === "NO" && m.decision_userB === null) {
      await prisma.systemMessage.create({
        data: {
          userId: m.matchUserId,
          matchId: m.id,
          type: "partner_no",
          content: "Matchen din har valgt NEI. Matchen er avsluttet.",
        },
      });
    }
  }

  res.json({ ok: true });
}
