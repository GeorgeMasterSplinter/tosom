# ToSom Admin v2 — Funksjonsspesifikasjon

**Versjon:** 2.0 · **Dato:** 11. august 2026  
**Status:** Godkjent av George  
**Formål:** Funksjons-spec for admin-panelet v2 (analytics, observability, moderation, match/journey insights)

---

## 1. Nåtilstand — Eksisterende funksjoner

### Analytics
| Funksjon | Status | Kilde |
|----------|--------|-------|
| Totalt brukere | ✅ Real data | `GET /api/admin/metrics` → Prisma |
| Aktive journeys | ✅ Real data | Same |
| Matches i dag | ✅ Real data | Same |
| Meldinger totalt | ✅ Real data | Same |
| Journey Phase Monitor | ✅ Bar-chart (EARLY/BUILDING_TRUST/DEEPER) | `JourneyPhaseMonitor.tsx` |
| SystemStatus widget | ✅ Kaller `/api/system/health` | `SystemStatus.tsx` |

### Observability
| Funksjon | Status | Notater |
|----------|--------|---------|
| System-helse | ✅ Basis (uptime, memory) | `/api/system/health` |
| Logging | ❌ Mangler | Ingen dedikert admin-logging-side |
| Feiltracking | ⚠️ Delvis | `lib/errorTracker.ts` eksisterer, men ingen admin-visning |
| DriftScore | ❌ Mangler i UI | Konseptet finnes i docs, men ikke implementert |

### Moderation
| Funksjon | Status | Notater |
|----------|--------|---------|
| Rapport-oversikt | ⚠️ Basic | Ingen detaljert side funnet |
| Bruker-banning | ✅ Eksisterer | `User.bannedAt` field i schema |
| Språk-review | ✅ Fungerer | `/admin/language-review` |

### Match/Journey Insights
| Funksjon | Status | Notater |
|----------|--------|---------|
| Match-oversikt | ⚠️ Basic | Liste, ingen dypdykk |
| Journey-oversikt | ⚠️ Basic | Liste, ingen detaljer |
| Resonans-score per match | ❌ Mangler | Ingen visning av score-breakdown |
| Phase-fordeling | ✅ I dashboard | Bar-chart i JourneyPhaseMonitor |

---

## 2. Måltilstand — Admin v2 Funksjoner

### 2.1 Analytics-modul (4 undersider)

#### A. Brukere (`/admin/analytics/users`)
**Viser:**
- Totalt brukere med daglig/ukentlig/månedlig vekst
- Onboarding-konvertering: start → fullført (%)
- Gender-fordeling, aldersfordeling (histogram)
- Geografi (kommune-region — kun aggregeret)
- Top 10 nyeste brukere med profil-lenke

**API:** `GET /api/admin/analytics/users?period=7d&granularity=daily`

#### B. Engasjement (`/admin/analytics/engagement`)
**Viser:**
- Gjennomsnittlig meldinger per dag (per aktiv journey)
- Sjønnsnittlig chat-sessjonslengde
- "Bli kjent"-bruk: % som bruker guidede spørsmål
- Mood-fordeling i chat (% per mood-type)
- Daglig aktiv brukere (DAU/MAU ratio)

**API:** `GET /api/admin/analytics/engagement?period=30d`

#### C. Konvertering (`/admin/analytics/conversion`)
**Viser:**
- Onboarding funnel: step 1 → step 13 (%)
- Match-rate: % av ventende brukere som får match per 24t
- Journey-completion rate: % som når dag 30
- "Ja til tosommhet" vs "Start ny reise" fordeling
- Chattracking: hvor mange slutter før dag 7 / 14 / 21

**API:** `GET /api/admin/analytics/conversion`

#### D. Trends (`/admin/analytics/trends`)
**Viser:**
- Linjediagram: brukerøkning (30 dager)
- Linjediagram: match-per-dag (30 dager)
- Linjediagram: meldinger-per-dag (30 dager)
- Heatmap: aktivitet per ukedag/klockslag

**API:** `GET /api/admin/analytics/trends?period=30d`

---

### 2.2 Observability-modul (3 undersider)

#### A. Helse (`/admin/observability/health`)
**Viser:**
- **DriftScore** (0–100) — samlet helserapport basert på:
  - Database-tilgjengelighet (% uptime siste time)
  - API-response tid (p50, p95, p99)
  - Memory-bruk vs threshold
  - Disk-bruk vs threshold
  - Aktiv feilrate (feil per minute)
- System-metrikk: CPU, memory, disk (fra `/api/system/health`)
- Database-status: connection pool, active queries
- Eksterne avhengigheter: OpenAI API, Vipps OAuth status

**Design:** Stor DriftScore i midten (0–100 ring), med detaljerte komponenter rundt.

#### B. Logging (`/admin/observability/logs`)
**Viser:**
- Sanntids-logg-strøm (filterbar per nivå: INFO/WARN/ERROR)
- Søk i logger (tekstsøk, tidsintervall)
- Admin-audit-log: alle admin-handlinger med timestamp og aktør
- Eksport til JSON/CSV

**Kilde:** `lib/errorTracker.ts` + ny `lib/admin/logger.ts`

#### C. Feil (`/admin/observability/errors`)
**Viser:**
- Aktive feil gruppert per type
- Feil-historikk (30 dager)
- Stackspar med fil-linje-referanser
- "Mark as resolved" funksjon
- Alerting: threshold for kritisk feilrate

**Kilde:** `lib/errorTracker.ts` error aggregation

---

### 2.3 Operasjoner-modul (3 undersider)

