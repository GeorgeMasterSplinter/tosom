# Analytics og Innsikt — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Backend-logikk ferdig, frontend-komponent manglar

---

## OVERSIKT

Analytics gir innsyn i reise-progresjon, resonans-mønster, match-kvalitet, og brukar-adferd — alltid roleg og utan stress.

---

## FUNKSJONAR

### 1. Journey Analytics
- Progresjon i % med fase-indikator
- Dagleg aktivitet (meldingar, refleksjonar, oppgåver)
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
- Samanlikning med snitt (percentil)

### 4. Brukar-innsikt
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
| 7 | Ein veke | ⏳ |
| 14 | Halvvegs bilder | ⏳ |
| 21 | Tre kvartvegar | ⏳ |
| 30 | Reise fullført! | ⏳ |

---

## RESONANS-MØNSTER

| Mønster | Kva | Kva betyr |
|--|--|--|
| **steady-growth** | Steadleg vekst | Positiv utvikling |
| **wave-like** | Bølgjer | Normal variasjon |
| **spike-plateau** | Spikes og plateaus | Intensive periodar |
| **gradual-deepening** | Gradvert fordjuping | Dypare kopling |
| **random** | Tilfeldig | Ingen klar trend |

---

## AKTIVITET-SAMANHENGER

| Aktivitet | Korrelasjon | Betydning |
|--|--|--|
| Meldingsfart | 0.65 | Raskare svar → høgare resonans |
| Refleksjonar | 0.78 | Sterkast påverknad |
| Oppgåver | 0.45 | Moderat påverknad |

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
      {/* Brukar-innsikt */}
    </div>
  )
}
```

---

## DESIGNPRINSIPP

1. **Aldri dømande** — tal er informasjon, ikkje dom
2. **Aldri pressande** — brukaren kan velje å ikkje sjå
3. **Alltid nyskapande** — innsikt som hjelper, ikkje stressar
4. **Alltid roleg** — ingen varsele, ingen påminningar

---

## HUSK

- Analytics er **valfritt** for brukarar
- Ingen push-notifikasjonar for analytics
- Tal skal **hjelle**, ikkje skape angst
- Alle funksjonar kan slås av