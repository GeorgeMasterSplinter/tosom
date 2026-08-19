# TOSOM — SUPER-MASTERPLAN v1.0

**Dato:** 2026-08-19
**Commit:** `bc1ef13`
**Status:** Kanonisk. Erstatter MASTERPLAN v2.0–v8.0 som referanse.
**Følgedokumenter:** `TOSOM-PLATTFORMDIAGNOSE-v2.0.md`, `SECURITY-STABILITY-PLAN-v2.0.md`, `MATCHING-TUNING-PLAN-v1.0.md`, `BETA-ACCESS-PLAN-v1.0.md`, `DOCS-RESTRUCTURE-v1.0.md`, `ACT-PIPELINE-v1.0.md`

---

## Leseveiledning

Hver seksjon er merket:

| Merke | Betydning |
|---|---|
| 🔵 **KONSEPT** | Produktets intensjon. Uforanderlig uten Georges godkjenning. |
| 🟢 **IMPLEMENTERT** | Verifisert i kode med fil:linje. |
| 🔴 **AVVIK** | Kode og konsept er uenige. Referanse til diagnose-ID. |

Konseptet er ikke endret i dette dokumentet. Det er beskrevet, verifisert og målt mot koden.

---

# DEL I — PRODUKTET

## 1. Kjerne

### 🔵 KONSEPT
Tosom er en relasjonsplattform for voksne (23+). Ikke en datingapp.

Brukeren bygger en dyp, veiledet profil. Når profilen er ferdig, stiller brukeren seg i kø. **Natt til lørdag** kjøres én matcherunde. Får du en match, går dere inn i en guidet **30-dagers reise**.

> **Én match. Én reise. Én relasjon.**

**Seks grunnprinsipper:** Ro · Varme · To personer · Langsomhet · Guiding · Dybde

**Absolutt forbudt:** AI-chat · AI-coach · AI-partner · AI-genererte meldinger · feed · swipe · gamification · stressende varsler · push-mekanismer

Matching-motoren er **den eneste** AI-funksjonen i Tosom.

### 🟢 IMPLEMENTERT
Invariantene holder gjennom hele kodebasen. Det finnes ingen feed-rute, ingen swipe-komponent, ingen AI-tekstgenerering mot brukere. `config/features.ts` har ingen bryter som kan slå på noe av det.

Aldersgrensen håndheves i `components/AgeRequirement.tsx` og onboarding-validering.

---

## 2. Identitet og språk

### 🔵 KONSEPT
- **Farger:** Tosom Blue `#0A1A2A`, sekundær `#0F2233`, Nordic Gold `#D4AF37`, glass `rgba(255,255,255,0.04)`
- **Typografi:** Inter
- **Språk:** Bokmål. Varmt, modent, trygt, klart. Ingen nynorsk, svorsk, slang, AI-språk eller passiv form.
- **Tagline:** *En reise for to*

### 🟢 IMPLEMENTERT
Tokens i `config/design-tokens.ts` og `tailwind.config.js`. Glassmorphism gjennomgående i `components/ui/`.

### 🔴 AVVIK — mindre
Kodekommentarer inneholder nynorsk-former («berre», «kjelde», «frå», «einaste») i bl.a. `lib/matching/resonanceLevel.ts`, `config/matching.ts`, `lib/journey/engine.ts`. Dette rammer **ikke** brukerflaten — språkmanualen gjelder brukerrettet tekst. Verdt å rydde ved neste berøring, ikke en egen oppgave.

---

# DEL II — BRUKERREISEN

## 3. Onboarding

### 🔵 KONSEPT
Rolig, varm, sekvensiell oppbygging av en **privat** profil. Aldri offentlig — kun matching-motoren leser den.

### 🟢 IMPLEMENTERT
**13 steg** (indeks 0–12), `app/onboarding/OnboardingFlow.tsx` (528 linjer), `totalSteps = 13`.

