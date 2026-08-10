/**
 * TOSOM — Slett testbrukere trygt (versjon 2)
 * Bruker deleteMany med korrekt rekkefølge for å unngå FK-feil.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  const testPatterns = ['test', 'demo', 'dev@', 'local']

  // Hent alle brukere som matcher test-mønstre
  const allUsers = await prisma.user.findMany({
    where: {
      AND: [
        {
          OR: testPatterns.map(p => ({
            email: { contains: p, mode: 'insensitive' },
          })),
        },
        { deletedAt: null }, // Kun ikke-slettede
      ],
    },
  })

  console.log(`Funn ${allUsers.length} testbrukere. Forbereder sletting...\n`)

  if (allUsers.length === 0) {
    console.log('✓ Ingen testbrukere å slette.')
    return
  }

  let deletedCount = 0
  let errors: string[] = []

  for (const u of allUsers) {
    try {
      const email = u.email || 'no-email'
      console.log(`Sletter ${email} (id: ${u.id})...`)

      // 1) Finn alle relasjoner før sletting
      const conversations = await prisma.conversation.findMany({
        where: { OR: [{ userAId: u.id }, { userBId: u.id }] },
        select: { id: true },
      })
      const conversationIds = conversations.map(c => c.id)

      const matchesA = await prisma.match.findMany({
        where: { userAId: u.id },
        select: { id: true },
      })
      const matchesB = await prisma.match.findMany({
        where: { userBId: u.id },
        select: { id: true },
      })
      const matchIds = [...matchesA.map(m => m.id), ...matchesB.map(m => m.id)]

      console.log(`  Found: ${conversationIds.length} conversations, ${matchIds.length} matches`)

      // 2) Slett alle relaterte data — rekkefølge viktig!
      
      // Meldinger i conversationer
      if (conversationIds.length > 0) {
        await prisma.message.deleteMany({
          where: { conversationId: { in: conversationIds } },
        })
      }

      // Resonance sessions
      if (conversationIds.length > 0) {
        await prisma.resonanceSession.deleteMany({
          where: { conversationId: { in: conversationIds } },
        })
      }

      // Journey state logs
      if (conversationIds.length > 0) {
        await prisma.journeyStateLog.deleteMany({
          where: { conversationId: { in: conversationIds } },
        })
      }

      // Match insights (må slettes før matches hvis de har FK)
      for (const matchId of matchIds) {
        try {
          await prisma.matchInsight.deleteMany({
            where: { matchId },
          })
        } catch {
          // Ignore — insight kan allerede være borte
        }
      }

      // Slett matches direkte
      if (matchIds.length > 0) {
        for (const matchId of matchIds) {
          try {
            await prisma.match.delete({
              where: { id: matchId },
            })
          } catch {
            // Match kan allerede være slettet via cascade
          }
        }
      }

      // Profile
      await prisma.profile.deleteMany({
        where: { userId: u.id },
      })

      // Journey progress
      await prisma.journeyProgress.deleteMany({
        where: { userId: u.id },
      })

      // Notifications
      await prisma.notification.deleteMany({
        where: { userId: u.id },
      })

      // Sessions
      await prisma.session.deleteMany({
        where: { userId: u.id },
      })

      // Accounts
      await prisma.account.deleteMany({
        where: { userId: u.id },
      })

      // 3) Finn og avslutt alle conversationer (merkelapp)
      const activeConversations = await prisma.conversation.findMany({
        where: { OR: [{ userAId: u.id }, { userBId: u.id }] },
      })
      for (const c of activeConversations) {
        try {
          await prisma.conversation.update({
            where: { id: c.id },
            data: { endedAt: new Date() },
          })
        } catch {
          // Ignore already-ended
        }
      }

      // 4) Slett meldinger sendt av brukeren (som sender)
      await prisma.message.deleteMany({
        where: { senderId: u.id },
      })

      // 5) Markér som slettet (soft delete)
      await prisma.user.update({
        where: { id: u.id },
        data: { deletedAt: new Date() },
      })

      console.log(`  ✓ Slettet ${email}`)
      deletedCount++
    } catch (error) {
      const email = u.email || 'no-email'
      console.error(`  ✗ Feil på ${email}:`, (error as Error).message)
      errors.push(`${email}: ${(error as Error).message}`)
    }
  }

  console.log('\n========================================')
  console.log('  TESTBRUKERE SLETTET')
  console.log('========================================')
  console.log(`Slettet: ${deletedCount}/${allUsers.length}`)

  if (errors.length > 0) {
    console.log(`\nFEIL (${errors.length}):`)
    errors.forEach(e => console.log(`  - ${e}`))
  }

  // Verifiser
  const remaining = await prisma.user.findMany({
    where: {
      AND: [
        { deletedAt: null },
        {
          OR: testPatterns.map(p => ({
            email: { contains: p, mode: 'insensitive' },
          })),
        },
      ],
    },
  })

  if (remaining.length > 0) {
    console.log(`\n⚠ ${remaining.length} brukere gjenstår:`)
    remaining.forEach(u => console.log(`  - ${u.email}`))
  } else {
    console.log('\n✓ Alle testbrukere er borte.')
  }

  if (errors.length > 0) {
    process.exit(1)
  }
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})