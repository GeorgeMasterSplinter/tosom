# Betalingsstrategi – Beslutningsdokument

**Dato:** 2026-08-13
**Steg:** 10.3 (TOSOM-ACT-INSTRUKS-v2.0)
**Status:** BESLUTTET

## Konklusjon

Stripe er valgt som **primær betalingsløsning for lansering**. Vipps forblir i dag **kun OAuth-innlogging** (ikke ePayment). Ingen kodeendring kreves utover dette dokumentet.

## Begrunnelse

1. Stripe er allerede integrert i `app/api/payment/*` og klar for checkout-flows.
2. Ingen reell betalingsgating eksisterer i dag — ingen bruker taper funksjonalitet ved å utsette Vipps ePayment.
3. Vipps som OAuth-innlogging fungerer uavhengig av Stripe.
4. Utsettelse til etter lansering reduserer lanseringsrisiko og kompleksitet.

## Fremtidige steg (etter lansering)

- Vurdere Vipps ePayment som supplement til Stripe dersom markedskrav tilsier det.
- Implementere idempotens på Stripe-webhook (STEG 10.2 — krever WebhookEvent Prisma-modell).
- Fullføre webhook-behandling for `checkout.session.completed`.

## Referanser

- `app/api/payment/create-checkout-session/route.ts`
- `app/api/payment/webhook/route.ts`
- `lib/payment/stripe.ts`