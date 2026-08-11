# ToSom Matching v2 — Forbedringsplan

**Versjon:** 2.0 · **Dato:** 11. august 2026
**Status:** Godkjent av George
**Formål:** Finjustering av matching-motoren uten å endre grunnstruktur, database eller API

---

## 1. Nåtilstand — Matching-motor

### Arkitektur (beholdes)
- `lib/matching/engine.ts` — hoved-orkester (`matchingEngine()`)
- `lib/matching/unifiedScorer.ts` — aktiv scoring (9 dimensjoner, 0–100 skala)
- `lib/matching/resonanceScore.ts` — parallell 9-dimensjon scorer (ikke trådd inn i hoved-flow)
- `lib/matching/dealbreaker.ts` — harde filtre (modenhets-alder, avstand)
- `lib/matching/findBestResonance.ts` — itererer kandidater, kaller unifiedScorer
- `lib/matching/weightConfig.ts` — **enkelte sannhetskilde for vekter**
- `lib/matching/types.ts` — TypeScript-typer

### Nåværende 9 dimensjoner (unifiedScorer)

| # | Dimensjon | Type | Nåværende vekt |
|---|-----------|------|---------------|
| 1 | Values | Baseverdi | ~0.20 |
| 2 | Lifestyle | Baseverdi | ~0.10 |
| 3 | Personality | Baseverdi | ~0.10 |
| 4 | Communication | Baseverdi | ~0.10 |
| 5 | Relationship Style | Baseverdi | ~0.15 |
| 6 | Intimacy & Nærhet | Baseverdi | ~0.10 |
| 7 | Future Vision | Baseverdi | ~0.10 |
| 8 | Emotional Needs | Baseverdi | ~0.07 |
| 9 | Boundaries | Baseverdi | ~0.08 |

**Totalt:** 1.00 (summerer til 100%)

> **MERKNAD (v2.1):** Vektene over er orienteringsverdier fra v2.0. Aktuell implementering i `unifiedScorer.ts` bruker 9 dimensjoner med følgende faktiske vekter: values=0.25, personality=0.20, relationshipStyle=0.15, communication=0.15, futureVision=0.10, boundaries=0.05, emotionalNeeds=0.05, lifeRhythm=0.03, maturity=0.02 (sum=1.00). `weightConfig.ts` eksporterer 5-kategoriers struktur (base/resonance/semantic/intimacy/future) som brukes i backwards-compatibility wrapper. Ingen vekstavvik mellom filene — BUG-003 allløst via refactor. `lib/baseScore.ts` er fjernet (død kode, ingen importer).

### Dealbreakers (harde filtre)
- Alder: Minimum 23 år
- Avstand: Konfigurert via `config/radius.ts` (default 50km, kan varieres)
- Ban-status: Banned brukere filtreres bort

> **MERKNAD (v2.1):** Dealbreaker i `lib/matching/dealbreaker.ts` implementerer kun `orientationIncompatible` basert på sexualitet + preferredSexuality. Det finnes INGEN `genderIncompatible` dealbreaker — kjønnskompatibilitet er ikke implementert som hard filter.

### Hva fungerer bra
- **9-dimensjon-modellen** er god og dekker riktige områder
- **Dealbreaker-systemet** er enkelt og effektivt
- **Én match per 24t** regel implementeres riktig
- **Ingen bilder i scoring** — korrekt per filosofi

---

## 2. Forbedringsmuligheter (uten rewrite)

### 2.1 Vekt-finjustering

**Problem:** Nåværende vekter er jevnt fordelt og reflekterer ikke at visse dimensjoner er viktigere for langtidskompatibilitet.

**Forslag — justerte vekter:**

| Dimensjon | Nå | Forslag v2 | Grunngivning |
|-----------|-----|------------|-------------|
| Values | 0.20 | **0.22** | Felles verdier er grunnlaget for alt |
| Lifestyle | 0.10 | **0.08** | Viktig, men mindre enn verdier/relasjonsstil |
| Personality | 0.10 | **0.10** | Uendret — god balanse |
| Communication | 0.10 | **0.12** | Kommunikasjonstil er kritisk for konflikthåndtering |
| Relationship Style | 0.15 | **0.18** | Tilknytningstil er #2 viktig prediktor for relasjonslykke |
| Intimacy & Nærhet | 0.10 | **0.12** | Hvordan to mennesker møter hverandre intimt (emotionalt) |
| Future Vision | 0.10 | **0.08** | Viktig men ikke avgjørende i tidlig fase |
| Emotional Needs | 0.07 | **0.06** | Godt dekket indirekte av relasjonsstil/communication |
| Boundaries | 0.08 | **0.04** | Dealbreaker-territorium; hvis verdier stemmer, grenser følger vanligvis |

**Implementering:** Én filendring i `lib/matching/weightConfig.ts`. Ingen andre filer berøres.

### 2.2 Resonans-dybde — bruk den eksisterende resonanceScore.ts

**Problem:** `lib/matching/resonanceScore.ts` finnes men brukes ikke av hoved-flowen. Den har en annen vekt-fordeling (0.25/0.20/0.15/0.15/0.10/0.05/0.05/0.03/0.02) som faktisk er mere differensiert enn unifiedScorer.

