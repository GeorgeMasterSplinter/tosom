/**
 * ToSom Alpha-lansering (A-1)
 * Opprett admin-konto
 */

import { PrismaClient, Role } from "@prisma/client"
import { createHash } from "crypto"

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

interface Input {
  email: string
  password: string
}

async function main(input: Input) {
  console.log(`[A-1] Opprettar admin-konto: ${input.email}`)

  // Sjekk om allerede eksisterer
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (existing) {
    // Oppdater til admin
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: Role.ADMIN, verified: true },
    })
    console.log(`[A-1] ✅ Admin oppdatert: ${input.email}`)
    return
  }

  // Opprett ny admin
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashPassword(input.password),
      role: Role.ADMIN,
      verified: true,
    },
  })

  // Opprett profile
  await prisma.profile.create({
    data: {
      userId: user.id,
      deepProfileStep: "IDENTITY",
    },
  })

  console.log(`[A-1] ✅ Admin-konto oppretta: ${input.email} (id: ${user.id})`)
}

// Parse input fra stdin
const raw = require("fs").readFileSync("/dev/stdin", "utf8").trim()
const input: Input = JSON.parse(raw)

main(input)
  .catch((e) => {
    console.error(`[A-1] ❌ Feil:`, e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())