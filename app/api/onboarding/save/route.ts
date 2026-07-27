/**
 * POST /api/onboarding/save
 * Lagre djup profil-steg for pålogga brukar
 * Core-definition: Berre djup profil-data brukt — aldri foto-scoring
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth/session"
import prisma from "@/lib/prisma"
import { DeepProfileStep } from "@prisma/client"

export const dynamic = 'force-dynamic'

// Deep profile-steg
const DEEP_STEPS: string[] = [
  DeepProfileStep.IDENTITY,
  DeepProfileStep.LIFE_SITUATION,
  DeepProfileStep.LIFESTYLE,
  DeepProfileStep.PERSONALITY,
  DeepProfileStep.RELATIONSHIP_STYLE,
  DeepProfileStep.COMMUNICATION,
  DeepProfileStep.INTIMACY,
  DeepProfileStep.FUTURE_VISION,
  DeepProfileStep.BOUNDARIES,
  DeepProfileStep.SUMMARY,
]

type JsonData = null | string | number | boolean | JsonData[] | { [key: string]: JsonData }

export async function POST(req: NextRequest) {
  const session = await getServerSession()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Umagalet" }, { status: 401 })
  }

  try {
    const body = await req.json()

    const { step, data } = body as {
      step: DeepProfileStep | string
      data: Record<string, unknown>
    }

    if (!step || !data) {
      return NextResponse.json(
        { error: "Manglar 'step' eller 'data'" },
        { status: 400 }
      )
    }

    // Validér at steg er gyldig deep profile-steg
    if (!DEEP_STEPS.includes(step as DeepProfileStep)) {
      return NextResponse.json(
        { error: "Ugyldig steg" },
        { status: 400 }
      )
    }

    // Henta eksisterande profil
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profil finst ikkje" },
        { status: 404 }
      )
    }

    // Oppdater deepProfileData med det nye steget
    const deepDataRaw = (profile.deepProfileData ?? {}) as Record<string, unknown>
    deepDataRaw[step] = data

    // Oppdater profil
    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        deepProfileData: deepDataRaw as any,
        deepProfileStep: step as DeepProfileStep,
      },
    })

    // Sjekk om alle djup profil-steg er fylt
    const allStepsComplete = DEEP_STEPS.every((s) => {
      const stepData = deepDataRaw[s as keyof typeof deepDataRaw] as unknown
      if (stepData == null) return false
      if (Array.isArray(stepData)) return stepData.length > 0
      if (typeof stepData === "object") return Object.keys(stepData).length > 0
      if (typeof stepData === "string") return stepData.length > 0
      return false
    })

    // Merk djup profil som fullført
    let userUpdated: { deepProfileComplete: boolean } | null = null
    if (allStepsComplete) {
      userUpdated = await prisma.user.update({
        where: { id: session.user.id },
        data: {
          deepProfileComplete: true,
        },
      })
     }

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedProfile.id,
        deepProfileStep: updatedProfile.deepProfileStep,
        deepProfileComplete: allStepsComplete || (userUpdated?.deepProfileComplete ?? false),
      },
    })
  } catch (error) {
    console.error("Onboarding save error:", error)
    return NextResponse.json(
      { error: "Kunne ikje lagre profil" },
      { status: 500 }
    )
  }
}