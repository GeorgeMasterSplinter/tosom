# AGE-18-CONVERSION-ACT — 18+ KONVERTERING (29.10.2026)

> **STATUS:** IMPLEMENTERT I WORKING TREE — **STOPP FØR COMMIT** (George, 29.10).
> Ingen commit, ingen push, ingen deploy. Ingen brukere invitert.
> **LEGAL REVIEW: PENDING** — ingen juridisk godkjenning påstås.
>
> **BASELINE:** A18-working tree er basert på O1-baseline **3f40838**
> («test: lock onboarding language and age preference truth») = main =
> origin/main = deployed O1+AGE99-checkpoint. 511959b + 01d1ce1 + 3f40838 er
> alle ancestors av HEAD (verifisert 30.10). Tidligere rapportreferanse til
> 0a3aca8 var en rapporteringsfeil (0a3aca8 = pre-O1 BRAND-HEADER-commit).
>
> Kildeplan: `docs/AGE-18-CONVERSION-PLAN-v1.0.md` (godkjent).
> Produktbeslutninger D1–D8: godkjent av George, 29.10.

---

## A. Produktbeslutning (godkjent 29.10.2026)

| # | Beslutning |
|---|------------|
| D1 | Minimumsalder endres fra 21+ til **18+** |
| D2 | Ingen under 18 år er eligible for Tosom |
| D3 | Nye brukere får synlig/redigerbar foreslått alderspreferanse **18–40** — KUN default/pre-fill. Fremstilles IKKE som anbefalt/kompatibilitetsberegnet |
| D4 | Eksisterende lagrede alderspreferanser endres **IKKE** (ingen backfill) |
| D5 | 99+ semantikk uendret: `agePrefMax = null` → ingen øvre matchalder |
| D6 | Aldersmatching forblir **bidireksjonell** (begges eksplisitte preferanser må tillate den andre) |
| D7 | Ingen skjult aldersgap-regel innføres |
| D8 | 18+ implementeres som Tosoms **produktgrense** |

## B. Runtime-aldermodell (etter ACT)

- **Egen alder:** 18–99 (maks uendret). `MIN_AGE = 18` server-side.
- **Preferanse (partner):** min 18, maks endelig 18–98, eller `null` = 99+ (åpen).
- **Default for nye:** 18–40 (synlig pre-fill, redigerbar).
- **Eksisterende:** lagret verdi pre-fylls uendret (21–40 forblir 21–40).
- **Matching:** bidireksjonell `agePrefMin <= alder <= agePrefMax` (`null` = åpen). Ingen skjult regel.
- **Kø:** `profile.age < MIN_AGE` → 409 (ny eksplicit guard).

## C. Kanonisk MIN_AGE

`config/legal.ts`: **`MIN_AGE = 18`** (var 21). Én kilde. Kommentar i filen
oppdatert med A18-dato + liste over avhengige valideringsfiler.

## D. Egen alder — hardkodet-21-fjerning (mål: 0 runtime-literaler)

| Fil | Felt | Før | Etter |
|-----|------|-----|-------|
| `lib/validation/onboarding-setup.ts` | `age` | `.min(21, 'Du må være minst 21 år')` | `.min(MIN_AGE, \`Du må være minst ${MIN_AGE} år\`)` |
| `lib/validation/onboarding-setup.ts` | `agePrefMin` | `.min(21).max(99)` | `.min(MIN_AGE).max(99)` |
| `lib/validation/onboarding-setup.ts` | `agePrefMax` | `.min(21).max(98).nullable()` | `.min(MIN_AGE).max(98).nullable()` |
| `lib/validation/profile.ts` | `age` (create) | `.min(21).max(100)` | `.min(MIN_AGE).max(100)` |
| `lib/validation/profile.ts` | `age` (full) | `.min(21).max(100).default(25)` | `.min(MIN_AGE).max(100).default(25)` |
| `lib/validation/api.ts` | `profileSetupSchema.basic.age` | `.min(21).max(100)` | `.min(MIN_AGE).max(100)` |

