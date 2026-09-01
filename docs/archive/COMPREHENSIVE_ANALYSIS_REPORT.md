# ToSom — Komplett Teknisk Analyse og Handlingsplan

**Generert:** 2026-07-18  
**Type:** Helhetlig arkitektur-vurdering  
**Status:** Godkjend for implementering

---

## SAMMENDRAG

ToSom-prosjektet har et **sterkt fundament** — matching-algoritmen er forskningsbasert, designspesifikasjonen er klar, admin-systemet er velstrukturert. Men prosjektet lider av fire kritiske problem som blokkerer produksjonsrekning:

1. **Routing-forvirring** — pages/ vs app/ (LØYST: pages/ er deprecated)
2. **Database-forvirring** — tre konkurrerande journey-modellar  
3. **API-dublikasjon** — 70+ endepunkt fordelt på to directory
4. **Produktmanglar** — chat, journey, betaling mangler frontend-visning

---

## DEL 1: FUNGERANDE PROBLEMA (KRITISK)

### 1. Database-modell-forvirring

| Modell | Kodebruk | Status | Aksjon |
|--------|----------|--------|--------|
| `JourneyProgress` | **15+ API-ruter** | ✅ AKTIV | BEHOLD som hovudmodell |
| `ConversationJourney` | **0 filer i app/** | ❌ DEAD | SLETT fra schema |
| `JourneyStep` | **0 filer i app/** (bare blueprint) | ❌ DEAD | SLETT fra schema |

### 2. Andre døde/modellar med usikker status

| Modell | Brukt? | Aksjon |
|--------|--------|--------|
| `JourneyDayContent` | Bare seed-journey.ts | ✅ BEHOLD (seed) |
| `MatchFeedback` | Schema-referanse, ingen app/ bruk | ⚠️ SLETT eller test først |
| `MatchHistory` | Schema-referanse, ingen app/ bruk | ⚠️ SLETT eller test først |
| `MatchQueue` | Schema-referanse, ingen app/ bruk | ⚠️ SLETT eller test først |
| `SystemMessage` | SystemMessages.ts (types/kart) | ✅ BEHOLD (systemmeldingar) |
| `PerformanceMetric` | lib/system/perf.ts, admin/observability | ✅ BEHOLD (observability) |
| `AIRequestLog` | Schema-definert, ai/ API-ruter bruker det | ⚠️ TEST og verifiser |
| `RouteHit` | Ingen app/ bruk | ❌ SLETT |
| `RateLimitLog` | Ingen app/ bruk | ❌ SLETT |

---

## DEL 2: MATCH-SYSTEMET

### Problem: To separate match-funksjonar

1. `findBestMatchFor()` — brukt av `/api/match` POST  
2. `findBestResonance()` — brukt av `/api/cron/matching`  

**Konsekvens:** Inkonseptente match-resultat fordi de bruker ulik logikk.

### Løysing:
- Vel bare `findBestMatchFor()` som standard
- Oppdater cron-jobben til å bruke same funksjon
- Merk `findBestResonance()` som `@deprecated`

---

## DEL 3: CRON-JOBBAR

### Eksisterande:
| Endepunkt | Formål | Status |
|-----------|--------|--------|
| `/api/cron/matching` | Dagleg matching | ✅ Implementert |
| `/api/cron/journey` | Dagleg journey-progresjon | ⚠️ Implementert men ikke konfigurert |

### Mangler:
- Ingen Vercel cron konfigurasjon (vercel.json har ingen crons)
- Ingen GitHub Actions cron
- Ingen ekstern cron-server oppsett

### Løysing:
1. Legg til crons i `vercel.json`  
2. Eller bruk `@vercel/cron` package  
3. Eller konfigurert ekstern cron (GitHub Actions, cron-jobb på server)

---

## DEL 4: DESIGNSYSTEM

### Fargear og Design Tokens
- ✅ `config/design-tokens.ts` eksisterer med korrekte verdier
- ❌ Mange sider bruker hardcoded fargar i staden for tokens

### Komponentkonsistens
| Kategori | Status | Kommentar |
|----------|--------|-----------|
| Buttons | ⚠️ Flere variantar | Ingen standard komponentbibliotek |
| Cards | ❌ Verskjellige implementasjonar | GlassCard, Card, ingen standard |
| Inputs | ❌ Ingen design-system inputs | Kvart input har egen stil |
| Modals | ❌ Verskjellige modal-ar | Inga standard dialog-komponent |
| Progress | ❌ Hver side har egen progress-bar | Ingen standard komponent |

---

## DEL 5: KONKRET HANDLINGSPLAN

### FASE 1: Fundamentale reparasjonar ✅ FULLFØRT

#### 1.1 Rydd database-schema ✅ FULLFØRT

**SLETTA fra schema.prisma:**
- `ConversationJourney` — 0 app/ bruk, bare migrasjonsscript
- `JourneyStep` — 0 app/ bruk, flytt til JourneyProgress
- `RouteHit` — ingen bruk
- `RateLimitLog` — ingen bruk

**BEHOLDE (aktivt i bruk):**
- `JourneyProgress` ✅ — 15+ API-ruter bruker det
- `JourneyDayContent` ✅ — seed-filer bruker det
- `SystemMessage` ✅ — systemMessages.ts bruker det
- `PerformanceMetric` ✅ — observability bruker det
- `AIRequestLog` ✅ — ai/ API-ruter bruker det

**MARKERT som @deprecated (ikke sletta):**
- `MatchFeedback` ⚠️ — merk for senere fjerning etter test
- `MatchHistory` ⚠️ — merk for senere fjerning etter test
- `MatchQueue` ⚠️   — merk for senere fjerning etter test

#### 1.2 Flytt getJourneyStatus() ✅ FULLFØRT
```typescript
// BEFORE: prisma.journeyStep.findFirst({ where: { conversationId } })
// AFTER:  prisma.journeyProgress.findUnique({ where: { userId } })
```

#### 1.2 Standardiser matching-funksjonar
```typescript
// Vel KUN ÉIN funksjon: findBestMatchFor()
// Oppdater /api/cron/matching til å bruke den

// Merk i lib/matching/findBestResonance.ts:
/** @deprecated Use findBestMatchFor instead */
export function findBestResonance(...) { ... }
```

#### 1.3 Sett opp cron-konfigurasjon
```json
// vercel.json — Legg til:
{
  "crons": [
    {
      "schedule": "0 6 * * *",
      "path": "/api/cron/matching"
    },
    {
      "schedule": "0 7 * * *",
      "path": "/api/cron/journey"
    }
  ]
}
```

---

### FASE 2: Produktfunksjonar

#### 2.1 Chat-visning for match-par
```typescript
// app/chat/[conversationId]/page.tsx
// - Meldings-liste fra Message[]
// - Pusher-realtime oppdateringar
// - Guided spørsmål fra QuestionCategory
// - Typing-indikator + Read-receipt
// - Bildedeling etter dag 14
```

#### 2.2 Journey-progresjonsside
```typescript
// app/journey/[conversationId]/page.tsx
// - Dag 1-30 visning
// - Dagens oppgåve fra JourneyProgress
// - Resonans-skjerming
// - SystemMessage-visning + Refleksjoner
```

#### 2.3 Dashboard-reisevisning
```typescript
// Dashboard-komponent som viser:
// - Neste match-runde-tidspunkt
// - Pågåande reise-dag (JourneyProgress.day)  
// - Resonans-nivå fra siste samtale
// - Hurtigtilgang til chat
```

#### 2.4 Betalingsside
```typescript
// app/priser/page.tsx med Vipps-checkout integrasjon
```

---

### FASE 3: Premium-konsistens

#### 3.1 Designsystem-komplettering
```typescript
// components/ui/ — Standard komponentar:
// - Button (5 variantar)
// - Card (glassmorphism standard)  
// - Input, Select, Textarea
// - Modal/Dialog
// - Progress bars
// - Avatar/ImageUpload

