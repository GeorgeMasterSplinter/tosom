/**
 * TOSOM — Liste alle brukere i databasen
 * Auditor og identifiser testbrukere vs ekte brukere.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  const users = await prisma.user.findMany({
    include: {
      profile: true,
      journey: true,
      matchesA: true,
      matchesB: true,
      conversationsA: true,
      conversationsB: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  const testPatterns = ['test', 'demo', 'dev@', 'local']
  const testUsers = users.filter(u => testPatterns.some(p => u.email?.toLowerCase().includes(p)))
  const realUsers = users.filter(u => !testUsers.includes(u))

  console.log('========================================')
  console.log('  TOSOM — BRUKERAUDIT')
  console.log('========================================')
  console.log(`\nTOTALT ANTALL BRUKERE: ${users.length}`)
  console.log(`TESTBRUKERE:           ${testUsers.length}`)
  console.log(`EKTE BRUKERE:          ${realUsers.length}\n`)

  // --- TESTBRUKERE ---
  if (testUsers.length > 0) {
    console.log('--- TESTBRUKERE ---')
    for (const u of testUsers) {
      const matchCount = (u.matchesA?.length ?? 0) + (u.matchesB?.length ?? 0)
      const convCount = (u.conversationsA?.length ?? 0) + (u.conversationsB?.length ?? 0)
      console.log(`  ${u.email}`)
      console.log(`    onboardingComplete: ${u.onboardingComplete}`)
      console.log(`    deepProfileComplete: ${u.deepProfileComplete}`)
      console.log(`    profile: ${!!u.profile} | journey: ${!!u.journey}`)
      console.log(`    matches: ${matchCount} | conversations: ${convCount}`)
      console.log(`    role: ${u.role} | verified: ${u.verified}`)
      console.log(`    createdAt: ${u.createdAt.toISOString().split('T')[0]}\n`)
    }
  } else {
    console.log('--- TESTBRUKERE: INGEN ---\n')
  }

  // --- EKTE BRUKERE ---
  if (realUsers.length > 0) {
    console.log('--- EKTE BRUKERE ---')
    for (const u of realUsers) {
      const matchCount = (u.matchesA?.length ?? 0) + (u.matchesB?.length ?? 0)
      const convCount = (u.conversationsA?.length ?? 0) + (u.conversationsB?.length ?? 0)
      console.log(`  ${u.email}`)
      console.log(`    onboardingComplete: ${u.onboardingComplete}`)
      console.log(`    deepProfileComplete: ${u.deepProfileComplete}`)
      console.log(`    profile: ${!!u.profile} | journey: ${!!u.journey}`)
      console.log(`    matches: ${matchCount} | conversations: ${convCount}`)
      console.log(`    role: ${u.role} | verified: ${u.verified}`)
      console.log(`    createdAt: ${u.createdAt.toISOString().split('T')[0]}\n`)
    }
  } else {
    console.log('--- EKTE BRUKERE: INGEN ---\n')
  }

  // JSON-export
  const fs = await import('fs')
  const report = {
    total: users.length,
    testCount: testUsers.length,
    realCount: realUsers.length,
    testUsers: testUsers.map(u => ({
      email: u.email,
      id: u.id,
      onboardingComplete: u.onboardingComplete,
      deepProfileComplete: u.deepProfileComplete,
      hasProfile: !!u.profile,
      hasJourney: !!u.journey,
      matchCount: (u.matchesA?.length ?? 0) + (u.matchesB?.length ?? 0),
      conversationCount: (u.conversationsA?.length ?? 0) + (u.conversationsB?.length ?? 0),
      role: u.role,
      verified: u.verified,
      createdAt: u.createdAt.toISOString(),
    })),
    realUsers: realUsers.map(u => ({
      email: u.email,
      id: u.id,
      onboardingComplete: u.onboardingComplete,
      deepProfileComplete: u.deepProfileComplete,
      hasProfile: !!u.profile,
      hasJourney: !!u.journey,
      matchCount: (u.matchesA?.length ?? 0) + (u.matchesB?.length ?? 0),
      conversationCount: (u.conversationsA?.length ?? 0) + (u.conversationsB?.length ?? 0),
      role: u.role,
      verified: u.verified,
      createdAt: u.createdAt.toISOString(),
    })),
    auditedAt: new Date().toISOString(),
  }

  fs.writeFileSync('scripts/testUsers-audit.json', JSON.stringify(report, null, 2))
  console.log(`\nRapport lagret: scripts/testUsers-audit.json`)
}

main().catch(e => {
  console.error('FEIL:', e)
  process.exit(1)
})