Alle tre filene importerer nå `MIN_AGE` fra `@/config/legal` (ingen sirkulære
importer — `config/legal.ts` har ingen app/avhengigheter).

UI (frontend-gate, `app/onboarding/steps/Step1Profile.tsx`):
- `mikroguiding="Må være minst 21"` → `` mikroguiding={`Må være minst ${MIN_AGE}`} ``
  (funn underveis i ACT — en aktiv 21-minimum i UI som ikke var i PLANs liste).
- Feilmeldingen var allerede interpolert (`Du må være minst ${MIN_AGE} år.`).

Hard invariant: **17 → REJECT, 18 → ACCEPT** (server-side, testet A18-01/02/14).

## E. Preferansealder

- `agePrefMin`: min 18 (via MIN_AGE), maks 99 (uendret).
- `agePrefMax`: min 18 (via MIN_AGE), maks endelig **98** (uendret), `null` = 99+ (uendret).
- Ingen sentinel-tall, ingen null-semantikk-endring.

## F. Default 18–40 (nye brukere)

- `app/onboarding/OnboardingFlow.tsx` `initialData`: `agePrefMin: 21` → `agePrefMin: 18`
  (max 40 uendret). Kun virker når ingen lagret preferanse/draft finnes.
- Synlighet: feltene `ob-age-pref-min`/`ob-age-pref-max` viser 18/40 for nye.
- Copy (D3): hjelpeteksten «Velg det aldersspennet du er komfortabel med. Vi har
  foreslått et utgangspunkt — endre det hvis du ønsker.» er **urørt** — den sier
  allerede «foreslått utgangspunkt», aldri «anbefalt»/«best»/«kompatibilitetsberegnet».
- Dead legacy-felt (`minAge`/`maxAge` i initialData) er bevisst urørt (OCL-01 låser at
  ingen leser dem).

## G. Eksisterende brukere (D4)

- **Ingen backfill, ingen stille endring.** `toOnboardingData` pre-fyller lagret
  `deepProfileData.agePrefMin/agePrefMax` uendret: lagret 21–40 pre-fylls som 21–40.
  Regression: **A18-09** (`__tests__/age18-conversion.test.ts`) — lagret 21–40 må
  pre-fylles som 21–40, IKKE 18–40.
- Ny default gjelder KUN ekte manglende preferanse (ny profil/ny draft).

## H. 99+

Uendret. `agePrefMax = null` = åpen øvre grense (ingen øvre alder-avvisning i
matching). Endelig maks = 98. 99 finnes kun via 99+. AGE99-testene (AGE99-01…13)
kjører urørt og grønne. 18–99+ er testet (A18-05: 18 med 18–99+ matcher 99-åring).

## I. Kø-guard (D2 — forsvarsdybde)

`app/api/journey/queue/route.ts` (POST): ny eksplicit sjekk etter
`onboardingComplete`-sjekken:

```ts
if (user.profile && user.profile.age != null && user.profile.age < MIN_AGE) {
  return NextResponse.json(
    { error: `Tosom er for personer som har fylt ${MIN_AGE} år.` },
    { status: 409 }
  );
}
```

- **Status 409** — repo-konvensjon i samme rute (onboardingComplete-konflikt = 409;
  422 finnes ikke i ruten; 400 er reservert for ugyldig input, 409 for «kan ikke
  stille i kø i denne tilstanden»).
- Brukermeldingen er kort og faktabasert, uten intern valideringsdetalj.
- `profile.age` hentes i samme `findUnique`-query
  (`select: { profile: { select: { age } } }`).
- Manglende profil-alder (inconsistent state) avvises IKKE av guarden —
  onboarding-valideringen (MIN_AGE) er den primære sperren, og en slik profil
  kan ikke opprettes via støttet flyt.
- Test: **A18-13** (alder 17 + onboardingComplete → 409; alder 18 → guarden
  utløses ikke) + **A18-15** (cron leser kun QUEUED+onboardingComplete;
  onboardingComplete settes kun bak MIN_AGE-validering).

## J. Bidireksjonell matching

