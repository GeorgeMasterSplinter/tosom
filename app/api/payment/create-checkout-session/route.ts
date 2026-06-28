/**
 * ToSom — Create Checkout Session (Stripe)
 *
 * POST /api/payment/create-checkout-session
 */

import { NextRequest, NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createCheckoutSession, createOrUpdateCustomer } from '@/lib/payment/stripe'

// Zod-skjema for checkout
const CheckoutSchema = require('zod').z.object({
  plan: require('zod').z.enum(['premium']).optional(),
  successUrl: require('zod').z.string().url().optional(),
  cancelUrl: require('zod').z.string().url().optional(),
})

export async function POST(req: NextRequest) {
  return createApiHandler({
    auth: true,
    rateLimit: { windowMs: 60_000, maxRequests: 5, strict: true },
    handler: async ({ user }) => {
      if (!user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const successUrl = (req.nextUrl.searchParams.get('successUrl') ?? `${req.nextUrl.origin}/dashboard`).replace(/[&?]/g, encodeURIComponent)
      const cancelUrl = (req.nextUrl.searchParams.get('cancelUrl') ?? `${req.nextUrl.origin}/pricing`).replace(/[&?]/g, encodeURIComponent)

      // Opprett customer i Stripe
      const email = user.email ?? ''
      const customerId = await createOrUpdateCustomer(user.id, email)

      try {
        const session = await createCheckoutSession(user.id, `${successUrl}?session_id={CHECKOUT_SESSION_ID}`, cancelUrl)

        return NextResponse.json({
          sessionId: session.sessionId,
          url: session.url,
        })
      } catch (error) {
        console.error('[Payment] Checkout error:', error)
        return NextResponse.json(
          { error: 'Kunne ikkje opprette betalingssesjon' },
          { status: 500 }
        )
      }
    },
  })
}