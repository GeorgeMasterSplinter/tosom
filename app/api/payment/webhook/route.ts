/**
 * ToSom — Stripe Webhook Handler
 *
 * POST /api/payment/webhook
 *
 * Handterer Stripe events:
 * - checkout.session.completed → bekreft betaling
 * - customer.subscription.updated → synk abonnement
 * - customer.subscription.deleted → deaktiver premium
 */

import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { validateWebhook } from '@/lib/payment/stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature') ?? ''
  const body = await req.text()
  const payload = Buffer.from(body)

  // Valider Stripe-signatur
  let event: Stripe.Event
  try {
    event = validateWebhook(payload, signature)
  } catch (error) {
    console.error('[Payment] Invalid webhook signature:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Håndter events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      console.log('[Payment] Checkout completed:', {
        sessionId: session.id,
        userId: session.metadata?.userId,
        mode: session.mode,
      })
      // TODO: Oppdater subscription-status i databasen når Prisma-modell finnes
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      console.log('[Payment] Subscription updated:', {
        subscriptionId: subscription.id,
        userId: subscription.metadata?.userId,
        status: subscription.status,
      })
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      console.log('[Payment] Subscription deleted:', {
        subscriptionId: subscription.id,
        userId: subscription.metadata?.userId,
      })
      break
    }

    default:
      console.log(`[Payment] Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}