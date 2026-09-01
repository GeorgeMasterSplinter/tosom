# TOSOM — SUPER-MASTERPLAN v2.0

**Dato:** 2026-08-24
**Commit:** `cd0b7e5`
**Status:** Kanonisk. Erstatter `TOSOM-SUPER-MASTERPLAN-v1.0.md` (arkivert i `archive/snapshots/`) og MASTERPLAN v2.0–v8.0 som referanse.
**Følgedokumenter:** `BETA-TEST-v1.0.md`, `TOSOM-BETA-DRIFTSPLAN-v1.1.md`, `SECURITY-STABILITY-PLAN-v2.0.md`, `MATCHING-TUNING-PLAN-v1.0.md`, `VIPPS-INTEGRATION-PLAN-v1.0.md`, `HOSTING-MIGRATION-PLAN-v1.0.md`, `ACT-PIPELINE-v1.0.md`

---

## Leseveiledning

Hver seksjon er merket:

| Merke | Betydning |
|---|---|
| 🔵 **KONSEPT** | Produktets intensjon. Uforanderlig uten Georges godkjenning. |
| 🟢 **IMPLEMENTERT** | Verifisert i kode med fil:linje. |
| 🔴 **AVVIK** | Kode og konsept er uenige. Referanse til tiltaks-ID. |

Konseptet er ikke endret i dette dokumentet. Det er beskrevet, verifisert og målt mot koden.

**Hva endret seg fra v1.0:** Ingen konseptendringer. Alle blokkere (B-1…B-7) er lukket, avvikene A-1…A-4 er rettet (M-1…M-6), teknisk gjelder G-1…G-5 er ryddet, matching-motoren fikk to nye bidireksjonelle dealbreakere (kjønn og alder, WP1), og onboarding fikk isolert draft-lagring med prefill (WP2). Se §18 for endringshistorikk.

---

# DEL I — PRODUKTET

## 1. Kjerne

### 🔵 KONSEPT
Tosom er en relasjonsplattform for voksne (21+). Ikke en datingapp.

Brukeren bygger en dyp, veiledet profil. Når profilen er ferdig, stiller brukeren seg i kø. **Natt til lørdag** kjøres én matcherunde. Får du en match, går dere inn i en guidet **30-dagers reise**.

> **Én match. Én reise. Én relasjon.**

**Seks grunnprinsipper:** Ro · Varme · To personer · Langsomhet · Guiding · Dybde

**Absolutt forbudt:** AI-chat · AI-coach · AI-partner · AI-genererte meldinger · feed · swipe · gamification · stressende varsler · push-mekanismer

Matching-motoren er **den eneste** AI-funksjonen i Tosom.

### 🟢 IMPLEMENTERT
Invariantene holder gjennom hele kodebasen. Det finnes ingen feed-rute, ingen swipe-komponent, ingen AI-tekstgenerering mot brukere. `config/features.ts` har ingen bryter som kan slå på noe av det.

Aldersgrensen (21+, invariant I-14) håndheves i `config/legal.ts` (`MIN_AGE = 21`), `components/AgeRequirement.tsx` og onboarding-validering.

---

## 2. Identitet og språk

### 🔵 KONSEPT
- **Farger:** Tosom Blue `#0A1A2A`, sekundær `#0F2233`, Nordic Gold `#D4AF37`, glass `rgba(255,255,255,0.04)`
- **Typografi:** Inter
- **Språk:** Bokmål — overalt: brukerflate, dokumentasjon, kodekommentarer og commit-meldinger. Varmt, modent, trygt, klart mot brukeren. Ingen nynorsk, svorsk, slang eller AI-språk.
- **Tagline:** *En reise for to*

### 🟢 IMPLEMENTERT
Tokens i `config/design-tokens.ts` og `tailwind.config.js`. Glassmorphism gjennomgående i `components/ui/`.

### 🔴 AVVIK — mindre
Kodekommentarer inneholder nynorsk-former («bare», «kilde», «fra», «einaste») i deler av `lib/matching/`, `config/matching.ts` og `lib/journey/engine.ts`. Regelen ble utvidet 2026-08-24 (bokmål overalt, se `ACT-PIPELINE` §5.5). Rydd ved neste berøring av filen — ikke en egen oppgave.

---

# DEL II — BRUKERREISEN

## 3. Onboarding

