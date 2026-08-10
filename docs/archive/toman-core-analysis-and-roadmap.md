# ToSom Core Analysis & Roadmap
## Frå dagens tilsom.no → definert ToSom

---

## DEL 1: analyse av tosom-core-definition.md

### 1.1 Kva ToSom er (i følgje dokumentet)

ToSom er ein **roleg, privat og kunnskapsbasert relasjonsplattform for vaksne** som ønskjer ekte forbindelse. Det er IKKJE ein datingapp.

**Kjerneeigenskapar:**
1. **Privat profil** — Dyptgåande, privat profil som aldri er offentleg. Kun ToSom sin match‑motor får tilgang.
2. **Kunnskapsbasert matching** — Matcher basert på kompatibilitet, verdiar, livssituasjon, emosjonelle mønster, relasjonsstil, kommunikasjon, framtidsønsker, modenheit og trygghet. IKKJE basert på bilder, utseende eller swipe.
3. **Én match per 24 timer** — Berre éi match per dag. Den beste kompatibiliteten. Ingen valg mellom fleire.
4. **Låst i 30 dagar** — Når begge aksepterer: låst saman i 30 dagar. Ingen nye matcher i perioden.
5. **Guidet 30-dagers reise** — Daglege refleksjonsspørsmål, samtaletema, små oppgåver, innsikt, resonansmåling, progresjon.
6. **14 dagar utan bilder** — Fase 1 bygger trygghet og emosjonell forbindelse utan overflatefokus.

### 1.2 ToSom sin filosofi (ulemegelege)

- Ro, varme, modenheit, trygghet
- To menneske — éi relasjon
- Langsomheit — reisen skal ta tid
- Guiding — mild støtte, aldri press
- Dybde — meiningfulle samtalar og opplevingar
- Ingen swiping, feed, gamification, uendelege val
- Tone: roleg, varm, trygg, inkluderande — aldri pushy eller masete

### 1.3 Plattform-struktur (i følgje dokumentet)

**For brukaren:**
1. Opprett konto → e-post → magisk innloggingslenke → onboarding
2. Onboarding (privat profil) — identitet, livssituasjon, livsstil, personlighet, relasjonsstil, kommunikasjon, intimitet & nærheit, framtidsonsker, oppsummering
3. Dashboard — match-status, neste match-runde, reise-status, hurtigtilgang
4. Match — éin match per 24t, beste kompatibilitet, aksepter → lås i 30d
5. Privat rom (chat) — guiding, spørsmål, refleksjonar, oppgåver, progresjon
6. Reise — daglege tema, spørsmål, refleksjonar, resonansmåling, progresjon

---

## DEL 2: analyse av dagens kodebase

### 2.1 Arkitektur oversikt

- **Rammeverk:** Next.js (App Router) med både `pages/` (legacy) og `app/` (ny)
- **Database:** PostgreSQL med Prisma ORM
- **Auth:** NextAuth med magisk lenke
- **Styling:** Tailwind CSS + globale CSS-variablar
- **API:** REST-ruter i `app/api/` og `pages/api/`

### 2.2 Datamodell (Prisma) — korleis det er no

**Høgdepunkt:**
- `User` — grunnleggjande brukar med email, password, role, verified, bannedAt, onboardingStep, onboardingComplete
- `Profile` — firstName, lastName, age, gender, bio, interests, photos
- `Match` — userAId, userBId, status (pending/active/matched/expired/ended/unmatched), score, reviewed
- `Conversation` — userAId, userBId, matchId, endedAt, lastMessageAt, frozenAt
- `Message` — conversationId, senderId, content, type (user/system/continue_choice/image), state
- `JourneyProgress` — userId, phase (EARLY/BUILDING_TRUST/DEEPER/CHECKIN), day, pausedAt, resumedAt, completedAt, continueA, continueB
- `JourneyMilestone` — progressId, day, title, summary
- `JourneyStep` — conversationId, phase, order, title, description, dynamic, isSystemMessage, systemMessage
- `MatchQueue` — userId, status (PENDING/MATCHED/EXPIRED)
- `MatchFeedback` — matchId, userId, rating, reason
- `Notification`, `SystemMessage`, `AuditLog`, `SystemLog`, `RateLimitLog`, `PerformanceMetric`, `RouteHit`, `AIRequestLog`

### 2.3 Matching-system — korleis det er no

