/**
 * ToSom — Create Checkout Session (Stripe)
 *
 * POST /api/payment/create-checkout-session
 */

import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { createApiHandler } from '@/lib/api/handler'
import { createCheckoutSession, createOrUpdateCustomer } from '@/lib/payment/stripe'

export const dynamic = 'force-dynamic'

// Zod-skjema for checkout
const CheckoutSchema = z.object({
  plan: z.enum(['premium']).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export async function POST(req: NextRequest) {
  return createApiHandler(req, {
    auth: true,
    rateLimit: { windowMs: 60_000, maxRequests: 5, strict: true },
    handler: async ({ user }) => {
      if (!user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // Les body fra JSON (ikke query params)
      let body: z.infer<typeof CheckoutSchema> = {}
      try {
        body = CheckoutSchema.parse(await req.json())
      } catch {
        // Fallback til defaults om body mangler eller er ugyldig
        body = {}
      }

      const successUrl = body.successUrl ?? `${req.nextUrl.origin}/dashboard`
      const cancelUrl = body.cancelUrl ?? `${req.nextUrl.origin}/priser`

      // Opprett customer i Stripe
      const email = user.email ?? ''
      const customerId = await createOrUpdateCustomer(user.id, email)

      try {
        const session = await createCheckoutSession(
          user.id,
          successUrl,
          cancelUrl
        )

        return NextResponse.json({
          sessionId: session.sessionId,
          url: session.url,
        })
      } catch (error) {
        console.error('[Payment] Checkout error:', error)
        return NextResponse.json(
          { error: 'Kunne ikke opprette betalingssesjon' },
          { status: 500 }
        )
      }
    },
  })
}