### 🔵 KONSEPT
Rolig, varm, sekvensiell oppbygging av en **privat** profil. Aldri offentlig — kun matching-motoren leser den.

### 🟢 IMPLEMENTERT
**13 steg** (indeks 0–12), `app/onboarding/OnboardingFlow.tsx` (617 linjer), `totalSteps = 13`.

| Steg | Innhold |
|---|---|
| 0 | Grunnprofil: navn, alder, kjønn, søker, **by + postnummer**, avstandspreferanse, aldersspann, høyde, kroppstype, livsstil, røyk, religion, barn |
| 1–11 | Personlighet, livssituasjon, tilknytning, kjærlighetsspråk, verdier, relasjonsstil, framtid, humor, grenser, moden nysgjerrighet |
| 12 | Oppsummering → start reisen |

Postnummer fanges i steg 0 og er inngangen til all geografi. `lib/profileCompletion.ts` beregner ferdiggrad; `lib/onboardingGuard.ts` hindrer tilgang til app-flater før fullført.

#### Draft og prefill (WP2, 2026-08-24)
Onboarding kan avbrytes midtveis uten data tap — og uten datakorupsjon:

| Del | Hvor |
|---|---|
| Lagring | `Profile.onboardingDraft Json?` — eget felt (migration `20260824085229_add_onboarding_draft`). **Ikke lenger i `deepProfileData`** — draft overskrev tidligere matching-felt som `psychometrics` og `wantsChildren`. |
| API | `app/api/onboarding/draft/route.ts` (GET/POST/DELETE), `app/api/onboarding/prefill/route.ts` (initialiser fra eksisterende profil) |
| Mapper | `lib/profile/toOnboardingData.ts` — DB-profil → flat onboarding-tilstand |
| Prioritering | Server-draft > prefill > localStorage (`OnboardingFlow.tsx`) |
| Rydding | Draft slettes først **etter** vellykket send i `app/api/profile/setup/route.ts`, som samtidig persisterer `grenser`, livsstilsgitter og `relasjonsStil` i profilen |

Mønsteret: en halv fullført profil er verdifull, men den skal aldri forsure den ferdige.

---

## 4. Matcherunden

### 🔵 KONSEPT
Én match per bruker. Ingen valg, ingen liste, ingen swipe. Motoren bruker **aldri** bilder, utseende eller overflate.

### 🟢 IMPLEMENTERT — natt til lørdag

`vercel.json` (2 scheduled crons, innenfor Vercel Hobby-grensen):
```json
{ "path": "/api/cron/matching", "schedule": "0 2 * * 6" }
{ "path": "/api/cron/journey",  "schedule": "0 4 * * *" }
```

`0 2 * * 6` = **lørdag kl. 02:00 UTC**. Ukentlig kadens, én runde. `app/api/cron/health` er en helse-rute uten schedule. Under beta kan rundens tidspunkt i praksis settes av admin: `/admin/tools` → «Kjør matching manuelt» (`/api/admin/run-matching`) — lukket B-6 (matching ventet på helg).

**Eneste levende motor:** `app/api/cron/matching/route.ts` (594 linjer).

#### Kjøresekvens

| # | Steg |
|---|---|
| 1 | `CRON_SECRET` via `timingSafeEqual` |
| 2 | Kill switch `isMatchingEnabled()` |
| 3 | Postgres advisory lock `123456789` |
| 4 | Les QUEUED FIFO, maks 3000, ekskl. `bannedAt`/`deletedAt` |
| 5 | Kohort-port: defer hvis `< MIN_COHORT_SIZE` |
| 6 | Bygg **differensiert** sperreliste fra `MatchHistory` (M-4) |
| 7 | Score alle par + dealbreakere (try/catch per par, M-3) |
| 8 | Grådig parvis kobling |
| 9 | Opprett `Match(active)` + `Conversation` + `JourneyProgress` + 2 × `Notification` |
| 10 | Tidsbudsjett 50 s (Vercel-grense 60 s) |

Ingen push, e-post eller SMS ved match — invariant I-4. (Beta-avvik flagget i `BETA-TEST` §4: match-e-post bak `BETA_MATCH_EMAIL`, av som standard.)

#### Terskler

| Konstant | Verdi | Kilde |
|---|---|---|
| `MIN_SCORE` | **40** | `config/matching.ts` |
| `MIN_COHORT_SIZE` | **2** | `config/matching.ts` |

