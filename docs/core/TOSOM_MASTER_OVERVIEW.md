# ToSom — Master Oversikt (v2026)

Denne filen gir en komplett oversikt over ToSom-plattformen slik den er i dag.  
Les denne filen først før dudykker inn i underliggende dokumenter.

---

## 1. HVA ER TOSOM

ToSom er en rolig, privat og forskningsbasert relasjonsplattform for voksne (23+).  
Plattformen hjelper to mennesker å møtes på en trygg, moden og strukturert måte — uten støy, uten jag, uten overflate.

### Kjerneverdi
- Én match per 24 timer
- En guidet 30-dagers reise mellom to personer
- Privat profil som aldri er offentlig
- Resonans-basert matching, ikke overflate

### Hva ToSom er
- privat · forskningsbasert · moden · rolig · high-tech · premium
- uten støy · uten press · uten swipe

### Hva ToSom ikke er
- en dating-app · en feed · en markedsplass · en konkurranse · en like-økonomi

---

## 2. TEKNISK STACK

| Lag | Teknologi |
|-----|-----------|
| **Rammeverk** | Next.js 15 (App Router), React 18 |
| **Språk** | TypeScript |
| **Stil** | Tailwind CSS v4, glassmorphism |
| **Database** | PostgreSQL + Prisma v5 |
| **Auth** | NextAuth v5, Vipps OAuth, Magic Link, Phone Verification |
| **Realtime** | Pusher + pusher-js |
| **Bilder** | Uploadthing |
| **Betaling** | Stripe |
| **Analysere** | Chart.js + framer-motion |
| **Validering** | Zod v4 |
| **Testing** | Playwright (E2E) |
| **Hosting** | Vercel (CI/CD via vercel.json) |

---

## 3. PROSJEKTSTRUKTUR

```
/tosom
├── ai/                        # AI-agent system_prompt + minne
├── app/                       # Next.js App Router (sider + API)
│   ├── (auth)/               # Auth-sider (login, register, etc.)
│   ├── (landing)/            # Landingssider (hvorfor, slik, reisen, etc.)
│   ├── admin/                # Admin-panel UI
│   ├── api/                  # API-ruter (~80 endepunkter)
│   ├── chat/                 # Chat-side
│   ├── dashboard/            # Dashboard
│   ├── onboarding/           # Onboarding-sider
│   ├── profile/              # Profil-sider
│   ├── reisen/               # Journey-side
│   └── ...                   # Flere sider (betaling, priser, kontakt, etc.)
├── components/               # React-komponenter (43+ mapper)
├── config/                   # Konfigurasjonsfiler
├── docs/                     # Dokumentasjon
│   ├── core/                 # ← Offisiell master-dokumentasjon
│   ├── archive/              ← Arkiverte/duplikat-dokumenter
│   └── system/               ← Auto-genererte system-rapporter
├── hooks/                    # Custom React hooks
├── lib/                      # Biblioteker (matching, journey, chat, etc.)
├── pages/                    # Legacy Pages Router (skal fjernes)
├── prisma/                   # Database schema + migrations
├── providers/                # React context providers
├── public/                   # Statische filer
├── scripts/                  # Hjelpe-scripter
├── styles/                   # Globale stiler
├── test/                     # E2E- og unit tester
├── types/                    # TypeScript type-definisjoner
└── utils/                    # Hjelp funksjoner
```

---

## 4. DATABASE-OVERSIKT (26 modeller)

### Kjerne-modeller
| Modell | Formål |
|--------|--------|
| **User** | Brukere, rolle, onboarding-status, verifikasjon |
| **Profile** | Dyp profil (verdier, livssituasjon, personlighet, etc.) |
| **Match** | Resonans-match mellom to brukere |
| **Conversation** | Privat samtalerom mellom matchede par |
| **Message** | Enkelte meldinger i en conversation |
| **JourneyProgress** | 30-dagers reise progresjon per bruker |
| **JourneyMilestone** | Milepæler i reisen |
| **ResonanceSession** | Resonansmålinger per samtale+dag |
| **JourneyDayContent** | Daglige temaer/spørsmål/oppgaver |
| **QuestionCategory** | Guidede spørsmål-kategorier (Trygghet, Verdier, etc.) |
| **GuidedQuestion** | Enkelte guidede spørsmål |

### Administrasjons-modeller
| Modell | Formål |
|--------|--------|
| **Notification** | Brukernotifikasjoner |
| **AuditLog** | Admin-handlinger logget |
| **SystemLog** | System-logging (info, warn, error, debug) |
| **PerformanceMetric** | Routelatens og db-latens |

### Auth-modeller
| Modell | Formål |
|--------|--------|
| **Account** | OAuth-kontoer (Vipps, etc.) |
| **Session** | Aktive sessioner |
| **VerificationToken** | E-post verifikasjonstokens |
| **PasswordResetToken** | Passord-tilbakestillings-tokens |
| **MagicLinkToken** | Magic link tokens |
| **PhoneVerification** | Telefonverifikasjon |
| **TwoFactorSecret** | 2FA backup-koder |

