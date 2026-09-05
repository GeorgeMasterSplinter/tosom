/**
 * POST /api/onboarding/complete
 * Marker djup profil som fullført og start match-prosess
 * Core-definition: Kun brukere med fullført djup profil kan få match
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/session"
import prisma from "@/lib/prisma"
import { csrfCheck } from "@/lib/auth/csrf"
import { sendWelcomeEmail } from "@/lib/email"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // L6: CSRF-vern
  const csrf = await csrfCheck(req)
  if (csrf instanceof NextResponse) return csrf

  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ikke innlogget. Logg inn og prøv igjen." }, { status: 401 })
  }

  try {
    // Verifiser at alle djup profil-steg er fylte
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    })

    if (!user?.profile) {
      return NextResponse.json(
        { error: "Fant ingen profil" },
        { status: 404 }
      )
    }

    const deepData = user.profile.deepProfileData as Record<string, unknown> | null || {}
    const deepSteps = [
      "IDENTITY",
      "LIFE_SITUATION",
      "LIFESTYLE",
      "PERSONALITY",
      "RELATIONSHIP_STYLE",
      "COMMUNICATION",
      "INTIMACY",
      "FUTURE_VISION",
      "BOUNDARIES",
    ]

    const allComplete = deepSteps.every((step) => {
      const stepData = deepData[step]
      if (!stepData) return false
      if (Array.isArray(stepData)) return stepData.length > 0
      if (typeof stepData === "object" && stepData !== null) return Object.keys(stepData).length > 0
      if (typeof stepData === "string") return stepData.trim().length > 0
      return false
    })

    if (!allComplete) {
      return NextResponse.json(
        { error: "Alle stegene i profilen må være fylt ut før du kan fullføre." },
        { status: 400 }
      )
    }

    // Oppdater user og profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingComplete: true,
        deepProfileComplete: true,
        onboardingStep: 99,
      },
    })

    await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
    deepProfileStep: "SUMMARY" as any,
    },
    })

    // Send velkomst-e-post (best-effort — skal aldri blokkere)
    sendWelcomeEmail(user.email, user.profile?.identityName || user.name || undefined).catch(() => {})

    return NextResponse.json({
      success: true,
      message: "Profilen er fullført — nå kan du starte reisen.",
    })
  } catch (error) {
    console.error("Onboarding complete error:", error)
    return NextResponse.json(
      { error: "Kunne ikke fullføre. Prøv igjen." },
      { status: 500 }
    )
  }
}