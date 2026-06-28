/**
 * POST /api/dev/setup
 *
 * Oppretter automatisk profil, onboarding-status og match-status
 * for dev-brukeren (id = "dev-user").
 *
 * Kan kaldes trygt mange ganger — oppretter aldri duplikater.
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { DeepProfileStep, JourneyPhase, ResonanceLevel } from '@prisma/client'

export async function POST() {
  try {
    const DEV_USER_ID = 'dev-user'

    // 1a. Opprett partner først (må finnes før match kan lagast)
    let partner = await prisma.user.findFirst({ where: { id: 'dev-match-target' } })
    if (!partner) {
      partner = await prisma.user.create({
        data: {
          id: 'dev-match-target',
          email: 'dev-match@tosom.local',
          role: 'USER',
          onboardingComplete: true,
          deepProfileComplete: true,
          profile: {
            create: {
              firstName: 'Partner',
              age: 28,
              bio: 'Dev-partner for testing matcher og reise',
              interests: ['Musikk', 'Friluftsliv'],
              deepProfileStep: DeepProfileStep.SUMMARY,
              deepProfileComplete: true,
            },
          },
        },
      })
    }

    // 1b. Opprett dev-user med alt i éin kall
    let user = await prisma.user.findUnique({ where: { id: DEV_USER_ID } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: DEV_USER_ID,
          email: 'dev@tosom.local',
          role: 'USER',
          onboardingComplete: true,
          deepProfileComplete: true,

          // Profile (korrekte felt basert på schema)
          profile: {
            create: {
              firstName: 'Testbruker',
              age: 30,
              bio: 'Dev-user for testing',
              interests: ['Utvikling', 'AI', 'ToSom'],
              deepProfileData: { identity: { name: 'Testbruker', age: 30 } } as any,
              deepProfileStep: DeepProfileStep.SUMMARY,
              deepProfileComplete: true,
            },
          },

          // JourneyProgress (korrekt JourneyPhase-verdi: EARLY, ikkje START)
          journey: {
            create: {
              phase: JourneyPhase.EARLY,
              day: 1,
              startedAt: new Date(),
            },
          },

          // Conversation (korrekte felt: id, userAId, userBId — ingen title/category)
          conversationsA: {
            create: {
              id: 'dev-conversation',
              userAId: DEV_USER_ID,
              userBId: 'dev-match-target',
              messages: {
                create: [
                  {
                    conversationId: 'dev-conversation',
                    senderId: DEV_USER_ID,
                    content: 'Hei! Dette er første dev-melding.',
                    type: 'user',
                  },
                ],
              },
            },
          },

          // Match (korrekte felt: status=active, type=String, ingen "rejected" felt)
          matchesA: {
            create: {
              userAId: DEV_USER_ID,
              userBId: 'dev-match-target',
              status: 'active',
              score: 85,
              normalizedScore: 0.85,
              resonanceLevel: ResonanceLevel.MODERATE,
              type: 'resonance',
              acceptedByA: new Date(),
              acceptedByB: new Date(),
            },
          },
        },
      })
    }

    // 2. Merker onboarding som fullført (trygg)
    await prisma.user.update({
      where: { id: DEV_USER_ID },
      data: { onboardingComplete: true, deepProfileComplete: true },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Dev setup error:', error)
    return NextResponse.json(
      { error: 'Kunne ikke opprette dev-profil', details: String(error) },
      { status: 500 },
    )
  }
}

export async function GET() {
  return POST()
}

