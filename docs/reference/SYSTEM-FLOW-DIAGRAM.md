# ToSom — System Flow & Loop (Visuelt referanseverk)

**Dato:** 2026-08-30
**Status:** Referanse. Verifisert mot koden.
**Kilde:** `TOSOM-SUPER-MASTERPLAN-v2.0.md` (kanonisk) + kildekoden.

> Alle diagrammer er mermaid og renderes i GitHub / VS Code.
> Fil-referanser lar deg sjekke hvert steg mot koden.

---

## 1. Brukerreise — Tilstandsmaskin (journeyState)

Hver bruker har én `journeyState` til enhver tid. Overgangene er strengt styrt av server-side cron og API-ruter.

```mermaid
stateDiagram-v2
    [*] --> IDLE : Ny bruker (pålogging)

    IDLE --> QUEUED : POST /api/journey/queue\n(claimFreeQuota)

    QUEUED --> MATCHED : cron/matching (lør 02-04)\n(score + grødig kobling)

    QUEUED --> QUEUED : Ingen match denne runden\n(vent til neste lørdag)

    MATCHED --> ON_JOURNEY : Begge har åpnet dashboardet\n(dag 1 starter)

    ON_JOURNEY --> ON_JOURNEY : cron/journey (hver time)\nday+1, frem til dag 30

    ON_JOURNEY --> COMPLETED : Dag 30 fullført\n(JourneyStat + R2-sletting)

    COMPLETED --> IDLE : Bruker kan starte ny reise\n(vent til neste lørdag)

    QUEUED --> IDLE : Bruker melder seg ut av køen\n(DELETE /api/journey/queue)

    note right of QUEUED
        Maks 5 000 i kø (Quota.free_users)
        Advisory lock 123456789
    end note

    note right of MATCHED
        Én match. Én reise. Én relasjon.
        Ingen andre matches mens aktiv.
    end note

    note right of ON_JOURNEY
        4 faser:
        EARLY (1-7)
        BUILDING_TRUST (8-14)
        DEEPER (15-21)
        CHECKIN (22-30)
        Bildesperre: server-side dag 1-14
    end note
```

### Overgangsregler (verifisert mot koden)

| Fra | Til | Utløser | Fil |
|-----|-----|---------|-----|
| `IDLE` | `QUEUED` | `POST /api/journey/queue` → `claimFreeQuota()` | `app/api/journey/queue/route.ts` |
| `QUEUED` | `MATCHED` | `cron/matching` (lør 02,03,04) — score + greedy | `app/api/cron/matching/route.ts` |
| `MATCHED` | `ON_JOURNEY` | Begge har besøkt dashboard (dag 1) | `lib/journey/engine.ts` |
| `ON_JOURNEY` | `ON_JOURNEY` | `cron/journey` (hver time) — day+1 | `app/api/cron/journey/route.ts` |
| `ON_JOURNEY` | `COMPLETED` | Dag 30 fullført → `endJourney()` | `lib/journey/engine.ts` |
| `COMPLETED` | `IDLE` | Bruker starter ny reise (neste lørdag) | `POST /api/journey/queue` |
| `QUEUED` | `IDLE` | `DELETE /api/journey/queue` (meld deg ut) | `app/api/journey/queue/route.ts` |

---

## 2. Hovedløkken — Flowchart

Fra onboarding til ferdig reise. Denne løkken er hele ToSom.

