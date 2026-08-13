# TOSOM-MASTERPLAN v2.0

**Dato:** 13. august 2026
**Commit-basis:** `7f2d269` (main)
**Erstatter:** `docs/tosom-masterplan-v4.md`
**Underlag:** `ACT-STATE.json`, `TOSOM-ACT-FINAL-REPORT.md`, `TOSOM-PLATTFORMDIAGNOSE-v1.0.md`, `tosom-concept-v2-skisse.md`, `journey-engine-refactor-plan.md`, `match-status-lifecycle.md`, `design-token-migration-guide.md`, `repo-structure.md`, `SECURITY-STABILITY-PLAN-v1.md`, `PAYMENT-STRATEGY-DECISION.md`
**Metode:** Dokumentanalyse + **verifisering mot faktisk kode og faktisk kjøring** av `tsc`, `jest`, `prisma format`, samt manuell lesing av `middleware.ts`, `vercel.json`, cron-ruter, betalings-webhook og `prisma/schema.prisma`.

**Fastsatte beslutninger for v2.0 (George, 13.08.2026):**

| # | Spørsmål | Beslutning |
|---|---|---|
| 1 | Betalingsløsning | **Vipps only.** Stripe fjernes fullstendig fra v2.0 |
| 2 | Lanseringsmodell | **Gratis lansering.** Premium utsettes til v2.1/v3.0 |
| 3 | 300k-horisont | **12–24 måneder.** Arkitekturen forberedes nå, ikke bygges ferdig nå |

---

## INNHOLD

