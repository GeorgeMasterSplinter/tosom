/**
 * ToSom Alpha-lansering (A-1)
 * Opprett demo-brukere for alpha-test
 * Hver bruker får en unik profil med random data
 */

import { PrismaClient, Role } from "@prisma/client"
import { createHash } from "crypto"

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

interface Input {
  count: number
  password: string
}

// Helper data for random profil-fyll
const firstNames = ["Eirik", "Solveig", "Magnus", "Astrid", "Leif", "Ingrid", "Olav", "Sigrun", "Knut", "Freya", "Tor", "Helga", "Bjørn", "Ragnhild", "Stein", "Mona", " Dag", "Tone", "Jon", "Kari"]
const lifeSituations = [
  { jobb: "Utviklar", bosted: "Leiger leilegheit", økonomi: "Stabil" },
  { jobb: "Designer", bosted: "Eigar leilegheit", økonomi: "God" },
  { jobb: "Lærar", bosted: "Leigerrom", økonomi: "Middels" },
  { jobb: "Forskar", bosted: "Eigar hus", økonomi: "Sterk" },
  { jobb: "Terapeut", bosted: "Leiger", økonomi: "Stabil" },
]
const lifestyles = [
  { aktivitet: "Høgt", sosial: "Ute", helg: "Eventyr" },
  { aktivitet: "Middels", sosial: "Hjemme", helg: "Ro" },
  { aktivitet: "Lavt", sosial: "Få nære", helg: "Hobby" },
]
const personalities = [
  { styrkar: ["Empatisk", "Luande", "Tålmodig"], trekk: ["Rolig", "Reflekterande"] },
  { styrkar: ["Kreativ", "Dypttenkjande", "Erebare"], trekk: ["Intens", "Varm"] },
  { styrkar: ["Logisk", "Ärleg", "Bestemt"], trekk: ["Direkte", "Autentisk"] },
]

async function main(input: Input) {
  const { count, password } = input
  const pwHash = hashPassword(password)

  console.log(`[A-1] Opprettar ${count} demo-brukere...`)

  const users: { id: string; email: string }[] = []

  for (let i = 0; i < count; i++) {
    const email = `demo${i + 1}@tosom.no`

    // Sjekk om allerede eksisterer
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      console.log(`[A-1] ⏭ Bruker ${i + 1} allerede eksisterer: ${email}`)
      users.push({ id: existing.id, email })
      continue
    }

    const name = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lifeSitu = lifeSituations[Math.floor(Math.random() * lifeSituations.length)]
    const lifestyle = lifestyles[Math.floor(Math.random() * lifestyles.length)]
    const personality = personalities[Math.floor(Math.random() * personalities.length)]

    // Opprett user + profile
    const user = await prisma.user.create({
      data: {
        email,
        password: pwHash,
        role: Role.USER,
        verified: true,
        onboardingStep: 11,
        onboardingComplete: true,
        deepProfileComplete: true,
      },
    })

    await prisma.profile.create({
      data: {
        userId: user.id,
        firstName: name,
        age: 23 + Math.floor(Math.random() * 27),
        lifeSituation: lifeSitu,
        lifestyle: lifestyle,
        personality: personality,
        relationshipStyle: "secure",
        communication: { preferanse: "Djup", tempo: "Slow" },
        intimacy: { nærleik: "Gradvis", preference: "Emosjonell" },
        futureVision: { drøm: "Ekte samband", mål: "Langvarig relasjon" },
        boundaries: { behov: "Rom", grense: "Ingen pressure" },
        emotionalNeeds: { trygheit: "Høg", forståelse: "Djup" },
        lifeRhythm: ["morning", "evening", "fast", "slow"][Math.floor(Math.random() * 4)],
        maturityLevel: 5 + Math.floor(Math.random() * 5),
        securityLevel: ["unsicher", "ambivalent", "secure"][Math.floor(Math.random() * 3)],
        deepProfileStep: "SUMMARY",
        interests: ["musikk", "litteratur", "natur", "samtales", "refleksjon", "reiser"],
      },
    })

    users.push({ id: user.id, email })
    console.log(`[A-1] ✅ Bruker ${i + 1}: ${email} (id: ${user.id})`)
  }

  console.log(`\n[A-1] ✅ ${users.length} demo-brukere klare.`)
  console.log(`\nInnlogging:`)
  for (const u of users) {
    console.log(`  Email: ${u.email} | Pass: ${password}`)
  }
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