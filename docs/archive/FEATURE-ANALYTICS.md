# Analytics og Innsikt — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Backend-logikk ferdig, frontend-komponent mangler

---

## OVERSIKT

Analytics gir innsyn i reise-progresjon, resonans-mønster, match-kvalitet, og bruker-adferd — alltid rolig og uten stress.

---

## FUNKSJONAR

### 1. Journey Analytics
- Progresjon i % med fase-indikator
- Dagleg aktivitet (meldinger, refleksjoner, oppgaver)
- Fase-fordeling
- Milestones (6 stk: dag 1, 3, 7, 14, 21, 30)

### 2. Resonans-Analyse
- Daglege resonans-score med trend (stigande/stabil/fallande)
- Mønster-deteksjon (steady-growth, wave-like, spike-plateau, gradual-deepening)
- Høgaste/lågaste score
- Samanhengar med aktivitet

### 3. Match-kvalitet
- Score-fordeling (excellent/good/moderate/low)
- Resonans-nivå-fordeling (deep/strong/moderate/gentle)
- Sammenligning med snitt (percentil)

### 4. Bruker-innsikt
- Tempo (slow/steady/fast)
- Kommunikationsmønster (balanced/initiator/reactive/reserved)
- Aktivitetshøgepunkt
- Preferansar (emne, aktivitetar, meldingsfart)
- Refleksjonstype (analytical/emotional/practical/philosophical)

### 5. Analytics Report
- Samla rapport med summary
- Kan genererast når som helst

---

## MILESTONES

| Dag | Titel | Oppnådd |
|--|--|--|
| 1 | Reise starta! | ✅ |
| 3 | Første steg | ✅ |
| 7 | En veke | ⏳ |
| 14 | Halvvegs bilder | ⏳ |
| 21 | Tre kvartvegar | ⏳ |
| 30 | Reise fullført! | ⏳ |

---

## RESONANS-MØNSTER

| Mønster | Hva | Hva betyr |
|--|--|--|
| **steady-growth** | Steadleg vekst | Positiv utvikling |
| **wave-like** | Bølgjer | Normal variasjon |
| **spike-plateau** | Spikes og plateaus | Intensive periodar |
| **gradual-deepening** | Gradvert fordjuping | Dypere kopling |
| **random** | Tilfeldig | Ingen klar trend |

---

## AKTIVITET-SAMANHENGER

| Aktivitet | Korrelasjon | Betydning |
|--|--|--|
| Meldingsfart | 0.65 | Raskare svar → høgare resonans |
| Refleksjoner | 0.78 | Sterkest påvirkning |
| Oppgaver | 0.45 | Moderat påvirkning |

---

## BRUK I UI

```tsx
import {
  calculateJourneyAnalytics,
  calculateResonanceAnalytics,
  generateAnalyticsReport,
} from '@/lib/analytics/analyticsEngine'

function AnalyticsPanel({ journeyData, resonanceData }) {
  const report = generateAnalyticsReport(
    calculateJourneyAnalytics(15, 30, 'DEEPER', []),
    calculateResonanceAnalytics(resonanceData),
    calculateMatchQualityAnalytics([]),
    calculateUserInsights([])
  )

  return (
    <div>
      {/* Progresjon */}
      {/* Resonans-trend */}
      {/* Milestones */}
      {/* Bruker-innsikt */}
    </div>
  )
}
```

---

## DESIGNPRINSIPP

1. **Aldri dømande** — tal er informasjon, ikke dom
2. **Aldri pressande** — brukeren kan velge å ikke se
3. **Alltid nyskapande** — innsikt som hjelper, ikke stressar
4. **Alltid rolig** — ingen varsele, ingen påminningar

---

## HUSK

- Analytics er **valfritt** for brukere
- Ingen push-notifikasjonar for analytics
- Tal skal **hjelle**, ikke skape angst
- Alle funksjonar kan slås av