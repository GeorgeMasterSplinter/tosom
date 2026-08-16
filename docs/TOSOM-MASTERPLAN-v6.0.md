# TOSOM-MASTERPLAN-v6.0

**Systemets sannhet etter ACT v6 og første driftsobservasjon.**

| | |
|---|---|
| **Dokumentversjon** | 6.0 |
| **Dato** | 16. august 2026 |
| **Verifisert ved commit** | `c93b8cb` |
| **Forrige versjon** | `docs/TOSOM-MASTERPLAN-v5.0.md` (commit `2784ae2`) |
| **Grunnlag** | `docs/ACT-STATE-v6.json`, `docs/TOSOM-ACT-INSTRUKS-v6.0.md` |
| **Lukket beta** | **86 %** |
| **Offentlig lansering** | **70 %** |

> Alle tall i dette dokumentet er målt, ikke anslått. Der noe ikke er målt, står det eksplisitt at det ikke er målt.

---

## Innhold

1. [Oppdatert systemoversikt](#1-oppdatert-systemoversikt)
2. [Oppdatert verifisert tilstand](#2-oppdatert-verifisert-tilstand)
3. [Matching-motoren (post-drift)](#3-matching-motoren-post-drift)
4. [Journey-motoren (post-ACT-v6)](#4-journey-motoren-post-act-v6)
5. [Funnel og onboarding](#5-funnel-og-onboarding)
6. [Drift og observability](#6-drift-og-observability)
7. [API-flater (post-ACT-v6)](#7-api-flater-post-act-v6)
8. [Innhold og språk](#8-innhold-og-språk)
9. [Avvik A1–A15 — status](#9-avvik-a1a15--status)
10. [Lanseringsvurdering](#10-lanseringsvurdering)
11. [Roadmap 30–60 dager](#11-roadmap-3060-dager)
12. [ACT v7 — definisjon](#12-act-v7--definisjon)
13. [Beta-protokoll](#13-beta-protokoll)
14. [Drift-protokoll](#14-drift-protokoll)
15. [Konklusjon](#15-konklusjon)

---

# 1. Oppdatert systemoversikt

## 1.1 Hva ToSom er

ToSom kobler to mennesker om gangen for en reise på tretti dager. Ingen bildekatalog, ingen sveiping, ingen kø av alternativer. Systemet velger ett menneske til deg basert på hvordan dere svarer på dybdespørsmål, og gir dere tretti dager til å finne ut om det bærer.

Fire prinsipper styrer all teknisk utforming:

**Ett menneske om gangen.** En bruker kan ha nøyaktig én aktiv match. Dette er nå målt i drift: null brukere havnet i to matcher av 19 opprettede par.

**Ingen tall til brukeren.** Resonans uttrykkes som ord — DEEP, STRONG, MODERATE, GENTLE — aldri som prosent eller poeng. Etter beslutning i ACT v6 gjelder regelen visningslaget: API-et kan sende tall som transportdata, men klienten konverterer alltid til ord før noe vises.

**Tretti dager, ikke uendelig.** Reisen har en slutt. `endJourney()` sletter innholdet permanent. Fra og med ACT v6 er denne funksjonen dekket av integrasjonstester som faktisk kjører.

**Rolig teknologi.** Ingen varslingsjag, ingen streaks, ingen manipulerende mønstre.

## 1.2 Systemets fysiske form

| Lag | Teknologi | Omfang |
|---|---|---|
| Rammeverk | Next.js 15, App Router | — |
| Språk | TypeScript, strict | 0 typefeil |
| Database | PostgreSQL via Prisma | 14 migrasjoner anvendt |
| Autentisering | NextAuth v5 | `requireAuth` i majoriteten av ruter |
| Sanntid | Pusher | Chat, tilstedeværelse, skriveindikator |
| Feilrapportering | Sentry 10.70 | **Aktiv fra ACT v6** |
| Kjøreplan | Vercel Cron | 2 jobber (Hobby-grense) |
| Tester | Jest + Playwright | **116/116** |

## 1.3 Hva som endret seg i ACT v6

Tolv steg i fem bølger, alle låst, ingen feil registrert i `errors`.

| Bølge | Resultat |
|---|---|
| 0 — Grunnlinje | Arbeidstreet ryddet, tilstand målt og frosset |
| 1 — Systemet må se seg selv | Sentry aktivert, global feilfanger, helsesjekk kallbar utenfra |
| 2 — Ingen kall i tom luft | Fem ruter bygget, fem døde kall fjernet, CI-vakt innført |
| 3 — Én sannhet om fasen | Fasedefinisjonen samlet i `lib/journey/engine.ts` |
| 4 — Språk | Åtte nynorsktreff rettet, språkvakt innført |
| 5 — Sjekk 8 | Testdatabase i drift, 116/116, matcherunde kjørt og målt |

Den viktigste endringen er ikke en enkelt funksjon. Det er at systemet nå **kan fortelle når det feiler**. Før ACT v6 kunne en produksjonsfeil skje uten at noen fikk vite det: Sentry var installert men ikke koblet, ni fetch-kall pekte på ruter som ikke fantes, og helsesjekken hadde ingen avsender. Alle tre er lukket.

## 1.4 Hva som fortsatt er ukjent

Ett forhold overskygger resten: **vi vet at matchemotoren kobler, men ikke at den kobler riktig.** Første observerte runde ga 19 par, men på en testpopulasjon uten reell spredning, og med en avvisningslogg som ikke telte. Del 3 behandler dette i detalj.

---

# 2. Oppdatert verifisert tilstand

## 2.1 Harde prøver ved commit `c93b8cb`

Alle kjørt på nytt under utarbeidelsen av dette dokumentet.

| Prøve | Kommando | Resultat |
|---|---|---|
| Typer | `npx tsc --noEmit` | **0 feil** |
| Skjema | `npx prisma format --check` | **All files are formatted correctly** |
| Tester | `npx jest` | **116/116, 11 suiter, 0,446 s** |
| Bygg | `npm run build` | Grønn |
| API-vakt | `npm run verify:api` | **exit 0** — alle kall matcher ruter |
| Språkvakt | `npm run verify:lang` | **exit 0** — ingen nynorsk i `.tsx` |
| Migrasjoner | `npx prisma migrate status` | 14/14 anvendt |
| Arbeidstre | `git status --porcelain` | Rent |

Sammenlignet med grunnlinjen i ACT v6 steg 0.2:

| Måling | Før (`2784ae2`) | Etter (`c93b8cb`) |
|---|---|---|
| Typefeil | 0 | 0 |
| Tester | 113/116 | **116/116** |
| `withSentryConfig` | 0 treff | **2 treff** |
| `app/global-error.tsx` | Fantes ikke | **Finnes** |
| Brutte fetch-kall | **9** | **0** |
| Fasedupliseringer | 6 steder | **1 kilde** |
| Nynorsktreff | 4 (baseline) + 4 (funnet av vakt) | **0** |
| CI-vakter | 0 | **2** |

## 2.2 Sentry er aktivert

Avvik A7 er lukket.

| Element | Bevis |
|---|---|
| Byggekobling | `next.config.js:143` — `module.exports = withSentryConfig(nextConfig, {…})` |
| Import | `next.config.js:2` |
| Webpack-alias bevart | `next.config.js:6-9` — `config.resolve.alias['@']` intakt |
| CSP utvidet | `next.config.js:71` — `*.ingest.sentry.io *.sentry.io` i `connect-src` |
| Klientoppsett | `instrumentation-client.ts` (49 linjer, `Sentry.init` på `:5`) |
| Serveroppsett | `sentry.server.config.ts`, `sentry.edge.config.ts` |
| Forespørselsfeil | `onRequestError` eksportert fra `instrumentation.ts` |
| Rot-feilfanger | `app/global-error.tsx` (79 linjer) |

Én teknisk avklaring ble gjort under utførelsen: Sentry 10.70 støtter både `sentry.client.config.ts` og `instrumentation-client.ts`, men den første gir en deprekeringsadvarsel. Filen ble flyttet med `git mv`. Uten CSP-linjen på `:71` ville nettleseren blokkert alle rapporter, og Sentry ville sett ut til å virke uten å gjøre det.

**Gjenstår:** `NEXT_PUBLIC_SENTRY_DSN` er dokumentert men tom. Verdien må settes i Vercels miljøvariabler. Dette er en manuell oppgave, ikke en kodeoppgave.

## 2.3 Helsesjekken er kallbar utenfra

Avvik A9 er lukket på repo-siden.

`app/api/cron/health/route.ts` godtar nå to autentiseringsveier: `Authorization: Bearer <CRON_SECRET>` som før, og `?token=<CRON_SECRET>` som alternativ. Begge sammenlignes med `timingSafeEqual`. Statuskodene er uendret: 500 hvis hemmeligheten mangler i miljøet, 401 hvis ingen legitimasjon er gitt, 403 ved feil verdi. Endepunktet er ikke blitt åpent.

Grunnen til den andre veien er praktisk: gratis overvåkingstjenester kan ofte ikke sende egendefinerte headere. `deploy/monitoring.md` beskriver oppsettet.

`vercel.json` er uendret med to cron-jobber. Hobby-planen tillater ikke flere, og begge er brukt av matching og journey.

**Gjenstår:** registrering av den eksterne overvåkeren. Endepunktet er klart; ingen kaller det ennå.

## 2.4 API-konsistens

Avvik A8 er lukket. Ni brutte kall er borte:

| Rute | Behandling |
|---|---|
| `/api/journey/status` | Bygget — GET, `app/api/journey/status/route.ts:18` |
| `/api/profile/me` | Bygget — GET, `app/api/profile/me/route.ts:20` |
| `/api/system/mark-read` | Bygget — POST, `app/api/system/mark-read/route.ts:19` |
| `/api/match/breakdown` | Bygget — GET, `app/api/match/breakdown/route.ts:103` |
| `/api/chat/typing` | Bygget — POST → 204, `app/api/chat/typing/route.ts:17` |
| `/api/match/mark-seen` | Kall fjernet (død kode) |
| `/api/match/new-status` | Kall fjernet (død kode) |
| `/api/match/recommendations` | Kall fjernet (død kode) |
| `/api/me` | Kall fjernet (død kode) |

Alle fem nye ruter bruker `requireAuth`, har `export const dynamic = "force-dynamic"`, og ingen oppretter en egen `PrismaClient`. `profile/me` returnerer verken `latitude` eller `longitude`.

CI-vakten `scripts/verify-api-links.mjs` fant et **femte** brudd som ikke var i grunnlinjen: `/api/payment/create-checkout-session`. Se del 5 og avvik A15.

## 2.5 Fasekonsolidering

Avvik A11 er lukket. Fasedefinisjonen har nå én kilde: `lib/journey/engine.ts` med `PHASE_CONFIGS` og `getPhaseForDay()`. De fem stedene som tidligere definerte faser lokalt importerer nå derfra.

To avvikende steder ble rettet. `components/journey/JourneyTimeline.tsx` hadde seks faser i femdagersbolker mot kanoniske fire. `app/chat/components/ChatHeader.tsx` brukte `journeyDay <= 10` som fasegrense; `phaseLabel` henter nå `getPhaseForDay(journeyDay).description`. Et gjenstående `journeyDay <= 10` på `ChatHeader.tsx:160` er en CSS-avstandsberegning, ikke en fasedefinisjon.

`THEME_RANGES` er urørt. Tema er en egen akse med andre grenser og skal ikke slås sammen med faser.

## 2.6 Språkvask

Avvik A5 er lukket for `.tsx`-filer. Grunnlinjen fant fire nynorsktreff; språkvakten fant fire til i `register/vipps`, `TodayCard`, `NotFound` og `ChatPageClient`. Alle åtte er rettet, inkludert ordet «verktruelege», som ikke finnes på noe norsk.

`deploy/backup.md` står med nynorsk etter beslutning — dokumentasjon, ikke brukersynlig tekst.

**Merk:** vakten dekker kun `.tsx`. Nynorsk i `.ts`-filer fanges ikke.

## 2.7 CI-vaktene

To nye vakter hindrer at lukkede avvik gjenoppstår:

| Vakt | Kommando | Hva den fanger |
|---|---|---|
| API-lenker | `npm run verify:api` | Kall til ruter som ikke finnes |
| Språk | `npm run verify:lang` | Nynorsk i brukersynlige `.tsx` |

Begge gir exit 1 ved treff. API-vakten håndterer dynamiske segmenter og ignorerer NextAuth-stier. Under steg 2.3 ble den prøvd med et bevisst innført brudd og fanget det.

Dette er den strukturelt viktigste endringen i ACT v6. A8 var ikke en engangsfeil — den var en klasse av feil som kunne oppstå igjen ved hver ny komponent, fordi Next.js ikke validerer fetch-strenger ved bygging. Nå gjør vakten det.

## 2.8 Matcherunden er observert

Steg 5.2 kjørte matcherunden mot en ekte database. Dette er første gang. Resultatene er reelle, men gyldighetsområdet er begrenset. Del 3 behandler både.

---

# 3. Matching-motoren (post-drift)

## 3.1 Hva som faktisk skjedde

Kjøringen fant sted i steg 5.2, mot Postgres på port 5433, med 40 seedede brukere i tilstand `QUEUED`.

| Måling | Resultat | Krav | Status |
|---|---|---|---|
| Par opprettet | **19** | ≥ 15 | Innfridd |
| Brukere i to matcher | **0** | 0 | Innfridd |
| Score MIN | **82** | ≥ 40 | Innfridd |
| Score MAX | **95** | ≤ 100 | Innfridd |
| Score AVG | **94,3** | — | — |
| Resonansnivåer | **DEEP = 19** | ≥ 2 ulike | **Ikke innfridd** |
| Radiusbrudd | **0 av 19** | 0 | Innfridd |
| Kjøretid | **173 ms** | < 50 000 ms | Innfridd |
| Igjen i kø | 2 | — | — |

Kill switch ble prøvd separat: `MATCHING_ENABLED=false` gav HTTP 200 med `skipped: true`, ingen nye matcher, og køen intakt.

## 3.2 Hva kjøringen beviste

Fem forhold er nå målt og ikke lenger antatt:

**Motoren fullfører.** 173 ms for 40 brukere, langt innenfor budsjettet på 50 sekunder. Tidsbudsjettet er ikke en flaskehals ved denne størrelsen.

**Ett menneske om gangen holder.** Null brukere i to matcher. Dette er systemets mest grunnleggende løfte, og parkoblingen respekterer det.

**Kill switch virker.** Runden kan stanses uten at køen skades. Dette er den viktigste driftsbryteren ved en hendelse.

**Radius blokkerer ikke feilaktig.** Alle 19 par ligger innenfor begge parters `distancePref`.

**Databaseskrivingen er korrekt.** Par lagres med score, breakdown og resonansnivå.

## 3.3 Hva kjøringen ikke beviste

Her må dokumentet være presist, fordi to forhold begrenser gyldigheten kraftig.

### Avvisningsloggen teller ikke

`app/api/cron/matching/route.ts:93-103` deklarerer `rejectReasons` med ni tellere. `:339` skriver objektet til `SystemLog.metadata`. **Ingen av tellerne inkrementeres noe sted i filen:**

```
grep -c 'rejectReasons\[' app/api/cron/matching/route.ts  →  0
```

De fire avvisningsstedene i den indre løkka gjør bart `continue`:

| Linje | Avvisning | Handling |
|---|---|---|
| `:195` | Mangler profil | `continue` |
| `:200` | På sperreliste | `continue` |
| `:207` | Dealbreaker (tosidig) | `continue` |
| `:213` | Under `MIN_SCORE` | `continue` |

`pairsEvaluated` (`:92`) inkrementeres heller aldri.

Følgen er at den loggede fordelingen — `{radius:0, grenser:0, livsrytme:0, preferanser:0, sperreliste:0, modenhetsgap:0, mangler_profil:0, sikkerhetsniva:0, score_under_termin:0}` — **ikke er et måleresultat, men de hardkodede initialverdiene.** Tallene hadde vært identiske om 700 par ble avvist.

Dette registreres som avvik **A13**. Tiltak T2 fra masterplan v5.0 er dermed ikke levert, til tross for at steget ble låst.

Signaturen er den samme som A7, A8 og A9: koden finnes, koden ser riktig ut, ingenting kaller den. Sjekk 8 skulle fange dette, men gjorde det ikke — fordi «observasjonen» var JSON-utskriften fra en teller som aldri talte. Del 15 behandler hva dette betyr for metoden.

### Testpopulasjonen har ikke reell spredning

`scripts/seed-40.ts:45-190` bygger de 40 brukerne med åtte `Array.from`-løkker. Innenfor hver gruppe er alle felt konstante bortsett fra `id`, `age`, `postal` og `distPref`, med tre unntak der `security`, `comm` og `maturity` varierer på løkkeindeks. To profiler er hardkodet på `:193-216`.

Reelt er dette **åtte arketyper**, ikke 40 individer.

Det forklarer de to påfallende tallene. Score mellom 82 og 95 med gjennomsnitt 94,3 er ikke et sunnhetstegn — det er signaturen til en homogen populasjon. At alle 19 par fikk DEEP følger av det samme. En reell kohort ville fordelt seg fra GENTLE til DEEP.

Stop-regelen i instruksen utløste ikke, fordi den var formulert som «alle matcher GENTLE» — den fanget ikke det motsatte ytterpunktet.

### Følgen for tolkningen

| Bevist | Ikke bevist |
|---|---|
| Motoren kjører uten å krasje | At dealbreakerne avviser noen |
| Ingen bruker i to matcher | At `MIN_SCORE = 40` skiller par |
| Kill switch stanser trygt | At radius blokkerer for lang avstand |
| Par lagres korrekt | At resonansnivåene fordeler seg |
| 19 par av 40 i kø | At kohortterskelen på 20 fungerer |
| Kjøretid godt innenfor budsjett | At motoren skalerer forbi 40 |

Konklusjonen er nøktern: **kjøringen viste at motoren starter, ikke at den styrer.**

## 3.4 Konfigurasjon

| Parameter | Verdi | Fil |
|---|---|---|
| `MIN_COHORT_SIZE` | 20 | `config/matching.ts:10` |
| `MAX_QUEUE_WAIT_HOURS` | 72 | `config/matching.ts:11` |
| `MIN_SCORE` | 40 | `config/matching.ts:14` |
| `TIME_BUDGET_MS` | 50 000 | `app/api/cron/matching/route.ts:30` |

Dealbreakerne kalles tosidig på `:204-205` via `sjekkAlleDealbreakers` fra `lib/matching/dealbreaker.ts`. Den tosidige formen er verifisert i koden, men dens virkning er ikke observert i drift.

## 3.5 Risikoer og tiltak

| # | Risiko | Alvor | Tiltak |
|---|---|---|---|
| R1 | Avvisningsloggen er død kode; en runde med null par kan ikke diagnostiseres | **Kritisk** | T1: Inkrementer alle ni tellere og `pairsEvaluated` på hvert `continue` |
| R2 | Dealbreakernes diskriminerende evne er uprøvd i drift | **Kritisk** | T2: Ny testpopulasjon med profiler konstruert for å utløse hver enkelt dealbreaker |
| R3 | Alle par fikk DEEP; nivåfordelingen er ikke demonstrert | Høy | T3: Verifiser spredning over minst tre nivåer i ny runde |
| R4 | Homogen seed gir falsk trygghet i alle matchetall | Høy | T4: Erstatt åtte arketyper med individuell variasjon per bruker |
| R5 | Kohortterskelen på 20 er ikke prøvd ved grensen | Middels | T5: Kjør med 19 og med 21 i kø, verifiser at runden utsettes henholdsvis gjennomføres |
| R6 | Skalering forbi 40 brukere er ukjent | Middels | T6: Kjør med 500 i kø, mål mot tidsbudsjettet |
| R7 | `MAX_QUEUE_WAIT_HOURS = 72` er aldri utløst | Middels | T7: Seed en bruker med `queuedAt` 73 timer tilbake, verifiser prioritering |
| R8 | Stop-regelen fanget ikke ensidig DEEP-fordeling | Lav | T8: Formuler regelen som «kun ett nivå representert», ikke «alle GENTLE» |

---

# 4. Journey-motoren (post-ACT-v6)

## 4.1 Fasekonsolidering

Reisen har fire faser over tretti dager, definert i `lib/journey/engine.ts`:

| Fase | Dager |
|---|---|
| `EARLY` | 1–14 |
| `BUILDING_TRUST` | 15–21 |
| `DEEPER` | 22–25 |
| `CHECKIN` | 26–30 |

Etter ACT v6 er dette den eneste kilden. Før konsolideringen kunne en bruker på dag 12 se tre ulike svar på hvilken fase hun var i, avhengig av hvilken flate hun så på. Det er ikke lenger mulig.

`lib/journey/engine.ts` er klientsikker: den importerer kun `JourneyPhase` fra `@prisma/client` — en ren TypeScript-enum — og én `import type` som strippes ved kompilering. Ingen Prisma-klient, ingen `server-only`, ingen node-moduler. Dette gjør at både server- og klientkomponenter kan bruke samme kilde.

## 4.2 Autosave

Levert i ACT v5, urørt i v6. `hooks/useAutoSave.ts` og `hooks/useAutoSaveForm.ts` lagrer utkast mot `app/api/onboarding/draft/`. En bruker som forlater onboarding midtveis mister ikke svarene.

## 4.3 Stillhetsdeteksjon

Levert i ACT v5, urørt i v6. `detectSilence` kalles fra `app/api/cron/journey/route.ts`. Når to mennesker slutter å snakke, merker systemet det og kan gripe inn med en systemmelding.

Funksjonen er koblet og kjører, men **er ikke observert utløst i drift.** Det krever en reise med reell stillhet over flere døgn og hører til beta-protokollen, ikke til en ACT-syklus.

## 4.4 Avslutning av reisen

`lib/journey/endJourney.ts` sletter innholdet i en reise permanent når de tretti dagene er over, og skriver et sammendrag til `JourneyStat`.

Dette er systemets mest inngripende funksjon, og fram til ACT v6 var den udekket: de tre integrasjonstestene hadde aldri kjørt, fordi testdatabasen ikke var startet. I steg 5.1 ble Postgres startet på port 5433, 14 migrasjoner anvendt, og hele suiten kjørte grønt: **116/116 på 0,428 sekunder.**

Sletting som ikke kan angres er nå testdekket.

## 4.5 Moodpersistens (A3 → v7)

Stemningstilstanden i chat lagres kun i `localStorage`. Bytter brukeren enhet, eller tømmer nettleseren, forsvinner den.

Ikke-blokkerende for lukket beta. Konsekvensen er kosmetisk, ikke funksjonell. Flyttet til v7.

## 4.6 PDF-beslutning (A4 → v7)

Sammendraget av reisen genereres via nettleserens utskriftsdialog, ikke på serveren. Resultatet varierer mellom nettlesere, og på mobil er det upålitelig.

Dette er det siste brukeren tar med seg fra tretti dager. Det fortjener bedre. Men det er ikke blokkerende for lukket beta, der brukergruppen er liten og kjent. Flyttet til v7, med en beslutning som skal tas først: serverside-generering eller en enklere, mer robust visning.

## 4.7 Risikoer og tiltak

| # | Risiko | Alvor | Tiltak |
|---|---|---|---|
| R9 | Stillhetsdeteksjon aldri observert utløst | Høy | T9: Følg en betareise med bevisst stillhet i 72 timer, verifiser systemmelding |
| R10 | Fasekonsolideringen kan ha endret visuell fremstilling i tidslinjen | Middels | T10: Visuell kontroll av `JourneyTimeline` med fire faser mot tidligere seks |
| R11 | `endJourney` testdekket, men aldri kjørt på en reell tretti dagers reise | Middels | T11: Kjør en komprimert reise i beta, verifiser sletting og `JourneyStat` |
| R12 | Moodtilstand tapt ved enhetsbytte | Lav | T12: Flytt til database (v7) |
| R13 | PDF upålitelig på mobil | Middels | T13: Beslutt og bygg robust løsning (v7) |

---

# 5. Funnel og onboarding

## 5.1 Vilkår og samtykke

Levert i ACT v5. `termsAcceptedAt` lagres på brukeren, og `app/vilkår/` inneholder teksten. Samtykke registreres med tidspunkt.

## 5.2 Angrerett

Levert i ACT v5. Fjorten dagers angrerett er dokumentert og teknisk håndtert. Dette er et krav etter norsk forbrukerlovgivning for digitale tjenester mot betaling.

## 5.3 Kontosletting

Levert i ACT v5 under `app/api/settings/`. Brukeren kan slette kontoen sin, og slettingen er reell — ikke en markering.

## 5.4 Betalingsveien er nå en blindvei

Dette er det mest alvorlige funnet i funnelen, og det oppstod **som følge av** ACT v6.

CI-vakten i steg 2.3 fant et femte brutt kall som ikke var i grunnlinjen: `/api/payment/create-checkout-session`. Katalogen fantes, men uten `route.ts` — en tom skallkatalog. Beslutningen var å fjerne kallet, og `handlePayment` ble en no-op som sender brukeren til `/onboarding`.

Det var riktig håndtering av et brutt kall. Men følgen er at det ikke finnes noen betalingsvei i systemet i det hele tatt.

I dag bæres funnelen av gratiskvoten i `lib/payment/freeQuota.ts`, koblet i `app/api/journey/queue/route.ts`. Så lenge `PAYMENTS_ENABLED` er falsk, kommer brukeren gjennom. Settes den sann, finnes ingen vei videre.

Registreres som avvik **A15**. For lukket beta er dette akseptabelt: betaene er invitert og betaler ikke. For offentlig lansering er det blokkerende, og det er hovedgrunnen til at lanseringstallet står på 70 % og ikke høyere.

## 5.5 Spøkelsesfelter i profilen

`app/profile/page.tsx:24-25` erklærer `warmScore` og `phaseOrder` som `number`, og leser dem fra `/api/profile/me` på `:49-50` med fallback `?? 0` og `?? 1`.

Ingen av feltene finnes i databasen:

```
grep -c 'warmScore\|phaseOrder' prisma/schema.prisma  →  0
```

Ruten kan ikke levere dem, så klienten bruker alltid standardverdiene. Brukeren ser tall som ikke betyr noe.

Registreres som avvik **A14**. Dette illustrerer en grense ved API-vakten: den kontrollerer at *ruten* finnes, ikke at *feltene* finnes.

## 5.6 Risikoer og tiltak

| # | Risiko | Alvor | Tiltak |
|---|---|---|---|
| R14 | Ingen betalingsvei; `PAYMENTS_ENABLED=true` gir blindvei | **Kritisk for lansering** | T14: Bygg `create-checkout-session` mot Stripe, eller utsett betaling bevisst og dokumenter det |
| R15 | Spøkelsesfelter viser meningsløse tall | Middels | T15: Fjern feltene fra klienten, eller legg dem i skjemaet med reell utregning |
| R16 | Gratiskvoten bærer hele funnelen alene | Høy | T16: Verifiser kvotegrensen i beta; fastslå hva som skjer når den er brukt opp |
| R17 | Angrerett teknisk håndtert, aldri utøvd | Middels | T17: Prøv full angrerettflyt i beta med refusjon |
| R18 | Kontosletting aldri prøvd på en bruker med aktiv reise | Middels | T18: Slett en konto midt i en reise, verifiser at partneren håndteres verdig |

---

# 6. Drift og observability

## 6.1 Sentry

Aktivert i ACT v6. Se del 2.2 for teknisk bevis.

Dekningen omfatter klientfeil via `instrumentation-client.ts`, serverfeil via `sentry.server.config.ts`, edge-feil via `sentry.edge.config.ts`, feil i App Router-forespørsler via `onRequestError`, og feil som slår ut rot-layoutet via `app/global-error.tsx`.

`disableLogger: true` er beholdt etter beslutning. Advarselen er akseptert og notert.

**Gjenstår:** DSN må settes i Vercel. Til det er gjort, rapporteres ingenting — koblingen finnes, men mottakeren mangler.

## 6.2 Helsesjekk

`app/api/cron/health/route.ts` svarer 200 ved friskt system og 503 når matcherunden ikke har skrevet hjerteslag på 30 minutter. Terskelen kan justeres med `?threshold=`.

Se del 2.3 for autentisering.

## 6.3 Overvåkingsprotokoll

`deploy/monitoring.md` er skrevet i ACT v6 og beskriver hvorfor helsesjekken ikke kan være en tredje cron-jobb, endepunktets URL, begge autentiseringsmåter med anbefaling om Bearer, anbefalt intervall på 15 minutter, alarmregel ved 503 eller manglende svar, og hva 503 faktisk betyr.

**Gjenstår:** monitoren er ikke registrert. Dokumentet beskriver en prosedyre ingen har utført ennå. Fram til det er gjort, står A9 halvveis lukket: endepunktet er klart, avsenderen mangler.

## 6.4 CI-vaktene

Se del 2.7.

En begrensning skal noteres: vaktene finnes som npm-skript, men det er ikke verifisert at de kjøres automatisk i en CI-kjede. Kjøres de bare manuelt, er de en huskeliste, ikke en vakt.

## 6.5 Backup og gjenoppretting (A2 → v7)

`deploy/backup.md` beskriver prosedyren for sikkerhetskopi og gjenoppretting. Dokumentet er verifisert som prosedyre i ACT v5.

Men **gjenoppretting er aldri utført.** RTO er ikke målt. En sikkerhetskopi som ikke er gjenopprettet er en antakelse, ikke en garanti.

Dette krever en produksjonslik database og er en menneskeoppgave. Flyttet til v7.

## 6.6 Cron-oppsett

`vercel.json` har to jobber innenfor Hobby-grensen: matching og journey. `maxDuration` er 60 sekunder for `app/api/cron/*/route.ts`.

Tidene er angitt i UTC, som avviker fra norsk tid med én eller to timer avhengig av årstid. Registrert som avvik A10, ikke-blokkerende, flyttet til v7.

## 6.7 Risikoer og tiltak

| # | Risiko | Alvor | Tiltak |
|---|---|---|---|
| R19 | Sentry koblet, men DSN tom — ingen rapporter kommer fram | **Kritisk** | T19: Sett `NEXT_PUBLIC_SENTRY_DSN` i Vercel, utløs en testfeil, bekreft at den kommer inn |
| R20 | Helsesjekk uten registrert overvåker | **Kritisk** | T20: Registrer monitor etter `deploy/monitoring.md`, verifiser alarm ved 503 |
| R21 | Gjenoppretting aldri utført, RTO ukjent | **Kritisk** | T21: Gjenopprett til en tom database, mål tiden, dokumenter |
| R22 | Vaktene kjøres muligens ikke i CI | Høy | T22: Bekreft at `verify:api` og `verify:lang` kjøres automatisk før utrulling |
| R23 | Cron i UTC kan gi runder på uventet klokketid for brukerne | Middels | T23: Juster tidene, eller dokumenter forskyvningen (v7) |
| R24 | Ingen alarm hvis Sentry selv slutter å motta | Middels | T24: Sett opp en enkel «har vi hørt fra Sentry»-kontroll |

---

# 7. API-flater (post-ACT-v6)

## 7.1 Omfang

| Måling | v5.0 | v6.0 |
|---|---|---|
| API-ruter (`route.ts`) | 104 | **109** |
| Brutte fetch-kall | 9 | **0** |
| CI-vakt for kall | Nei | **Ja** |

Økningen på fem svarer nøyaktig til de fem nye rutene.

## 7.2 Nye ruter

| Rute | Metode | Fil | Kalles fra |
|---|---|---|---|
| `/api/journey/status` | GET | `app/api/journey/status/route.ts:18` | `app/dashboard/page.tsx:126` |
| `/api/profile/me` | GET | `app/api/profile/me/route.ts:20` | `app/profile/page.tsx:42` |
| `/api/system/mark-read` | POST | `app/api/system/mark-read/route.ts:19` | `components/NotificationCenter.tsx:27` |
| `/api/match/breakdown` | GET | `app/api/match/breakdown/route.ts:103` | `components/MatchBreakdown.tsx:35` |
| `/api/chat/typing` | POST → 204 | `app/api/chat/typing/route.ts:17` | `components/chat/ChatRoom.tsx:174,190` |

Fellestrekk: alle bruker `requireAuth`, alle har `export const dynamic = "force-dynamic"`, ingen oppretter egen Prisma-klient.

Noen forhold verdt å merke:

`journey/status` returnerer 200 med tom tilstand for en bruker uten aktiv reise, ikke 404. Dashbordet skal ikke feile for en bruker i `IDLE`.

`chat/typing` skriver ingenting til databasen og svarer 204. En skriveindikator er flyktig; en rad per tastetrykk ville være en skaleringsfeil.

`match/breakdown` sender numeriske verdier som transportdata, og klienten konverterer til ord før visning. Dette var en bevisst beslutning under ACT v6: konseptregelen om «ingen tall til brukeren» gjelder visningslaget, ikke ledningsprotokollen. Ansvaret for å håndheve den ligger nå i `components/MatchBreakdown.tsx`.

## 7.3 Fjernede kall

Fire kall til ruter som aldri fantes ble fjernet sammen med koden som bare eksisterte for dem: `/api/match/mark-seen`, `/api/match/new-status`, `/api/match/recommendations` og `/api/me`.

## 7.4 `/api/payment/create-checkout-session`

Den tomme skallkatalogen er fjernet, og kallet med den. Se del 5.4 og avvik A15. Dette er den viktigste enkeltoppgaven for offentlig lansering.

## 7.5 Døde ruter (A12 → v7)

Masterplan v5.0 målte 53 ruter som ikke kalles fra klientkode. Antallet er ikke målt på nytt i v6, fordi opprydding var eksplisitt utenfor omfanget.

Å slette dem er risikabelt: noen kalles fra serverkomponenter, fra cron, eller fra admin-flater, og fanges ikke av en enkel tekstsøking. En sletting basert på ufullstendig kartlegging kan bryte fungerende funksjonalitet.

Flyttet til v7, med kartlegging før sletting.

## 7.6 Risikoer og tiltak

| # | Risiko | Alvor | Tiltak |
|---|---|---|---|
| R25 | Vakten kontrollerer rutens eksistens, ikke feltenes | Høy | T25: Utvid til å kontrollere responsfelter mot klientens forventning, eller innfør delte typer |
| R26 | Konseptregelen om ingen tall hviler nå på klienten alene | Høy | T26: Legg inn en test som feiler hvis et tall vises i grensesnittet |
| R27 | 53 uavklarte ruter øker angrepsflaten | Middels | T27: Kartlegg alle kallere, også server og cron, før noe slettes (v7) |
| R28 | Betalingskatalogen er borte uten erstatning | **Kritisk for lansering** | T28: Se T14 |

---

# 8. Innhold og språk

## 8.1 Nynorskrestene er fjernet

Åtte treff er rettet i ACT v6. Se del 2.6.

## 8.2 Språkvakten

`npm run verify:lang` gir exit 0 og fanger tolv nynorske ordformer med ordgrenser. Ordgrensene er nødvendige: uten dem gir «selvkjemt» falske treff på «kjem».

**Begrensning:** vakten dekker kun `.tsx`. Nynorsk i `.ts`-filer — som strenger i API-ruter, `lib/` eller `config/` — fanges ikke.

## 8.3 De 144 spørsmålene (B3.2 → v7)

Spørsmålene ligger i `scripts/seed-questions.ts` fordelt på tolv kategorier med tolv dybdenivåer.

De er fortsatt maskingenererte. Dette er ikke en teknisk mangel, men det er den mest merkbare for en bruker. Spørsmålene *er* ToSom — det er dem to mennesker møter hver dag i tretti dager. Skrevet av en språkmodell blir de generiske. Skrevet av George blir de hans.

Ingen ACT-syklus kan løse dette. Det er en skrivejobb, og den er blokkerende for lukket beta.

## 8.4 Tone

Systemets språk skal være rolig og voksent: ingen utropstegn, ingen «Oops», ingen oppstyltet begeistring. `app/global-error.tsx` følger dette — «Noe gikk galt», ikke «Uff, her gikk det galt!».

## 8.5 Risikoer og tiltak

| # | Risiko | Alvor | Tiltak |
|---|---|---|---|
| R29 | 144 spørsmål i maskinstemme | **Blokkerende for beta** | T29: George skriver alle 144 om |
| R30 | Språkvakten dekker ikke `.ts` | Middels | T30: Utvid til `.ts`, unntatt `deploy/` |
| R31 | Tone ikke systematisk gjennomgått i alle flater | Middels | T31: Les gjennom alle brukersynlige tekster som helhet før beta |

---

# 9. Avvik A1–A15 — status

## 9.1 Lukket i ACT v6

| # | Avvik | Fil:linje | Konsekvens før | Status |
|---|---|---|---|---|
| **A5** | Nynorskrester | `JourneySection.tsx:46`, `blogg/[slug]/page.tsx:46`, m.fl. | Feil målform i brukersynlig tekst, ett oppdiktet ord | **Lukket** — 8 treff rettet, vakt innført |
| **A6** | Ukommittert arbeid | Arbeidstre | Rollback uforutsigbar | **Lukket** — treet rent, alt commitet |
| **A7** | Sentry ikke aktiv | `next.config.js:143` | Ingen feilrapportering i produksjon | **Lukket** — `withSentryConfig` + CSP + DSN dokumentert |
| **A8** | 9 brutte fetch-kall | 9 kallsteder | Kall feilet stille, build likevel grønn | **Lukket** — 5 bygget, 4 fjernet, vakt innført |
| **A11** | Fasedefinisjon duplisert 6 steder | `engine.ts:191` + 5 steder | Bruker kunne se 3 ulike faser samme dag | **Lukket** — én kilde |

Delvis lukket:

| # | Avvik | Status |
|---|---|---|
| **A1** | `completedSteps` oppblåst | **Lukket** — `ACT-STATE-v6.json` har 12 reelle steg, 0 feil |
| **A9** | Helsesjekk uten avsender | **Halvveis** — endepunktet klart og dokumentert; monitor ikke registrert → v7 |

## 9.2 Flyttet til v7 (ikke-blokkerende for beta)

| # | Avvik | Fil:linje | Konsekvens | Tiltak |
|---|---|---|---|---|
| **A3** | Mood kun i `localStorage` | Chat-komponenter | Stemning tapt ved enhetsbytte | T12 |
| **A4** | PDF via utskriftsdialog | Reisesammendrag | Upålitelig på mobil | T13 |
| **A10** | Cron i UTC | `vercel.json` | Runder på uventet klokketid | T23 |
| **A12** | 53 døde API-ruter | `app/api/` | Økt angrepsflate, uklar arkitektur | T27 |

## 9.3 Menneskeoppgaver

| # | Avvik | Konsekvens | Hvorfor ikke ACT |
|---|---|---|---|
| **A2** | Gjenoppretting aldri utført, RTO ukjent | Sikkerhetskopi er en antakelse | Krever produksjonslik database |
| **A9** | Monitor ikke registrert | Helsesjekken har ingen avsender | Skjer i nettleser |
| **B3.2** | 144 spørsmål i maskinstemme | Kjerneopplevelsen blir generisk | Georges skrivejobb |
| **B2.7** | Mobil-QA ikke utført | Ukjent oppførsel på små skjermer | Krever fysisk enhet |

## 9.4 Nye avvik funnet i v6

| # | Avvik | Fil:linje | Konsekvens | Status | Tiltak |
|---|---|---|---|---|---|
| **A13** | Avvisningsloggen inkrementeres aldri | `app/api/cron/matching/route.ts:92-103`, avvisning på `:195, :200, :207, :213` | En runde med null par kan ikke diagnostiseres. Loggede nuller er initialverdier, ikke målinger. Tiltak T2 fra v5.0 ikke levert. | **Åpen — kritisk** | T1 |
| **A14** | Spøkelsesfelter `warmScore` / `phaseOrder` | `app/profile/page.tsx:24-25, :49-50, :62-63`; `prisma/schema.prisma` = 0 treff | Brukeren ser tall uten mening. Klienten faller alltid tilbake på `?? 0` / `?? 1`. | **Åpen — middels** | T15 |
| **A15** | Betalingsveien er en blindvei | `handlePayment` → no-op redirect; `app/api/payment/create-checkout-session/` fjernet | Med `PAYMENTS_ENABLED=true` finnes ingen vei gjennom funnelen. Gratiskvoten bærer alt. | **Åpen — kritisk for lansering** | T14 |

## 9.5 Sammendrag

| Status | Antall |
|---|---|
| Lukket | **7** (A1, A5, A6, A7, A8, A11, + A9 delvis) |
| Til v7, ikke-blokkerende | 4 (A3, A4, A10, A12) |
| Menneskeoppgaver | 4 (A2, A9-registrering, B3.2, B2.7) |
| Nye, åpne | 3 (A13, A14, A15) |

---

# 10. Lanseringsvurdering

## 10.1 Lukket beta: 86 %

Opp fra 78 % i v5.0.

**Hva som løftet tallet:**

Systemet kan nå fortelle når det feiler. Det er den enkeltendringen som betyr mest, fordi alt annet hviler på den. Alle klientkall treffer en ekte rute. Hele testsuiten kjører grønt, inkludert de tre testene for uopprettelig sletting som aldri før hadde kjørt. Fasedefinisjonen er samlet, så en bruker ser samme fase overalt. To CI-vakter hindrer at to lukkede avvik gjenoppstår.

**Hva som holder tallet nede:**

De 144 spørsmålene er fortsatt maskingenererte. Det er den mest merkbare mangelen for en betabruker, fordi spørsmålene *er* opplevelsen.

Matchemotorens diskriminerende evne er uprøvd. Vi vet at den kobler. Vi vet ikke at den kobler riktig.

Mobil-QA er ikke utført. Gjenoppretting er ikke prøvd. Ingen overvåker kaller helsesjekken.

## 10.2 Offentlig lansering: 70 %

Opp fra 65 % i v5.0.

Det beskjedne løftet er tilsiktet. Tre forhold veier tungt:

**Betalingsveien finnes ikke.** A15 gjør at en betalende bruker ikke kommer gjennom. For inviterte betatestere er det uten betydning. For offentlig lansering er det absolutt blokkerende.

**Matchekvaliteten er udemonstrert.** Ved 40 homogene testbrukere fikk alle par DEEP. Ved reelle brukere med reell spredning vet vi ikke hva som skjer. Å åpne for publikum uten dette svaret er å gamble med det eneste løftet ToSom gir.

**Ingen skalering er målt.** 173 ms for 40 brukere sier lite om 5 000.

## 10.3 Hvorfor tallene er lavere enn de kunne vært

Fire ACT-sykluser har rapportert for høyt. Dette dokumentet velger bevisst det lavere anslaget der noe ikke er observert.

Konkret: ACT v6 låste tolv av tolv steg med null feil. En optimistisk lesning ville gitt 92 % for beta. Men steg 5.2 låste med en avvisningslogg som ikke telte, og med en testpopulasjon på åtte arketyper. Steget *ble* utført; observasjonen *var* skrevet ned. Den var bare ikke gyldig.

86 % er tallet som tar hensyn til det.

## 10.4 Blokkerende krav før lukket beta

| # | Krav | Ansvar |
|---|---|---|
| 1 | 144 spørsmål skrevet i egen stemme | George |
| 2 | Avvisningsloggen teller reelt (A13) | ACT v7 |
| 3 | Ny matcherunde med spredt populasjon, minst tre resonansnivåer | ACT v7 |
| 4 | Sentry-DSN satt, testfeil bekreftet mottatt | George |
| 5 | Ekstern monitor registrert, alarm ved 503 verifisert | George |
| 6 | Gjenoppretting utført, RTO målt | George |
| 7 | Mobil-QA på fysisk enhet | George |
| 8 | Spøkelsesfelter fjernet eller innført reelt (A14) | ACT v7 |

Fire krever kode. Fire krever et menneske.

## 10.5 Ytterligere krav før offentlig lansering

| # | Krav | Ansvar |
|---|---|---|
| 9 | Betalingsvei bygget eller bevisst utsatt og dokumentert (A15) | ACT v7 / beslutning |
| 10 | Skalering målt ved minst 500 i kø | ACT v7 |
| 11 | Kohortterskel prøvd ved grensen (19 og 21) | ACT v7 |
| 12 | Alle dealbreakere observert utløst minst én gang | ACT v7 |
| 13 | Angrerett utøvd i praksis med refusjon | Beta |
| 14 | Stillhetsdeteksjon observert utløst | Beta |

---

# 11. Roadmap 30–60 dager

## 11.1 Uke 1–2: lukk de tre nye avvikene

ACT v7, bølge 1. Kode.

Gjør avvisningsloggen reell. Bygg en testpopulasjon med faktisk spredning, der hver dealbreaker kan utløses. Kjør matcherunden på nytt og forvent å se avvisninger og flere resonansnivåer. Fjern spøkelsesfeltene.

Ved slutten av uke 2 skal vi kunne svare på om matchemotoren diskriminerer.

## 11.2 Uke 1–3: menneskeoppgavene, parallelt

George. Ikke kode.

De 144 spørsmålene er den største posten og bør starte først, fordi den ikke kan forseres. Sett Sentry-DSN og utløs en testfeil. Registrer overvåkeren. Kjør gjenoppretting og mål tiden. Gå gjennom appen på egen telefon.

## 11.3 Uke 3–4: driftsherding

ACT v7, bølge 2. Kode og oppsett.

Bekreft at vaktene kjøres i CI og ikke bare manuelt. Utvid språkvakten til `.ts`. Mål skalering mot 500 i kø. Prøv kohortterskelen ved grensen. Rett cron-tidene.

## 11.4 Uke 4–6: lukket beta

Drift, ikke utvikling.

Inviter mellom 20 og 40 mennesker. Følg beta-protokollen i del 13. Bruk gratiskvoten; ikke aktiver betaling.

Her møter systemet virkelige mennesker for første gang, og det vil avdekke ting ingen syklus fant.

## 11.5 Uke 6–8: vurdering og beslutning

Les det betaen faktisk viste. Ta stilling til betalingsveien: bygge nå, eller utsette bevisst. Rydd de døde rutene med full kartlegging først. Ta PDF-beslutningen. Flytt mood til databasen.

## 11.6 Fordeling

| Spor | Hva | Hvem |
|---|---|---|
| **ACT v7** | A13, A14, A15, seed, ny runde, skalering, vakter, A3, A4, A10, A12 | Utførende modell |
| **Menneskeoppgaver** | 144 spørsmål, DSN, monitor, gjenoppretting, mobil-QA | George |
| **Beta** | Angrerett, stillhet, kontosletting, kvotegrense | Betatestere |

Sporene er uavhengige og kan gå samtidig.

---

# 12. ACT v7 — definisjon

Dette er omfanget, ikke instruksen. Instruksen skrives separat.

## 12.1 Prinsipp

**Ingen nye funksjoner. Ingen nye ruter** — med det ene unntaket at `create-checkout-session` kan gjenopprettes hvis betaling besluttes bygget. Ingen endring av matchelogikk, kun instrumentering av den. Ingen endring av journey-motoren.

## 12.2 Bølge 1 — de tre nye avvikene

| Sak | Avvik | Innhold |
|---|---|---|
| Avvisningslogg | A13 | Inkrementer alle ni tellere og `pairsEvaluated` på hvert avvisningspunkt. Ikke endre selve matchelogikken. |
| Spøkelsesfelter | A14 | Fjern `warmScore` og `phaseOrder` fra klienten, eller innfør dem i skjemaet med reell utregning. Beslutning kreves først. |
| Betalingsvei | A15 | Bygg `create-checkout-session`, eller utsett bevisst og dokumenter konsekvensen for lansering. Beslutning kreves først. |

## 12.3 Bølge 2 — observer matchingen på nytt

Forutsetter at bølge 1 er ferdig, ellers gjentas feilen fra v6.

Bygg en ny testpopulasjon med individuell variasjon i stedet for åtte arketyper, og med profiler konstruert for å utløse hver enkelt dealbreaker. Kjør runden. Forvent avvisninger som ikke er null, og resonansnivåer over minst tre trinn. Prøv kohortterskelen ved 19 og 21. Mål skalering ved 500 i kø. Prøv `MAX_QUEUE_WAIT_HOURS` med en bruker som har ventet 73 timer.

Godkjenningskriterium: rejectReasons-summen er større enn null, og minst tre resonansnivåer er representert. Er alle par fortsatt DEEP med en spredt populasjon, er det et reelt funn i motoren og skal utredes, ikke rettes i farten.

## 12.4 Bølge 3 — driftsherding

Bekreft eller innfør automatisk kjøring av `verify:api` og `verify:lang` i CI. Utvid språkvakten til `.ts` utenom `deploy/`. Vurder en vakt som fanger felter klienten leser men skjemaet ikke har — samme klasse som A14.

## 12.5 Bølge 4 — ikke-blokkerende opprydding

| Sak | Avvik |
|---|---|
| Moodpersistens til database | A3 |
| PDF-beslutning og bygging | A4 |
| Cron-tider justert eller dokumentert | A10 |
| Døde ruter kartlagt, deretter fjernet | A12 |

A12 krever full kartlegging av kallere — også fra serverkomponenter, cron og admin — før noe slettes.

## 12.6 Utenfor ACT v7

| Sak | Hvorfor |
|---|---|
| 144 spørsmål (B3.2) | Georges skrivejobb |
| Mobil-QA (B2.7) | Krever fysisk enhet |
| Gjenopprettingstest (A2) | Krever produksjonslik database |
| Monitor-registrering (A9) | Skjer i nettleser |
| Sentry-DSN | Vercel-innstilling |

Disse fem hører i George-sporet og skal ikke stå som ACT-steg. Å blande dem er grunnen til at tidligere sykluser rapporterte for høyt.

## 12.7 Metodekrav

Sjekk 8 fanget ikke A13, fordi observasjonen var utskriften fra en teller som aldri talte. **Sjekk 9 — observasjonen må kunne feile.**

Før en måling godtas som bevis, skal det være vist at den kan gi et annet svar. En teller som alltid gir null beviser ingenting. En test som alltid består beviser ingenting. Konkret: før avvisningsloggen godtas, skal det være vist at minst én teller går fra null til et positivt tall når en avvisning faktisk skjer.

---

# 13. Beta-protokoll

## 13.1 Forutsetninger

Ingenting starter før disse er på plass.

| # | Forutsetning | Kontroll |
|---|---|---|
| 1 | Sentry-DSN satt, testfeil mottatt | Feilen er synlig i Sentry |
| 2 | Ekstern monitor registrert | Alarm utløses ved 503 |
| 3 | Gjenoppretting utført | RTO dokumentert |
| 4 | 144 spørsmål skrevet om | `seed-questions.ts` oppdatert |
| 5 | A13 lukket | rejectReasons-sum større enn null |
| 6 | Mobil-QA utført | Kritiske flater kontrollert |
| 7 | `PAYMENTS_ENABLED=false` | Bekreftet i miljøet |
| 8 | Alle harde prøver grønne | tsc 0, jest 116/116, vakter exit 0 |

## 13.2 Deltakere

20 til 40 inviterte. Reell geografisk spredning — ikke bare Oslo. Aldersspredning innenfor målgruppen. Ingen betaler.

Minst 20 er nødvendig for at `MIN_COHORT_SIZE` skal kunne utløse en runde.

## 13.3 Hva som skal observeres

**Onboarding.** Fullfører de? Hvor faller de av? Virker autosave ved avbrudd? Hvor lang tid tar det?

**Matching.** Hvor mange kobles i første runde? Hva sier avvisningsfordelingen nå at den teller? Hvordan fordeler resonansnivåene seg på virkelige mennesker? Hvor mange blir stående i kø, og hvor lenge?

**Reisen.** Åpner de appen daglig? Svarer de på dagens spørsmål? Utløses stillhetsdeteksjon når en samtale dør, og oppleves inngrepet som hjelp eller mas? Fungerer fasene som en opplevd progresjon?

**Avslutning.** Hva skjer på dag 30? Blir sammendraget hentet? Slettes innholdet som lovet? Skrives `JourneyStat`?

**Grenseflater.** Utøver noen angreretten? Sletter noen kontoen midt i en reise, og håndteres partneren verdig? Hva skjer når gratiskvoten er brukt opp?

## 13.4 Godkjenningskriterier

| # | Kriterium | Krav |
|---|---|---|
| 1 | Onboarding fullført | ≥ 70 % av inviterte |
| 2 | Matcherunde gjennomført | Minst én, uten manuelt inngrep |
| 3 | Ingen bruker i to matcher | 0 tilfeller |
| 4 | Resonansnivåer | Minst 3 ulike representert |
| 5 | Avvisningslogg | Sum > 0, fordelingen forklarlig |
| 6 | Daglig bruk | ≥ 50 % åpner appen minst hver tredje dag |
| 7 | Stillhetsdeteksjon | Observert utløst minst én gang |
| 8 | Reise fullført til dag 30 | Minst ett par |
| 9 | Sletting ved avslutning | Verifisert i databasen |
| 10 | Sentry | Alle feil fanget, ingen ukjente krasj |
| 11 | Helsesjekk | Ingen uforklarte 503 |
| 12 | Kritiske feil | 0 som krever manuell databasereparasjon |
| 13 | Mobil | Ingen blokkerende feil på iOS eller Android |

## 13.5 Avbruddskriterier

Betaen stanses umiddelbart hvis en bruker havner i to matcher, hvis innhold slettes utenom `endJourney`, hvis en bruker ser en annens data, hvis matcherunden feiler tre runder etter hverandre, eller hvis en bruker rapporterer å ha sett et tall som resonansuttrykk.

---

# 14. Drift-protokoll

## 14.1 Daglig

Se over Sentry for nye feiltyper. Bekreft at matcherunden kjørte og at helsesjekken svarer 200. Les siste `SystemLog`-oppføringer med avvisningsfordelingen.

## 14.2 Ukentlig

Kontroller køstørrelse og ventetid mot `MAX_QUEUE_WAIT_HOURS`. Se på resonansfordelingen over uken — dominerer ett nivå, er det et signal. Bekreft at sikkerhetskopier faktisk tas. Kjør `npm run verify:api` og `npm run verify:lang` manuelt hvis CI-kjøring ikke er bekreftet.

## 14.3 Månedlig

Gjenopprett en sikkerhetskopi til en tom database og mål tiden. En kopi som ikke er gjenopprettet er en antakelse. Gå gjennom miljøvariabler og hemmeligheter. Vurder om terskelverdiene i `config/matching.ts` stemmer med det driften viser.

## 14.4 Ved hendelse

Sett `MATCHING_ENABLED=false` — dette er verifisert trygt og rører ikke køen. Les Sentry før du endrer kode. Bruk `SystemLog` til å fastslå hva runden faktisk gjorde. Ved databasefeil: gjenopprett etter `deploy/backup.md` framfor å reparere manuelt.

## 14.5 Terskler som utløser handling

| Signal | Terskel | Handling |
|---|---|---|
| Helsesjekk 503 | 2 påfølgende | Kontroller cron-kjøring |
| Par per runde | 0 to runder på rad | Les avvisningsfordelingen |
| Kø-ventetid | > 72 timer | Vurder `MIN_COHORT_SIZE` |
| Rundens kjøretid | > 40 000 ms | Skaleringstiltak |
| Ett resonansnivå dominerer | > 90 % over en uke | Kontroller scoringen |
| Sentry-feilrate | Ny type > 10 per time | Vurder rullering tilbake |

---

# 15. Konklusjon

## 15.1 Hva som er klart

ToSom kan nå se seg selv. Det er den viktigste setningen i dette dokumentet. Før ACT v6 kunne systemet feile i produksjon uten at noen fikk vite det, fordi Sentry var installert men ikke koblet, ni klientkall pekte på ruter som ikke fantes, og helsesjekken hadde ingen avsender. Alle tre kritiske avvik er lukket, og to CI-vakter hindrer at to av dem gjenoppstår.

Testdekningen er komplett for første gang: 116 av 116, inkludert de tre testene for uopprettelig sletting som aldri hadde kjørt fordi databasen ikke var startet.

Matchemotoren har kjørt mot en ekte database og koblet 19 par av 40 brukere på 173 millisekunder, uten at én person havnet i to matcher, og med en kill switch som stanser trygt.

Fasedefinisjonen har én kilde. En bruker på dag 12 ser samme fase overalt.

## 15.2 Hva som gjenstår

**Tre nye avvik.** Avvisningsloggen teller ikke, så en runde uten par kan ikke diagnostiseres. Profilen viser to felter som ikke finnes i databasen. Betalingsveien er blitt en blindvei.

**Matchekvaliteten er udemonstrert.** Vi vet at motoren kobler. Vi vet ikke at den kobler riktig. Testpopulasjonen var åtte arketyper, og alle par fikk DEEP — det er signaturen til homogene data, ikke til god matching.

**Fire menneskeoppgaver.** De 144 spørsmålene, Sentry-DSN og monitor, gjenopprettingstesten, mobil-QA. Ingen av dem kan løses av en modell.

## 15.3 Før lukket beta

Åtte krav, fire i kode og fire hos et menneske. De står i del 10.4.

Det tyngste er ikke teknisk. Det er de 144 spørsmålene. Spørsmålene *er* ToSom — det er dem to mennesker møter hver dag i tretti dager. Maskinskrevne blir de generiske, og en generisk dybdesamtale er en selvmotsigelse.

Det nest tyngste er avvisningsloggen. Ikke fordi den er vanskelig, men fordi uten den er matchemotoren en svart boks. Kobler den null par en dag, står vi uten forklaring.

## 15.4 Før offentlig lansering

Seks krav utover betakravene, i del 10.5. Det avgjørende er betalingsveien: uten den kan en betalende bruker ikke komme gjennom.

## 15.5 Hva metoden lærte oss

Fire sykluser har rapportert for høyt: v1 hevdet 90–95 % mot verifiserte 27–31 %, v3 hevdet 87 % mot 67 %, v4 hevdet 87 % mot 57 %, v5 hevdet 90 % mot 78 %. ACT v6 er den første som ikke gjorde det — 12 av 12 steg låst, null feil, alle harde prøver grønne.

Men v6 avdekket en ny svakhet, og den er verdt å forstå.

Sjekk 8 krevde at atferd skulle være **observert**, ikke bare at kode var skrevet. Steg 5.2 fulgte kravet: en runde ble kjørt, seks spørringer besvart, resultatene skrevet ned. Likevel slapp A13 gjennom — fordi observasjonen var utskriften fra en teller som aldri talte. Målingen var utført. Måleinstrumentet var ødelagt.

Derfor foreslår dette dokumentet **Sjekk 9 — observasjonen må kunne feile.** Før en måling godtas som bevis, skal det være vist at den kan gi et annet svar. En teller som alltid gir null beviser ingenting, uansett hvor mange ganger den leses av.

Det er en enkel regel. Den ville fanget A13 på tretti sekunder.

## 15.6 Status

| | |
|---|---|
| **Lukket beta** | **86 %** |
| **Offentlig lansering** | **70 %** |
| Verifisert ved | commit `c93b8cb` |
| Typefeil | 0 |
| Tester | 116/116 |
| Brutte API-kall | 0 |
| Avvik lukket | 7 av 15 |
| Avvik åpne | 3 nye, 4 til v7 |
| Menneskeoppgaver | 4 |

Systemet er nærmere enn det har vært. Det er også mer ærlig beskrevet enn det har vært, og de to henger sammen.

---

*TOSOM-MASTERPLAN-v6.0 — verifisert ved commit `c93b8cb`, 16. august 2026. Erstatter v5.0.*
