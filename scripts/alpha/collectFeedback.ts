/**
 * ToSom Alpha-lansering (A-1)
 * Innsamling av brukar-tilbakemeldingar
 * Brukarar kan gi tilbakemelding via terminal eller fil
 */

import { PrismaClient } from "@prisma/client"
import * as readline from "readline"

const prisma = new PrismaClient()

interface FeedbackEntry {
  userId?: string
  email: string
  onboarding: string
  match: string
  journey: string
  chat: string
  tone: string
  visual: string
  suggestions: string
  overall: number // 1-10
  timestamp: string
}

function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

async function collectFeedback(): Promise<FeedbackEntry> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

  console.log("\n=== ToSom Alpha-tillbakemelding ===")
  console.log("Din meining er verdi for oss. Ta deg tid.\n")

  const email = await askQuestion(rl, "Din e-post: ") || "anon@tosom.no"

  console.log("\n--- Onboarding ---")
  const onboarding = await askQuestion(rl, "Kva tenker du om onboarding-oplevelsen? (1-10, fritekst): ")

  console.log("\n--- Match ---")
  const match = await askQuestion(rl, "Kva tenker du om match-opplevelsen? (1-10, fritekst): ")

  console.log("\n--- Reise ---")
  const journey = await askQuestion(rl, "Kva tenker du om reise-opplevelsen? (1-10, fritekst): ")

  console.log("\n--- Chat ---")
  const chat = await askQuestion(rl, "Kva tenker du om chatten? (1-10, fritekst): ")

  console.log("\n--- Tone ---")
  const tone = await askQuestion(rl, "Føler du tonen er rolig, varm og trygg? (ja/neit/neutral): ")

  console.log("\n--- Visuell ---")
  const visual = await askQuestion(rl, "Føler du visuell ro og trygghet? (ja/neit/neutral): ")

  console.log("\n--- Forslag ---")
  const suggestions = await askQuestion(rl, "Kva forslag eller tilbakemeldingar har du? (fritekst): ")

  console.log("\n--- Overall ---")
  const overallStr = await askQuestion(rl, "Gjev ToSom ein total score (1-10): ")
  const overall = parseInt(overallStr) || 5

  rl.close()

  return {
    userId: undefined, // kan oppdaterast seinare
    email,
    onboarding: onboarding || "Ingen tilbakemelding",
    match: match || "Ingen tilbakemelding",
    journey: journey || "Ingen tilbakemelding",
    chat: chat || "Ingen tilbakemelding",
    tone: tone || "neutral",
    visual: visual || "neutral",
    suggestions: suggestions || "Ingen forslag",
    overall,
    timestamp: new Date().toISOString(),
  }
}

async function saveFeedback(feedback: FeedbackEntry) {
  // Lag i JSON for enkel analyse
  const fs = require("fs")
  const path = "/tmp/alpha-feedback.json"

  let existing: FeedbackEntry[] = []
  try {
    existing = JSON.parse(fs.readFileSync(path, "utf8"))
  } catch {
    // Fil eksisterer enno
  }

  existing.push(feedback)
  fs.writeFileSync(path, JSON.stringify(existing, null, 2))

  console.log(`\n[A-1] ✅ Tilbakemelding lagra: ${path}`)
}

async function main() {
  console.log(`\n[A-1] Feedback-innsamling — ${new Date().toISOString()}\n`)

  const feedback = await collectFeedback()

  // Oppsummer
  console.log("\n=== Oppsummering ===")
  console.log(`E-post:         ${feedback.email}`)
  console.log(`Onboarding:     ${feedback.onboarding}`)
  console.log(`Match:           ${feedback.match}`)
  console.log(`Reise:           ${feedback.journey}`)
  console.log(`Chat:            ${feedback.chat}`)
  console.log(`Tone:            ${feedback.tone}`)
  console.log(`Visuell:         ${feedback.visual}`)
  console.log(`Forslag:         ${feedback.suggestions}`)
  console.log(`Total:           ${feedback.overall}/10`)

  await saveFeedback(feedback)

  console.log(`\n[A-1] Takk for din tilbakemelding!`)
}

main()
  .catch((e) => {
    console.error(`[A-1] ❌ Feil:`, e.message)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())