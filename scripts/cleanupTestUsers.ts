/**
 * TOSOM — Slett testbrukere trygt
 * Fjerner alle relasjoner (messages, conversations, matches, journey, profile)
 * før brukeren selv slettes.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  const testPatterns = ['test', 'demo', 'dev@', 'local']

  // Hent alle brukere som matcher test-mønstre
  const allUsers = await prisma.user.findMany({
    where: {
      OR: testPatterns.map(p => ({
        email: { contains: p, mode: 'insensitive' },
      })),
    },
    include: {
      matchesA: true,
      matchesB: true,
    },
  })

  console.log(`Funn ${allUsers.length} testbrukere. Forbereder sletting...\n`)

  let deletedCount = 0
  let errors: string[] = []

  for (const u of allUsers) {
    try {
      const email = u.email || 'no-email'
      console.log(`Sletter ${email} (id: ${u.id})...`)

      // 1) Slett meldinger sendt av denne brukeren (som sender)
      await prisma.message.deleteMany({
        where: { senderId: u.id },
      })

      // 2) Finn og avslutt conversations
      const conversations = await prisma.conversation.findMany({
        where: { OR: [{ userAId: u.id }, { userBId: u.id }] },
      })
      for (const c of conversations) {
        await prisma.conversation.update({
          where: { id: c.id },
          data: { endedAt: new Date() },
        })
      }

      // 3) Slett alle meldinger i disse conversationene
      if (conversations.length > 0) {
        await prisma.message.deleteMany({
          where: {
            conversationId: { in: conversations.map(c => c.id) },
          },
        })
      }

      // 4) Slett journey progress
      await prisma.journeyProgress.deleteMany({
        where: { userId: u.id },
      })

      // 5) Slett profile
      await prisma.profile.deleteMany({
        where: { userId: u.id },
      })

      // 6) Slett matches + insights (brukeren er enten userA eller userB)
      const matchIds = [
        ...(u.matchesA ?? []).map((m: any) => m.id),
        ...(u.matchesB ?? []).map((m: any) => m.id),
      ]
      // Unik liste av match-IDs
      const uniqueMatchIds = [...new Set(matchIds)]
      for (const matchId of uniqueMatchIds) {
        await prisma.matchInsight.deleteMany({
          where: { matchId },
        })
        await prisma.match.delete({
          where: { id: matchId },
        })
      }

      // 7) Slett notifications
      await prisma.notification.deleteMany({
        where: { userId: u.id },
      })

      // 8) Slett session tokens (cascade)
      await prisma.session.deleteMany({
        where: { userId: u.id },
      })

      // 9) Slett account links (cascade)
      await prisma.account.deleteMany({
        where: { userId: u.id },
      })

      // Slett notifications
      await prisma.notification.deleteMany({
        where: { userId: u.id },
      })

      // Slett session tokens
      await prisma.session.deleteMany({
        where: { userId: u.id },
      })

      // Slett account links
      await prisma.account.deleteMany({
        where: { userId: u.id },
      })

      // Slett reset tokens
      await prisma.resetTokens?.deleteMany({
        where: { userId: u.id },
      } as any)

      // Slett 2FA secret
      await prisma.twoFactorSecret?.deleteMany({
        where: { userId: u.id },
      } as any)

      // Tilkjennegi at brukeren er slettet (soft delete via User.deletedAt)
      await prisma.user.update({
        where: { id: u.id },
        data: { deletedAt: new Date() },
      })

      console.log(`  ✓ Slettet ${email}`)
      deletedCount++
    } catch (error) {
      const email = u.email || 'no-email'
      console.error(`  ✗ Feil på ${email}:`, error)
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
      OR: testPatterns.map(p => ({
        email: { contains: p, mode: 'insensitive' },
      })),
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