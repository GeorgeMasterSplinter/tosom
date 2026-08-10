/**
 * TOSOM — Cleanup orphant Conversations
 * Sletter alle conversationer som refererer til slettede/ikke-eksisterende brukere.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  console.log('========================================')
  console.log('  TOSOM — ORPHAN CONVERSATIONS CLEANUP')
  console.log('========================================\n')

  // Hent alle conversationer
  const conversations = await prisma.conversation.findMany({
    select: { id: true, userAId: true, userBId: true },
  })
  console.log(`Totalt conversationer: ${conversations.length}`)

  // Hent alle eksisterende brukere (inkludert slettede)
  const allUsers = await prisma.user.findMany({
    select: { id: true },
  })
  const validUserIds = new Set(allUsers.map(u => u.id))
  console.log(`Eksisterende user-IDs (inkl. slettet): ${validUserIds.size}`)

  // Finn orphant conversations — minst én bruker eksisterer ikke
  const orphanConversations = conversations.filter(
    c => !validUserIds.has(c.userAId) || !validUserIds.has(c.userBId)
  )
  console.log(`Orphan conversationer: ${orphanConversations.length}\n`)

  if (orphanConversations.length === 0) {
    console.log('✓ Ingen orphan conversationer funnet.')
    return
  }

  // Slett alle relaterte data først
  let messagesDeleted = 0
  let resonanceDeleted = 0
  let stateLogsDeleted = 0

  for (const c of orphanConversations) {
    try {
      const m = await prisma.message.count({ where: { conversationId: c.id } })
      messagesDeleted += m
    } catch {}
    try {
      const r = await prisma.resonanceSession.count({ where: { conversationId: c.id } })
      resonanceDeleted += r
    } catch {}
    try {
      const s = await prisma.journeyStateLog.count({ where: { conversationId: c.id } })
      stateLogsDeleted += s
    } catch {}
  }

  console.log(`Forbereder sletting av relatert data:`)
  console.log(`  Meldinger:         ${messagesDeleted}`)
  console.log(`  ResonanceSessions:  ${resonanceDeleted}`)
  console.log(`  JourneyStateLogs:   ${stateLogsDeleted}\n`)

  // Fjern relasjoner i riktig rekkefølge
  const orphanIds = orphanConversations.map(c => c.id)

  await prisma.message.deleteMany({
    where: { conversationId: { in: orphanIds } },
  })
  console.log('✓ Meldinger slettet')

  await prisma.resonanceSession.deleteMany({
    where: { conversationId: { in: orphanIds } },
  })
  console.log('✓ ResonanceSessions slettet')

  await prisma.journeyStateLog.deleteMany({
    where: { conversationId: { in: orphanIds } },
  })
  console.log('✓ JourneyStateLogs slettet')

  // Til slutt slett conversationer selv
  await prisma.conversation.deleteMany({
    where: { id: { in: orphanIds } },
  })
  console.log(`✓ ${orphanIds.length} orphant conversations slettet`)

  // Verifiser
  const remaining = await prisma.conversation.count()
  console.log(`\nConversationer gjenstår: ${remaining}`)

  // Total DB-statistikk
  const totals = {
    users: await prisma.user.count(),
    profiles: await prisma.profile.count().catch(() => 0),
    journeys: await prisma.journeyProgress.count().catch(() => 0),
    matches: await prisma.match.count(),
    conversations: remaining,
    messages: await prisma.message.count(),
    notifications: await prisma.notification.count().catch(() => 0),
  }

  console.log('\n--- SLUTT-STATISTIKK ---')
  for (const [k, v] of Object.entries(totals)) {
    console.log(`  ${k}: ${v}`)
  }

  // Eksporter rapport
  const fs = await import('fs')
  const report = {
    cleanedAt: new Date().toISOString(),
    orphanConversationsDeleted: orphanIds.length,
    relatedDataDeleted: { messages: messagesDeleted, resonanceSessions: resonanceDeleted, journeyStateLogs: stateLogsDeleted },
    finalTotals: totals,
  }
  fs.writeFileSync('scripts/cleanupOrphanConversations-report.json', JSON.stringify(report, null, 2))
  console.log(`\nRapport lagret: scripts/cleanupOrphanConversations-report.json`)
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})