**Forslag A (konservativ):** Behold unifiedScorer som aktiv, men legg til resonanceScore som sekundær "kvalitets-sjekk" — hvis de to scorer avviker mer enn 15 poeng, marker matchen med `quality_flag: 'score_divergence'` for admin-overtilsyn.

**Forslag B (ambisiøs):** Bytt til resonanceScore som primær scorer (mer differensierte vekter), men behold unifiedScorer som fallback. Dette krever mer testing.

**Anbefaling:** Forslag A først (lav risiko). Evaluer Forslag B etter 3 måneders produksjonsdata.

### 2.3 Admin-insights — Score Breakdown-visning

**Problem:** Ingen admin-visning av match-score-breakdown per dimensjon. Umulig å manuelt evaluere match-kvalitet.

**Forslag — ny admin-side:**
```
GET /api/admin/operations/matches/[id]/breakdown
```

Retuner:
```json
{
  "matchId": "abc",
  "userA": { "name": "Astrid", "scores": { "values": 82, "lifestyle": 65, ... } },
  "userB": { "name": "Erik", "scores": { "values": 78, "lifestyle": 70, ... } },
  "match": {
    "totalScore": 74.3,
    "breakdown": [
      { "dimension": "values", "score": 80, "weight": 0.22, "weighted": 17.6 },
      { "dimension": "relationship_style", "score": 72, "weight": 0.18, "weighted": 13.0 }
    ],
    "resonanceDelta": 4.2,
    "qualityFlag": null
  }
}
```

**UI:** Bar-chart per dimensjon med User A og User B sider ved siden av hverandre, pluss en linje som viser match-scoren.

### 2.4 Dealbreaker-refinering

#### Avstand-radius — dynamisk tilpasning
**Nå:** Fast radius (50km default fra `config/radius.ts`)
**Forslag:** Dynamisk radius basert på bruker-tetthet:
- Hvis <10 kandidater innen 50km → utvid til 75km
- Hvis <5 kandidater innen 75km → utvid til 100km
- Hvis <3 kandidater innen 100km → ikke match (for få kandidater for kvalitet)

**Implementering:** Logikk i `findBestResonance.ts`, ingen schema-endring.

#### Minimum score-threshold
**Nå:** Ingen minimum — den beste kandidaten blir matchet uavhengig av score
**Forslag:** Intreduser `minAcceptableScore: 45` (av 100) — hvis bestekandidat er under terskelen, vent til neste runde

**Grunn:** En dårlig match er verre enn ingen match.

### 2.5 Logging og audit for matches

**Forslag:** Logg hver match med:
```typescript
interface MatchLog {
  matchId: string;
  userIdA: string;
  userIdB: string;
  totalScore: number;
  breakdown: SubScoreBreakdown[];
  candidatesConsidered: number;
  dealbreakersApplied: string[];
  radiusUsed: number;
  minThresholdMet: boolean;
  timestamp: Date;
}
```

Lagres i eksisterende `AuditLog`-modell eller ny `MatchLog`-modell (anbefalt — holder det adskilt fra admin-audit).

---

## 3. Hva vi IKKE endrer

| Element | Status | Grunn |
|---------|--------|-------|
| Database-modeller | **Uendret** | Match, Profile, Journey works fine |
| API-ruter | **Uendret** | `/api/match` og eksisterende ruter beholdes |
| Matching-kronjob | **Uendret** | Kjøringer hver 24t er riktig |
| Onboarding-data | **Uendret** | 13 steg gir riktige JSON-felter |
| Chat-integrasjon | **Uendret** | Ingen matching-logikk i chat |

---

## 4. Endringsplan — Inkrementelle steg

### Steg 1: Vekt-finjustering (laveste risiko)
- Oppdater `lib/matching/weightConfig.ts` med nye vekter
- Kjør eksisterende testsuit
- Verifiser at scoring fortsatt returnerer 0–100

### Steg 2: Minimum score-threshold
- Legg til `minAcceptableScore` i `weightConfig.ts`
- Oppdater `findBestResonance.ts` med tidlig-utgang hvis ingen kandidat når terskel

### Steg 3: Dynamisk avstand-radius
- Legg til logikk i `findBestResonance.ts` som utvider radius ved lave kandidat-tall
- Logg radius brukt per match

### Steg 4: Match-logging
- Opprett `MatchLog` interface og database-migrering (ny modell)
- Logg hver match med full breakdown

### Steg 5: Admin score-breakdown-visning
- Se Admin v2 Features-spec (dokument 02) for detaljer

---

## 5. Qwen ACT-instruks

```
Når du implementerer Matching v2 forbedringer:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. START med vekt-finjustering (én filendring i weightConfig.ts)
3. Kjør alle eksisterende tests etter hver endring
4. Implementér ÉN forbedring om gangen og test grundig
5. Match-logging er viktig — implementér det før admin-UI slik at data finnes når UI bygges
6. Ikke endre database-modeller uten eksplisitt godkjenning fra George
7. Dynamisk radius skal ha en MAX (100km) — aldri uendelig utvidelse
8. minAcceptableScore skal være konfigurerbar via config/matching.ts
```

---

*Slutt på Matching v2 Forbedringsplan.*