**Matching weights (config/matching.ts):**
- base: 0.4
- resonance: 0.3
- semantic: 0.25
- intimacy: 0.025
- future: 0.025

**Scorer (lib/matching/scorer.ts):**
- `baseCompatibilityScore` — grunnleggjande kompatibilitet
- `emotionalResonance` — emosjonell resonans
- `deepSemanticScore` — semantisk analyse
- `intimacyScore` — **FEIL**: basert på bio-lengde og photos-antall (contradicerer core definition!)
- `futureScore` — livssituasjon-nøkkelord og felles interesser

**findBestMatchFor (lib/matching/findBestMatchFor.ts):**
- Finn brukarar med aktive samtaler ekskludert
- Rekn match-score for kvar kandidat
- Returner høgaste score

**Match API (app/api/match/route.ts):**
- Kallar `findBestMatchFor`
- Opprettar Match, Conversation, JourneyProgress, Message
- Genererer første melding

### 2.4 Dashboard — korleis det er no

- Side i `app/dashboard/page.tsx`
- Brukar DashboardHeader, StreakDisplay, QuickActionGrid, NotificationFeed, JourneyMap
- Henter data frå `/api/dashboard`
- Har demo/hardkoda data (Emma, 28, Oslo)
- Visar matchprofil, resonansmåler, reise-fremgang
- Quick actions for chat, journey, match, onboarding

### 2.5 Onboarding — korleis det er no

**API-ruter i `pages/api/onboarding/`:**
- complete, firstname, progress, save, step1-step8
- Frontend: `app/onboarding/` med step1.tsx — step8.tsx

**Profile schema (forverra):**
- firstName, lastName, age, gender, bio, interests, photos
- Manglar: verdier, personlegdom, relasjonsstil, kommunikasjon, intimitet & nærheit, framtidsonsker, grenser, emosjonelle behov, livsrytme

### 2.6 Journey-system — korleis det er no

- `JourneyPhase`: EARLY → BUILDING_TRUST → DEEPER → CHECKIN
- `JourneyProgress`: phase, day (1-30), pausedAt, resumedAt, completedAt
- `JourneyStep`: conversationId, phase, order, title, description, isSystemMessage, systemMessage
- `JourneyMilestone`: daglege milestone med title og summary
- Genererer systemmeldingar i chatten

---

## DEL 3: GAP-ANALYSE

### 3.1 Kritiske gap mellom dagens tilstand og core definition

#### GAP 1: Profil-djupne (KRIITISK)

**Core definition krev:**
Livssituasjon, verdiar, personlegdom, relasjonsstil, kommunikasjonspreferansar, framtidsonsker, grenser, emosjonelle behov, livsrytme, modenheit og trygghet

**Dagens tilstand:**
Berre firstName, lastName, age, gender, bio, interests, photos

**Gap:** 10+ dimensjonar manglar. Profilen er for overflate for kunnskapsbasert matching.

#### GAP 2: Éin match per 24 timer (KRIITISK)

**Core definition krev:**
Kun éi match per 24 timer. Ingen nye matcher i låst periode.

**Dagens tilstand:**
Ingen 24t-enforcing. `findBestMatchFor` finn berre beste match utan tidsbegrensning. Ingen "låst" status.

**Gap:** Helt manglar. Dette er ein av dei viktigaste kjerneaigenskapane.

#### GAP 3: 14 dagar utan bilder (KRIITISK)

**Core definition krev:**
Fase 1 — 14 dagar utan bilder. Berre anbefalt, bygger trygghet.

**Dagens tilstand:**
`Profile.photos` er alltid tilgjengeleg. Ingen fase-enforcing.

**Gap:** Helt manglar.

#### GAP 4: 30-dagers reise med guiding (VIKTIG)

**Core definition krev:**
Daglege tema, refleksjonsspørsmål, samtaletema, små oppgåver, innsikt, resonansmåling, progresjon

**Dagens tilstand:**
- JourneyPhase er grov (EARLY → BUILDING_TRUST → DEEPER → CHECKIN)
- JourneyStep kan innehalda systemmeldingar
- Ingen strukturerte "oppgåver" eller "refleksjonar"
- Ingen resonansmåling per dag
- Ingen daily content calendar

**Gap:** Ufullstendig. Treng djupare journey-system med daglig innhald.

#### GAP 5: Matching utan bilder (KRIITISK)

**Core definition krev:**
MATCHER IkkJE basert på bilder, utseende eller swipe.