Uendret. `lib/matching/dealbreaker.ts` har **0 diff** (OCL-15 hash låst grønn).
Altså: A↔B krever at A er innen B sitt intervall OG B er innen A sitt.
Ingen ensidig override, ingen skjult aldersgap (D7).

**Aldermatrise (testet, A18-aldermatrise):**

| Par | A sin preferanse | B sin preferanse | Resultat |
|-----|------------------|------------------|----------|
| 18 ↔ 18 | 18–99+ | 18–99+ | matcher |
| 18 ↔ 19 | 18–99+ | 18–99+ | matcher |
| 18 ↔ 20 | 18–40 | 18–40 | matcher |
| 18 ↔ 25 | 18–40 | 18–40 | matcher |
| 18 ↔ 40 | 18–40 | 18–40 | matcher (40 ∈ 18–40) |
| 19 ↔ 30 | 19–99+ | 20–99+ | blokkert (19 < 20) |
| 25 ↔ 18 | 18–40 | 20–99+ | matcher (begge retninger) |

Resultatet kommer KUN fra begge parters eksplisitte preferanser.

## K. Publik copy (endret)

| Fil | Endring |
|-----|---------|
| `components/ui/layout/Hero.tsx` | «voksne (21+)» → «voksne (18+)» |
| `components/ui/age-badge/AgeBadge.tsx` | badge «21+» → «18+» + title |
| `components/AgeRequirement.tsx` | «21 år eller eldre» → «18 år eller eldre» |
| `app/login/page.tsx` | «har fylt 21 år» → «har fylt 18 år» |
| `app/personvern/page.tsx` | «voksne (21+)» → «voksne (18+)» (current truth) |
| `public/llms.txt` | «For voksne (21+)» → «For voksne (18+)» |

Routes sjekket uten aktiv 21+-claim (ingen endring): /hvorfor, /motpol,
/slik-fungerer-det, /metoder, /reisen, /priser, /tips, /faq, /om-oss, /trygghet,
/cookies, /tilgjengelighet.

**Posisjonering (D16/§16):** endret KUN tallet. Ingen youth/teen/student/Gen Z-
positionering. 18+ er eligible — ikke ny brand identity.

## L. Legal current truth

- `app/personvern/page.tsx` §2.1: «Tosom er kun for voksne (18+).»
- `app/vilkar/page.tsx` + `app/trygghet/page.tsx`: **uendret** — de leser ALDRERE
  dynamisk `MIN_AGE` (viser nå 18 automatisk). Ingen andre 18-er hardkodet.
- `config/legal.ts`: **TERMS_VERSION/TERMS_UPDATED** og **PRIVACY_VERSION/
  PRIVACY_UPDATED** → 2026-10-29 / «29. oktober 2026» (faktisk produktendring i
  vilkår + personvern; eksisterende brukere får rolig om-aksept ved neste
  innlogging — etablert mekanisme).
- Ingen juridisk tolkning omskrevet. Ingen approval påstås.

## M. Safety

- `docs/BETA-OPENING-RUNBOOK-v1.0.md` (Under-alder-mistanke): «under 21 (eller
  under 18)» → «under 18 (minimumsalderen, A18)».
- Slettes/ban-fløyen refererer til «oppdaget aldersgrense-brudd» generelt — ingen
  alder-literal, ingen endring.
- NY kø-guard (§I) = ny safety-sperring for under-18 i køen.
- Ingen annen moderasjonslogikk endret.

## N. Tester

**Ny suite:** `__tests__/age18-conversion.test.ts` — A18-01…A18-15 + aldermatrise
(37 tester): 17-reject / 18-accept (steg + skjema), MIN_AGE-kanonisk,
preferanse-min 18, 99+ åpen + 18–99+, endelig maks 98/99, bidireksjonell
bevart, 18 omgår ikke andre dealbreakere, lagret 21–40 urørt, 0 aktiv 21+ (publik/
maskinlesbar/legal), under-18 kø-reject (rute-test), setup-reject,
under-18-kan-ikke-bli-eligible.

