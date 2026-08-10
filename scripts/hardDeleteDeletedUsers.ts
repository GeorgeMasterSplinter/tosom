/**
 * TOSOM — Hard delete all users with deletedAt set
 * These are soft-deleted test users from previous cleanup runs.
 */

import { prisma } from "@/lib/prisma"

async function main() {
  console.log('========================================')
  console.log('  TOSOM — HARD DELETE SLETTETE BRUKERE')
  console.log('========================================\n')

  // Hent alle brukere med deletedAt
  const deletedUsers = await prisma.user.findMany({
    where: { deletedAt: { not: null } },
    select: { id: true, email: true, deletedAt: true },
  })

  if (deletedUsers.length === 0) {
    console.log('✓ Ingen slettede brukere å fjerne.')
    return
  }

  console.log(`Finner ${deletedUsers.length} brukere med deletedAt:\n`)
  deletedUsers.forEach(u => console.log(`  - ${u.email}`))
  console.log()

  // Slett fysisk — rekkefølge viktig pga. FK
  for (const u of deletedUsers) {
    try {
      await prisma.session.deleteMany({ where: { userId: u.id } })
      await prisma.account.deleteMany({ where: { userId: u.id } })
      await prisma.resetTokens?.deleteMany({ where: { userId: u.id } } as any)
      await prisma.twoFactorSecret?.deleteMany({ where: { userId: u.id } } as any)
      await prisma.user.delete({ where: { id: u.id } })
      console.log(`  ✓ Hard slettet: ${u.email}`)
    } catch (e) {
      console.error(`  ✗ Feil på ${u.email}: ${(e as Error).message}`)
    }
  }

  // Verifiser
  const remaining = await prisma.user.count()
  const stillDeleted = await prisma.user.count({ where: { deletedAt: { not: null } } })
  
  console.log(`\n--- EFTER硬 SLETTING ---`)
  console.log(`Totalt brukere: ${remaining}`)
  console.log(`Med deletedAt: ${stillDeleted}`)
  console.log(stillDeleted === 0 ? '\n✓ Alle soft-deleted brukere er fysisk slettet.' : '\n⚠ Noen brukere gjenstår med deletedAt.')
}

main().catch(e => {
  console.error('Kritisk feil:', e)
  process.exit(1)
})