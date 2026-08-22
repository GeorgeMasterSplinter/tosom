# Matching — De seks dimensjonene

**Oppdatert:** 2026-08-22 (FORSKNINGSMOTOR F-8)
**Kilde i kode:** `lib/matching/unifiedScorer.ts` (vekter) · `lib/matching/dimensions.ts` (én funksjon per dimensjon)

ToSom scorer kompatibilitet på seks forskningsbaserte dimensjoner. Sammen dekker de hele 0–100-skalaen, vekta mot en total resonansscore.

## Oversikt

| # | Dimensjon | Vekt | Instrument | Metrikke | Fallback (manglar skårer) |
|---|-----------|------|------------|----------|---------------------------|
| 1 | Verdier | 0,25 | PVQ-10 | `scoreValueCompat` (Pearson-korrelasjon) | ordoverlapp på kjerneverdier |
| 2 | Tilknytning | 0,25 | 12 items på angst/unnvikelse | `scoreAttachmentCompat` (stil-matrise) | relasjonsstil-overlap |
| 3 | Personlighet | 0,15 | BFI-10 (kortform av Big Five) | `scorePersonalityCompat` (per trekk) | ordoverlapp på personlighet |
| 4 | Kommunikasjon | 0,15 | 6 items (Gottman-prinsipper) | `scoreCommunicationCompat` (likhet) | ordoverlapp + stil-match |
| 5 | Emosjonsregulering | 0,10 | ERQ-6 | `scoreEmotionRegCompat` (reappraisal/undertrykking) | emosjonelle-behov-overlap |
| 6 | Livssituasjon | 0,10 | praktiske profildata | `scoreLifeSituationCompat` (defensiv tolking) | — (alltid tilgjengeleg) |

**Sum:** 1,00

## Regler for vekta

- Verdiene står i `DIMENSION_WEIGHTS` i `lib/matching/unifiedScorer.ts` — éin kilde.
- Hver dimensjon returnerer 0–100 (høgare = dypare resonans).
- Totalscore = vekta sum over dei seks.

## Psykometrisk-first, fallback til ordoverlapp

Motoren har to lag, per dimensjon:

1. **Psykomerisk** — om begge profiler har dei skåra felta (`bigFive`, `attachment`, `valueProfile`, `emotionRegulation`, `deepProfileData.communicationScores`), brukast den forskningsbaserte funksjonen i `dimensions.ts`.
2. **Fallback** — manglar éin av profilane skårer, fell dimensjonen tilbake til dagens ordoverlapp-metode. Ingen brukar blir utan score, og gamle profiler (før F-5) fortset å fungere.

Skårane ligg i Profile-felta `bigFive`, `attachment`, `valueProfile`, `emotionRegulation`, `deepProfileData`, `psychometricVersion` (legga av F-3/F-6).

## Resonansnivå (tall → ord)

Éin kilde: `toResonanceLevel` i `lib/matching/resonanceLevel.ts`.

| Score | Nivå |
|-------|------|
| ≥ 80 | Dyp resonans (DEEP) |
| 65–79 | Sterk resonans (STRONG) |
| 50–64 | God resonans (MODERATE) |
| 40–49 | Rolig resonans (GENTLE) |

> **F-9 — etterprøving:** Tersklene er kalibrerte for ordoverlapp-fordelinga. Med dei skåra
> instrumenta vil fordelinga skifte. Fordelinga logges no via `recordMetric` i
> matcherunden (`match.round.score_median`, `match.round.level`), slik at tersklene kan
> kalibrerast på ny etter beta. Invariant I-12 held: brukaren ser alltid ord, aldri tall.

## Kva resonans IKKJE er

Resonans er ei veiviser, ikkje ei fasit. Den er ikkje kjærlighet, ikkje ei diagnose, og ikkje
ei garanti for at to personar passar saman. For det komplette grunlaget, sjå
`/forskningsgrunnlag` (app) og `docs/FORSKNINGSMOTOR-v1.0.md`.