```mermaid
flowchart TD
    A["**Onboarding** — 13 steg<br/>BFI-10, ECR, PVQ-10, ERQ-6<br/>+ grunnprofil + livssituasjon"] --> B

    B["**Queue** — POST /api/journey/queue<br/>claimFreeQuota, atomisk<br/>journeyState: QUEUED"] --> C

    C["**Vent til lørdag** (/matching)<br/>Venterom — nedtelling<br/>Kan melde seg ut"] --> D

    D["**cron/matching** (lør 02-04)<br/>Advisory lock 123456789<br/>Les alle QUEUED, tak 5 000"] --> E

    E{"**Score + Match**<br/>6 dimensjoner + 11 dealbreakers<br/>Grødig kobling, høyest score først<br/>Hver bruker KUN ÉN GANG"}

    E -->|Match| F
    E -->|Ingen match| G

    G["**Ingen match**<br/>Ærlig melding<br/>Vente til neste lørdag"] --> C

    F["**MATCHED**<br/>Match + Conversation<br/>+ JourneyProgress x2 + Notification x2<br/>journeyState: MATCHED"] --> H

    H["**Dashboard**<br/>Match-revelasjon (12 s)<br/>Resonanse-kort, kalendar<br/>Samtale-knapp"] --> I

    I["**30-dagers reise**<br/>cron/journey (hver time)<br/>day+1"] --> J

    J["**Fase 1: EARLY** (dag 1-7)<br/>Uten bilder, bli kjent"] --> K

    K["**Fase 2: BUILDING_TRUST** (dag 8-14)<br/>Uten bilder, bygg tillit"] --> L

    L["**Dag 15: Bildesløyfen løftes**<br/>Server-side: 423 før dag 15"] --> M

    M["**Fase 3: DEEPER** (dag 15-21)<br/>Dypere samtaler, bilder tillatt"] --> N

    N["**Fase 4: CHECKIN** (dag 22-30)<br/>Refleksjon og oppsummering"] --> O

    O["**Dag 30: Reisen slutter**<br/>endJourney, JourneyStat, R2-sletting<br/>journeyState: COMPLETED"] --> P

    P["**Fullført**<br/>«Vi fant hverandre» = slett kontoer<br/>Eller: ny reise neste lørdag"]
```

### Matchevektene (summerer til 1,00)

| Dimensjon | Vekt | Kilde |
|-----------|------|-------|
| Verdier | 0,25 | PVQ-10 |
| Tilknytning | 0,25 | ECR |
| Personlighet | 0,15 | BFI-10 |
| Kommunikasjon | 0,15 | Kommunikasjonsstil |
| Emosjonsregulering | 0,10 | ERQ-6 |
| Livssituasjon | 0,10 | Livssituasjon + preferanser |


---

## 3. Sekvens — Chat (real-time + fallback)

Hvordan meldingen flyter fra sender til mottaker.

```mermaid
sequenceDiagram
    participant A as Bruker A (Frontend)
    participant API as POST /api/chat/send
    participant DB as PostgreSQL (Prisma)
    participant P as Pusher
    participant B as Bruker B (Frontend)

    A->>API: POST { conversationId, content, type }
    API->>API: getServerSession + requireNotBanned
    API->>API: pgCheck (rate limit: 30/min)
    API->>API: Zod-validering
    API->>DB: Verifiser at sender er del av conversationen
    DB-->>API: Conversation funnet
    API->>DB: prisma.message.create
    DB-->>API: Message { id, content, senderId, createdAt }

    par Real-time (Pusher)
        API->>P: triggerNewMessage(conversationId, msg)
        P->>B: new-message (kanal: conversation-{id})
        B->>B: loadMessages(true), dedup via lastMsgIdRef
    and Fallback (Polling 3 s)
        B->>API: GET /api/chat/messages?after={lastId}
        API-->>B: 200 { messages: [...] }
    end

    API-->>A: 200 { message } (optimistisk send bekreftet)
```

### Pusher-kanaler

| Kanal | Events | Bruk |
|-------|--------|------|
| `conversation-{id}` | `new-message`, `typing`, `mood-changed` | Chat real-time |
| `user-{id}` | `conversation-updated` | Dashboard varsling |

**Filer:** `lib/pusher/client.ts` (frontend) · `lib/pusher/server.ts` (backend)

---

## 4. Ruting — Frontend-sider

Hvordan brukeren flyttes mellom sider basert på tilstand.

```mermaid
flowchart LR
    subgraph Uten match
        L["/ (landing)"] --> LG["/login"]
        LG --> OB["/onboarding (13 steg)"]
        OB --> MQ["/matching (venterom)"]
    end

    subgraph Med match
        D["/dashboard (hoved-hub)"]
        CH["/chat/[id] (samtale)"]
        D <--> CH
    end

    MQ -->|"journeyState = MATCHED<br/>eller ON_JOURNEY"| D
    D -->|"Ingen match funnet"| MQ
```

### Rutebeskyttelse

| Rute | Beskyttelse | Mekanisme |
|------|-------------|-----------|
| `/api/chat/*` | Session | Middleware → `getToken()` |
| `/api/journey/*` | Session | Middleware → `getToken()` |
| `/api/match/*` | Session | Middleware → `getToken()` |
| `/api/admin/*` | Admin role | `verifyAdminCookie()` + `isAdminRole()` |
| `/dashboard` | Match sjekk | Client-side: `!match → replace('/matching')` |
| `/matching` | Match sjekk | Client-side: `MATCHED → replace('/dashboard')` |
| `/chat/[id]` | Session | Server-side: `!session → redirect('/login')` |

