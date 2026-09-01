# Matching — dimensjoner og dealbreakere

**Oppdatert:** 2026-08-24 (WP1 — dealbreakere for kjønn og alder)
**Kilde i kode:** `lib/matching/unifiedScorer.ts` (vekter) · `lib/matching/dimensions.ts` (én funksjon per dimensjon) · `lib/matching/dealbreaker.ts` (harde filtre)

ToSom scorer kompatibilitet på seks forskningsbaserte dimensjoner. Sammen dekker de hele 0–100-skalaen, vekta mot en total resonansscore.

## Oversikt

| # | Dimensjon | Vekt | Instrument | Metrikke | Fallback (mangler skårer) |
|---|-----------|------|------------|----------|---------------------------|
| 1 | Verdier | 0,25 | PVQ-10 | `scoreValueCompat` (Pearson-korrelasjon) | ordoverlapp på kjerneverdier |
| 2 | Tilknytning | 0,25 | 12 items på angst/unnvikelse | `scoreAttachmentCompat` (stil-matrise) | relasjonsstil-overlap |
| 3 | Personlighet | 0,15 | BFI-10 (kortform av Big Five) | `scorePersonalityCompat` (per trekk) | ordoverlapp på personlighet |
| 4 | Kommunikasjon | 0,15 | 6 items (Gottman-prinsipper) | `scoreCommunicationCompat` (likhet) | ordoverlapp + stil-match |
| 5 | Emosjonsregulering | 0,10 | ERQ-6 | `scoreEmotionRegCompat` (reappraisal/undertrykking) | emosjonelle-behov-overlap |
| 6 | Livssituasjon | 0,10 | praktiske profildata | `scoreLifeSituationCompat` (defensiv tolkning) | — (alltid tilgjengelig) |

**Sum:** 1,00

## Regler for vekta

- Verdiene står i `DIMENSION_WEIGHTS` i `lib/matching/unifiedScorer.ts` — én kilde.
- Hver dimensjon returnerer 0–100 (høyere = dypere resonans).
- Totalscore = vekta sum over de seks.

## Psykometrisk-first, fallback til ordoverlapp

Motoren har to lag, per dimensjon:

1. **Psykometrisk** — om begge profiler har de skåra feltene (`bigFive`, `attachment`, `valueProfile`, `emotionRegulation`, `deepProfileData.communicationScores`), brukes den forskningsbaserte funksjonen i `dimensions.ts`.
2. **Fallback** — mangler én av profilene skårer, fell dimensjonen tilbake til dagens ordoverlapp-metode. Ingen bruker blir uten score, og gamle profiler (før F-5) fortsetter å fungere.

Skårene ligger i Profile-feltene `bigFive`, `attachment`, `valueProfile`, `emotionRegulation`, `deepProfileData`, `psychometricVersion` (lagde av F-3/F-6).

## Dealbreakere (harde filtre, WP1)

Kjøres **før** scoring i `sjekkAlleDealbreakers()` (`lib/matching/dealbreaker.ts`). En dealbreaker avviser paret uavhengig av score.

| # | Sjekk | Regel | Status |
|---|---|---|---|
| 1 | Kjønnspreferanse (bidireksjonell) | Begge parters valg fra onboarding steg 1 må akseptere den andre. Åpne valg («Alle kjønner», «Kjemisk tiltrekning», legacy «begge») matcher ethvert kjent kjønn. Ordforråd normaliseres (man/mann/male → man) | **Aktiv, ny (WP1)** |
| 2 | Alderspreferanse (bidireksjonell) | Kandidatens alder må ligge i begge parters `agePrefMin`/`agePrefMax` | **Aktiv, ny (WP1)** |
| 3 | Modenhets-gap | Gap > 4 → avvis | Aktiv |
| 4 | Livsrytme-konflikt | morgen↔kveld, rask↔rolig → avvis | Kodet, inaktiv (ingen datakilde) |
| 5 | Eksplisitte preferanser | `preferences.dealbreakers[]` mot `matchTags` | Kodet, inaktiv (ingen datakilde) |
| 6 | Grenser | `boundaries.excludes` mot kandidatens `includes` | Aktiv |
| 7 | Radius (bidireksjonell) | Over A **eller** B sin `distancePref` (haversine) → avvis. Manglende koordinater → ikke blokkert, logges | Aktiv |
| 8 | Sikkerhetsnivå | usikker(1)/ambivalent(2)/sikker(3), gap ≥ 2 → avvis. Blandet arv-staving normaliseres. Ukjent/manglende → blokkerer ikke | Aktiv, normalisert (WP1) |

**Mønsteret:** manglende eller ukjent data blokkerer aldri. Alle dealbreakere er **harde** — score kan ikke oppveie dem.

Avvisningene teller i `rejectReasons` i matcherunden (`app/api/cron/matching/rejectReason.ts` gir etikettene) — basis for tuning etter beta (M-12).

## Resonansnivå (tall → ord)

Én kilde: `toResonanceLevel` i `lib/matching/resonanceLevel.ts`.

| Score | Nivå |
|-------|------|
| ≥ 80 | Dyp resonans (DEEP) |
| 65–79 | Sterk resonans (STRONG) |
| 50–64 | God resonans (MODERATE) |
| 40–49 | Rolig resonans (GENTLE) |

> **F-9 — etterprøving:** Tersklene er kalibrerte for ordoverlapp-fordelingen. Med de skåra
> instrumentene vil fordelingen skifte. Fordelingen logges nå via `recordMetric` i
> matcherunden (`match.round.score_median`, `match.round.level`), slik at tersklene kan
> kalibreres på ny etter beta. Invariant I-12 holder: brukeren ser alltid ord, aldri tall.

## Hva resonans IKKE er

Resonans er en veiviser, ikke en fasit. Den er ikke kjærlighet, ikke en diagnose, og ikke
en garanti for at to personer passer sammen. For det komplette grunnlaget, se
`/forskningsgrunnlag` (app) og `docs/FORSKNINGSMOTOR-v1.0.md`.
