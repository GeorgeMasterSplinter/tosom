/**
 * ToSom — Test-kontoer for betadrift
 * Oppretter test1@tosom.no og test2@tosom.no med passord 1qaz2wsx.
 *
 * Kontoene lages på samme nivå som auto-registreringen (lib/auth/config.ts):
 * User + minimal profil. Onboarding og reisen fylles inn manuelt i UI.
 *
 * Idempotent: eksisterende konto får bare passordet oppdatert,
 * så kontoen alltid logger inn med 1qaz2wsx.
 *
 * Bruk: npx tsx scripts/create-test-accounts.ts
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEST_ACCOUNTS = [
  { email: "test1@tosom.no", name: "Test 1" },
  { email: "test2@tosom.no", name: "Test 2" },
];

const PASSWORD = "1qaz2wsx";

async function main() {
  console.log("🔑 Oppretter ToSom test-kontoer...\n");

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  for (const account of TEST_ACCOUNTS) {
    const existing = await prisma.user.findUnique({
      where: { email: account.email },
      include: { profile: true },
    });

    if (existing) {
      // Idempotent: oppdater passord så kontoen alltid logger inn med 1qaz2wsx
      await prisma.user.update({
        where: { id: existing.id },
        data: { password: hashedPassword, verified: true, role: "USER" },
      });
      console.log(`  ✅ ${account.email} finnes allerede — passord oppdatert`);
    } else {
      const user = await prisma.user.create({
        data: {
          email: account.email,
          name: account.name,
          password: hashedPassword,
          verified: true,
          role: "USER",
        },
      });

      // Minimal profil — samme som auto-registrering (lib/auth/config.ts)
      await prisma.profile
        .create({
          data: {
            userId: user.id,
            age: 25,
            deepProfileStep: "IDENTITY",
          },
        })
        .catch((err) => {
          console.warn(
            `  ⚠️ Kunne ikke opprette profil for ${account.email}:`,
            (err as Error).message
          );
        });

      console.log(`  ✅ ${account.email} opprettet (${account.name})`);
    }
  }

  // ─── Verifisering ────────────────────────────────────────────────────────
  console.log("\n🔎 Verifiserer...\n");

  let allOk = true;

  for (const account of TEST_ACCOUNTS) {
    const user = await prisma.user.findUnique({
      where: { email: account.email },
      include: { profile: true },
    });

    if (!user) {
      console.log(`  ❌ ${account.email}: bruker finnes ikke`);
      allOk = false;
      continue;
    }

    const passwordOk = await bcrypt.compare(PASSWORD, user.password ?? "");
    const profileOk = user.profile !== null;

    console.log(
      `  ${passwordOk ? "✅" : "❌"} ${account.email}: passord OK=${passwordOk}, ` +
        `profil OK=${profileOk}, onboardingComplete=${user.onboardingComplete}`
    );

    if (!passwordOk || !profileOk) allOk = false;
  }

  if (allOk) {
    console.log(
      "\n✅ Ferdig. Logg inn på /login — e-post + passord (1qaz2wsx). " +
        "Onboarding fylles inn i UI."
    );
  } else {
    console.error("\n❌ Verifisering feilet — se loggen over.");
    process.exitCode = 1;
  }
}

main()
  .catch((e) => {
    console.error("Feil ved oppretting av test-kontoer:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