**Oppdatert:** `login-age-18.test.ts` (erstatter login-age-21),
`onboarding-steps-validation` (17/18), `onboarding-language-clarity` OCL-10/15
(ny SHA-256), `e2e/tests/onboarding.spec.ts` (21–99+ → 18–99+ + 3 nye A18-tester).

**Uendret (kjørt grønt):** AGE99-01…13, dealbreaker-gender-age, matching, consent,
OCL-resten, frozen-library-tester.

## O. Historiske docs (bevart, IKKE omskrevet)

`ONBOARDING-LANGUAGE-CLARITY-ACT-v1.0.md`, `BETA-TEST-PLAN-v1.0.md`,
`JURIDISK-GRUNNLAG-v1.0.md`, `PAYMENT-VIPPS-PLAN-v1.0.md`, `LanseringsCheckList.md`,
`docs/archive/`, `docs/snapshots/` — beskriver sant 21+-oppførsel som historisk
tilstand.

**Oppdatert (current operational truth):** `README.md`, `ai/system_prompt.md`,
`ai/system_skisse.md`, `docs/TOSOM-SUPER-MASTERPLAN-v2.0.md` (2),
`docs/reference/SYSTEM-FLOW-DIAGRAM.md` (I-14), `docs/BETA-OPENING-RUNBOOK-v1.0.md`.

## P. Advokatflag (PENDING)

Faktisk produktendring lagt i `docs/LEGAL-REVIEW-PACKAGE-v1.0.md` (§A18).
Spørsmål til jurist (besvares IKKE på deres vegne):

1. Noen juridisk grunn til å beholde 21?
2. Krever 18–20-årige spesiell personvern-ordlyd (f.eks. art. 9-samtykke for
   nyelig myndige, sensitive data om religion/intimitet/seksuell orientering)?
3. Påvirkning på art. 9-samtykke-mekanismen for de nyelig eligible (18–20)?
4. Markedsførings-/safety-hensyn knyttet til lavere minimumsalder?

**LEGAL REVIEW: PENDING.** Ingen juridisk godkjenning påstås hvor som helst.

## Q. Sluttresultat

| Post | Verdi |
|------|-------|
| Kanonisk MIN_AGE | 18 (`config/legal.ts`) |
| Hardkodet 21 i runtime-validering | 0 (6 koblet til MIN_AGE) |
| Egen alder | 18–99 (17 REJECT / 18 ACCEPT) |
| Preferanse | min 18, maks 98 eller 99+ (null) |
| Ny default | 18–40 (synlig, redigerbar) |
| Eksisterende preferanser | urørt (A18-09) |
| 99+ | åpen øvre grense — uendret |
| Kø-guard | under 18 → 409 (A18-13/15) |
| Bidireksjonell matching | bevart (dealbreaker 0 diff) |
| Konsent | 0 diff |
| Matching-kode | 0 diff |
| Prisma/migrasjon/backfill | NEI / NEI / NEI |
| Commit/push/deploy | NEI / NEI / NEI |
| Legal review | PENDING |
| Real users invited | NEI |
| O1-baseline (A18 er bygget på) | 3f40838 (= HEAD = origin/main = deployed O1+AGE99-checkpoint) |

## R. GLOBAL PRODUKT-SANNHET-SVEP (30.10.2026)

Formål: ÉN godkjent aktiv produkt-sannhet (alder 18+ / ukentlig matching natt
til lørdag / 14-dagersreise / bilder fra dag 8) over runtime, publik,
onboarding, metadata, maskinelesbart, legal, tester, e-post og kommentarer.
Ingen applikasjonsemantikk endret — kun stale aktive claims rettet.

### R.1 Runtime-verifisering (kjørepåstand bekreftet, ikke kun copy)