- [DEL 0 — Sammendrag og kritiske avvik](#del-0--sammendrag-og-kritiske-avvik)
- [DEL 1 — ToSom som konsept og levende system](#del-1--tosom-som-konsept-og-levende-system)
- [DEL 2 — Plattformens tilstand etter ACT-fasen](#del-2--plattformens-tilstand-etter-act-fasen)
- [DEL 3 — Konkrete forbedringsforslag](#del-3--konkrete-forbedringsforslag)
- [DEL 4 — Skaleringsstrategi mot 300 000 brukere](#del-4--skaleringsstrategi-mot-300000-brukere)
- [DEL 5 — Sikkerhetsrevisjon](#del-5--sikkerhetsrevisjon)
- [DEL 6 — Masterplan: roadmap, score og 30–60 dagers plan](#del-6--masterplan-roadmap-score-og-3060-dagers-plan)
- [APPENDIKS](#appendiks)

---

# DEL 0 — SAMMENDRAG OG KRITISKE AVVIK

## 0.1 Hovedkonklusjon

ToSom har et **gjennomtenkt konsept, en reell matching-motor og en gjennomarbeidet journey-modell**. Fundamentet er ikke tomt — det er bygget av noen som forstår hva de vil lage. Men plattformen er **ikke lanseringsklar**, og avstanden er større enn ACT-sluttrapporten antyder.

**Lanseringsscore: 31 %.**

Tre av kjernefunksjonene fungerer ikke for en reell bruker i dag:

1. **Ingen matcher blir generert** — cron-jobbene returnerer 401 hver natt.
2. **Ingen journey ruller** — samme årsak.
3. **Sesjonsvernet kan omgås med én cookie** — inkludert admin-tilgang.

Dette er ikke «restarbeid». Dette er at det levende systemet står stille.

## 0.2 Det viktigste avviket: rapport vs. virkelighet

`TOSOM-ACT-FINAL-REPORT.md` §6 konkluderer med «Build grønn, TypeScript ren, CI-pipeline oppgradert», og `tosom-masterplan-v4.md` §9 anslår **90–95 % lanseringsklarhet**. `TOSOM-PLATTFORMDIAGNOSE-v1.0.md` anslår **27 %**.

**Diagnosen er nærmere sannheten.** Årsaken til divergensen er strukturell og verdt å forstå, fordi den vil gjenta seg:

> ACT-fasen validerte hvert steg med `tsc`, `grep` og `build`. Alle tre kan være grønne samtidig som funksjonaliteten er ødelagt. En kompilerende auth-bypass kompilerer fint. En cron som returnerer 401 bygger fint. Et grep-treff bekrefter at en streng finnes — ikke at den virker.

**Lærdom for v2.0: valideringskriteriet må endres fra «kompilerer» til «fungerer ende-til-ende».**

## 0.3 De fem verifiserte kritiske funnene

### FUNN 1 — Total auth-bypass i middleware (KRITISK)

`middleware.ts:60-64`:
```ts
function hasValidSession(req: NextRequest): boolean {
  const token = getSessionToken(req)
  if (token) return true      // ingen signaturverifisering
  return false
}
```

Enhver ikke-tom cookie gir tilgang. `Cookie: authjs.session-token=x` åpner alt under `/api/profile`, `/api/match`, `/api/journey`, `/api/conversation`, `/api/chat`, `/api/system`, `/api/ai`, `/api/admin` (`middleware.ts:39-48`).

Verre — `middleware.ts:66-75` leser rollen fra **usignert base64-JSON**:
```ts
function getRoleFromSession(req: NextRequest): string | null {
  const token = getSessionToken(req)
  if (!token) return null
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    return payload?.role ?? null
  } catch {
    return null
  }
}
```

Kombinert med admin-blokken (`middleware.ts:118-139`) gir `authjs.session-token = base64('{"role":"admin"}')` full tilgang til `/admin/*`.

**Dette er direkte forårsaket av ACT-fasen.** Avvik 9 og 10 i `ACT-STATE.json`:
- *«STEG 3.3: Erstattet signIn('credentials') med HMAC-signert tosom_session-cookie»*
- *«STEG 3.4: Erstattet tosom_session med authjs.session-token (base64 JSON payload)»*

Steg 3.3 innførte HMAC-signering. Steg 3.4 **fjernet den igjen** og erstattet den med base64 — som ikke er kryptografi, bare koding. Sikkerheten ble netto svakere enn før ACT-fasen startet.

**Tilleggsfunn:** `middleware.ts:134` sammenligner `role !== 'admin'` (små bokstaver), mens `lib/auth/roles.ts` bruker `'ADMIN'`. Rollesjekken er inkonsistent med resten av systemet.

### FUNN 2 — Begge cron-jobber er døde i produksjon (KRITISK)

`vercel.json:4-13` kaller:
```json
{ "path": "/api/cron/matching?secret=627562342a0035f120707dd29b4f82dd", "schedule": "0 5 * * *" },
{ "path": "/api/cron/journey?secret=627562342a0035f120707dd29b4f82dd",  "schedule": "0 7 * * *" }
```

Men `app/api/cron/matching/route.ts:34-38` krever Authorization-header og avviser query-param:
```ts
const authHeader = req.headers.get('authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Resultat: 401 klokken 05:00 og 07:00, hver natt.** Ingen matcher genereres. Ingen journey-dager ruller. Hele det levende systemet står stille — og feilen er stille, fordi ingen overvåker cron-responskoder.

Dette oppstod i ACT-fasen (STEG 1.12/1.13 flyttet secret fra query til header) uten at `vercel.json` ble oppdatert tilsvarende.

**Sekundært:** cron-secret ligger i klartekst i en committet fil. Den må roteres uansett.

**Tertiært, og talende:** `__tests__/cron-auth.test.ts` — testen som skulle fange nettopp dette — feiler selv, fordi `CRON_SECRET` mangler i testmiljøet. Testen tester dessuten en lokal kopi av logikken (`simulateCronAuth`), ikke den faktiske ruten, og ville derfor aldri fanget avviket mot `vercel.json`.

### FUNN 3 — Matching skalerer ikke i det hele tatt (KRITISK for konseptet)

Matching-pipelinen har `take: 50` på to nivåer, kombinert med én daglig cron-kjøring. Det gir et **tak på ~50 matcher per døgn, uavhengig av brukerbasens størrelse**.

| Brukerbase | Tid før alle har fått én match |
|---|---|
| 5 000 | ~100 døgn |
| 50 000 | ~2,7 år |
| 300 000 | **~16,4 år** |

Fjerner man `take`-grensen for å «fikse» det, får man O(n²) parvis scoring i JavaScript med alle Json-profilfelt lastet i minne — som gir OOM og timeout lenge før 300k.

**Begge veier er blindveier.** Kjernefunksjonen «én match per 24 timer» er arkitektonisk ikke levert. Dette er det største enkeltfunnet for produktet, ikke bare for skalering.

### FUNN 4 — Premium-loopen eksisterer ikke

`app/api/payment/webhook/route.ts:36-69` — alle tre event-typer gjør kun logging:
```ts
case 'checkout.session.completed': {
  const session = event.data.object
  console.log('[Payment] Checkout completed:', { ... })
  // TODO: Oppdater subscription-status i databasen når Prisma-modell finnes
  break
}
```

- Ingen premium-/subscription-felt i `prisma/schema.prisma`
- Ingen `isPremium`-sjekk noe sted i `app/` eller `lib/`
- **Ingen funksjon er gated bak betaling**
- `WebhookEvent`-modellen mangler (STEG 10.2 FAILED) → ingen idempotens

Signaturverifiseringen er derimot korrekt implementert (`lib/payment/stripe.ts:92-100`, rå body i `webhook/route.ts:19-21`). Håndverket er riktig; funksjonen er bare ikke koblet til noe.

Gitt beslutning 1 og 2 (Vipps only, gratis lansering) er dette **ikke en lanseringsblokker** — men Stripe-koden må fjernes, ikke ligge halvferdig.

### FUNN 5 — CI er rød, ikke grønn

Jeg kjørte den faktisk:

```
Test Suites: 3 failed, 1 passed, 4 total
Tests:       6 failed, 72 passed, 78 total
```
```
$ npx prisma format --check
! There are unformatted files. Run prisma format to format them.
```

| CI-jobb | Status | Årsak |
|---|---|---|
| `lint` | ✅ | — |
| `typecheck` | ✅ | 0 feil (bekreftet) |
| `build` | ⚠️ | Usikker — `ADMIN_JWT_SECRET` settes ikke i CI |
| `test` | ❌ | 3 av 4 suiter feiler |
| `e2e` | ❌ | **Ingen `services: postgres` i `ci.yml`.** Kan ikke passere |
| `prisma` | ❌ | `prisma format --check` → exit 1 |
| `lang-guard` | ❌ | 1 treff (nynorsk/språkblanding) |
| `ai-guard` | ✅ | 0 treff — men mønsteret er `components/ai`, og `components/ui/ai/` med 4 filer fanges ikke |

**Rotårsak for `test`:** `lib/auth/admin-jwt.ts:13` kaster på module-scope når `ADMIN_JWT_SECRET` mangler. Variabelen finnes bare i `.env.local` (gitignorert). Enhver testfil eller rute som importerer modulen krasjer i CI.

ACT-rapporten oppgir «CI/CD: Lint → TypeCheck → Build → Unit Tests → E2E → Prisma Validate → Guards» som en styrke. Pipelinen *finnes*, men fire av ni jobber er røde.

### Tilleggsfunn — manglende indeks på meldinger

`prisma/schema.prisma` — `Message`-modellen (linje 149-167) har kun `@@index([createdAt])` (linje 165). **Ingen indeks på `conversationId`.**

Hver chat-innlasting gjør full table scan på meldingstabellen — den tabellen som vokser raskest av alle. Dette er den enkleste og mest verdifulle databasefiksen i hele planen.

## 0.4 Hva som faktisk er bra

Det er viktig å være presis her, ellers blir planen urettferdig:

- **TypeScript er rent.** 0 feil, verifisert. Det er en reell prestasjon på ~709 filer.
- **Cron-autentisering er riktig implementert** — timing-safe sammenligning via `timingSafeEqual` (`app/api/cron/matching/route.ts:19-23`). Den er bare ikke koblet riktig til `vercel.json`.
- **Advisory lock mot overlappende cron-kjøringer** (`pg_try_advisory_lock`, `matching/route.ts:48-50`) er gjennomtenkt driftstenkning.
- **Stripe signaturverifisering er korrekt** — rå body, ikke `.json()`. Mange gjør dette feil.
- **Matching-motoren er reell** — `unifiedScorer.ts` (336 linjer) med 9 dimensjoner, definerte vekter og dealbreaker-filtre. Ikke en attrapp.
- **Journey-innholdet er gjennomarbeidet** — 30 dager med faktisk redaksjonelt innhold, fasemodell, milepæler.
- **Databaseskjemaet er godt normalisert** — 25 modeller, 15 enums, gjennomtenkte relasjoner og stort sett fornuftig indeksering.
- **Transaksjoner på match-aksept** og unique constraints på `Conversation`/`JourneyMilestone` — reell dataintegritetstenkning.
- **Sentry er installert og koblet inn.**
- **Admin-panelet er bredt og modent** for et produkt på dette stadiet.

Problemet er ikke mangel på kompetanse. Problemet er at **de siste 5 % kobling mangler på flere kritiske steder samtidig**, og at valideringen ikke fanget det.

---

# DEL 1 — TOSOM SOM KONSEPT OG LEVENDE SYSTEM

## 1.1 Konseptet i én setning

> ToSom er en rolig, privat, kunnskapsbasert relasjonsplattform for voksne. Ingen swiping, ingen feed, ingen AI-partner. Du bygger en dyp profil, mottar **én** match innen 24 timer, og går gjennom en guidet **30-dagers reise** med det ene mennesket.

Filosofien er en bevisst negasjon av markedet: **én match, én reise, én relasjon.** Der Tinder maksimerer valg, minimerer ToSom det. Der andre apper maksimerer tid-i-app, vil ToSom at du skal *slutte* å bruke appen og begynne å snakke med et menneske.

Dette har en viktig arkitektonisk konsekvens: **ToSom er ikke en app brukeren driver — det er et system som driver seg selv.** Brukeren logger inn og finner at noe har skjedd mens hun sov. Match ble laget klokka 05:00. Dag 7 av reisen begynte klokka 07:00. Ingenting av dette utløses av brukerhandling.

Derfor er cron-loopen ikke en bakgrunnsdetalj. **Den er produktet.** Og derfor er FUNN 2 så alvorlig: når cron står, står ToSom — selv om alle sider laster feilfritt.

## 1.2 De tre grunnpilarene

| Pilar | Betydning | Implementasjon |
|---|---|---|
| **Privat profil** | Ingen ser profilen din. Ingen bilder før dag 15. Ingen browsing. | 13 onboarding-steg, ~75 felt, `Profile`-modellen |
| **Kunnskapsbasert matching** | Match beregnes fra dyp psykologisk profil, ikke fra utseende. | `unifiedScorer.ts`, 9 dimensjoner + dealbreakere |
| **Guidet 30-dagers reise** | Struktur og tempo, ikke tomt chat-vindu. | `lib/journey/engine.ts`, 3 faser, dag 1–30 innhold |

## 1.3 Systemet som seks løkker

ToSom består av seks løkker som til sammen utgjør et kretsløp. Fem av dem er tidsstyrte eller hendelsesstyrte; én er menneskestyrt.

```
                         ┌───────────────────────────────────┐
                         │   ONBOARDING (13 steg, ~75 felt)  │
                         │   Menneskestyrt · engangs         │
                         └────────────────┬──────────────────┘
                                          │ profil komplett
                                          ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │                      ⏰ CRON-LOOP  (systemets hjerte)                │
   │              05:00 → matching        07:00 → journey                 │
   │                     ⛔ STATUS: DØD (401) — FUNN 2                    │
   └───────────┬──────────────────────────────────────┬───────────────────┘
               │                                      │
               ▼                                      ▼
   ┌───────────────────────────┐         ┌────────────────────────────────┐
   │      MATCHING-LOOP        │         │        JOURNEY-LOOP            │
   │  kandidater → score →     │         │  dag++ → fase → dagsinnhold    │
   │  beste match → Match      │◄────────┤  → milepæl → dag 30 → slutt    │
   │  ⚠️ tak: ~50/døgn         │  ny match│  ⚠️ CHECKIN uoppnåelig        │
   └────────────┬──────────────┘  ønskes  └────────────┬───────────────────┘
                │                                      │
                │ bruker aksepterer                    │ styrer tempo/innhold
                ▼                                      ▼
   ┌───────────────────────────┐         ┌────────────────────────────────┐
   │      SCORING-LOOP         │         │       CHAT (30 dager)          │
   │  9 dimensjoner + vekter   │         │  fri samtale · mood-farger     │
   │  + dealbreakere           │         │  · blikjent-tips ved stillhet  │
   │  ⚠️ ~609 linjer dødkode   │         │  Pusher + Supabase parallelt   │
   └───────────────────────────┘         └────────────────────────────────┘
                │                                      │
                └──────────────┬───────────────────────┘
                               ▼
   ┌──────────────────────────────────────────────────────────────────────┐
   │   👤 ADMIN-LOOP — moderasjon · observability · innholdsstyring       │
   │   🔓 STATUS: åpen via base64-cookie — FUNN 1                         │
   └──────────────────────────────────────────────────────────────────────┘
                               │
   ┌───────────────────────────┴──────────────────────────────────────────┐
   │   💳 PREMIUM-LOOP — ⛔ IKKE IMPLEMENTERT (kun console.log) — FUNN 4  │
   │   v2.0-beslutning: gratis lansering. Vipps-premium i v2.1/v3.0       │
   └──────────────────────────────────────────────────────────────────────┘
```

---

### LØKKE 1 — MATCHING-LOOP

**Hva den gjør:** Finner én person til hver ventende bruker, én gang per døgn.

**Tenkt syklus:**

1. Cron trigger 05:00 (`vercel.json`)
2. Advisory lock tas (`pg_try_advisory_lock`) for å hindre overlapp
3. Hent brukere som er matchbare
4. For hver bruker: hent kandidater
5. Score hvert par (Scoring-loop)
6. Filtrer på dealbreakere
7. Velg høyeste score → opprett `Match` (status `pending`/`active`)
8. Varsle brukeren
9. Sett `lastMatchAt` → 24-timers karantene
10. Slipp lock

**Matchbarhetskriterier** (`lib/matching/findBestResonance.ts:60-70`):
```ts
select: { onboardingComplete, deepProfileComplete, lastMatchAt, lockedUntil, bannedAt, deletedAt }
```
Fornuftig sett med portvakter — og alle fire tidsfelt (`lastMatchAt`, `lockedUntil`) er indeksert i schema (`prisma/schema.prisma:44-45`).

**Statusflyt** (`docs/match-status-lifecycle.md`):
```
pending ──► active ──► matched ──► ended
   │                      ▲
   └──► unmatched      (begge aksepterer)
```

**Status i dag:**

| Aspekt | Vurdering |
|---|---|
| Motor og logikk | ✅ Reell, gjennomtenkt |
| Portvakter (banned/deleted/locked) | ✅ På plass og indeksert |
| Advisory lock | ✅ God driftstenkning |
| Utløsning | ⛔ **Død — 401 (FUNN 2)** |
| Kapasitet | ⛔ **~50/døgn (FUNN 3)** |
| Statusenum-hygiene | ⚠️ `expired` ubrukt, `unmatched` ubrukt, `unmarked` stavefeil i `app/api/admin/matches/route.ts` |
| Default-verdi | ⚠️ Prisma-default er `active`, ikke `pending` (`schema.prisma:88`) — motsier dokumentert flyt |

---

### LØKKE 2 — JOURNEY-LOOP

**Hva den gjør:** Flytter hvert aktivt par én dag framover i den 30-dagers reisen, og leverer dagens innhold.

**Tenkt syklus:**

1. Cron trigger 07:00
2. Finn alle aktive `JourneyProgress`
3. `currentDay++`
4. Beregn fase fra dagnummer
5. Hent dagsinnhold (tema + refleksjonsprompt)
6. Hvis milepælsdag → utløs feiring
7. Dag 15 → åpne for bildedeling
8. Dag 30 → tilby fortsett eller avslutt

**Fasemodell** (`lib/journey/engine.ts`, `PHASE_CONFIGS`):

| Fase | Dager | Kjennetegn |
|---|---|---|
| `EARLY` | 1–14 | Bli kjent. Ingen bilder. |
| `BUILDING_TRUST` | 15–21 | Bilder tillatt. Tillit bygges. |
| `DEEPER` | 22–30 | Verdier, framtid, dypere samtaler. |
| `CHECKIN` | *(ingen)* | **Uoppnåelig — har labels men ingen dager** |

**Kjent defekt (`docs/match-status-lifecycle.md`):** `CHECKIN` har labels og beskrivelser og brukes som fallback i `getPhaseForDay()`, men `PHASE_CONFIGS.find()` kan aldri returnere den fordi ingen dager er tildelt. `DEEPER` dekker 22–30. Samtidig bruker `app/api/journey/today/route.ts:73-76` en fallback-indeks `dag−26`, altså som om CHECKIN dekker dag 26–30. **Tre kodesteder er uenige om fasegrensene.**

Anbefalt kanonisk mapping: EARLY 1–14, BUILDING_TRUST 15–21, DEEPER 22–25, CHECKIN 26–30.

**Motorens tilstand:** `lib/journey/engine.ts` er **1073 linjer og den eneste filen i `lib/journey/`**. Den inneholder typer, konstanter, fasehjelpere, milepæler, state-bygging, brukerprogresjon, resonansmotor, warmth-motor, stillhetsdeteksjon, 30 dagers redaksjonelt innhold, journey-impulser, førstemeldingsgenerering og hele `journeyAPI`-objektet. `docs/journey-engine-refactor-plan.md` foreslår oppdeling i 7 moduler — planen er god og utsatt av riktig grunn (manglende tester).

**Status i dag:**

| Aspekt | Vurdering |
|---|---|
| Innhold dag 1–30 | ✅ Gjennomarbeidet |
| Fasemodell | ⚠️ Tre uenige definisjoner, CHECKIN uoppnåelig |
| Utløsning | ⛔ **Død — 401 (FUNN 2)** |
| Vedlikeholdbarhet | ⚠️ 1073-linjers monolitt |
| Testdekning | ✅ `__tests__/journey-engine.test.ts` er den **eneste** suiten som passerer |

---

### LØKKE 3 — CRON-LOOP

**Hva den gjør:** Alt som gjør ToSom levende. Dette er systemets hjerte.

```
05:00  /api/cron/matching   → nye matcher
07:00  /api/cron/journey    → dag++, faseoverganger, milepæler
```

Kun to ruter (`app/api/cron/journey/route.ts` 247 linjer, `app/api/cron/matching/route.ts` 235 linjer). Enkelt og oversiktlig — i prinsippet en styrke.

**Autentisering — riktig gjort:**
```ts
// app/api/cron/matching/route.ts:19-23
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
```
Timing-safe sammenligning, secret fra env, header-basert. Dette er korrekt håndverk.

**Og likevel: 401 hver natt.** Fordi `vercel.json` sender `?secret=`.

Dette er den mest lærerike feilen i hele kodebasen: **hver enkeltdel er riktig, koblingen mellom dem er feil, og ingenting varsler.** En cron som returnerer 401 ser identisk ut med en cron som ikke finnes — begge gir stillhet.

**Status i dag:**

| Aspekt | Vurdering |
|---|---|
| Autentisering (implementasjon) | ✅ Timing-safe, header-basert |
| Autentisering (kobling) | ⛔ **Brutt — `vercel.json` bruker query-param** |
| Secret-håndtering | ⛔ Klartekst i committet `vercel.json` |
| Overlappsvern | ✅ Advisory lock |
| Overvåking | ⛔ **Ingen.** Ingen varsling ved feilet kjøring |
| Skalerbarhet | ⛔ Se FUNN 3 og DEL 4 |
| Gjenopptakelse | ⛔ Ingen cursor — timeout gir delvis tilstand uten resume |

---

### LØKKE 4 — SCORING-LOOP

**Hva den gjør:** Oversetter to dype profiler til ett tall og en begrunnelse.

**Motor:** `lib/matching/unifiedScorer.ts` (336 linjer), 9 dimensjoner med definerte vekter, pluss harde dealbreaker-filtre (`lib/matching/dealbreaker.ts`, 163 linjer).

**Kodehelse i `lib/matching/` — 1904 linjer totalt:**

| Fil | Linjer | Status |
|---|---|---|
| `unifiedScorer.ts` | 336 | ✅ AKTIV — eneste levende scorer |
| `findBestResonance.ts` | 294 | ✅ AKTIV — cron-veien |
| `dealbreaker.ts` | 163 | ✅ AKTIV — kun manuell vei |
| `findBestMatchFor.ts` | 126 | ✅ AKTIV — manuell vei |
| `engine.ts` | 121 | ✅ AKTIV |
| `explainer.ts` | 89 | ✅ AKTIV |
| `types.ts` | 82 | ✅ AKTIV |
| `resonanceScore.ts` | **344** | ☠️ DØD — 0 importer |
| `breakdown.ts` | 105 | ☠️ DØD — ren JS, ingen typer |
| `ranking.ts` | 62 | ☠️ DØD |
| `normalizer.ts` | 38 | ☠️ DØD |
| `index.ts` | 32 | ☠️ DØD som barrel |
| `feedback.ts` | 28 | ☠️ DØD — stub |
| `weightConfig.ts` | 84 | ⚠️ HALVDØD — `getWeights` importeres i `findBestMatchFor.ts:7` men **aldri kalt** |

**~609 linjer ren dødkode, pluss 84 linjer halvdød.** Godt nytt: `resonanceScore.ts` — som `SECURITY-STABILITY-PLAN-v1.md` punkt 4 utpekte som årsak til at «to motorer gir ulik score for samme par» — har **0 importer**. Duplikatproblemet er de facto løst; filene ligger bare igjen som feller.

**Alvorligste asymmetri:** `dealbreaker.ts` brukes **kun i den manuelle veien**, ikke i cron-veien (`findBestResonance.ts`). Det betyr at automatisk genererte matcher — altså tilnærmet alle matcher — potensielt **ikke går gjennom dealbreaker-filtrene**. Sikkerhets- og kompatibilitetsfiltre som er skrevet, blir ikke håndhevet der det betyr noe.

**STEG 11.4 FAILED** — konsolidering ble vurdert «for kompleks: resonanceScore/score/presenceEngine importeres av 10+ steder». Verifiseringen viser at bildet er mildere enn antatt: `resonanceScore.ts` har 0 importer og kan slettes umiddelbart.

**Status i dag:**

| Aspekt | Vurdering |
|---|---|
| Motorkvalitet | ✅ Reell 9-dimensjonal scoring |
| Dobbeltimplementasjon | ✅ De facto løst (`resonanceScore.ts` død) |
| Dødkode | ⚠️ ~609 linjer |
| Dealbreaker-håndheving | ⛔ **Mangler i cron-veien** |
| Testdekning | ⛔ Ingen unit-tester på scoring |
| Json-avhengighet | ⚠️ Alle profildata i uindekserbare Json-kolonner (se DEL 4) |

---

### LØKKE 5 — PREMIUM-LOOP

**Tenkt syklus (v2.0, Vipps only):**
```
Vipps OAuth-innlogging (finnes ✅)
    → første 5000 brukere: gratis
    → deretter: Vipps ePayment 349 NOK/periode
    → premium-status i DB
    → tilgangskontroll
```

**Faktisk tilstand:** Vipps finnes **kun som OAuth-innlogging** (`app/api/auth/vipps/*`). Ingen ePayment. Stripe-koden som finnes gjør kun `console.log`. Ingen premium-felt i schema, ingen gating.

**Motstridende dokumentasjon — nå avklart:**

| Dokument | Sa | Status |
|---|---|---|
| `PAYMENT-STRATEGY-DECISION.md` (13.08) | «Stripe er primær for lansering» | ❌ **Opphevet** |
| `tosom-concept-v2-skisse.md` | «Kun Vipps, fjern Stripe» | ✅ **Gjelder** |

**Beslutning 1 + 2 gjør dette enkelt:** gratis lansering betyr at Premium-loopen ikke er en lanseringsblokker. Men **Stripe-koden skal fjernes, ikke ligge halvferdig** — halvferdig betalingskode er en sikkerhets- og forvirringsrisiko. `PAYMENT-STRATEGY-DECISION.md` må arkiveres og erstattes.

**Status i dag:**

| Aspekt | Vurdering |
|---|---|
| Vipps OAuth-innlogging | ✅ Fungerer |
| Vipps ePayment | ⛔ Finnes ikke |
| Stripe | ⚠️ Halvferdig — **skal fjernes** |
| Premium-felt i DB | ⛔ Finnes ikke |
| Gating | ⛔ Ingen funksjon er gated |
| Webhook-idempotens | ⛔ `WebhookEvent` mangler (STEG 10.2 FAILED) |
| **Lanseringsblokker?** | **Nei** — gratis lansering vedtatt |

---

### LØKKE 6 — ADMIN-LOOP

**Hva den gjør:** Menneskelig tilsyn med et system som ellers kjører seg selv.

Dekker dashboard, users, matches, conversations, journeys, journey-content, resonance, analytics, chat, logs, system-status, tools. Bredt og modent.

**Kritisk problem:** `middleware.ts:118-139` godtar `base64('{"role":"admin"}')`. Admin-panelet — med ban/unban, samtaleinnsyn og fryse-funksjoner — er **åpent for enhver som kjenner mønsteret**.

Dette er særlig alvorlig fordi admin-loopen har innsyn i **de mest sensitive dataene i systemet**: private samtaler mellom to mennesker som er lovet at ingen ser dem. Et brudd her er ikke bare et sikkerhetsbrudd — det er et brudd på produktets kjerneløfte.

**Tre parallelle auth-veier** på ~98 API-ruter:

| Mekanisme | Antall filer |
|---|---|
| `requireAuth` / `requireAdmin` | 39 |
| `getServerSession` | 24 |
| `auth()` direkte | 15 |

`lib/auth/` har 13 filer: `admin-auth.ts`, `admin-jwt.ts`, `adminAuthGuard.ts`, `config.ts`, `csrf.ts`, `hash.ts`, `rbac.ts`, `requireAuth.ts`, `reset.ts`, `roles.ts`, `security.ts`, `session.ts`, `test-users.ts`. Tre av dem gjør overlappende admin-autorisasjon. **Ingen enhetlig inngang.** `SECURITY-STABILITY-PLAN-v1.md` punkt 1 og `tosom-masterplan-v4.md` §3.1.6 flagget dette; det er fortsatt ikke løst.

**Status i dag:**

| Aspekt | Vurdering |
|---|---|
| Funksjonell bredde | ✅ Moden |
| Observability-ambisjon | ✅ Metrics, traces, heatmap |
| Tilgangskontroll | ⛔ **Omgåelig (FUNN 1)** |
| Auth-konsistens | ⛔ 3 parallelle veier, 3 admin-guard-filer |
| Rollesammenligning | ⚠️ `'admin'` vs `'ADMIN'` |
| Audit-logging | ✅ `AuditLog`-modell finnes |

## 1.4 Hvordan alt henger sammen — og hvor det blør

Kretsløpet: **Onboarding** mater **Scoring**, som mater **Matching**, som utløser **Journey**, som rammer inn **Chat**, som **Admin** overvåker, og som **Premium** en gang skal finansiere. **Cron** driver hele bevegelsen.

**Den kritiske innsikten:** ToSom har ingen bruker-utløst hovedloop. Alt av verdi skjer i cron. Det gir et vakkert, rolig produkt — og en ekstremt sårbar arkitektur, fordi **hele verdikjeden har ett felles feilpunkt**.

I dag er det feilpunktet aktivt utløst:

```
Onboarding ✅ → Scoring ✅ → Matching ⛔ → Journey ⛔ → Chat (tomt) → Admin 🔓
                                  ▲
                            CRON ER DØD (401)
```

En bruker kan i dag registrere seg, fylle ut ~75 felt i 13 steg over 15 minutter — og **aldri få en match**. Ikke på grunn av en feil hun ser, men fordi hjertet ikke slår. Hun får ingen feilmelding. Hun får stillhet.

**Det er derfor FUNN 2 er øverst på «must fix»-listen, foran alt annet.**

---

# DEL 2 — PLATTFORMENS TILSTAND ETTER ACT-FASEN

## 2.1 Hva ACT-fasen faktisk oppnådde

Fra `ACT-STATE.json`: **56 av 72 steg fullført (77,8 %)**, 3 FAILED, 22 dokumenterte avvik.

**Reelle gevinster:**
- TypeScript fra ukjent baseline til 0 feil
- `lib/chat/*` fjernet (17 filer), 6 døde filer i `lib/admin/`, `styles/tokens.ts`
- Alle 4 `ignorePatterns` fjernet fra `.eslintrc.json` — ingen skjulte lint-hull
- Transaksjoner på match-aksept/complete
- Unique constraints på `Conversation` + `JourneyMilestone`
- `bannedAt`-sjekk i 3 kritiske API-ruter
- Sentry installert
- Jest- og Playwright-oppsett etablert
- Cron-secret flyttet fra query til header *(i kodens ende)*

**Dette er reell framgang.** Kodehelsen er bedre enn før.

## 2.2 Hvor ACT-fasen gjorde skade

To avvik fortjener særlig oppmerksomhet, fordi de forklarer FUNN 1 og FUNN 2:

| Avvik | Konsekvens |
|---|---|
| «STEG 3.3: HMAC-signert `tosom_session`-cookie» → «STEG 3.4: erstattet med `authjs.session-token` (base64 JSON payload)» | **Signering innført, deretter fjernet.** Netto: svakere enn før → FUNN 1 |
| STEG 1.12/1.13 flyttet cron-secret til header | **`vercel.json` ikke oppdatert** → FUNN 2 |

Begge er *kompileringsmessig* korrekte. Begge er *funksjonelt* ødeleggende. Begge passerte `tsc` + `grep` + `build`.

**Tredje mønster:** 8 av 22 avvik er «kjørt som batch med delt build-sjekk». Batching sparer tid, men gjør det umulig å isolere hvilken endring som forårsaket hvilket problem. Kombinert med at valideringen var svak, øker det risikoen for nettopp den typen kobling­sfeil vi ser.

## 2.3 De tre FAILED-stegene — revurdert

### STEG 10.2 — Stripe webhook-idempotens
**Årsak:** `WebhookEvent`-modell mangler.
**Revurdering:** ⬇️ **Bortfaller.** Stripe fjernes (beslutning 1). Idempotens gjenoppstår som krav når Vipps ePayment bygges i v2.1 — dokumenter kravet, ikke løsningen.

### STEG 11.1 — Slette `components/ui/*`
**Årsak:** Levende imports (`Footer.tsx`, `ToSomSection.tsx`, `ToSomButton.tsx`, `CardSkeleton.tsx`, `ErrorState.tsx`).
**Revurdering:** ➡️ **Riktig avgjørelse å avbryte.** Å slette en mappe med levende imports ville brutt bygget. `microcopy.ts` (1703 linjer) og `tokens.ts` (584 linjer) trenger manuell audit, ikke masseoperasjon. **Nedgrader til «kan vente».**

### STEG 11.4 — Konsolidere matching-scoring
**Årsak:** «resonanceScore/score/presenceEngine importeres av 10+ steder».
**Revurdering:** ⬆️ **Premissen var feil.** `resonanceScore.ts` (344 linjer) har **0 importer** og kan slettes umiddelbart. Det reelle problemet er et annet og viktigere: **dealbreakere håndheves ikke i cron-veien.** Reformuler steget.

## 2.4 Områdevurdering

### Teknisk arkitektur og ytelse — 45 %

**Styrker:** Fornuftig domenedeling i `lib/`. Next.js App Router konsekvent. Godt normalisert skjema (25 modeller, 15 enums). 0 TypeScript-feil.

**Svakheter:**
- `lib/journey/engine.ts`: 1073 linjer, eneste fil i mappen
- `components/ui/microcopy.ts`: 1703 linjer
- ~609 linjer dødkode i `lib/matching/`
- Manglende indeks på `Message.conversationId` → full table scan på raskest voksende tabell
- 10 Json-kolonner i `Profile` med all scoringsrelevant data → kan ikke filtreres i SQL
- Pusher **og** Supabase realtime parallelt — dobbel abonnement, dobbel kostnad, dobbel feilkilde
- To usynkroniserte design-token-systemer (`config/design-tokens.ts` 401 linjer med 71 importører vs. `components/ui/tokens.ts` 584 linjer)
- NextAuth v5 **beta**.25 i produksjon

### Drift, sikkerhet og observability — 30 %

**Styrker:** Sentry installert. Advisory lock. Timing-safe cron-sammenligning. `AuditLog`-modell. Admin observability-flate.

**Svakheter:**
- FUNN 1: auth-bypass
- FUNN 2: døde cron-jobber, **uten varsling**
- Cron-secret i klartekst i committet fil
- Sentry DSN ikke satt → ingen faktisk feilsporing i drift
- Ingen alarmer på noe
- Rate limiting in-memory → verdiløs på serverless (hver instans egen teller)
- `ADMIN_JWT_SECRET` kaster på module-scope; finnes bare i gitignorert `.env.local`

**Den dyreste mangelen er ikke et hull — det er blindheten.** FUNN 2 har trolig vart siden ACT-fasen uten at noen visste. Uten alarmer gjentar det seg.

### Matching- og journey-kvalitet — 40 %

**Styrker:** Reell 9-dimensjonal motor. 30 dager gjennomarbeidet innhold. Fasemodell med mening. Sterke portvakter.

**Svakheter:** Cron død. Tak ~50 matcher/døgn. Dealbreakere ikke håndhevet i cron-veien. CHECKIN uoppnåelig. Tre uenige fasedefinisjoner. Ingen scoring-tester. `MatchInsight` foreldreløs. Statusenum-rot (`expired`/`unmatched` ubrukt, `unmarked` stavefeil).

### UX, design og navigasjon — 50 %

**Styrker:** Klar visuell identitet (ToSom Blue + Nordic Gold). Mood-farger og blikjent-spørsmål finnes og passer filosofien. Rolig tone.

**Svakheter:** Dobbelt token-system → fargedrift. 1703-linjers microcopy uten struktur. Duplikate/legacy ruter (`app/slik/` vs `app/slik-fungerer-det/`). Dødtilstander i dashboard når ingen match finnes — **som nå er normaltilstanden for alle brukere**.

Det siste punktet er verdt å dvele ved: fordi cron er død, ser **hver** bruker «ingen match ennå»-tilstanden permanent. Den tilstanden er designet som midlertidig. Den er nå produktet.

### Onboarding, dashboard, settings — 45 %

**Onboarding:** 13 steg, ~4210 linjer totalt, `OnboardingFlow.tsx` 484 linjer. Grundig og gjennomarbeidet innhold.

**Kritisk svakhet:** state lagres **kun i localStorage**. Ingen serverside-autosave av posisjon. Bytter brukeren enhet eller tømmer nettleserdata midt i et 15-minutters løp med ~75 felt, er alt borte. Det er den dyreste tenkelige frafallspunktet i hele traktet.

**Struktur-rot:** delte stegnummer (`Step2Livssituasjon.tsx` **og** `Step2Personlighet.tsx`), `SUMMARY` finnes i `DeepProfileStep`-enum men ikke i UI, spec sa 9 steg mens implementasjonen har 13.

**Settings:** tynt, delvis uten persistering.

### Premium / Vipps — 15 %

Vipps OAuth-innlogging ✅. Alt annet ⛔. Stripe halvferdig og skal fjernes. **Ikke lanseringsblokker** gitt gratis lansering.

### CI/CD og E2E — 25 %

Pipeline finnes (9 jobber), **4 er røde**. E2E kan strukturelt ikke passere uten Postgres-service. `ADMIN_JWT_SECRET` mangler i CI.

`ACT-STATE.json` sier `"status": { "tsc": "pass", "grep": "pass", "build": "pass" }`. Alle tre er sanne. Ingen av dem sier noe om at systemet fungerer.

## 2.5 Samlet score

| Område | Diagnose v1.0 | **Masterplan v2.0** | Endring |
|---|---|---|---|
| Sikkerhet | 42 % | **30 %** | ⬇️ FUNN 1 verifisert i kode |
| Kodehelse | 52 % | **55 %** | ⬆️ Reell opprydding i ACT |
| Funksjonell modenhet | 39 % | **35 %** | ⬇️ FUNN 2 + 3 |
| Driftsstabilitet | 46 % | **30 %** | ⬇️ Døde cron uten varsling |
| Testmodenhet | 18 % | **22 %** | ⬆️ Suiter finnes, men 3/4 røde |
| Arkitektur (nytt) | — | **45 %** | — |
| UX/Design (nytt) | — | **50 %** | — |
| **LANSERINGSKLARHET** | **27 %** | **31 %** | ⬆️ Marginalt |

**Kodehelsen gikk opp. Driftssikkerheten gikk ned. Netto: 31 %.**

---

# DEL 3 — KONKRETE FORBEDRINGSFORSLAG

## 3.1 Hva som ikke gir mening i dagens system

### 1. Base64 som sikkerhetsmekanisme
Base64 er koding, ikke kryptografi. Å lese `role` fra en base64-payload og bruke den til autorisasjon er funksjonelt identisk med å spørre brukeren «er du admin?» og tro på svaret.
**→ Signert JWT (jose/next-auth), verifiser i middleware.**

### 2. Cron-konfigurasjon som motsier cron-koden
Koden gjør det riktig. Konfigurasjonen gjør det gammeldags. Ingen sjekker.
**→ Rett `vercel.json` til header-basert. Legg til CI-guard som sjekker at `vercel.json` ikke inneholder `secret=`.**

### 3. Tre auth-veier på 98 ruter
`requireAuth` (39), `getServerSession` (24), `auth()` (15). Tre admin-guard-filer. Hver vei er et potensielt hull, og ingen kan revidere 98 ruter pålitelig.
**→ Én inngang: `requireAuth()` / `requireAdmin()`. Alt annet migreres. CI-guard mot direkte `auth()` i `app/api/`.**

### 4. Dealbreakere som ikke håndheves der matcher lages
Filtre skrevet, testet i tanken, og hoppet over i den veien som faktisk produserer matcher.
**→ Flytt dealbreaker-sjekk inn i `findBestResonance.ts`.**

### 5. En fase som ikke kan nås
`CHECKIN` har labels, beskrivelser og fallback-logikk — men ingen dager. Tre kodesteder er uenige om grensene.
**→ Én kanonisk kilde: EARLY 1–14, BUILDING_TRUST 15–21, DEEPER 22–25, CHECKIN 26–30.**

### 6. ~609 linjer dødkode i matching
`resonanceScore.ts` (344 linjer) med 0 importer — samtidig som `SECURITY-STABILITY-PLAN-v1.md` bruker den som begrunnelse for at «to motorer gir ulik score». Dokumentasjonen beskriver et problem som ikke lenger finnes, mens filen ligger igjen som en felle for neste utvikler.
**→ Slett. Oppdater dokumentasjonen.**

### 7. To design-token-systemer
`config/design-tokens.ts` (401 linjer, hardkodet HEX, **71 importører**) vs. `components/ui/tokens.ts` (584 linjer, CSS-variabler). Ikke synkronisert. Gull A ≠ gull B.
**→ Shim er riktig kortsiktig valg. Gradvis migrering post-launch.**

### 8. Pusher og Supabase realtime samtidig
To abonnement per chatterom for overlappende funksjonalitet. Dobbel kostnad, dobbel feilkilde, divergerende feilhåndtering over tid.
**→ Velg én. Pusher for meldinger + typing.**

### 9. NextAuth v5 beta i produksjon
Auth-laget hviler på et beta-API uten migreringsgaranti.
**→ Lås eksakt versjon (fjern `^`). Vurder nedgradering til v4 stabil hvis v5 ikke er GA før lansering.**

### 10. Onboarding-state kun i localStorage
15 minutter, ~75 felt, ingen serverside-lagring av posisjon.
**→ Autosave til server per steg (`hooks/useAutoSave.ts` finnes allerede).**

### 11. En betalingsløsning som bare logger
Tre `case`-grener som alle gjør `console.log` + TODO. Halvferdig betalingskode er verre enn ingen.
**→ Fjern Stripe helt (beslutning 1).**

### 12. Rate limiting i minne på serverless
Hver instans har egen teller. Ved N instanser er den effektive grensen N × grensen.
**→ Distribuert (Upstash Redis) på auth-ruter. Post-launch for resten.**

## 3.2 Stabilitet

| Tiltak | Begrunnelse |
|---|---|
| Fiks cron-kobling | Uten dette er ingenting annet relevant |
| Signert sesjon | Lukker FUNN 1 |
| Cron-helsesjekk + alarm | Gjør neste FUNN 2 synlig innen minutter, ikke måneder |
| `ADMIN_JWT_SECRET` fra module-scope til lazy | Fjerner import-tidskrasj i CI og ruter |
| Postgres-service i CI | Gjør E2E i det hele tatt mulig |
| Cursor + batching i cron | Fjerner delvis-tilstand ved timeout |
| Idempotensnøkkel per cron-kjøring | Trygg re-kjøring etter feil |
| Én kanonisk fasedefinisjon | Fjerner tre-veis uenighet |
| Dealbreaker i cron-veien | Håndhever tiltenkte filtre |
| Lås NextAuth-versjon | Fjerner stille breaking changes |

## 3.3 Hva som kan gjøres enklere

- **Slett før du bygger.** ~609 linjer matching + `MatchInsight` + Stripe. Hver slettet linje er en linje som ikke kan feile.
- **`lib/journey/engine.ts` → 7 moduler** etter `journey-engine-refactor-plan.md`. Men **tester først** — planen har rett i rekkefølgen.
- **`microcopy.ts` (1703 linjer) → domenevis oppdeling.**
- **Én realtime-leverandør.**
- **Rydd statusenum:** fjern `expired`/`unmatched` eller bruk dem; rett `unmarked` → `unmatched`.
- **Rett Prisma-default** fra `active` til `pending` slik dokumentert flyt tilsier.

## 3.4 Bedre brukeropplevelse

| Tiltak | Effekt |
|---|---|
| **Serverside onboarding-autosave** | Fjerner det dyreste frafallspunktet i traktet |
| **Ærlig ventetilstand** | «Din match kommer i natt. Vi tar dette rolig.» — i stedet for tom skjerm. Gjør ventingen til en del av produktet |
| Fiks delte stegnummer | Fjerner navigasjonsforvirring |
| Ett token-system | Fjerner fargedrift |
| Konsolider duplikatruter | Fjerner navigasjonsstøy og SEO-splitt |
| Fjern `SUMMARY` fra enum | Fjerner spøkelsessteg |
| Reell settings-persistering | Innstillinger som ikke lagres er verre enn ingen innstillinger |

**Den viktigste UX-innsikten:** ToSom har innebygd ventetid som *filosofi* (én match per 24 timer). Da må ventingen **designes**, ikke behandles som tomhet. En rolig, ærlig ventetilstand er ikke en trøstepremie — den er kjerneopplevelsen i et produkt som lover ro.

## 3.5 Bedre teknisk ytelse

**Umiddelbart (minutter, stor effekt):**
```prisma
model Message {
  @@index([conversationId, createdAt])   // ← full table scan i dag
}
model Match {
  @@index([userAId, status])
  @@index([userBId, status])
}
model Notification {
  @@index([userId, readAt, createdAt])
}
```

**Kortsiktig:** `select` i stedet for full henting (`findBestResonance.ts:99-106` henter alle kolonner inkl. Json `explanation` + `scoringBreakdown`). Fjern N+1 i cron-løkker. Batch-writes.

**Middels:** Denormaliser scoringsrelevante Json-felt til indekserbare kolonner. Connection pooling (PgBouncer/Prisma Accelerate). Cache dagsinnhold.

## 3.6 Bedre utvikleropplevelse

| Problem | Tiltak |
|---|---|
| `ADMIN_JWT_SECRET` kaster ved import | Lazy-evaluering + `.env.test` |
| Ingen DB i CI | `services: postgres` |
| 3/4 testsuiter røde | Fiks eller slett — røde tester som får ligge lærer teamet å ignorere rødt |
| Tester tester kopier av logikk | `cron-auth.test.ts` tester `simulateCronAuth`, ikke ruten. Test **faktisk** kode |
| `grep`+`tsc`+`build` som eneste validering | Legg til smoke-test som treffer reelle endepunkter |
| Dokumentasjon motsier kode | Én kilde. Arkiver `PAYMENT-STRATEGY-DECISION.md` |
| Motstridende masterplaner | Denne erstatter v4 |
| Språkblanding | `lang-guard` er rød — fiks treffet |
| Stille konfigurasjonsdrift | CI-guard: `vercel.json` skal ikke inneholde `secret=` |

---

# DEL 4 — SKALERINGSSTRATEGI MOT 300 000 BRUKERE

> **Horisont: 12–24 måneder.** Arkitekturen forberedes nå. Ingenting i denne delen er lanseringsblokker — men beslutningene i 4.2 og 4.3 er *retningsvalg* som blir dyre å endre senere, og bør tas nå.

## 4.1 Utgangspunktet

| Metrikk | I dag | Mål |
|---|---|---|
| Matcher per døgn | ~50 (hardkodet tak) | ~10 000+ |
| Kandidatscoring | O(n²) i JS hvis tak fjernes | O(n·k), k ≈ 200–500 |
| Cron-arkitektur | Én monolittisk funksjon | Koordinator + batch-workers |
| Profilfiltrering | I JS etter full henting | I SQL før henting |
| Meldingsoppslag | Full table scan | Indeksert |
| Cache | Ingen | Redis |

**Kjerneproblemet er ikke CPU. Det er at all filtrering skjer i JavaScript etter at data er lastet, fordi alle profildata ligger i Json-kolonner som Postgres ikke kan indeksere.**

## 4.2 Kandidatreduksjon: fra O(n²) til O(n·k)

Med 300k brukere er full parvis scoring 4,5 × 10¹⁰ sammenligninger. Umulig — og unødvendig: de fleste par er åpenbart uegnet.

**Blocking/bucketing** — reduser kandidatmengden i SQL før scoring:

```
Bøttenøkkel = f(aldersbånd, geografisk sone, kjønnspreferanse, livsfase)

300 000 brukere
   → SQL-prefiltrering på indekserte kolonner
   → ~200–500 kandidater per bruker
   → full 9-dimensjonal scoring kun på disse
   → 300 000 × 350 ≈ 10⁸ operasjoner, distribuert over batcher
```

**Forutsetning: denormalisering.** Følgende må ut av Json og inn i indekserte kolonner:

| Data | I dag | Må bli |
|---|---|---|
| Alder | `Profile.age` ✅ | Beholdes + indekseres |
| Geografi | Json/mangler | `latitude`, `longitude`, `geoBucket` |
| Kjønn + preferanse | Json | Egne kolonner |
| Livsfase | `lifeSituation` Json | `lifePhase` enum |
| Sikkerhetsnivå | `securityLevel` ✅ | Indekseres |
| Dealbreaker-flagg | Json | Bitmaske/egne kolonner |

De 10 Json-kolonnene i `Profile` (`schema.prisma:56-73`) beholdes for **scoring av nyanser** — de er riktige der. De er bare feil sted for **filtrering**.

## 4.3 Cron-arkitektur: fra monolitt til kø

**I dag:** én funksjon, all logikk, ingen cursor, timeout gir delvis tilstand uten gjenopptakelse.

**Mål:**

```
05:00  Koordinator (lett)
         ├── teller matchbare brukere
         ├── deler i batcher à 500
         └── legger N jobber på kø
              ↓
       Worker-pool (parallell, 10–50 samtidige)
         ├── batch 1: hent → prefiltrer → score → skriv
         ├── batch 2: ...
         └── batch N
              ↓
       Aggregator
         ├── metrikker
         └── alarm ved avvik
```

**Prinsipper:**
1. **Cursor-basert paginering** — hver batch vet hvor den startet
2. **Idempotens per batch** — trygg re-kjøring
3. **Advisory lock per batch**, ikke per kjøring
4. **Bulk-writes** — `createMany` i stedet for løkke
5. **Delvis feil ≠ total feil** — én batch som feiler stopper ikke resten
6. **Backpressure** — begrens samtidige DB-forbindelser

**Anbefalt vei:** Behold Vercel Cron som trigger. Flytt tungt arbeid til kø (Inngest, QStash eller Postgres-basert kø). Vercels funksjonstidsgrenser gjør monolittisk batchkjøring uholdbar uansett.

## 4.4 Database

**Umiddelbart (før lansering, minutter å implementere):**
```prisma
model Message      { @@index([conversationId, createdAt]) }
model Match        { @@index([userAId, status])
                     @@index([userBId, status]) }
model Notification { @@index([userId, readAt, createdAt]) }
```

**Fase 2 (denormalisering + matching-indekser):**
```prisma
model Profile {
  latitude   Float?
  longitude  Float?
  geoBucket  String?
  gender     Gender?
  seeking    Gender?
  lifePhase  LifePhase?

  @@index([geoBucket, age])
  @@index([gender, seeking, age])
}
model User {
  @@index([onboardingComplete, deepProfileComplete, bannedAt, deletedAt, lastMatchAt])
}
```

**Fase 3 (partisjonering):** `Message`, `SystemLog`, `PerformanceMetric`, `AuditLog` partisjoneres på måned. Arkiveringsstrategi for meldinger >12 mnd.

**Sharding:** **Ikke anbefalt.** 300k brukere er ~50–100 GB — godt innenfor én velindeksert Postgres. Sharding før 5–10M brukere er selvpålagt kompleksitet. Read replicas for admin/analytics er den riktige første skaleringen.

**Rydding:** `MatchInsight` er foreldreløs (ingen ruter skriver til den) → slett ved neste migrering. Kjør `prisma format` (CI er rød på dette).

## 4.5 Caching

| Lag | Innhold | TTL |
|---|---|---|
| CDN | Statiske sider, assets | Lang |
| Redis | Dagsinnhold journey (30 nøkler, identisk for alle) | 24 t |
| Redis | Aktiv match per bruker | 5 min |
| Redis | Rate-limit-tellere | Rullerende |
| Redis | Profil-lookup i matching | 1 t |
| Ingen | Meldinger | — sanntid |

Journey-dagsinnhold er ideelt for cache: 30 datasett, identiske for alle brukere, endres nesten aldri. I dag hentes de fra DB per forespørsel.

## 4.6 API-latens og serverarkitektur

| Endepunkt | Mål p95 |
|---|---|
| Dashboard | < 300 ms |
| Chat-historikk | < 200 ms |
| Send melding | < 150 ms |
| Journey i dag | < 100 ms (cached) |
| Onboarding-lagring | < 200 ms |

**Tiltak:** Connection pooling (PgBouncer/Accelerate) — kritisk på serverless. `select` overalt. Fjern N+1. Behold `standalone` output. Vurder edge for lesetunge ruter.

**Realtime ved 300k:** ~5–10k samtidige tilkoblinger ved 3 % samtidighet. Én leverandør (Pusher), kanal per samtale, ingen broadcast-kanaler.

## 4.7 Observability

**Nivå 0 — før lansering (ikke-forhandlbart):**
- Sentry DSN satt (installert, ikke aktivert)
- **Cron-helsesjekk med alarm** — heartbeat etter hver kjøring; alarm hvis ingen innen 30 min
- Alarm på 5xx-rate
- Alarm på feilet DB-forbindelse

**Nivå 1 — første måned:**
- Forretningsmetrikker: matcher/døgn, onboarding-fullføring, dag-N-retensjon
- Cron-varighet og -kapasitet
- p95-latens per endepunkt
- Strukturert logging med korrelasjons-ID

**Nivå 2 — mot 300k:** distribuert tracing, kødybde, DB-connection-utnyttelse, kostnad per bruker.

**Den viktigste enkeltmetrikken er «matcher generert siste 24 t».** Hvis den er 0, er ToSom nede — uansett hva oppetidsmåleren sier. FUNN 2 er beviset: hele produktet kan stå stille mens alle sider laster med 200 OK.

## 4.8 Feilhåndtering

| Prinsipp | Anvendelse |
|---|---|
| Idempotens overalt | Cron-batcher, webhooks, matchopprettelse |
| Retry med backoff | Eksterne kall (Vipps, Pusher, e-post) |
| Circuit breaker | Ved vedvarende eksterne feil |
| Graceful degradation | Realtime nede → polling; cache nede → DB |
| Dead letter queue | Feilede batcher til inspeksjon |
| Ingen stille feil | **Enhver `catch` som svelger en feil er en framtidig FUNN 2** |

---

# DEL 5 — SIKKERHETSREVISJON

## 5.1 Nivå i dag: 30 % — ikke forsvarlig for produksjon

Verifisert i kode, ikke antatt. Vurderingen er strengere enn diagnosens 42 % fordi FUNN 1 er bekreftet lesbar i `middleware.ts`.

## 5.2 Kritiske funn

### S-1 — Sesjonsvern kan omgås fullstendig 🔴
**Fil:** `middleware.ts:60-64`
**Utnyttelse:** `document.cookie = 'authjs.session-token=x'` → tilgang til alle beskyttede API-prefikser.
**Konsekvens:** Uautorisert tilgang til profiler, matcher, samtaler, journey-data.
**Fiks:** Verifiser signert JWT i middleware (`jose`/next-auth). Fjern `hasValidSession` i nåværende form.

### S-2 — Admin-tilgang via forfalsket rolle 🔴
**Fil:** `middleware.ts:66-75` + `118-139`
**Utnyttelse:** `authjs.session-token = base64('{"role":"admin"}')`
**Konsekvens:** Ban/unban, innsyn i **private samtaler**, frysing, systemverktøy.
**Alvorlighetsgrad:** Høyest i systemet — bryter produktets kjerneløfte om privathet.
**Fiks:** Signert JWT + rolle fra verifisert payload. Konsolider tre admin-guard-filer til én. Rett `'admin'`/`'ADMIN'`.

### S-3 — Cron-secret i klartekst i git 🔴
**Fil:** `vercel.json:6,10` — `627562342a0035f120707dd29b4f82dd`
**Konsekvens:** Vilkårlig utløsning av matching/journey. **Secret er kompromittert permanent** — den ligger i git-historikken.
**Fiks:** Roter. Header-basert. Aldri i versjonert fil.

### S-4 — Ingen distribuert rate limiting 🔴
In-memory teller på serverless: N instanser = N × grensen. Ingen reell beskyttelse mot brute-force eller SMS-bombing.
**Fiks:** Upstash Redis på auth-ruter (innlogging, telefon, magic link) før lansering.

### S-5 — Sentry uten DSN 🟠
Installert, ikke aktivert. Ingen produksjonsfeilsporing.
**Fiks:** Sett `NEXT_PUBLIC_SENTRY_DSN`. Verifiser med en testfeil.

### S-6 — Halvferdig betalingskode 🟠
Webhook uten idempotens, uten DB-effekt. Angrepsflate uten funksjon.
**Fiks:** Fjern Stripe (beslutning 1).

### S-7 — NextAuth v5 beta 🟠
`^5.0.0-beta.25` — caret på beta. `npm install` kan bryte auth uten varsel.
**Fiks:** Lås eksakt versjon.

### S-8 — Ingen generell CSRF 🟠
Tilstandsendrende ruter uten CSRF-vern. `lib/auth/csrf.ts` finnes — ikke konsekvent brukt.
**Fiks:** SameSite=Strict + CSRF-token på tilstandsendrende ruter.

### S-9 — `ADMIN_JWT_SECRET` kaster ved import 🟠
`lib/auth/admin-jwt.ts:13`. Finnes bare i gitignorert `.env.local`. Enhver rute som importerer modulen krasjer hvis variabelen mangler i prod.
**Fiks:** Lazy-evaluering + fail-fast validering ved oppstart.

### S-10 — Dealbreakere ikke håndhevet i cron 🟠
`dealbreaker.ts` brukes kun i manuell vei. Sikkerhetsrelaterte kompatibilitetsfiltre hoppes over for automatisk genererte matcher.
**Fiks:** Inn i `findBestResonance.ts`.

### S-11 — Inkonsistent auth på 98 ruter 🟡
Tre veier. Ikke revisjonerbart.
**Fiks:** Én inngang + CI-guard.

### S-12 — Fragil `x-url`-header i admin-layout 🟡
`middleware.ts:87` setter header som admin-layout leser for pathname. Fragilt mønster; bør ikke inngå i sikkerhetsbeslutninger.

### S-13 — Ingen alarmer 🟡
Ingen deteksjon av innbrudd, misbruk eller driftsstans. **FUNN 2 er beviset på at dette ikke er teoretisk.**

### S-14 — `ai-guard` med hull 🟢
Mønsteret er `components/ai`; `components/ui/ai/` (4 filer) fanges ikke. Guarden gir falsk trygghet på en av ToSoms viktigste produktregler («ingen AI mot bruker»).
**Fiks:** Utvid mønsteret.

## 5.3 Hardening før lansering

**Ikke-forhandlbart:**
1. Signert sesjon (S-1)
2. Signert admin-autorisasjon (S-2)
3. Roter cron-secret, header-basert (S-3)
4. Distribuert rate limiting på auth (S-4)
5. Sentry DSN aktiv (S-5)
6. Fjern Stripe (S-6)
7. Lås NextAuth-versjon (S-7)
8. `ADMIN_JWT_SECRET` lazy + fail-fast (S-9)
9. Dealbreakere i cron (S-10)
10. Cron-heartbeat med alarm (S-13)
11. Fail-fast env-validering ved oppstart
12. Verifiser at `dev-login`/`test-login` er blokkert i prod (`middleware.ts:106` ser riktig ut — **verifiser i faktisk prodmiljø**)

**Første måned:**
13. Én auth-inngang (S-11)
14. CSRF konsekvent (S-8)
15. HSTS + fullt sett sikkerhetsheadere
16. Utvid `ai-guard` (S-14)
17. Secret-scanning i CI
18. Verifisert backup + gjenopprettingstest
19. Fjern `x-url`-avhengighet (S-12)

**Tredje part:** Ekstern penetrasjonstest anbefales før markedsføringspush — ikke nødvendigvis før myk lansering.

---

# DEL 6 — MASTERPLAN: ROADMAP, SCORE OG 30–60 DAGERS PLAN

## 6.1 Lanseringsscore: 31 %

| Dimensjon | Vekt | Score | Vektet |
|---|---|---|---|
| Kjernefunksjon virker ende-til-ende | 25 % | 15 % | 3,75 |
| Sikkerhet | 20 % | 30 % | 6,00 |
| Driftsstabilitet | 15 % | 30 % | 4,50 |
| Matching/journey-kvalitet | 15 % | 40 % | 6,00 |
| UX/onboarding | 10 % | 48 % | 4,80 |
| Testmodenhet | 10 % | 22 % | 2,20 |
| Premium *(gratis lansering)* | 5 % | 75 % | 3,75 |
| **SUM** | **100 %** | | **31,0 %** |

**Tolkning:** Ikke lanseringsklar. Men avstanden er kortere enn tallet antyder, fordi de tyngste manglene er **koblingsfeil, ikke manglende funksjonalitet**. Å rette `vercel.json` er ett linjeskift som flytter «kjernefunksjon virker» fra 15 % mot 60 %.

**Realistisk prognose:** 75–80 % etter 30 dager. 88–92 % etter 60 dager. Lansering i uke 8–9.

## 6.2 Risikoanalyse

| # | Risiko | Sanns. | Konsekvens | Nivå | Tiltak |
|---|---|---|---|---|---|
| R1 | Lansering med død cron → ingen får match | **Verifisert nå** | Kritisk | 🔴 | Fiks + heartbeat + E2E |
| R2 | Admin-innbrudd → private samtaler lekker | Høy | Katastrofal | 🔴 | S-1, S-2 |
| R3 | Kjede-feil oppstår igjen usett | Høy | Kritisk | 🔴 | Alarmer + smoke-tester |
| R4 | Matching-tak → «ToSom virker ikke» ved vekst | Sikker ved >1000 brukere | Høy | 🟠 | Fjern tak, batching |
| R5 | Onboarding-frafall (localStorage tapt) | Middels | Høy | 🟠 | Serverside autosave |
| R6 | NextAuth beta bryter auth | Middels | Kritisk | 🟠 | Lås versjon |
| R7 | GDPR-svakhet i private samtaler | Middels | Katastrofal | 🟠 | Sikkerhetsrevisjon + juridisk |
| R8 | Refaktorering bryter journey (ingen tester) | Høy | Middels | 🟠 | Tester før refaktor |
| R9 | Rød CI normaliseres | **Pågår** | Middels | 🟠 | Grønn CI som portvakt |
| R10 | Dokumentasjon motsier kode | Pågår | Middels | 🟡 | Denne planen som kanon |

**R3 er den underliggende risikoen.** R1 og R2 er symptomer på at systemet ikke kan fortelle oss når det er ødelagt.

## 6.3 30-dagers plan

### BØLGE A — Gjenoppliv systemet (dag 1–3) 🔴

> Mål: en reell bruker kan få en match. Ingenting annet betyr noe før dette.

| # | Oppgave | Filer |
|---|---|---|
| A1 | Rett cron-kobling til header-basert | `vercel.json` |
| A2 | Roter cron-secret | Vercel env |
| A3 | Verifiser cron manuelt ende-til-ende | — |
| A4 | Cron-heartbeat + alarm | ny rute + `SystemLog` |
| A5 | CI-guard: `vercel.json` uten `secret=` | `ci.yml` |

**Ferdigkriterium:** Match opprettet i prod av faktisk cron-kjøring. Journey-dag rullet. Bekreftet i DB — ikke i logg.

### BØLGE B — Lukk sikkerhetshullene (dag 3–8) 🔴

| # | Oppgave | Filer |
|---|---|---|
| B1 | Signert sesjonsverifisering | `middleware.ts`, `lib/auth/session.ts` |
| B2 | Signert admin-autorisasjon, konsolider 3 guards → 1 | `middleware.ts`, `lib/auth/admin-*` |
| B3 | Rett `'admin'` vs `'ADMIN'` | `middleware.ts:134`, `lib/auth/roles.ts` |
| B4 | Distribuert rate limiting (Upstash) på auth | `lib/security/*` |
| B5 | `ADMIN_JWT_SECRET` lazy + fail-fast env | `lib/auth/admin-jwt.ts`, `config/env.ts` |
| B6 | Lås NextAuth eksakt versjon | `package.json` |
| B7 | Sentry DSN + verifiser med testfeil | env |

**Ferdigkriterium:** Forfalsket cookie gir 401. Forfalsket admin-rolle gir redirect. Verifisert manuelt med `curl`.

### BØLGE C — Grønn CI som portvakt (dag 8–14) 🟠

| # | Oppgave |
|---|---|
| C1 | `services: postgres` i `ci.yml` |
| C2 | `ADMIN_JWT_SECRET` + `CRON_SECRET` i CI-env, `.env.test` |
| C3 | Fiks 6 feilende tester (inkl. `cron-auth` mot **faktisk** rute) |
| C4 | `prisma format` → grønn |
| C5 | Fiks `lang-guard`-treff |
| C6 | Utvid `ai-guard` til `components/ui/ai/` |
| C7 | E2E: register → onboarding → match → journey → chat |
| C8 | Smoke-test mot reelle endepunkter i CD |

**Ferdigkriterium:** 9/9 jobber grønne. E2E kjører mot faktisk database.

### BØLGE D — Rydd og stabiliser (dag 14–22) 🟠

| # | Oppgave |
|---|---|
| D1 | Fjern Stripe fullstendig; arkiver `PAYMENT-STRATEGY-DECISION.md` |
| D2 | Slett ~609 linjer dødkode i `lib/matching/` |
| D3 | Dealbreakere inn i `findBestResonance.ts` |
| D4 | Kanonisk fasemodell (EARLY 1–14, BT 15–21, DEEPER 22–25, CHECKIN 26–30) |
| D5 | Rydd statusenum; rett `unmarked`; rett Prisma-default til `pending` |
| D6 | Slett `MatchInsight` (migrering) |
| D7 | Kritiske indekser: `Message`, `Match`, `Notification` |
| D8 | Én realtime-leverandør (Pusher) |
| D9 | Unit-tester: `unifiedScorer` + `dealbreaker` |

### BØLGE E — Brukeropplevelse (dag 22–30) 🟠

| # | Oppgave |
|---|---|
| E1 | **Serverside onboarding-autosave** |
| E2 | **Designet ventetilstand** — ærlig, rolig, forklarende |
| E3 | Fiks delte stegnummer; fjern `SUMMARY` fra enum |
| E4 | Reell settings-persistering |
| E5 | Konsolider duplikatruter |
| E6 | Fjern matching-tak (`take: 50`) + enkel batching |
| E7 | Manuell QA: full flyt på mobil + desktop |

**Status etter 30 dager: ~75–80 %.**

## 6.4 Dag 31–60

### BØLGE F — Lanseringsklargjøring (dag 31–40)
Backup + verifisert gjenopprettingstest. Fullt sett sikkerhetsheadere inkl. HSTS. Juridisk gjennomgang (vilkår/personvern/cookies — GDPR er skjerpet for private samtaler). Fail-fast env-validering. Forretningsmetrikker i dashboard. Lasttest av cron ved 10k og 50k simulerte brukere. Gjennomgå `LAUNCH-CHECKLIST.md` punkt for punkt.

### BØLGE G — Myk lansering (dag 40–50)
Lukket beta, 50–200 brukere. Daglig overvåking av matcher/døgn, onboarding-fullføring, feilrate. Manuell verifisering av at hver bruker faktisk fikk match. Iterasjon på matching-kvalitet mot reelle data.

### BØLGE H — Skaleringsforberedelse (dag 50–60)
Journey-motor → 7 moduler (etter `journey-engine-refactor-plan.md`, **med tester på plass**). Redis-cache på dagsinnhold. Connection pooling. Prototype blocking/bucketing. Designbeslutning på denormalisering. Én auth-inngang på alle 98 ruter. CSRF konsekvent.

**Status etter 60 dager: ~88–92 %. Åpen lansering uke 9–10.**

## 6.5 MUST FIX BEFORE LAUNCH

> 21 punkter. Alt annet kan vente.

**Systemet må være levende (1–5)**
1. Cron-kobling rettet — `vercel.json` header-basert
2. Cron-secret rotert
3. Cron verifisert manuelt ende-til-ende
4. Cron-heartbeat med alarm
5. Matching-tak fjernet (`take: 50`)

**Sikkerhet (6–12)**
6. Signert sesjonsverifisering (S-1)
7. Signert admin-autorisasjon, guards konsolidert (S-2)
8. Rollesammenligning konsistent
9. Distribuert rate limiting på auth (S-4)
10. `ADMIN_JWT_SECRET` lazy + fail-fast env (S-9)
11. NextAuth låst til eksakt versjon (S-7)
12. Sentry DSN aktiv og verifisert (S-5)

**Korrekthet (13–17)**
13. Dealbreakere håndhevet i cron-veien (S-10)
14. Kanonisk fasemodell — én definisjon
15. Stripe fjernet fullstendig
16. Kritiske indekser (`Message`, `Match`, `Notification`)
17. Statusenum ryddet; Prisma-default rettet

**Kvalitetssikring (18–21)**
18. Grønn CI — 9/9 jobber
19. E2E med Postgres-service: register → onboarding → match → journey → chat
20. Serverside onboarding-autosave
21. Verifisert backup + gjenopprettingstest

## 6.6 KAN VENTE

**Post-launch, første kvartal**
- Journey-motor → 7 moduler *(krever tester først)*
- `components/ui/*` manuell audit (STEG 11.1) — **nedgradert**
- Design-token-konsolidering (71 importører — shim er trygg nok)
- `microcopy.ts` (1703 linjer) oppdeling
- Én auth-inngang på alle 98 ruter *(sikkerhetsgevinsten er tatt i B1/B2)*
- CSRF konsekvent overalt
- Fjern `x-url`-avhengighet
- `OnboardingFlow.tsx` → egne steg-filer
- Utvidet observability (nivå 1)
- Ekstern penetrasjonstest

**Senere / v2.1+**
- **Vipps ePayment + premium-loop** *(beslutning 2: gratis lansering)*
- `WebhookEvent`-modell + idempotens *(gjenoppstår som krav med Vipps)*
- Denormalisering av Json-felt
- Blocking/bucketing i produksjon
- Worker-kø
- Read replicas, partisjonering
- Distribuert tracing
- **Sharding — ikke før 5–10M brukere**

## 6.7 Prinsipper for v2.0-arbeidet

1. **Valider funksjon, ikke kompilering.** `tsc` + `grep` + `build` grønt er ikke bevis. ACT-fasen hadde alle tre og leverte to kritiske brudd. Krav: verifisert effekt i database eller HTTP-respons.
2. **Ett steg om gangen.** 8 av 22 ACT-avvik var batching. Batching gjorde det umulig å isolere årsak.
3. **Aldri erstatt en sikkerhetsmekanisme med en svakere.** Steg 3.4 fjernet signeringen fra steg 3.3. Ingen la merke til det.
4. **Endre konfigurasjon og kode sammen.** FUNN 2 er kode og konfigurasjon som gikk hver sin vei.
5. **Rødt er rødt.** Røde tester som får ligge lærer teamet å ignorere rødt.
6. **Slett før du bygger.** ~609 linjer matching + Stripe + `MatchInsight`.
7. **Alarmer før funksjoner.** Uten deteksjon gjentar FUNN 2 seg.
8. **Ro også i prosessen.** ToSom lover ro. Bygg det rolig.

---

# APPENDIKS

## A.1 Verifikasjonslogg

Kjørt 13.08.2026 på commit `7f2d269`:

```
$ npx tsc --noEmit
(0 feil)

$ npx prisma format --check
! There are unformatted files. Run prisma format to format them.

$ npx jest
Test Suites: 3 failed, 1 passed, 4 total
Tests:       6 failed, 72 passed, 78 total

$ git status --short
(rent arbeidstre)
```

Manuelt lest og verifisert: `middleware.ts` (161 l.), `vercel.json` (14 l.), `app/api/cron/matching/route.ts`, `app/api/cron/journey/route.ts`, `app/api/payment/webhook/route.ts`, `prisma/schema.prisma` (25 modeller, 15 enums, 8 migrasjoner), `__tests__/cron-auth.test.ts`.

## A.2 Nøkkeltall

| Metrikk | Verdi |
|---|---|
| TS/TSX-filer (ikke-generert) | ~709 |
| API-ruter | ~96–98 |
| Prisma-modeller / enums | 25 / 15 |
| Migrasjoner | 8 |
| Json-kolonner | 14 (10 i `Profile`) |
| Onboarding-steg / felt | 13 / ~75 |
| Journey-dager / faser | 30 / 3 aktive (+1 uoppnåelig) |
| Scoring-dimensjoner | 9 |
| `lib/journey/engine.ts` | 1073 linjer (eneste fil i mappen) |
| `lib/matching/` totalt / dødt | 1904 / ~609 linjer |
| `components/ui/microcopy.ts` | 1703 linjer |
| Design-token-systemer | 2 (401 l. med 71 importører + 584 l.) |
| Auth-mekanismer i bruk | 3 |
| CI-jobber (grønne) | 9 (5) |
| Testsuiter (grønne) | 4 (1) |
| Cron-jobber (fungerende) | 2 (**0**) |

## A.3 Dokumentstatus

| Dokument | Status etter v2.0 |
|---|---|
| `TOSOM-MASTERPLAN-v2.0.md` | ✅ **Kanonisk** |
| `tosom-masterplan-v4.md` | ⬇️ Erstattet → `archive/` |
| `TOSOM-PLATTFORMDIAGNOSE-v1.0.md` | ✅ Gyldig underlag |
| `TOSOM-ACT-FINAL-REPORT.md` | ⚠️ Behold, men §6 «Plattformens tilstand» er for optimistisk |
| `ACT-STATE.json` | ✅ Gyldig historikk |
| `PAYMENT-STRATEGY-DECISION.md` | ⛔ **Opphevet** (Vipps only) → `archive/` |
| `tosom-concept-v2-skisse.md` | ✅ Konseptuelt gyldig (Vipps-linjen bekreftet) |
| `journey-engine-refactor-plan.md` | ✅ Gyldig — utfør i bølge H |
| `match-status-lifecycle.md` | ✅ Gyldig — grunnlag for D4/D5 |
| `design-token-migration-guide.md` | ✅ Gyldig — shim beholdes |
| `SECURITY-STABILITY-PLAN-v1.md` | ⚠️ Delvis foreldet (punkt 4 løst; punkt 1 fortsatt åpent) |
| `repo-structure.md` | ⚠️ Må oppdateres etter bølge D |

## A.4 Neste steg

Denne masterplanen inneholder **ingen ACT-instruks**, etter avtale.

Når planen er godkjent, kan `TOSOM-ACT-INSTRUKS-v3.0.md` utarbeides med bølge A–E som steg. Anbefalte krav til v3.0, basert på hva som gikk galt i v2.0:

1. **Ett steg per commit.** Ingen batching.
2. **Funksjonelt ferdigkriterium per steg** — verifisert DB-tilstand eller HTTP-respons, ikke `tsc`/`grep`/`build`.
3. **Ingen sikkerhetsmekanisme kan erstattes med en svakere** — eksplisitt forbud, med referanse til avvik 9→10.
4. **Konfigurasjon og kode endres i samme steg.**
5. **Bølge A må fullføres og verifiseres i produksjon før bølge B starter.**

---

*TOSOM-MASTERPLAN v2.0 — 13. august 2026. Levende dokument. Oppdateres når bølger fullføres.*
*Alle funn i dette dokumentet er verifisert mot commit `7f2d269`.*