Den 72-timers ventilen (`MAX_QUEUE_WAIT_HOURS`) var død logikk under ukentlig kadens og er fjernet (M-2). Køalder leves som observasjon i stedet (M-9).

#### Sperrelisten (M-4, løser A-4)
Ikke alle utfall fortjener samme behandling:

| Utfall | Sperre |
|---|---|
| `blocked` (rapport/blokkering) | **Permanent** — ufravikelig |
| `early_exit` | **Permanent** — én av dem valgte bort |
| `completed` / `new_journey` / `expired` | **6 måneder** |
| `found_each_other` | Irrelevant (kontoer slettet) |

Trygghet veier tyngre enn tilgang på kandidater; mennesker endrer seg.

#### Avvisningsobservasjon (M-12, WP1)
Hver avvisning i runden kategoriseres og teller i `rejectReasons`: `kjonn`, `alder`, `sperreliste`, `securitylevel`, `maturity`, `radius`, `score`. `app/api/cron/matching/rejectReason.ts` gir etikettene. Observasjon under beta avgjør om tersklene skal justeres — etter beta, med data i hånd.

### 🔵 KONSEPT — kø-regelen
Den som ikke får match, **venter til neste lørdag**. Ingen unntak, ingen hastevei. Dette er langsomheten som produktegenskap.

---

## 5. unifiedScore

### 🟢 IMPLEMENTERT
`lib/matching/unifiedScorer.ts` (`DIMENSION_WEIGHTS`) + `lib/matching/dimensions.ts`. Seks forskningsbaserte dimensjoner (FORSKNINGSMOTOR F-1…F-8), skala 0–100, vekter summerer til **1,00**:

| Dimensjon | Vekt | Instrument | Fallback |
|---|---|---|---|
| `values` — verdier | **0,25** | PVQ-10 (Pearson-korrelasjon) | ordoverlapp på kjerneverdier |
| `attachment` — tilknytning | **0,25** | 12 items angst/unnvikelse (stil-matrise) | relasjonsstil-overlap |
| `personality` — personlighet | **0,15** | BFI-10 (Big Five) | ordoverlapp på personlighet |
| `communication` — kommunikasjon | **0,15** | 6 items (Gottman) | ordoverlapp + stil-match |
| `emotionRegulation` — emosjonsregulering | **0,10** | ERQ-6 (reappraisal/undertrykking) | emosjonelle-behov-overlap |
| `lifeSituation` — livssituasjon | **0,10** | praktiske profildata | — (alltid tilgjengelig) |

Hver dimensjon har to lag: **psykometrisk** først (med skårer i profilen), **fallback til ordoverlapp** ved manglende data — ingen bruker blir uten score, og gamle profiler fortsetter å fungere. Manglende data gir nøytral 50.

Full referanse: `reference/matching-dimensions.md`. Terskler for observasjon og kalibrering etter beta: FORSKNINGSMOTOR F-9.

### Resonansnivåer — én kilde (M-1, løser A-3)
`lib/matching/resonanceLevel.ts` er kanonisk. `unifiedScorer` importerer nivået fra der — det finnes ikke lenger to terskelsett.

| Nivå | Score | Brukeren ser |
|---|---|---|
| `DEEP` | ≥ 80 | «Dyp resonans» |
| `STRONG` | 65–79 | «Sterk resonans» |
| `MODERATE` | 50–64 | «God resonans» |
| `GENTLE` | 40–49 | «Rolig resonans» |

### 🔵 KONSEPT — invariant I-12
Brukeren ser **ord, aldri tall**. Resonans skal ikke inviteres til numerisk sammenligning. Implementert via `RESONANCE_LABELS` og `toDimensionLabel()`.

---

## 6. Dealbreakere

### 🟢 IMPLEMENTERT (WP1, 2026-08-24)
`lib/matching/dealbreaker.ts` (326 linjer) — harde filtre før scoring. Hovedfunksjon: `sjekkAlleDealbreakers(queryUser, candidate)`.

