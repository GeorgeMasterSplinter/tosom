/**
 * GET /api/onboarding/progress
 * Henta djup profil-fulking for pålogga brukar
 * Core-definition: Kun djup profil-data — aldri foto
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import prisma from "@/lib/prisma"
import { DeepProfileStep } from "@prisma/client"

const DEEP_STEPS = [
  DeepProfileStep.IDENTITY,
  DeepProfileStep.LIFE_SITUATION,
  DeepProfileStep.LIFESTYLE,
  DeepProfileStep.PERSONALITY,
  DeepProfileStep.RELATIONSHIP_STYLE,
  DeepProfileStep.COMMUNICATION,
  DeepProfileStep.INTIMACY,
  DeepProfileStep.FUTURE_VISION,
  DeepProfileStep.BOUNDARIES,
] as const

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Umagalet" }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    })

    if (!user?.profile) {
      return NextResponse.json({
        onboardingComplete: false,
        deepProfileComplete: false,
        progress: { currentStep: 0, percentage: 0 },
        steps: [],
      })
    }

    const deepData = user.profile.deepProfileData as Record<string, unknown> | null || {}

    // Kalkuler fylking per steg
    const steps = DEEP_STEPS.map((step) => {
      const stepData = deepData[step]
      let isComplete = false

      if (stepData) {
        if (Array.isArray(stepData)) {
          isComplete = (stepData as unknown[]).length > 0
        } else if (typeof stepData === "object" && stepData !== null) {
          isComplete = Object.keys(stepData).length > 0
        } else if (typeof stepData === "string") {
          isComplete = stepData.trim().length > 0
        }
      }

      return {
        step,
        isComplete,
        data: stepData,
      }
    })

    const completeCount = steps.filter((s) => s.isComplete).length
    const percentage = Math.round((completeCount / DEEP_STEPS.length) * 100)

    // Finn nåværende steg
    const currentStepIndex = steps.findIndex((s) => !s.isComplete)
    const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex].step : DeepProfileStep.SUMMARY

    return NextResponse.json({
      onboardingComplete: user.onboardingComplete,
      deepProfileComplete: user.deepProfileComplete,
      progress: {
        currentStep,
        currentStepIndex: DEEP_STEPS.findIndex((s) => s === currentStep),
        percentage,
        completeCount,
        totalCount: DEEP_STEPS.length,
      },
      steps,
    })
  } catch (error) {
    console.error("Onboarding progress error:", error)
    return NextResponse.json(
      { error: "Kunne ikkje henta progresjon" },
      { status: 500 }
    )
  }
}