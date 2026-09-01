# ToSom — Next Phase Build Report

**Dato:** 2026-06-30  
**Status:** Matchmotor, Profilunivers og Journey-dashboard fullført

---

## OPPSUMMERING

ToSom er no bygd med:

- ✅ Match Score Engine (matchScore, matchStrength, futurePotential, compatibility, chemistry)
- ✅ Match Status Engine (getMatchStatus, getMatchLabel, getMatchVisual)
- ✅ Dynamic Profile Engine (updateProfileFromJourney, updateProfileFromResonance, updateProfileFromWarm)
- ✅ Profil Side (/app/profile/page.tsx)
- ✅ Partner Profil Side (/app/profile/[id]/page.tsx)
- ✅ Journey Dashboard (/app/journey/page.tsx)

---

## FILSTRUKTUR

```
lib/
├── match/
│   ├── score.ts              ✅ Match Score Engine
│   └── status.ts             ✅ Match Status Engine
├── profile/
│   └── dynamicProfile.ts     ✅ Dynamic Profile Engine
└── journey/
    ├── resonance.ts          ✅ FASE 11
    ├── phase.ts              ✅ FASE 12
    ├── silentMoments.ts      ✅ FASE 13
    └── warmIndicator.ts      ✅ FASE 14

app/
├── api/match/
│   ├── score/
│   │   └── route.ts          ✅ Match Score API
│   └── status/
│       └── route.ts          ✅ Match Status API
├── profile/
│   ├── page.tsx              ✅ Profil Side
│   └── [id]/
│       └── page.tsx          ✅ Partner Profil Side
└── journey/
    └── page.tsx              ✅ Journey Dashboard

docs/
└── TOSOM-NEXT-PHASE-BUILD.md  ✅ Denne fila
```

---

## FASE 16: MATCH SCORE ENGINE

### lib/match/score.ts
- `calculateMatchScores(input)` — berekner 5 scores
- `calculateMatchStrength(label)` — styrke-beskrivelse
- `calculateFuturePotential(label)` — potensial-beskrivelse
- `getMatchVisual(score)` — visuelle tilbakemeldinger

### Scores:
| Score | Forklaring |
|-------|----|
| matchScore | 25% mutualDepth + 25% resonance + 15% sharedValues + 15% communicationStyle + 10% lifeStage + 10% reflectionMatch |
| matchStrength | 40% resonance + 30% warm + 15% messages + 10% days |
| futurePotential | 35% sharedValues + 25% lifeStage + 10% fase + 15% mutualDepth + 15% communicationStyle |
| compatibility | Snitt av mutualDepth, sharedValues, communicationStyle, lifeStage |
| chemistry | 40% resonance + 30% warm + 30% matchScore |

### app/api/match/score/route.ts
- POST — berekn match-score

---

## FASE 17: MATCH STATUS ENGINE

### lib/match/status.ts
- `getMatchStatus(resonance, warm, phase, days, matched)` — hent status
- `getMatchLabel(status)` — label
- `getMatchVisual(status, score)` — visuelle tilbakemeldinger

### Statusar:
| Status | Betingelse | Farge |
|--------|-|-------|
| pending | !matched | #8282FF |
| new | phase 1 + days <= 3 | #D4AF37 |
| developing | resonance 40-69 | #FFB86C |
| strong | resonance >= 70 + warm >= 60 | #4DFF88 |
| deep | phase 5 | #FFD700 |

### app/api/match/status/route.ts
- POST — hent/oppdater match-status

---

## FASE 18: PROFILUNIVERSET

### lib/profile/dynamicProfile.ts
- `updateProfileFromJourney(profile, phase, day, remaining)` — oppdater fra journey
- `updateProfileFromResonance(profile, score, details)` — oppdater fra resonans
- `updateProfileFromWarm(profile, score, level)` — oppdater fra varme
- `getDynamicProfileDisplay(profile)` — visning

### app/profile/page.tsx
- Viser egen profil med dynamiske oppdateringar
- Resonans-score
- Varme-nivå
- Journey-fase
- Tags

---

## FASE 19: PARTNERPROFIL

### app/profile/[id]/page.tsx
- Viser partner-info
- Journey-state
- Match-state
- Resonans-state
- Bio og tags
- Online-status

---

## FASE 20: JOURNEY-DASHBOARD

### app/journey/page.tsx
- Viser heile reisa med:
  - Fase (med farge)
  - Progresjon (progress bar)
  - Resonans (score + trygghet + dybde + varme)
  - Varme (score + level)
  - Match (score + strength + potential)
  - Partner-status (online)
  - Phase stepper (1→2→3→4→5)

---

## NESTE STEG

### Høgprioritet
1. Test match-score API med ekte data
2. Test journey-dashboard med ekte fase-data
3. Lagre/les profil fra DB

### Middelprioritet
4. Kobla profil-side til `/api/profile/me`
5. Kobla partner-profil til `/api/profile/[id]`
6. Kobla journey-dashboard til `/api/journey/dashboard`

### Lavprioritet
7. Profil-redigering (bio, tags, foto)
8. Resonans-notifikasjonar
9. Match-popup ved høg match