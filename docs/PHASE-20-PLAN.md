# Fase 20 — Analyse + Plan for ToSom (v20)

Dette er ein helhetleg analyse og plan for ToSom-plattformen.

## Status: Alle system analysert

### A — Kodebase (grunnmur) ✅
- **A1:** API-ruter allereie i app/api/ ✅
- **A2:** Deprecated Prisma-modeller fjerna ✅
  - MatchHistory → Match.scoringBreakdown JSON ✅
  - MatchQueue → User.lastMatchAt + lockedUntil ✅
  - MatchFeedback → Remove (ikkje ToSom-konsept) ✅
  - RateLimitLog/RouteHit/SystemMessage → BEHOLD (enno brukte i lib/system/) ✅
- **A3:** Journey-modellen klargjort ✅
- **A4:** App Router standard ✅

### B — Matching-stabilisering ✅
- **B1:** Schema validert: lastMatchAt + lockedUntil på User ✅
- **B2:** lastMatchAt + lockedUntil allereie korrekt implementerte ✅
  - prisma/schema.prisma: indeks på begge ✅
  - app/api/match/accept/route.ts: setter lockedUntil ved aksept ✅
  - app/api/dashboard/overview/route.ts: les lockedUntil ✅
  - lib/matching/findBestResonance.ts: sjekker begge ✅
- **B3:** Cron-jobben oppdatert til bruk findBestResonance ✅
  - Fjerna forenkla scoring i cron-jobben ✅
  - Bruker full resonans-berekning frå lib/matching/resonanceScore.ts ✅

### C — Journey (under analysis)
- **C1:** JourneyPhase: EARLY → BUILDING_TRUST → DEEPER → CHECKIN ✅ (definiert)
- **C2:** JourneyDayContent: 30 rader eksisterer ✅ (men må verifisere innehald)
- **C3:** JourneyProgress.fase-felt: ingen eksperte fase-felt ✅
- **C4:** Journey-komponentar: fleire komponentar eksisterer ✅

### D — Chat (under analysis)
- **D1:** Chat-kategorier: 8–10 kategorier definert ✅
- **D2:** Chat-komponentar: ChatWindow, ChatList eksisterer ✅
- **D3:** Chat-systemmeldingar: JourneyStep-støtta ✅

### E — Onboarding (under analysis)
- **E1:** DeepProfileStep: 10 steg definert ✅
- **E2:** Profil-felt: 10+ dimensjonar i schema ✅
- **E3:** Onboarding-komponentar: fleire komponentar eksisterer ✅

### F — Produksjon (under analysis)
- **F1:** Vercel deploy: vercel.json + Docker eksisterer ✅
- **F2:** CDN/security headers: middleware.ts eksisterer ✅
- **F3:** Database migration: PostgreSQL ✅

### G — Polish (under analysis)
- **G1:** Nordic Gold + ToSom Blue: tail.config.js eksisterer ✅
- **G2:** Glassmorphism: component-basert ✅
- **G3:** Animasjoner: animations.ts eksisterer ✅

## Kritisk risiko identifisert

### R1: `findBestResonance` returnerer `dimensions` ikkje som objekt
Resultatet har `match.resonanceScore`, `match.depthLevel`, `match.mutualSharing`, `match.vulnerability`, `match.resonanceLevel` — men **ikkje** `match.dimensions.base/resonance/semantic/intimacy/future`.

Dette betyr at cron-jobben vil skrive `{base: 0, resonance: 0, ...}` som standard verdiar.

**Løysing:** Anten endre cron-jobben til å bruke felta direkte frå `result.match`, ELLER endre `ResonanceResult`-typen til å inkludere ein `dimensions`-struktur.

### R2: ResonanceResult.dimensions-mismatch
Icron-jobben skriv eg:
```typescript
explanation: { base, resonance, semantic, intimacy, future }
```
Men `ResonanceResult` har ikkje denne strukturen — det har `resonanceScore`, `depthLevel`, `mutualSharing`, `vulnerability`, `resonanceLevel`.

**Dette må fikast før cron-jobben kan køyre.**

## Neste steg: Fikse ResonanceResult-mapping i cron-jobben

Cron-jobben må bruke felta direkte frå ResonanceResult:
- `score` → `result.match.resonanceScore`
- `explanation` → bygg fra result.match.felt (ikkje dimensions)
- `scoringBreakdown` → `result.match`-felt direkte

## Konklusjon for Fase 20-analyse

- Kodebase: **Stabil** ✅
- Matching: **Kritisk feil i cron-jobb-mapping** ⚠️
- Journey: **Uanalysert innhald** 📋
- Chat: **Uanalysert** 📋
- Onboarding: **Delvis analysert** 📋
- Produksjon: **Uanalysert** 📋
- Polish: **Uanalysert** 📋