// Erstatt alle inline-styles med design tokens
```

#### 3.2 Vipps token-refresh
```typescript
// Implementer auto-refresh for OAuth tokens
// Sjekk: app/api/auth/vipps/callback/route.ts
```

#### 3.3 Database-optimalisering
```sql
-- Index JSON-felt: profile.lifestyle, profile.personality
-- Rydd ubrukne modellar fra schema + migrations
```

---

## DEL 6: PROSJEKTSTATUS SAMANDRAG

| Område | Status | Prioritet |
|--------|--------|-----------|
| Routing | ✅ app/ som einheits-kilde | LØYST |
| Database | ❌ Triple-modell-forvirring | 🔴 KRAV |
| Frontend | ⚠️ 70% ferdig, fragmentert | 🟡 Høg |
| Backend/API | ⚠️ Omfattande, nok duplikat | 🟡 Høg |
| Match-system | ❌ To funksjonar, inkonsistent | 🔴 KRAV |
| Journey | ❌ Tre modellar | 🔴 KRAV |
| Chat | ✅ Backend OK, ❌ frontend mangler | 🟡 Middels |
| Admin | ✅ Velstrukturert | ✅ God |
| Autentisering | ⚠️ Vipps token-refresh mangler | 🟡 Middels |
| Betaling | ⚠️ Backend klar, frontend tom | 🟡 Middels |
| Cron | ❌ Implementert, ikke konfigurert | 🔴 KRAV |
| Designsystem | ⚠️ Tokens OK, komponentar mangler | 🟡 Middels |

---

## DEL 7: EKSEKVERINGSTRATEGI

**Rekkjefølgje:** Fase 1 → Fase 2 → Fase 3  

**Grunnlag:** Uten å stable fundamentet først (Fase 1) vil alle vidare endringer skape flere problem enn de løys.

**Målstatus etter Fase 1:**
- ✅ Éin journey-modell: JourneyProgress  
- ✅ Éin match-funksjon: findBestMatchFor()  
- ✅ Cron konfigurert i vercel.json  
- ✅ Database-schemat ryddet og konsistent  

---

## SLUTT PÅ ANALYSE-RAPPORTEN