---

## 5. Systemarkitektur

```mermaid
flowchart TB
    subgraph Vercel
        NEXT["**Next.js App Router**<br/>Pages, API Routes, Middleware, Cron"]
    end

    subgraph Data
        PG["**PostgreSQL** (Neon Frankfurt)<br/>Prisma ORM, 25 migrasjoner"]
        R2["**Cloudflare R2**<br/>Bilder (S3), slettes ved endJourney"]
    end

    subgraph Realtime
        PUSHER["**Pusher** (EU-cluster)<br/>conversation-{id}, user-{id}"]
    end

    subgraph Epost
        RESEND["**Resend**<br/>Varsler, support"]
    end

    NEXT --> PG
    NEXT --> R2
    NEXT --> PUSHER
    NEXT --> RESEND
    PUSHER -->|WebSocket| NEXT

    subgraph Crons
        CRON_M["cron/matching<br/>Lør 02,03,04<br/>Lock 123456789"]
        CRON_J["cron/journey<br/>Hver time<br/>Lock 987654321"]
    end

    CRON_M --> PG
    CRON_J --> PG
```

---

## 6. Invarianter — aldri brytes

| # | Invariant | Hvor i flowet | Sikres av |
|---|-----------|---------------|-----------|
| I-1 | Én match per bruker om gangen | Queue → Matching | Grødig kobling |
| I-2 | Matching bruker aldri bilder | Score | `buildCheapFeatures` |
| I-3 | Brukeren velger aldri mellom matcher | Match | Én match, ingen feed |
| I-4 | Ingen push/e-post/SMS ved match | Match | Ingen notification (beta: flagg) |
| I-5 | Reisen er 30 dager, fire faser | Journey | `PHASE_CONFIGS` |
| I-6 | Ingen bilder før dag 15 | Chat | Server-side: 423 |
| I-7 | Ingen AI-tekst mot brukere | Alt | Ingen LLM-kall |
| I-8 | Ingen feed, swipe, gamification | Frontend | CI-vakt: `verify:concept` |
| I-9 | Profilen er privat | Matching | Ingen API-rute deler profil |
| I-10 | Matching ukentlig, natt til lørdag | Cron | Vercel Cron + lock |
| I-11 | Uten match → vent til neste lørdag | Venterom | Ingen manual-match |
| I-12 | Brukeren ser ord, aldri tall | Frontend | «Sterk resonans» |
| I-13 | «Vi fant hverandre» sletter kontoer | Endreise | `endJourney()` |
| I-14 | Aldersgrense 21+ | Onboarding | `MIN_AGE = 21` |

**Kilde:** `docs/TOSOM-SUPER-MASTERPLAN-v2.0.md` §16

---

## 7. CI-vaktene

| Vakt | Sjekker |
|------|---------|
| `verify:lang` | Ingen nynorsk (640 filer) |
| `verify:ai` | Ingen AI-tekstgenerering mot brukere |
| `verify:concept` | Ingen feed/swipe/gamification |
| `verify:one-engine` | Én matching-motor |
| `verify:cron-05` | Cron autorisert + advisory lock |
| `verify:cron` | Cron-ruter har korrekt signatur |

---

## 8. Filsjekk

| Komponent | Hovedfiler |
|-----------|-----------|
| Onboarding | `app/onboarding/OnboardingFlow.tsx` |
| Queue | `app/api/journey/queue/route.ts`, `lib/payment/freeQuota.ts` |
| Matching-cron | `app/api/cron/matching/route.ts` |
| Score | `lib/matching/unifiedScorer.ts`, `lib/matching/dealbreaker.ts` |
| Journey-cron | `app/api/cron/journey/route.ts` |
| Journey-engine | `lib/journey/engine.ts` |
| Chat (send) | `app/api/chat/send/route.ts` |
| Chat (read) | `app/api/chat/messages/route.ts` |
| Chat (context) | `app/chat/context/ChatContext.tsx` |
| Pusher | `lib/pusher/client.ts`, `lib/pusher/server.ts` |
| Session | `lib/auth/session.ts` |
| Middleware | `middleware.ts` |
| Dashboard | `app/dashboard/page.tsx` |
| Venterom | `app/matching/page.tsx` |

---

*Levende referanseverk. Oppdater ved endring i flow. Koden vinner alltid — finner du avvik: rapporter det.*