| Steg | Innhold |
|---|---|
| 0 | Grunnprofil: navn, alder, kjønn, søker, **by + postnummer**, avstandspreferanse, aldersspenn, høyde, kroppstype, livsstil, røyk, religion, barn |
| 1–11 | Personlighet, livssituasjon, tilknytning, kjærlighetsspråk, verdier, relasjonsstil, framtid, humor, grenser, moden nysgjerrighet |
| 12 | Oppsummering → start reisen |

Postnummer fanges i steg 0 og er inngangen til all geografi. `lib/profileCompletion.ts` beregner ferdiggrad; `lib/onboardingGuard.ts` hindrer tilgang til app-flater før fullført.

**Merk:** `ai/memory.json` sier `ui_steps: 9`. Koden sier 13. Se DOCS-RESTRUCTURE §4.

---

## 4. Matcherunden

### 🔵 KONSEPT
Én match per bruker. Ingen valg, ingen liste, ingen swipe. Motoren bruker **aldri** bilder, utseende eller overflate.

### 🟢 IMPLEMENTERT — natt til lørdag

`vercel.json`:
```json
{ "path": "/api/cron/matching", "schedule": "0 2 * * 6" }
{ "path": "/api/cron/journey",  "schedule": "0 4 * * *" }
```

`0 2 * * 6` = **lørdag kl. 02:00 UTC**. Ukentlig kadens, én runde.

**Eneste levende motor:** `app/api/cron/matching/route.ts` (406 linjer).

#### Kjøresekvens

| # | Steg | Referanse |
|---|---|---|
| 1 | `CRON_SECRET` via `timingSafeEqual` | `:34-37` |
| 2 | Kill switch `isMatchingEnabled()` | `config/features.ts:60` |
| 3 | Postgres advisory lock `123456789` | `:122-133` |
| 4 | Les QUEUED FIFO, maks 3000, ekskl. `bannedAt`/`deletedAt` | `:137-149` |
| 5 | Kohort-port: defer hvis `< MIN_COHORT_SIZE` | `:153-176` |
| 6 | Bygg sperreliste fra `MatchHistory` | `:179-182` |
| 7 | Score alle par + dealbreakere | `:185-232` |
| 8 | Grådig parvis kobling | — |
| 9 | Opprett `Match(active)` + `Conversation` + `JourneyProgress` + 2 × `Notification` | — |
| 10 | Tidsbudsjett 50 s (Vercel-grense 60 s) | `:31` |

Ingen push, e-post eller SMS ved match — invariant I-4.

#### Terskler

| Konstant | Verdi | Kilde |
|---|---|---|
| `MIN_SCORE` | **40** | `config/matching.ts:18` |
| `MIN_COHORT_SIZE` | **2** | `config/matching.ts:14` |
| `MAX_QUEUE_WAIT_HOURS` | 72 | `config/matching.ts:15` — 🔴 **død logikk, G-2** |

### 🔵 KONSEPT — kø-regelen
Den som ikke får match, **venter til neste lørdag**. Ingen unntak, ingen hastevei. Dette er langsomheten som produktegenskap.

### 🔴 AVVIK
- **G-2:** 72-timers ventilen kan aldri utløse en match. Se MATCHING-TUNING §2.
- **A-4:** Sperrelisten er permanent — kandidatrommet tømmes i små kohorter.

---

## 5. unifiedScore

### 🟢 IMPLEMENTERT
`lib/matching/unifiedScorer.ts:37-47`. Ni dimensjoner, skala 0–100, vekter summerer til **1,00**:

| Dimensjon | Vekt |
|---|---|
| `values` — kjerneverdier | **0,25** |
| `personality` | **0,20** |
| `relationshipStyle` | **0,15** |
| `communication` | **0,15** |
| `futureVision` | **0,10** |
| `boundaries` | **0,05** |
| `emotionalNeeds` | **0,05** |
| `lifeRhythm` | **0,03** |
| `maturity` | **0,02** |

```ts
const score = Math.round(
  Object.entries(W).reduce((sum, [key, weight]) =>
    sum + (breakdown[key] * weight), 0)
);
return { score: clamp(score, 0, 100), breakdown, level };
```