**Dagens tilstand:**
`intimacyScore` scorer basert på `photos.length` og `bio.length` — dette **contradicerer** core definition direkte!

**Gap:** Direkte motstridande. Matching må fjernast frå bilder.

#### GAP 6: Låst relasjon (VIKTIG)

**Core definition krev:**
Når begge aksepterer: låst saman i 30 dagar. Ingen nye matcher i perioden.

**Dagens tilstand:**
`Match.status` har "active" men ingen mekanisme for "låst" eller "locked". Ingen enforce av 30d-grense.

**Gap:** Helt manglar.

#### GAP 7: Resonans framfor score (VIKTIG)

**Core definition krev:**
ToSom måler resonans — ikkje match score.

**Dagens tilstand:**
Brukar "score" og "matchQuality" (excellent/strong/moderate/weak). Dette er gamification, ikkje resonans.

**Gap:** Konseptuelt feil. Resonans er samanfallande kjensler, ikkje ein numerisk score.

#### GAP 8: Profil er privat (VIKTIG)

**Core definition krev:**
Profilen er privat. Ingen andre brukarar kan sjå han.

**Dagens tilstand:**
`app/profile/[id]/` viser profilar offentleg. Ingen "privat" status.

**Gap:** Manglar.

#### GAP 9: Ingen "match popup" eller "match history" (UI/UX)

**Core definition krev:**
Rolig, moden oppleving. Ingen gamification.

**Dagens tilstand:**
- `MatchPopup.tsx` — popups minner om gamification
- `MatchHistory` komponentar — historikk minner om datingapp
- `NotificationCenter` — notifikasjonar som stress

**Gap:** UI-element strid mot filosofi.

#### GAP 10: Dashboard manglar journey-djupde (VIKTIG)

**Core definition krev:**
Match-status, neste match-runde, reise-status, hurtigtilgang

**Dagens tilstand:**
- Dashboard finst, men har hardkoda demo-data
- Manglar verkeleg match-status-logikk
- Manglar 24t-enforcing visning
- Manglar resonansmåling (ikkje score)

**Gap:** Treng full refaktorering for å speila core values.

---

## DEL 4: ROADMAP — tosom.no → definert ToSom

### EITTE 1: GRUNNLAG (Uke 1-2)

#### Blokk 1.1: Profil-djupne — Database & Schema

**Mål:** Utvid Profile-modellen med alle krevde dimensjonar

**Hva må byggast:**

1. Ny Prisma-migrering:
   - `values` (JSON) — kjjerner: familiefamilie, frihet, trygghet, vekst, tro, natur, kreativitet, etc.
   - `personalityTraits` (JSON) — kjjerner: introvert/extrovert, empathetic, analytical, intuitive, practical, philosophical, etc.
   - `relationshipStyle` (enum) — direkte/indirekte, gradvis/umiddelbar, uavhengig/forbindande, etc.
   - `communicationPreference` (JSON) — tekst/stemme, lang/kort, dag/natt
   - `intimacyComfort` (enum) — konservativ/moderat/åpen (modent språk)
   - `futureVision` (JSON) — familie, karriere, reising, ro, by/land
   - `boundaries` (JSON) — what they need before sharing, pace preferences
   - `emotionalNeeds` (JSON) — validation, support, space, depth, etc.
   - `lifeRhythm` (enum) — morgenkveld, rolig/aktiv, strukturert/fleksibel
   - `securityLevel` (enum) — unsicher/ambivalent/secure

2. Prisma-migrering:
```
npx prisma migrate dev --name add_deep_profile
```

3. Oppdatere `Profile`-typen og alle referansar

**Hva må ryddast:**
- Fjern `photos` frå krevde felt (gjer dei valfrie og interne)
- Fjern `gender` frå synlege felt

**Hva må designast:**
- Onboarding-stepp for kvar ny dimensjon (5-7 steg totalt)
- Visuell stil: glassmorphism, gull-aksentar, rolige fargar

**Prioritet: KRIITISK — BYGG FØRST**

#### Blokk 1.2: Profil-djupne — Onboarding-flow

**Mål:** Bygg ny onboarding-prosess med djipe dimensjonar

