# TO SOM v2 — Kjernearkitektur-spesifikasjon

*Dato: 11. juli 2026 | Versjon: 2.0*

---

## 📐 OVERBLICK

ToSom v2 er en konsolidert, enkelt-domenearkitektur der **kvart domene har ETT aktivt system**.
All duplikat, legacy og broken-kode er fjerna. Systemet bygger på ToSom sin grunnleggjande filosofi:

> Éi match. Éin reise. Éin relasjon. — Ingen swiping, ingen feed, ingen jag.

---

## 🗂️ DOMENE-OVERSIKT

### 1. ONBOARDING — Privat profilbygging

| Kategori | Fil(er) |
|----------|---------|
| **Kjernefil** | `app/onboarding/OnboardingFlow.tsx` |
| **Layout** | `app/onboarding/layout.tsx`, `app/onboarding/OnboardingLayout.tsx` |
| **Visning** | `app/onboarding/OnboardingView.tsx` |
| **Inngang** | `app/onboarding/page.tsx` |
| **Steg-komponentar (13)** | `steps/Step1ProfileAndMatching.tsx` through `steps/Step9Oppsummering.tsx`, `steps/Step10StartReisen.tsx` |
| **Form-felt** | `components/InputField.tsx`, `SelectField.tsx`, `SliderField.tsx`, `TextAreaField.tsx` |
| **UI-komponentar** | `components/onboarding/BackButton.tsx`, `PremiumButton.tsx`, `StepProgressBar.tsx` |

**Flow:**
```
/app/onboarding → OnboardingFlow (13 steg) → handleStartReisen()
  ├── POST /api/profile/setup    (lagrer heile profilen)
  └── POST /api/match             (spør om éi match)
      └── Redirect → /matching?userId=xxx
```

**Stegoversikt:**
| Steg | Namn | Formål |
|-----|------|--------|
| 0 | Grunnprofil | Navn, alder, kjønn, søk |
| 1 | Personlighet | Energie, drivkraft, stress |
| 2 | Livssituasjon | Arbeid, bosted, ansvar |
| 3 | Tilknytning | Trygghetsbehov, utløysar |
| 4 | Kjærleiksspråk | Hva viser/mottar kjærlighet |
| 5 | Livsstil & verdier | Prioritetar, preferansar |
| 5b | Relasjonsstil | Korleie søker relasjon |
| 6 | Framtid & visjon | Mål, drømmar |
| 7 | Humor & personlighet | Det som gjer en unik |
| 8 | Grenser & behov | Hva er ikke negotierbart |
| 8b | Moden nysgjerrighet | Intimitet, trygghet |
| 9 | Oppsummering | Se over det delte |
| 12 | Start reisen | CTA → profil + match |

---

### 2. MATCHING — Éi resonans-match per 24t

| Kategori | Fil(er) |
|----------|---------|
| **Kjernefil** | `app/matching/page.tsx` |
| **Detailside** | `app/matching/[id]/page.tsx` |
| **Matchscore-logikk** | `app/matching/MatchScore.ts` |
| **Matchtype-klassifisering** | `app/matching/MatchType.ts` |
| **Forklaringar** | `app/matching/MatchExplanation.ts` |
| **API** | `GET /api/match`, `POST /api/match/accept` |
| **UI-komponentar** | `components/match/MatchCard.tsx`, `MatchBreakdown.tsx`, `MatchBreakdownItem.tsx` |

**Flow:**
```
POST /api/profile/setup (onboarding fullført)
  → POST /api/match { userId }
      → Returnerer éi match med resonans-score
  → Redirect → /matching?userId=xxx
      → Viser MatchCard + MatchExplanation
  → Klikk "Aksepter" → POST /api/match/accept
      → Låser bruker i 30 dager
      → Opnar conversation
  → Redirect → /dashboard (eller direkte til chat)
```

**Matchscore-klassifisering:**
| Score | Type | Merk |
|-------|------|------|
| ≥85 | high_emotional | Djup emosjonell kompatibilitet |
| ≥75 | stable_secure | Stabil og trygg |
| ≥65 | potential_growth | Vekst-potensiale |
| ≥50 | challenging_exciting | Utfordrande men spennande |
| <50 | friendship_recommended | Venner anbefalt |

---

### 3. DASHBOARD — Rolig oversikt