Manglende data gir nøytral 50 (`:101`, `:110`) — motoren straffer ikke tomme felt.

### Resonansnivåer
`lib/matching/resonanceLevel.ts:17-22` — kanonisk (B1.5):

| Nivå | Score | Brukeren ser |
|---|---|---|
| `DEEP` | ≥ 80 | «Dyp resonans» |
| `STRONG` | 65–79 | «Sterk resonans» |
| `MODERATE` | 50–64 | «God resonans» |
| `GENTLE` | 40–49 | «Rolig resonans» |

### 🔵 KONSEPT — invariant I-12
Brukeren ser **ord, aldri tall**. Resonans skal ikke inviteres til numerisk sammenligning. Implementert via `RESONANCE_LABELS` og `toDimensionLabel()`.

### 🔴 AVVIK — A-3
`unifiedScorer.getMatchLevel` bruker 80/60/40, `resonanceLevel` bruker 80/65/50/40. Score 62 gir to ulike svar.

---

## 6. Dealbreakere

### 🟢 IMPLEMENTERT
`lib/matching/dealbreaker.ts` — harde filtre før scoring:

| Sjekk | Regel |
|---|---|
| `checkMaturityGap` | Gap > 4 → avvis |
| `checkSecurityLevelGap` | usikker(1)/ambivalent(2)/secure(3), gap ≥ 2 → avvis |
| `checkLifeRhythmConflict` | morgen↔kveld, rask↔rolig → avvis |
| `checkExplicitPreferences` | `Profile.preferences.dealbreakers[]` |
| Radius | `haversineKm()` mot `distancePref` |

Alle er **harde**. Manglende data → ingen dealbreaker (`:20`, `:36`, `:66`) — fravær av informasjon avviser aldri noen.

### 🔵 KONSEPT
Motoren skal beskytte brukerne, ikke gamble. Et stort trygghetsgap er en reell risiko for utrygghet — derfor hard avvisning.

---

## 7. Reisen — dag 1 til 30

### 🔵 KONSEPT
Fire faser. Bilder først etter at trygghet er bygget.

| Fase | Dager | Innhold |
|---|---|---|
| EARLY | 1–14 | **Uten bilder** |
| BUILDING_TRUST | 15–21 | Bilder tillatt |
| DEEPER | 22–25 | Dypere samtaler |
| CHECKIN | 26–30 | Refleksjon og oppsummering |

### 🟢 IMPLEMENTERT — kanonisk kilde
`lib/journey/engine.ts:191-221` (`PHASE_CONFIGS`) samsvarer eksakt med konseptet. `JOURNEY_TOTAL_DAYS = 30`. `isPhotosAllowed(day) → day >= 15` (`:297`).

Temaprogresjon (`THEME_RANGES`, `:223-229`): intro 1–5 · trygghet 6–12 · fordypning 13–20 · modning 21–26 · integrasjon 27–30.

Dagteller framføres av daglig cron `0 4 * * *`.

### 🔴 AVVIK — A-1 og A-2 (alvorlig)

**Tre uenige fasedefinisjoner:**

| Kilde | EARLY | BUILDING_TRUST | DEEPER | CHECKIN |
|---|---|---|---|---|
| `engine.ts:191-221` ✅ | 1–14 | 15–21 | 22–25 | 26–30 |
| `journeySync.ts:9-14` ❌ | ≤14 | 15–21 | **22–30** | **aldri** |
| `seed-journey-content.ts` ❌ | 1–10 | 11–20 | 21–30 | aldri |

**To bildeporter, null håndhevelse:**
- `engine.ts:297` → dag ≥ 15
- `journeySync.ts:31,80` → dag ≥ 13
- `app/api/chat/image/route.ts` → **ingen sjekk**

`Conversation.imageShareAllowedAt` leses (`app/api/match/status/route.ts:94-102`) men **skrives aldri**.

