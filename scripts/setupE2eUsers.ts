/**
 * TOSOM — Opprett E2E-testbrukere og rens databasen
 * 
 * - Fjerner ALLE gamle testbrukere (Ane, Magnus, test1/2/3, etc.)
 * - Oppretter kun testA@tosom.dev + testB@tosom.dev + admin@tosom.dev
 * - Begge testbrukere har full profil med deep profile data for matching
 */

import { prisma } from "@/lib/prisma"

// Emailer som brukes til testing og skal fjernes
const OLD_TEST_EMAILS = [
  'test1@tosom.no',
  'test2@tosom.no',
  'test3@tosom.no',
  'ane@tosom.no',
  'magnus@tosom.no',
  'ane@tosom.dev',
  'magnus@tosom.dev',
  'bulk@tosom.com',
];

async function main() {
  console.log('========================================')
  console.log('  TOSOM — E2E DATABASE RESET')
  console.log('========================================\n')

  // --- STEG 1: Fjern alle gamle testbrukere ---
  console.log('--- Steg 1: Fjern gamle testbrukere ---')
  for (const email of OLD_TEST_EMAILS) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      // Slett i riktig rekkefølge for å unngå FK-feil
      await prisma.matchInsight.deleteMany({
        where: { match: { userAId: user.id } },
      })
      await prisma.matchInsight.deleteMany({
        where: { match: { userBId: user.id } },
      })
      await prisma.match.deleteMany({
        where: { OR: [{ userAId: user.id }, { userBId: user.id }] },
      })
      // FK: ResonanceSession -> Conversation, JourneyStateLog -> Conversation
      const conv = await prisma.conversation.findMany({
        where: { OR: [{ userAId: user.id }, { userBId: user.id }] },
        select: { id: true },
      })
      for (const c of conv) {
        await prisma.resonanceSession.deleteMany({ where: { conversationId: c.id } })
        await prisma.journeyStateLog.deleteMany({ where: { conversationId: c.id } })
        await prisma.message.deleteMany({ where: { conversationId: c.id } })
      }
      await prisma.conversation.deleteMany({
        where: { OR: [{ userAId: user.id }, { userBId: user.id }] },
      })
      // FK: JourneyMilestone -> JourneyProgress
      const jp = await prisma.journeyProgress.findUnique({ where: { userId: user.id } })
      if (jp) {
        await prisma.journeyMilestone.deleteMany({ where: { progressId: jp.id } })
      }
      await prisma.journeyProgress.deleteMany({ where: { userId: user.id } })
      await prisma.message.deleteMany({ where: { senderId: user.id } })
      await prisma.notification.deleteMany({ where: { userId: user.id } })
      await prisma.session.deleteMany({ where: { userId: user.id } })
      await prisma.profile.deleteMany({ where: { userId: user.id } })
      await prisma.user.delete({ where: { id: user.id } })
      console.log(`  Slettet: ${email}`)
    }
  }

  // --- STEG 2: Nullstill alle matches, conversations og journeys ---
  console.log('\n--- Steg 2: Nullstill matches og conversations ---')
  const matchCount = await prisma.match.count()
  const convCount = await prisma.conversation.count()
  if (matchCount > 0) {
    await prisma.match.deleteMany({ where: {} })
    console.log(`  Slettet ${matchCount} matches`)
  }
  if (convCount > 0) {
    await prisma.conversation.deleteMany({ where: {} })
    console.log(`  Slettet ${convCount} conversations`)
  }

  // --- STEG 3: Slett milestones før journeys (foreign key constraint) ---
  const milestoneCount = await prisma.journeyMilestone.count()
  if (milestoneCount > 0) {
    await prisma.journeyMilestone.deleteMany({ where: {} })
    console.log(`  Slettet ${milestoneCount} journey milestones`)
  }
  const stateLogCount = await prisma.journeyStateLog.count()
  if (stateLogCount > 0) {
    await prisma.journeyStateLog.deleteMany({ where: {} })
    console.log(`  Slettet ${stateLogCount} journey state logs`)
  }
  const resonanceCount = await prisma.resonanceSession.count()
  if (resonanceCount > 0) {
    await prisma.resonanceSession.deleteMany({ where: {} })
    console.log(`  Slettet ${resonanceCount} resonance sessions`)
  }
  const journeyCount = await prisma.journeyProgress.count()
  if (journeyCount > 0) {
    await prisma.journeyProgress.deleteMany({ where: {} })
    console.log(`  Slettet ${journeyCount} journey progress records`)
  }

  // --- STEG 4: Opprett E2E-brukere fra scratch ---
  console.log('\n--- Steg 3: Opprett E2E-brukere ---')

  // Slett eksisterende E2E-brukere hvis de finnes
  for (const email of ['testA@tosom.dev', 'testB@tosom.dev', 'admin@tosom.dev']) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      await prisma.match.deleteMany({
        where: { OR: [{ userAId: existing.id }, { userBId: existing.id }] },
      })
      await prisma.conversation.deleteMany({
        where: { OR: [{ userAId: existing.id }, { userBId: existing.id }] },
      })
      await prisma.journeyProgress.deleteMany({ where: { userId: existing.id } })
      await prisma.message.deleteMany({ where: { senderId: existing.id } })
      await prisma.notification.deleteMany({ where: { userId: existing.id } })
      await prisma.session.deleteMany({ where: { userId: existing.id } })
      await prisma.profile.deleteMany({ where: { userId: existing.id } })
      await prisma.user.delete({ where: { id: existing.id } })
      console.log(`  Renset eksisterende: ${email}`)
    }
  }

  // --- OPPRETT TESTBRUKER A ---
  const testA = await prisma.user.create({
    data: {
      email: 'testA@tosom.dev',
      password: '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890',
      name: 'Test Bruker A',
      role: 'USER' as const,
      verified: true,
      onboardingComplete: true,
      deepProfileComplete: true,
    },
  })
  console.log(`  Opprettet testA (id: ${testA.id})`)

  await prisma.profile.create({
    data: {
      userId: testA.id,
      firstName: 'Test',
      lastName: 'Bruker A',
      age: 28,
      identityName: 'Test A',
      bio: 'Jeg er en rolig og reflektert person som verdener dype samtaler og ærlighet.',
      interests: ['musikk', 'natur', 'litteratur', 'filosofi'],
      matchTags: ['rolig', 'dyptgående', 'empatisk', 'moden'],
      deepProfileStep: 'SUMMARY' as any,
      lifeSituation: {
        career: 'etablert karriere',
        familyStatus: 'singel',
        location: 'storby',
      },
      lifestyle: {
        activityLevel: 'moderat',
        socialPattern: 'balansert',
        workLifeBalance: 'god',
      },
      personality: {
        temperament: 'rolig',
        emotionalAwareness: 'høy',
        openness: 'åpen',
      },
      communication: {
        style: 'direkte og ærlig',
        conflictHandling: 'dialog',
        listeningStyle: 'aktiv lytter',
      },
      intimacy: {
        pace: 'rolig tempo',
        vulnerability: 'moderat',
        physicalConnection: 'viktig',
      },
      futureVision: {
        relationshipGoal: 'langvarig relasjon',
        familyWishes: 'åpen for familie',
        lifeDirection: 'stabil og meningsfull',
      },
      boundaries: {
        dealBreakers: ['urolighet', 'uærlighet'],
        comfortZones: ['dybde', 'trygghet', 'respekt'],
      },
      emotionalNeeds: {
        primaryNeeds: ['trygghet', 'kjærlighet', 'respekt'],
        loveLanguage: 'ord og handlinger',
      },
    },
  })

  // --- OPPRETT TESTBRUKER B ---
  const testB = await prisma.user.create({
    data: {
      email: 'testB@tosom.dev',
      password: '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890',
      name: 'Test Bruker B',
      role: 'USER' as const,
      verified: true,
      onboardingComplete: true,
      deepProfileComplete: true,
    },
  })
  console.log(`  Opprettet testB (id: ${testB.id})`)

  await prisma.profile.create({
    data: {
      userId: testB.id,
      firstName: 'Test',
      lastName: 'Bruker B',
      age: 30,
      identityName: 'Test B',
      bio: 'Jeg er en nysgjerrig og moden person som verdsetter trygghet og dype forbindelser.',
      interests: ['musikk', 'reise', 'koking', 'natur'],
      matchTags: ['moden', 'ærlig', 'nysgjerrig', 'rolig'],
      deepProfileStep: 'SUMMARY' as any,
      lifeSituation: {
        career: 'stabil karriere',
        familyStatus: 'singel',
        location: 'by',
      },
      lifestyle: {
        activityLevel: 'moderat',
        socialPattern: 'balansert',
        workLifeBalance: 'god',
      },
      personality: {
        temperament: 'nysgjerrig',
        emotionalAwareness: 'høy',
        openness: 'åpen',
      },
      communication: {
        style: 'varm og direkte',
        conflictHandling: 'dialog',
        listeningStyle: 'empatisk lytter',
      },
      intimacy: {
        pace: 'rolig tempo',
        vulnerability: 'moderat',
        physicalConnection: 'viktig',
      },
      futureVision: {
        relationshipGoal: 'langvarig relasjon',
        familyWishes: 'ønsker familie',
        lifeDirection: 'meningsfull og stabil',
      },
      boundaries: {
        dealBreakers: ['overflate', 'urolighet'],
        comfortZones: ['trygghet', 'ærlighet', 'dybde'],
      },
      emotionalNeeds: {
        primaryNeeds: ['respekt', 'kjærlighet', 'trygghet'],
        loveLanguage: 'tid og ord',
      },
    },
  })

  // --- OPPRETT ADMIN-BRUKER ---
  const admin = await prisma.user.create({
    data: {
      email: 'admin@tosom.dev',
      password: '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890',
      name: 'Admin Bruker',
      role: 'ADMIN' as const,
      verified: true,
      onboardingComplete: true,
      deepProfileComplete: true,
    },
  })

  await prisma.profile.create({
    data: {
      userId: admin.id,
      firstName: 'Admin',
      lastName: 'Bruker',
      age: 35,
      identityName: 'Admin',
      bio: 'Plattform-administrator.',
      interests: ['utvikling'],
      matchTags: ['admin'],
      deepProfileStep: 'SUMMARY' as any,
    },
  })
  console.log(`  Opprettet admin (id: ${admin.id})`)

  // --- SLUTTSTATUS ---
  console.log('\n--- SLUTTSTATUS ---')
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      verified: true,
      onboardingComplete: true,
      deepProfileComplete: true,
    },
  })

  console.log(`\nTotalt brukere i DB: ${allUsers.length}`)
  for (const u of allUsers) {
    console.log(`  ${u.email} | ${u.name} | role: ${u.role} | onboarding: ${u.onboardingComplete} | deepProfile: ${u.deepProfileComplete}`)
  }

  const totalMatches = await prisma.match.count()
  const totalConversations = await prisma.conversation.count()
  console.log(`\nMatches i DB: ${totalMatches}`)
  console.log(`Conversations i DB: ${totalConversations}`)

  // Eksporter report
  const fs = await import('fs')
  const report = {
    createdAt: new Date().toISOString(),
    users: allUsers.map(u => ({ email: u.email, id: u.id, role: u.role })),
    matches: totalMatches,
    conversations: totalConversations,
  }
  fs.writeFileSync('scripts/setupE2eUsers-report.json', JSON.stringify(report, null, 2))
  console.log(`\n✅ Rapport lagret: scripts/setupE2eUsers-report.json`)
  console.log('\n========================================')
  console.log('  E2E DATABASE RESET FULLFØRT')
  console.log('========================================')
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})