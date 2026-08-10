/**
 * TOSOM — Oppdater alle snapshots
 */

import { prisma } from "@/lib/prisma"
import fs from "fs"

async function main() {
  console.log('========================================')
  console.log('  TOSOM — SNAPSHOTS OPPDATERT')
  console.log('========================================\n')

  // --- USERS SNAPSHOT ---
  const activeUsers = await prisma.user.findMany({
    where: { deletedAt: null },
    select: {
      id: true, email: true, name: true, role: true, verified: true,
      onboardingComplete: true, deepProfileComplete: true, createdAt: true,
    },
  })

  const usersSnapshot = {
    exportedAt: new Date().toISOString(),
    totalUsers: activeUsers.length,
    description: 'Kun tillatte aktive brukere',
    allowedUsers: ['testA@tosom.dev', 'testB@tosom.dev', 'admin@tosom.dev', 'bulk@tosom.com'],
    userList: activeUsers.map(u => ({
      email: u.email,
      id: u.id,
      name: u.name,
      role: u.role,
      verified: u.verified,
      onboardingComplete: u.onboardingComplete,
      deepProfileComplete: u.deepProfileComplete,
    })),
    status: activeUsers.length === 4 && activeUsers.every(u => 
      ['testA@tosom.dev', 'testB@tosom.dev', 'admin@tosom.dev', 'bulk@tosom.com'].includes(u.email)
    ) ? 'CLEAN ✓' : 'NEEDS CLEANUP ✗',
  }
  fs.writeFileSync('snapshots/users-clean.json', JSON.stringify(usersSnapshot, null, 2))
  console.log('✓ Lagret: snapshots/users-clean.json')

  // --- DB SNAPSHOT ---
  const dbStats = {
    exportedAt: new Date().toISOString(),
    totalUsers: await prisma.user.count(),
    activeUsers: activeUsers.length,
    deletedUsers: await prisma.user.count({ where: { deletedAt: { not: null } } }),
    totalProfiles: await prisma.profile.count().catch(() => 0),
    totalJourneys: await prisma.journeyProgress.count().catch(() => 0),
    totalMatches: await prisma.match.count(),
    activeMatches: await prisma.match.count({ where: { status: 'active' } }),
    totalConversations: await prisma.conversation.count(),
    endedConversations: await prisma.conversation.count({ where: { endedAt: { not: null } } }),
    totalMessages: await prisma.message.count(),
    totalNotifications: await prisma.notification.count().catch(() => 0),
    totalResonanceSessions: await prisma.resonanceSession.count().catch(() => 0),
    totalJourneyStateLogs: await prisma.journeyStateLog.count().catch(() => 0),
  }

  const dbSnapshot = {
    exportedAt: new Date().toISOString(),
    ...dbStats,
    activeUsers: activeUsers.map(u => ({ email: u.email, role: u.role })),
    status: dbStats.totalConversations === 0 && dbStats.totalMessages === 0 
      && dbStats.totalMatches === 0 && dbStats.totalJourneys === 0 
      ? 'CLEAN ✓' : 'NEEDS CLEANUP ✗',
  }
  fs.writeFileSync('snapshots/db-clean.json', JSON.stringify(dbSnapshot, null, 2))
  console.log('✓ Lagret: snapshots/db-clean.json')

  // --- E2E USERS SNAPSHOT ---
  const e2eUsers = await prisma.user.findMany({
    where: { email: { in: ['testA@tosom.dev', 'testB@tosom.dev', 'admin@tosom.dev'] } },
    select: {
      id: true, email: true, name: true, role: true, verified: true,
      onboardingComplete: true, deepProfileComplete: true,
    },
  })

  // Check profiles for E2E users
  const e2eProfileCount = await prisma.profile.count({
    where: { userId: { in: e2eUsers.map(u => u.id) } }
  })

  const e2eSnapshot = {
    exportedAt: new Date().toISOString(),
    description: 'E2E testbrukere klar for testing',
    users: e2eUsers.map(u => ({
      email: u.email,
      id: u.id,
      role: u.role,
      verified: u.verified,
      onboardingComplete: u.onboardingComplete,
      deepProfileComplete: u.deepProfileComplete,
    })),
    profilesCreated: e2eProfileCount,
    status: e2eUsers.length === 3 && e2eProfileCount >= 3 
      ? 'E2E READY ✓' : 'NEEDS SETUP ✗',
  }
  fs.writeFileSync('snapshots/e2e-users.json', JSON.stringify(e2eSnapshot, null, 2))
  console.log('✓ Lagret: snapshots/e2e-users.json')

  // --- FINAL SUMMARY ---
  console.log('\n========================================')
  console.log('  SLUTTSTATUS')
  console.log('========================================\n')
  console.log('Users:', usersSnapshot.status)
  console.log('DB-tables:', dbSnapshot.status)
  console.log('E2E-users:', e2eSnapshot.status)
  
  const allClean = usersSnapshot.status === 'CLEAN ✓' && dbSnapshot.status === 'CLEAN ✓'
  console.log(`\n${allClean ? '✓✓✓ PLATFORMEN ER REN OG KLAR FOR E2E-TESTING' : '⚠ PLATFORMEN TRENGER OPPRYDDING'} ✓✓✓`)
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})