Konsekvens: kjerneløftet «fase 1 er uten bilder» er ikke teknisk håndhevet.

---

## 8. Chat

### 🔵 KONSEPT
Ikke «chat» — et rolig samtalerom. Ingen AI. 8–10 kategorier med 15–20 ferdige spørsmål. Brukeren trykker på et spørsmål, det legges i samtalen, begge svarer.

**Kategorier:** Trygghet · Verdier · Livsstil · Personlighet · Relasjonsstil · Kommunikasjon · Fremtid · Sårbarhet · Nærhet · Felles reise

### 🟢 IMPLEMENTERT
`app/chat/` med `ChatContainer`, `ChatHeader`, `MessageBubble`, `BliKjentPanel`, `OppgaverPanel`. Spørsmål via `/api/questions`. Sanntid via Pusher (`lib/pusher/`). Ulest håndteres i `lib/notifications/unread.ts`.

Ingen AI-generering noe sted i chat-stien. Invarianten holder.

---

## 9. Avslutning

### 🔵 KONSEPT
Tre veier ut av en reise:

1. **«Vi fant hverandre»** — paret lykkes. Begge kontoer slettes. De trenger ikke Tosom lenger.
2. **Ny reise** — reisen var god nok til å fullføres, men ikke riktig. Tilbake til køen.
3. **Tidlig avslutning** — når som helst, av begge parter. Samtalen slettes for begge.

### 🟢 IMPLEMENTERT
`lib/journey/endJourney.ts:31` — utfall:
```ts
'completed' | 'early_exit' | 'blocked' | 'expired' | 'found_each_other' | 'new_journey'
```

`app/reisen/avslutning/page.tsx` gir valget. `/api/journey/exit` utfører.
Ved `found_each_other` (`:211-213`): begge kontoer slettes permanent; `MatchHistory`, `Report` og `AuditLog` beholdes.

Vilkårene er ærlige (`app/vilkar/page.tsx:112`).

### 🔴 AVVIK — B-3 (blokker)
UI lover PDF-eksport før sletting (`avslutning/page.tsx:240`, `showPdfOffer`). **Ingen PDF-generator finnes.** Eneste eksport er JSON (`/api/settings/export`).

To mennesker som lykkes mister 30 dager med samtaler — etter å ha blitt lovet det motsatte. Dette er besluttet som **blokker før beta**.

---

## 10. Loopen

```
REGISTRERING
   └→ ONBOARDING (13 steg, postnummer i steg 0)
        └→ KØ (journeyState = QUEUED, matchQueuedAt satt)
             └→ ⏰ NATT TIL LØRDAG 02:00 — cron/matching
                  ├─ ingen match → bli i kø → neste lørdag
                  └─ match → Match(active) + Conversation
                                   + JourneyProgress + 2 × Notification
                       └→ REISEN dag 1–30 (cron/journey daglig 04:00)
                            ├─ dag 1–14  EARLY — uten bilder
                            ├─ dag 15–21 BUILDING_TRUST — bilder
                            ├─ dag 22–25 DEEPER
                            └─ dag 26–30 CHECKIN
                                 └→ AVSLUTNING
                                      ├─ «Vi fant hverandre» → PDF → begge slettes
                                      ├─ «Ny reise» → tilbake til KØ
                                      └─ tidlig exit → samtale slettes → KØ
```

**Én aktiv reise per bruker om gangen.** Ingen parallelle relasjoner. Dette er selve produktet.

---

# DEL III — TEKNISK

## 11. Stack

| Lag | Teknologi |
|---|---|
| Rammeverk | Next.js 15.1.7 (App Router), React |
| Språk | TypeScript (streng) |
| Database | PostgreSQL via Prisma 5.14 |
| Auth | NextAuth 5.0.0-beta.25 |
| Sanntid | Pusher |
| Feil | Sentry |
| Test | Jest (157 tester) + Playwright |
| Drift | Vercel (cron + funksjoner) |

**Omfang:** 109 API-ruter, 3 cron-ruter.

## 12. Datamodell — fasit

