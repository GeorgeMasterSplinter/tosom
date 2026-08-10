/**
 * TOSOM — Database Snapshot
 * Eksporterer statistikk fra alle relevante tabeller.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  console.log('========================================')
  console.log('  TOSOM — DATABASE SNAPSHOT')
  console.log('========================================\n')

  const totals = {
    // Users
    totalUsers: await prisma.user.count(),
    activeUsers: await prisma.user.count({ where: { deletedAt: null } }),
    deletedUsers: await prisma.user.count({ where: { deletedAt: { not: null } } }),

    // Profiles
    totalProfiles: await prisma.profile.count().catch(() => 0),
    
    // Journeys
    totalJourneys: await prisma.journeyProgress.count().catch(() => 0),
    
    // Matches
    totalMatches: await prisma.match.count(),
    activeMatches: await prisma.match.count({ where: { status: 'active' } }),
    
    // Conversations
    totalConversations: await prisma.conversation.count(),
    endedConversations: await prisma.conversation.count({ where: { endedAt: { not: null } } }),
    
    // Messages
    totalMessages: await prisma.message.count(),
    
    // Notifications
    totalNotifications: await prisma.notification.count().catch(() => 0),
    
    // Resonance Sessions
    totalResonanceSessions: await prisma.resonanceSession.count().catch(() => 0),
    
    // Journey State Logs
    totalJourneyStateLogs: await prisma.journeyStateLog.count().catch(() => 0),
  }

  console.log('--- DATABASE STATISTIKK ---')
  for (const [key, value] of Object.entries(totals)) {
    console.log(`  ${key}: ${value}`)
  }

  // Active users detail
  const activeUsers = await prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      verified: true,
      onboardingComplete: true,
      deepProfileComplete: true,
      createdAt: true,
    },
  })

  console.log('\n--- AKTIVE BRUKERE ---')
  for (const u of activeUsers) {
    console.log(`  ${u.email} | role: ${u.role} | verified: ${u.verified} | onboarding: ${u.onboardingComplete}`)
  }

  // Deleted users detail
  const deletedUsers = await prisma.user.findMany({
    where: { deletedAt: { not: null } },
    select: {
      id: true,
      email: true,
      deletedAt: true,
    },
  })

  console.log(`\n--- SLETTETE BRUKERE (${deletedUsers.length}) ---`)
  for (const u of deletedUsers) {
    console.log(`  ${u.email} | deletedAt: ${u.deletedAt.toISOString().split('T')[0]}`)
  }

  // Export snapshot
  const fs = await import('fs')
  
  // Users snapshot
  const usersSnapshot = {
    exportedAt: new Date().toISOString(),
    totalUsers: totals.totalUsers,
    activeUsers: totals.activeUsers,
    deletedUsers: totals.deletedUsers,
    userList: activeUsers.map(u => ({
      email: u.email,
      id: u.id,
      name: u.name,
      role: u.role,
      verified: u.verified,
      onboardingComplete: u.onboardingComplete,
      deepProfileComplete: u.deepProfileComplete,
    })),
  }
  fs.writeFileSync('snapshots/users-clean.json', JSON.stringify(usersSnapshot, null, 2))
  console.log('\n✓ Lagret: snapshots/users-clean.json')

  // DB snapshot
  const dbSnapshot = {
    exportedAt: new Date().toISOString(),
    ...totals,
    activeUsers: activeUsers.map(u => ({ email: u.email, role: u.role })),
    deletedUserCount: totals.deletedUsers,
  }
  fs.writeFileSync('snapshots/db-clean.json', JSON.stringify(dbSnapshot, null, 2))
  console.log('✓ Lagret: snapshots/db-clean.json')

  // Check if cleanup is needed
  const needsCleanup = totals.activeUsers > 4 || totals.conversations > 0 || totals.messages > 0
  
  console.log(`\n${needsCleanup ? '⚠ PLATFORMEN TRENGER OPPRYDDING' : '✓ PLATFORMEN ER REN'}`)
  
  if (needsCleanup) {
    console.log('\nKriterier for ren platform:')
    console.log(`  Aktive brukere: ${totals.activeUsers} (ønsket: ≤4)`)
    console.log(`  Conversations: ${totals.totalConversations} (ønsket: 0)`)
    console.log(`  Messages: ${totals.totalMessages} (ønsket: 0)`)
  }
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})