**Hva må byggast:**
- Ny onboarding-komponent i `app/onboarding/` eller `components/onboarding/`
- Steg 1: Livssituasjon (arbeid, bustad, økonomi)
- Steg 2: Kjerner (values)
- Steg 3: Personlegdom (personality traits)
- Steg 4: Relasjonsstil
- Steg 5: Kommunikasjon
- Steg 6: Framtidsønsker
- Steg 7: Grenser og emosjonelle behov
- Steg 8: Livsrytme
- Steg 9: Oppsummering

**Hva må designast:**
- Progress-indikator (rolig, ikkje gamification)
- Steg-for-steg navigasjon
- Autogem-save per steg

**Prioritet: KRIITISK — AVHENG av Blokk 1.1**

---

### ETAPP 2: MATCHING-SYSTEM (Uke 3-4)

#### Blokk 2.1: Matching utan bilder (KRIITISK)

**Mål:** Fjern foto-basert scoring og bygg resonans-basert matching

**Hva må byggast:**
- Revider `lib/matching/scorer.ts`:
  - Fjern `intimacyScore` (eller gjer den verdibasert ikkje foto-basert)
  - Fjern `photos.length` og `bio.length` frå alle scoringar
  - Legg til `resonanceDepthScore` — måler emosjonell resonans basert på verdiar, emocjonal djupde, og personlighet-kompatibilitet
  
- Revider `config/matching.ts`:
  - Oppdater weights for å spekla nye dimensjonar
  - Til dømes: base: 0.35, resonance: 0.35, semantic: 0.2, values: 0.1

- Revider `findBestMatchFor`:
  - Legg til `lastMatchAt`-sjekk — berre tillat ny match etter 24t
  - Legg til `lockedUntil`-sjekk — ingen nye matcher medan låst

**Hva må designast:**
- "Resonance" istadenfor "score" — vises som "resonansnivå" ikkje "match score"
- Ny forklaringstekst som understreker kompatibilitet ikkje utseende

**Prioritet: KRIITISK**

#### Blokk 2.2: Éin match per 24 timer + Låst-relasjon (KRIITISK)

**Mål:** Implementer 24t-regelen og 30d-lås

**Hva må byggast:**
1. `User`-modellen:
   - `lastMatchAt` (DateTime?) — når siste match var
   - `lockedUntil` (DateTime?) — når lås opphøyrer (30d etter aksept)

2. `Match`-modellen:
   - Ny status: `locked`
   - `acceptedByA` (DateTime?) — når A aksepterte
   - `acceptedByB` (DateTime?) — når B aksepterte
   - `expiresAt` (DateTime?) — 30d etter dobbelt aksept

3. API-endringar:
   - `POST /api/match` — sjekk `lastMatchAt` (24t) og `lockedUntil` (30d)
   - Ny `POST /api/match/accept` — begge brukarar må akseptere
   - Ny `GET /api/match/status` — vis om låst, når neste match er tilgjengeleg

4. Cron-jobb:
   - Dagleg køyring for å oppdatere match-status
   - Lås opp brukarar etter 30d
   - Rydd opp i eksploderte matcher

**Hva må designast:**
- Match-aksept-side (varm, roleg)
- "Neste match om X time/timar" UI
- "Låst til: DD.MM" UI

**Prioritet: KRIITISK — grunleggjande for heile produktet**

---

### ETAPP 3: 14-DAGAR UTAN BILDER (Uke 5)

#### Blokk 3.1: Bildefase-enforcing

**Mål:** Ingen bilder dei første 14 dagane

**Hva må byggast:**
1. `Conversation`-modellen:
   - `imageShareAllowedAt` (DateTime?) — når bilder blir tillatne (dag 15)
   - `imageShared` (Boolean) — om begge har delt bilder

2. API-sjekk i `POST /api/chat/image`:
   - `if (conversation.phase1NotOver && !imageShareAllowedAt) return 403`

3. UI-endringar:
   - Chat-input: ingen bilde-knapp før dag 15
   - Profilvisning: "Del bilder når du er klar" før dag 15
   - Etter dag 15: "Nå kan du dela bilder om du vil"

4. `Profile`-modellen:
   - `phase1Photos` (String[]) — bilder delte etter dag 15

**Prioritet: VIKTIG — etter 24t/30d-lås**

---

### ETAPP 4: JOURNEY-SYSTEM (Uke 6-8)

#### Blokk 4.1: Djup reise med dagleg innhald

**Mål:** Bygg fullstendig 30-dagers guidet reise

**Hva må byggast:**