Fra `Splinter.md` §5, verifisert mot `prisma/schema.prisma`:

✅ **Riktig:**
```ts
conversation.userAId
conversation.userBId
conversation.journeyStep
conversation.journeyProgress
```

❌ **Aldri:**
```ts
journey.userAId · journey.userBId · journey.progressDay
journey.day · journey.progress · ConversationJourney
```

Journey er ikke en egen modell. Den består av `JourneyStep` + `JourneyProgress`, koblet 1:1 til `Conversation`. `JourneyProgress` har composite unique `[userId, matchId]` (`lib/match/journeySync.ts:19`).

## 13. Kill switches

`config/features.ts`:

| Env | Standard | Virkning |
|---|---|---|
| `MATCHING_ENABLED` | `true` | `false` stanser runden; køen består |
| `REGISTRATION_ENABLED` | `true` | `false` lukker registrering |
| `MAINTENANCE_MODE` | `false` | `true` viser vedlikeholdsflate |
| `PAYMENTS_ENABLED` | `false` | **`true` kaster ved oppstart** — ingen betalingsvei finnes (`:29-38`) |

Alle endres i Vercel uten deploy.

---

# DEL IV — VEIEN TIL BETA

## 14. Blokkere

| ID | Sak | Dokument |
|---|---|---|
| 🔴 B-1 | Magic link sendes aldri | BETA-ACCESS §2 |
| 🔴 B-2 | Vipps-callback er død kode | BETA-ACCESS §3 |
| 🔴 B-3 | PDF-eksport mangler før sletting | BETA-ACCESS §6 |
| 🔴 B-4 | Admin-endepunkter kan eskaleres | SECURITY §3 |
| 🟠 A-1 | Bildesperre ikke håndhevet | MATCHING-TUNING §8 |
| 🟠 A-2 | CHECKIN uoppnåelig | MATCHING-TUNING §8 |
| 🟠 A-3 | To resonansterskler | MATCHING-TUNING §3 |
| 🟠 A-4 | Permanent sperreliste | MATCHING-TUNING §6 |

## 15. Rekkefølge

**Runde 1 — blokkere (2–3 dager):** B-1 → B-4 → A-2 → A-1 → A-3 → B-2
**Runde 2 — PDF (1–2 dager):** B-3
**Runde 3 — beta-drift:** invitasjonsport, observasjon, A-4
**Runde 4 — opprydding:** G-1, G-2, G-3, G-5

Detaljert utførelse: `ACT-PIPELINE-v1.0.md`.

---

## 16. Invarianter — må aldri brytes

| # | Invariant |
|---|---|
| I-1 | Én match per bruker om gangen |
| I-2 | Matching bruker aldri bilder eller utseende |
| I-3 | Brukeren velger aldri mellom flere matcher |
| I-4 | Ingen push/e-post/SMS ved match |
| I-5 | Reisen er 30 dager, fire faser |
| I-6 | Ingen bilder før dag 15 |
| I-7 | Ingen AI-generert tekst mot brukere |
| I-8 | Ingen feed, swipe eller gamification |
| I-9 | Profilen er privat — kun motoren leser den |
| I-10 | Matcherunden er ukentlig, natt til lørdag |
| I-11 | Uten match → vent til neste lørdag |
| I-12 | Brukeren ser ord, aldri tall |
| I-13 | «Vi fant hverandre» sletter begge kontoer |
| I-14 | Aldersgrense 21+ |

Enhver endring som bryter en invariant krever eksplisitt godkjenning fra George.

---

## 17. Sluttord

Tosom er nærmere ferdig enn dokumentasjonen antyder. Tester er grønne, typene er rene, konseptet er intakt gjennom hele kodebasen.

Det som gjenstår er ikke arkitektur, men **konsolidering**: velge én sannhet der det i dag finnes tre, og innfri de løftene grensesnittet allerede gir.

Fire blokkere skiller Tosom fra ekte brukere. Alle er avgrensede. Ingen krever omskriving.