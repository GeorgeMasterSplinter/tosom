#!/usr/bin/env tsx
/**
 * ToSom — Reset test users onboarding
 * Kjører: npx tsx scripts/reset-test-users.ts
 * 
 * Resetter onboardingComplete for alle testbrukere til false.
 * Dette gjør at testbrukere havner i onboarding igjen ved neste innlogging.
 */

import { prisma } from '../lib/prisma';

const TEST_EMAILS = [
  'test1@tosom.no',
  'test2@tosom.no',
  'test3@tosom.no',
];

async function resetTestUsers() {
  console.log('🔄 Resetter testbrukere...\n');

  for (const email of TEST_EMAILS) {
    try {
      // Oppdater eksisterende bruker eller opprett ny
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          onboardingComplete: false,
          deepProfileComplete: false,
          onboardingStep: 1,
        },
        create: {
          email,
          role: 'USER',
          onboardingComplete: false,
          deepProfileComplete: false,
          onboardingStep: 1,
        },
      });

      // Slett profil hvis eksisterende
      await prisma.profile.deleteMany({
        where: { userId: user.id },
      });

      console.log(`✅ ${email} — onboardingComplete satt til false`);
    } catch (error) {
      console.error(`❌ Feil på ${email}:`, error);
    }
  }

  console.log('\n✅ Alle testbrukere er resatt.');
  console.log('\nNå kan du teste:');
  console.log('  1. Gå til /login');
  console.log('  2. Klikk "Logg inn som testbruker"');
  console.log('  3. Du skal havne på /onboarding\n');

  await prisma.$disconnect();
}

resetTestUsers().catch((error) => {
  console.error(error);
  process.exit(1);
});