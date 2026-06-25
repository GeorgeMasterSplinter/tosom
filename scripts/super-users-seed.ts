/**
 * ToSom — Seed Admin-brukarar for Testing
 * 
 * Opprettar 4 admin-brukarar brukt for utvikling og testing.
 * 
 * Bruk: npx ts-node scripts/super-users-seed.ts
 * 
 * Brukarar (alltid test1234):
 *   super1@tosom.test / test1234
 *   super2@tosom.test / test1234
 *   super3@tosom.test / test1234
 *   super4@tosom.test / test1234
 */

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const SUPER_USERS = [
  { email: 'super1@tosom.test', password: 'test1234' },
  { email: 'super2@tosom.test', password: 'test1234' },
  { email: 'super3@tosom.test', password: 'test1234' },
  { email: 'super4@tosom.test', password: 'test1234' },
];

async function main() {
  console.log('\n[SEED] Opprettar admin-brukarar...');

  for (const user of SUPER_USERS) {
    const emailLower = user.email.toLowerCase();

    // Finn eksisterande brukar
    const existing = await prisma.user.findFirst({
      where: { email: emailLower },
    });

    if (existing) {
      console.log(`  - [OPPDATER] ${emailLower}`);

      await prisma.user.update({
        where: { id: existing.id },
        data: {
          role: 'ADMIN' as Role,
          password: user.password, // I produktion: bcrypt.hashSync(password, 12)
          verified: true,
          phoneVerified: true,
        },
      });
    } else {
      console.log(`  - [OPPRETT] ${emailLower}`);

      await prisma.user.create({
        data: {
          email: emailLower,
          password: user.password, // I produktion: bcrypt.hashSync(password, 12)
          role: 'ADMIN' as Role,
          verified: true,
          phoneVerified: true,
          phone: `+470000000${SUPER_USERS.indexOf(user) + 1}`,
          onboardingComplete: true,
          deepProfileComplete: true,
        },
      });
    }
  }

  console.log('\n[SEED] Admin-brukarar klare!\n');
  console.log('Innloggingsdetaljar:');
  for (const user of SUPER_USERS) {
    console.log(`  E-post: ${user.email} | Passord: ${user.password}`);
  }
  console.log('');
}

main()
  .catch((e) => {
    console.error('[FEIL] Seed feila:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
