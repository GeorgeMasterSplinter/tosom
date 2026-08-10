# FASE 5 — PAYMENT + AI + POLISH
# Oppsummering

**Dato:** 2026-06-26  
**Status:** FULLFØRT (payment + AI-struktur)

---

## 1. PAYMENT (STRIPE)

### Gjennomført

| Oppgave | Status | Detaljer |
|---------|-----|-------|
| Sjekk Stripe | ✅ | Ingen tidligere Stripe-integrasjon |
| Lag Stripe-integrasjon | ✅ | `lib/payment/stripe.ts` |
| Lag checkout API | ✅ | `app/api/payment/create-checkout-session/route.ts` |
| Lag webhook API | ✅ | `app/api/payment/webhook/route.ts` |

### Stripe-integrasjon

| Fil | Beskrivelse |
|-----|-|
| `lib/payment/stripe.ts` | Stripe client, checkout, webhook validation, subscription checks |
| `app/api/payment/create-checkout-session/` | POST /api/payment/create-checkout-session |
| `app/api/payment/webhook/` | POST /api/payment/webhook (Stripe events) |

### Miljøvariablar krevde

| Variabel | Beskrivelse |
|------|--|
| `STRIPE_SECRET_KEY` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret |
| `STRIPE_PRICE_ID` | Stripe price ID for premium |

### Premium-flow

1. Brukar klikkar "Oppgrader til Premium"
2. Kallar `POST /api/payment/create-checkout-session`
3. Stripe checkout opna
4. Etter betaling → webhook oppdaterer subscription
5. `session.user.isPremium = true` basert på `hasActiveSubscription()`

### Funksjonar

| Funksjon | Beskrivelse |
|------|--|
| `createCheckoutSession(userId, successUrl, cancelUrl)` | Opprett Stripe checkout |
| `getCustomerByUserId(userId)` | Hent Stripe customer |
| `hasActiveSubscription(userId)` | Sjekk om aktiv subscription |
| `createOrUpdateCustomer(userId, email)` | Opprett oppdater customer |
| `validateWebhook(event, payload, signature)` | Valider Stripe webhook |

---

## 2. AI-INTEGRASJON

### Gjennomført

| Oppgave | Status | Detaljer |
|---------|-----|-------|
| AI provider abstraksjon | ✅ | `lib/ai/provider.ts` |
| OpenAI implementation | ✅ | OpenAIProvider med fallback |
| AI_API_KEY | ✅ | Sett i `.env.example` |

### AI Provider Interface

| Metode | Beskrivelse |
|------|--|
| `generateMatchInsights(profileA, profileB)` | Match-insights basert på to profiler |
| `generateJourneyContext(journeyState)` | Journey-refleksjon |
| `generateProfileSuggestions(profile)` | Profil-forslag |

### Output-format

**MatchInsights:**
```typescript
{
  summary: string,
  strengths: string[],
  conversationStarter: string,
  depth: 'gentle' | 'moderate' | 'strong' | 'deep'
}
```

**JourneyContext:**
```typescript
{
  reflectionQuestion: string,
  suggestedTopic: string,
  gentlePrompt: string
}
```

**ProfileSuggestions:**
```typescript
{
  bioVariants: { tone: string; text: string }[],
  interestSuggestions: string[],
  improvementTips: string[]
}
```

### Fallback

Dersom `AI_API_KEY` ikkje er sett:
- Returnerer template-basert insight
- Ingen eksterne kall
- Ingen feil

---

## 3. KOMPONENTRYDDING

### Anbefaling

| Kategori | Tal | Handling |
|------|-|---|
| MatchCard-duplikat | 3 | Behald `ui5/MatchCard.tsx`, fjern andre |
| ChatWindow-duplikat | 3 | Behald `chat/ChatWindow.tsx`, fjern andre |
| ChatList-duplikat | 2 | Behald `chat/ChatList.tsx`, fjern annan |
| DashboardMatchBanner | 2 | Behald `dashboard/`, fjern root |
| DashboardMatchStatus | 2 | Behald `dashboard/`, fjern root |
| Launch/wave | 6 | Flytt til `legacy/experiments/` |
| Premium | 6 | Beheld som eksperiment |
| Relationship | 2 | Flytt til `legacy/experiments/` |
| Legacy | 1 | Slett `LegacyChatHeader.tsx` |

**Anbefalt:** Fullfør i Phase 6 med grep-basert import-opdatering.

---

## 4. STATISTIKK

| Kategori | Tall |
|--|-|
| Payment API-ruter | 2 (checkout + webhook) |
| AI-provider implementasjon | 1 (OpenAI + fallback) |
| Miljøvariablar krevde | 4 (STRIPE x3, AI_API_KEY) |
| Komponentar til rydding | ~14 |

---

## 5. MÅL: Fase 6 (Cleanup + Polish)

| Prioritet | Oppgave |
|------|--|
| HØY | Rydd 10 duplikat-komponentar |
| HØY | Flytt 8 eksperimentelle komponentar |
| HØY | Full API-migrering til createApiHandler |
| MEDIE | UI-polish på nøkkelflow |
| MEDIE | Bygg Stripe price i dashboard |
| LAV | Performance-optimalisering |

---

## 6. TO SOM MVP (PRODUKTDEFINISJON)

### Kjernefunksjonar

1. **Onboarding** → 10-trinns dyptprofil
2. **Resonans-matching** → éin match per 24t
3. **30-dagers reise** → guidet par-reise
4. **Guida chat** → daglege refleksjonar/oppgåver
5. **Premium** → fleire matchar + AI-insights

### Premium-funksjonar

| Funksjon | Gratis | Premium |
|------|--|-|
| Matchar/dag | 1 | 3 |
| AI-insights | ❌ | ✅ |
| Reise-length | 30 dagar | 60 dagar |
| Profil-forslag | ❌ | ✅ |
| Resonansmåling | ❌ | ✅ |

---

## 7. TO SOM SOM PRODUKT

### Konsept

ToSom er ein **roleg, privat relasjonsplattform** for vaksne (23+).

Kjerneverdier:
- Éin match per 24 time
- Ingen swipe, ingen feed
- Guidet 30-dagers reise
- Djupe samtalar, ikkje chat
- Nordisk design (mørk, gull, glass)

### Teknisk

- Next.js 15 App Router
- NextAuth v5 (magic links)
- PostgreSQL + Prisma
- Stripe (betaling)
- AI (OpenAI, gpt-4o-mini)
- Pusher (realtime chat)

### Design

- Nordic Gold Premium
- Mørk base (#0B0E11)
- Gull aksent (#D4AF37)
- Glassmorphism
- Myke animasjonar