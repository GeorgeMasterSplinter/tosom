# TO SOM V2.1 — ACT-INSTRUKS FOR QWEN 3.6 27B

> **Dato:** 2026-11-08
> **Status:** READY FOR EXECUTION
> **Model:** Qwen 3.6 27B (Optimized for structured patch execution)
> **Formål:** Steppede ACT-instruksjoner for å implementere alle bugs-fixes og dokument-korreksjoner fra Implementation Plan v2.1.
> **Forutsetning:** Dok 13 (13-IMPLEMENTATION-PLAN-V2.1.md) er lest og forstått.

---

## 0. FORHÅNDSSJEKK

```bash
cd /mnt/master/tosom
git status
git diff --stat
# Commit eller stash lokale endringer før du begynner
```

---

## 1. PHASE 1 — KRITISKE BUGS (P0)

### 1A. FIX: ToSomTabs Underline Positioning (BUG-002)

**Fil:** `components/ui/system/ToSomTabs.tsx` | **Tid:** ~5 min

**TRINN 1:** Legg til `data-tab-value` på `<button>`:
```tsx
// SEARCH:
            <button
              key={tab.value}
              onClick={() => handleTabClick(tab.value)}
// REPLACE:
            <button
              key={tab.value}
              data-tab-value={tab.value}
              onClick={() => handleTabClick(tab.value)}
```

**TRINN 2:** Endre selector:
```tsx
// SEARCH:
          const activeBtn = tabsContainer.querySelector(`[onclick*="${value}"]`) as HTMLElement;
// REPLACE:
          const activeBtn = tabsContainer.querySelector(`[data-tab-value="${value}"]`) as HTMLElement;
```

**TRINN 3:** `npm run build` — verifiser ingen feil.

---

### 1B. FIX: unifiedScorer.ts Vektsynch (BUG-003)

**Fil:** `lib/ai/unifiedScorer.ts` | **Tid:** ~10 min | **Kilde av truth:** `config/matching.ts` (weightConfig)

**TRINN 1:** Oppdater vekter i unifiedScorer.ts:
```typescript
// SEARCH:
    biological: { weight: 0.40 },
    cultural: { weight: 0.15 },
    emotional: { weight: 0.25 },
    values: { weight: 0.20 },
// REPLACE:
    biological: { weight: 0.35 },
    cultural: { weight: 0.25 },
    emotional: { weight: 0.20 },
    values: { weight: 0.20 },
```

**TRINN 2:** Verifiser sum = 1.00. `npm run build`.

---

## 2. PHASE 2 — VIKTIGE BUGS (P1)

### 2A. FIX: findBestResonance Hardcoded Fallback (BUG-004)

**Fil:** `lib/ai/findBestResonance.ts` | **Avhenger av:** BUG-003 fix først | **Tid:** ~15 min

**TRINN 1:** Erstat hardcoded fallback:
```typescript
// SEARCH:
    // Fallback — return first candidate
    return {
      candidateId: candidates[0].id,
      resonanceScore: bestScore,
      scoreCategory: 'GOOD',
      resonanceLevel: 'MODERATE',
      confidence: 0.3,
    };
// REPLACE:
    // Fallback — dynamic assessment based on actual score
    const scoreCategory = bestScore >= 0.4 ? 'GOOD' : bestScore >= 0.3 ? 'MODERATE' : bestScore >= 0.2 ? 'WEAK' : 'POOR';
    const resonanceLevel = bestScore >= 0.4 ? 'MODERATE' : 'GENTLE';
    const confidence = Math.max(0.1, Math.min(0.5, bestScore));
    return { candidateId: candidates[0].id, resonanceScore: bestScore, scoreCategory, resonanceLevel, confidence };
```

**TRINN 2:** Verifiser at ingen hardcoded 'GOOD'/'MODERATE'/0.3 i fallback. `npm run build`.

---

### 2B. FIX: JourneyTimeline Fase-inndeling (BUG-001)

**Fil:** `components/journey/JourneyTimeline.tsx` | **Tid:** ~10 min

**TRINN 1:** Legg til CHECKIN i del2Phases:
```tsx
// SEARCH:
    const del2Phases = ['BUILDING_TRUST', 'DEEPER'];
// REPLACE:
    const del2Phases = ['BUILDING_TRUST', 'DEEPER', 'CHECKIN'];
```

**TRINN 2:** Sørg for at komponenten bruker `phase.title` (ikke `phase.name`) og `phase.nextButtonText` (ikke `next_button_text`).

**TRINN 3:** Verifiser alle 9 faser dekket: INTRO, ATTUNEMENT, CALIBRATION, RESONANCE, ALIGNMENT, ANCHOR, BUILDING_TRUST, DEEPER, CHECKIN. `npm run build`.

---

### 2C. FIX: isPhaseComplete Hardkodet Step-Krav (BUG-005)

**Fil:** Finn med `grep -r "completedSteps >= 3" lib/` | **Tid:** ~10 min

**TRINN 1:** Erstatt hardkodet krav:
```typescript
// SEARCH:
completedSteps >= 3
// REPLACE (Option A — foretrukket):
completedSteps >= (phase.config?.completionRequirement ?? phase.steps?.length ?? 3)
// REPLASE (Option C — minimal fix hvis Option A ikke passer):
completedSteps >= Math.min(3, phase.steps?.length ?? 3)
```

**TRINN 2:** Verifiser INTRO (1 step) kan fullføres. `npm run build`.

---

## 3. PHASE 3 — RENING (P2)

### 3A. FJERN: baseScore.ts Død Kode (BUG-006)

**Fil:** `lib/baseScore.ts` | **Tid:** ~5 min

