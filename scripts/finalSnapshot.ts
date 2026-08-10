/**
 * TOSOM — Final Platform Snapshot
 */

import { prisma } from "@/lib/prisma"
import fs from "fs"

async function main() {
  console.log('========================================')
  console.log('  TOSOM — FINAL SNAPSHOT')
  console.log('========================================\n')

  // --- USERS ---
  const allUsers = await prisma.user.findMany({
    where: { deletedAt: null },
    select: { id: true, email: true, name: true, role: true, verified: true, onboardingComplete: true, deepProfileComplete: true },
  })

  // --- DB STATS ---
  const stats = {
    totalUsers: allUsers.length,
    activeUsers: allUsers.length,
    deletedUsers: await prisma.user.count({ where: { deletedAt: { not: null } } }),
    totalProfiles: await prisma.profile.count().catch(() => 0),
    totalJourneys: await prisma.journeyProgress.count().catch(() => 0),
    totalMatches: await prisma.match.count(),
    activeMatches: await prisma.match.count({ where: { status: 'active' } }),
    totalConversations: await prisma.conversation.count(),
    totalMessages: await prisma.message.count(),
    totalNotifications: await prisma.notification.count().catch(() => 0),
    totalResonanceSessions: await prisma.resonanceSession.count().catch(() => 0),
    totalJourneyStateLogs: await prisma.journeyStateLog.count().catch(() => 0),
  }

  // --- MATCHES DETAIL ---
  const matches = await prisma.match.findMany({
    include: { userA: { select: { email: true } }, userB: { select: { email: true } } },
  })

  // --- JOURNEYS DETAIL ---
  const journeys = await prisma.journeyProgress.findMany({
    include: { user: { select: { email: true } } },
  })

  // --- CONVERSATIONS DETAIL ---
  const convs = await prisma.conversation.findMany({
    include: { userA: { select: { email: true } }, userB: { select: { email: true } } },
  })

  // --- CLEAN CHECK ---
  const allowedUsers = ['testA@tosom.dev', 'testB@tosom.dev', 'admin@tosom.dev', 'bulk@tosom.com']
  const usersClean = allUsers.every(u => allowedUsers.includes(u.email)) && allUsers.length <= 4
  
  const dbClean = stats.totalConversations > 0 || stats.totalJourneys > 0 || stats.totalMatches > 0
  const featuresWorking = stats.totalMatches >= 1 && stats.totalConversations >= 1 && stats.totalJourneys >= 2

  const cleanStatus = usersClean ? 'CLEAN ✓' : 'NOT CLEAN ✗'
  const e2eStatus = featuresWorking ? 'E2E READY ✓' : 'NEEDS SETUP ✗'

  console.log('PLATFORM STATUS:', cleanStatus)
  console.log('E2E STATUS:', e2eStatus)
  console.log(`\nUsers: ${stats.totalUsers} (aktivt)`);
  allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`))
  console.log(`\nDB Stats:`);
  for (const [k, v] of Object.entries(stats)) {
    console.log(`  ${k}: ${v}`)
  }

  // --- SNAPSHOTS ---
  const finalSnapshot = {
    exportedAt: new Date().toISOString(),
    platformStatus: cleanStatus,
    e2eStatus: e2eStatus,
    users: allUsers.map(u => ({ email: u.email, role: u.role, verified: u.verified })),
    database: stats,
    matches: matches.map(m => ({ userA: m.userA.email, userB: m.userB.email, score: m.score, status: m.status })),
    journeys: journeys.map(j => ({ email: j.user.email, day: j.day, phase: j.phase })),
    conversations: convs.map(c => ({ userA: c.userA.email, userB: c.userB.email, imageShared: c.imageShared })),
  }

  fs.writeFileSync('snapshots/final-status.json', JSON.stringify(finalSnapshot, null, 2))
  console.log('\n✓ Lagret: snapshots/final-status.json')

  console.log(`\n========================================`)
  console.log(`  🟢 CLEAN: ${usersClean}`)
  console.log(`  🟢 E2E READY: ${featuresWorking}`)
  console.log(`========================================`)
}

main().catch(e => { console.error(e); process.exit(1) })