| Kategori | Fil(er) |
|----------|---------|
| **Kjernefil** | `app/dashboard/page.tsx` |
| **_components/** | `_components/ConversationCard.tsx`, `InsightSection.tsx`, `ProfileStatusSection.tsx` |
| **Dashboard komponentar** | `components/dashboard/DashboardMatchBanner.tsx`, `DashboardMatchStatus.tsx`, `DashboardSkeleton.tsx` |
| **Data-henting** | `lib/dashboard/data.ts` (Prisma-spørjingar) |

**Inneholder:**
- Velkomst med personleg greeting ("God dag/dag/natt, [navn]")
- Aktiv match-banner (Resonans-score + partner-info)
- Samtalekort for aktiv chat
- Innsiktsseksjon med daglege refleksjoner
- Profilstatus (fullført/incomplett)

---

### 4. JOURNEY — Guidet 30-dagers reise

| Kategori | Fil(er) |
|----------|---------|
| **Kjernefil** | `app/journey/page.tsx` |
| **Komponentar** | `app/journey/components/JourneyProgress.tsx`, `EmptyJourneyState.tsx` |
| **Reisetema-komponentar** | `components/conversation/JourneyTimeline.tsx`, `ContinueChoice.tsx`, `MessageBubble.tsx`, `SystemMessage.tsx`, `TypingIndicator.tsx` |
| **Marketing-side** | `app/reisen/page.tsx` |
| **API-ruter** | `GET /api/journey/today`, `GET /api/journey/progress`, `POST /api/journey/reflection` |

**Faser:**
| Fase | Dager | Merk |
|------|-------|------|
| Fase 1 | 1-14 | Bygger trygghet uten bilder |
| Fase 2 | 15-30 | Guided samtaler med resonansmåling |

**Dagleg innehåll:**
- Tema/refleksjonsspørsmål
- Samtale-prompt (for chat)
- Oppgåve/aktivitet for paret
- Resonansmåling (følelsesmessig nærhet)
- Progresjon (dag X av 30)

---

### 5. CHAT — Guidet samtale for to

| Kategori | Fil(er) |
|----------|---------|
| **Kjernefil** | `app/chat/[id]/page.tsx` |
| **Layout** | `app/chat/layout.tsx` |
| **Spørsmål-modal** | `app/chat/components/QuestionModal.tsx` |
| **ChatRoom komponent** | `components/chat/ChatRoom.tsx` (HOVED — messages, input, guided questions) |
| **Under-komponentar** | `ChatMessages.tsx`, `ChatInput.tsx`, `ChatHeader.tsx`, `ChatBubble.tsx`, `PremiumMessageBubble.tsx`, `PremiumMessageList.tsx`, `PremiumTypingIndicator.tsx` |

**Flow:**
```
MATCH akseptert
  → Conversation oppretta (Prisma)
  → Redirect → /chat/[conversationId]
      → ChatRoom med:
          ├── PartnerPresenceBar (online/active-status)
          ├── AtmosphereLayer (mood-basert UI)
          ├── Guidede spørsmål (kategori-baserte prompts)
          └── WarmFlow (fargend bakgrunn basert på samtalestemning)
```

**Chat-faser:**
| Fase | Merk |
|------|------|
| EARLY | Bygger grunnleggjande trygghet |
| BUILDING_TRUST | Dypere spørsmål |
| DEEPER | Sårbarhet og intensjon |
| CHECKIN | Resonans-refleksjon |

---

### 6. ADMIN — Administrasjon og oversikt

| Kategori | Fil(er) |
|----------|---------|
| **Kjernefil** | `app/admin/page.tsx` (med sanne Prisma-data) |
| **Layout** | `app/admin/layout.tsx` (sidebar med 6 seksjonar) |
| **Innlogging** | `app/admin/login/page.tsx` |
| **Matches** | `app/admin/matches/page.tsx` |
| **Auth API** | `/api/admin/auth/*` |
| **Data-henting** | `lib/admin/data.ts`, `lib/admin/conversation.ts` |

**Admin seksjonar:**
- Oversikt (dashboard stats)
- Brukere
- Matching
- Reise & Samtale
- System
- Verktøy

---

## 🚫 SLETTEDE SYSTEM (ikke lenger del av kjernen)

### Onboarding Legacy
```
app/onboarding/1/ through app/onboarding/5/  — Gamle dedicate steg-sider
```

### Chat BROKEN/DUPLIKAT
```
app/chat/page.tsx              — BROKEN (manglende API)
components/chat/ChatWindow.tsx — LEGACY (erstatta av ChatRoom)
components/chat/ChatList.tsx   — LEGACY (er i dashboard)
app/api/chat/                  — Tom mappe (ingen API-ruter eksisterer)
```

### Conversation DUPLIKAT
```
app/conversation/              — FULL duplikat av chat-systemet
app/api/conversation/          — FULL duplikat API
```

### Admin DUPLIKAT
```
app/admin/dashboard/page.tsx   — Duplikat med mock data (erstatta av admin/page.tsx)
```

---

## 🔌 Kjerne-API-ruter

| Rute | Metode | Formål |
|------|--------|--------|
| `/api/profile/setup` | POST | Lagre heile onboarding-profilen |
| `/api/match` | POST/GET | Hent/spor éi match for bruker |
| `/api/match/accept` | POST | Aksepter match → lås i 30 dager |
| `/api/journey/today` | GET | Hent dagens journey-innhold |
| `/api/journey/progress` | GET | Hent heil progresjon for aktiv reise |
| `/api/journey/reflection` | POST | Lagre dagleg refleksjon |
| `/api/admin/auth/*` | Various | Admin-innlogging og autorisasjon |

---

## 🔄 Brukarreise (TO SOM v2)

```
/start
  │
  ▼
/onboarding ───────▶ Privat profilbygging (13 steg)
  │                    Autolagre mellom steg
  │                    Ingen fake data
  │
  ▼
POST /api/profile/setup
  │
  ▼
POST /api/match { userId }
  │
  ▼
/matching ───────▶ Vis éi match (fra AI-backend)
  │                    Match forklaring + resonans
  │
  ▼
Aksepter → POST /api/match/accept → Lås i 30 dager
  │
  ▼
/dashboard ───────▶ Rolig oversikt over relasjon
  │                    Match-status, reise-progres
  │
  ▼
/journey ───────▶ Dagleg tema + refleksjon + oppgåve
  │                    Resonansmåling
  │
  ▼
/chat/[id] ───────▶ Guidet samtale med partner
  │                    WarmFlow UI basert på mood
  │
  ▼
/30-dager ├── Fortset → /chat (vidare)
          ├── Avslut → /dashboard → ny match
```

---

## 🎨 Visuell identitet (Norsk Gul + ToSom Blå)

| Element | Farge/Verdi |
|---------|-------------|
| Primary BG | `#0A1A2A` (ToSom Blue) |
| Secondary BG | `#0F2233` |
| Gold Accent | `#D4AF37` |
| Glass Surface | `rgba(255, 255, 255, 0.04)` + blur(12px) |
| Font | Inter (system fallback) |
| Button Radius | 12px |
| Card Radius | 20px |
| Animasjonar | Slow fade, ease-out — aldri flashy |

---

## 📦 Pakkeoversikt

```
tosom/
├── app/
│   ├── onboarding/          ← Privat profilbygging (13 steg)
│   │   ├── OnboardingFlow.tsx   [KJERNE]
│   │   ├── OnboardingLayout.tsx
│   │   ├── steps/               [13 steg-komponentar]
│   │   └── components/          [Form-felt]
│   ├── matching/            ← Éi resonans-match
│   │   ├── page.tsx             [KJERNE]
│   │   ├── [id]/page.tsx        [KJERNE]
│   │   ├── MatchScore.ts          [KJERNE]
│   │   ├── MatchType.ts           [KJERNE]
│   │   └── MatchExplanation.ts    [KJERNE]
│   ├── dashboard/         ← Rolig oversikt
│   │   ├── page.tsx             [KJERNE]
│   │   └── _components/           [3 komponentar]
│   ├── journey/           ← 30-dagers reise
│   │   ├── page.tsx             [KJERNE]
│   │   └── components/            [2 komponentar]
│   ├── chat/              ← Guidet samtale
│   │   ├── layout.tsx               [KJERNE]
│   │   ├── [id]/page.tsx            [KJERNE]
│   │   └── components/              [QuestionModal]
│   ├── admin/             ← Admin-panel
│   │   ├── page.tsx                 [KJERNE]
│   │   ├── layout.tsx               [KJERNE]
│   │   ├── login/page.tsx           [KJERNE]
│   │   └── matches/page.tsx         [AKTIV]
│   ├── api/
│   │   ├── match/                   [KJERNE API-ruter]
│   │   ├── profile/setup/           [KJERNE API-rute]
│   │   ├── journey/                 [KJERNE API-ruter]
│   │   └── admin/                   [Admin API-ruter]
├── components/
│   ├── chat/                    [ChatRoom + under-komponentar]
│   ├── dashboard/               [Dashboard komponentar]
│   ├── journey/                 [Journey UI-komponentar]
│   ├── onboarding/              [Onboarding UI-komponentar]
│   └── match/                   [MatchCard + Breakdown]
├── lib/
│   ├── admin/               [Admin data-henting]
│   ├── dashboard/           [Dashboard data-henting]
│   └── prisma.ts            [Database-tilgang]
└── docs/
    └── TO-SOM-CORE-ARCHITECTURE.md  [Denne fila!]
```

---

## 🚫 FORBUDDE MØNSTRE (ikke tillatne)

- ❌ Swipe-logikk eller uendelege profiler
- ❌ Feed / "finn flest mulig" -økonomi
- ❌ Gamification-poeng eller badges
- ❌ AI-genererte meldinger (bare guidede spørsmål)
- ❌ Multiple aktive matcher
- ❌ Direkte bilde-dele i fase 1 (før dag 14)
- ❌ Mock data i produksjon
- ❌ Duplikat-system eller API-ruter

---

*Denne spesifikasjonen utgjer kjernen av ToSom v2. Alle utviklarar og AI-agenter skal følgje denne arkitekturen.*