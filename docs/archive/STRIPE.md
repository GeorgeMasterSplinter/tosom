# Stripe-integrasjon — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom bruker Stripe for betalingshandsaming:
- **Test-mode** for utvikling
- **Webhooks** for event-handsaming
- **Checkout** for abonnement

---

## KONFIGURASJON

```bash
# Test-mode (alltid aktiv i dev)
STRIPE_MODE=test

# Stripe-nøklar
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Produkt-ID-ar (oppdater etter setup i Stripe dashboard)
STRIPE_PREMIUM_PRICE_ID=price_xxxxx
STRIPE_VIP_PRICE_ID=price_yyyyy
```

---

## STRUKTUR

```
lib/payment/stripe.ts        # Stripe client + funksjonar
app/api/payment/             # Payment API-ruter
├── create-checkout-session/route.ts
└── webhook/route.ts
```

---

## BETALE-PLAN

| Plan | Pris | Funksjonar |
|--|--|--|
| **Free** | 0 kr | Basis-matching, 1 reise |
| **Premium** | 199 kr/mnd | AI-guidance, resonance-charts |
| **VIP** | 399 kr/mnd | Priority-matching, personal insights |

---

## TEST-BETALING

### Test-kortnummer
```
4242 4242 4242 4242  (suksess)
4000 0000 0000 9995  (avvist)
4000 0025 0000 3155  (auth required)
```

### Andre test-data
```
Dato: 12/34
CVC: 123
ZIP: 1234
```

---

## WEBHOOK-HANDLER

Webhooks handsamar:
- `checkout.session.completed` → Aktiver premium
- `invoice.payment_succeeded` → Fortset abonnement
- `invoice.payment_failed` → Send påminning
- `customer.subscription.deleted` → Deaktiver premium

---

## SETUP I PRODUKSJON

1. Opprett Stripe-konto
2. Fyll inn STRIPE_SECRET_KEY
3. Oppsett webhook endpoint: `https://tosom.no/api/payment/webhook`
4. Opprett produkt i Stripe dashboard
5. Kopier price_id til miljøvariablar

---

## FEILFINDING

### "Webhook signature invalid"
Sjekk at STRIPE_WEBHOOK_SECRET er riktig

### "Payment failed"
Sjekk test-kort og API-nøkle

---

## HUSK

- Alltid test-mode i utvikling
- Aldri eksponer STRIPE_SECRET_KEY
- Webhook må være HTTPS i produksjon