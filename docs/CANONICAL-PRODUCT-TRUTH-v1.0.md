# TOSOM — CANONICAL PRODUCT TRUTH v1.0

**Dato:** 2026-10-30
**Status:** GJELDENDE (A18 + global sannhets-svep, 30.10.2026)
**Formål:** Én ingeniør/produkt-sannhetsindeks. Fremtidige agenter finner
produkt-sannheten her — uten å audits hele repoen.
**Guard:** `__tests__/canonical-product-truth.test.ts` (CPT-01–15) låser disse
tallene mot drift.

---

## 1. Kanonisk produkt-sannhet

| Faktum | Verdier | Kanonisk kilde (kode) |
|---|---|---|
| Minimumsalder | **18** | `config/legal.ts` → `MIN_AGE = 18` |
| Egen alder (valg) | 18–99 | `lib/validation/onboarding-setup.ts` (`basicProfileSchema.age`), `lib/validation/onboarding-steps.ts` |
| Alderspreferanse (min) | 18–99 | `lib/validation/onboarding-setup.ts` (`agePrefMin`) |
| Alderspreferanse (maks) | 18–98 eller **null = 99+** | `lib/validation/onboarding-setup.ts` (`agePrefMax`, nullable) |
| 99+ | **ÅPEN øvre grense** (ingen øvre match-alder) | `agePrefMax: null` + `lib/matching/dealbreaker.ts` |
| Nybruker-default preferanse | **18–40** (pre-fill, redigerbar) | `app/onboarding/OnboardingFlow.tsx` |
| Eksisterende lagrede preferanser | **URØRT** (ingen retroaktiv endring) | `lib/profile/toOnboardingData.ts` |
| Matching-kadens | **ÉN RUNDE I UKEN, NATT TIL LØRDAG** (lørdag 02:00–04:00 UTC) | `vercel.json` → `crons` (`0 2,3,4 * * 6`) + `app/api/cron/matching/route.ts` (advisory lock + ukentlig watchdog) |
| Match-garanti | **NEI** — finner vi ingen som passer godt nok, venter du til neste runde | `components/dashboard/WaitingForMatch.tsx`, `public/llms.txt` |
| Reiselengde | **14 DAGER (TO UKER)** | `config/journey.ts` → `JOURNEY_TOTAL_DAYS = 14` |
| Journey-faser | 1–7 EARLY (uten bilder) / 8–10 BUILDING_TRUST (bilder) / 11–12 DEEPER / 13–14 CHECKIN | `config/journey.ts` → `JOURNEY_PHASES` |
| Billedåpning | **FRA DAG 8** (første uke uten bilder; deling er valgfritt) | `config/journey.ts` → `PHOTO_REVEAL_DAY = 8` + `lib/journey/engine.ts` → `isPhotosAllowed(day) = day >= 8` |
| Fullføringsbeslutningsvindu | 72 timer fra dag 14 | `config/journey.ts` → `COMPLETION_DECISION_WINDOW_HOURS` |
| PDF-grace etter reiseslutt | 24 timer (tekst som PDF, ingen bilder) | `app/api/journey/exit/route.ts` |
| Bli Kjent V2 (spørsmål) | **180 = 12×15** | `app/questions/data/questions.ts` (FROZEN) |
| Oppgaver V2 (oppgaver) | **135 = 9×15** | `app/chat/data/tasks.ts` (FROZEN) |
| Pris (i dag) | **GRATIS** — begrenset beta, registrering via invitasjon | `config/legal.ts` → `PRICING.freeUserCap` (5000) |
| Pris (fremtidig plan, ikke aktiv) | **349 NOK** engangsbetaling per 14-dagersreise, Vipps, ingen abonnement | `config/legal.ts` → `PRICING.journeyPrice` |
| Onboarding | 13 steg, bokmål | `app/onboarding/` (O1 FROZEN, unntatt A18-alder) |
| Egne spørsmål | Inspirert av etablert psykologi; IKKE psykologiske tester/kliniske skjema | `app/onboarding/data/questions.ts`, `public/llms.txt` |

## 2. Maskinelesbar sannhet (må holdes alignet)

- `public/llms.txt`
- `ai/system_prompt.md`
- `ai/system_skisse.md`

## 3. Historiske dokumenter (ADVARSEL)

`docs/archive/**` og daterte rapporter/planer (f.eks. `TOSOM-BETA-VURDERING`,
`LanseringsCheckList`, `MATCHING-TUNING-PLAN`, `FINAL-FREE-BETA-GO-NO-GO`,
`ads/tiktok/tosom_tiktok_v1.md`) beskriver **tidligere** sannhet (21+, 30-dagers
reise, dag-15-bilder, tidligere alder). De er historiske bevis og må IKKE
omskrives. Grep-treff på «21+», «30 dager», «dag 15» i disse filene er
forventet og bevisst beholdt.

## 4. Allowlist (lovlige ikke-produktbruker av tallene)

| Tall | Lovlig bruk | Eksempler |
|---|---|---|
| 21 | Bio-lengdekrav («minst 21 tegn») | `lib/profile/userProfile.ts`, `components/profile/ProfileForm.tsx` |
| 24 timer | PDF-grace, GDPR-svarfrist (30 d), kontakt-svartid, admin-statistikk, auth/dev-login cookies, journey dag-lås, stillhetimpuls (48 t) | `app/api/journey/exit/route.ts`, `app/personvern/page.tsx`, `components/ui/microcopy.ts` |
| 30 dager | Auth-cookie levetid, GDPR-svarfrist, analytics-vindu, retention-varsling, relasjonsmilepæl «1 måned sammen» | `app/cookies/page.tsx`, `lib/privacy/retention.ts`, `app/api/relationship/milestones/route.ts` |
| 15 | Oppgaver per kategori (9×15), spørsmål per kategori (12×15), ID-er, datoer | FROZEN-filene over |
| dag 15/30 | Legacy-markert døde kode (30-dagersmodell) | `components/journey/PremiumJourneyProgressTracker.tsx` (uaktiv), `scripts/seed-journey-content.ts` (legacy-seed) |
| «Voksne 21+» i kommentar | Historisk header-kommentar i FROZEN-fil | `app/questions/data/questions.ts:5`, `app/chat/data/tasks.ts:5` |

## 5. Forbudt aktiv sannhet (guard: CPT)

- «minimum 21» / «21+» / «23+» som Tosom-alderskrav
- «match innen 24 timer» / «daglig matching» / «match i morgen»
- «30-dagers reise» / «dag 30»
- «bilder fra dag 15» / «dag-15-avdekking»

## 6. Endring av denne sannheten

Krever: dokumentert produktbeslutning (George) + konkret runtime-endring +
advokatkorreksjon der alder/juridisk sannhet er berørt + verifisert testoppdatering.
Ingen casual copy-drift.