#### A. Matches (`/admin/operations/matches`)
**Viser:**
- Tabell med alle aktive matches:
  - Kolonner: Match-id, Bruker A, Bruker B, Score, Resonans, Opprettet, Status
  - Sortering per kolonne
  - Søk etter navn/email
  - Filter: status (ACTIVE/COMPLETED/PENDING)
- **Match-detaly-side** (`/admin/operations/matches/[id]`):
  - Full score-breakdown (9 dimensjoner fra unifiedScorer)
  - Profil-A vs Profil-B side-om-side
  - Resonans-analyse per dimensjon (radar-chart eller bar-chart)
  - Tidslinje: match → dag 1 → nå

#### B. Journeys (`/admin/operations/journeys`)
**Viser:**
- Tabell med alle aktive journeys:
  - Kolonner: Bruker, Match-id, Dag (1-30), Fase, Startet, Estimert slutt
  - Sortering per kolonne
  - Filter: fase (EARLY/BUILDING_TRUST/DEEPER)
- **Journey-detaly-side** (`/admin/operations/journeys/[id]`):
  - Progresjons-tidslinje med dag-per-dag visning
  - Meldingsaktivitet per dag (graf)
  - Refleksjoner svart av bruker? (ja/nei per dag)
  - Phase-overgangers med tidsstempler

#### C. Moderasjon (`/admin/operations/moderation`)
**Viser:**
- Rapport-kø: ukurerte rapporter først
- Per rapport: type, bruker, melding/kontekst, tidsstempel
- Handlinger per rapport: "Advar", "Ban", "Arkiver"
- Ban-historikk: banned brukere med årsak og dato
- **Automatiske flag:** (nytt) system-flag for mistenkelige mønstre:
  - For mange meldinger per time (spam)
  - Sletteda konto etter match (skjematisk)

---

### 2.4 DriftScore — Definisjon

```typescript
interface DriftScoreComponents {
  databaseUptime: number;      // 0-100, målt siste time
  apiLatency: number;          // 0-100, p95 < 200ms = 100, > 2s = 0
  memoryUsage: number;         // 0-100, <70% = 100, >90% = 0
  diskUsage: number;           // 0-100, <80% = 100, >95% = 0
  errorRate: number;           // 0-100, 0 errors = 100, >10/min = 0
}

interface DriftScore {
  overall: number;             // Weighted average
  components: DriftScoreComponents;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  lastCalculated: Date;
}

// Veighted average:
// databaseUptime * 0.30
// apiLatency * 0.25
// memoryUsage * 0.15
// diskUsage * 0.10
// errorRate * 0.20
```

**Status-terskler:**
- `overall >= 80` → HEALTHY (grønn)
- `overall >= 50` → WARNING (gul)
- `overall < 50` → CRITICAL (rød)

---

### 2.5 Ny API-endepunkt-kart

| Endepunkt | Metode | Formål | Status |
|-----------|--------|--------|--------|
| `/api/admin/analytics/users` | GET | Bruker-analyse | 🆕 Opprette |
| `/api/admin/analytics/engagement` | GET | Engasjement-metrikk | 🆕 Opprette |
| `/api/admin/analytics/conversion` | GET | Konvertering-funnel | 🆕 Opprette |
| `/api/admin/analytics/trends` | GET | Trend-data (tids-serie) | 🆕 Opprette |
| `/api/admin/observability/drift-score` | GET | DriftScore beregning | 🆕 Opprette |
| `/api/admin/observability/logs` | GET | Logg-hentning med filter | 🆕 Opprette |
| `/api/admin/observability/errors` | GET | Feil-aggregasjon | 🆕 Opprette |
| `/api/admin/operations/matches/[id]/breakdown` | GET | Match score-breakdown | 🆕 Opprette |
| `/api/admin/operations/journeys/[id]/timeline` | GET | Journey dag-per-dag | 🆕 Opprette |

**Viktig:** Eksisterende API-ruter endres ikke. Alle nye ruter er additive.

---

## 3. Endringsplan — Inkrementelle steg

### Fase 1: Observability (høyeste prioritet)
1. Opprett `lib/admin/driftScore.ts` med DriftScore-beregning
2. Opprett `GET /api/admin/observability/drift-score`
3. Opprett `/admin/observability/health/page.tsx` med DriftScore-ring + komponenter
4. Koble opp `/api/system/health` data

### Fase 2: Match/Journey Insights
1. Opprett `GET /api/admin/operations/matches/[id]/breakdown`
2. Opprett `/admin/operations/matches/[id]/page.tsx` med score-breakdown
3. Opprett journey timeline API + UI

### Fase 3: Analytics-sider
1. Implementer én analytics-side om gangen (users → engagement → conversion → trends)
2. Hver side med egen API-rute
3. Bruk Prisma aggregate/groupBy for effektiv datahenting

### Fase 4: Moderasjon-forbedring
1. Forbedrer rapport-kø i `/admin/operations/moderation`
2. Legg til auto-flag system
3. Ban-historikk med søk/filter

---

## 4. Qwen ACT-instruks

```
Når du implementerer Admin v2 Funksjoner:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. ImplementÉR ÉN modul om gangen (Observability → Match/Journey → Analytics → Moderasjon)
3. Hver ny API-rute skal ha feilhåndtering med try/catch og JSON-svar
4. Alle Prisma-queries skal bruke aggregation/grpBy der mulig — unngå .findMany() på store tabeller
5.-cache admin-analytics-data (revalidate=60 sekunder) for å unngå DB-overload
6. DriftScore-komponentene skal ha realistic defaults dersom data mangler
7. All tekst i bokmål, admin-tone (nøytral, profesjonell, presis per språkmanual §2.4)
8. Ikke endre eksisterende API-ruter — bare legg til nye
9. Test alle nye ruter med curl eller browser før neste steg
```

---

*Slutt på Admin v2 Funksjonsspesifikasjon.*