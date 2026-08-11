/**
 * @deprecated (V2) Stripe er fjernet — bruker kun Vipps for betalinger.
 *
 * Denne filen beholdes midlertidig for bakover-kompatibilitet.
 * Ny betaling: Vipps direkte (349 NOK per periode).
 * Se docs/tosom-concept-v2-skisse.md for detaljer.
 */

import 'server-only'
import Stripe from 'stripe'

// ─── Konfigurasjon ───

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? ''
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? ''
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID ?? ''

// ─── Stripe client ───

/**
 * Hent Stripe client med validering.
 */
function getStripeClient(): Stripe {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY er ikke sett i miljøvariablar')
  }
  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia' as any,
    typescript: true,
  })
}

/**
 * Opprett checkout-session for premium-abonnement.
 */
export async function createCheckoutSession(
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  const stripe = getStripeClient()

  const session = await stripe.checkout.sessions.create({
    customer_email: undefined, // kan settest viss vi har email
    line_items: [
      {
        price: STRIPE_PRICE_ID || 'price_placeholder',
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    // Tilbakestill abonnementet etter 30 dagar (toSom-style: éin reise om gangen)
    subscription_data: {
      metadata: {
        userId,
      },
    },
  })

  return {
    sessionId: session.id,
    url: session.url ?? '',
  }
}

/**
 * Hent customer data frå Stripe.
 */
export async function getCustomerByUserId(userId: string): Promise<Stripe.Customer | null> {
  const stripe = getStripeClient()
  const customers = await stripe.customers.list({
    limit: 10,
  })

  for (const customer of customers.data) {
    if (customer.metadata?.userId === userId) {
      return customer
    }
  }

  return null
}

/**
 * Valider webhook event frå Stripe.
 */
export function validateWebhook(event: Stripe.Event, payload: Buffer, signature: string): Stripe.Event {
  const stripe = getStripeClient()

  return stripe.webhooks.constructEvent(
    payload,
    signature,
    STRIPE_WEBHOOK_SECRET
  )
}

/**
 * Sjekkar om ein user har aktiv subscription.
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const stripe = getStripeClient()
    const customer = await getCustomerByUserId(userId)
    if (!customer?.id) return false

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
    })

    return subscriptions.data.length > 0
  } catch {
    return false
  }
}

/**
 * Opprett customer i Stripe dersom han ikke finst.
 */
export async function createOrUpdateCustomer(
  userId: string,
  email: string
): Promise<string> {
  const stripe = getStripeClient()
  const existing = await getCustomerByUserId(userId)

  if (existing?.id) {
    return existing.id
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  return customer.id
}