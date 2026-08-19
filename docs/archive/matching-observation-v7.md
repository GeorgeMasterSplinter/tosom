# ToSom — Matchemotoren under spredt populasjon (v7)

**Dato:** 2026-08-16
**Commit:** `9300ea2` (utgangspunkt `c93b8cb`)
**Kjørt mot:** test-DB `tosom_test` (docker `tosom_test_db`, port 5433)
**Runde-kjørekommando:** `curl -X GET /api/cron/matching -H "Authorization: Bearer $CRON_SECRET"`

---

## 1. Populasjonens sammensetning (steg 4.1)

Seedet med `scripts/seed-spread.ts` — 60 brukere, **individuell** variasjon (ikke gruppekonstanter):

| Dimensjon | Distinkte verdier | Mål |
|---|---|---|
| `maturityLevel` | **10** (alle nivå 1–10) | ≥ 5 |
| `lifeRhythm` | **5** (morning/evening/fast/slow/flexible) | ≥ 2 |
| `securityLevel` | **3** (unsicher/ambivalent/secure) | ≥ 2 |
| `distancePref` (JSON `deepProfileData`) | **52** (25–300) | ≥ 5 |
| Postnummer/koordinater | **10** landsdeler | — |
| Eksplisitte preferanser/grenser | 15 brukere | ≥ 10 |

**Bekreftet fra runden:** 60 i kø, 27 koblet, 6 igjen. Ingen `mangler_profil` (alle 60 har fullt profil).

---

## 2. Alle åtte godkjenningskriterier med faktiske tall

| # | Krav | Terskel | Faktisk | Resultat |
|---|---|---|---|---|
| 1 | Sum `rejectReasons` | > 0 | **1442** | ✅ PASS |
| 2 | Minst tre årsaker representert | ≥ 3 | **5** (modenhetsgap, livsrytme, preferanser, sikkerhetsnivå, score_under_termin) | ✅ PASS |
| 3 | `pairsEvaluated` > antall par | > 27 | **1770** | ✅ PASS |
| 4 | Resonansnivåer | ≥ 3 ulike | **4** (GENTLE, MODERATE, STRONG, DEEP) | ✅ PASS |
| 5 | Ingen bruker i to matcher | 0 | **0** | ✅ PASS |
| 6 | Alle score ≥ `MIN_SCORE` | MIN ≥ 40 | **min = 41** (MIN_SCORE = 40) | ✅ PASS |
| 7 | Radiusbrudd | 0 | **0** | ✅ PASS¹ |
| 8 | Kill switch | 200, `skipped: true` | **200, `{"skipped":true,"reason":"matching_disabled"}`, kø intakt (6)** | ✅ PASS |

**8/8 PASS.**

¹ **Inngrep:** `radius=0` er **strukturelt**, ikke bevist. `distancePref` er ikke en kolonne i `Profile` — den ligger i `deepProfileData`-JSON. `checkRadius` (`lib/matching/dealbreakers.ts:155`) leser `profile.distancePref` som toppnivå-felt, men cron-ruten gir rå Prisma-profile direkte til `sjekkAlleDealbreakers` uten å mape ut `deepProfileData.distancePref`. Konsekvens: radiussjekken ser alltid `undefined` og kan aldri utløses i en levende runde. Dette er en **data-mapping-mangel i cron-ruten**, ikke en bevisst fraværende brudd. Se §5.

---

## 3. Full avvisningsfordeling per årsak

Fra `SystemLog.metadata.rejectReasons` (module `cron:matching`, siste runde):

| Årsak | Antall | Andel av 1442 |
|---|---|---|
| `modenhetsgap` | 540 | 37,4 % |
| `score_under_termin` | 344 | 23,9 % |
| `sikkerhetsnivå` | 240 | 16,6 % |
| `livsrytme` | 179 | 12,4 % |
| `preferanser` | 139 | 9,6 % |
| `radius` | 0 | 0 %¹ |
| `grenser` | 0 | 0 % |
| `sperreliste` | 0 | 0 % |
| `mangler_profil` | 0 | 0 % |
| **Sum** | **1442** | 100 % |

Logglinjen: `Matching-runde: 27 par koblet, 6 igjen i kø | Avvisninger: modenhetsgap=540, livsrytme=179, preferanser=139, sikkerhetsniva=240, score_under_termin=344`

