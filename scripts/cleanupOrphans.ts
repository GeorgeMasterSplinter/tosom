/**
 * TOSOM — Rydd opp i orphan rows
 * Sletter relasjons-data som har mistet sine foreldre-entiteter.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  console.log('========================================')
  console.log('  TOSOM — ORPHAN CLEANUP')
  console.log('========================================\n')

  const stats: Record<string, number> = {}

  // --- HELPER ---
  async function countWhere(model: string, where: any): Promise<number> {
    try {
      if (model === 'Message') return prisma.message.count({ where })
      if (model === 'ResonanceSession') return prisma.resonanceSession.count({ where })
      if (model === 'JourneyStateLog') return prisma.journeyStateLog.count({ where })
      if (model === 'MatchInsight') return prisma.matchInsight.count({ where })
      if (model === 'Match') return prisma.match.count({ where })
      if (model === 'Conversation') return prisma.conversation.count({ where })
      if (model === 'JourneyProgress') return prisma.journeyProgress.count({ where })
      if (model === 'Profile') return prisma.profile.count({ where })
      if (model === 'Notification') return prisma.notification.count({ where })
      return 0
    } catch {
      return 0
    }
  }

  // --- STEP 1: Slett Messages uten gyldig conversationId eller senderId ---
  try {
    const before = await prisma.message.count()
    await prisma.message.deleteMany({
      where: {
        OR: [
          { conversationId: '' },
          { conversationId: null } as any,
          { senderId: '' },
          { senderId: null } as any,
        ],
      },
    })
    const after = await prisma.message.count()
    stats['messages_orphans'] = before - after
  } catch (e) {
    console.log('⚠ Messages orphans:', (e as Error).message)
  }

  // --- STEP 2: Slett ResonanceSession uten gyldig conversationId ---
  try {
    const before = await prisma.resonanceSession.count()
    await prisma.resonanceSession.deleteMany({
      where: {
        OR: [
          { conversationId: '' },
          { conversationId: null } as any,
        ],
      },
    })
    const after = await prisma.resonanceSession.count()
    stats['resonance_sessions_orphans'] = before - after
  } catch (e) {
    console.log('⚠ ResonanceSession orphans:', (e as Error).message)
  }

  // --- STEP 3: Slett JourneyStateLog uten gyldig conversationId ---
  try {
    const before = await prisma.journeyStateLog.count()
    await prisma.journeyStateLog.deleteMany({
      where: {
        OR: [
          { conversationId: '' },
          { conversationId: null } as any,
        ],
      },
    })
    const after = await prisma.journeyStateLog.count()
    stats['journey_state_logs_orphans'] = before - after
  } catch (e) {
    console.log('⚠ JourneyStateLog orphans:', (e as Error).message)
  }

  // --- STEP 4: Slett MatchInsight uten gyldig matchId ---
  try {
    const before = await prisma.matchInsight.count()
    await prisma.matchInsight.deleteMany({
      where: {
        OR: [
          { matchId: '' },
          { matchId: null } as any,
        ],
      },
    })
    const after = await prisma.matchInsight.count()
    stats['match_insights_orphans'] = before - after
  } catch (e) {
    console.log('⚠ MatchInsight orphans:', (e as Error).message)
  }

  // --- STEP 5: Slett Matches uten gyldig userAId eller userBId ---
  try {
    const before = await prisma.match.count()
    await prisma.match.deleteMany({
      where: {
        OR: [
          { userAId: '' },
          { userAId: null } as any,
          { userBId: '' },
          { userBId: null } as any,
        ],
      },
    })
    const after = await prisma.match.count()
    stats['matches_orphans'] = before - after
  } catch (e) {
    console.log('⚠ Match orphans:', (e as Error).message)
  }

  // --- STEP 6: Slett Conversations uten gyldig userAId eller userBId ---
  try {
    const before = await prisma.conversation.count()
    await prisma.conversation.deleteMany({
      where: {
        OR: [
          { userAId: '' },
          { userAId: null } as any,
          { userBId: '' },
          { userBId: null } as any,
        ],
      },
    })
    const after = await prisma.conversation.count()
    stats['conversations_orphans'] = before - after
  } catch (e) {
    console.log('⚠ Conversation orphans:', (e as Error).message)
  }

  // --- STEP 7: Slett JourneyProgress uten gyldig userId ---
  try {
    const before = await prisma.journeyProgress.count()
    await prisma.journeyProgress.deleteMany({
      where: {
        OR: [
          { userId: '' },
          { userId: null } as any,
        ],
      },
    })
    const after = await prisma.journeyProgress.count()
    stats['journey_progress_orphans'] = before - after
  } catch (e) {
    console.log('⚠ JourneyProgress orphans:', (e as Error).message)
  }

  // --- STEP 8: Slett Profile uten gyldig userId ---
  try {
    const before = await prisma.profile.count()
    await prisma.profile.deleteMany({
      where: {
        OR: [
          { userId: '' },
          { userId: null } as any,
        ],
      },
    })
    const after = await prisma.profile.count()
    stats['profiles_orphans'] = before - after
  } catch (e) {
    console.log('⚠ Profile orphans:', (e as Error).message)
  }

  // --- STEP 9: Slett Notifications uten gyldig userId ---
  try {
    const before = await prisma.notification.count()
    await prisma.notification.deleteMany({
      where: {
        OR: [
          { userId: '' },
          { userId: null } as any,
        ],
      },
    })
    const after = await prisma.notification.count()
    stats['notifications_orphans'] = before - after
  } catch (e) {
    console.log('⚠ Notification orphans:', (e as Error).message)
  }

  // --- TOTALT: Slett SystemMessage uten relatert data som er orphan ---
  try {
    const before = await prisma.systemMessage.count()
    // SystemMessage har ingen FK-avhengigheter, så vi beholder dem
    stats['system_messages'] = before
  } catch {
    // Ignore
  }

  // --- OUTPUT ---
  console.log('\n--- OPPRYDDING ---')
  const totalDeleted = Object.values(stats).reduce((sum, v) => sum + v, 0)
  
  for (const [key, count] of Object.entries(stats)) {
    if (count > 0) {
      console.log(`  ${key}: ${count} slettet`)
    }
  }

  console.log(`\nTOTALT SLETTET: ${totalDeleted} orphan rows`)

  // --- VERIFISJON ---
  const totals: Record<string, number> = {}
  try { totals['messages'] = await prisma.message.count() } catch {}
  try { totals['conversations'] = await prisma.conversation.count() } catch {}
  try { totals['matches'] = await prisma.match.count() } catch {}
  try { totals['profiles'] = await prisma.profile.count() } catch {}
  try { totals['journeyProgress'] = await prisma.journeyProgress.count() } catch {}
  try { totals['notifications'] = await prisma.notification.count() } catch {}
  try { totals['users'] = await prisma.user.count() } catch {}

  console.log('\n--- DATABASE STATISTIKK ---')
  for (const [key, count] of Object.entries(totals)) {
    console.log(`  ${key}: ${count}`)
  }

  // Export report
  const fs = await import('fs')
  const report = {
    cleanupAt: new Date().toISOString(),
    deleted: stats,
    totals,
  }
  fs.writeFileSync('scripts/cleanupOrphans-report.json', JSON.stringify(report, null, 2))
  console.log(`\nRapport lagret: scripts/cleanupOrphans-report.json`)
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})