| Runtime | Faktum | Bevis |
|---|---|---|
| Matching | **UKENTLIG, NATT TIL LØRDAG** | `vercel.json` cron `0 2,3,4 * * 6` (dow=6=lørdag, 02:00–04:00 UTC) + `app/api/cron/matching/route.ts` (advisory lock, ukentlig watchdog «runden kjører en gang i uken») |
| Journey | **14 DAGER** | `config/journey.ts` → `JOURNEY_TOTAL_DAYS = 14`, faser slutter dag 14 |
| Foto | **FRA DAG 8** | `config/journey.ts` → `PHOTO_REVEAL_DAY = 8`; `lib/journey/engine.ts` → `isPhotosAllowed(day) = day >= 8` (dag 7 false / dag 8 true) |
| Fullføringsvindu | 72 timer fra dag 14 | `config/journey.ts` → `COMPLETION_DECISION_WINDOW_HOURS` |

### R.2 Rette aktive stale claims (målrettet, ingen blindtall-erstatning)

| Fil | Rettelse |
|---|---|
| `app/reisen/page.tsx` | «har fylt 21» → «har fylt 18» (CTA-området) |
| `components/journey/JourneyView.tsx` | «30 dager» ×2 → `${JOURNEY_TOTAL_DAYS} dager` (kanonisk import) |
| `ai/system_prompt.md` | 30-dagers ×7 → 14-dagers; faser 1-14/15-21/22-25/26-30 → 1-7/8-10/11-12/13-14 (dag 8: bilder) |
| `ai/system_skisse.md` | 30-dagers ×6, dag 30 ×4, dag 15 ×4, «dag-N/30», «Dag X/30», «dag 1-29» → 14/8/14-modell |
| `scripts/setupE2eJourneys.ts` | milestone-summary «30 dager» → «14 dager» |
| `scripts/seed-journey-content.ts` | LEGACY-markør (30-dagersmodell, erstattet av config/journey 7/14-modell) |
| `components/journey/PremiumJourneyProgressTracker.tsx` | LEGACY-markør (uaktiv 30-dagers-grid; ikke importert) |
| `__tests__/photo-lock-before-day15.test.ts` | omdøpt → `photo-lock-before-reveal.test.ts` (innhold uendret; filnavnet var dag-15-relikv) |

### R.3 Beholdt (allowlist / historisk / fryst)

- **21:** «minst 21 tegn» bio-lengde (2 filer); fryste header-kommentarer
  «Voksne 21+» i `questions.ts`/`tasks.ts` (frost-strategi: guard, ikke churn);
  `ads/tiktok/tosom_tiktok_v1.md` (datert kreativ 15.09, nevner Vipps-innlogging
  som ikke er implementert — historisk leveranse).
- **24 timer:** PDF-grace (journey/exit, chat, reisen/avslutning, vilkår),
  GDPR-svarfrist, kontakt-svartid, admin-statistikk, auth/dev-login cookies,
  dag-lås, stillhetimpuls (48 t) — alle lovlig, berørt 0.
- **30 dager:** auth-cookie, GDPR, analytics-vindu, retention, relasjonsmilepæl
  «1 måned sammen» — berørt 0.
- **Historiske docs:** `docs/archive/**`, daterte rapporter — 0 endringer.
- **E-post:** velkomst-e-posten var allerede alignet («14 dager … fra dag 8») —
  0 endringer. Onboarding-queue-copy var allerede «natt til lørdag» — 0 endringer.

### R.4 Ny guard + sannhetsindeks

- `__tests__/canonical-product-truth.test.ts` — **CPT-01…15** (aldersruntime,
  aktiv publik/llms/AI-alder, journey-runtime, foto-runtime, matching-cron-kadens,
  ingen match-innen-24h, Bli Kjent 180/12×15, Oppgaver 135/9×15, legal-align).
- `docs/CANONICAL-PRODUCT-TRUTH-v1.0.md` — kanonisk kildeindeks + allowlist +
  historisk-dokument-varsel.

### R.5 Resultat

- ACTIVE stale 21+/23+ aldersclaims: **0**
- ACTIVE stale match-innen-24h claims: **0**
- ACTIVE stale 30-dagersreise claims: **0**
- ACTIVE stale dag-15-bilde claims: **0**
- A18-semantik intakt (A18-01…15 grønn), O1 intakt (OCL/AGE99 grønn),
  Bli Kjent V2 / Oppgaver V2 fryst (CPT-13/14 grønn).