1. Ny database-modell:
```prisma
model JourneyDayContent {
  id           String   @id @default(cuid())
  day          Int      // 1-30
  theme        String   // "Introduksjon", "Trygghet", etc.
  reflectionQuestion String
  conversationPrompt  String
  task         String? // valfritt oppgåve
  resonanceGoal   String // kva å måle
  systemMessage  String? // dagens systemmelding
  phase        JourneyPhase
}
```

2. Oppretter innhald for alle 30 dagar:
   - Fase 1 (dag 1-14): Introduksjon → Trygghet → Åpne deg
   - Fase 2 (dag 15-30): Dypare samtalar → Sårbarhet → Felles reise

3. API-endringar:
   - `GET /api/journey/today` — henta dagens innhald
   - `POST /api/journey/reflect` — lag refleksjon
   - `GET /api/journey/resonance` — henta resonans for dagen
   - `POST /api/journey/next-day` — marker som fullført

4. Journey UI:
   - Dagleg oppsummering
   - Resonans-kurve (ikkje score!)
   - Refleksjonar du kan sjå tilbake på
   - "Dagens oppgåve" med mild guiding

**Hva må designast:**
- Reise-visning (tidslinje med dagar)
- Resonans-visning (myk kurve, ikkje tall)
- Refleksjonsside
- Oppgåve-kort

**Prioritet: VIKTIG**

#### Blokk 4.2: Resonans-måling

**Mål:** Måle resonans istedenfor score

**Hva må byggast:**
- Ny modell: `ResonanceSession`
  - conversationId
  - day
  - emotionalTone (positive/neutral/mixed)
  - depthScore (1-10 — basert på samtale-djupde, ikkje "match")
  - responseQuality (engaged/passive/neutral)
  - mutualSharing (boolean)
  - vulnerabilityShown (boolean)

- Resonans-algoritme:
  - Analyse samtale-meldingar (AI-hjelp)
  - Måle emosjonell tone
  - Måle dybde (kort vs djup)
  - Måle gjensidig deling
  - Måle sårbarhet

- UI: "Resonans-kurve" som viser korleie forbindelsen utviklar seg

**Prioritet: VIKTIG**

---

### ETAPP 5: DASHBOARD-REFaktorering (Uke 9)

#### Blokk 5.1: Dashboard etter core definition

**Mål:** Dashboard som speglar ToSom sin filosofi

**Hva må designast:**
- "Ditt rom" — personleg og trygt
- "Din resonans" istadenfor "din match"
- "Neste match om X time" istadenfor "Finn match"
- "Din reise — dag X av 30"
- Hurtigtilgang til: chat, refleksjon, reise

**Hva må byggast:**
- Ny dashboard-side basert på verkelege data (ikkje demo)
- Fjern `DashboardMatchBanner` med "Finn match"-knapp
- Ny `JourneyProgress`-visning
- Ny `ResonanceOverview`-komponent
- Ny `NextMatchTimer`-komponent

**Prioritet: VIKTIG**

---

### ETAPP 6: RYDDING & REFAKTORERING (Uke 10-11)

#### Blokk 6.1: Fjern feil element

**Hva må ryddast:**
1. `MatchPopup.tsx` — gamification, fjern
2. `MatchHistory` komponentar — minner om datingapp
3. `NotificationCenter` — endre til "dagens oppsummering"
4. `PublicMatchCard.tsx` — offentleg profil bryter privat-regelen
5. `MatchActions.tsx` — "swipe"-liknande handlingar
6. `pages/match/` — legacy match-sider

7. Alle referansar til `photos` i matching-logikk
8. Gamification-element (streaks, achievements)

**Prioritet: VIKTIG**

#### Blokk 6.2: Forenkel API-struktur

**Hva må byggast:**
- Konsolidere API-ruter: `pages/api/` → `app/api/`
- Fjern duplicate-ruter
- Standardiser response-format

---

### ETAPP 7: UI/DESIGN SYSTEM (Uke 12)

#### Blokk 7.1: Fullt design-system etter ui-spec.md