| # | Sjekk | Regel | Status |
|---|---|---|---|
| 1 | **Kjønnspreferanse** (bidireksjonell) | Begge parters eksplisitte valg fra steg 1 må akseptere den andre. Åpne valg («Alle kjønner», «Kjemisk tiltrekning», legacy «begge») matcher ethvert kjent kjønn. Legacy/UI/seed-ordforråd normaliseres (`man`/`mann`/`male` → `man` osv.) | **Aktiv, ny** |
| 2 | **Alderspreferanse** (bidireksjonell) | Kandidatens alder må ligge i begge parters `agePrefMin`/`agePrefMax` fra steg 1 | **Aktiv, ny** |
| 3 | Modenhets-gap | Gap > 4 → avvis | Aktiv |
| 4 | Livsrytme-konflikt | morgen↔kveld, rask↔rolig → avvis | Kodet, **inaktiv** — ingen datakilde i dagens onboarding |
| 5 | Eksplisitte preferanser | `preferences.dealbreakers[]` mot `matchTags` | Kodet, **inaktiv** — ingen datakilde |
| 6 | Grenser | `boundaries.excludes` mot kandidatens `includes` | Aktiv |
| 7 | Radius | Tosidig: blokkér hvis over A **eller** B sin `distancePref` (haversine). Manglende koordinater → ikke blokkér, logges | Aktiv |
| 8 | Sikkerhetsnivå | usikker(1)/ambivalent(2)/sikker(3), gap ≥ 2 → avvis. Blandet arv-staving normaliseres (`secure`/`sikker`/`trygg`/`unsicher`/…). Ukjent/manglende → blokkerer ikke | Aktiv, normalisert (WP1) |

**Mønsteret er samlet:** *manglende eller ukjent data blokkerer aldri* — fravær av informasjon utestenger ingen. Dealbreakere beskytter, de spekulere ikke. Alle er **harde**.

### 🔵 KONSEPT
Motoren skal beskytte brukerne, ikke gamble. Et stort trygghetsgap er en reell risiko for utrygghet — derfor hard avvisning. Kjønns- og alderspreferanse er brukerens eksplisitte valg; å matche dem bort bryter kjerneløftet om én god match.


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

### 🟢 IMPLEMENTERT — én kilde (M-5/M-6, løser A-1 og A-2)
`lib/journey/engine.ts` (`PHASE_CONFIGS`, `THEME_RANGES`) er **eneste** fasedefinisjon. `JOURNEY_TOTAL_DAYS = 30`. `lib/match/journeySync.ts` importerer `dayToPhase` og `isPhotosAllowed` fra engine — det finnes ikke lenger uenige fasetabeller.

**Bilde-låsen håndheves server-side:** `app/api/chat/image/route.ts` sjekker `isPhotosAllowed(journey.day)` (dag ≥ 15) før bildedeling godkjennes. Invariant I-6 er nå teknisk sikret, ikke bare lovt.

Temaprogresjon: intro 1–5 · trygghet 6–12 · fordypning 13–20 · modning 21–26 · integrasjon 27–30.

Dagteller framføres av daglig cron `0 4 * * *`.

---

## 8. Chat

### 🔵 KONSEPT
Ikke «chat» — et rolig samtalerom. Ingen AI. 8–10 kategorier med 15–20 ferdige spørsmål. Brukeren trykker på et spørsmål, det legges i samtalen, begge svarer.

**Kategorier:** Trygghet · Verdier · Livsstil · Personlighet · Relasjonsstil · Kommunikasjon · Fremtid · Sårbarhet · Nærhet · Felles reise

### 🟢 IMPLEMENTERT
`app/chat/` med `ChatContainer`, `ChatHeader`, `MessageBubble`, `BliKjentPanel`, `OppgaverPanel`. Spørsmål via `/api/questions`. Sanntid via Pusher (`lib/pusher/`). Ulest håndteres i `lib/notifications/unread.ts`. Bilde-dealing låst til dag ≥ 15 (se §7).

Ingen AI-generering noe sted i chat-stien. Invarianten holder.

---

## 9. Avslutning

### 🔵 KONSEPT
Tre veier ut av en reise:

1. **«Vi fant hverandre»** — paret lykkes. Begge kontoer slettes. De trenger ikke Tosom lenger.
2. **Ny reise** — reisen var god nok til å fullføres, men ikke riktig. Tilbake til køen.
3. **Tidlig avslutning** — når som helst, av begge parter. Samtalen slettes for begge.

### 🟢 IMPLEMENTERT
`lib/journey/endJourney.ts` — utfall:
```ts
'completed' | 'early_exit' | 'blocked' | 'expired' | 'found_each_other' | 'new_journey'
```

