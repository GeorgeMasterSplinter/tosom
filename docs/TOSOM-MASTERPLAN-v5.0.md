# TOSOM-MASTERPLAN-v5.0

**Systemets sannhet — komplett beskrivelse av ToSom-plattformen slik den faktisk eksisterer.**

| | |
|---|---|
| **Dokumentversjon** | 5.0 |
| **Dato** | 15. august 2026 |
| **Referansecommit** | `2784ae2` |
| **Grunnlag** | ACT v5.0 (50 commits) + verifisering v5.0 + dyp kartlegging |
| **Status** | Verifisert. Alle påstander har fil:linje-anker og kan etterprøves. |
| **Erstatter** | TOSOM-MASTERPLAN-v4.0 |

> Dette dokumentet beskriver hva som **er**, ikke hva som er planlagt. Ingen funksjon nevnes uten at den er lest i koden. Ingen tall oppgis uten at det er målt.

---

## Innhold

1. [Systemoversikt](#1-systemoversikt)
2. [Verifisert tilstand (78 %)](#2-verifisert-tilstand-78-)
3. [Matching-motoren](#3-matching-motoren)
4. [Journey-motoren](#4-journey-motoren)
5. [Funnel og tillit](#5-funnel-og-tillit)
6. [Drift og observability](#6-drift-og-observability)
7. [API-flater](#7-api-flater)
8. [Innhold og språk](#8-innhold-og-språk)
9. [Avvik (12 stk)](#9-avvik-12-stk)
10. [Lanseringsvurdering](#10-lanseringsvurdering)
11. [Roadmap 30–60 dager](#11-roadmap-3060-dager)
12. [Beta-testprotokoll](#12-beta-testprotokoll)
13. [Drift-protokoll](#13-drift-protokoll)
14. [QA-protokoll](#14-qa-protokoll)
15. [Konklusjon](#15-konklusjon)

---

# 1. Systemoversikt

## 1.1 Hva ToSom er

ToSom er en norsk relasjonsplattform bygget på én motsetning til bransjen: **brukeren velger å delta, ikke hvem hun deltar med.**

Det finnes ingen sveiping, ingen profilbunke, ingen «ja» eller «nei» til et menneske. Brukeren fullfører onboarding, trykker *Start reisen*, og stiller seg i kø. Neste natt kjører en matcherunde. Hun blir koblet til én person. Deretter følger tretti dager.

Dette kalles **koblingsmodellen**. Den er ikke en funksjon — den er premisset alt annet hviler på. Fjerner man den, er ToSom nok en datingapp.

Konsekvensene av premisset er gjennomgripende:

- Ingen aksepter- eller avslå-flyt finnes i systemet
- Kvaliteten på koblingen må være høy, fordi brukeren ikke kan kompensere med volum
- Reisen har en definert slutt — dag 30 — og en eksplisitt avslutning
- Når reisen avsluttes, slettes alt innhold permanent
- To mennesker som har vært koblet, kobles aldri igjen

## 1.2 Teknisk arkitektur

| Lag | Teknologi |
|---|---|
| Rammeverk | Next.js 15, App Router |
| Språk | TypeScript |
| Database | PostgreSQL via Prisma |
| Hosting | Vercel (Hobby; Pro planlagt) |
| Autentisering | NextAuth + separat JWT-cookie for admin |
| Sanntid | Pusher |
| Cache | Upstash Redis med in-memory fallback |
| Feilrapportering | Sentry (konfigurert, se avvik A7) |
| Betaling | Vipps (nøkler ikke mottatt) |

**Omfang målt ved commit `2784ae2`:**

| Enhet | Antall |
|---|---|
| API-ruter (`app/api/**/route.ts`) | 104 |
| Sider (`app/**/page.tsx`) | 51 |
| Admin-sider | 16 |
| Admin API-ruter | 42 |
| `loading.tsx` | 6 |
| `error.tsx` | 6 |
| `global-error.tsx` | 0 |
| Cron-jobber | 2 |
| Prisma-migrasjoner | 20+ |
| Veiledede spørsmål | 144 |

## 1.3 Systemets fem motorer

ToSom er ikke én applikasjon, men fem samvirkende motorer:

**Matching-motoren** samler køen hver natt, filtrerer på dealbreakere, scorer alle gjenværende par og kobler dem grådig. Beskrevet i del 3.

**Journey-motoren** styrer de tretti dagene: faser, dagsimpulser, stillhetsdeteksjon, og den endelige slettingen. Beskrevet i del 4.

**Funnel-motoren** fører brukeren fra registrering gjennom 13 onboarding-steg til køen, og håndterer samtykke, betaling og sletting. Beskrevet i del 5.

**Drift-motoren** overvåker, cacher, varsler og sikrer. Beskrevet i del 6.

**Innholdsmotoren** leverer 144 veiledede spørsmål i 12 kategorier på tre dybdenivåer. Beskrevet i del 8.

## 1.4 Filosofi som teknisk krav

Tre prinsipper er kodet inn, ikke bare skrevet ned:

**Resonans uttrykkes aldri som tall.** En bruker skal ikke se «Resonans 64 %». Hun skal se *dyp*, *sterk*, *moderat* eller *forsiktig*. Terskler i `lib/matching/resonanceLevel.ts:17`: DEEP ≥ 80, STRONG 65–79, MODERATE 50–64, GENTLE 40–49.

**Geografi er en absolutt grense, ikke en poengsum.** Bor den andre lenger unna enn brukeren har sagt hun aksepterer, skjer koblingen ikke — uansett hvor godt de passer ellers. Implementert som dealbreaker i `lib/matching/dealbreaker.ts:144`, tosidig.

**Statistikk skal ikke kunne identifisere noen.** Modellen `JourneyStat` (`prisma/schema.prisma:666`) lagrer aldersbånd og avstandsbånd, aldri alder eller posisjon.

## 1.5 Mål

| Horisont | Mål |
|---|---|
| Nå | Lukket beta: 100–200 brukere gjennom hele 30-dagersreisen |
| Deretter | Organisk vekst mot 10 000 gratisbrukere |
| Deretter | Redaksjonell omtale — reportasje, ikke annonse |
| Arkitektonisk | 300 000 brukere uten omskriving |

---

# 2. Verifisert tilstand (78 %)

## 2.1 Byggeprøvene

Alle kjørt av meg ved commit `2784ae2`:

| Prøve | Resultat | Forrige syklus |
|---|---|---|
| `npx tsc --noEmit` | **0 feil** | 13 feil |
| `npx prisma format --check` | **OK** | FAIL |
| `npx jest` | **113 / 116** | 90 / 93 |
| `npx next build` | **Grønn**, 51 sider | Grønn |

De tre røde testene ligger alle i `__tests__/integration/endJourney.test.ts` og feiler med `PrismaClientInitializationError: Can't reach database server at localhost:5433`. Dette er et miljøforhold, ikke en kodefeil.

## 2.2 Historikk: rapportert mot verifisert

Fire ACT-sykluser er gjennomført. Hver gang har utførende modell rapportert en tilstand som ikke stemte med koden.

| Syklus | Rapportert | Verifisert | Avvik |
|---|---|---|---|
| ACT v1 | 90–95 % | 27–31 % | −63 |
| ACT v3 | 87 % | 67 % | −20 |
| ACT v4 | 87 % | 57 % | −30 |
| **ACT v5** | **90 %** | **78 %** | **−12** |

Mønsteret var systematisk: **steg ble markert fullført når kode var *skrevet*, ikke når funksjon var *observert*.**

ACT v5.0 innførte to nye kontroller for å bryte mønsteret:

- **Sjekk 6 — migrering kjørt.** En Prisma-modell teller ikke før den finnes i en migrasjonsfil.
- **Sjekk 7 — koblet, ikke bare skrevet.** En funksjon teller ikke før noe kaller den.

De virket. Avviket falt fra 30 til 12 prosentpoeng. De fire falske fullføringene fra v4 — `Report` uten migrering, `Order`/`WebhookEvent` uten migrering, feil scorer koblet, og døde kill switches — er alle reelt rettet denne gangen.

## 2.3 Hva som faktisk ble levert i ACT v5.0

**36 av 38 steg** er reelt gjennomført. To gjenstår: B2.7 (manuell mobil-QA) og B3.2 (innholdsskriving).

### B0 — Blokkerende feil: 8 av 8 verifisert

| Steg | Krav | Verifisert funn |
|---|---|---|
| B0.1 | Migrasjonsrekkefølge | `20260628012032_init_postgres_dev` sorterer først |
| B0.2 | `Order`, `WebhookEvent`, `Report` i migrering | 1 migrasjonsfil hver |
| B0.3 | `unifiedScore` koblet i matcherunden | `computeQuickScore` = 0 treff, `unifiedScore` = 5 treff |
| B0.4 | TypeScript rent | 0 feil |
| B0.5 | Tidsbudsjett innenfor plattformgrense | `TIME_BUDGET_MS = 50_000` < `maxDuration 60` |
| B0.6 | Kill switch koblet | `isMatchingEnabled()` i `route.ts:77` |
| B0.7 | `/api/chat/conversations` | Finnes, kalles fra chat-oversikten |
| B0.8 | Prisma-singleton | 0 reelle `new PrismaClient` utenfor `lib/prisma.ts` |

**Den viktigste enkeltrettingen:** `computeQuickScore` returnerte 0–1 med terskel `0.4`. `unifiedScore` returnerer 0–100. Hadde terskelen blitt stående på `0.4` ved bytte av scorer, ville praktisk talt **alle** par bestått — og matchingen ville blitt tilfeldig uten å feile synlig. `config/matching.ts:14` viser `MIN_SCORE = 40`. Fellen ble unngått.

### B1 — Matchekvalitet: 6 av 6 verifisert

Geografi gikk fra å være data som ble lagret uten å bli lest, til å være en aktiv grense. `lib/geo/lookup.ts` med et 274 kB postnummerdatasett. `postalCode`, `latitude`, `longitude` på `Profile` (`prisma/schema.prisma:80-82`) med sammensatt indeks (`:94`). `haversineKm` brukt som dealbreaker (`lib/matching/dealbreaker.ts:152`). `toResonanceLevel` beregner nivået som tidligere aldri ble utledet.

### B2–B5 — Opplevelse, innhold, tillit, drift

- Kø-uttreden med `DELETE /api/journey/queue` (`route.ts:181`), kalt fra `components/dashboard/WaitingForMatch.tsx:91`
- Stillhetsdeteksjon koblet til dagsimpulsen (`app/api/cron/journey/route.ts:251`)
- 144 spørsmål i 12 kategorier, strukturelt komplett
- Vilkårssamtykke lagret på `User` (`termsAcceptedAt`, `termsVersion`)
- Anonym `JourneyStat` skrevet ved reiseslutt (`lib/journey/endJourney.ts:109`)
- Redis-cache med fallback, admin-oversikt, backup-prosedyre dokumentert

## 2.4 Hvorfor 78 % og ikke 90 %

Tre forhold trekker ned, og de er alle av samme type: **systemet har aldri vært observert i drift.**

1. **Matcherunden har aldri kjørt mot en ekte database med ekte brukere.** Koden er riktig så langt den kan leses. Kohortsamling, terskel, dealbreakere, parkobling og `MatchHistory`-blokkering er aldri sett fungere sammen.
2. **Vi er blinde.** Sentry er konfigurert men ikke aktivert (avvik A7). Feil i produksjon vil ikke nå oss.
3. **Ni fetch-kall peker på ruter som ikke finnes** (avvik A8), inkludert ett fra hovedskjermen etter innlogging.

Det gjenstående arbeidet er ikke lenger arkitektur. Det er innhold, manuell QA, og én ekte kjøring.

---

# 3. Matching-motoren

Matching-motoren er ToSoms hjerte. Den kjører én gang i døgnet, og resultatet kan ikke gjøres om.

## 3.1 Kjøringen

**Definisjon:** `vercel.json:9-14`

```json
{ "path": "/api/cron/matching", "schedule": "0 5 * * *" }
```

| Parameter | Verdi | Kilde |
|---|---|---|
| Tidspunkt | `0 5 * * *` (UTC) | `vercel.json:9-14` |
| Maks kjøretid | 60 s | `vercel.json:4-8`, `route.ts:24` |
| Internt tidsbudsjett | 50 000 ms | `route.ts:30` |
| Frist beregnet | `startedAt + TIME_BUDGET_MS` | `route.ts:58` |

Tidsbudsjettet ligger bevisst 10 sekunder under plattformgrensen, slik at runden rekker å skrive ferdig og logge før Vercel avbryter den.

**Merk:** `0 5 * * *` er UTC. I norsk sommertid er dette 07:00, i vintertid 06:00. Konseptet forutsetter 05:00 norsk tid. Se avvik A10.

## 3.2 Autentisering

`app/api/cron/matching/route.ts:61-74` — tre nivåer, i rekkefølge:

| Tilstand | Respons | Linje |
|---|---|---|
| `CRON_SECRET` mangler i miljøet | 500 «Cron miskonfigurert» | `:61-64` |
| `Authorization: Bearer …` mangler | 401 | `:66-69` |
| Hemmelighet feil | 403 | `:71-74` |

Sammenligningen skjer med `safeCompare` (`:33-36`), som bruker `crypto.timingSafeEqual` etter lengdesjekk. Dette hindrer tidsanalyse.

## 3.3 Kill switch

`route.ts:77-87`:

```ts
if (!isMatchingEnabled()) { … }
```

`isMatchingEnabled()` (`config/features.ts:47`) leser `MATCHING_ENABLED` fra miljøet. Settes den til `"false"`, stanser runden, skriver en `SystemLog`-rad og returnerer `{ ok: true, skipped: true }`.

**Køen røres ikke.** Brukere som står som `QUEUED` forblir `QUEUED`. Bryteren krever ingen deploy — kun en endring i Vercels miljøvariabler.

Tre andre brytere finnes i `config/features.ts`:

| Bryter | Miljøvariabel | Virkning |
|---|---|---|
| `enableRegistration` | `REGISTRATION_ENABLED` | Lukker registrering ved kapasitetspress |
| `enablePayments` | `PAYMENTS_ENABLED` | Av: fri tilgang via gratiskvote. På: krever betaling |
| `maintenanceMode` | `MAINTENANCE_MODE` | Viser `app/maintenance` |

## 3.4 Kohorter og terskler

`config/matching.ts`:

| Konstant | Verdi | Betydning |
|---|---|---|
| `MIN_COHORT_SIZE` | 20 | Minste kø før runden kobler |
| `MAX_QUEUE_WAIT_HOURS` | 72 | Sikkerhetsventil |
| `MIN_SCORE` | 40 | Laveste tillatte resonans (0–100) |
| `MATCH_DELAY_HOURS` | 24 | Ventetid fra kø til kobling |
| `CHAT_PHASE_DAYS` | 30 | Reisens lengde |

**Logikken:** Er køen mindre enn 20, venter runden. En liten kohort gir dårlige koblinger, og en dårlig kobling koster mer enn en dags venting — brukeren kan ikke bytte.

Sikkerhetsventilen bryter denne regelen: har noen ventet over 72 timer, kobles de uansett kohortstørrelse. Uten ventilen ville en bruker i et tynt geografisk område kunne vente i det uendelige.

## 3.5 Scoring

`unifiedScore` (`lib/matching/unifiedScorer.ts:56`) returnerer et tall mellom **0 og 100**.

**Vektene har én sannhetskilde:** `lib/matching/weightConfig.ts:17`

| Dimensjon | Vekt | Innhold |
|---|---|---|
| `base` | 0,35 | Verdier, livssituasjon, personlighet |
| `resonance` | 0,25 | Kommunikasjon, relasjonsstil |
| `semantic` | 0,20 | Framtidsønsker, livsstil |
| `intimacy` | 0,10 | Intimitet, grenser, emosjonelle behov |
| `future` | 0,10 | Livsrytme, modenhet |
| **Sum** | **1,00** | |

Tre funksjoner styrer bruken:

- `getWeights()` (`:29`) — den ene sanne kilden
- `getWeightsWithOverride()` (`:34`) — advarer og faller tilbake til default hvis summen ikke er 1,0 (`:47`)
- `validateWeights()` (`:58`) — avviser negative og ikke-numeriske verdier

`config/matching.ts:20-26` eksporterer `MATCH_WEIGHTS` med identiske verdier, men kun som alias for eldre importer. Filen sier det selv: vektene «skal IKKE ha egne verdier her».

## 3.6 Dealbreakere

Seks regler, alle i `lib/matching/dealbreaker.ts`, samlet i `sjekkAlleDealbreakers()` (`:174`). Rekkefølgen er bevisst — de billigste sjekkene først.

| # | Regel | Funksjon | Linje | Utløser |
|---|---|---|---|---|
| 1 | Modenhetsgap | `checkMaturityGap` | `:19` | For stort sprik i `maturityLevel` |
| 2 | Livsrytmekonflikt | `checkLifeRhythmConflict` | `:36` | Inkompatibel `lifeRhythm` |
| 3 | Eksplisitte preferanser | `checkExplicitPreferences` | `:89` | Brukerens egne dealbreakere |
| 4 | Grenser | `checkBoundaries` | `:114` | Motpartens profil bryter en grense |
| 5 | Radius | `checkRadius` | `:144` | Avstand over akseptert grense |
| 6 | Sikkerhetsnivå | `checkSecurityLevelGap` | `:64` | Gap ≥ 2 i `securityLevel` |

**Radius er tosidig.** Både `:158` og `:164` kan blokkere: Aris grense mot Bo, *og* Bos grense mot Ari. Én av dem holder. Dette er avgjørende — den som har satt en snever radius har gjort et valg, og valget respekteres selv om motparten er romsligere.

Avstanden beregnes med `haversineKm` (`lib/matching/distance.ts:16`), kalt fra `dealbreaker.ts:152`.

## 3.7 Geografi

Kjeden fra brukerens postnummer til en blokkert kobling:

```
Onboarding samler postnummer
        ↓
lib/geo/lookup.ts slår opp i postalCodes.json (274 kB)
        ↓
Profile.postalCode / latitude / longitude   (schema.prisma:80-82)
        ↓  indeks @@index([latitude, longitude])  (schema.prisma:94)
haversineKm(a, b)                            (distance.ts:16)
        ↓
checkRadius — tosidig blokkering             (dealbreaker.ts:144-166)
```

I forrige syklus stoppet denne kjeden ved lagring. `city` og `distancePref` ble samlet inn, validert og lagret — og aldri lest av matchingen. Nå er kjeden hel.

## 3.8 Resonansnivå

`lib/matching/resonanceLevel.ts:17`:

| Nivå | Score | Vises som |
|---|---|---|
| `DEEP` | ≥ 80 | Dyp resonans |
| `STRONG` | 65–79 | Sterk resonans |
| `MODERATE` | 50–64 | Moderat resonans |
| `GENTLE` | 40–49 | Forsiktig resonans |

Enumet fantes i schemaet fra før, men ble aldri beregnet — alle matcher fikk `GENTLE`. Kommentaren i filen (`:3`) dokumenterer dette som funn I-12.

Nivået brukes i chat-oversikten, der det oversettes til en stemning gjennom `MOOD_FROM_LEVEL` (`app/api/chat/conversations/route.ts:100`). Brukeren ser aldri tallet.

## 3.9 MatchHistory

`MatchHistory` finnes i 5 migrasjonsfiler og skrives ved reiseslutt i `lib/journey/endJourney.ts`. Formålet er absolutt: **to mennesker som har vært koblet, kobles aldri igjen.**

Dette er ikke en preferanse brukeren kan slå av. Har man delt tretti dager og valgt å gå hver til sitt, er den døren lukket.

## 3.10 Risikoer — matching

| # | Risiko | Alvorlighet | Grunnlag |
|---|---|---|---|
| R1 | Runden har aldri kjørt mot ekte database med ekte brukere | **Kritisk** | Ingen observasjon finnes |
| R2 | Kohortterskelen på 20 kan blokkere hele beta | **Høy** | Med 100 brukere spredt over Norge kan radius fragmentere køen under 20 |
| R3 | `MIN_SCORE = 40` er aldri kalibrert mot ekte profiler | **Høy** | Terskelen er satt teoretisk |
| R4 | Cron kjører 07:00 norsk sommertid, ikke 05:00 | Middels | `vercel.json:9-14` er UTC |
| R5 | Grådig parkobling gir ikke globalt optimum | Lav | Bevisst valg; alternativet er dyrere |
| R6 | 50 s tidsbudsjett kan bli trangt ved stor kø | Middels | Ikke målt under last |

**Om R2:** Dette er den mest undervurderte risikoen. Seks dealbreakere kjører før scoring. Med 100 brukere spredt geografisk kan radius alene halvere antallet gyldige par. Blir den effektive kohorten mindre enn 20, kobler ikke runden — og hundre mennesker som har trykket *Start reisen* får ingenting. Sikkerhetsventilen på 72 timer redder dem til slutt, men først etter tre døgn med stillhet.

## 3.11 Anbefalinger — matching

| # | Tiltak | Prioritet |
|---|---|---|
| T1 | Kjør runden mot ekte database med minst 40 seedede brukere før beta | **Kritisk** |
| T2 | Logg avvisningsårsak per par, ikke bare antall koblinger | **Kritisk** |
| T3 | Vurder å senke `MIN_COHORT_SIZE` til 10 for beta, med begrunnet tilbakestilling etterpå | Høy |
| T4 | Mål scorefordelingen på ekte profiler før `MIN_SCORE` låses | Høy |
| T5 | Sett `"0 3 * * *"` for 05:00 norsk sommertid, eller dokumenter UTC eksplisitt | Middels |
| T6 | Mål kjøretid ved 100, 1 000 og 10 000 i kø | Middels |

**Om T2:** Uten avvisningslogg er en runde som kobler null par umulig å diagnostisere. Var kohorten for liten? Slo radius ut alle? Lå alle under 40? Dette må logges per årsak, ikke som ett tall.

---

# 4. Journey-motoren

Tretti dager, fire faser, og en slutt som ikke kan angres.

## 4.1 Faser

Kanonisk definisjon: `lib/journey/engine.ts:191-221`

| Fase | Dager | Linje |
|---|---|---|
| `EARLY` | 1–14 | `:198-202` |
| `BUILDING_TRUST` | 15–21 | `:204-208` |
| `DEEPER` | 22–25 | `:210-214` |
| `CHECKIN` | 26–30 | `:216-220` |

`JOURNEY_TOTAL_DAYS = 30` (`:188`). Enumet `JourneyPhase` ligger i `prisma/schema.prisma:451-456`.

En parallell tema-akse finnes i `THEME_RANGES` (`:224-230`) med fem tema fordelt på 1–5, 6–12, 13–20, 21–26, 27–30. **Disse grensene faller ikke sammen med fasegrensene.** Det er ikke nødvendigvis feil — tema og fase kan bevege seg uavhengig — men det er udokumentert.

`isPhotosAllowed(day)` (`:297-299`) returnerer sant fra dag 15. Bilder hører hjemme etter at tillit er bygget, ikke før.

## 4.2 Dagtelling og `bothSeenAt`

Dag 1 begynner ikke når matchen opprettes. Den begynner når **begge** har sett den.

Feltet `bothSeenAt` styrer dette. En bruker som logger inn mandag og en som logger inn onsdag skal ikke være på ulik dag i samme reise. Uten dette ville den ene fått dagsimpuls 3 mens den andre fikk dagsimpuls 1 — i samme samtale.

## 4.3 Tilstandsmaskinen

`JourneyUserState` med fem tilstander:

```
IDLE ──[Start reisen]──> QUEUED ──[matcherunde]──> MATCHED
                            │                          │
                     [ut av køen]              [begge har sett]
                            │                          ↓
                            ↓                     ON_JOURNEY
                          IDLE                         │
                                                  [dag 30 / avslutning]
                                                       ↓
                                                   COMPLETED
```

Overganger logges i `JourneyStateLog` (`prisma/schema.prisma:208`).

## 4.4 Avslutningen

`lib/journey/endJourney.ts` er systemets mest konsekvensrike funksjon. Den kjører som én transaksjon.

**Rekkefølgen:**

1. Avstand beregnes fra begge profiler mens de ennå finnes (`:94-96`) — nødvendig fordi statistikken trenger avstandsbåndet etter at posisjonen er borte
2. `JourneyStat` skrives (`:109`) — anonymt
3. Meldinger, samtale, tilstandslogger slettes (`:136` og videre)
4. `MatchHistory` skrives — sperren mot gjenkobling
5. Begge brukere settes til `journeyState: IDLE` med nullstilte reisefelter

**Hva som overlever:** kun `JourneyStat` og `MatchHistory`. Ingen meldinger. Ingen bilder. Ingen spor av hva som ble sagt.

Dette er ikke en teknisk detalj — det er et løfte til brukeren, og transaksjonen er stedet løftet holdes.

## 4.5 `JourneyStat` — anonym statistikk

`prisma/schema.prisma:666-682`:

| Felt | Type | Merknad |
|---|---|---|
| `endedAt` | DateTime | |
| `outcome` | String | `found_each_other` \| `new_journey` \| `early_exit` \| `expired` |
| `daysCompleted` | Int | |
| `messageCount` | Int | Antall, ikke innhold |
| `bothActive` | Boolean | |
| `resonanceLevel` | String | DEEP \| STRONG \| MODERATE \| GENTLE |
| `ageBandA` | String | «23-29» — bånd, ikke alder |
| `ageBandB` | String | |
| `distanceBand` | String | «0-25km» — bånd, ikke posisjon |
| `usedBliKjent` | Boolean | Brukte de veiledede spørsmålene |

Indeksert på `endedAt` og `outcome`.

Modellen har **ingen fremmednøkkel til bruker**. Den kan ikke kobles tilbake. Dette gjør det mulig å lære av tusen reiser uten å eie noens historie — og er en av de få stedene der personvern og produktinnsikt ikke står i konflikt.

## 4.6 Stillhetsdeteksjon

To lag:

**Motoren:** `lib/journey/engine.ts`
- `SilentMoment`-seksjonen (`:142`)
- `SilenceDetection`-grensesnittet (`:161`)
- `detectSilence(lastActivity, config)` (`:813`)
- Eksportert (`:1060`)

**Koblingen:** `app/api/cron/journey/route.ts`
- `STILLHET_HOURS = 48` (`:31`)
- Brukt i dagsimpulsen (`:251`)

Går det 48 timer uten meldinger, endres dagens impuls til noe varmere. Systemet dømmer ikke og purrer ikke — det senker terskelen.

Dette er B2.5, og den er reelt koblet. Sjekk 7 bestått.

## 4.7 Autosave

Tre lag lagrer onboarding-utkastet:

| Lag | Mekanisme | Kilde |
|---|---|---|
| 1 | `localStorage['tosom_onboarding_draft']`, 400 ms debounce | `OnboardingFlow.tsx:27, 166-170, 235-243` |
| 2 | Server-utkast ved stegbytte | `saveDraftToServer()` `:173-184` → `POST /api/onboarding/draft` |
| 3 | Endelig lagring | `handleStartReisen()` `:342-470` |

Serverutkastet skrives til `Profile.deepProfileData` via `$executeRaw`-upsert (`app/api/onboarding/draft/route.ts:35-42`).

Med 13 steg og rundt 110 felter er dette nødvendig. En bruker som mister forbindelsen på steg 11 skal ikke måtte begynne på nytt.

## 4.8 Moodpersistens

`app/chat/components/ChatContainer.tsx`:

```ts
localStorage.setItem(`${MOOD_STORAGE_PREFIX}${conversationId}`, mood);   // :604
// Les mood fra localStorage ved montering / samtale-endring        // :613
```

Fem stemninger: `calm`, `warm`, `deep`, `gentle`, `joyful`.

**Ingenting lagres i databasen.** `grep -c "mood" prisma/schema.prisma` gir 0. Valget følger enheten, ikke mennesket. Se avvik A3.

## 4.9 PDF-eksport

`app/reisen/avslutning/page.tsx:228-232`:

```ts
// B4.4: PDF-eksport — åpner print-dialog for samtalen før sletting
const [showPdfOffer, setShowPdfOffer] = useState(false);
const handleExportPdf = () => {
  // Åpne print-dialog — brukeren kan velge "Lagre som PDF"
```

Tilbudet vises når brukeren velger «Vi fant hverandre» (`:240-242`), før slettingen utføres.

Implementasjonen er `window.print()`. Det virker, men resultatet avhenger av nettleser, utskriftsstiler og brukerens forståelse av dialogen. Se avvik A4.

## 4.10 Innhold: 144 spørsmål

`scripts/seed-questions.ts` — verifisert: **144 spørsmål** (`grep -c 'depthLevel: [0-9]'`), 12 kategorier, 4 per dybdenivå per kategori.

| # | Kategori | # | Kategori |
|---|---|---|---|
| 1 | Trygghet | 7 | Relasjonsmønster |
| 2 | Verdier | 8 | Emosjonell innsikt |
| 3 | Kommunikasjon | 9 | Konflikt og grenser |
| 4 | Nærhet | 10 | Samfunn og tilhørighet |
| 5 | Framtidsdrømmer | 11 | Personlighet og selvinnsikt |
| 6 | Livsstil | 12 | Opplevelser og nysgjerrighet |

Alle kategorinavn er bokmål. Seedingen er idempotent (upsert).

Filen dokumenterer selv sin begrensning (`:12`): *«B3.2: Innholdet er Georges skrivejobb — dette er strukturen og malen.»*

Strukturen er riktig. Stemmen er ikke skrevet ennå.

## 4.11 Risikoer — journey

| # | Risiko | Alvorlighet | Grunnlag |
|---|---|---|---|
| R7 | Fasedefinisjonen finnes 6 steder, 2 motstridende | **Høy** | Se avvik A11 |
| R8 | Spørsmålene er strukturelle plassholdere | **Høy** | `seed-questions.ts:12` |
| R9 | PDF avhenger av nettleserens utskriftsdialog | Middels | `avslutning/page.tsx:231` |
| R10 | Moodvalg tapes ved enhetsbytte | Lav | Kun localStorage |
| R11 | `endJourney` er aldri kjørt mot ekte Postgres | **Kritisk** | 3 tester røde av miljøårsak |
| R12 | Tema- og fasegrenser er ulike uten dokumentasjon | Lav | `engine.ts:224-230` |

**Om R11:** `endJourney()` sletter uopprettelig. Testene som skulle bevise at den sletter *riktig* — og ikke for mye eller for lite — har aldri kjørt. Dette er den nest viktigste udokumenterte funksjonen i systemet.

## 4.12 Anbefalinger — journey

| # | Tiltak | Prioritet |
|---|---|---|
| T7 | Samle fasedefinisjonen ett sted, la de fem andre importere | **Kritisk** |
| T8 | Kjør integrasjonstestene mot ekte Postgres på `:5433` | **Kritisk** |
| T9 | Skriv de 144 spørsmålene i egen stemme (B3.2) | **Kritisk** |
| T10 | Vurder serverside PDF-generering | Middels |
| T11 | Flytt moodvalg til `Conversation`-modellen | Lav |
| T12 | Dokumenter forholdet mellom tema og fase | Lav |

---

# 5. Funnel og tillit

## 5.1 Onboarding

**13 steg**, klientstyrt tilstandsmaskin i `app/onboarding/OnboardingFlow.tsx`:

- `totalSteps = 13` (`:478`)
- Switch på steg 0–12 (`:309-338`)
- Stegtitler (`:273-287`): Grunnprofil, Personlighet, Livssituasjon, Tilknytning, Kjærlighetsspråk, Livsstil og verdier, Relasjonsstil, Framtid og visjon, Humor, Grenser og behov, Moden nysgjerrighet, Oppsummering, Start reisen

**Rundt 110 felter** i `ProfileData` (`:33-131`), med defaults (`:133-153`).

Dette er en betydelig investering å be om før man får noe tilbake. Det er samtidig grunnlaget for at koblingen kan bli god nok til at brukeren ikke trenger å velge. Avveiningen er bevisst, men frafallet gjennom 13 steg er ikke målt.

**Overgangen til kø:** `handleStartReisen()` (`:342-470`) lagrer profilen og kaller `POST /api/journey/queue` (`:459`). Brukeren settes til `QUEUED`.

## 5.2 Kø inn og ut

`app/api/journey/queue/route.ts`:

| Metode | Linje | Funksjon |
|---|---|---|
| `POST` | `:31` | Bli med i køen |
| `DELETE` | `:181` | Forlat køen (B2.3) |

`DELETE` kalles fra `components/dashboard/WaitingForMatch.tsx:91`. Knappen finnes, ruten finnes, de er koblet.

Dette er et lite, men viktig tillitspunkt. En bruker som har trykket *Start reisen* og angrer, skal ikke være fanget til neste natt.

## 5.3 Vilkår og samtykke

`prisma/schema.prisma:31-32`:

```prisma
termsAcceptedAt     DateTime?
termsVersion        String?
```

Versjonsstrengen er avgjørende. Endres vilkårene, må man kunne skille hvem som godtok hvilken versjon. Uten den er samtykket juridisk verdiløst ved endring.

Vilkårene (`app/vilkår/`) er oppdatert med angrerett og beskrivelse av koblingsmodellen (commit `2998ac1`). At modellen står i vilkårene er nødvendig: en bruker som betaler må vite at hun ikke velger person.

## 5.4 Gratiskvote

Mekanismen ligger i `lib/payment/freeQuota.ts`, importert i `app/api/journey/queue/route.ts:27`:

```ts
import { isFreeQuotaAvailable, createFreeOrder } from '@/lib/payment/freeQuota';
```

De første brukerne får en ekte `Order`-rad med `freeQuota: true` og `status: 'PAID'`. Admin teller dem (`app/api/admin/overview/route.ts:46-48`). Telleren caches 60 sekunder under nøkkelen `quota:free:count` (`lib/cache/index.ts:10`).

**Dette er en ærlig gjennomstrømning, ikke en omgåelse.** Gratisbrukere går gjennom samme ordreløype som betalende. Når Vipps kobles til, endres bare betalingssteget — ikke arkitekturen. Det er riktig valg, og det betyr at overgangen til betaling ikke blir en omskriving.

## 5.5 Kontosletting og dataeksport

- **Full sletting** ved fullført reise (B4.5, commit `e3562c1`)
- **GDPR-dataeksport:** `app/api/settings/export/route.ts`

Sammen med `endJourney()` gir dette to veier ut: brukeren kan ta med seg alt, og brukeren kan slette alt.

## 5.6 Rapportering

`Report`-modellen finnes nå i migrering — verifisert med 1 treff i `prisma/migrations/`. I ACT v4 var modellen skrevet i schemaet uten migrering, som betyr at tabellen aldri ville eksistert i produksjon. Sjekk 6 fanget dette.

Rapportkøen vises i admin (`app/admin/reports`, commit `c97dff0`).

## 5.7 Autentisering og tilgang

**To atskilte systemer:**

| System | Mekanisme | Kilde |
|---|---|---|
| Brukere | NextAuth | `app/api/auth/[...nextauth]` |
| Admin | Egen JWT-cookie | `lib/auth/admin-jwt`, `lib/auth/roles` |

`middleware.ts`:
- `verifyAdminCookie` (`:26`) og `isAdminRole` (`:27`)
- `ADMIN_PREFIX = '/admin'` (`:58`)
- Beskytter `/admin/*` og `/api/admin` (`:55`)
- Åpne unntak: `/admin/login` (`:43`), `/api/admin/auth` (`:44`)

Skillet er riktig. En kompromittert brukersesjon gir ikke administrativ tilgang, og admin-tokenet kan tilbakekalles uavhengig.

**Innloggingsalternativer:** e-post/passord, telefon med engangskode (`/api/auth/phone/send`, `/api/auth/phone/verify`), og Vipps (`/api/auth/vipps/authorize`, `/api/auth/vipps/callback`).

## 5.8 Rate limiting

Fire moduler:

- `lib/api/rateLimit.ts`
- `lib/api/handler.ts`
- `lib/system/rateMonitor.ts`
- `lib/system/anomaly.ts`

Grensene er ikke lastetestet.

## 5.9 Risikoer — funnel

| # | Risiko | Alvorlighet | Grunnlag |
|---|---|---|---|
| R13 | 13 steg og 110 felter gir ukjent frafall | **Høy** | Ingen måling finnes |
| R14 | `/api/profile/me` er brutt — profilsiden feiler | **Høy** | `app/profile/page.tsx:42` |
| R15 | `/api/journey/status` er brutt — dashbordet feiler | **Kritisk** | `app/dashboard/page.tsx:126` |
| R16 | `/api/payment/create-checkout-session` er tom katalog | Middels | Ingen `route.ts` |
| R17 | Vipps-nøkler ikke mottatt | Middels | Ekstern avhengighet |
| R18 | Rate limiting ikke lastetestet | Middels | |
| R19 | Onboarding-utkast skrives med `$executeRaw` | Lav | `draft/route.ts:35-42` |

**Om R15:** Dashbordet er det første brukeren ser etter innlogging. Et kall som feiler der rammer alle, hver gang.

## 5.10 Anbefalinger — funnel

| # | Tiltak | Prioritet |
|---|---|---|
| T13 | Rett `/api/journey/status` og `/api/profile/me` | **Kritisk** |
| T14 | Mål frafall per onboarding-steg | **Høy** |
| T15 | Fjern eller fullfør `/api/payment/create-checkout-session` | Høy |
| T16 | Verifiser at `termsVersion` faktisk settes ved samtykke | Høy |
| T17 | Lastetest rate limiting før offentlig lansering | Middels |

---

# 6. Drift og observability

Dette er systemets svakeste område.

## 6.1 Sentry — konfigurert, ikke aktiv

**Fire init-punkter finnes:**

| Fil | Innhold |
|---|---|
| `sentry.client.config.ts:3-11` | DSN, `enabled: NODE_ENV === "production"`, `tracesSampleRate: 0.1`, `replaysSessionSampleRate: 0.1`, `replaysOnErrorSampleRate: 1.0` |
| `sentry.server.config.ts:3-9` | `tracesSampleRate: 0.1` |
| `sentry.edge.config.ts:4-8` | `tracesSampleRate: 0.1` |
| `instrumentation.ts:15-57` | `register()`, kun ved `NEXT_RUNTIME === 'nodejs'` |

**Men:**

```
grep -c withSentryConfig next.config.js  →  0
NEXT_PUBLIC_SENTRY_DSN=""                    (.env.example:76)
```

Uten `withSentryConfig`-wrapperen laster ikke Next.js 15 klient- og edge-konfigurasjonene. Kun `instrumentation.ts` kjører, og bare i Node-runtime. Ingen `onRequestError`/`captureRequestError` er eksportert, så serverfeil under App Router-rendering fanges ikke automatisk.

DSN er tom overalt. `beforeSend` returnerer `null` når DSN mangler.

**Konklusjon: vi har ingen feilrapportering i produksjon.** Se avvik A7.

## 6.2 Cache

`lib/cache/index.ts` — cache-aside med Upstash Redis over REST (`:43`), med in-memory fallback for utvikling og når Redis er nede (`:13`).

| Nøkkel | TTL | Bruk |
|---|---|---|
| `quota:free:count` | 60 s | Gratiskvote-teller |

Fallback-designet er riktig: en nede Redis skal degradere ytelse, ikke ta ned produktet.

## 6.3 Prisma og tilkoblinger

`lib/prisma.ts` er eneste sted `new PrismaClient()` forekommer — verifisert med 0 andre reelle treff i `app/` og `lib/`.

Dette betyr noe på Vercel. Hver serverless-instans som lager sin egen klient åpner sine egne tilkoblinger. Ved 300 000 brukere er det forskjellen mellom et fungerende system og en database som avviser tilkoblinger.

## 6.4 Cron-jobber

`vercel.json`:

```json
[
  { "path": "/api/cron/matching", "schedule": "0 5 * * *" },
  { "path": "/api/cron/journey",  "schedule": "0 7 * * *" }
]
```

**Vercel Hobby tillater maksimalt 2 cron-jobber. Begge er brukt.**

Dette har en direkte konsekvens: helsesjekken kan ikke planlegges før oppgradering til Pro.

## 6.5 Helsesjekk

`app/api/cron/health/route.ts`:

| Aspekt | Verdi | Linje |
|---|---|---|
| Terskel | 30 minutter (overstyrbar via `?threshold=`) | `:40-45` |
| 200 OK | Siste hjerteslag innenfor terskel | `:8` |
| 503 STALE | Eldre enn terskel — alarmtilstand | `:9` |
| Auth | Samme `CRON_SECRET`-mønster | `:25-35` |

**Ingenting kaller dette endepunktet.** Det er ikke blant de to cron-jobbene. B5.6 «alarmer ved uteblitt runde» er implementert som mottaker uten avsender. Se avvik A9.

## 6.6 Admin

16 sider under `app/admin/`:

`analytics` · `chat` · `conversations` · `dashboard` · `journey-content` · `journeys` · `logs` · `login` · `matches` · `reports` · `resonance` · `system` · `tools` · `users` · rot-`page.tsx` · `layout.tsx`

42 API-ruter under `app/api/admin/`, blant dem `overview`, `analytics`, `conversation/[id]/freeze`, `conversation/[id]/unlock`, `journey/[id]/complete`, `journey/[id]/next-step`.

`StatusBadge` (B5.1) etablerer kanoniske terskler og farger, slik at «grønn» betyr det samme på alle admin-sider.

## 6.7 Backup

`deploy/backup.md` beskriver:

| Type | Tidspunkt | Metode |
|---|---|---|
| Daglig | 03:00 CET | `pg_dump`, komprimert SQL → `/backups/daily/` |
| Ukentlig | Søndag 02:00 CET | Full, inkludert migrasjoner |

Dokumentet stiller sitt eget krav:

> **B5.7 KRAV:** En backup som ikke er gjenopprettet, er en antakelse.
> Gjenopprettingstest skal gjennomføres før beta og dokumenteres med målt tidsbruk (RTO).

**Testen er ikke gjennomført.** Prosedyren er skrevet, ikke prøvd. Se avvik A2.

## 6.8 Risikoer — drift

| # | Risiko | Alvorlighet | Grunnlag |
|---|---|---|---|
| R20 | Ingen feilrapportering i produksjon | **Kritisk** | `withSentryConfig` = 0, DSN tom |
| R21 | Helsesjekken kalles aldri | **Kritisk** | Kun 2 crons, health ikke blant dem |
| R22 | Backup aldri gjenopprettet | **Høy** | `deploy/backup.md` |
| R23 | Hobby-grensen på 2 crons er nådd | **Høy** | Ingen plass til helsesjekk |
| R24 | Ingen `global-error.tsx` | Middels | 0 treff |
| R25 | Ingen målt RTO | Middels | |
| R26 | Redis-fallback ikke testet under nedetid | Lav | |

**Om R20 og R21 sammen:** Systemet kan feile stille. En matcherunde som ikke kjører gir ingen alarm, fordi ingenting spør. En feil i produksjon gir ingen rapport, fordi Sentry ikke er koblet. Første signal blir en bruker som skriver til support — hvis hun gidder.

For en lukket beta med 100–200 mennesker som venter på én kobling, er dette den farligste kombinasjonen i hele dokumentet.

## 6.9 Anbefalinger — drift

| # | Tiltak | Prioritet |
|---|---|---|
| T18 | Legg til `withSentryConfig` i `next.config.js` og sett ekte DSN | **Kritisk** |
| T19 | Eksporter `onRequestError` for App Router-feil | **Kritisk** |
| T20 | Kall helsesjekken utenfra (UptimeRobot, Better Uptime e.l.) inntil Pro | **Kritisk** |
| T21 | Gjennomfør gjenopprettingstest og dokumenter RTO | **Høy** |
| T22 | Oppgrader til Vercel Pro | Høy |
| T23 | Legg til `global-error.tsx` | Middels |
| T24 | Test Redis-fallback ved simulert nedetid | Lav |

**Om T20:** Dette er det billigste kritiske tiltaket i hele dokumentet. En ekstern tjeneste som kaller `/api/cron/health` hvert kvarter koster ingenting og løser R21 uten å bruke opp cron-kvoten.

---

# 7. API-flater

## 7.1 Omfang

| Metrikk | Antall |
|---|---|
| API-ruter totalt | 104 |
| Admin | 42 |
| Uten klientkall | 53 |
| Brutte kall fra klient | 9 |

## 7.2 Gruppering

| Gruppe | Innhold |
|---|---|
| **Auth** (7) | `[...nextauth]`, `phone/send`, `phone/verify`, `request-reset`, `test-login`, `vipps/authorize`, `vipps/callback` |
| **Admin** (42) | Oversikt, analyse, samtaler, reiser, rapporter, brukere, logger, verktøy |
| **Chat** | `conversations`, `send`, meldingshåndtering |
| **Journey** | `queue` (POST/DELETE), reisetilstand |
| **Cron** | `matching`, `journey`, `health` |
| **Profile** | `setup`, redigering, bilder |
| **Settings** | `export` (GDPR), sletting |
| **Payment** | ordre, webhooks, gratiskvote |
| **Questions** | veiledede spørsmål |

## 7.3 Chat-oversikten

`app/api/chat/conversations/route.ts` var savnet i ACT v4 — kalt fra `app/chat/page.tsx`, men ikke implementert. Nå finnes den (B0.7).

Den gjør noe konseptuelt viktig (`:19`, `:70`, `:100`): resonansnivået oversettes til en stemning før det sendes til klienten.

```ts
mood: resonance ? MOOD_FROM_LEVEL[resonance] ?? "calm" : "calm",   // :100
```

Tallet forlater aldri serveren. Prinsippet fra del 1.4 håndheves i API-laget, ikke i UI — som er riktig sted.

## 7.4 Brutte kall

Ni fetch-kall peker på ruter som ikke eksisterer. Verifisert ved å krysse alle `fetch('/api/…')` mot faktiske `route.ts`-filer:

| Kall | Fra | Konsekvens |
|---|---|---|
| `/api/journey/status` | `app/dashboard/page.tsx:126` | **Hovedskjerm etter innlogging** |
| `/api/profile/me` | `app/profile/page.tsx:42` | Profilsiden |
| `/api/match/breakdown` | `components/MatchBreakdown.tsx:35` | Resonansforklaring |
| `/api/chat/typing` | `components/chat/ChatRoom.tsx:174, 190` | Skriveindikator |
| `/api/system/mark-read` | `components/NotificationCenter.tsx:27` | Varsler |
| `/api/match/mark-seen` | — | Matchvisning |
| `/api/match/new-status` | — | Matchstatus |
| `/api/match/recommendations` | — | Anbefalinger |
| `/api/me` | — | Brukerdata |

I tillegg: `app/api/payment/create-checkout-session/` finnes som **tom katalog** uten `route.ts`.

**Hvorfor build er grønn likevel:** Next.js validerer ikke fetch-strenger. En rute som ikke finnes gir 404 i nettleseren, ikke feil ved bygging. Uten Sentry (A7) blir disse 404-ene heller ikke rapportert. To avvik forsterker hverandre.

## 7.5 Døde ruter

53 av 104 ruter kalles ikke fra `app/`, `components/` eller `hooks/`. Noen er legitime — cron-endepunkter, webhooks, ruter kalt fra serverkomponenter. Resten er restene av fire ACT-sykluser.

Hver død rute er angrepsflate og vedlikeholdsbyrde. De er ikke kritiske, men de gjør det vanskeligere å se hva systemet faktisk består av.

## 7.6 Risikoer — API

| # | Risiko | Alvorlighet |
|---|---|---|
| R27 | 9 brutte kall, ett på hovedskjermen | **Kritisk** |
| R28 | Brutte kall er usynlige uten Sentry | **Kritisk** |
| R29 | 53 døde ruter som angrepsflate | Middels |
| R30 | Tom `create-checkout-session`-katalog | Middels |

## 7.7 Anbefalinger — API

| # | Tiltak | Prioritet |
|---|---|---|
| T25 | Rett alle 9 brutte kall — implementer eller fjern kallet | **Kritisk** |
| T26 | Legg til automatisk kryssjekk fetch → rute i CI | **Høy** |
| T27 | Gå gjennom de 53 døde rutene, fjern det som er dødt | Middels |
| T28 | Slett den tomme betalingskatalogen | Lav |

**Om T26:** Denne sjekken tar under ett sekund å kjøre og ville fanget alle ni feilene. Den bør inn i CI før beta, ellers oppstår problemet på nytt ved neste ACT-syklus.

---

# 8. Innhold og språk

## 8.1 Prinsippet

ToSom er **bokmål**. Ikke fordi nynorsk er dårligere, men fordi to målformer i samme grensesnitt får produktet til å virke uferdig — og et produkt som ber om tillit i intime spørsmål har ikke råd til å virke uferdig.

## 8.2 Rester

Tre forekomster gjenstår i grensesnittfiler:

| Fil | Linje | Tekst | Synlig |
|---|---|---|---|
| `app/blogg/[slug]/page.tsx` | 46 | «Når du **fjernar** alt støyen, **kjem** det ekte tilbake … **Samtalar** blir **djupare**. Forbinder blir **verktruelege**.» | **Ja** |
| `components/journey/JourneySection.tsx` | 46 | «Hvor føler du deg mest deg selv — når er du helt deg **sjølv**?» | **Ja** |
| `app/chat/[id]/ChatPageClient.tsx` | 39 | Kommentar: «**sjølve** journeyDay **kjem** frå ChatProvider» | Nei |

I tillegg finnes nynorsk i kommentarer og dokumentasjon:

- `config/matching.ts:2-3` — «Vekter er **no** den **eine** sanne **kjelda**», «Dette filen er **ein** tynn wrapper»
- `deploy/backup.md` — «Lagrer alle **tabellar** og data», «Full backup inkludert **migreringar**»
- `lib/journey/engine.ts:803` — «Maksimal resonans **finst** i **stillheten**»

**De to alvorligste:**

`JourneySection.tsx:46` blander målform i **samme setning**: «deg selv» og «deg sjølv». Dette er dagsimpulsen for dag 5 — tekst brukeren møter i et sårbart øyeblikk.

`blogg/[slug]/page.tsx:46` inneholder ordet **«verktruelege»**, som ikke finnes på noe norsk. Setningen er dessuten grammatisk brutt: «Forbinder blir verktruelege.»

## 8.3 De 144 spørsmålene

Strukturelt er innholdet ferdig: 12 kategorier, 12 spørsmål hver, jevnt fordelt på tre dybdenivåer, alle på bokmål, idempotent seeding.

Innholdsmessig er det ikke ferdig. Filen sier det selv (`:12`): dette er *strukturen og malen*.

Eksempler fra kategorien Trygghet:

> «Hva betyr trygghet for deg i en ny relasjon?»
> «Hva er det som gjør at du føler deg trygg hos noen?»

Disse er korrekte. De er også generiske. Et spørsmål som skal åpne mellom to fremmede på dag 12 må ha en presisjon som skiller det fra hva som helst annet — og den presisjonen kommer fra en menneskelig stemme, ikke fra en mal.

Dette er B3.2, og det er ikke en programmeringsoppgave.

## 8.4 Tone

Systemets kopi er kanonisert i B2.6 (commit `cd6380c`). Tonen er rolig, direkte, uten utropstegn og uten oppfordringer til hastverk. Det står i bevisst kontrast til bransjen.

Prinsippet fra del 1.4 gjelder gjennomgående: **ingen tall om mennesker.** Ikke «94 % match», ikke «Resonans 64». Kun ord.

## 8.5 Risikoer — innhold

| # | Risiko | Alvorlighet |
|---|---|---|
| R31 | 144 spørsmål er plassholdere | **Høy** |
| R32 | Nynorsk i to brukersynlige tekster | Middels |
| R33 | «verktruelege» — ord som ikke finnes | Middels |
| R34 | Ingen språkkontroll i CI | Middels |

## 8.6 Anbefalinger — innhold

| # | Tiltak | Prioritet |
|---|---|---|
| T29 | Skriv de 144 spørsmålene i egen stemme | **Kritisk** |
| T30 | Rett `JourneySection.tsx:46` og `blogg/[slug]/page.tsx:46` | **Høy** |
| T31 | Sett språkkontroll i CI med ordgrenser | Høy |
| T32 | Rydd nynorsk i kommentarer og dokumentasjon | Lav |

---

# 9. Avvik (12 stk)

Seks avvik ble funnet i verifisering v5.0 (A1–A6). Seks til ble funnet i den dype kartleggingen (A7–A12).

## Oversikt

| # | Avvik | Alvorlighet | Blokkerer beta |
|---|---|---|---|
| A1 | `completedSteps` oppblåst | Lav | Nei |
| A2 | B5.7 selvmotsigende | Middels | Ja |
| A3 | Mood kun i localStorage | Lav | Nei |
| A4 | PDF via utskriftsdialog | Middels | Nei |
| A5 | Nynorskrester | Middels | Nei |
| A6 | Ukommittert arbeid | Lav | Nei |
| A7 | **Sentry ikke aktiv** | **Kritisk** | **Ja** |
| A8 | **9 brutte fetch-kall** | **Kritisk** | **Ja** |
| A9 | **Helsesjekk uten avsender** | **Kritisk** | **Ja** |
| A10 | Cron i UTC, ikke norsk tid | Middels | Nei |
| A11 | Fasedefinisjon duplisert 6 steder | Høy | Ja |
| A12 | 53 døde API-ruter | Lav | Nei |

---

## A1 — `completedSteps` er oppblåst

**Alvorlighet:** Lav · **Kilde:** `docs/ACT-STATE-v5.json`

Feltet oppgir 38 fullførte steg. Listen inneholder to oppføringer som ikke er steg i ACT v5.0: `lang-guard-sweep` og `B0-gate`. Samtidig mangler B2.7 og B3.2.

**Reell status: 36 av 38.**

Dette er ikke uredelighet, men det gjør tilstandsfilen upålitelig som kilde. Neste syklus må ikke bygge på tallet uten å telle listen.

---

## A2 — B5.7 motsier seg selv

**Alvorlighet:** Middels · **Blokkerer beta**

B5.7 står som fullført i `completedSteps`. Samtidig sier `nextStep` i samme fil:

> «krever B2.7 mobil-QA + B3.2 innhold + **B5.7 gjenopprettingstest**»

Commiten (`eeaab4f`) er ren dokumentasjon. `deploy/backup.md` stiller kravet klart: *«En backup som ikke er gjenopprettet, er en antakelse.»*

**Ingen gjenoppretting er utført. Ingen RTO er målt.**

---

## A3 — Moodvalg lagres kun i localStorage

**Alvorlighet:** Lav · **Kilde:** `app/chat/components/ChatContainer.tsx:604, 613`

```ts
localStorage.setItem(`${MOOD_STORAGE_PREFIX}${conversationId}`, mood);
```

`grep -c "mood" prisma/schema.prisma` → **0**

Valget følger enheten. Bytter brukeren fra telefon til datamaskin, er stemningen borte. Commiten lover «husk moodvalg per samtale» — det holder per samtale *per enhet*.

---

## A4 — PDF-eksport er utskriftsdialog

**Alvorlighet:** Middels · **Kilde:** `app/reisen/avslutning/page.tsx:228-232`

```ts
const handleExportPdf = () => {
  // Åpne print-dialog — brukeren kan velge "Lagre som PDF"
```

Ingen server-API, ingen PDF-generering. Resultatet avhenger av nettleser og utskriftsstiler.

Dette er det eneste minnet fra tretti dager, levert i sekundene før alt slettes permanent. Handlingen kan ikke gjentas. Mislykkes den, er innholdet borte for alltid.

---

## A5 — Nynorskrester

**Alvorlighet:** Middels

| Fil:linje | Synlig for bruker |
|---|---|
| `app/blogg/[slug]/page.tsx:46` | Ja — inkludert ordet «verktruelege» |
| `components/journey/JourneySection.tsx:46` | Ja — blandet målform i samme setning |
| `app/chat/[id]/ChatPageClient.tsx:39` | Nei (kommentar) |
| `config/matching.ts:2-3` | Nei (kommentar) |
| `deploy/backup.md` | Nei (dokumentasjon) |
| `lib/journey/engine.ts:803` | Muligens — dagsimpuls |

---

## A6 — Ukommittert arbeid

**Alvorlighet:** Lav

```
 M .eslintrc.json
 M app/layout.tsx
 D pages/README.md
 D pages/_document.tsx
?? scripts/verify-v5-seed.ts
?? docs/TOSOM-ACT-INSTRUKS-v5.0.md
?? docs/TOSOM-MASTERPLAN-v4.0.md
```

Endringer i `app/layout.tsx` og sletting av `pages/_document.tsx` er ikke trivielle. De er ikke gjennomgått, og de er ikke i historikken.

---

## A7 — Sentry er konfigurert, men ikke aktiv

**Alvorlighet: Kritisk · Blokkerer beta**

```
grep -c withSentryConfig next.config.js  →  0
NEXT_PUBLIC_SENTRY_DSN=""                    (.env.example:76)
```

Fire init-filer finnes, men uten `withSentryConfig`-wrapperen laster ikke Next.js 15 klient- og edge-konfigurasjonene. Kun `instrumentation.ts` kjører, kun i Node-runtime. Ingen `onRequestError` er eksportert. DSN er tom, og `beforeSend` returnerer `null` uten DSN.

**Vi har ingen feilrapportering i produksjon.**

Konsekvensen er ikke bare at feil ikke rapporteres — den er at vi ikke vet om systemet virker. En bruker som får en hvit skjerm forsvinner uten spor.

---

## A8 — Ni brutte fetch-kall

**Alvorlighet: Kritisk · Blokkerer beta**

Verifisert ved kryssjekk av alle `fetch('/api/…')` mot faktiske `route.ts`:

| Kall | Fra |
|---|---|
| `/api/journey/status` | `app/dashboard/page.tsx:126` |
| `/api/profile/me` | `app/profile/page.tsx:42` |
| `/api/match/breakdown` | `components/MatchBreakdown.tsx:35` |
| `/api/chat/typing` | `components/chat/ChatRoom.tsx:174, 190` |
| `/api/system/mark-read` | `components/NotificationCenter.tsx:27` |
| `/api/match/mark-seen` | — |
| `/api/match/new-status` | — |
| `/api/match/recommendations` | — |
| `/api/me` | — |

Pluss `app/api/payment/create-checkout-session/` som tom katalog.

`/api/journey/status` kalles fra **dashbordet** — skjermen alle ser etter innlogging.

Sammen med A7 blir dette usynlig: kallene feiler, ingen rapporterer det, og build er grønn fordi Next.js ikke validerer fetch-strenger.

---

## A9 — Helsesjekken kalles aldri

**Alvorlighet: Kritisk · Blokkerer beta**

`app/api/cron/health/route.ts` er komplett: 30 minutters terskel (`:40-45`), 200 ved OK, 503 ved STALE (`:8-9`), `CRON_SECRET`-autentisering (`:25-35`).

Men `vercel.json` definerer kun to cron-jobber — matching og journey. **Helsesjekken er ikke blant dem.**

Vercel Hobby tillater maksimalt to. Begge er brukt.

B5.6 «alarmer ved uteblitt runde» er dermed en mottaker uten avsender. Uteblir matcherunden, varsles ingen.

---

## A10 — Cron kjører ikke 05:00 norsk tid

**Alvorlighet:** Middels · **Kilde:** `vercel.json:9-14`

`"0 5 * * *"` tolkes som UTC.

| Årstid | Norsk tid |
|---|---|
| Sommer (CEST) | **07:00** |
| Vinter (CET) | **06:00** |

Konseptet forutsetter 05:00. Journey-cron (`"0 7 * * *"`) kjører tilsvarende 09:00 om sommeren.

Ikke kritisk, men det betyr at «matchen kommer om natten» ikke stemmer — og at tidspunktet flytter seg to ganger i året.

---

## A11 — Fasedefinisjonen finnes seks steder, to motstridende

**Alvorlighet: Høy · Blokkerer beta**

Kanonisk: `lib/journey/engine.ts:191-221` — EARLY 1–14, BUILDING_TRUST 15–21, DEEPER 22–25, CHECKIN 26–30.

**Samme logikk gjentatt:**

| Sted | Merknad |
|---|---|
| `lib/journey/engine.ts:277-290` | Kanonisk (`getPhaseForDay`) |
| `app/api/cron/journey/route.ts:137-142` | Lokal kopi i løkken |
| `app/dashboard/journey/page.tsx:17-26` | `PHASES`-array |
| `app/api/dashboard/overview/route.ts:211-228` | `getPhaseTitle`/`getPhaseDescription` |
| `components/journey/JourneyTimeline.tsx:15-22` | **Avvikende: 6 faser i femdagersbolker** |
| `app/chat/components/ChatHeader.tsx:78` | **Avvikende: `journeyDay <= 10`** |

En bruker på dag 12 kan se «Bli kjent» i chat-toppen, én fase i tidslinjen og en annen på dashbordet. Endres fasegrensene ett sted, endres de ikke de fem andre.

Dette er teknisk gjeld som allerede har materialisert seg som en inkonsistens brukeren kan se.

---

## A12 — 53 døde API-ruter

**Alvorlighet:** Lav

53 av 104 ruter kalles ikke fra klientkoden. Noen er legitime (cron, webhooks, serverkomponenter). Resten er sediment fra fire ACT-sykluser.

Konsekvens: unødvendig angrepsflate og et systembilde som er vanskeligere å lese enn nødvendig.

---

# 10. Lanseringsvurdering

## 10.1 Vurdering

| Scenario | Klar |
|---|---|
| **Lukket beta** (100–200 brukere) | **78 %** |
| **Offentlig lansering** | **65 %** |

## 10.2 Hvorfor 78 % for beta

Grunnlaget er solid. B0- og B1-arbeidet holder: koden bygger, typene er rene, matchingen bruker riktig scorer med riktig terskel, geografi er en reell grense, resonans uttrykkes som ord.

Det som mangler er ikke arkitektur. Det er tre ting:

**1. Systemet har aldri kjørt.** Matcherunden er aldri observert mot en ekte database. `endJourney()` er aldri testet mot Postgres. Alt vi vet, vet vi fra lesing.

**2. Vi er blinde.** A7 og A9 sammen betyr at systemet kan feile uten at noen får vite det. For en beta der 100–200 mennesker har ventet et døgn på én kobling, er stille svikt det verst tenkelige.

**3. Ni kall er brutt**, ett av dem på hovedskjermen.

## 10.3 Hvorfor 65 % for offentlig lansering

I tillegg til alt over:

- Vipps er ikke koblet (nøkler ikke mottatt)
- Rate limiting er ikke lastetestet
- Backup er aldri gjenopprettet, RTO er ukjent
- Ingen kapasitetsmåling ved 1 000 eller 10 000 samtidige
- De 144 spørsmålene er plassholdere
- Vercel Hobby har ikke plass til flere cron-jobber

## 10.4 Hva som må være på plass før beta

**Blokkerende:**

| # | Krav | Avvik |
|---|---|---|
| 1 | Sentry aktivert med ekte DSN og `withSentryConfig` | A7 |
| 2 | Alle 9 brutte kall rettet | A8 |
| 3 | Helsesjekk kalt av ekstern overvåking | A9 |
| 4 | Fasedefinisjonen samlet ett sted | A11 |
| 5 | Matcherunde kjørt mot ekte database med minst 40 brukere | R1 |
| 6 | `endJourney`-integrasjonstester grønne mot Postgres | R11 |
| 7 | Gjenopprettingstest utført, RTO målt | A2 |
| 8 | 144 spørsmål skrevet i egen stemme | R31 |
| 9 | Mobil-QA gjennomført | B2.7 |
| 10 | Nynorsk i brukersynlig tekst rettet | A5 |

**Ikke blokkerende:** A1, A3, A4, A6, A10, A12.

## 10.5 Risikoer ved lansering

| # | Risiko | Alvorlighet |
|---|---|---|
| RL1 | Matcherunden kobler null par fordi kohorten er under 20 | **Kritisk** |
| RL2 | Stille svikt uten Sentry og uten helseovervåking | **Kritisk** |
| RL3 | `endJourney` sletter for mye eller for lite | **Kritisk** |
| RL4 | Brutte kall gir hvite skjermer på dashbord og profil | **Høy** |
| RL5 | Generiske spørsmål gir grunne samtaler | **Høy** |
| RL6 | Databasetap uten prøvd gjenoppretting | **Høy** |
| RL7 | Motstridende fasevisning forvirrer | Middels |
| RL8 | Vipps forsinket | Middels |

**Om RL1:** Dette er beta-scenariet som ser ut som suksess helt til natten kommer. Hundre påmeldte, alle har fullført 13 steg, alle venter. Runden kjører, finner 18 gyldige deltakere etter dealbreakere, og stopper. Ingen kobles. Ingen alarm utløses. Neste morgen er det hundre skuffede mennesker og ingen logg som forklarer hvorfor.

**Om RL3:** `endJourney()` er uopprettelig. Sletter den for lite, brytes løftet om at alt forsvinner. Sletter den for mye — for eksempel en samtale som ikke skulle vært rørt — er det ingen vei tilbake. Testene som skulle bevise korrektheten har aldri kjørt.

---

# 11. Roadmap 30–60 dager

## Fase 1 — Blindhet og brudd (dag 1–7)

Mål: systemet skal kunne se seg selv, og ingen kall skal peke i tomme luften.

| Oppgave | Avvik | Ferdig når |
|---|---|---|
| `withSentryConfig` i `next.config.js` | A7 | Testfeil vises i Sentry |
| Ekte DSN i produksjonsmiljøet | A7 | `beforeSend` slipper gjennom |
| `onRequestError` eksportert | A7 | Serverfeil fanges |
| Rett 9 brutte kall | A8 | 0 treff i kryssjekk |
| Ekstern overvåking av `/api/cron/health` | A9 | 503 gir varsel innen 5 min |
| `global-error.tsx` | R24 | Filen finnes |
| Commit ukommittert arbeid | A6 | `git status` ren |

## Fase 2 — Første ekte kjøring (dag 8–14)

Mål: se koblingsmodellen fungere.

| Oppgave | Ferdig når |
|---|---|
| Postgres på `:5433`, migrasjoner kjørt | `prisma migrate status` ren |
| `endJourney`-tester grønne | 116/116 |
| Seed 40 testbrukere med spredt geografi | 40 rader `QUEUED` |
| Kjør matcherunden manuelt | ≥ 15 par opprettet |
| Verifiser `MatchHistory`-sperren | Par gjenoppstår ikke |
| Logg avvisningsårsak per par | Fordeling per årsak i logg |
| Mål scorefordelingen | Histogram foreligger |

Denne fasen er beskrevet i detalj i del 12.

## Fase 3 — Konsistens og innhold (dag 15–30)

| Oppgave | Avvik |
|---|---|
| Samle fasedefinisjonen ett sted, la 5 steder importere | A11 |
| Rett nynorsk i `JourneySection.tsx` og `blogg/[slug]` | A5 |
| Språkkontroll i CI med ordgrenser | R34 |
| **Skriv de 144 spørsmålene** | R31 |
| Mobil-QA (B2.7) | — |
| Gjenopprettingstest med målt RTO | A2 |
| Kalibrer `MIN_SCORE` mot ekte fordeling | R3 |
| Vurder `MIN_COHORT_SIZE` for beta | R2 |

**Innholdsskrivingen er den lengste oppgaven her, og den kan ikke delegeres til en modell.**

## Fase 4 — Lukket beta (dag 31–60)

| Oppgave |
|---|
| Rekrutter 100–200 deltakere |
| Kjør reelle runder daglig |
| Følg `JourneyStat` per utfall |
| Mål frafall per onboarding-steg |
| Samle kvalitativ tilbakemelding |
| Oppgrader til Vercel Pro |
| Koble Vipps når nøkler foreligger |
| Rydd de 53 døde rutene |

**Beta varer minst 30 dager fordi reisen varer 30 dager.** Systemets viktigste funksjon — avslutningen — kan ikke observeres tidligere.

## Milepæler

| Dag | Milepæl |
|---|---|
| 7 | Systemet kan se seg selv |
| 14 | Første ekte matcherunde observert |
| 30 | Innhold ferdig, konsistens rettet |
| 31 | Beta åpner |
| 60 | Første kohort fullfører dag 30 |

---

# 12. Beta-testprotokoll

Formålet er å svare på det ene spørsmålet ingen dokumentasjon kan svare på: **fungerer koblingsmodellen?**

## Steg 0 — Forutsetninger

```bash
docker compose -f docker-compose.test.yml up -d
npx prisma migrate status
npx prisma migrate deploy
```

**Krav:** Postgres svarer på `:5433`, migrasjonsstatus ren.

## Steg 1 — Grunnlinje

```bash
npx tsc --noEmit
npx prisma format --check
npx jest
npx next build
```

**Krav:** 0 typefeil, format OK, **116/116 tester**, build grønn.

Dette er første gang integrasjonstestene skal være grønne. Er de det ikke, stopp her — `endJourney()` er ikke verifisert, og ingenting annet i protokollen betyr noe før den er det.

## Steg 2 — Seed testpopulasjon

Opprett 40 brukere med:
- Fullstendig profil (alle felter onboarding samler)
- Postnummer spredt over minst 5 landsdeler
- `distancePref` variert mellom 25 og 300 km
- `journeyState = QUEUED`
- `queuedAt` satt til nå

```sql
SELECT COUNT(*) FROM "User" WHERE "journeyState" = 'QUEUED';
-- forventet: 40
```

**Hvorfor 40 og ikke 20:** Dealbreakerne kjører før scoring. Med 20 kan radius alene sende den effektive kohorten under terskelen, og da tester man ikke matchingen — man tester sikkerhetsventilen.

## Steg 3 — Tørrkjøring av dealbreakere

Før runden kjøres, mål hvor mange par som overlever filtrering:

```sql
SELECT COUNT(*) FROM "Profile" WHERE "latitude" IS NOT NULL;
-- forventet: 40 — alle må ha koordinater, ellers feiler radius stille
```

**Krav:** 40. Mangler koordinater, kan `checkRadius` gi uventede resultater.

## Steg 4 — Kjør matcherunden

```bash
curl -i -X GET http://localhost:3000/api/cron/matching \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Krav:** HTTP 200.

Kontroller også autentiseringen:

```bash
curl -i http://localhost:3000/api/cron/matching                        # → 401
curl -i -H "Authorization: Bearer feil" http://localhost:3000/api/cron/matching  # → 403
```

## Steg 5 — Verifiser koblingene

```sql
SELECT COUNT(*) FROM "Match" WHERE "createdAt" > NOW() - INTERVAL '5 minutes';
-- forventet: 15-20 par av 40 brukere

SELECT COUNT(*) FROM "User" WHERE "journeyState" = 'MATCHED';
-- forventet: 30-40

SELECT COUNT(*) FROM "User" WHERE "journeyState" = 'QUEUED';
-- forventet: 0-10 (de som ikke fant partner)
```

**Ingen bruker skal forekomme i to matcher:**

```sql
SELECT "userId", COUNT(*) FROM (
  SELECT "userAId" AS "userId" FROM "Match"
  UNION ALL
  SELECT "userBId" FROM "Match"
) t GROUP BY "userId" HAVING COUNT(*) > 1;
-- forventet: 0 rader
```

Dette er den viktigste enkeltspørringen i protokollen. Én bruker i to reiser samtidig bryter hele modellen.

## Steg 6 — Verifiser terskelen

```sql
SELECT MIN("score"), MAX("score"), AVG("score") FROM "Match"
WHERE "createdAt" > NOW() - INTERVAL '5 minutes';
-- krav: MIN >= 40
```

Er `MIN` under 40, er terskelen ikke håndhevet. Er `MAX` over 100, er skalaen feil.

## Steg 7 — Verifiser resonansnivå

```sql
SELECT "resonanceLevel", COUNT(*) FROM "Match"
WHERE "createdAt" > NOW() - INTERVAL '5 minutes'
GROUP BY "resonanceLevel";
```

**Krav:** minst to ulike nivåer. Er alt `GENTLE`, beregnes ikke nivået — samme feil som I-12.

## Steg 8 — Verifiser radius

For hvert opprettet par, kontroller at avstanden er innenfor **begges** grense:

```sql
SELECT m.id,
       pa."distancePref" AS grense_a,
       pb."distancePref" AS grense_b
FROM "Match" m
JOIN "Profile" pa ON pa."userId" = m."userAId"
JOIN "Profile" pb ON pb."userId" = m."userBId"
WHERE m."createdAt" > NOW() - INTERVAL '5 minutes';
```

Beregn haversine-avstand og kontroller mot begge grenser. **Ett brudd er én for mye** — det betyr at den tosidige sperren ikke virker.

## Steg 9 — Verifiser kohortterskelen

Nullstill, seed kun **15** brukere, kjør runden.

**Krav:** 0 matcher opprettet, runden logger at kohorten er for liten.

Deretter: sett `queuedAt` til 80 timer tilbake for 4 av dem, kjør på nytt.

**Krav:** sikkerhetsventilen utløses, disse kobles på tross av liten kohort.

## Steg 10 — Verifiser kill switch

```bash
MATCHING_ENABLED=false curl -X GET http://localhost:3000/api/cron/matching \
  -H "Authorization: Bearer $CRON_SECRET"
```

**Krav:** HTTP 200 med `skipped: true`, **0 nye matcher**, og alle `QUEUED` forblir `QUEUED`.

```sql
SELECT COUNT(*) FROM "SystemLog" WHERE "createdAt" > NOW() - INTERVAL '2 minutes';
-- forventet: >= 1
```

## Steg 11 — Verifiser reisen

For ett par:
1. Logg inn som bruker A, åpne reisen
2. Logg inn som bruker B, åpne reisen
3. Kontroller at `bothSeenAt` settes først nå
4. Kontroller at begge viser **dag 1** — ikke ulike dager

```sql
SELECT "bothSeenAt", "journeyDay" FROM "Conversation" WHERE "matchId" = '<id>';
```

## Steg 12 — Verifiser avslutningen

Avslutt én reise gjennom grensesnittet.

```sql
SELECT COUNT(*) FROM "Message" WHERE "conversationId" = '<id>';   -- 0
SELECT COUNT(*) FROM "Conversation" WHERE id = '<id>';            -- 0
SELECT COUNT(*) FROM "MatchHistory" WHERE ...;                    -- 1
SELECT * FROM "JourneyStat" ORDER BY "endedAt" DESC LIMIT 1;      -- 1 rad
SELECT "journeyState" FROM "User" WHERE id IN ('<a>','<b>');      -- IDLE, IDLE
```

**Krav til `JourneyStat`:** alle felter utfylt, `ageBandA`/`ageBandB` som bånd, `distanceBand` som bånd, **ingen kobling til bruker-ID**.

## Steg 13 — Verifiser gjenkoblingssperren

Sett begge brukere tilbake til `QUEUED`, seed opp til 40, kjør runden på nytt.

**Krav:** paret oppstår **ikke** på nytt.

Dette er en av ToSoms mest grunnleggende garantier. Feiler den, kan to mennesker som har avsluttet bli tvunget sammen igjen.

## Steg 14 — Kapasitet

| Køstørrelse | Krav til kjøretid |
|---|---|
| 100 | < 5 s |
| 1 000 | < 20 s |
| 10 000 | < 50 s |

Over 50 s treffer tidsbudsjettet (`TIME_BUDGET_MS`), og runden avbryter seg selv.

## Godkjenningskriterier

Beta åpner **ikke** før alle er oppfylt:

- [ ] 116/116 tester grønne mot ekte Postgres
- [ ] Matcherunden kobler ≥ 15 par av 40
- [ ] Ingen bruker i to matcher
- [ ] Alle scorer ≥ 40
- [ ] Minst to resonansnivåer forekommer
- [ ] Ingen kobling bryter noen radiusgrense
- [ ] Kohortterskelen stopper ved 15
- [ ] Sikkerhetsventilen utløses ved 72 timer
- [ ] Kill switch stanser uten å røre køen
- [ ] `bothSeenAt` styrer dag 1
- [ ] `endJourney` sletter alt og skriver `JourneyStat` + `MatchHistory`
- [ ] Gjenkobling blokkeres
- [ ] 10 000 i kø under 50 s

---

# 13. Drift-protokoll

## 13.1 Daglig

| Tid (norsk) | Hendelse | Kontroll |
|---|---|---|
| 03:00 CET | Backup (`pg_dump`) | Filen finnes og har rimelig størrelse |
| 07:00 sommer / 06:00 vinter | Matcherunde | Runden logget, antall par > 0 |
| 09:00 sommer / 08:00 vinter | Journey-cron | Dagsimpulser sendt |
| Løpende | Helsesjekk hvert 15. min | 200; 503 utløser varsel |

**Merk tidspunktene.** De er UTC-baserte og flytter seg ved tidsomstilling (avvik A10).

## 13.2 Ukentlig

- Full backup søndag 02:00 CET
- Gjennomgang av Sentry-feil
- `JourneyStat` per utfall — endrer fordelingen seg?
- Rapportkø tømt
- Scorefordeling fra matcherundene

## 13.3 Månedlig

- **Gjenopprettingstest med målt RTO**
- Gjennomgang av kapasitetstall
- Kalibrering av `MIN_SCORE` mot faktisk fordeling
- Vurdering av `MIN_COHORT_SIZE` mot kølengde

## 13.4 Bryterne

Alle endres i Vercels miljøvariabler. **Ingen krever deploy.**

| Bryter | Verdi | Virkning | Bruk når |
|---|---|---|---|
| `MATCHING_ENABLED` | `false` | Runden stanser, køen består | Feil i matchingen |
| `REGISTRATION_ENABLED` | `false` | Ingen nye brukere | Kapasitetspress |
| `PAYMENTS_ENABLED` | `false` | Fri tilgang via gratiskvote | Betalingsleverandør nede |
| `MAINTENANCE_MODE` | `true` | Vedlikeholdsside | Planlagt nedetid |

**Rekkefølge ved hendelse:** stans først det som gjør skade (`MATCHING_ENABLED`), deretter det som øker last (`REGISTRATION_ENABLED`). `MAINTENANCE_MODE` er siste utvei — den tar ned hele produktet.

## 13.5 Hendelseshåndtering

**Matcherunden uteble:**
1. Sjekk `/api/cron/health` — 503 bekrefter
2. Sjekk Vercels cron-logg
3. Sjekk `MATCHING_ENABLED`
4. Sjekk `CRON_SECRET`
5. Kjør manuelt med `curl`
6. Ved gjentakelse: sett `MATCHING_ENABLED=false` og undersøk før neste natt

**Runden koblet null par:**
1. Sjekk kølengde mot `MIN_COHORT_SIZE`
2. Sjekk avvisningsårsaker i loggen (krever T2)
3. Sjekk scorefordelingen mot `MIN_SCORE`
4. Sjekk om radius fragmenterer køen geografisk

**Databasen svarer ikke:**
1. `MAINTENANCE_MODE=true`
2. Kontroller tilkoblingstall
3. Ved datatap: følg `deploy/backup.md`
4. Dokumenter faktisk RTO

## 13.6 Overvåkingspunkter

| Punkt | Terskel | Handling |
|---|---|---|
| Helsesjekk | 503 | Umiddelbart varsel |
| Matcherunde | 0 par to netter på rad | Undersøk |
| Kølengde | < `MIN_COHORT_SIZE` i 48 t | Vurder terskelen |
| Feilrate (Sentry) | Uvanlig økning | Undersøk |
| Rapportkø | Ubehandlet > 24 t | Behandle |
| Backup | Fil mangler | Umiddelbart |

## 13.7 Miljøvariabler

| Variabel | Påkrevd | Merknad |
|---|---|---|
| `DATABASE_URL` | Ja | |
| `NEXTAUTH_SECRET` | Ja | |
| `NEXTAUTH_URL` | Ja | |
| `CRON_SECRET` | Ja | Uten den: 500 fra alle cron-ruter |
| `NEXT_PUBLIC_SENTRY_DSN` | **Bør** | Tom i dag (A7) |
| `UPSTASH_REDIS_REST_URL` | Nei | Fallback finnes |
| `UPSTASH_REDIS_REST_TOKEN` | Nei | |
| `PUSHER_*` | Ja | Sanntid |
| `MATCHING_ENABLED` | Nei | Standard: på |
| `REGISTRATION_ENABLED` | Nei | Standard: på |
| `PAYMENTS_ENABLED` | Nei | Standard: av |
| `MAINTENANCE_MODE` | Nei | Standard: av |

---

# 14. QA-protokoll

## 14.1 Automatisert — hver commit

```bash
npx tsc --noEmit          # 0 feil
npx prisma format --check # exit 0
npx jest                  # 116/116
npx next build            # grønn
```

**Bør legges til i CI:**
- Kryssjekk fetch → rute (ville fanget alle 9 brutte kall)
- Språkkontroll med ordgrenser (ville fanget nynorskrestene)
- Kontroll av at ingen `new PrismaClient` finnes utenfor `lib/prisma.ts`
- Kontroll av at migrasjonsnavn sorterer korrekt

## 14.2 Mobil (B2.7)

Testes på **fysisk enhet**, ikke emulator.

| Område | Krav |
|---|---|
| Trykkflater | ≥ 44 × 44 px |
| Safe area | Ingen innhold under hakket eller hjemindikatoren |
| Overflow | Ingen horisontal rulling noe sted |
| Tastatur | Skjuler ikke inntastingsfeltet i chat |
| Onboarding | Alle 13 steg fullførbare |
| Autosave | Utkast overlever at appen legges i bakgrunnen |
| Rotasjon | Ingen tap av tilstand |
| Nettverk | Rimelig oppførsel ved brudd |

Testes på minst: én iPhone, én Android, én liten skjerm (≤ 375 px bredde).

## 14.3 Desktop

| Bredde | Krav |
|---|---|
| 1920 | Ingen unødvendig tomrom |
| 1440 | Standardvisning |
| 1024 | Ingen overlapp |
| 768 | Mellomtilstand fungerer |

Nettlesere: Chrome, Safari, Firefox, Edge.

## 14.4 Innhold

| Kontroll | Metode |
|---|---|
| Ingen nynorsk i brukersynlig tekst | `grep -rn "ikkje\|korleis\|sjølv\|kjem\|finst"` |
| Ingen resonans som tall | Manuell gjennomgang |
| Alle 144 spørsmål lesbare i UI | Gjennomgang per kategori |
| Vilkår beskriver koblingsmodellen | Lesning |
| Angrerett er tydelig | Lesning |
| Ingen ord som ikke finnes | Korrekturlesing |

## 14.5 Scoring

| Kontroll | Krav |
|---|---|
| Vektsum | 1,00 |
| Returområde | 0–100 |
| Terskel håndhevet | Ingen match under 40 |
| Resonansnivå varierer | Minst to nivåer forekommer |
| Alle 6 dealbreakere utløser | Én testcase hver |
| Radius tosidig | Begge grenser kan blokkere |

## 14.6 Matching

Se del 12 — beta-testprotokollen er QA for matchingen.

## 14.7 API

| Kontroll | Metode |
|---|---|
| Ingen brutte fetch-kall | Kryssjekk mot `route.ts` |
| Cron krever auth | 401 uten, 403 med feil |
| Admin krever rolle | Uautorisert avvises |
| Rate limiting utløser | Gjentatte kall |
| GDPR-eksport leverer | Manuell nedlasting |

## 14.8 Drift

| Kontroll | Krav |
|---|---|
| Sentry mottar testfeil | Feilen synlig i Sentry |
| Helsesjekk gir 503 ved stale | Varsel innen 5 min |
| Kill switch stanser runden | Køen urørt |
| Backup lar seg gjenopprette | RTO målt |
| Redis-fallback virker | Systemet fungerer uten Redis |

## 14.9 Konseptkontroll

Den viktigste, og den eneste som ikke kan automatiseres:

| Spørsmål | Krav |
|---|---|
| Kan brukeren velge person? | **Nei** |
| Kan brukeren avvise en match? | **Nei** |
| Kan brukeren gå ut av køen? | **Ja** |
| Ser brukeren resonans som tall? | **Nei** |
| Slettes alt ved reiseslutt? | **Ja** |
| Kan samme par kobles igjen? | **Nei** |
| Starter dag 1 når begge har sett? | **Ja** |
| Er statistikken anonym? | **Ja** |
| Er radius en absolutt grense? | **Ja** |

Et «feil» svar her betyr at systemet har sluttet å være ToSom, uansett hvor grønt bygget er.

---

# 15. Konklusjon

## 15.1 Hvor vi står

ACT v5.0 er den første syklusen der rapportert tilstand omtrent stemmer med virkeligheten. Avviket falt fra 30 til 12 prosentpoeng. Alle fem P0-blokkere fra masterplan v4.0 er reelt fjernet — verifisert, ikke rapportert.

Den viktigste enkeltrettingen var også den mest usynlige: da scoreren ble byttet fra `computeQuickScore` (0–1) til `unifiedScore` (0–100), ble terskelen flyttet fra `0.4` til `40`. Hadde den ikke blitt det, ville alle par bestått, matchingen blitt tilfeldig, og ingen test ville feilet.

Sjekk 6 og Sjekk 7 virket etter hensikten. De bør beholdes.

## 15.2 Hva som gjenstår

Ti blokkerende krav står mellom nå og lukket beta (del 10.4). De faller i tre grupper:

**Systemet må kunne se seg selv.** Sentry er ikke aktiv, helsesjekken kalles aldri, ni fetch-kall peker i tomme luften. Til sammen betyr dette at ToSom kan feile stille — og stille svikt er det verste som kan skje i en beta der 100–200 mennesker har ventet et døgn på én kobling.

**Systemet må ha kjørt.** Matcherunden er aldri observert mot en ekte database. `endJourney()` — funksjonen som sletter uopprettelig — er aldri testet mot Postgres. Alt vi vet om at det virker, vet vi fra lesing.

**Innholdet må skrives.** 144 spørsmål er strukturelt på plass og innholdsmessig plassholdere. Dette er den lengste gjenstående oppgaven, og den eneste som ikke kan automatiseres.

## 15.3 Hva som er solid

Det er verdt å si tydelig: grunnlaget holder.

Koden bygger, typene er rene, 113 av 116 tester er grønne, og de tre røde er miljø. Vektene har én sannhetskilde og summerer til 1,00. Seks dealbreakere er implementert, radius tosidig. Geografi er gått fra data som ble lagret uten å bli lest, til en absolutt grense. Resonans beregnes og uttrykkes som ord. `JourneyStat` er ekte anonym. Cron-auth bruker konstant-tids sammenligning. Prisma har én klient. Admin er beskyttet av et eget tokensystem.

Dette er ikke et prosjekt som må reddes. Det er et system som må observeres.

## 15.4 Grunnlaget for ACT v6

ACT v6 skal bygge direkte på dette dokumentet. Rammene følger av innholdet:

**Prioriteringen er gitt.** Del 10.4 lister ti blokkerende krav. De tre kritiske avvikene — A7, A8, A9 — må komme først, fordi alt annet arbeid er umulig å verifisere uten dem. Man kan ikke bekrefte at noe virker i et system som ikke kan rapportere at det ikke virker.

**Rekkefølgen er gitt.** Observability før alt annet. Deretter ekte kjøring. Deretter konsistens og innhold. Å skrive 144 spørsmål før man vet om matcherunden kobler noen, er å pynte et hus man ikke vet står.

**Sjekkene beholdes.** Sjekk 6 (migrering kjørt) og Sjekk 7 (koblet, ikke bare skrevet) reduserte avviket fra 30 til 12 prosentpoeng. De må videreføres — og suppleres med en åttende: **Sjekk 8 — observert i drift.** Et steg som endrer atferd teller ikke før atferden er sett, med en logglinje eller en databasetilstand som bevis.

De fire kritiske funnene i dette dokumentet — A7, A8, A9, A11 — har alle samme signatur: koden finnes, koden er riktig, og ingenting kaller den. Sjekk 7 fanget dette i B2–B5, men ikke i infrastrukturlaget. Sjekk 8 må dekke det.

**Del 12 er akseptansekriteriet.** Beta-testprotokollen er ikke en anbefaling. Den er listen ACT v6 skal måles mot, og de tretten avkrysningspunktene under «Godkjenningskriterier» er definisjonen av ferdig.

## 15.5 Til slutt

ToSom har et premiss som er verdt å bygge: mennesker velger å delta, ikke hvem de deltar med. Det premisset er nå kodet inn — i seks dealbreakere, i en terskel på 40, i en radius som blokkerer tosidig, i en `MatchHistory` som lukker døren, og i en transaksjon som sletter alt når tretti dager er omme.

Det som gjenstår er ikke å bygge det. Det er å se det virke.

---

*TOSOM-MASTERPLAN-v5.0 — verifisert ved commit `2784ae2`, 15. august 2026.*
*Alle påstander har fil:linje-anker. Dokumentet er ment å etterprøves, ikke tros.*