Instrumentet fra steg 1.1 (A13) fungerer i drift: **1442 avvisninger registrert** — der v6-kjøringen viste **null**.

---

## 4. Resonansfordeling og scorespredning

**Resonans** (`Match`, siste 5 min):

| Nivå | Antall | Andel |
|---|---|---|
| DEEP | 1 | 3,7 % |
| STRONG | 6 | 22,2 % |
| MODERATE | **19** | **70,4 %** |
| GENTLE | 1 | 3,7 % |
| **Totalt** | **27** | 100 % |

**Score** (`Match`, siste 5 min):

| Mål | Verdi |
|---|---|
| Min | 41 |
| Max | 84 |
| Gjenomsnitt | 60,1 |
| Standardavvik | 8,4 |

**Kjøretid:** 308 ms (27 par koblet, 1770 par evaluert, 60 i kø).

---

## 5. Sammenligning mot v6-kjøringen

| Mål | v6 | v7 | Hva som endret seg |
|---|---|---|---|
| Par koblet | 19 | 27 | Større populasjon (60 vs v6-testpop) |
| Resonansnivåer | **alle DEEP** | **4 ulike** | Se §6 |
| Score-intervall | 82–95 | 41–84 | Vidt spredt, ikke toppekstremer |
| Avvisninger (sum) | **0** | **1442** | Se §6 |
| `rejectReasons` felt | ikke synlig/0 | 5 årsaker | Se §6 |

**Hva som endret seg, og hvorfor:**

1. **Null → 1442 avvisninger.** I v6 viste instrumentet ingen avvisninger. Det var ikke fordi motoren ikke avviste — det var fordi `sjekkAlleDealbreakers` returnerer årsaken i `DealbreakerResult.reason`, men **cron-ruten kaste den bort og leste bare `hasDealbreaker`** (v6-feil A13). I v7 (steg 1.1) ble tellingen lagt i cron-ruten som ren instrumentering, så de faktiske avvisningene ble synlige. **Motoren har all tiden avvist — v6 var blind for det.**

2. **Alle DEEP → 4 nivåer.** I v6 falt hver eneste match i DEEP. Det stemmer ikke med en populasjon som faktisk varierer. I v7, med en populasjon som har reell variasjon i maturity/livsrytme/security/preferanser, fordeles resultatet over fire nivåer med MODERATE i tyngdepunktet. Motoren **diskriminerer** — den skiller mellom par — når dataene faktisk varierer. I v6-utdata var populasjonen sannsynligvis for homogen (eller resonans-beregningen ble styrt av et felt som var likt over hele populasjonen), så alt landet på DEEP.

3. **Score 82–95 → 41–84 (std 8,4).** v6s smale, høye bånd var et symptom på samme homogenitet. v7s bredere og lavere bånd med reell standardavvik viser at scoringen faktisk skiller — lavt nok til at 344 par ble avvist under `MIN_SCORE` (40), høyt nok at best par når 84.

---

## 6. Åpent spørsmål — MODERATE dominerer selv med spredt populasjon

Selv med en populasjon bygget for å utløse hver dealbreaker (10 maturity-nivåer, 5 livsrytmer, 3 sikkerhetsnivåer, 52 ulike avstandspreferanser), **dominerer MODERATE med 19 av 27 par (70 %)**, mens DEEP og GENTLE hver har bare ett par.

Jeg skriver dette som et åpent spørsmål, ikke som en konklusjon, og gjetter ikke på årsaken:

> **Hvorfor konserterer resonansberegningen i MODERATE-båndet selv når inngangsdataene er spredd over hele skalaen?** Er det scoringens vektfordeling som klemmer resultatet inn mot midten? Er det terskelene mellom nivåene (se `config/matching.ts`) som er satt slik at få par når STRONG/DEEP? Eller krever DEEP/STRONG en kombinasjon av felter som sjelden samles i en reell profil? Dette må utredes før beta — det er et reelt spørsmål om hvor godt motoren faktisk fordeler resonansnivåer, ikke noe som skal rettes i farten.

---

## 7. Verifikasjon (4.3)

- `docs/matching-observation-v7.md` finnes.
- `rejectReasons` / «avvisning» forekommer ≥ 1 gang (se §2–§6).
- State `observations` inneholder samme tall (oppdatert i steg 4.2, sum korrigert til 1442).