```bash
# TRINN 1: Bekreft ingen importerer
grep -r "baseScore" --include="*.ts" --include="*.tsx" lib/ app/ components/ || echo "NO IMPORTS"
# TRINN 2: Fjern filen
rm lib/baseScore.ts
# TRINN 3: npm run build
```

### 3B. FIX: ToSomSlider useRef Type Mismatch (PATCH-07-B)

**Fil:** `components/ui/system/ToSomSlider.tsx` | **Tid:** ~2 min

```typescript
// SEARCH:
const sliderRef = useRef<HTMLDivElement>();
// REPLACE:
const sliderRef = useRef<HTMLFieldSetElement>(null);
```

### 3C. FIX: ToSomToast Double-Render Risiko (PATCH-07-C)

**Fil:** `components/ui/system/ToSomToast.tsx` | **Tid:** ~10 min

**TRINN 1:** Legg til guard-flag for å unngå double-trigger:
```typescript
// SEARCH: useEffect(() => { if (!open) return; const timer = setTimeout...
// REPLACE:
const hideTriggered = useRef(false);
useEffect(() => {
  if (!open || hideTriggered.current) return;
  hideTriggered.current = true;
  const timer = setTimeout(() => setVisible(false), duration);
  return () => clearTimeout(timer);
}, [open, duration]);
```

Hvis `ToSomAnimatedEntrance` har `onExit` prop, fjern useEffect helt og bruk `onExit={() => setVisible(false)}`.

---

## 4. PHASE 4 — DOKUMENT-KORREKSJONER (P3)

### 4A. docs/v2/01-ARCHITECTURE-OVERVIEW-V2.md
- API-ruter kaller `lib/admin/*.ts` funksjoner (ikke stubs)
- Observability-ruter (`/api/system/metrics`, `/api/system/health`) er stubs med hardcoded JSON
- Middleware er kondisjonsbasert; admin password hardcoded i middleware
- Ingen rate limiting på admin API-endepunkter

### 4B. docs/v2/02-DATA-MODEL-V2.md
- **Match:** Fjern @updatedAt fra matchDate; legg til endedAt (DateTime?), unmatchedBy (String?)
- **User:** Fjern isVerified; legg til verificationToken, verificationExpires, twoFactorEnabled, twoFactorSecret
- **Profile:** Dokumenter at deep_profile JSON ikke utnyttes; bio/interests/languages/lifestyle ikke lagret
- **Notification:** Korreger isRead → read

### 4C. docs/v2/05-MATCHING-ENGINE-V2.md
- Weight distribution: vis BEGGE kilder (weightConfig.ts vs unifiedScorer.ts) + marker at de nå er synkronisert
- Dokumenter baseScore.ts som fjernet/død kode
- Dealbreaker: kun orientationIncompatible eksisterer; genderIncompatible er ikke implementert
- findBestResonance fallback: dokumenter ny dynamisk oppførsel

### 4D. docs/v2/06-JOURNEY-ENGINE-V2.md
- Response format: phase.title (ikke name), nextButtonText camelCase (ikke snake_case)
- isPhaseComplete: dokumenter at hardkodet >=3 er erstattet med dynamisk krav
- nextPhaseIndex: returnerer -1 for siste fase; getPhaseData(-1) → null (safe men uklart)

### 4E. docs/v2/07-UI-KOMPONENTER-V2.md
- ToSomTabs: dokumenter at underline bug er fikset med data-tab-value attribute
- ToSomSlider: dokumenter useRef type fix
- ToSomToast: dokumenter double-render guard

---

## 5. EXECUTION CHECKLIST

Kjør i denne rekkefølgen:

```
[ ] PHASE 1A: ToSomTabs underline fix (BUG-002)
[ ] PHASE 1B: unifiedScorer vektsynch (BUG-003)
[ ] PHASE 2A: findBestResonance fallback (BUG-004) — ETTER BUG-003
[ ] PHASE 2B: JourneyTimeline faser (BUG-001)
[ ] PHASE 2C: isPhaseComplete krav (BUG-005)
[ ] PHASE 3A: Fjern baseScore.ts (BUG-006)
[ ] PHASE 3B: ToSomSlider type fix
[ ] PHASE 3C: ToSomToast guard fix
[ ] FULL BUILD: npm run build — må pass før Phase 4
[ ] PHASE 4A-E: Dokument-korreksjoner
[ ] FINAL: git diff --stat, review alle endringer
[ ] COMMIT: git add -A && git commit -m "fix(v2.1): apply all patches from implementation plan"
```

---

## 6. TEST-VERIFISERING

| Test | Metode | Forventet resultat |
|------|--------|-------------------|
| ToSomTabs i prod-build | Manuell + `npm run build` | Underline følger aktiv tab |
| Matching vekter | Enhets/m manuell | biological=0.35, cultural=0.25, emotional=0.20, values=0.20 |
| Lav-score matching | Manuell (score < 0.26) | POOR/GENTLE/low confidence — ikke GOOD/MODERATE |
| INTRO fullføring | Manuell: 1 step → complete | Fase markeres som fullført |
| Journey alle faser | Manuell | 9 faser vises, CHECKIN inkludert |
| Bygg uten baseScore.ts | `npm run build` | Ingen feil |

---

## 7. ROLLBACK-PLAN

Hvis en patch mislykkes:

```bash
# Rollback enkelt commit
git revert HEAD

# Rollback til før v2.1 patches
git checkout <commit_before_patches> -- <file_path>

# Full rollback
git reset --hard <commit_before_patches>
```

Hver Phase kan rulles tilbake uavhengig siden de er i separate commits.

---

*End of ACT-INSTRUKS v2.1 — Total est. tid: 4-6 timer*