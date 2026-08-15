# TOSOM-MASTERPLAN v4.0 — Konsept, Kode og Vei til Lansering

**Dato:** 14. august 2026
**Commit-basis:** `837c16f` (main)
**Erstatter:** `docs/TOSOM-MASTERPLAN-v3.0.md`
**Underlag:** `TOSOM-MASTERPLAN-v3.0.md`, `TOSOM-ACT-INSTRUKS-v4.0.md`, `ACT-STATE-v4.json` (29 commits), samt Georges egen konseptbeskrivelse av bruker- og admin-opplevelsen
**Metode:** Dokumentanalyse + **verifisering mot faktisk kode og faktisk kjøring** av `tsc`, `jest`, `prisma format`, migreringsrevisjon, samt fullstendig lesing av matching-cron, onboardingflyt, chatflate, admin-flate og betalingsvei.

---

## Fastsatte beslutninger for v4.0 (George, 14.08.2026)

| # | Beslutning |
|---|---|
| 1 | **Resonansnivåer, ikke prosent.** `DEEP` / `STRONG` / `MODERATE` / `GENTLE`. Tall kun i admin |
| 2 | **Stillhetsdeteksjon** — varm impuls etter 48 t stillhet. ToSom begrenser ikke hva folk gjør utenfor plattformen |
| 3 | **Tredje utgang «Vi fant hverandre»** → PDF-eksport av samtalen, deretter full sletting |
| 4 | **`MIN_SCORE = 0.40` overstyres aldri** — heller ikke av 72-timers ventilen |
| 5 | **Bilder: koden er kanon** (dag 15). Kopien rettes til å stemme |
| 6 | **«Ut av køen»-knapp** så lenge brukeren ikke er matchet |
| 7 | **12 kategorier × 12 spørsmål = 144**, alt på bokmål, alt konseptrelevant |
| 8 | **Anonym `JourneyStat`** for statistikk i admin |
| 9 | **Postnummer + koordinater + haversine.** Radius er **dealbreaker**, ikke scoringsdimensjon |
| 10 | **Hobby nå, Pro sammen med Vipps** om ~2 uker |
| 11 | **Lansering: lukket beta 100–200 brukere gjennom hele 30-dagersreisen** før noe annet |
| 12 | **Reportasje, ikke annonse.** Organisk vekst fra de 10 000 gratis |

---

## INNHOLD

