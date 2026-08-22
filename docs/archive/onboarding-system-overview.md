# ToSom Onboarding System — Fullstendig Oversikt

**Generert:** 2026-01-27  
**Status:** Full analyse og dokumentasjon av onboarding-systemet  
**Versjon:** 13-stegs med autosave + fade-transitions

---

## TABLE OF CONTENTS

1. [Overblikk](#1-overblikk)
2. [Filstruktur](#2-filstruktur)
3. [Steget-for-steg oversikt (1–13)](#3-steg-for-steg-oversikt-113)
4. [Database-mapping](#4-database-mapping)
5. [API-ruter](#5-api-ruter)
6. [State-flow og datalagring](#6-stateflow-og-datalagring)
7. [UX-oversikt](#7-ux-oversikt)
8. [Design-systemet](#8-design-systemet)
9. [Styrker og svakheter](#9-styrker-og-svakheter)
10. [Forslag til forbedring](#10-forslag-til-forbedring)
11. [Blueprint for forskningsbasert onboarding](#11-blueprint-for-forskningsbasert-onboarding)

---

## 1. OVERBLIKK

ToSom sin onboarding er ein **13-stegs prosess** delt inn i **3 hovudfaser**:

| Fase | Steg | Tittel | Formål |
|------|------|--------|--------|
| **FASE 1 — Identitet** | Steg 1 | Grunnprofil | Navn, alder, kjønn, bosted, radius |
| | Steg 2a | Personlighet & identitet | Selvpresentasjon, energi, pressrespons |
| | Steg 2b | Livssituasjon | Kvardagsliv, jobb, bustad |
| **FASE 2 — Personlighet** | Steg 3 | Tilknytning & trygghet | Trygghetsbehov, usikkerheitsutløysar |
| | Steg 4 | Kjærleiksspråk & nærhet | Vis/resta kjærleik, næringsbyggjar |
| | Steg 5a | Livsstil & verdiar | Prioriteringar, kvardagsmønster |
| | Steg 5b | Relasjonsstil | Sjølvstende vs fellesskap |
| | Steg 6 | Framtid & visjon | Drømmer, felles mål |
| | Steg 7 | Humor & personlighet | Lekke detaljar, quirky habits |
| **FASE 3 — Relasjon** | Steg 8a | Grenser | Vern, forståing, begrensingar |
| | Steg 8b | Moden nysgjerrighet | Intimitet, trygghet i nærleik |
| | Steg 9/11 | Oppsummering | Oversikt over alt (kan endre) |
| | Steg 10/12 | Start reisen | CTA → matching → dashboard |

**Totalt antal felter:** ~70+ datafelt lagrast i Profile-modelen  
**Autosave:** Ja, med debounce på 400ms + localStorage  
**Validering:** Klient-side (minste-teikn-grenser) + Zod-schemas  
**Navigasjon:** Next/Back knappar + fade-transition mellom stega

---

## 2. FILSTRUKTUR

### Onboarding-komponentar (`app/onboarding/`)

```
app/onboarding/
├── page.tsx                    → Redirect til /onboarding/1 (Client)
├── OnboardingFlow.tsx          → 13-stegs flyt + autosave + API-kall
├── OnboardingLayout.tsx        → Premium container (glassmorphism, progressbar)
├── layout.tsx                  → Layout wrapper
├── [step]/
│   └── page.tsx                → Dynamic routing for steg 1–9
├── components/
│   ├── InputField.tsx          → Tekst/input-felt (gold focus, glass bg)
│   ├── SelectField.tsx         → Dropdown/select (gull accent)
│   ├── SliderField.tsx         → Range slider (gull thumb)
│   └── TextAreaField.tsx       → Multi-line textarea (glassmorphism)
├── data/
│   └── questions.ts            → Spørsmål/data for stega
└── steps/
    ├── Step1Profile.tsx        → Grunnprofil (Seksjon A/B/C, 378 linjer)
    ├── Step2Personlighet.tsx   → Personlighetstrekk (5 tekstfelt ≥10 tegn)
    ├── Step2Livssituasjon.tsx  → Livssituasjon (6 felt)
    ├── Step3Tilknytning.tsx    → Tilknytning & trygghet (5 felt)
    ├── Step4Kjærlighetsspråk.tsx → Kjærleiksspråk (valg-side)
    ├── Step5LivsstilVerdier.tsx → Livsstil & verdiar (prioritering)
    ├── Step5Relasjonsstil.tsx  → Relasjonsstil (søking + balanse)
    ├── Step6FramtidVisjon.tsx  → Framtid & visjon (drøm + felles mål)
    ├── Step7HumorPersonlighet.tsx → Humor & personlighet (lekke detaljar)
    ├── Step8Grenser.tsx        → Grenser (vern + forståing)
    ├── Step8ModenNysgjerrighet.tsx → Moden nysgjerrighet (intimitet/spørrsmål)
    ├── Step9Oppsummering.tsx   → Oppsummering (oversikt over alt)
    └── Step10StartReisen.tsx   → CTA + matching-trigger
```

### Komponentar (`components/onboarding/`)

```
components/onboarding/
├── PremiumButton.tsx           → Gull-gradient knappe med hover/shadow
├── BackButton.tsx              → Tilbake-knapp (minimalistisk)
└── [fleire...]                → Delte komponentar
```

### UI-komponentar (`components/ui/`)

```
components/ui/
├── StepIndicator.tsx           → Progress-indikator (trinnvis visning)
└── [andre...]                  → Delte UI-element
```

### API-ruter (`app/api/onboarding/` og `app/api/profile/`)

```
app/api/
├── onboarding/
│   ├── save/route.ts           → POST — Lagar deep profile data
│   ├── progress/route.ts       → GET — Henter progresjon
│   ├── complete/route.ts       → POST — Marker onboarding som fullført
│   └── deep-profile/route.ts   → POST — 10-dimensjonal djup profil
├── profile/
│   ├── route.ts                → GET/PUT — Profil CRUD (med Zod-validering)
│   └── setup/route.ts          → POST — Full onboarding-setup (70+ felt)
├── auth/
│   ├── magic-link/route.ts     → POST — Magic link send
│   ├── magic-link/verify/route.ts → GET — Magic link verifisering
│   └── vipps/callback/route.ts → GET — Vipps OAuth callback (lagar profile)
└── match/
    └── route.ts                → POST — Trigger matching etter onboarding
```

### Validering (`lib/validation/`)

```
lib/validation/
├── api.ts                      → 25+ Zod-schemas for alle API-ruter
├── profile.ts                  → profileCreateSchema + profileUpdateSchema
├── input.ts                    → sanitizeInput, validateField
├── match.ts                    → Match-validering
├── journey.ts                  → Journey-validering
├── message.ts                  → Message-validering
└── admin.ts                    → Admin-validering
```

### Design-system (`config/`)

```
config/
└── design-tokens.ts            → Farge, radius, shadow, typografi, spacing, blur, glassVariant
```

### Database (`prisma/schema.prisma`)

```
prisma/schema.prisma
├── User (model)                → email, role, onboardingStep, onboardingComplete, deepProfileComplete
├── Profile (model)             → identityName, age, gender, lifeSituation, lifestyle, personality, + 10 JSON-felt
├── JourneyProgress (model)     → currentState, phaseOrder, daysTogether, messageCount
└── Match, Conversation, Message, Notification (models)
```

---

## 3. STEG-FOR-STEG OVERSIKT (1–13)

### FASE 1 — IDENTITET (Kven er du?)

#### Steg 1: Grunnprofil (`Step1Profile.tsx`)

**Formål:** grunnleggjande demografiske data  
**UI-layout:** Tre Seksjonar (A/B/C) i glass-cards med gull-headingar  
**Komponentar:** InputField, SelectField, PremiumButton, SekstonKort, SekstonHeader  
**Felt:**
| Felt | Type | Required | Min-størrelse | Validering |
|------|------|----------|---------------|------------|
| identityName | tekst | Ja | 2 teikn | Navn eller kallenavn |
| age | tal | Ja | ≥23 | ToSom er for vaksne |
| gender | select | Ja | - | Mann/Kvinne/Annet |
| seekingGender | select | Ja | - | Mann/Kvinne/Åpen |
| city | tekst | Ja | 1 teikn | Kva by du bur i |
| distancePref | slider | Ja | 1–300 km | Maks avstand med gull thumb |
| minAge | tal | Ja | ≥23 | Minste alder |
| maxAge | tal | Ja | >minAge | Maksimal alder |
| height | tekst | Nei | - | Høgd i cm |
| bodyType | select | Nei | - | Slank/Gjennomsnittlig/Atletisk/Kraftig/Myk |
| lifestyle | select | Nei | - | Aktiv/Rolig/Balansert/Eventyrlysten/Hjemmekjær |
| smoking | select | Nei | - | Snuser/Røyker/etc |
| religion | select | Nei | - | Kristnen/Agnostiker/Ikje religiøs/Muslim/Annet |
| children | select | Nei | - | Har barn/Ikke barn |
| wantChildren | select | Nei | - | Ja/Usikker/Nei |

**Validering:** Klient-side med feil-liste. Disabled "Fortsett"-knapp ved feil.  
**API-kall:** Ingen direkte — data lagrast lokalt i `ProfileData` state + autosave til localStorage  
**Database:** Inga direkt oppdatering før steeg 10/StartReisen

**Design:**
- SeksjonKort: `rounded-[20px]`, `bg: rgba(255,255,255,0.03)`, `border: rgba(255,255,255,0.08)`
- Gull-headingar: `#D4AF37`, font-medium, 20px
- PremiumButton: gull-gradient (#D4AF37 → #E8C766), hover med lysare gradient

---

#### Steg 2a: Personlighet & identitet (`Step2Personlighet.tsx`)

**Formål:** personlegheitstrekk (fritekstfelt — ikkje ein Big Five-skala). Merk: ombygd til ein reell BFI-10-skala i FORSKNINGSMOTOR F-5.  
**UI-layout:** Single page, max-w-3xl, space-y-8/10  
**Komponentar:** TextAreaField, PremiumButton, BackButton  
**Felt (alle textarea ≥10 teikn):**
| Felt | Min-teikn | Beskriving |
|------|-----------|------------|
| selfDesc | 10 | Kven du er |
| energyGiver | 10 | Kva som gir energi |
| energyDrainer | 10 | Kva som tapper energi |
| pressureReact | 10 | Korleis du reagerer under press |
| quirk | 5 | Egenskap du ler av sjølv |
| bestSelf | - | Ditt beste jeg |
| energy | - | Energinivå |
| drains | - | Kva tapper deg |
| pressure | - | Press-hantering |
| habits | - | Vane-mønster |

**Validering:** Alle felt ≥10 teikn (quirk ≥5). Feil-liste med felt-namn + melding.  
**API-kall:** Ingen — autosave til localStorage  
**Navigasjon:** Back → Steg 1, Next → Steg 2b

---

#### Steg 2b: Livssituasjon (`Step2Livssituasjon.tsx`)

**Formål:** kvardagsliv og jobb-status  
**Felt:**
| Felt | Type | Validering |
|------|------|------------|
| workType | select/tekst | Kva du jobbar med |
| housingType | select | Bustadtype |
| householdSize | select | Hushaldningsstorleik |
| economicStability | select | Økonomisk stabilitet |
| responsibilities | textarea ≥10 tegn | Oppgåver og ansvar |
| dailyRoutine | textarea ≥10 teikn | Kvardagsrutinar |

**Design:** Sama glass-card-stil som Steg 2a

---

### FASE 2 — PERSONLIGHET (Korleis er du?)

#### Steg 3: Tilknytning & trygghet (`Step3Tilknytning.tsx`)

**Formål:** tilknytningsmønster og trygghetsbehov  
**Felt (tekstarea, ≥10 teikn):**
| Felt | Beskriving |
|------|------------|
| safetyNeed | Kva gjer deg trygg |
| insecurityTrigger | Kva utløyser usikkerheit |
| sadnessNeed | Kva du treng når du er ledsen |
| stressNeed | Kva du treng under stress |
| importantBoundary | Kva grenser som er viktige |

---

#### Steg 4: Kjærleiksspråk & nærhet (`Step4Kjærlighetsspråk.tsx`)

**Formål:** korleis du viser og mottar kjærleik  
**Felt (val-side, ikke fragmentert):**
| Felt | Type | Beskriving |
|------|------|------------|
| loveGive | select | Korleis du viser kjærleik |
| loveReceive | select | Korleis du ønskjer kjærleik |
| closenessBuilder | textarea ≥10 tegn | Kva byggjer nærhet |
| distanceCreator | textarea ≥10 tegn | Kva skaper avstand |
| smallThing | textarea ≥10 teikn | Det små tinga som betyr mykje |

---

#### Steg 5a: Livsstil & verdiar (`Step5LivsstilVerdier.tsx`)

**Formål:** prioriteringar og kvardagsmønster  
**Felt:**
| Felt | Type | Beskriving |
|------|------|------------|
| highPriority | val | Kva som er viktigast no |
| lowPriority | val | Kva som er mindre viktig |
| goodEveryday | textarea ≥10 tegn | God kvardag |
| desiredLifestyle | val | Ønskt livsstil |
| undesiredLifestyle | val | Uønskt livsstil |

---

#### Steg 5b: Relasjonsstil (`Step5Relasjonsstil.tsx`)

**Formål:** korleis du søker relasjon  
**Felt:**
| Felt | Beskriving |
|------|------------|
| relationshipSeeking | Kva type relasjon du søker |
| closenessNeed | Kor mykje nærheit du treng |
| independenceBalance | Balanse mellom sjølvstende og fellesskap |

---

#### Steg 6: Framtid & visjon (`Step6FramtidVisjon.tsx`)

**Formål:** drømmer og felles mål  
**Felt (textarea ≥10 teikn):**
| Felt | Beskriving |
|------|------------|
| futureVision | Din framtidvisjon |
| dreamGoal | Din største drøm |
| buildTogether | Kva du kan bygge saman |
| experienceAlone | Opplevelser åleine |
| experienceTogether | Opplevelser saman |

---

#### Steg 7: Humor & personlighet (`Step7HumorPersonlighet.tsx`)

**Formål:** de små detaljane som gjer deg til deg  
**Felt (textarea):**
| Felt | Min-teikn | Beskriving |
|------|-----------|------------|
| laughterTrigger | - | Kva får deg til å le |
| quirkyHabit | 5 | Quirky vaner |
| guiltyPleasure | 10 | Skyldig glede |
| totallyYou | 10 | "Det er helt deg" |
| partnerWouldLaugh | - | Kva partneren din ville le av |

---

### FASE 3 — RELASJON (Kven søker du?)

#### Steg 8a: Grenser (`Step8Grenser.tsx`)

**Formål:** trygghet og vern  
**Felt:**
| Felt | Beskriving |
|------|------------|
| neverCrossBoundary | Kva du aldri vil krysse |
| understandPartnersBoundaries | Korleis du forstår partnar sine grenser |
| limitations | Dine avgrensingar |
| partnerMustUnderstand | Kva partnar må forstå |

---

#### Steg 8b: Moden nysgjerrighet (`Step8ModenNysgjerrighet.tsx`)

**Formål:** refleksjonsspørrsmål om intimitet og trygghet  
**Felt (refleksjon):**
| Felt | Beskriving |
|------|------------|
| intimacySafety | Kva gjer intimitet trygg |
| comfortableWith | Kva du er komfortabel med |
| boundary | Din grense |
| nearerType | Kva type nærheit du søker |
| needsTime | Kor mykje tid du treng |

---

#### Steg 9/11: Oppsummering (`Step9Oppsummering.tsx`)

**Formål:** roleg, trygg oversikt over alt  
**Innhald:** Alle felt vist i gruppert visning (kan endre)  
**Design:** Premium-card med gull-rammer, stor typografi  
**CTA:** "Gå tilbake og endre" / "Fullfør onboarding"

---

#### Steg 10/12: Start reisen (`Step10StartReisen.tsx`)

**Formål:** overgang til ToSom-plattformen  
**CTA:** "Start reisen din" (stor gull-gradient knappe)  
**API-kall:**
1. `POST /api/profile/setup` med heile `ProfileData` payload
2. `POST /api/match` med userId frå step 1
3. Redirect til `/dashboard` eller `/matching?userId=xxx`

**Loading-state:** "Sparar..." + spinner (gull-farge)

---

## 4. DATABASE-MAPPING

### User-modellen (`prisma/schema.prisma`)

```prisma
model User {
  id                  String               @id @default(cuid())
  email               String               @unique
  password            String?
  phone               String?
  phoneVerified       Boolean              @default(false)
  onboardingStep      Int                  @default(1)
  onboardingComplete  Boolean              @default(false)
  deepProfileComplete Boolean              @default(false)
  role                Role                 @default(USER)
  verified            Boolean              @default(false)
  bannedAt            DateTime?
  deletedAt           DateTime?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
  lastMatchAt         DateTime?
  lockedUntil         DateTime?
  // ... relations (accounts, sessions, etc.)
}
```

**Påverka felt under onboarding:**
| Felt | Verdi ved fullføring | API-kall |
|------|----------------------|----------|
| `onboardingStep` | 10 | `/api/profile/setup` |
| `onboardingComplete` | true | `/api/profile/setup` |
| `deepProfileComplete` | true | `/api/profile/setup` |

---

### Profile-modellen (70+ felt)

```prisma
model Profile {
  id                String          @id @default(cuid())
  userId            String          @unique
  firstName         String?
  lastName          String?
  age               Int             // REQUIRED
  identityName      String?
  lifeSituation     Json?           // Steg 2b (jobb, bustad, etc.)
  lifestyle         Json?           // Steg 5a (prioriteringar)
  personality       Json?           // Steg 2a (Big Five)
  communication     Json?           // Steg 4 (samanlikningsfelt)
  intimacy          Json?           // Steg 8b (intimitetssøking)
  futureVision      Json?           // Steg 6 (drømmer)
  boundaries        Json?           // Steg 8a (grenser)
  emotionalNeeds    Json?           // Steg 3 (tilknyting)
  lifeRhythm        String?
  maturityLevel     Int?
  securityLevel     String?
  photoUrl          String?
  bio               String?
  interests         String[]
  deepProfileStep   DeepProfileStep @default(IDENTITY)
  deepProfileData   Json?           // Steg 7 (humor), preferanser
  preferences       Json?           // Steg 5b (relasjons-preferanse)
  matchTags         String[]
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  user              User            @relation("UserProfile")
}
```

**Payload-mapping frå `/api/profile/setup`:**

```typescript
{
  basic: { identityName, age, gender, seekingGender, height, bodyType, lifestyle, smoking, religion, children, wantChildren, city, distancePref, agePrefMin, agePrefMax },
  personlighet: { selfDesc, energyGiver, energyDrainer, pressureReact, quirk },
  livssituasjon: { workType, housingType, householdSize, economicStability, responsibilities, dailyRoutine },
  tilknytning: { safetyNeed, insecurityTrigger, sadnessNeed, stressNeed, importantBoundary },
  kommunikasjon: { commStyle, conflictStyle, calmingHelp, trigger, trustBuilder },
  kjaerlighet: { loveGive, loveReceive, closenessBuilder, distanceCreator, smallThing },
  livsstil: { highPriority, lowPriority, goodEveryday, desiredLifestyle, undesiredLifestyle },
  relasjonsStil: { relationshipSeeking, closenessNeed, independenceBalance },
  fremtid: { futureVision, dreamGoal, buildTogether, experienceAlone, experienceTogether },
  humor: { laughterTrigger, quirkyHabit, guiltyPleasure, totallyYou, partnerWouldLaugh },
  grenser: { neverCrossBoundary, understandPartnersBoundaries, limitations, partnerMustUnderstand },
  moden: { intimacySafety, comfortableWith, boundary, nearerType, needsTime },
  preferanser: { politicsImportance, religionImportance, dietPreference, sleepSchedule, pets, travelFreq, alcoholFreq, ambitionLevel, structureSpontaneity, introExtrovert, attachmentStyle }
}
```

**Merk:** Dette er ein **flat payload** som backend mappar til Profile-modellen sine nestede JSON-felt.

---

### JourneyProgress-modellen

```prisma
model JourneyProgress {
  id            String          @id @default(cuid())
  userId        String          @unique
  conversationId String?
  currentState  JourneyState    @default(NOT_STARTED)
  phaseOrder    Int             @default(1)
  daysTogether  Int             @default(1)
  messageCount  Int             @default(0)
  longestStreak Int             @default(0)
  resonanceLevel ResonanceLevel @default(GENTLE)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
}
```

**Påverka etter onboarding:** Opprett automatisk ved `POST /api/match` med default-verdiar.

---

## 5. API-RUTER

### POST `/api/profile/setup`

**Formål:** Hovud-API for onboarding-fullføring  
**Metode:** POST  
**Content-Type:** application/json  
**Input (body):** Heile `ProfileData` payload med basic + personlighet + livssituasjon + tilknytning + kommunikasjon + kjaerlighet + livsstil + relasjonsStil + fremtid + humor + grenser + moden + preferanser

**Utdata:**
```json
{ success: true, userId: "cuid_xyz", message: "Profil fullført!" }
```

**Database-kall:**
```typescript
await prisma.profile.upsert({
  where: { userId },
  update: { /* alle felt oppdatert */ },
  create: { userId, identityName, age: 25, /* required + default */ deepProfileStep: 'SUMMARY' }
});

await prisma.user.update({
  where: { id: userId },
  data: { onboardingComplete: true, deepProfileComplete: true, onboardingStep: 10 }
});
```

**Validering:** Ingen Zod-validering her — frontend validerer alt  
**Feilhåndtering:** 401 (ikkje innlogga), 500 (server-feil)

---

### GET `/api/profile`

**Formål:** Hente eksisterande profil  
**Metode:** GET  
**Utdata:** `{ profile: { ... } | null }`  
**Auth:** getServerSession ()  

---

### PUT `/api/profile`

**Formål:** Oppdatere profil (delvis)  
**Metode:** PUT  
**Input:** `{ firstName, lastName, age, gender, bio, interests, photos }`  
**Validering:** Zod (`profileUpdateSchema`)  
**Rate-limiting:** 5 oppdateringar per minutt

---

### GET `/api/onboarding/progress`

**Formål:** Sjekke progresjon (kven steg er på?)  
**Metode:** GET  
**Auth:** getServerSession()  
**Utdata:** `{ step: number, totalSteps: number, completed: boolean }`

---

### POST `/api/onboarding/deep-profile`

**Formål:** Lagre 10-dimensjonal djup profil  
**Metode:** POST  
**Input:** `{ userId, identityName, lifeSituation, lifestyle, personality, communication, intimacy, futureVision, boundaries, emotionalNeeds, ... }`  
**Database-kall:** `prisma.profile.upsert` med nestede JSON-felt + `prisma.user.update` for `deepProfileComplete`

---

### POST `/api/match`

**Formål:** Trigger resonans-matching etter onboarding  
**Metode:** POST  
**Input:** `{ userId }`  
**Utdata:** Match-object med scoring-breakdown, resonanceLevel, explanation  
**Neste steg:** Redirect til `/matching?userId=xxx` eller `/dashboard`

---

### Auth-relaterte API-ruter

| Rute | Metode | Formål |
|------|--------|--------|
| `/api/auth/magic-link` | POST | Send magic link til e-post |
| `/api/auth/magic-link/verify?token=xxx` | GET | Verifiser token og opprett/klogg inn bruker |
| `/api/auth/vipps/callback?code=xxx` | GET | Vipps OAuth callback (opprett profil automatisk) |
| `/api/auth/oauth/vipps/callback?code=xxx` | GET | Ny OAuth-vipps callback (standardisert) |

---

## 6. STATE-FLOW OG DALAGRING

### Client-side state (OnboardingFlow.tsx)

```typescript
interface ProfileData extends Record<string, unknown> {
  // Steg 1: Grunnprofil
  identityName, age, gender, seekingGender, height, bodyType, lifestyle, smoking, religion, children, wantChildren, city, distancePref, agePrefMin, agePrefMax
  
  // Steg 2a: Personlighet
  selfDesc, energyGiver, energyDrainer, pressureReact, quirk, bestSelf, energy, drains, pressure, habits
  
  // Steg 2b: Livssituasjon
  workType, housingType, householdSize, economicStability, responsibilities, dailyRoutine
  
  // Steg 3: Tilknytning
  safetyNeed, insecurityTrigger, sadnessNeed, stressNeed, importantBoundary
  
  // Steg 4: Kjærleiksspråk
  loveGive, loveReceive, closenessBuilder, distanceCreator, smallThing
  
  // Steg 5a: Livsstil & verdiar
  highPriority, lowPriority, goodEveryday, desiredLifestyle, undesiredLifestyle
  
  // Steg 5b: Relasjonsstil
  relationshipSeeking, closenessNeed, independenceBalance
  
  // Steg 6: Framtid & visjon
  futureVision, dreamGoal, buildTogether, experienceAlone, experienceTogether
  
  // Steg 7: Humor & personlighet
  laughterTrigger, quirkyHabit, guiltyPleasure, totallyYou, partnerWouldLaugh
  
  // Steg 8a: Grenser
  neverCrossBoundary, understandPartnersBoundaries, limitations, partnerMustUnderstand
  
  // Steg 8b: Moden nysgjerrighet
  intimacySafety, comfortableWith, boundary, nearerType, needsTime
  
  // Legacy + preferanser
  politicsImportance, religionImportance, dietPreference, sleepSchedule, pets, travelFreq, alcoholFreq, ambitionLevel, structureSpontaneity, introExtrovert, attachmentStyle
}
```

**State-oppdatering:**
```typescript
const [data, setData] = useState<ProfileData>(() => ({ ...initialData, ...loadDraft() }));
const setField = (field: string, value: unknown) => {
  setData((prev) => ({ ...prev, [field]: value }));
};
```

**Autosave (debounce 400ms):**
```typescript
useEffect(() => {
  if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  setShowSaving(true);
  saveTimerRef.current = setTimeout(() => {
    saveDraft(data); // localStorage.setItem('tosom_onboarding_draft', JSON.stringify(data))
    setShowSaving(false);
  }, 400);
  return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
}, [data]);
```

**Draft-loading:**
```typescript
function loadDraft(): Partial<ProfileData> {
  const raw = localStorage.getItem('tosom_onboarding_draft');
  return raw ? JSON.parse(raw) : {};
}
```

### Data-flyt (UI → API → DB)

```
[Steg-komponent]
      ↓ (setField onChange)
[ProfileData state + autosave to localStorage]
      ↓ (onSubmit / handleStartReisen)
[POST /api/profile/setup]
      ↓ (JSON payload med basic + personlighet + livssituasjon + etc.)
[prisma.profile.upsert + prisma.user.update]
      ↓ (userId returnert)
[POST /api/match { userId }]
      ↓ (resonance-matching kjørt)
[Redirect til /dashboard eller /matching?userId=xxx]
```

---

## 7. UX-OVERSIKT

### Tekstlig tone

| Eigenskap | Verdi |
|-----------|-------|
| Språk | Bokmål (Noreg) |
| Tone | Varm, roleg, trygg, moden |
| Personvern | "Svarene dine blir kun brukt til å bygge profilen din" |
| Guiding | Steg-spesifikk tekst med empatisk tone |
| Feilmeldingar | Klare, vennlege, ikkje-dømande |

**Eksempel på guiding-tekstar:**
- Steg 0: "Dette er starten på reisen din. Vi holder det enkelt."
- Steg 1: "Personligheten din er det som gjer deg til deg."
- Steg 2: "Livssituasjonen din gir oss en viktig oversikt over hverdagen din."
- Steg 3: "Tilknytningsmønsteret ditt seier mye om hvordan du møter andre mennesker."
- Steg 11: "Du har nesten kommet helt til ende. Se over det du har delt."
- Steg 12: "Nå er det bare å trykke på «Start reisen» så finn vi din match."

---

### Microcopy

| Element | Mikro-copy | Farge |
|---------|------------|-------|
| Progress | "Fortsett i ditt eget tempo." | rgba(255,255,255,0.3) |
| Trust-text | "Svarene dine brukes kun til å bygge profilen din og finne en god match." | rgba(255,255,255,0.35) |
| Autosave | "Sparar..." (spinner) | rgba(212,175,55,0.6) |
| Required-felt | "*" markert ved label | - |
| Example-text | Placeholder med exempel-verdiar | rgba(255,255,255,0.4) |

---

### Fargebruk

| Element | Farge | Bruk |
|---------|-------|------|
| Primær bakgrunn | `#0B1520` (ToSom Blue) | Heile sidan |
| Sekundær bakgrunn | `rgba(255,255,255,0.05)` (glassmorphism) | Card-bakgrunn |
| Gull-aksent | `#D4AF37` (Nordic Gold) | Knappar, headings, focus |
| Gull-hover | `#E8C766` | Knapp-hover gradient |
| Tekst primary | `#FFFFFF` | Overskrifter |
| Tekst secondary | `rgba(255,255,255,0.7)` | Body-tekst |
| Tekst muted | `rgba(255,255,255,0.35)` | Microcopy/trust-text |
| Error | `#FF4D4D` / `rgba(255,77,77,0.08)` | Feilmeldingar |

---

### Typografi-hierarki

| Element | Storleik | Farge | Vekt |
|---------|----------|-------|------|
| Seksjonstittel | 20px (text-[20px]) | #D4AF37 | medium (500) |
| Steg-tittel | 28–32px (text-xl/md:text-2xl) | #FFFFFF | light (300) |
| Guiding-text | 16px (text-base) | rgba(255,255,255,0.7) | regular (400) |
| Label | 14px (text-sm) | rgba(255,255,255,0.7) | medium (500) |
| Microcopy | 12px (text-xs) | rgba(255,255,255,0.3–0.35) | regular (400) |
| Error-text | 14px (text-sm) | #FF4D4D | medium (500) |

---

### Spacing-system

| Kontekst | Margin/Padding | CSS-class |
|----------|----------------|-----------|
| Steg-container | py-10 px-6 | `py-10 px-6` |
| Seksjon-mellomrom | space-y-8 / space-y-10 | Tailwind gap |
| Seksjon-indre | p-6, space-y-6 | Glass-card innside |
| Layout-padding | py-12 px-4 md:px-8 | OnboardingLayout |

---

### Radius-system

| Element | Radius | CSS |
|---------|--------|-----|
| Glass-cards | 20px | `rounded-[20px]` |
| Input-felt | default (Tailwind) | - |
| PremiumButton | 16px (rounded-2xl) | `rounded-2xl` |
| Error-box | 12px | `rounded-xl` |

---

### Shadow-system

| Element | Shadow | Bruk |
|---------|--------|------|
| Glass-card | `0 8px 40px rgba(0,0,0,0.35), inset 0 0 20px rgba(255,255,255,0.03)` | OnboardingLayout card |
| PremiumButton (normal) | `0 4px 20px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,255,255,0.2)` | Gull-gradient knappe |
| PremiumButton (hover) | `0 8px 40px rgba(212,175,55,0.35), inset 0 1px 0 rgba(255,255,255,0.2)` | Knapp-hover |

---

### Premium-element

1. **Glassmorphism** — `backdrop-filter: blur(20px)` + `bg: rgba(255,255,255,0.05)`
2. **Spotlight-overlay** — `absolute inset-0 bg-white/5 blur-3xl opacity-[0.06]`
3. **Gull-gradient knappar** med hover-shadow-increment
4. **Fade-in animasjonar** — step transitions med `animation: fadeIn 0.3s ease-out`
5. **Autosave-indikator** — gull-spinner + "Sparar..." tekst
6. **Subtil border-highlight** — `border: 1px solid rgba(255,255,255,0.1)`

---

### Styrkar i guiding

- ✅ **Steg-spesifikke guidings-textar** som set kontekst for kvart stege
- ✅ **Varm tone** som kjenneteikner ToSom sin identitet
- ✅ **Ro og trygghet** kommunisert gjennom text ("fortsett i ditt eget tempo")
- ✅ **Privacy-fokus** med trust-text nederst på kvar side

### Svakheter i guiding

- ⚠️ **Inga visuell progresjon-indikasjon** på kvart stege-side (berre progressbar øvst)
- ⚠️ **Inga mikroguiding** inside kvart felt (kva er forventet svaret?)
- ⚠️ **Inga kontekstuelle tips** som kan hjelpe usikre brukarar
- ⚠️ **Inga "hopp over"-moglegheit** på obligatoriske felter

---

## 8. DESIGN-SYSTEMET

### Design Tokens (`config/design-tokens.ts`)

| Token | Verdier |
|-------|---------|
| **Farger** | bg: `#0B1520`, `#121E2E`; gold: `#D4AF37`, `#E8C766`; text primary/secondary/muted/subtle |
| **Radius** | xs:4, sm:8, md:12, lg:16, xl:20, 2xl:24, 3xl:32, full:9999 |
| **Shadow** | none, sm, md, lg (0 4px 20px rgba(0,0,0,0.3)), xl (0 8px 32px rgba(0,0,0,0.35)), gold/gold-lg/blue |
| **Spacing** | xs:4, sm:8, md:16, lg:24, xl:32, 2xl:48, 3xl:64, 4xl:80, 5xl:96, 6xl:120 |
| **Blur** | none, sm:4px, md:8px, lg:12px, xl:16px, 2xl:24px, 3xl:32px |
| **Typography** | font: Inter (primary), Playfair Display (secondary); fontSize: xs:12 → hero:60; fontWeight: light(300) → extrabold(800) |

### Glass Variant Helper

```typescript
glassVariant('default' | 'gold' | 'blue', 'soft' | 'medium' | 'strong')
→ { background, backdropFilter: 'blur(12px)', border, borderRadius: '20px', boxShadow }
```

---

## 9. STYRKER OG SvakHEITER

### Styrkar (noverande system)

| Kategori | Styrke | Merknad |
|----------|--------|---------|
| **Struktur** | 13-stegs med tydelege faser | Identitet → Personlighet → Relasjon |
| **Autosave** | localStorage + debounce (400ms) | Uten dataprosessering ved nettverksbrudd |
| **Validering** | Klient-side på alle felt | Minste-teikn-grenser for tekstfelt |
| **Design** | Premium glassmorphism | Konsistent med ToSom-designet |
| **Navigasjon** | Back/Next med fade-transitions | Smooth UX mellom stega |
| **API-struktur** | Éin POST /api/profile/setup som mottar heile payload | Efficient (berre 1 nettverkskall) |
| **Database-mapping** | Alle felt mappar til Profile-modellen sin JSON-felt | Flexibel skjema for framtida |

### Svakheter

| Kategori | Svakeleik | Påverknad |
|----------|-----------|-----------|
| **UX** | 13 steg kan opplevast som lang | Brukarar kan gje opp tidleg |
| **Validering** | Berre klient-side (ingen Zod på setup/) | Ingen backup-validering ved client-side failure |
| **Guiding** | Inga mikroguiding per felt | Brukarar er usikre på kva dei skal skrive |
| **Progress** | Ingen visuell progresjon per steg | "Kor mykje att?"-spørsmålet |
| **Live vs lokal** | Kan ikkje verifisere live-versjonen (ingen skjermbilde) | Manglande kvalitetskontroll |
| **Responsive** | Nokre komponentar har fixed-width layout | Mobile kan ha issue med breidd |

---

## 10. FORSLAG TIL FORBEDRING

### Høg prioritet (kritisk for UX)

1. **Legg til mikroguiding per felt** — Kva er forventet svar? (eks: "Kalla du deg kalla Sofia, Jonas eller Lia")
2. **Validering i backend** — Legg Zod-validering på `/api/profile/setup` med alle 70+ felt
3. **Progresjons-indikasjon per steg** — Kor mange felt er utfylte? ("4/6 felt utfylte")
4. **Skip-moglegheit** for valgfrie felter (livsstil-preferanse)

### Medium prioritet (konsistens)

5. **Standardiser textarea-min-størrelse** — Nokre har 10 teikn, nokre har 5, nokre har ingen min-grense
6. **Responsive-layout-test** — Test breidd på mobil (<375px width)
7. **Error-message konsistens** — Nokor feilmeldingar er korte, andre lange

### Lav prioritet (premium-polish)

8. **Legg til animasjonar** for nye felt som dukkar opp (fade-in)
9. **Tooltip-hjelp** for komplekse felt (kva betyr "moden nysgjerrighet"?)
10. **Prefill-moglegheit** frå eksisterande profil (for tilbakekjømande brukarar)

---

## 11. BLUEPRINT FOR FORSKNINGSBASERT ONBOARDING

### Overordna struktur (13 steg → 3 hovudfaser)

```
FASE 1 — IDENTITET (Kven er du?)
├── Steg 1: Navn + alder + kjønn + bosted (Sociaal identitet)
├── Steg 2: Livssituasjon (Hverdagsliv, jobb, studium)
└── Steg 3: Kroppstype + stil + energi (Slideshow-side)

FASE 2 — PERSONLIGHET (Korleis er du?)
├── Steg 4: Personlighetstrekk (kortform av Big Five / BFI-10)
├── Steg 5: Verdier (PVQ-10)
├── Steg 6: Livsstil (søvn, sosialt, tempo)
└── Steg 7: Interesser (valg-side, ikkje blandet)

FASE 3 — RELASJON (Kven søker du?)
├── Steg 8: Relasjonspreferanser (tempo, dybde, kommunikasjon)
├── Steg 9: Grenser (korleis ser du på grenser?)
├── Steg 10: Moden nysgjerrighet (refleksjonsspørrsmål)
├── Steg 11: Oppsummering (premium, rolig, trygg)
└── Steg 12: Fullfør onboarding (CTA → matching)
```

### Designsystem (130% zoom, premium, konsistent)

| Element | Verdier |
|---------|---------|
| **Spacing** | Base: 32–48px; Mobil: 24–32px; Desktop: 48–64px |
| **Radius** | Alle kort: 20px; Alle knappar: 16px; Alle inputfelt: 16px |
| **Shadow** | Premium: `0 8px 32px rgba(0,0,0,0.25)` |
| **Farger** | ToSom Blue (#0B1520), Nordic Gold (#D4AF37/CTA), Soft White (#FFFFFF/tekst), Deep Grey (rgba(255,255,255,0.65)/sekundær) |
| **Typografi** | Overskrift: 36–42px; Seksjonstittel: 24–28px; Brødtekst: 18–20px; Microcopy: 16px |

### Interaksjonsreglar

- ✅ Alle slides på éin side
- ✅ Alle val på éin side
- ✅ Alle tekstfelt på éin side
- ❌ Ingen blanding av typar
- ❌ Ingen fragmentering
- ❌ Ingen "ikke oppgitt"-felt
- Alt skal vere roleg, stort, premium

### Forskningsbaserte tema + spørrsmål

#### Fase 1 — Identitet

**Steg 1: Navn + alder + kjønn**
- Tema: Sosial identitet
- Forskning: Trygghet + enkel start
- Guiding: "Dette er starten på reisen din. Vi holder det enkelt."

**Steg 2: Bosted + radius**
- Tema: Geografi + tilgjengelighet
- Guiding: "Du kan endre dette når som helst."

**Steg 3: Livssituasjon**
- Tema: Hverdagsliv
- Guiding: "Dette hjelper oss å matche deg med noen som passer din rytme."

#### Fase 2 — Personlighet

**Steg 4: Personlighetstrekk (kortform av Big Five / BFI-10)**
- Tema: Psykologisk profil
- Forskning: Big Five er forskningsbasert for personlegdom-matching (kortforma BFI-10)
- Guiding: "Dette er forskningsbasert. Ta det rolig."

**Steg 5: Verdier (3–5 kjerneverdier)**
- Tema: Kjerneverdier
- Guiding: "Verdier er det som holder relasjoner sammen."

**Steg 6: Livsstil**
- Tema: Hverdagsmønster
- Guiding: "Dette hjelper oss å matche deg med noen som passer din rytme."

**Steg 7: Interesser (valg-side)**
- Tema: Felles grunnlag
- Guiding: "Interesser skaper naturlige møter."

#### Fase 3 — Relasjon

**Steg 8: Relasjonspreferanser**
- Tema: Kven du søker
- Guiding: "Dette er ikke krav — det er preferanser."

**Steg 9: Grenser**
- Tema: Trygghet
- Guiding: "Grenser skaper trygghet."

**Steg 10: Moden nysgjerrighet (refleksjon)**
- Tema: Korleis ser du på nærheit?
- Guiding: "Dette er eit roleg øyeblikk for deg."

**Steg 11: Oppsummering (premium, rolig, trygg)**
- Tema: Oversikt over alt du har delt
- Guiding: "Du kan endre alt senere."

**Steg 12: Fullfør onboarding (CTA)**
- Tema: Overgang til ToSom-plattformen
- CTA: "Start reisen din"

---

## AKT-BYGGING (EFTER GODKJENNING)

### Fase A: Dokumentasjon (no — PLAN MODE)
- ✅ Denne dokumentasjonen er fullført
- ✅ Allereie kartlagt: alle 13 steg, API-ruter, database-mapping, UX, design-system

### Fase B: ACT-bygging (etter toggle til ACT mode)
1. Bygg komponentbibliotek for onboarding (radius, spacing, typografi, shadow)
2. Oppdater kvart steg med mikroguiding + progresjon-indikasjon per felt
3. Legg til backend-validering på `/api/profile/setup` med Zod
4. Lag ny layout med 32–48px spacing og premium design (130% zoom)
5. Bygg slideshow-side for livsstil/valg-felt
6. Oppdater oppsummering med roleg, stor, trygg visning
7. Fullfør alle endringar med validasjon mot denne rapporten

---

# SLUTT PÅ ONBOARDING-SYSTEM-OVERVIEW