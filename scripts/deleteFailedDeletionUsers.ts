/**
 * TOSOM — Slett brukere som prøvde å slette seg før K-1 ble rettet (G-15)
 *
 * Disse brukerne trodde kontoen var slettet (GDPR art. 17), men den var det
 * ikke fordi kontoslettingen var ødelagt (K-1, rettet i PL-01). Dette skriptet
 * sletter dem fullstendig — nøyaktig samme rekkefølge som
 * /api/settings/delete-account: endJourney (hvis aktiv match) + full cascade.
 *
 * Bruk:
 *   Prøvekjøring (endrer IKKE noe) — default:
 *     npx tsx scripts/deleteFailedDeletionUsers.ts <brukerId> [brukerId ...]
 *     npx tsx scripts/deleteFailedDeletionUsers.ts --file brukere.txt
 *
 *   FAKTISK sletting:
 *     npx tsx scripts/deleteFailedDeletionUsers.ts <brukerId> [...] --apply
 *
 * Regler:
 *   - Ingen ekte bruker-ID-er i koden eller commit. ID-ene kommer fra
 *     kommandolinjen eller en lokal (gitignorert) fil — George henter dem fra
 *     Vercel Logs etter `[delete-account]` (G-15).
 *   - Dry-run er default. `--apply` kreves for endringer.
 *   - MatchHistory, Report og UserBlock beholdes (revisjon/trygghet).
 *     AuditLog beholdes med adminId=null (SetNull).
 */

import { readFileSync } from "fs";
import { prisma } from "@/lib/prisma";

const argv = process.argv.slice(2);
const apply = argv.includes("--apply");
const fileFlag = argv.indexOf("--file");
const fileArg = fileFlag >= 0 ? argv[fileFlag + 1] : undefined;

async function loadIds(): Promise<string[]> {
  let ids: string[];
  if (fileArg) {
    ids = readFileSync(fileArg, "utf8").split(/\s+/).map((s) => s.trim()).filter(Boolean);
  } else {
    ids = argv.filter((a) => !a.startsWith("--"));
  }
  return [...new Set(ids)];
}

function maskEmail(email: string | null | undefined): string {
  if (!email) return "(ingen e-post)";
  const [local, domain] = email.split("@");
  if (!domain || !local) return "***";
  return `${local[0]}${"*".repeat(Math.max(2, local.length - 1))}@${domain}`;
}

/** Teller hva som VIL bli slettet for én bruker — kun lesing, ingen endringer. */
async function dryRunSummary(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });
  if (!user) return { exists: false as const, id: userId };

  const [conversations, activeMatch] = await Promise.all([
    prisma.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      select: { id: true },
    }),
    prisma.match.findFirst({
      where: { status: "active", OR: [{ userAId: userId }, { userBId: userId }] },
      select: { id: true },
    }),
  ]);
  const conversationIds = conversations.map((c) => c.id);
  const messages = conversationIds.length
    ? await prisma.message.count({ where: { conversationId: { in: conversationIds } } })
    : 0;
  const matches = await prisma.match.count({
    where: { OR: [{ userAId: userId }, { userBId: userId }] },
  });

  return {
    exists: true as const,
    id: userId,
    email: maskEmail(user.email),
    createdAt: user.createdAt,
    activeMatchId: activeMatch?.id ?? null,
    conversations: conversationIds.length,
    messages,
    matches,
  };
}

/** Full sletting for én bruker — samme rekkefølge som /api/settings/delete-account. */
async function deleteUser(userId: string): Promise<void> {
  // 1. Aktiv match → endJourney først (sletter samtalen + setter MatchHistory).
  //    Lazy-import slik at en ren dry-run ikke laster lagringsstakket (R2).
  const activeMatch = await prisma.match.findFirst({
    where: { status: "active", OR: [{ userAId: userId }, { userBId: userId }] },
    select: { id: true },
  });
  if (activeMatch) {
    const { endJourney } = await import("@/lib/journey/endJourney");
    await endJourney(activeMatch.id, "early_exit");
  }

  // 2. Full cascade i én transaksjon (FK-rekkefølge, som i rotet).
  await prisma.$transaction(async (tx) => {
    const conversations = await tx.conversation.findMany({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      select: { id: true },
    });
    const conversationIds = conversations.map((c) => c.id);
    if (conversationIds.length > 0) {
      // Samtalens innhold forsvinner med samtalen (begge parters meldinger).
      await tx.message.deleteMany({ where: { conversationId: { in: conversationIds } } });
      await tx.journeyStateLog.deleteMany({ where: { conversationId: { in: conversationIds } } });
      await tx.resonanceSession.deleteMany({ where: { conversationId: { in: conversationIds } } });
      await tx.gameSession.deleteMany({ where: { conversationId: { in: conversationIds } } });
      await tx.conversation.deleteMany({ where: { id: { in: conversationIds } } });
    }

    await tx.profile.deleteMany({ where: { userId } });
    await tx.notification.deleteMany({ where: { userId } });
    await tx.journeyProgress.deleteMany({ where: { userId } });
    await tx.match.deleteMany({ where: { OR: [{ userAId: userId }, { userBId: userId }] } });
    await tx.session.deleteMany({ where: { userId } });
    await tx.account.deleteMany({ where: { userId } });
    await tx.twoFactorSecret.deleteMany({ where: { userId } });
    await tx.passwordResetToken.deleteMany({ where: { userId } });

    // MatchHistory, Report og UserBlock overlever (ingen fremmednøkkel);
    // AuditLog nuller ut adminId (SetNull). User slettes til slutt.
    await tx.user.delete({ where: { id: userId } });
  });
}

async function main(): Promise<void> {
  const ids = await loadIds();
  if (ids.length === 0) {
    console.error("Ingen bruker-ID-er gitt.");
    console.error("Bruk:  npx tsx scripts/deleteFailedDeletionUsers.ts <brukerId> [...] [--apply]");
    console.error("  eller: npx tsx scripts/deleteFailedDeletionUsers.ts --file brukere.txt [--apply]");
    process.exit(1);
  }

  console.log(`Modus: ${apply ? "⚠  --apply (FAKTISK sletting)" : "prøvekjøring (endrer ingenting)"}`);
  console.log(`Brukere: ${ids.length}\n`);

  let deleted = 0;
  let alreadyGone = 0;
  let failed = 0;

  for (const id of ids) {
    try {
      const summary = await dryRunSummary(id);
      if (!summary.exists) {
        console.log(`✓ ${id}: finnes ikke (allerede slettet).`);
        alreadyGone++;
        continue;
      }

      if (!apply) {
        console.log(`· ${id} (${summary.email}, opprettet ${summary.createdAt.toISOString().slice(0, 10)}):`);
        console.log(
          `    samtaler=${summary.conversations} meldinger=${summary.messages} matcher=${summary.matches}` +
            (summary.activeMatchId ? ` aktivMatch=${summary.activeMatchId}` : "")
        );
        continue;
      }

      await deleteUser(id);
      console.log(`✓ ${id}: slettet fullstendig.`);
      deleted++;
    } catch (err) {
      failed++;
      console.error(`✗ ${id}: feil — ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(
    `\nOppsummering: slettet=${deleted} alleredeBorte=${alreadyGone} feilet=${failed} (av ${ids.length})`
  );
  if (!apply) {
    console.log("Dette var EN PRØVEKJØRING — ingenting er slettet. Legg på --apply for å slette.");
  }

  await prisma.$disconnect();
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("Kritisk feil:", e);
  process.exit(1);
});