`app/reisen/avslutning/page.tsx` gir valget. `/api/journey/exit` utfører.

Ved `found_each_other`: **PDF-eksport tilbys først** (`app/api/journey/export-pdf/route.ts`, lukket B-3), deretter slettes begge kontoer permanent; `MatchHistory`, `Report` og `AuditLog` beholdes. Vilkårene er ærlige (`app/vilkar/page.tsx`).

---

## 10. Loopen

```
REGISTRERING (beta: e-post + passord, auto-registrering — Vipps ved lansering)
   └→ ONBOARDING (13 steg, postnummer i steg 0, draft + prefill)
        └→ KØ (journeyState = QUEUED, matchQueuedAt satt)
             └→ ⏰ NATT TIL LØRDAG 02:00 — cron/matching
                  ├─ ingen match → bli i kø → neste lørdag
                  └─ match → Match(active) + Conversation
                                   + JourneyProgress + 2 × Notification
                       └→ REISEN dag 1–30 (cron/journey daglig 04:00)
                            ├─ dag 1–14  EARLY — uten bilder (server-side lås)
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
| Rammeverk | Next.js 15 (App Router), React |
| Språk | TypeScript (streng) |
| Database | PostgreSQL via Prisma 5 |
| Auth | NextAuth 5 — **beta:** e-post + passord (CredentialsProvider, auto-registrering, `lib/auth/config.ts`). **Lansering:** Vipps Login, eneste innlogging (se `VIPPS-INTEGRATION-PLAN-v1.0.md`) |
| Sanntid | Pusher |
| Feil | Sentry |
| E-post | `lib/email/` mot Resend (`EMAIL_SERVER_*`) — driftsvarsel alltid, match-e-post bak `BETA_MATCH_EMAIL` |
| Test | Jest (35 suiter, 311 tester) + Playwright |
| Drift | Vercel (2 scheduled crons + funksjoner). Migrering til Vercel/Neon/R2: `HOSTING-MIGRATION-PLAN-v1.0.md` |

**Omfang:** 116 API-ruter i `app/api/`, hvorav 3 cron-ruter (`matching`, `journey`, `health`), 2 scheduled i `vercel.json`.


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

Journey er ikke en egen modell. Den består av `JourneyStep` + `JourneyProgress`, koblet 1:1 til `Conversation`. `JourneyProgress` har composite unique `[userId, matchId]`.

**Ikke røre:** `Profile.deepProfileData` inneholder matching-kritiske felt (`psychometrics`, `wantsChildren`, `agePrefMin/Max`, …). Onboarding-draft ligger i sitt eget felt `Profile.onboardingDraft` — aldri i `deepProfileData` (WP2).

## 13. Kill switches

`config/features.ts`:

| Env | Standard | Virkning |
|---|---|---|
| `MATCHING_ENABLED` | `true` | `false` stanser runden; køen består |
| `REGISTRATION_ENABLED` | `true` | `false` lukker registrering |
| `MAINTENANCE_MODE` | `false` | `true` viser vedlikeholdsflate (brukes ved beta-avbrudd) |
| `PAYMENTS_ENABLED` | `false` | **`true` kaster ved oppstart** — Vipps-betaling finnes ikke ennå |
| `BETA_MATCH_EMAIL` | av | `true` sender match-e-post (beta-avvik fra I-4, flagget i `BETA-TEST` §4) |

Alle endres i Vercel uten deploy.

---

# DEL IV — VEIEN TIL BETA OG LANSERING

## 14. Blokkere — alle lukket

| ID | Sak | Status |
|---|---|---|
| B-1 | Magic link sendes aldri | ✅ Lukket — erstattet av e-post + passord (CredentialsProvider, auto-registrering) |
| B-2 | Vipps død kode | ✅ Lukket — CTA-er peker til `/login`, Vipps skjult bak `NEXT_PUBLIC_VIPPS_ENABLED` |
| B-3 | PDF-eksport mangler før sletting | ✅ Lukket — `app/api/journey/export-pdf/route.ts` |
| B-4 | Admin-eskalering | ✅ Lukket — `adminAuthGuard()` på alle admin-endepunkter |
| B-5 | E-post-rørlegging | ✅ Lukket — `lib/email/` mot Resend, `sendAlert` koblet |
| B-6 | Matching ventet på lørdag | ✅ Lukket — manuell matching via `/admin/tools` |
| B-7 | Cookiesalt kastet vanlige brukere ut | ✅ Lukket — `middleware.ts` leste rett cookie/salt; test: `__tests__/middleware-cookie-salt.test.ts` |

Avvikene fra PLATTFORMDIAGNOSE v2.0 er rettet via MATCHING-TUNING:

| ID | Sak | Status |
|---|---|---|
| A-1 | Bildesperre ikke håndhevet | ✅ M-6 — server-side lås i chat-image-ruten |
| A-2 | CHECKIN uoppnåelig / tre fasetabeller | ✅ M-5 — én kilde, `journeySync` importerer fra engine |
| A-3 | To resonansterskler | ✅ M-1 — `resonanceLevel` er kanonisk, `unifiedScorer` importerer |
| A-4 | Permanent sperreliste | ✅ M-4 — differensiert: permanent kun ved `blocked`/`early_exit` |

Teknisk gjelder G-1 (døde motorer), G-2 (kø-ventil), G-3 (`ai/memory.json`), G-4 (rate-limit), G-5 (dokumentasjon) er ryddet. Levende tilstand: **`ACT-STATE.json`**.

## 15. Rekkefølge — hva som gjenstår

Beta er teknisk klar. Rekkefølgen er definert i `BETA-TEST-v1.0.md` (åpen beta) og `TOSOM-BETA-DRIFTSPLAN-v1.1.md` (drift):

**Nå — før første tester (manuelt, ingen kode):**
Sjekklisten i `BETA-TEST` §10: Vercel-secrets, `MAINTENANCE_MODE` av, `DEV_LOGIN` av, admin-passord, support@-videresending, noreplay-autosvar.

**I beta:**
Observasjon via kommandopanelet (`/admin/`), terskeler røres ikke (DI-2), rettinger går gjennom patch → test → deploy (DI-3). `rejectReasons`-telling (M-12) avgjør sakte tuning.

**Etter beta — lansering (per `ACT-STATE.json`):**
Vipps Login (eneste innlogging) · Vipps Betaling 349 kr · gratis-kvote 5 000 reiser (atomisk teller) · geo-koordinater 100 % dekning · tetthetsbasert radius 30–300 / 50–400 km · S1 batch-transaksjoner + S3 fortsettelses-cron.

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

Enhver endring som bryter en invariant krever eksplisitt godkjenning fra George. **Eneste dokumenterte avvik i dag:** I-4 under beta, flagget i `BETA-TEST` §4 bak `BETA_MATCH_EMAIL` (av som standard).

---

## 17. Sluttord

Tosom er klar for å møte mennesker. Alle blokkere er lukket, alle dokumenterte avvik er rettet, tester er grønne, typene er rene, konseptet er intakt gjennom hele kodebasen.

Det gjenstår ikke arkitektur. Det gjenstår **kontakt**: la tester inn, se dem, og være der de trenger å finne deg.

## 18. Endringer v1.0 → v2.0

| Område | Endring | Kilde |
|---|---|---|
| Blokkere | B-1…B-7 alle lukket | `ACT-STATE.json` |
| Avvik | A-1…A-4 rettet (M-1…M-6) | `MATCHING-TUNING-PLAN` |
| Dealbreakers | Nytt: kjønns- og alderspreferanse (bidireksjonelle), sikkerhetsnivå normalisert | WP1, 2026-08-24 |
| Onboarding | Nytt: `onboardingDraft`-felt, prefill, prioriteringsrekkefølge | WP2, 2026-08-24 |
| Auth | Beta-modell dokumentert (e-post + passord), Vipps flyttet til lansering | `BETA-TEST` §3, `VIPPS-INTEGRATION-PLAN` |
| Avvisningsobservasjon | `rejectReasons` med `kjonn`/`alder`-kategorier | WP1, `cron/matching` |
| Størrelser | 116 API-ruter, 2 scheduled crons, 35 suiter / 311 tester | Verifisert 2026-08-24 |
| Alder | I-14: 21+ (var 23+ i eldre utgaver) | `config/legal.ts` |

---

*Denne dokumentet er den kanoniske kilde for systemet. Koden vinner alltid over dokumentasjonen — finner du avvik, rapporter det.*

