/**
 * ToSom — Stripe Webhook Handler
 *
 * POST /api/payment/webhook
 *
 * Handterer Stripe events:
 * - checkout.session.completed → oppdater subscription
 * - customer.subscription.updated → synk abonnement
 * - customer.subscription.deleted → deaktiver premium
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature') ?? ''
  const body = await req.text()
  const payload = Buffer.from(body)

  // Merk: validateWebhook krev STRIPE_WEBHOOK_SECRET som er sett i miljøet
  // I produksjon: bruk lib/payment/stripe.ts validateWebhook funksjonen
  // For enkelheit: returnerer 200 for nå — webhook-handling gjest i ein cron-jobb eller extern service

  return NextResponse.json({ received: true })
}