### AI-modeller
| Modell | Formål |
|--------|--------|
| **AIRequestLog** | AI-anrop logget (feature, model, tokens, latency) |
| **MatchInsight** | AI-generert innsikt per match |

### Fjernede modeller (2026-08-02)
- ~~**MatchFeedback**~~ — fjerna 2026-08-02, ingen referanser i kodebase
- ~~**MatchHistory**~~ — fjerna 2026-08-02, ingen referanser i kodebase
- ~~**MatchQueue**~~ — fjerna 2026-08-02, ingen referanser i kodebase
- ~~**QueueStatus**~~ — enum fjerna sammen med MatchQueue

---

## 5. API-OVERSIKT (utvalg)

### Auth
- `POST /api/auth/magic-link` — Send magic link
- `POST /api/auth/magic-link/verify` — Verifiser magic link
- `POST /api/auth/vipps/authorize` — Start Vipps login
- `POST /api/auth/vipps/callback` — Vipps callback
- `POST /api/auth/phone/send` — Send SMS kode
- `POST /api/auth/phone/verify` — Verifiser telefon

### Onboarding
- `POST /api/onboarding/save` — Lagre onboarding-data
- `GET /api/onboarding/progress` — Hent progresjon
- `POST /api/onboarding/complete` — Fullfør onboarding

### Matching
- `GET /api/match` — Hent aktive/pending matcher
- `POST /api/match/accept` — Aksepter match
- `GET /api/match/check` — Sjekk match-status
- `GET /api/matching/route` — Cron-jobb for matching

### Journey
- `GET /api/journey/today` — Dagens journey-innhold
- `POST /api/journey/progress/advance` — Neste dag
- `POST /api/journey/reflect` — Refleksjon
- `GET /api/journey/resonance` — Resonansmåling

### Chat
- `GET /api/chat/messages` — Hent meldinger
- `POST /api/chat/send` — Send melding
- `GET /api/conversation/create` — Opprett conversation

### Admin
- `GET /api/admin/users` — Liste brukere
- `PATCH /api/admin/users/[id]` — Oppdater bruker
- `GET /api/admin/stats` — System-statistikk
- `POST /api/admin/journey/[id]/reset` — Reset journey

---

## 6. SUBSYSTEMER

| System | Beskrivelse | Status |
|--------|-------------|--------|
| **Auth** | Vipps OAuth, Magic Link, Phone Verification, 2FA, passord-tilbakestilling | Ferdig |
| **Onboarding** | 9-stegs dyp profilbygging | Ferdig (noen UI-feil kan finnes) |
| **Matching** | Cron-jobb, resonans-algoritme, accept/decline flow | Ferdig |
| **Journey** | 30-dagers reise med daglige temaer, refleksjoner, oppgaver | Delvis (skal valideres) |
| **Chat** | Realtime-meldinger via Pusher, guidede spørsmål, bilde-share etter 14d | Ferdig |
| **AI** | Journey guidance, match insights, message suggestions, profile rewrite | Ferdig |
| **Admin** | Brukermoderasjon, systemoversikt, journey-admin, logging | Ferdig |
| **Payment** | Stripe checkout + webhook | Ferdig |
| **System** | Health check, latency tracking, observability | Delvis |

---

## 7. IDENTIFISERTE PROBLEMER

### Kritisk
1. **Legacy `pages/` mappe med ~80+ filer** — Både App Router og Pages Router eksisterer samtidig. API-ruter i `pages/api/` må flyttes eller slettes.
2. **Blueprint vs Schema-mismatch** — `tosom-blueprint.md` definerer annen Journey-struktur enn det faktiske Prisma schema.

### Løste problem (2026-08-02)
✅ Deprecated modeller fjerna: MatchFeedback, MatchHistory, MatchQueue + QueueStatus enum — ingen referanser i kodebase. Prisma generate suksessfull.

### Viktig
4. **Dobbelte opp-ruter** — Flere steder håndterer samme logikk (f.eks. conversation/create + chat/send).
5. **Journey validasjon mangler** — Schema har `day` felt uten CHECK constraint for 1–30 grenser.
6. **~130 dokumenter i /docs/** — Mange duplikater, historiske fix-dokumenter og utdatert informasjon.

### Mindre
7. **Onboarding step numbering** — Noen referanser til steg 9-10 mens spec sier 9 steg.
8. **Config-filer spredt** — Matching config i både `config/matching.ts` og `lib/config/matching.ts`.

---

## 8. RESEPT FOR VIDERE ARBEID

1. Alltid les `/docs/core/TOSOM_MASTER_OVERVIEW.md` før nye oppgaver
2. Alltid les `/docs/core/TOSOM_DEVELOPMENT_PROTOCOL.md` for regler
3. Alltid les `/docs/core/TOSOM_ARCHITECTURE_MAP.md` for systemforståelse
4. Endre kun i tråd med PLAN → patch → validate → godkjenning

---

*Dette dokumentet oppdateres ved hver større endring i plattformen.*
*Versjon: 1.0 — Opprettet 2026-08-02*