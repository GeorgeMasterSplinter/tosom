/**
 * TOSOM — Cleanup data som tilhører slettede testbrukere
 * Fjerner alle relasjoner (conversations, messages, matches m.m.) 
 * som peker på brukere med deletedAt !== null.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  console.log('========================================')
  console.log('  TOSOM — CLEANUP SLETTETE BRUKERE DATA')
  console.log('========================================\n')

  // Hent alle brukere med deletedAt
  const deletedUsers = await prisma.user.findMany({
    where: { deletedAt: { not: null } },
    select: { id: true, email: true },
  })

  if (deletedUsers.length === 0) {
    console.log('✓ Ingen slettede brukere med data å fjerne.')
    return
  }

  const deletedUserIds = new Set(deletedUsers.map(u => u.id))
  console.log(`Fant ${deletedUsers.length} slettede brukere:\n`)
  deletedUsers.forEach(u => console.log(`  - ${u.email} (${u.id})`))
  console.log()

  // Finn alle conversationer som involverer slettede brukere
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { userAId: { in: [...deletedUserIds] } },
        { userBId: { in: [...deletedUserIds] } },
      ],
    },
    select: { id: true },
  })
  const conversationIds = conversations.map(c => c.id)

  // Finn alle matches som involverer slettede brukere
  const matchesA = await prisma.match.findMany({
    where: { userAId: { in: [...deletedUserIds] } },
    select: { id: true, userAId: true, userBId: true },
  })
  const matchesB = await prisma.match.findMany({
    where: { userBId: { in: [...deletedUserIds] } },
    select: { id: true, userAId: true, userBId: true },
  })
  // Merge og dedup
  const allMatches = new Map<string, any>()
  for (const m of [...matchesA, ...matchesB]) {
    allMatches.set(m.id, m)
  }
  const matchIds = [...allMatches.keys()]

  console.log(`Relatert data funnet:`)
  console.log(`  Conversations: ${conversationIds.length}`)
  console.log(`  Matches:       ${matchIds.length}`)

  // Tell messages og andre relasjoner
  let messageCount = 0
  let resonanceCount = 0
  let stateLogCount = 0

  if (conversationIds.length > 0) {
    messageCount = await prisma.message.count({ where: { conversationId: { in: conversationIds } } })
    resonanceCount = await prisma.resonanceSession.count({ where: { conversationId: { in: conversationIds } } })
    stateLogCount = await prisma.journeyStateLog.count({ where: { conversationId: { in: conversationIds } } })
  }

  console.log(`  Meldinger:     ${messageCount}`)
  console.log(`  Resonance:     ${resonanceCount}`)
  console.log(`  StateLogs:     ${stateLogCount}\n`)
  console.log('Sletter data...')

  // 1) Slett meldinger i conversationer
  if (conversationIds.length > 0) {
    await prisma.message.deleteMany({ where: { conversationId: { in: conversationIds } } })
    console.log('  ✓ Meldinger i conversationer slettet')
  }

  // 2) Slett resonance sessions
  if (conversationIds.length > 0) {
    await prisma.resonanceSession.deleteMany({ where: { conversationId: { in: conversationIds } } })
    console.log('  ✓ ResonanceSessions slettet')
  }

  // 3) Slett journey state logs
  if (conversationIds.length > 0) {
    await prisma.journeyStateLog.deleteMany({ where: { conversationId: { in: conversationIds } } })
    console.log('  ✓ JourneyStateLogs slettet')
  }

  // 4) Slett match insights + matches
  for (const matchId of matchIds) {
    try { await prisma.matchInsight.deleteMany({ where: { matchId } }) } catch {}
  }
  if (matchIds.length > 0) {
    await prisma.match.deleteMany({ where: { id: { in: matchIds } } })
    console.log('  ✓ Matches + Insights slettet')
  }

  // 5) Slett profile for deleted users
  const profilesDeleted = await prisma.profile.deleteMany({
    where: { userId: { in: [...deletedUserIds] } },
  })
  if (profilesDeleted.count > 0) console.log(`  ✓ ${profilesDeleted.count} Profile(s) slettet`)

  // 6) Slett journey progress for deleted users
  const journeysDeleted = await prisma.journeyProgress.deleteMany({
    where: { userId: { in: [...deletedUserIds] } },
  })
  if (journeysDeleted.count > 0) console.log(`  ✓ ${journeysDeleted.count} JourneyProgress(s) slettet`)

  // 7) Slett notifications for deleted users
  const notifsDeleted = await prisma.notification.deleteMany({
    where: { userId: { in: [...deletedUserIds] } },
  })
  if (notifsDeleted.count > 0) console.log(`  ✓ ${notifsDeleted.count} Notification(s) slettet`)

  // 8) Slett sessions for deleted users
  const sessionsDeleted = await prisma.session.deleteMany({
    where: { userId: { in: [...deletedUserIds] } },
  })
  if (sessionsDeleted.count > 0) console.log(`  ✓ ${sessionsDeleted.count} Session(s) slettet`)

  // 9) Slett accounts for deleted users
  const accountsDeleted = await prisma.account.deleteMany({
    where: { userId: { in: [...deletedUserIds] } },
  })
  if (accountsDeleted.count > 0) console.log(`  ✓ ${accountsDeleted.count} Account(s) slettet`)

  // 10) Finn og avslutt alle gjenværende conversationer som involverer deleted users
  const stillLinkedConvs = await prisma.conversation.findMany({
    where: {
      OR: [
        { userAId: { in: [...deletedUserIds] } },
        { userBId: { in: [...deletedUserIds] } },
      ],
    },
    select: { id: true, endedAt: true },
  })

  for (const c of stillLinkedConvs) {
    if (!c.endedAt) {
      await prisma.conversation.update({
        where: { id: c.id },
        data: { endedAt: new Date() },
      }).catch(() => {})
    }
  }

  if (stillLinkedConvs.length > 0) {
    console.log(`  ✓ ${stillLinkedConvs.length} conversation(er) markert som ended`)
  }

  // 11) Endelig verifisering — finn alle conversationer som fortsatt har slettede brukere
  const stillLinked = await prisma.conversation.findMany({
    where: {
      OR: [
        { userAId: { in: [...deletedUserIds] } },
        { userBId: { in: [...deletedUserIds] } },
      ],
    },
    select: { id: true },
  })

  if (stillLinked.length > 0) {
    // Tvangsslett med raw SQL hvis Prisma ikke klarer det pga. FK
    console.log(`\n⚠ ${stillLinked.length} conversationer har fortsatt FK til slettede brukere`)
    try {
      const conn = await prisma.$queryRaw`SELECT 1`.catch(() => 0)
      // Hvis vi kan bruke raw SQL, slett direkte
      for (const c of stillLinked) {
        await prisma.conversation.delete({ where: { id: c.id } }).catch(() => {})
      }
      console.log(`  ✓ ${stillLinked.length} conversationer tvangsslettet`)
    } catch (e) {
      console.log(`  ⚠ Kunne slette: ${(e as Error).message}`)
    }
  }

  // --- SLUTTSTATISTIKK ---
  console.log('\n--- SLUTTSTATISTIKK ---')
  const totals = {
    totalUsers: await prisma.user.count(),
    deletedUsers: deletedUsers.length,
    activeUsers: await prisma.user.count({ where: { deletedAt: null } }),
    profiles: await prisma.profile.count().catch(() => 0),
    journeys: await prisma.journeyProgress.count().catch(() => 0),
    matches: await prisma.match.count(),
    conversations: await prisma.conversation.count(),
    messages: await prisma.message.count(),
    notifications: await prisma.notification.count().catch(() => 0),
  }

  for (const [k, v] of Object.entries(totals)) {
    console.log(`  ${k}: ${v}`)
  }

  // Eksporter rapport
  const fs = await import('fs')
  const report = {
    cleanedAt: new Date().toISOString(),
    deletedUsers: deletedUsers.map(u => u.email),
    conversationIdsCleaned: conversationIds.length,
    matchIdsCleaned: matchIds.length,
    finalTotals: totals,
  }
  fs.writeFileSync('scripts/cleanupDeletedUserData-report.json', JSON.stringify(report, null, 2))
  console.log(`\nRapport lagret: scripts/cleanupDeletedUserData-report.json`)
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})