- [DEL 0 — Sammendrag](#del-0--sammendrag)
- [DEL 1 — Verifisert tilstand](#del-1--verifisert-tilstand)
- [DEL 2 — Kodeskissen: konseptet mot koden](#del-2--kodeskissen-konseptet-mot-koden)
- [DEL 3 — Matchekvalitet](#del-3--matchekvalitet)
- [DEL 4 — Opplevelsen](#del-4--opplevelsen)
- [DEL 5 — Funnelen](#del-5--funnelen)
- [DEL 6 — Tillit, sletting og statistikk](#del-6--tillit-sletting-og-statistikk)
- [DEL 7 — Admin](#del-7--admin)
- [DEL 8 — Skalering mot 300 000](#del-8--skalering-mot-300-000)
- [DEL 9 — Drift](#del-9--drift)
- [DEL 10 — Vei til lansering](#del-10--vei-til-lansering)
- [APPENDIKS](#appendiks)

---

# DEL 0 — SAMMENDRAG

## 0.1 Hovedkonklusjon

ACT v4.0 leverte 35 av 49 steg over 29 commits. **Koblingsmodellen er bygget** — samtykkeflyten er borte, kohortmatching med terskel og grådig kobling finnes, `endJourney()` sletter, `MatchHistory` sperrer. Det er reell og betydelig framgang.

Men `ACT-STATE-v4.json` oppgir **produkt 87 % / drift 82 %**. Verifisert tilstand er **~57 % lanseringsklarhet**. Og avviket skyldes ikke slurv i utførelsen — det skyldes at **et steg har blitt markert fullført når koden er skrevet, ikke når funksjonen er observert i drift.**

Tre eksempler som beviser mønsteret:

| Steg | Markert | Virkelighet |
|---|---|---|
| C1 `Report`-modell | ✅ Fullført | Modell i skjema, **ingen migrering** → tabellen finnes ikke i databasen |
| G1 `Order` + `WebhookEvent` | ✅ Fullført | Samme — **ingen migrering** |
| B6 Matcherunden | ✅ Fullført | Kohortalgoritmen er riktig — men **feil scorer koblet inn** |
| F5 Kill switches | ✅ Fullført | Definert i `config/features.ts`, **null treff andre steder** — dødkode |

## 0.2 Det største funnet: matchemotoren er ikke i bruk

```ts
// app/api/cron/matching/route.ts:164
const baseScore = computeQuickScore(a.profile, b.profile);

// app/api/cron/matching/route.ts:323-326
/**
 * computeQuickScore — enkel overlapping-score basert på profilverdier.
 * Foreløpig implementasjon; erstattes av unifiedScore når den er tilgjengelig.
 */
function computeQuickScore(profileA: any, profileB: any): number {
```

Cron-jobben importerer **verken** `unifiedScore` **eller** `findBestResonance`. Den bruker en lokal midlertidig funksjon som vekter alder 20 % og litt overlapp — skrevet med kommentaren *«erstattes av unifiedScore når den er tilgjengelig»*.

`lib/matching/unifiedScorer.ts` er 336 linjer med 9 dimensjoner og definerte vekter. Den **er** tilgjengelig. Den ligger i samme mappe. Den fikk 37 nye tester i steg E2. **Den brukes ikke av noe som helst i produksjonsveien.**

ToSoms kjerneløfte er *«kunnskapsbasert matching, ikke utseende»*. `computeQuickScore` er ikke kunnskapsbasert. Dette er den viktigste enkeltlinjen i hele kodebasen.

## 0.3 Det nest største: matchingen er geografiblind

```
lib/validation/onboarding-setup.ts:25   city: z.string().min(1, 'Hvor bur du?')
lib/validation/onboarding-setup.ts:26   distancePref: z.coerce.number().min(1).max(300)
app/api/profile/setup/route.ts:63       city: basic.city                  → lagres
app/api/profile/setup/route.ts:119      distancePref: basic.distancePref  → lagres
```

Onboardingen spør om by og ønsket radius. Begge lagres. Og så:

```bash
$ grep -rn "distancePref|city|distance" lib/matching/*.ts
(0 treff)
```

**Ingen leser dem.** En bruker kan velge «maks 30 km» og bli koblet til noen 800 km unna. Radius er et løfte i grensesnittet som systemet ikke holder.

## 0.4 De fem blokkerne

| # | Blokker | Bevis | Konsekvens |
|---|---|---|---|
| **P0-1** | `Order`, `WebhookEvent`, `Report` mangler migrering | `grep -rl '"Order"' prisma/migrations/` → **0** | 500-feil ved rapportering og betaling |
| **P0-2** | Migrering `0008_b8_cleanup_match` sorterer før `init` | `ls prisma/migrations/` | **Fersk database kan ikke bygges** |
| **P0-3** | Kill switches er dødkode | 0 treff utenfor `config/features.ts` | Ingen nødbrems |
| **P0-4** | `/api/chat/conversations` finnes ikke | `app/chat/page.tsx:164` kaller den | Chat-oversikt alltid tom |
| **P0-5** | `TIME_BUDGET_MS = 240_000` vs. `maxDuration: 60` | Kode vs. `vercel.json` | Cron kuttes stille, tredje gang |

Alle fem er små i kodemengde. Ingen krever arkitekturendring. **Dette er dager, ikke måneder.**

## 0.5 Den gode nyheten — chatten er nesten ferdig

Her tok jeg feil i første gjennomgang, og korreksjonen er verdt like mye plass:

| Georges visjon | Faktisk tilstand |
|---|---|
| Minst 5 fargetemaer i chat | ✅ **5 stemninger** — `calm, warm, deep, gentle, joyful` (`ChatContainer.tsx:187-228`) |
| UI for å bytte | ✅ **`MoodSelector` bygget og montert** (`:107-139`, `:626`) |
| Valget huskes | ❌ Ingen lagring — nullstilles ved reload |
| «Bli kjent» med kategorier | ✅ **Full sløyfe**: `/api/questions` → velg → `sendMessage()` (`BliKjentPanel.tsx:104,118,135`) |
| 12 kategorier × 20 spørsmål | ⚠️ **12 kategorier, 221 spørsmål** finnes. Tre navn er nynorske |

Chatopplevelsen George beskrev er **i praksis bygget**. Det som mangler er tre linjer `localStorage` og én manglende rute.

## 0.6 Lanseringsscore: 57 %

| Dimensjon | Vekt | Score | Vektet |
|---|---|---|---|
| Matchekvalitet (kjerneløftet) | 25 % | 35 % | 8,75 |
| Kjernefunksjon ende-til-ende | 20 % | 70 % | 14,00 |
| Opplevelse (chat, dashboard, onboarding) | 15 % | 85 % | 12,75 |
| Funnel (auth, betaling, vilkår) | 10 % | 40 % | 4,00 |
| Drift og observability | 15 % | 50 % | 7,50 |
| Admin og kontroll | 10 % | 65 % | 6,50 |
| Testmodenhet | 5 % | 60 % | 3,00 |
| **SUM** | **100 %** | | **56,5 ≈ 57 %** |

**Tolkning:** Plattformen er lenger framme enn 57 % antyder på alt *utenom* matchekvalitet — og matchekvalitet er 25 % av vekten fordi det **er** produktet. Kobler du `unifiedScore` og geografi, flytter scoren seg mer enn noe annet enkelttiltak i planen.

Merk at **matchekvalitet trekker snittet ned med om lag 12 poeng alene.** Det er tilsiktet vekting: et produkt som lover kunnskapsbasert matching og leverer aldersnærhet, kan ikke score høyt uansett hvor pen chatten er.

## 0.7 Historikk

| Fase | Rapportert | Verifisert | Avvik |
|---|---|---|---|
| ACT v1 | 90–95 % | 27–31 % | −60 p |
| ACT v3 | 87 % | 67 % | −20 p |
| **ACT v4** | **87 %** | **57 %** | **−30 p** |

Avviket økte igjen. Årsaken er ny og spesifikk: **v4.0 hadde ingen sjekk for at en migrering faktisk var kjørt.** Sjekk 4 spurte «virker funksjonen?», men et skjemasteg kan svare ja i `tsc` og `prisma validate` mens tabellen ikke finnes i databasen. Det hullet lukkes i v5.0 med **Sjekk 6: migrering kjørt og verifisert**.

---

# DEL 1 — VERIFISERT TILSTAND

## 1.1 Per område

| Område | `ACT-STATE-v4` | **Verifisert** | Hovedårsak til avvik |
|---|---|---|---|
| Backend/kjerne | — | **72 %** | Kohortmatching bygget, feil scorer inn |
| Chat | — | **85 %** | 5 temaer + bli kjent finnes; mangler persistering + 1 rute |
| Onboarding | — | **70 %** | 13 steg samler city + radius; ingen autosave, ingen postnummer |
| Matchekvalitet | — | **35 %** | `computeQuickScore`, geografiblind |
| Funnel | — | **40 %** | Vipps kun innlogging, betaling dekorativ, vilkår lagres ikke |
| Admin | — | **65 %** | 16 sider, men ingen statusfarger, ingen statistikk |
| Drift | 82 % | **50 %** | Kill switches dødkode, migreringer mangler, ingen pooling |
| Produkt | 87 % | **57 %** | Summen av over |

## 1.2 Hva ACT v4.0 faktisk leverte — verifisert

| Leveranse | Bevis |
|---|---|
| Samtykkeflyten fjernet | `MatchActions.tsx`, `/api/match/accept`, `findBestMatchFor` — alle slettet |
| `MatchStatus` forenklet | 6 → 3 verdier. `acceptedByA/B`, `rejectedByA/B` borte fra skjema |
| `journeyState` innført | `JourneyUserState` = `IDLE, QUEUED, MATCHED, ON_JOURNEY, COMPLETED` |
| Kohortmatching bygget | `MIN_COHORT_SIZE = 20`, 72-timers ventil, grådig kobling, `deferred`-logg |
| Varsling ved match | `notification.create` × 2 i transaksjonen (`:237`, `:245`) |
| `endJourney()` | Sletting + `MatchHistory` + brukerreset |
| `MatchHistory` som sperreliste | Migrering **kjørt** (5 treff i SQL) — den ene som ble gjort riktig |
| `bothSeenAt` | Migrering `20260813230417_b4_journey_match_scoped` |
| `instrumentation.ts` + edge-config | Begge finnes i rot |
| `loading.tsx` / `error.tsx` | **6 hver** — var 0 |
| Reelle tester | 90 enhetstester passerer. `unifiedScorer` + `dealbreaker` dekket |
| CI `concept-guard` | Ligger i `ci.yml` |
| 23-årsgrense | Konsekvent i 7 filer. **Ingen 18-forvirring** |

## 1.3 De 13 `tsc`-feilene

Alle 13 ligger i `__tests__/`. **Null i produksjonskode.** Diagnose:

```
__tests__/unified-scorer.test.ts:15   Type 'string[]' is not assignable to
                                      type 'Record<string, unknown>'
```

`lib/matching/types.ts:53-78` speiler Prisma `Json?`-kolonner: `personality`, `lifeSituation`, `boundaries` m.fl. er `Record<string, unknown> | null`. Testene sender `string[]`.

**Produksjonskoden er riktig. Testene er feil.** 11 av 13 er samme feil gjentatt. Rettes ved å bruke objekt-form i testfixturene — ikke ved å løsne typene.

`prisma format --check` feiler også. Begge blokkerer CI.

---

# DEL 2 — KODESKISSEN: KONSEPTET MOT KODEN

> Dette er kartet George ba om: hver flate i hans egen beskrivelse, kartlagt mot faktiske filer.
> **FINNES** = virker som beskrevet · **DELVIS** = bygget, men noe mangler · **MANGLER** = finnes ikke

## 2.1 Brukerreisen

### Landing og informasjon

```
«Landing side og informasjon sider som er lett tilegnelig
 med god og kort informasjon på hva tosom er. Det er for 23+.»
```

| Flate | Fil | Status |
|---|---|---|
| Landing | `app/(landing)/page.tsx` (392 l.) | **FINNES** |
| Hvorfor ToSom | `app/hvorfor/page.tsx` (604 l.) | **FINNES** |
| Slik fungerer det | `app/slik-fungerer-det/page.tsx` (287 l.) | **FINNES** |
| Priser | `app/priser/page.tsx` — 349 kr `:365` | **FINNES** |
| Om oss, kontakt, blogg | `app/om-oss/`, `app/kontakt/`, `app/blogg/` | **FINNES** |
| Personvern, vilkår, cookies | `app/personvern/`, `app/vilkår/`, `app/cookies/` | **DELVIS** — mangler koblingsmodell og angrerett |
| 23-årsgrense kommunisert | `components/AgeRequirement.tsx` | **DELVIS** — håndheves i validering, ikke ved porten |

### Registrering: Vipps som autentisering og betaling

```
«Registrering er da i utgangspunktet autentifikasjon av bruker med vipps
 (og betaling om ikke de første 10.000). det koster 349kr en reise på 30 dager.»
```

| Krav | Fil | Status |
|---|---|---|
| Vipps OAuth-innlogging | `app/api/auth/vipps/*` | **FINNES** — men lenken fra `/login` er brutt |
| Vipps ePayment | — | **MANGLER** — nøkler kommer om ~2 uker |
| 349 kr før onboarding | `app/betaling/page.tsx` | **DELVIS** — dekorativ. Ingen `Order` opprettes i reell flyt |
| Gratis for første 10 000 | `lib/payment/freeQuota.ts` | **DELVIS** — logikk finnes, `Order`-tabell mangler i DB (P0-1) |
| `PaymentProvider`-grensesnitt | `lib/payment/provider.ts` | **FINNES** — klar for Vipps-adapter |
| E-post/passord og telefon | `app/register/`, `app/login/` | **FINNES** — bør vurderes fjernet når Vipps er kanon |

### Vilkår

```
«Når man registrerer seg, må man også signere vilkår for bruk av tosom.»
```

| Krav | Status |
|---|---|
| Avkrysning ved registrering | **MANGLER** |
| `termsAcceptedAt` på `User` | **MANGLER** — ingen felt i skjema |
| Angrerett-samtykke | **MANGLER** — juridisk krav ved betaling |

Uten lagret samtykke har du ingen dokumentasjon på at brukeren godtok noe.

### Onboarding

```
«Etter registrering skal man komme på onboarding hvor man fyller inn
 en guidede profil. Deretter når man er ferdig til siste side trykker
 man på «start reisen» som er da ikke vei tilbake.»
```

| Krav | Fil | Status |
|---|---|---|
| Guidet profil | `app/onboarding/OnboardingFlow.tsx` (482 l.) + 13 steg | **FINNES** |
| By/sted | `lib/validation/onboarding-setup.ts:25` → `Profile.lifeSituation.city` | **FINNES** — men leses aldri |
| Ønsket radius | `:26` `distancePref` 1–300 km → `Profile.deepProfileData` | **FINNES** — men leses aldri |
| Postnummer | — | **MANGLER** — nødvendig for avstand |
| Serverside autosave | `/api/onboarding/draft` finnes, **kalles ikke** | **MANGLER** (D4 hoppet) |
| «Start reisen» → kø | `Step10StartReisen.tsx` → `/api/journey/queue` | **FINNES** |
| «Ut av køen» | — | **MANGLER** (beslutning 6) |
| Re-onboarding «bekreft profil» | — | **MANGLER** (G3 hoppet) |

### Kø og venting

```
«Deretter venter man ca. 24 timer. Om nok matches.»
```

| Krav | Fil | Status |
|---|---|---|
| `journeyState = QUEUED` | `app/api/journey/queue/route.ts` | **FINNES** |
| Kohortterskel | `config/matching.ts:10` `MIN_COHORT_SIZE = 20` | **FINNES** |
| 72-timers ventil | `:11` `MAX_QUEUE_WAIT_HOURS = 72` | **FINNES** |
| Ærlig ventetekst | `components/dashboard/WaitingForMatch.tsx` | **FINNES** |
| Tekst ved tynn kø | — | **DELVIS** — mangler «vi venter til vi har nok mennesker» |

### Matching

```
«Deretter får jeg match»
```

| Krav | Fil | Status |
|---|---|---|
| Én motor, cron 05:00 | `app/api/cron/matching/route.ts` | **FINNES** |
| Parvis kobling uten samtykke | `:173-185` grådig på synkende score | **FINNES** |
| Dealbreakere håndhevet | `:157-161` tosidig | **FINNES** |
| Sperreliste | `:151-154` `MatchHistory` | **FINNES** |
| **9-dimensjonal scoring** | `:164` `computeQuickScore` | **MANGLER** 🔴 — `unifiedScore` ikke koblet |
| **Radius/avstand** | — | **MANGLER** 🔴 |
| In-app varsling | `:237`, `:245` | **FINNES** |
| Tidsbudsjett i samsvar | `:23` 240 s vs. 60 s | **MANGLER** 🔴 (P0-5) |

### Dashboard

```
«Dashboard hvor vises chat, innstillinger, Journey steps, men også
 2 kort med resonans score i midten. 1 kort meg og 1 kort min match.
 Der står navn alder og avstand. På Dashboard nede jeg ser en kort og
 rolig oversikt over min Journey, en liten «kalender» som viser dagene»
```

| Krav | Fil | Status |
|---|---|---|
| Dashboard | `app/dashboard/page.tsx` (270 l.) | **FINNES** |
| Resonansmåler | `components/dashboard/PremiumResonanceMeter.tsx` | **DELVIS** — viser tall, skal vise nivå |
| To kort (meg + match) | `components/MatchCard.tsx`, `MatchBreakdown.tsx` | **DELVIS** |
| Navn og alder | — | **FINNES** |
| **Avstand** | — | **MANGLER** — beregnes ikke |
| Journey-kalender | `app/dashboard/journey/page.tsx` (93 l.) | **DELVIS** — tynn, leser kun kontekst |
| «Gå til samtale» | `components/dashboard/PrimaryButtons.tsx` | **FINNES** |
| Innstillinger | `app/settings/` | **DELVIS** |

### Chat — der brukeren bor

```
«en fantastisk rolig chat side med min match, her ser jeg muligheten
 for å skifte hele chat sidens farger, har da minst 5 valg.»
```

| Krav | Fil | Status |
|---|---|---|
| Chatflate | `app/chat/[id]/` + `ChatContainer.tsx` (668 l.) | **FINNES** |
| **5 fargetemaer** | `ChatContainer.tsx:187-228` — `calm, warm, deep, gentle, joyful` | **FINNES** ✅ |
| Bytte-UI | `:107-139` `MoodSelector`, montert `:626` | **FINNES** ✅ |
| Valget huskes | — | **MANGLER** — ingen persistering |
| **Chat-oversikt** | `app/chat/page.tsx:164` → `/api/chat/conversations` | **MANGLER** 🔴 (P0-4) |
| Realtime | Pusher, 9 filer | **FINNES** |
| Mood-farger på meldinger | `MessageBubble.tsx` (546 l.) | **FINNES** |

### Bli kjent

```
«en knapp «bli kjent» hvor jeg finner minst 12 kategorier med 20 spm
 per kategori... Jeg kan velge en spm, trykke på og havner dette i chat»
```

| Krav | Fil | Status |
|---|---|---|
| Panel | `app/chat/components/BliKjentPanel.tsx` (337 l.) | **FINNES** ✅ |
| Hent kategorier | `:104` `fetch('/api/questions')` | **FINNES** |
| Hent spørsmål | `:118` `fetch('/api/questions?categoryId=…')` | **FINNES** |
| **Injiser i chat** | `:135` `await sendMessage(selectedQuestion.content)` | **FINNES** ✅ |
| 12 kategorier | `scripts/seed-questions.ts` | **FINNES** |
| Antall spørsmål | 221 totalt | **DELVIS** — skal bli 12 × 12 = 144 på bokmål |
| Bokmål | 3 kategorinavn er nynorske | **DELVIS** |
| Admin-styring av innhold | — | **MANGLER** |

### Bilder og dag 30

| Krav | Fil | Status |
|---|---|---|
| Bilder etter dag 15 | `imageShareAllowedAt`, `ImageUpload.tsx` | **FINNES** — kopien må stemme |
| Dag 30, to utganger | `app/reisen/avslutning/page.tsx` | **FINNES** |
| Tredje utgang med PDF | — | **MANGLER** (beslutning 3) |
| «Avslutt» sletter hele kontoen | `delete-account/route.ts` | **DELVIS** — sletter match og chat, ikke konto |
| «Ny reise» beholder konto | — | **DELVIS** — mangler bekreft-profil-modus |
| Stillhetsdeteksjon | `lib/journey/engine.ts` — skrevet, ikke koblet | **MANGLER** (beslutning 2) |

## 2.2 Admin

```
«Her har jeg en side med full oversikt og kontroll over tosom.
 Ting er delt opp i farger basert på tilstand grønn, gul/orange og rødt.»
```

**16 admin-sider finnes** (3962 linjer):

```
dashboard · users · matches · journeys · conversations · journey-content
resonance · analytics · chat · logs · system · system/status · tools
reports · login · (root redirect)
```

| Krav | Status |
|---|---|
| Full oversikt på én side | **DELVIS** — `dashboard/page.tsx` har 6 målekort |
| **Grønn/gul/rød statusfarging** | **MANGLER** — ingen severity-logikk |
| Brukerstyring (ban, unban, frys) | **FINNES** |
| Rapportbehandling | **DELVIS** — side finnes, `Report`-tabell mangler i DB (P0-1) |
| Anonym reisestatistikk | **MANGLER** — `JourneyStat` finnes ikke |
| Gratiskvote-oversikt | **MANGLER** |
| Matcherunde-historikk | **DELVIS** — `SystemLog` skrives, ingen visning |
| Egen visuell klasse | **DELVIS** |

**Driftsfeil i admin:** `app/api/admin/stats/route.ts:13` og `journeys/route.ts:13` gjør `new PrismaClient()` i modulscope. Hver serverless-instans åpner en egen forbindelsespool. Ved vekst tømmer dette databasens forbindelser.

## 2.3 Oppsummering av kartet

| Kategori | Antall |
|---|---|
| **FINNES** som beskrevet | 31 punkter |
| **DELVIS** bygget | 19 punkter |
| **MANGLER** helt | 17 punkter |

Konseptet er altså **~65 % uttrykt i kode**. De 17 manglende punktene er ikke jevnt fordelt — de klumper seg i tre områder: **matchekvalitet, funnel og admin-statistikk.**

---

# DEL 3 — MATCHEKVALITET

> ToSoms hele verdiløfte ligger her. Alt annet er innpakning.

## 3.1 Koble `unifiedScore` — planens viktigste enkelttiltak

`lib/matching/unifiedScorer.ts` (336 l.) har 9 dimensjoner:

```
verdier · personlighet · relasjonsstil · kommunikasjon · framtidsvisjon
grenser · emosjonelle behov · livsrytme · modenhet
```

Hver med definert vekt, sum 1,0 (verifisert av test i E2). Cron bruker den ikke.

**Tiltak:** erstatt `computeQuickScore(a.profile, b.profile)` med `unifiedScore(...)` på `app/api/cron/matching/route.ts:164`. Slett `computeQuickScore` (`:326`). Verifiser at scorene fordeler seg fornuftig på et testsett — ikke bare at koden kjører.

Én linje inn, én funksjon ut. Men det er forskjellen mellom «aldersnærhet» og «kunnskapsbasert matching».

## 3.2 Resonansnivåer i stedet for prosent

Skjemaet har allerede enumen, satt til `@default(GENTLE)` og **aldri beregnet**:

```prisma
enum ResonanceLevel { GENTLE  MODERATE  STRONG  DEEP }
```

**Kanonisk avbildning:**

| Nivå | Score | Vises til bruker |
|---|---|---|
| `DEEP` | ≥ 0,80 | «Dyp resonans» |
| `STRONG` | 0,65–0,79 | «Sterk resonans» |
| `MODERATE` | 0,50–0,64 | «God resonans» |
| `GENTLE` | 0,40–0,49 | «Rolig resonans» |
| — | < 0,40 | Ingen match. Brukeren venter |

**Hvorfor ikke prosent:** «Resonans 64» er et tall uten mening, og det inviterer til sammenligning. Får hun 64 og en venninne 81, føles hennes match annenrangs — før hun har sagt hei. Fire ord fjerner rangeringen. «Rolig resonans» er ikke en dårlig match, det er en beskrivelse.

**Hvorfor ikke «Top match 100–75 %»:** det lover for mye. De fleste par vil realistisk ligge 45–70 %. Kaller du 76 % «Top match», setter du en forventning et menneske skal leve opp til.

**Tallene beholdes i admin** — der trengs de for å justere vekter. `MatchBreakdown.tsx:88` viser i dag `{data.totalScore}%` med fargeskala 85/70/55; brukerflaten skal i stedet si *«Dere er nære på verdier, ulike på livsrytme»*. Mer interessant å lese, og mer sant.

## 3.3 Geografi som dealbreaker

```prisma
model Profile {
  postalCode  String?     // NYTT — spørres i onboarding
  latitude    Float?      // NYTT — utledet fra postnummer
  longitude   Float?      // NYTT
  @@index([latitude, longitude])
}
```

**Framgangsmåte:**

1. **Postnummer i onboarding** — nytt felt i samme steg som `city`
2. **Statisk datasett** — Postens åpne postnummerliste (~5000 rader) som JSON i repoet. Ingen eksternt API, virker offline, ingen kostnad, ingen personvernsspørsmål
3. **Utled koordinater ved lagring** i `app/api/profile/setup/route.ts`
4. **Haversine** i `lib/matching/distance.ts`
5. **Radius som dealbreaker** i `sjekkAlleDealbreakers` — **ikke** som scoringsdimensjon

**Hvorfor dealbreaker og ikke vekt:** ber brukeren om maks 30 km, er 800 km ikke «litt dårligere» — det er feil. En preferanse brukeren aktivt har satt, skal håndheves, ikke veies bort. Radius er tosidig: begges grense må respekteres.

**Viktig rekkefølge:** dette må inn **før** beta. Legger du det til etterpå, har de første brukerne ingen postnummer, og du kan ikke utlede koordinater retroaktivt uten å spørre dem på nytt.

## 3.4 `MIN_SCORE` overstyres aldri

I dag: `if (baseScore < 0.4) continue;` (`:165`). Riktig — men 72-timers ventilen kan tvinge en runde der eneste kandidatpar ligger under terskelen.

**Regel:** ventilen tvinger runden til å *kjøre*, aldri til å *koble* under `MIN_SCORE`. Finnes ingen kvalifisert match, venter brukeren videre — og teksten sier det ærlig. Bedre å vente enn å få en match systemet selv vet er svak.

## 3.5 Stillhetsdeteksjon

`lib/journey/engine.ts` har stillhetsdeteksjon skrevet. Den er ikke koblet.

**Regel:** ingen meldinger i 48 timer → journey-cron legger inn ett varmt spørsmål i samtalen fra ToSom selv. Ikke en AI-partner (bryter produktregelen), men systemet som legger en hånd på skulderen.

Dette begrenser ikke hva folk gjør. Møtes de fysisk dag 3 og slutter å bruke chatten, har ToSom gjort jobben sin. Impulsen er for dem som *vil* fortsette men ikke vet hva de skal si.

## 3.6 Kvalitet som må måles, ikke antas

Fra beta, i admin:

| Metrikk | Hvorfor |
|---|---|
| Scorefordeling per runde | Havner alle i `GENTLE`? Vektene er feil |
| Andel køede uten kvalifisert match | Er `MIN_SCORE` for streng for populasjonen? |
| Dealbreaker-avslag per regel | Én regel som blokkerer 80 % er sannsynligvis feil |
| Avstand i koblede par | Respekteres radius reelt? |
| Fullføringsgrad per resonansnivå | **Fullfører `DEEP` oftere enn `GENTLE`?** |

Den siste er den viktigste i hele planen. Den forteller om matchemotoren faktisk virker. Er fullføringsgraden lik på tvers av nivåer, måler ikke scoringen noe reelt — og da må vektene om.

---

# DEL 4 — OPPLEVELSEN

## 4.1 Chat

**Nesten ferdig.** Tre tiltak:

| Tiltak | Innsats |
|---|---|
| Lagre moodvalg (`localStorage`, evt. `Conversation`-felt) | Timer |
| `/api/chat/conversations` (P0-4) | Timer |
| Fjern dev-fallback `dev-user-${id}` i `[id]/page.tsx:14` | Minutter |

Den siste er verdt et ord: uten sesjon lager chatten en falsk bruker-ID, slik at alle meldinger rendres som «meg». I produksjon er det en forvirrende feil — og potensielt en tilgangsfeil.

## 4.2 Bli kjent — 12 × 12 = 144

Dagens innhold: **12 kategorier, 221 spørsmål.** Filens egen kommentar hevder 240 — den lyver med 19. Ni kategorier har 15–19 spørsmål, tre har 20.

Tre kategorinavn er nynorske:

```
«Samfunn & Tilhøyre»            → «Samfunn og tilhørighet»
«Personlegdom & Selvkjennskap»  → «Personlighet og selvinnsikt»
«Oppleving & Nysgjerrigheit»    → «Opplevelser og nysgjerrighet»
```

**Beslutning 7: 12 × 12 = 144, alt bokmål.** Dette er ikke bare beskjæring — det er en redaksjonell gjennomgang der hvert spørsmål vurderes mot konseptet. Kanoniske kategorier:

```
1. Trygghet                      7. Relasjonsmønster
2. Verdier                       8. Emosjonell innsikt
3. Kommunikasjon                 9. Konflikt og grenser
4. Nærhet                       10. Samfunn og tilhørighet
5. Framtidsdrømmer              11. Personlighet og selvinnsikt
6. Livsstil                     12. Opplevelser og nysgjerrighet
```

Med `depthLevel` 1–3 bør hver kategori ha ~4 av hver: lett inngang, middels, dyp. Da kan panelet gradere etter hvor langt i reisen paret er.

**144 spørsmål er Georges skrivejobb** — det er ToSoms stemme, og den kan ikke automatiseres. Strukturen og malen spesifiseres i v5.0.

## 4.3 Dashboard

| Tiltak |
|---|
| Resonansnivå i stedet for tall (DEL 3.2) |
| Avstand på matchkortet (krever DEL 3.3) |
| Journey-kalender: utvid `dashboard/journey/page.tsx` fra 93 linjer til reell visning |
| Fase og milepæler synlig: dag 15 bilder, dag 30 avslutning |
| Reise ikke startet → «venter på at begge har vært innom», ikke «dag 0» |

## 4.4 Onboarding

| Tiltak |
|---|
| **Serverside autosave** — `/api/onboarding/draft` finnes, kobles til `OnboardingFlow.tsx`. **Ikke bruk `sed`** på denne filen; ACT v3 korrupterte den gjentatte ganger |
| **Postnummer** i samme steg som by |
| **«Ut av køen»** så lenge `journeyState = QUEUED` |
| **«Bekreft profilen din»** ved reise nr. 2 — forhåndsutfylt, ikke blankt |
| Nynorsk: «Brukar» (`:399`), «Ver vennleg å prøv igjen» (`:424`) |

---

# DEL 5 — FUNNELEN

## 5.1 Vipps som både dør og kasse

Vipps-innlogging er i praksis BankID-verifisering: ekte mennesker, verifisert alder, norsk tilknytning. **ToSoms sterkeste trygghetstiltak**, og det bør sies tydeligere utad.

| Fase | Tiltak |
|---|---|
| **Nå** | Rett den brutte Vipps-lenken. Vurder å fjerne e-post/passord når Vipps er kanon |
| **Om ~2 uker** | `VippsProvider implements PaymentProvider`. Ruter for create/webhook/status |

**Krav som må holdes** (samme som felte Stripe-forsøket i ACT v1):

1. **Rå body ved signaturverifisering** — aldri `.json()` før verifisering
2. **Idempotens** via `WebhookEvent` med provider-ID som primærnøkkel — Vipps sender samme hendelse flere ganger
3. **Ordre før onboarding**, reise etter betaling
4. **Angrerett-avkrysning** lagret med tidsstempel

## 5.2 Betaling som ærlig pass-through nå

Til Vipps er klar: `FreeQuotaProvider` oppretter `Order(freeQuota: true, status: PAID, amount: 0)` og slipper brukeren gjennom. Betalingssteget skal **ikke** vise en knapp som ikke virker — det skal si ærlig at de første 10 000 er gratis.

Forutsetter at P0-1 lukkes: `Order`-tabellen må finnes i databasen.

## 5.3 Vilkår

```prisma
model User {
  termsAcceptedAt     DateTime?   // NYTT
  termsVersion        String?     // NYTT — hvilken versjon de godtok
  withdrawalWaiverAt  DateTime?   // NYTT — angrerett, ved betaling
}
```

Vilkårene må dekke: hva 349 kr gir (én reise, 30 dager), at man kobles og ikke velger, at motparten kan avslutte og at samtalen da slettes for begge, at alt slettes ved reiseslutt, 23-årsgrense, og ingen refusjon etter påbegynt reise.

**Angrerett:** norsk lov gir 14 dagers angrerett på digitale tjenester med mindre kunden uttrykkelig samtykker til at leveringen starter straks. Én avkrysningsboks:

> ☐ Jeg samtykker til at ToSom starter reisen min straks, og forstår at angreretten dermed bortfaller.

Uten den har enhver bruker 14 dagers ubetinget krav på pengene tilbake.

**Anbefaling:** jurist leser vilkår og personvern før betaling slås på. Ikke nødvendig før beta — den er gratis.

---

# DEL 6 — TILLIT, SLETTING OG STATISTIKK

## 6.1 De tre utgangene ved dag 30

| Valg | Effekt |
|---|---|
| **«Vi fant hverandre»** | PDF-eksport tilbys → `endJourney('found_each_other')` → **hele kontoen slettes** |
| **«Ny reise»** | `endJourney('new_journey')` → konto beholdes → bekreft profil → kø |
| **Tidlig avslutning** | `endJourney('early_exit')` → begge frigjøres |

**PDF-eksporten** er beslutning 3, og den er vakker: to mennesker som har brukt 30 dager på å finne hverandre, får minnet med seg selv om ToSom sletter sitt. Løftet holdes, og de mister ingenting. Det er en avslutning folk vil fortelle andre om.

Teknisk: generer PDF fra meldingene i nettleseren før slettekallet, eller server-side ved eksport-endepunkt. Ingen ny tung avhengighet nødvendig.

## 6.2 Anonym statistikk

Sletting fjerner all data om at reisen fant sted — inkludert tallet du trenger for en reportasje. Løsningen er en tabell uten personopplysninger:

```prisma
model JourneyStat {
  id            String   @id @default(cuid())
  endedAt       DateTime @default(now())
  outcome       String   // found_each_other | new_journey | early_exit | expired
  daysCompleted Int      // hvor langt de kom
  messageCount  Int      // hvor mye de snakket
  bothActive    Boolean  // svarte begge?
  resonanceLevel String  // DEEP | STRONG | MODERATE | GENTLE
  ageBandA      String   // «23-29» — bånd, ikke alder
  ageBandB      String
  distanceBand  String   // «0-25km» — bånd, ikke posisjon
  usedBliKjent  Boolean  // brukte de spørsmålene?

  @@index([endedAt])
  @@index([outcome])
}
```

Ingen ID-er, ingen navn, ingen innhold, ingen posisjon. Men i admin kan du si: *«av 340 fullførte reiser valgte 38 % å fortsette sammen»* — og krysse det mot resonansnivå for å se om motoren virker.

`resonanceLevel` + `outcome` er kombinasjonen som validerer hele matchemotoren.

## 6.3 Rapportering og sletting

| Krav | Status |
|---|---|
| `Report`-modell + API | Kode finnes, **migrering mangler** (P0-1) |
| Rapporter/Avslutt/Blokker i chat | **FINNES** |
| Admin-behandling | Side finnes, blokkert av P0-1 |
| Admin-samtaleinnsyn logges | **FINNES** |
| Reell kontosletting | **DELVIS** — må utvides til hele kontoen ved «Vi fant hverandre» |
| GDPR-dataeksport | **FINNES** |

`Report` skal **ikke** slettes av `endJourney()` — ellers kan man rapportere og deretter avslutte for å skjule sporet.

---

# DEL 7 — ADMIN

## 7.1 Statusfarger

```
«Ting er delt opp i farger basert på tilstand grønn, gul/orange og rødt.»
```

16 sider finnes. Ingen severity-logikk. Foreslått `<StatusBadge severity="ok|warn|critical">` med kanoniske terskler:

| Indikator | 🟢 | 🟡 | 🔴 |
|---|---|---|---|
| Siste matcherunde | < 26 t | 26–48 t | > 48 t |
| Kø-størrelse | ≥ 20 | 1–19 | 0 |
| Runde-varighet | < 30 s | 30–50 s | > 50 s |
| 5xx-rate siste time | 0 | 1–5 | > 5 |
| DB-forbindelser | < 50 % | 50–80 % | > 80 % |
| Åpne rapporter | 0 | 1–5 | > 5 |
| Sentry-feil 24 t | < 10 | 10–50 | > 50 |
| Gratiskvote | < 8000 | 8000–9500 | > 9500 |

Én oversiktsside der alt er synlig samtidig. Er alt grønt, trenger du ikke klikke deg videre.

## 7.2 Det som mangler i admin

| Mangel | Hvorfor det betyr noe |
|---|---|
| Reisestatistikk (`JourneyStat`) | Eneste måte å vite om produktet virker |
| Scorefordeling per runde | Eneste måte å justere matchevektene |
| Matcherunde-historikk | `SystemLog` skrives, men vises ikke |
| Gratiskvote-teller | Du må vite når du nærmer deg 10 000 |
| Rapportkø | Blokkert av P0-1 |
| Spørsmålsredigering | 144 spørsmål bør kunne rettes uten deploy |

## 7.3 Driftsfeil å rette

- `app/api/admin/stats/route.ts:13` og `journeys/route.ts:13`: `new PrismaClient()` → bruk singleton fra `lib/prisma.ts`
- Admin-layout leser `x-url`-header satt i `middleware.ts:67` — fragilt mønster, bør ikke inngå i tilgangsbeslutninger

---

# DEL 8 — SKALERING MOT 300 000

> Målet er 300k som **arkitekturmål med organisk vekst** — ikke en trafikkspiss. Det gjør oppgaven vesentlig mildere.

## 8.1 Ærlig tak i dag

`app/api/cron/matching/route.ts` slik den står:

- Henter **alle** køede brukere med **alle** profildata — ingen `take`, ingen `skip`
- **O(n²)** dobbel løkke over hele køen
- `TIME_BUDGET_MS = 240_000`, men `vercel.json` gir `maxDuration: 60`

| Kø | Sammenligninger | Vurdering |
|---|---|---|
| 100 | ~5 000 | Uproblematisk |
| 500 | ~125 000 | Greit |
| 1 500 | ~1,1 mill. | Nær grensen |
| 2 500 | ~3,1 mill. | **Kuttes av 60 s** |
| 10 000 | ~50 mill. | Umulig |

**Tak i dag: ~1500–2500 i kø per runde.** Rikelig for beta med 200 brukere. Ikke nok for 10 000.

Merk at køen ikke er lik brukerbasen — kun de som venter på match. Ved 50 000 brukere i jevn drift vil køen typisk være noen hundre per natt. Taket rammer først ved store innstrømninger.

## 8.2 Tre faser med tallutløsere

Faser utløses av **målte tall**, ikke av kalender.

| Fase | Utløser | Grep |
|---|---|---|
| **1 — Nå** | — | `TIME_BUDGET_MS` → 50 000. Batching. `select` i stedet for full henting. Indeks på `[journeyState, matchQueuedAt]` |
| **2 — Vekst** | Runde > 30 s **eller** kø > 1000 | Vercel Pro (300 s). Redis-cache. Connection pooling. Prefiltrering på geobøtte + aldersbånd i SQL |
| **3 — Skala** | Runde > 5 min **eller** kø > 10 000 | Blocking/bucketing. Denormalisering av Json-felt. Worker-kø. Read replicas |

**Fase 1 er obligatorisk før beta. Fase 2 før du slipper inn over 1000. Fase 3 tidligst ved 50 000.**

## 8.3 Denormalisering — når, ikke om

Kjerneproblemet ved skala: all filtrering skjer i JavaScript etter at data er lastet, fordi profildata ligger i Json-kolonner Postgres ikke kan indeksere.

```prisma
model Profile {
  latitude   Float?      // fase 1 (trengs for avstand uansett)
  longitude  Float?
  geoBucket  String?     // fase 2
  gender     Gender?     // fase 2
  seeking    Gender?
  lifePhase  LifePhase?

  @@index([geoBucket, age])
  @@index([gender, seeking, age])
}
```

Json-kolonnene beholdes for **scoring av nyanser** — de er riktige der. De er feil sted for **filtrering**.

Geografifeltene kommer i fase 1 fordi avstand krever dem. De øvrige venter til tallene krever det.

## 8.4 Realtime og meldingsvekst

**Pusher ved 300k:** ved 3 % samtidighet ~9000 tilkoblinger. Kanal per samtale, ingen broadcast-kanaler. Presence-kanaler er dyre — bruk dem sparsomt.

**Meldingstabellen:** 300k brukere × 30-dagersreiser × anslagsvis 200 meldinger ≈ **30 millioner rader per syklus**. `Message` har `@@index([conversationId, createdAt])` — riktig indeks. Men:

**Sletteloopen er din redning.** Fordi `endJourney()` sletter alt innhold, vokser ikke meldingstabellen ubegrenset. Den holder seg proporsjonal med *aktive* reiser, ikke med historikken. Det er en betydelig arkitektonisk fordel som følger direkte av personvernløftet.

## 8.5 Sharding

**Ikke anbefalt.** 300k brukere med aktiv sletting er godt innenfor én velindeksert Postgres. Sharding før 5–10 millioner er selvpålagt kompleksitet.

---

# DEL 9 — DRIFT

## 9.1 Nivå 0 — før beta

| # | Tiltak | Status |
|---|---|---|
| 1 | Migreringer for `Order`, `WebhookEvent`, `Report` | 🔴 P0-1 |
| 2 | Rett migreringsnavn som sorterer feil | 🔴 P0-2 |
| 3 | Kill switches koblet til kode | 🔴 P0-3 |
| 4 | `TIME_BUDGET_MS` i samsvar med `maxDuration` | 🔴 P0-5 |
| 5 | `tsc` = 0 feil, `prisma format` grønn | 🟠 |
| 6 | Alarm ved uteblitt matcherunde | 🟠 `cron-health` finnes, ingen abonnent |
| 7 | Sentry DSN satt i Vercel | ⚠️ Må bekreftes |
| 8 | Verifisert backup **og** gjenoppretting | 🔴 Aldri testet |
| 9 | Singleton Prisma overalt | 🟠 To ruter bryter |

## 9.2 Kill switches — fra dødkode til nødbrems

`config/features.ts` definerer fire brytere. Grep gir **null treff utenfor filen**.

| Bryter | Skal virke i |
|---|---|
| `MATCHING_ENABLED` | `app/api/cron/matching/route.ts` — hopp over, behold køen |
| `REGISTRATION_ENABLED` | Registrerings- og Vipps-callback-ruter |
| `PAYMENTS_ENABLED` | Betalingsvei — gratismodus når av |
| `MAINTENANCE_MODE` | `middleware.ts` → `app/maintenance/` |

Å kunne stanse matching **uten** å ta ned nettstedet er hele poenget: oppdager du en feil i koblingslogikken kl. 05:30, vil du stoppe runden, ikke produktet.

## 9.3 Nivå 1 — under beta

| Metrikk | Hvorfor |
|---|---|
| Kø-størrelse per døgn | Utløser kohortterskelen |
| Koblinger per runde | Kjernefunksjonens puls |
| Runde-varighet | Tidlig varsel om fase 2 |
| **Andel som oppdager matchen innen 24 t / 48 t** | Validerer beslutningen om ingen varsling |
| Onboarding-fullføring per steg | Hvor faller de fra? |
| Dag-N-retensjon (1/7/15/30) | Fullfører de reisen? |
| **Fullføringsgrad per resonansnivå** | **Validerer matchemotoren** |
| Bli kjent-bruk per par | Er det ToSoms beste funksjon, som antatt? |
| Rapporter per 1000 reiser | Trygghetsindikator |

To av disse er hypoteser forkledd som beslutninger, og må måles: **ingen varsling ved match** og **at bli kjent er kjernestrategien**.

Faller oppdagelsesraten under ~70 % innen 48 timer, er én rolig e-post — *«Noen venter på deg»* — ikke et brudd med filosofien, men en tilpasning til virkeligheten.

## 9.4 Rollback

Vercel ruller tilbake deploys øyeblikkelig. **Databasemigreringer gjør det ikke.** Derfor: additivt først, brytende samlet, verifisert backup umiddelbart før, aldri fredag. `MATCHING_ENABLED=false` som første tiltak ved mistanke.

---

# DEL 10 — VEI TIL LANSERING

## 10.1 Seks bølger

### B0 — Nødbremsen (1–2 dager) 🔴 SPERRE

Migreringer for `Order`/`WebhookEvent`/`Report`. Rett migreringsnavnet. **`unifiedScore` inn i cron.** `TIME_BUDGET_MS` → 50 000. Koble kill switches. `/api/chat/conversations`. Rett 13 `tsc`-feil. `prisma format`. Singleton Prisma.

**Ferdigkriterium:** ny database kan bygges fra migreringene. Rapportering og betaling gir 200. `MATCHING_ENABLED=false` stanser runden. CI grønn. **Matcher opprettes med 9-dimensjonal score.**

### B1 — Geografi og resonans (2–3 dager) 🔴

Postnummer i onboarding. `latitude`/`longitude` på `Profile`. Postnummer-datasett som JSON. Haversine. **Radius som dealbreaker.** `ResonanceLevel` beregnes og vises som ord. Avstand på matchkortet.

**Ferdigkriterium:** to brukere med 30 km-preferanse og 800 km avstand blir **ikke** koblet — verifisert i databasen. Dashboard viser «Sterk resonans», ikke «74 %».

> B0 og B1 er én uke, og de er absolutt første prioritet. Uten dem leverer ikke ToSom kjerneløftet sitt, og alt annet er pynt.

### B2 — Opplevelsen (3–4 dager)

Moodvalg huskes. Onboarding-autosave. «Ut av køen». Chat-oversikt. Journey-kalender. Stillhetsdeteksjon koblet. Nynorsk fjernet. Kopi rettet (bilder dag 15, tynn kø).

### B3 — Innhold (Georges skrivejobb, parallelt)

144 spørsmål: 12 kategorier × 12, bokmål, `depthLevel` 1–3 jevnt fordelt. Kan skje parallelt med B2 og B4.

### B4 — Funnel og tillit (3–4 dager)

`termsAcceptedAt` + `termsVersion`. Angrerett-avkrysning. Betaling som ærlig pass-through. Vipps-lenke rettet. Tredje utgang med PDF-eksport. Kontosletting ved «Vi fant hverandre». `JourneyStat`.

### B5 — Admin og drift (4–5 dager)

`StatusBadge` med terskler. Oversiktsside. Rapportkø. Reisestatistikk. Scorefordeling. Gratiskvote-teller. Redis-cache. Connection pooling. Alarmer. **Verifisert backup og gjenoppretting.**

### B6 — Beta (30+ dager kalendertid) 🔒

100–200 inviterte, gratis, gjennom **hele** 30-dagersreisen. Daglig oppfølging av metrikkene i 9.3.

**Kan ikke forkortes.** 30 dager tar 30 dager. Du får ikke vite om produktet virker før noen har fullført en reise.

### B7 — Skalering og reportasje

Vercel Pro. Lasttest som port: 1000 → 5000 → 20 000 i kø. Fase 2-tiltak. **Reportasje først når B6 har levert minst 20 fullførte reiser.**

## 10.2 Tidslinje

| Fase | Varighet | Akkumulert |
|---|---|---|
| B0 + B1 | 1 uke | uke 1 |
| B2 + B4 | 2 uker | uke 3 |
| B5 | 1 uke | uke 4 |
| B6 beta | 5–6 uker | **uke 10** |
| B7 | 2 uker | **uke 12** |

**Reportasje: 3 måneder fram.** Det stemmer med Georges egen følelse av «noen måneder unna».

## 10.3 Porter

| Port | Krav |
|---|---|
| **0 — Intern alfa** | B0+B1 grønn. Full syklus verifisert i DB |
| **1 — Lukket beta** | B2+B4+B5. Backup testet. Rapportering virker |
| **2 — Åpen, gratis til 10 000** | 20+ fullførte reiser. Lasttest 5000 bestått. Vercel Pro |
| **3 — Betaling på** | Vipps testet i testmiljø. Vilkår juridisk gjennomgått |
| **4 — Reportasje** | Port 2 stabil i 2 uker. Alarmer bevist i praksis |

## 10.4 Risikoanalyse

| # | Risiko | Sanns. | Konsekvens | Nivå | Tiltak |
|---|---|---|---|---|---|
| R1 | Manglende migreringer → 500 i prod | **Verifisert nå** | Kritisk | 🔴 | B0 |
| R2 | Fersk DB kan ikke bygges | **Verifisert nå** | Kritisk | 🔴 | B0 |
| R3 | Matching på aldersnærhet | **Verifisert nå** | Kritisk | 🔴 | B0 |
| R4 | Radius ignoreres → match 800 km unna | **Verifisert nå** | Høy | 🔴 | B1 |
| R5 | Cron kuttes stille ved 60 s | Høy | Kritisk | 🔴 | B0 |
| R6 | Ingen nødbrems ved feil | **Verifisert nå** | Høy | 🔴 | B0 |
| R7 | Beta viser at folk slutter dag 12 | Middels | Høy | 🟠 | Stillhetsdeteksjon + mål i B6 |
| R8 | Ingen oppdager matchen uten varsling | Middels | Høy | 🟠 | Måles i B6. Fallback: rolig e-post |
| R9 | Vektene måler ingenting reelt | Middels | Høy | 🟠 | Fullføringsgrad per resonansnivå |
| R10 | For tynn kø i beta | Høy | Middels | 🟠 | Inviter i puljer, geografisk konsentrert |
| R11 | Connection-utmattelse | Middels | Høy | 🟠 | Pooling i B5 |
| R12 | Vipps forsinket | Middels | Lav | 🟡 | Gratiskvote dekker første 10 000 |
| R13 | «Fullført» uten verifisering igjen | **Pågår** | Høy | 🟠 | Sjekk 6 i v5.0 |
| R14 | Ingen har testet gjenoppretting | **Verifisert nå** | Katastrofal | 🔴 | B5 |

**R3 og R13 er de underliggende.** R3 fordi produktet i dag ikke gjør det det lover. R13 fordi mønsteret har gjentatt seg tre ganger og vil gjøre det igjen uten en strukturell sperre.

## 10.5 MUST FIX før beta

**Nødbremsen (1–7)**
1. Migreringer: `Order`, `WebhookEvent`, `Report`
2. Migreringsnavn rettet — fersk DB kan bygges
3. `unifiedScore` koblet i cron
4. `TIME_BUDGET_MS` ≤ 50 000
5. Kill switches virker
6. `/api/chat/conversations`
7. `tsc` = 0, `prisma format` grønn

**Kjerneløftet (8–11)**
8. Postnummer + koordinater
9. Radius som dealbreaker
10. `ResonanceLevel` beregnet og vist som ord
11. `MIN_SCORE` overstyres aldri

**Opplevelsen (12–15)**
12. Moodvalg huskes
13. Onboarding-autosave
14. «Ut av køen»
15. Stillhetsdeteksjon

**Tillit (16–19)**
16. `termsAcceptedAt` lagres
17. PDF-eksport + kontosletting ved «Vi fant hverandre»
18. `JourneyStat`
19. Rapportkø i admin

**Drift (20–23)**
20. Alarm ved uteblitt runde
21. Verifisert backup og gjenoppretting
22. Singleton Prisma overalt
23. Admin-statusfarger

## 10.6 KAN VENTE

**Etter beta:** Vipps ePayment *(når nøkler foreligger)* · admin-redigering av spørsmål · `lib/journey/engine.ts` → moduler · `microcopy.ts`-oppdeling · design-token-konsolidering (852 hardkodede farger) · én auth-inngang på 100 ruter · WCAG-revisjon · penetrasjonstest

**Fase 2/3:** Denormalisering utover geografi · blocking/bucketing · worker-kø · read replicas · partisjonering · **sharding — ikke før 5–10M**

---

# APPENDIKS

## A.1 Verifikasjonslogg

Kjørt 14.08.2026 på commit `837c16f`:

```
$ npx tsc --noEmit
13 feil — ALLE i __tests__/, null i produksjonskode

$ npx jest
Test Suites: 2 failed, 6 passed, 8 total
Tests:       3 failed, 90 passed, 93 total
(3 feil = integrasjonstester som krever Postgres på :5433)

$ npx prisma format --check
! There are unformatted files.

$ ls prisma/migrations/ | sort | head -2
0008_b8_cleanup_match          ← sorterer FØR init
20260628012032_init_postgres_dev

$ for m in MatchHistory Order WebhookEvent Report; do
    grep -rl "\"$m\"" prisma/migrations/ | wc -l; done
MatchHistory: 5    Order: 0    WebhookEvent: 0    Report: 0

$ grep -rn "MATCHING_ENABLED" app lib middleware.ts
(0 treff — kun config/features.ts)

$ test -f app/api/chat/conversations/route.ts
NO - MISSING

$ grep -n "unifiedScore\|findBestResonance" app/api/cron/matching/route.ts
(0 treff — kun i en kommentar)

$ grep -rn "distancePref|city|distance" lib/matching/*.ts
(0 treff)

$ grep -rn "new PrismaClient" app lib
app/api/admin/stats/route.ts:13
app/api/admin/journeys/route.ts:13
lib/prisma.ts:9
```

Manuelt lest: `app/api/cron/matching/route.ts` (full), `app/api/cron/journey/route.ts`, `lib/journey/endJourney.ts`, `app/api/journey/queue/route.ts`, `prisma/schema.prisma`, alle migreringer, `app/chat/components/ChatContainer.tsx`, `BliKjentPanel.tsx`, `app/onboarding/OnboardingFlow.tsx`, `lib/validation/onboarding-setup.ts`, `app/api/profile/setup/route.ts`, `config/features.ts`, `config/matching.ts`, `scripts/seed-questions.ts`, `vercel.json`, `next.config.js`, 16 admin-sider.

## A.2 Nøkkeltall

| Metrikk | v3.0 | **v4.0** |
|---|---|---|
| TS/TSX-filer | 621 | **626** |
| API-ruter | 98 | **100** |
| Sider (ikke-API) | 50 | **51** |
| Admin-sider | 15 | **16** |
| `loading.tsx` / `error.tsx` | 0 / 0 | **6 / 6** |
| Prisma-migrasjoner | 8 | **10** (2 nye, 3 mangler) |
| `tsc`-feil | 1 | **13** (alle i tester) |
| Enhetstester (passerer) | 77 | **90** |
| Testsuiter | 4 | **8** |
| `lib/matching/` totalt | 1316 | **1190** |
| `lib/journey/engine.ts` | 1073 | **1073** |
| Chat-temaer | ukjent | **5** ✅ |
| Spørsmålskategorier | ukjent | **12** (221 spm → 144) |
| Matchemotor i bruk | `findBestResonance` | **`computeQuickScore`** 🔴 |
| Kill switches (virker) | 0 | **4 (0)** |
| Hardkodede HEX-farger | ~2 systemer | **852 forekomster** |

## A.3 Korrigert scoretabell

`docs/ACT-STATE-v4.json` oppgir `produkt: 87, drift: 82`. Korrigert:

```json
"scores": {
  "backend": 72,
  "chat": 85,
  "onboarding": 70,
  "matchekvalitet": 35,
  "funnel": 40,
  "admin": 65,
  "drift": 50,
  "produkt": 57,
  "lansering": 57
}
```

## A.4 Dokumentstatus

| Dokument | Status etter v4.0 |
|---|---|
| `TOSOM-MASTERPLAN-v4.0.md` | ✅ **Kanonisk** |
| `TOSOM-MASTERPLAN-v3.0.md` | ⬇️ Erstattet. Historisk gyldig — DEL 2 fortsatt normativ for koblingsmodellen |
| `TOSOM-ACT-INSTRUKS-v4.0.md` | ✅ Utført 35/49. Sjekk 1–5 videreføres |
| `ACT-STATE-v4.json` | ⚠️ **Scorene korrigeres.** Fire steg feilmarkert som fullført |
| `TOSOM-ACT-INSTRUKS-v5.0.md` | 🔨 Skrives etter denne planen |
| `match-status-lifecycle.md` | ⛔ Foreldet — beskriver samtykkeflyten |
| `LAUNCH-CHECKLIST.md` | ⛔ Foreldet — beskriver Docker |
| `scripts/seed-questions.ts` | ⚠️ Erstattes av 144 bokmålsspørsmål |
| `TOSOM-MASTERPLAN-v2.0.md`, `-v3.0.md` | ✅ Arkiveres som historikk |

## A.5 Neste steg

`docs/TOSOM-ACT-INSTRUKS-v5.0.md` utarbeides med B0–B5 som atomiske steg. Krav til v5.0, basert på hva som gikk galt i v4.0:

1. **Sjekk 6 — migrering kjørt og verifisert.** Et skjemasteg er ikke ferdig før `prisma migrate` er kjørt **og** tabellen er bekreftet i databasen med en `SELECT`. Dette er hullet som slapp `Order`, `WebhookEvent` og `Report` gjennom.
2. **Sjekk 7 — koblet, ikke bare skrevet.** Ny kode må ha en verifisert kallende part. `computeQuickScore` og de fire kill switchene beviser at «filen finnes» ikke er nok.
3. Sjekk 1–5 fra v4.0 videreføres uendret.
4. **B0 er en hard port.** Verifisert i produksjon før B1.
5. **Ett steg = ett commit.** Ingen batching.
6. Migreringer: additivt først, brytende samlet, aldri fredag.

---

*TOSOM-MASTERPLAN v4.0 — 14. august 2026.*
*Levende dokument. Oppdateres når bølger fullføres.*
*Alle funn er verifisert mot commit `837c16f`.*
