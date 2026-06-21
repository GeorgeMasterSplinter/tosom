/**
 * ToSom Alpha-lansering (A-1)
 * Observasjon og feilfangst under alpha-test
 * Logger alle feil, API-status og uvanlege mønstre
 */

import { PrismaClient, MatchStatus, JourneyPhase } from "@prisma/client"

const prisma = new PrismaClient()

interface AlphaMetrics {
  totalUsers: number
  onboardedUsers: number
  activeUsers: number
  totalMatches: number
  activeJourneys: number
  errorCount: number
  warnings: string[]
  systemHealth: string
  timestamps: Record<string, string>
}

async function collectMetrics(): Promise<AlphaMetrics> {
  const warnings: string[] = []
  const now = new Date()

  // Brukarstatistikk
  const totalUsers = await prisma.user.count()
  const onboardedUsers = await prisma.user.count({ where: { onboardingComplete: true } })
  const activeUsers = await prisma.user.count({
    where: {
      lastMatchAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
    },
  })

  // Match-statistikk
  const totalMatches = await prisma.match.count()
  const activeJourneys = await prisma.journeyProgress.count()

  // Kritiske feil-sjekk
  // 1. Dobbelt-match (sjekk om nokon har >1 aktiv match)
  const doubleMatches = await prisma.$queryRaw<any[]>`
    SELECT user_a_id, COUNT(*) as cnt
    FROM "Match"
    WHERE status = 'active'
    GROUP BY user_a_id
    HAVING COUNT(*) > 1
  `
  if (doubleMatches.length > 0) {
    warnings.push(`⚠️ Dobbelt-match oppdaga: ${doubleMatches.length} brukarar med >1 aktiv match`)
  }

  // 2. nextDayAt-feil (sjekk om nextDayAt er i fortida)
  const expiredJourneys = await prisma.journeyProgress.count({
    where: {
      nextDayAt: { lt: now },
      phase: { not: JourneyPhase.CHECKIN },
    },
  })
  if (expiredJourneys > 0) {
    warnings.push(`⚠️ ${expiredJourneys} reiser med expired nextDayAt`)
  }

  // 3. imageShareAllowedAt-feil (sjekk om image er delt før 14 dagar)
  const earlyImageShares = await prisma.conversation.count({
    where: {
      imageShared: true,
      imageShareAllowedAt: { gt: now },
    },
  })
  if (earlyImageShares > 0) {
    warnings.push(`⚠️ ${earlyImageShares} konversasjonar med tidleg bildedeling`)
  }

  // 4. Manglande systemmeldingar
  const journeysWithoutMessages = await prisma.$queryRaw<any[]>`
    SELECT jp.user_id
    FROM "JourneyProgress" jp
    LEFT JOIN "Conversation" c ON c."userAId" = jp.user_id OR c."userBId" = jp.user_id
    LEFT JOIN "Message" m ON m."conversationId" = c.id
    WHERE jp.phase != 'CHECKIN'
    GROUP BY jp.user_id
    HAVING COUNT(m.id) = 0
  `
  if (journeysWithoutMessages.length > 0) {
    warnings.push(`⚠️ ${journeysWithoutMessages.length} brukarar utan systemmeldingar i reise`)
  }

  // 5. Auth-feil (sjekk om det er mange banned/deleted brukarar)
  const bannedUsers = await prisma.user.count({ where: { bannedAt: { not: null } } })
  if (bannedUsers > 0) {
    warnings.push(`⚠️ ${bannedUsers} brukarar er bana`)
  }

  // 6. Systemfeil (sjekk SystemLog for errors)
  const errorCount = await prisma.systemLog.count({
    where: {
      level: "ERROR",
      createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    },
  })

  return {
    totalUsers,
    onboardedUsers,
    activeUsers,
    totalMatches,
    activeJourneys,
    errorCount,
    warnings,
    systemHealth: errorCount > 10 ? "degraded" : "healthy",
    timestamps: {
      collectedAt: now.toISOString(),
      last24h: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
  }
}

async function main() {
  console.log(`\n[A-1] Alpha-observasjon — ${new Date().toISOString()}\n`)

  const metrics = await collectMetrics()

  // Skriv ut rapport
  console.log("=== Alpha-metrikk ===")
  console.log(`Brukarar:       ${metrics.totalUsers} total / ${metrics.onboardedUsers} onboardet / ${metrics.activeUsers} aktiv`)
  console.log(`Matches:        ${metrics.totalMatches}`)
  console.log(`Aktive reiser:  ${metrics.activeJourneys}`)
  console.log(`Feil (24t):     ${metrics.errorCount}`)
  console.log(`System-status:  ${metrics.systemHealth}`)

  if (metrics.warnings.length > 0) {
    console.log(`\n=== Advarsler ===`)
    for (const w of metrics.warnings) {
      console.log(`  ${w}`)
    }
  }

  // Lag til JSON fil for oppfølging
  const fs = require("fs")
  fs.writeFileSync("/tmp/alpha-metrics.json", JSON.stringify(metrics, null, 2))
  console.log(`\n[METRIKK] Lagt til /tmp/alpha-metrics.json`)

  // Returner exit-code basert på health
  if (metrics.systemHealth === "degraded" || metrics.errorCount > 20) {
    console.log("\n[A-1] ❌ Systemet er degradert — sjekk feil")
    process.exit(1)
  }

  console.log("\n[A-1] ✅ System er helt")
}

main()
  .catch((e) => {
    console.error(`[A-1] ❌ Observasjonsfeil:`, e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())