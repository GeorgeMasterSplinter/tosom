/**
 * E2E — Nullstilling av onboarding-brukeren (kjører før hvert
 * onboarding-prosjekt, se beforeAll i onboarding.spec.ts).
 *
 * Full-flow-testen fullfører onboarding for den delte E2E-brukeren
 * (profil + order + kø). Påfølgende prosjekt (firefox) må få en nøytral
 * bruker: ellers pre-fyller /api/onboarding/prefill den fullførte
 * profilen, og validerings-testene måler feil tilstand.
 *
 * Mirrer reset-delen av prisma/seed-e2e-users.ts, i tillegg til at den
 * rydder fullførings-artefakter (profil med strukturede felt, order,
 * journey-progress) fra forrige prosjekt.
 */

import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const E2E_ONBOARDING_EMAIL = 'e2e.onboarding@tosom.dev';

export async function resetOnboardingUser(): Promise<void> {
  const user = await prisma.user.upsert({
    where: { email: E2E_ONBOARDING_EMAIL },
    update: {
      onboardingComplete: false,
      onboardingStep: 1,
      journeyState: 'IDLE',
    },
    create: {
      email: E2E_ONBOARDING_EMAIL,
      name: 'E2E Onboarding',
      role: 'USER',
      onboardingComplete: false,
      onboardingStep: 1,
      journeyState: 'IDLE',
      termsAcceptedAt: new Date(),
      phoneVerified: true,
      verified: true,
    },
  });

  // Nullstill profilen (fullførte strukturede felt + draft) til en minimal
  // profil — som seed-e2e-users lager. Prefill-API-et må ikke se
  // strukturdata. Upsert (ikke delete+create): begge onboarding-prosjektene
  // kjører i parallelle workere, og delete+create racea på unique(userId).
  await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      age: 26,
      firstName: null,
      lastName: null,
      identityName: null,
      lifeSituation: Prisma.DbNull,
      lifestyle: Prisma.DbNull,
      personality: Prisma.DbNull,
      relationshipStyle: null,
      communication: Prisma.DbNull,
      intimacy: Prisma.DbNull,
      futureVision: Prisma.DbNull,
      boundaries: Prisma.DbNull,
      emotionalNeeds: Prisma.DbNull,
      lifeRhythm: null,
      maturityLevel: null,
      securityLevel: null,
      photoUrl: null,
      bio: null,
      interests: [],
      postalCode: null,
      latitude: null,
      longitude: null,
      deepProfileStep: 'IDENTITY',
      deepProfileData: Prisma.DbNull,
      onboardingDraft: Prisma.DbNull,
      preferences: Prisma.DbNull,
      matchTags: [],
      psychometricAnswers: Prisma.DbNull,
      bigFive: Prisma.DbNull,
      attachment: Prisma.DbNull,
      valueProfile: Prisma.DbNull,
      emotionRegulation: Prisma.DbNull,
      psychometricVersion: null,
    },
    create: { userId: user.id, age: 26 },
  });

  // Fullførings-artefakter fra forrige prosjekt/runde.
  await prisma.order.deleteMany({ where: { userId: user.id } });
  await prisma.journeyProgress.deleteMany({ where: { userId: user.id } });

  await prisma.$disconnect();
}