**Hva må designast:**
1. Følg `ui-spec.md` fullt ut:
   - Mørk base (#0B0E11)
   - Glassmorphism med gull-aksentar
   - Typografi: Inter,XL/L/M/body/small
   - Buttons: gull, radius 12px
   - Cards: glass, radius 20px
   - Chat: gull-bobler for eigen, kvite for mottatt

2. Komponentbibliotek:
   - `GlassPanel` — base komponent
   - `PremiumButton` — gull-knapp
   - `ResonanceMeter` — ikkje score-meter!
   - `JourneyTimeline` — reiselinje
   - `ReflectionCard` — refleksjon-kort

**Prioritet: EFTER alt grunnleggjande er på plass**

---

### ETAPP 8: LANSERING (Uke 13)

#### Blokk 8.1: Testing & Optimalisering

- E2E-testar for match-flow
- Database-optimalisering
- Performance-testar
- Sikkerheitsreview

#### Blokk 8.2: Landing Page

- Oppdater tosom.no til å spekle core definition
- Seksjonar: "Kva er ToSom", "Slik fungerer det", "Kvifor ToSom", "Start"
- Ingen "svipp her" eller "utforsk profilar"

---

## DEL 5: ANBEFALD REKKJEFÖLGE (SAMMENFYATT)

### MUST BUILD FIRST (KRIITISK — ingen funksjonar utan dette)

1. **Profil-djupne** — ny database-skjem med 10+ dimensjonar
2. **Onboarding** — ny 9-stegs prosess for profil
3. **24t/30d-enforcing** — éin match per dag, låst i 30 dagar
4. **Matching utan bilder** — fjern foto-scoring
5. **Resonans-basert matching** — ny scoring

### BUILD SECOND (VIKTIG — kjerneaigenskapar)

6. **14-dagers bilde-fase** — ingen bilder før dag 15
7. **30-dagers reise** — dagleg innhald, refleksjonar, oppgåver
8. **Resonans-måling** — emosjonell analyse
9. **Dashboard-rydding** — ekte data, ikkje demo

### BUILD THIRD (VIKTIG — rydding)

10. **Fjern gamification** — popups, match history, swipe-komponentar
11. **API-konsolidering** — pages → app
12. **Privat profil-enforcing** — ingen offentlege profilar

### BUILD LAST (VIKTIG — polish)

13. **Fullt design-system** — ui-spec.md
14. **Landing page** — ny forsida
15. **Testing & optimalisering**

---

## DEL 6: KVAD SOM MÅ BYGGAST FØRST (DETYLLERT)

### Første 3 arbeidsblokker (fyrste 2 vekene):

#### BLOKK 1: Ny Prisma-skjem for djup profil

```prisma
model Profile {
  id                    String   @id @default(cuid())
  userId                String   @unique
  firstName             String?
  lastName              String?
  age                   Int?
  
  // --- NYTT: Kjerneeigenskapar ---
  values                String[] // ["familie", "frihet", "trygghet", "vekst", "trod", "natur", "kreativitet"]
  personalityTraits     String[] // ["introvert", "empathetic", "analytical"]
  relationshipStyle     String?  // "gradual", "direct", "indirect", "independent"
  communicationPref     String?  // "text-voice", "long-short", "day-night"
  intimacyComfort       String?  // "conservative", "moderate", "open"
  futureVision          String[] // ["familie", "karriere", "reising", "ro"]
  boundaries            String[] // ["need-space", "slow-pace", "emotional-first"]
  emotionalNeeds        String[] // ["validation", "support", "depth", "understanding"]
  lifeRhythm            String?  // "morning", "evening", "structured", "flexible"
  securityLevel         String?  // "insecure", "ambivalent", "secure"
  
  // --- GAMMA (halvdata) ---
  photos                String[] @default([]) // alltid valfri
  bio                   String?
  interests             String[]
  
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  user                  User     @relation("UserProfile", fields: [userId], references: [id])
}
```

#### BLOKK 2: Utvid User-skjem

```prisma
model User {
  // --- NYTT: Match-kontroll ---
  lastMatchAt           DateTime?
  lockedUntil           DateTime?
  phase1Complete        Boolean  @default(false)
  phase1PhotosShared    Boolean  @default(false)
  
  // ... eksisterande felt
}
```

#### BLOKK 3: Ny onboarding-komponent

```
components/onboarding/
  OnboardingWizard.tsx       — hoved-komponent
  StepValueSelect.tsx        — verdiar
  StepPersonality.tsx        — personlighet
  StepRelationshipStyle.tsx  — relasjonsstil
  StepCommunication.tsx      — kommunikasjon
  StepFutureVision.tsx       — framtidsoønsker
  StepBoundaries.tsx         — grenser
  StepEmotionalNeeds.tsx     — emosjonelle behov
  StepLifeRhythm.tsx         — livsrytme
  StepSummary.tsx            — oppsummering
  ProgressBar.tsx            — roleg progress
```

---

## DEL 7: KVAD SOM MÅ RYDDAST (DETYLLERT)

### Akutte rydding:

1. **Fjern MatchPopup.tsx** — `components/MatchPopup.tsx`
2. **Fjern MatchActions.tsx** — `components/MatchActions.tsx`
3. **Fjern PublicMatchCard.tsx** — `components/PublicMatchCard.tsx`
4. **Fjern pages/match/** — alle legacy match-sider
5. **Fjern pages/find-match.tsx** — "swipe"-liknande side
6. **Fjern MatchHistory-komponentar** — `components/MatchHistory/`
7. **Fjern NotificationCenter** — `components/NotificationCenter.tsx` (bytt til "daily summary")
8. **Fjern photo-scoring** — `lib/matching/scorer.ts` intimacyScore
9. **Fjern pages/api/match/** — legacy API-ruter
10. **Fjern demo-data** — `app/dashboard/page.tsx` (Emma-demo)

---

## DEL 8: KVAD SOM MÅ DESIGNAST (DETYLLERT)

### Design-oppgåver:

1. **Onboarding Wizard** — 9-stegs djup profil
   - Farge: mørk med gull-aksentar
   - Animasjon: myk fade-in per steg
   - Progress: tynn linje, ikkje gamification-bar

2. **Match Aksept-side** — varm og roleg
   - "Dere to er matchet" — berre tekst, ingen bilder
   - "Aksepter og start reisen" — roleg CTA
   - Ingen countdown-stress

3. **Dashboard "Ditt rom"** — personleg og trygt
   - "Resonans" istadenfor "match"
   - "Din reise — dag X av 30"
   - "Neste match om X timer"
   - Kort med refleksjon og oppgåve

4. **Chat med guiding** — varm og dyp
   - Systemmeldingar som引导
   - "Dagens refleksjon" knapp
   - "Dagens oppgåve" kort
   - Resonans-visning (ikkje score)

5. **Reise-visning** — tidslinje med dagar
   - 30 dagar som myk kurve
   - Kvart dag: tema, refleksjon, oppgåve
   - Gule punkter for fullførte dagar
   - Resonans-kurve over heile reisen

---

## DEL 9: KVAD SOM MÅ IMPLEMENTERAST (DETYLLERT)

### Implementeringsprioritet:

```
1. lib/profile/deepProfile.ts       — Deep profile scoring
2. lib/matching/resonanceScore.ts   — Ny resonans-algoritme
3. lib/matching/twoHourLock.ts      — 24t-enforcing
4. lib/matching/lockMechanism.ts    — 30d-lås
5. lib/journey/dailyContent.ts      — 30 dagar med innhald
6. lib/journey/resonanceSession.ts  — Resonans-sesjonar
7. app/api/match/route.ts           — Oppdatert match-API
8. app/api/match/accept/route.ts    — Ny aksept-endepunkt
9. app/api/journey/today/route.ts   — Ny dagleg innhald
10. app/dashboard/page.tsx           — Ny dashboard
11. components/onboarding/OnboardingWizard.tsx
12. components/journey/JourneyTimeline.tsx
13. components/chat/GuidedChat.tsx
```

---

## OPP Summering

### Største farer:

1. **Gamification-element** i dagens kode — må fjernast heilt
2. **Foto-basert matching** — strid mot kjernefilosofi
3. **Legacy API-ruter** — må konsoliderast
4. **Demo-data** — må fjernast
5. **Offentlege profilar** — bryter privat-regelen

### Største sjanse:

ToSom har potensial til å vera den einaste relasjonsplattformen som faktisk føler **annleis** — roleg, varm, dyp og meningsfull. Det krev berre at vi følgjer core definition utan kompromiss.

### Nøkkelspørsmål før vi startar:

1. Har vi nok brukarar til å garantere éi match per dag? (kan krevje manuel match)
2. Korleie handsamere brukarar som ønskjer fleire matcher? (svaret: akkurat slik — berre éi)
3. Skal vi starta med "demo-matcher" for tidleg brukarar?
4. Korleie motivere brukarar til å fullføra djup onboarding?

---

*Dokumentet er basert på tosom-core-definition.md, ui-spec.md, tosoms-blueprint.md og den faktiske kodebasen.*
*Sist oppdatert: Juni 2026*