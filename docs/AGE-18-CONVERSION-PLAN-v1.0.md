# TOSOM — AGE 18 CONVERSION PLAN v1.0 (A18)

**Dato:** 29.10.2026 · **For:** Qwen/Cline og George
**Status:** PLAN — ingen kode endret, ingen commit/push/deploy
**Kildehierarki:** koden > system_prompt > SUPER-MASTERPLAN > Splinter > spesialplaner (se ACT-PIPELINE §2)

---

## 0. PRE-FLIGHT

| Sjekk | Resultat |
|---|---|
| Branch | `main` |
| main = origin/main | JA — `git rev-list --left-right --count origin/main...main` = `0 0` |
| HEAD SHA | `3f40838` (test: lock onboarding language and age preference truth) |
| Deployed SHA | Ulesbar fra repo (Vercel). Prod kjører siste grønne CD ifølge GEORGE.md |
| Production health | `GET https://www.tosom.no/api/system/health` → **200** `{"status":"ok"}` |
| Working tree | Rens, unntatt untracked: `docs/IDENTITY-TRUST-PLAN-v1.0.md` (FROZEN — røres ikke) og `tmp/` |

FROZEN: Onboarding O1, Bli Kjent V2, Oppgaver V2, `docs/IDENTITY-TRUST-PLAN-v1.0.md`.

---

## A. EXECUTIVE SUMMARY

ToSom er i dag **21+** med én kanonisk konstant (`MIN_AGE = 21` i `config/legal.ts`), men med **seks hardkodede duplikater** av 21 i Zod-skjemaene. Konvertering til 18+ er **teknisk enkel og lavrisiko**:

1. **Én konstant** endres: `MIN_AGE = 18`.
2. **Seks hardkodede 21-tall** i validering byttes ut (ideelt: kobles til `MIN_AGE`).
3. **Offentlig copy/metadata**: ~8 aktive steder med «21+»/«21 år» → «18+»/`${MIN_AGE}`.
4. **Ét juridisk tekststed**: `personvern` («voksne (21+)» → «voksne (18+)») — FACTUAL AGE UPDATE, men med advokatnotat.
5. **DB: ingen migrasjon, ingen backfill** — `age` er en vanlig `Int` uten constraint.
6. **99+ semantikk: uendret. Bidireksjonell matching: uendret. Eksisterende lagrede preferanser: uendret.**
7. **Nytt:** én eksplicit server-side under-18-guard i `app/api/journey/queue/route.ts` (forsvarsdybde; dagens beskyttelse støtter seg på at under-18 aldri fullfører onboarding).


---

## B. CURRENT AGE ARCHITECTURE

Alderen i ToSom i dag:

- **Selvrapportert** hel-tall `age` (Profile.age), satt i onboarding steg 1. Ingen fødselsdato lagres. Ingen aldersverifisering i beta (Vipps er inaktiv).
- **Preferanse** `agePrefMin` / `agePrefMax` (Profile.deepProfileData). `agePrefMax = null` = 99+ (åpen øvre grense, REV 1.2). Endelig maks: 21–98.
- **Matching** leser preferansene bidireksjonelt i `checkAgePreference` (dealbreaker). Ingen skjult aldersgap-regel, ingen MIN_AGE-sjekk i matching-køen i dag.
- **DISPLAY**: `lib/onboarding/age-label.ts` (formatAgePrefRange) renderer faktisk tall («21–40») eller «35–99+».

## C. CANONICAL AGE SOURCES

**Konklusjon: delvis sentralisert.** Kanonisk kilde finnes (`MIN_AGE`), men valideringsskjemaene dupliserer 21 hardkodet.

| # | FILE | FELD/KONSTANT | DAGENS VERDI | KONSUMENTER |
|---|---|---|---|---|
| 1 | `config/legal.ts:91` | `MIN_AGE` | 21 | onboarding-steps.ts, Step1Profile.tsx (klient), vilkar/trygghet/login-sider, tester |
| 2 | `lib/validation/onboarding-steps.ts:99,131,143` | `age`/`agePrefMin`/`agePrefMax` mot `MIN_AGE` | bruker MIN_AGE (dynamisk) | steg-gate + pre-flight (server) |
| 3 | `lib/validation/onboarding-setup.ts:50` | `age: z.coerce.number().min(21, 'Du må være minst 21 år').max(99)` | **hardkodet 21** | POST /api/profile/setup |
| 4 | `lib/validation/onboarding-setup.ts:66` | `agePrefMin: min(21).max(99)` | **hardkodet 21** | POST /api/profile/setup |
| 5 | `lib/validation/onboarding-setup.ts:70` | `agePrefMax: min(21).max(98).nullable()` | **hardkodet 21** (99+ = null) | POST /api/profile/setup |
| 6 | `lib/validation/profile.ts:9,23` | `profileCreateSchema.age: min(21).max(100)`, `profileUpdateSchema.age: min(21).max(100).default(25)` | **hardkodet 21** | app/api/profile/route.ts (profil-oppdatering) |
| 7 | `lib/validation/api.ts:113` | `age: z.number().min(21).max(100).optional()` | **hardkodet 21** | app/api/match/score/route.ts (matchScoreSchema) |
| 8 | `app/onboarding/steps/Step1Profile.tsx:46,76,131,143` | klient-validering mot `MIN_AGE` | bruker MIN_AGE (dynamisk) | onboarding UI |

**Ikke i tabellen (bevisst): matching-køen og matching-cron** — ingen alderstak der i dag (se G).

Kildehierarki-festet: `__tests__/onboarding-language-clarity.test.ts` (OCL-10) låser `MIN_AGE === 21`, og OCL-15 låser **SHA-256-hashes** av valideringsfilene — disse må oppdateres i A18-ACT.

## D. RUNTIME VALIDATION (eget alder + preferanse)

**Egen alder — dagens flyt:**
onboarding steg 1 (UI, MIN_AGE) → `validateOnboardingStep` (server, MIN_AGE) → `/api/profile/setup` Zod (hardkodet 21) → `Profile.age` (Int, 18–99 etter endring) → prefill via `lib/profile/toOnboardingData.ts` → vises som tall i chat/dag.

**Nødvendige endringer (implementeres IKKE nå):**

| FILE | DAGENS | PROPOSERT |
|---|---|---|
| `config/legal.ts` | `export const MIN_AGE = 21;` | `export const MIN_AGE = 18;` |
| `lib/validation/onboarding-setup.ts:50` | `.min(21, 'Du må være minst 21 år')` | `.min(MIN_AGE, …)` — meldingen interpoleres (import MIN_AGE) |
| `lib/validation/onboarding-setup.ts:66,70` | `.min(21)` | `.min(MIN_AGE)` |
| `lib/validation/profile.ts:9,23` | `.min(21)` | `.min(MIN_AGE)` (import) |
| `lib/validation/api.ts:113` | `.min(21)` | `.min(MIN_AGE)` (import) |
| `onboarding-steps.ts`, `Step1Profile.tsx` | bruker MIN_AGE | **ingen endring** — meldingene oppdateres automatisk |

## E. AGE PREFERENCE (valgt partners alder)

Dagens O1-faktum (bekreftet i `OnboardingFlow.tsx:161`, `Step1Profile.tsx:143-151`, `dealbreaker.ts:215-237`):

- Default: `agePrefMin = 21`, `agePrefMax = 40`.
- Maks: 99+ → `agePrefMax = null` (åpen øvre grense, ingen maks-dealbreaker).
- Endelig maks: 21–98. Min: 21–99.
- Manglende/ugyldig preferanse blokkerer aldri (forsvarlig, som radius).

Nødvendige endringer (99+-semantikken rørtes IKKE):

| PLASS | DAGENS | PROPOSERT |
|---|---|---|
| UI (Step1Profile.tsx) | min-validering `>= MIN_AGE`; `safeMinAge` fallback = MIN_AGE | **Ingen endring** — leser MIN_AGE. Laveste velgbar min blir 18 automatisk |
| `onboarding-setup.ts:66` | `agePrefMin min(21).max(99)` | `min(MIN_AGE).max(99)` |
| `onboarding-setup.ts:70` | `agePrefMax min(21).max(98).nullable()` | `min(MIN_AGE).max(98).nullable()` |
| Default i `OnboardingFlow.tsx:161` | `agePrefMin: 21` | **Beslutning W-1** (se W): A=21, B=18 |
| Prefill (`toOnboardingData.ts`) | leser `deepProfileData` | **Ingen endring** — leser lagret verdi |
| Oppsummering (`formatAgePrefRange`) | render faktisk tall | **Ingen endring** |
| Profil-redigering | via `profileUpdateSchema` (age, ikke preferanse) | **Ingen endring** (preferanse endres kun i onboarding) |
| Matching (`dealbreaker.ts`) | bruker lagret `agePrefMin/Max` | **Ingen endring** |
| Tester | låser 21 | oppdateres (se P) |

**Konklusjon:** at den laveste velgbare preferanse-alderen støtter 18, krever kun `min(21)` → `min(MIN_AGE)` i onboarding-setup. 99+ er uendret.

## F. BIDIREKSONELL ALDER-MATCHING (verifisert mot runtime)

Kilde: `lib/matching/dealbreaker.ts:215-237`. `checkAgePreference` er **tosidig**: `checkAgePreferenceOneWay(a,b) ?? checkAgePreferenceOneWay(b,a)`. Én retning blokkerer → dealbreaker. Ingen skjult aldersgap-regel. Ingen MIN_AGE i matching-koden.

**Matrise (matcher KUN dersom begge parters eksplicitte intervall tillater):**

| A (alder, pref) | B (alder, pref) | A dekker B? | B dekker A? | MATCH? |
|---|---|---|---|---|
| 18 (18–99+) | 18 (18–99+) | ja | ja | **JA** |
| 18 (18–99+) | 20 (18–99+) | ja | ja | **JA** |
| 18 (18–40) | 25 (18–40) | ja | ja | **JA** |
| 18 (18–40) | 40 (18–40) | ja (40≤40) | ja (18≥18) | **JA** |
| 19 (19–99+) | 30 (20–99+) | 30 ∈ 19–99+ → ja | 19 ∈ 20–99+? → **nei** (19<20) | **NEI** |
| 25 (18–40) | 18 (20–99+) | 18 ∈ 18–40 → ja | 25 ∈ 20–99+ → ja | **JA** |

**Konklusjon:** matchingen er allerede rent bidireksjonell og preferansebasert. Endring 21→18 berører IKKE matching-logikken (den leser kun lagrede tall). **BILATERAL AGE MATCHING: PRESERVED.**

## G. UNDER-18 GUARD (server-side)

Dagens faktiske håndheving — verifisert i kode:

| Nivå | Sted | Håndhever alderstak i dag? |
|---|---|---|
| Konto (register) | `app/api/auth/register/route.ts` | **NEI** — kun e-post+passord, ingen alder |
| Onboarding-steg (frontend) | `Step1Profile.tsx` | Ja (klient, MIN_AGE) — omgåelig |
| Onboarding-steg (server) | `onboarding-steps.ts:99` | Ja — `age < MIN_AGE` → feil |
| Onboarding-save (server) | `onboarding-setup.ts:50` | Ja — Zod `min(21)` |
| Profil-opprett/oppdater | `profile.ts:9,23` | Ja — Zod `min(21)` |
| API match-score | `api.ts:113` | Ja — Zod `min(21)` |
| Kø (matching-tilgang) | `app/api/journey/queue/route.ts:99-102` | **Indirekte** — krever `onboardingComplete=true` |
| Matching-cron | `app/api/cron/matching/route.ts` | **NEI** — leser QUEUED+onboardingComplete, sjekker ikke alder |

**Vurdering:**
- **17 år:** kan lage KONTI (e-post+passord), men kan ALDRI fullføre onboarding (server 400), kan ALDRI lage gyldig profil (Zod 400), kan ALDRI komme i kø (krever onboardingComplete), og matching-cron leser dem aldri. → **17-årig får ALDRI en gyldig/eligibel profil i dag.**
- **18 år:** under dagens grense (21) NEI; under foreslått (18) JA.
- **Gap:** ingen EKSPLISITT server-side alder-sjekk i køen/matching-cron. Beskyttelsen er indirekte (at under-18 ikke kan fullføre onboarding). Akseptabelt i dag, men trygt å legge til en eksplicit `age >= MIN_AGE`-sjekk i kø-transaksjonen som forsvarsdybde (se V, del F).

**Foreslått server-side beskyttelse (A18):** i `app/api/journey/queue/route.ts`, før kø-setting: sjekk `profile.age < MIN_AGE` → 409. Én linje, lav risiko. (Matching-cron er allerede gated gjennom køen.)

## H. LEGACY / EKSISTERENDE BRUKERE (21+)

Alle eksisterende brukere er i dag 21+, dvs. automatisk ≥18.

- **DB-migrasjon: NEI.** `age` er `Int` uten constraint/enum som koder 21.
- **Data-backfill: NEI.** Ingen lagret verdi er ugyldig under 18+ — alle er ≥21.
- **Re-onboarding: NEI.**
- **Lagrede alderspreferanser (21–40 m.v.): BEHOLDES.** Prinsipp: vi endrer ALDRI stille en eksisterende brukers lagrede preferanse. En bruker med 21–40 beholder 21–40.
- **Default 21–40:** gjelder KUN nye brukere ved onboarding (initial state i `OnboardingFlow.tsx` + fallback i `Step1Profile.tsx`). Eksisterende lagrede profiler påvirkes ikke av default-endring.

**Anbefaling:** ingen migrasjon, ingen backfill, ingen re-onboarding, ingen endring av lagrede preferanser.

## I. ONBOARDING — 21→18 MATRISE (alle O1-plasser)

| PLASS (FIL:LINJE) | DAGENS | PROPOSERT | TYPE |
|---|---|---|---|
| `OnboardingFlow.tsx:161` | `agePrefMin: 21, agePrefMax: 40` (default) | `agePrefMin: 18` (eller 21, se W-1); max 40 | STATE-DEFAULT |
| `Step1Profile.tsx:46` | `age < MIN_AGE` → «Du må være minst ${MIN_AGE} år.» | uendret (MIN_AGE=18 gir «minst 18 år») | VALIDERING |
| `Step1Profile.tsx:76` | `minAge < MIN_AGE` → «Minste alder må være ${MIN_AGE}.» | uendret (18) | VALIDERING |
| `Step1Profile.tsx:143-151` | `safeMinAge` fallback MIN_AGE; `safeMaxAge` fallback 40 | uendret (fallback 18) | STATE |
| `onboarding-setup.ts:50` | `.min(21, 'Du må være minst 21 år')` | `.min(MIN_AGE, …)` | VALIDERING |
| `onboarding-setup.ts:66,70` | `.min(21)` | `.min(MIN_AGE)` | VALIDERING |
| `onboarding-steps.ts:99,131,143` | `MIN_AGE` | uendret (18) | VALIDERING |
| E2E `onboarding.spec.ts:437` | forventer «21–99+» | «18–99+» **HVIS** default B=18; uendret hvis A=21 | E2E |
| E2E `onboarding.spec.ts:61` | `ob-age` fill '30' | uendret (30 gyldig i begge) | E2E |
| E2E `onboarding.spec.ts:277-310` | 99+-test med min 25/35 | uendret (uavh. av default) | E2E |

## J. PUBLIC SITE — aktive 21+-plasser (alle aktive ruter søkt)

Aktive, brukervendte plasser:

| ROUTE/STED | DAGENS COPY | PROPOSERT COPY |
|---|---|---|
| Landing hero (`components/ui/layout/Hero.tsx:67`) | «Tosom er en rolig, privat plattform for voksne (21+).» | «…for voksne (18+).» |
| App-header badge (`components/ui/age-badge/AgeBadge.tsx:10,25`) | `title="21+ · Kun for voksne"` + `21+` | `18+ · Kun for voksne` + `18+` |
| `components/AgeRequirement.tsx:4` | «21 år eller eldre» | «18 år eller eldre» |
| `/login` (`app/login/page.tsx:337`) | «Tosom er for deg som har fylt 21 år.» | «Tosom er for deg som har fylt 18 år.» |
| `/` metadata (`app/layout.tsx:12`) | «…For 21+.» | «…For 18+.» (interpoler `${MIN_AGE}`) |
| `/trygghet` metadata (`app/trygghet/layout.tsx:7,12`) | «…aldersgrense 21+, private samtaler…» | «…aldersgrense 18+…» (interpoler `${MIN_AGE}`) |
| `/personvern` (`app/personvern/page.tsx:56`) | «Tosom er kun for voksne (21+).» | «Tosom er kun for voksne (18+).» |
| `public/llms.txt:3` | «…For voksne (21+).» | «…For voksne (18+).» |

Kode-kommentarer (ikke brukervendte, men bør oppdateres for konsistens):
- `app/questions/page.tsx:4`, `app/questions/data/questions.ts:5`, `app/chat/data/tasks.ts:5` («Voksne 21+») → «Voksne 18+».

**Ikke påvirket (verifisert, ingen alder i aktiv copy):** `/hvorfor`, `/motpol`, `/slik-fungerer-det`, `/metoder`, `/reisen`, `/priser`, `/tips`, `/om-oss`, `/faq`, `/tilgjengelighet`, `/cookies`, `/register`. (SVG-path-komponentar og `rgba(212,175,55)`-farger er IKKE alder — se U.)

**Markedskopi (utanfor aktive ruter):** `ads/tiktok/tosom_tiktok_v1.md:19` «Voksne 21+» — oppdater dersom kampanjen kjører (George-ansvar).

## K. METADATA / SEO / MACHINE-READABLE

| STED | DAGENS | PROPOSERT | TYPE |
|---|---|---|---|
| `app/layout.tsx:12` (BESKRIVELSE → metadata + JSON-LD WebSite) | «For 14-dagers reise. For 21+.» | `For ${MIN_AGE}+.` | METADATA+JSONLD |
| `app/trygghet/layout.tsx:7,12` (metadata description) | «aldersgrense 21+» | `` `aldersgrense ${MIN_AGE}+` `` | METADATA |
| `public/llms.txt:3` | «For voksne (21+).» | «For voksne (18+).» | LLMS |
| `public/manifest.json` | ingen alder | uendret | MANIFEST |
| JSON-LD Organization/WebSite (`app/layout.tsx:15-35`) | ingen alder-claim utover description | uendret (description dekkes over) | JSONLD |
| `ai/system_prompt.md:121` (AGENT-dok, ikke publik) | «for voksne (21+)» | «for voksne (18+)» | DOC/AGENT |

**Konklusjon:** ingen ståande 21+-claim etter A18 — alle aktive maskinlesbare plasser interpolerer `MIN_AGE` eller settes til 18+.

## L. LEGAL / PRIVACY

| STED | DAGENS | ENDRINGSTYPE |
|---|---|---|
| `/vilkar` (`app/vilkar/page.tsx:86-89`) | `Aldersgrense — ${MIN_AGE} år` … «Du må ha fylt ${MIN_AGE} år…» «Oppdager vi at en bruker er under ${MIN_AGE} år, stenges kontoen…» | **Ingen kode-endring** (dynamisk MIN_AGE). **FACTUAL**: versjon-bump av TERMS (TERMS_VERSION/UPDATED i config/legal.ts) + advokatnotat om at grensen nå er 18+ |
| `/trygghet` (`app/trygghet/page.tsx:48-49`) | `…bekrefte at du er minst ${MIN_AGE} år.` / `Aldersgrensen er ${MIN_AGE} år.` | **Ingen kode-endring** (dynamisk). Advokatnotat |
| `/personvern` (`app/personvern/page.tsx:56`) | «Tosom er kun for voksne (21+).» | **FACTUAL AGE UPDATE** → «(18+)» + PRIVACY_VERSION-bump + advokatnotat |

**Juridisk anker (section 22):** Norsk fullårighet er 18. Datatilsynet peker på 18 som gjeldende terskel for samtykke om sensitive personopplysninger. Dette er IKKE juridisk godkjenning av hele 18+-modellen — endelig produkt- og juridisk ordlyd er gjenstand for advokatgjennomgang. 18+-konverteringen MÅ legges inn i advokatpakken som faktisk produktendring (ny post i LEGAL-REVIEW-PACKAGE).

**Presisering:** personvern:56 sier «Vi retter oss ikke mot barn» — korrekt uendret under 18+ (barn = under 18). Ingen endring i GDPR-artikkelreferanser (art. 15–21 i personvern:316 er lovens artikler, IKKE alder — se U).

### L2 — RELIGION / SENSITIVE DATA

Ikke redesign av religion i denne planen. Spørsmålet er kun: krever lavere brukeralder (21→18) endringer i samtykke/rettmessighet?

- **Religions-samling, aksept-liste, samtykkemekanisme, avkalling, matching-logikk: UENDRET.** Ingen kode-endring.
- **Samtykke-ordlyd:** 18 er i norsk rett den alderen hvor en person kan gi selvstendig samtykke (inkl. sensitive kategorier). Endring 21→18 **forenkler** samtykkemodellen (ikke kompliserer) — ingen ny samtykketekst kreves for aldersgrunn.
- **LAWYER REVIEW REQUIRED:** at 18-årig kan gi gyldig samtykke til religions-/livssyn-data (art. 9 GDPR, sensitive kategorier). Registreres som post i advokatpakken.

## M. SAFETY

| FLATE | DAGENS | 18+-PÅVIRKNING |
|---|---|---|
| Underalder-melding / rapportering | `app/settings/page.tsx` (rapport-UI) — ingen alder-tall | **Ingen endring** |
| Ban/sletting-flows | admin-ruter; `bannedAt`/`deletedAt` | **Ingen endring** |
| Trygghetsside (`/trygghet`) | dynamisk `${MIN_AGE}` (linje 48-49) | Automatisk 18 — ingen kode-endring |
| Underalder-konto-håndtering (drift) | `BETA-OPENING-RUNBOOK-v1.0.md:158` «mistanke om at en bruker er under 21 (eller under 18)» | **Driftsdokument**: oppdater til «under 18» som grense |
| Aldersmisrepresentasjon | `vilkar:89` «Oppdager vi at en bruker er under ${MIN_AGE} år, stenges kontoen» | Automatisk 18 (dynamisk) |
| Moderasjon | ingen alder-logikk | **Ingen endring** |

**Konklusjon:** Safety-logikken er alder-agnostisk bortsett fra trygghetssiden (dynamisk) og driftsrunboken (tekst). Ingen uavhengig «under 21»-logikk i sikkerhetsflyten.

## N. AUTH / SIGNUP

- **Alder sjekkes IKKE ved kontoopprettelse** (`register` = e-post+passord kun). Alder settes/valideres FØRSTE GANG i onboarding steg 1 (server: onboarding-steps + onboarding-setup Zod).
- **Gap-vurdering:** En 17-åring kan få en KONTI (uten alder), men kan aldri fullføre onboarding → ingen gyldig alder → aldri i kø → aldri matchet. Dvs. «ACCOUNT EXISTS» ≠ «ELIGIBLE PROFILE» ≠ «MATCHING ELIGIBLE». Dette gapet er i dag ACCEPTABLE og uendret av 18+.
- **Vipps-callback** (`vipps/callback/route.ts:190`) har `age: 30` hardkodet som placeholder — Vipps er INAKTIV (out of scope), men noteres: når Vipps aktiveres MÅ ekte alder/BankID-verifisering inn, og den må bruke MIN_AGE.
- **Foreslått minimums-guard:** Ingen endring i signup nødvendig. Valideringen i onboarding (server, Zod) er den autoritative server-side-grensen. Den eksplicite kø-guarden i G er den eneste nye server-side alder-sjekken som anbefales.

## O. EMAILS

Søkt i `lib/email/` (én fil: `index.ts`) for `21`, `voksen`, `alder`, `Alder`: **0 treff.**

**Konklusjon:** Ingen e-postmal inneholder 21+- eller alder-claim i dag. **Email 21+ locations = 0.** Ingen e-post-endring nødvendig i A18.

## P. TESTS — eksisterende tester som låser 21

| TESTFIL | HVA DEN LÅSER | A18-HÅNDTERING |
|---|---|---|
| `__tests__/login-age-21.test.ts` | `MIN_AGE === 21`, `min(21)` i setup, copy «har fylt 21 år» | **Omnavne+oppdatere** → 18 (AGE-01–05 med 18) |
| `__tests__/onboarding-steps-validation.test.ts:59-81` | alder 18 flagges, agePrefMin 20 flagges | **Snus**: alder 17 flagges, 18 godtas; agePrefMin 17 flagges, 18 godtas |
| `__tests__/onboarding-language-clarity.test.ts:137-142,289-290` (OCL-10, OCL-15) | `MIN_AGE === 21`, SHA-256-hash av setup.ts, `min(21)`-strenger | **Oppdater** MIN_AGE→18, hashes, `min(18)` |
| `__tests__/age99-open-ended.test.ts` | 21/40/99+-preferanse-fixture | **Oppdater** fixture (21→18 der det er alderstak) |
| `__tests__/dealbreaker-gender-age.test.ts` | agePrefMin 21/25/28-fixture | **Oppdater** der 21 er alderstak (ikke der 21 er fritt valg) |

**Ikke alder-relaterte «21»-treff (IKKE endre — se U):** `personality-v2.test.ts:309-310` (PRNG 2147483648), `metoder.test.tsx:46,203,207` (DOI/side 221/217), `radius-unpack-cron-v8.test.ts:5` (linje-ref 321).

**Fremtidig A18-test-suite (miniumsguards):**

| ID | TEST |
|---|---|
| A18-01 | alder 17 avvises |
| A18-02 | alder 18 godtas |
| A18-03 | egen-alder-validering min = 18 |
| A18-04 | preferanse-min støtter 18 |
| A18-05 | 99+ uendret/åpen øvre grense |
| A18-06 | endelig maks (18–98) uendret |
| A18-07 | bidireksjonell alderspreferanse bevart |
| A18-08 | alder 18 omgår ikke harde grenser |
| A18-09 | eksisterende lagret preferanse uendret |
| A18-10 | ingen aktiv offentlig 21+-claim |
| A18-11 | ingen aktiv maskinlesbar 21+-claim |
| A18-12 | legal/offentlig sannhet samstemmer |
| A18-13 | under-18-sikkerhetsflow fungerer |
| A18-14 | profil/oppsett avviser ugyldig underalder-data |
| A18-15 | matching slipper ikke inn under-18-profiler |

## Q. DB / SCHEMA

- `prisma/schema.prisma`: `Profile.age Int` (obligatorisk etter endring, linje 69) — **ingen** constraint, enum eller default som koder 21.
- Ingen andre skjema/enum med alderstak (sjekket: ingen `minAge`, `ageMin`, `minimumAge`, `MIN_USER_AGE`, `MINIMUM_AGE`-felter).
- `deepProfileData` er JSON (fritt format) — `agePrefMin/agePrefMax` lever der som tall/null, uten DB-constraint.

**SCHEMA CHANGE: NEI**
**MIGRATION: NEI**
**BACKFILL: NEI**

## R. CENTRALIZATION

21 er i dag **delvis sentralisert**: `MIN_AGE` finnes i `config/legal.ts` og brukes av onboarding-steps, Step1Profile (klient) og vilkar/trygghet/login. Men **seks hardkodede 21-tall** ligger i Zod-skjemaene (onboarding-setup ×3, profile.ts ×2, api.ts ×1).

**Anbefaling (i tråd med repo-arkitekturen):**
- `MIN_AGE` i `config/legal.ts` er **allerede** den kanoniske kilden. A18 bør **koble de seks hardkodede stedene til `MIN_AGE`** (import + `min(MIN_AGE)`), ikke kun bytte tallet.
- Dette er IKKE en ny abstraksjon — `config/legal.ts` er etablert som «eneste kilde for juridiske konstanter», og filens egen kommentar (linje 84-90) sier eksplisitt at disse skjemaene må endres sammen med MIN_AGE.
- **Mål:** fremtidig alder-endring = én linje i `config/legal.ts` + copy-uppdatering. Ikke 40 filer.
- Copy-steder (Hero, AgeBadge, AgeRequirement, login, layout-metadata, trygghet-metadata, llms) bør **interpolere `${MIN_AGE}`** der det naturlig er, slik at teksten aldri blir stående.

## S. MARKETING / TONE

18+ betyr **IKKE** youth/teen/student dating. Posisjoneringen er uendret:
- voksen
- relasjonsfokusert
- én person om gangen
- bygd for ekte relasjoner

**Hva som kreves:** der «for voksne (21+)» står, er «for voksne (18+)» **nok** — ingen omskriving av omgivende copy. Tonen (ro, premium, moden) er uendret. Ingen nye ord som signaliserer «ung»/«student»/«teen» skal inn.

## T. HISTORICAL DOCS

Historiske audits kan sannferdig si at ToSom tidligere var 21+. Vi skriver **IKKE** om historikk.

**CURRENT TRUTH (oppdateres i A18):**
- `README.md` — «for voksne (21+)»
- `ai/system_prompt.md:121` — «for voksne (21+)»
- `ai/system_skisse.md:11` — «for voksne (21+)»
- `docs/TOSOM-SUPER-MASTERPLAN-v2.0.md:31,46` — invariant I-14 (21+)
- `docs/reference/SYSTEM-FLOW-DIAGRAM.md:301` — I-14 (MIN_AGE = 21)
- `GEORGE.md` — driftsnotat: kort 18+-linje i status (verifisert: inneholder i dag ingen 21+-claim)
- `docs/ACT-STATE.json` (når oppgaven blir utført — samme commit)

**HISTORICAL TRUTH (BEHOLDES, skrives ikke om):**
- `docs/BETA-TEST-v1.0.md:109` — «Tosom er for voksne over 21 år» (beta-notat, punkt-i-tid)
- `docs/JURIDISK-GRUNNLAG-v1.0.md:193` — beslutning B-1 «Aldersgrense 21 år» (juridisk beslutningshistorikk)
- `docs/PAYMENT-VIPPS-TRUTH-PLAN-v1.0.md:38` — D7 «21+ forblir Tosoms produktregel» (beslutningshistorikk)
- `docs/LanseringsCheckList.md` — 21+-sjekkpunkt (historisk kvalitetskontroll)
- `docs/ONBOARDING-LANGUAGE-UX-PLAN-v1.0.md`, `RUNTIME-DOCUMENTATION-TRUTH-PLAN-v1.0.md`, `GRAND-FINALE-COPY-REVIEW-v1.0.md`, `MOTPOL-PLAN-v1.0.md` — snapshots/diagnoser
- `docs/archive/*` — **aldri normativ**, røres aldri

**Konklusjon:** A18 oppdaterer KUN CURRENT-TRUTH-dokumentene. Historiske dokumenter beholdes slik de er (de er sannferdige for sitt tidspunkt).

## U. HIGH-RISK REPLACEMENTS — DO NOT MASS-REPLACE «21»

Masse-erstatning av `21` → `18` i repoet ville vært **FELT**. Disse treffene er IKKE alder:

| KATEGORI | EKSEMPLER | HVORFOR IKKE |
|---|---|---|
| CSS/farger | `rgba(212,175,55,…)` (gull #D4AF37), `rgba(11,21,32,…)` (mørkeblå) | Tall i fargeverdier; hundredvis av treff i chat/settings/dashboard-komponenter |
| SVG-paths | `L12 21.23`, `x1="21" y1="21"` (hvorfor/priser-ikoner) | Koordinater |
| PRNG-konstant | `personality-v2.test.ts:309-310` `2147483648` | 32-biters seed-konstant |
| Fagreferanser | `metoder.test.tsx:46,203,207` (DOI …63.2.221, side 221–233, 217–237) | Sitater — aldri endre |
| Lovreferanser | `config/legal.ts` (lov av 21. juni 2002), `personvern:316` «art. 15–21» | Lovnavn/GDPR-artikler |
| Datoreferanser | `vilkar:246` `id: '21'`, `radius-unpack-cron-v8.test.ts:5` (linje-ref 321), `e2e/.auth/*.json` (timestamps/hash) | IDs/tidsstempel |
| Dødt/placeholder | `vipps/callback:190` `age: 30` | IKKE 21 — men Vipps er out of scope |
| Historiske docs | `docs/archive/*`, snapshots, beslutningsregister | Historikk (se T) |
| `99`/`98`/`100`-tak | `.max(99)`, `.max(98)`, `.max(100)` | Øvre tak — **uendret** av A18 |
| `40`-default | `agePrefMax: 40` fallbacker | Maks-default — uendret (se W-1) |

**Regel for A18-ACT:** endre ALDRI blinde «21»-strenger. Kun de eksplisitt navngitte linjene i V.

## V. PROPOSED A18 ACT — én koordinert pakke

Én ACT, verifisert som en helhet (tsc + jest + verify:lang + e2e), ett commit. Delene:

- **A. Kanonisk minimumsalder:** `config/legal.ts` — `MIN_AGE = 18`.
- **B. Validering:** `onboarding-setup.ts` (3×`min(21)`→`min(MIN_AGE)` + melding interpoleres), `profile.ts` (2×), `api.ts` (1×). `onboarding-steps.ts`/`Step1Profile.tsx` uendret (bruker MIN_AGE).
- **C. Onboarding-alderkontroller:** default `agePrefMin` i `OnboardingFlow.tsx:161` ifølge W-1 (anbefalt: 18).
- **D. Matching-tilgang:** `app/api/journey/queue/route.ts` — eksplicit `profile.age < MIN_AGE → 409` (forsvarsdybde, se G).
- **E. Server-side under-18-guard:** samme som D (kø-guarden ER den eksplicite guarden; onboarding-Zod er allerede server-side).
- **F. Safety/underalder-flow:** `BETA-OPENING-RUNBOOK`-tekst «under 21 (eller under 18)» → «under 18». Ingen logikk-endring.
- **G. Publik copy:** Hero.tsx, AgeBadge.tsx, AgeRequirement.tsx, login/page.tsx, llms.txt → 18+ (interpoler MIN_AGE der naturlig).
- **H. Legal faktiske aldersreferanser:** personvern:56 → «(18+)» + TERMS/PRIVACY version-bump i config/legal.ts. vilkar/trygghet uendret (dynamisk).
- **I. Metadata/maskinlesbar:** layout.tsx BESKRIVELSE + trygghet/layout.tsx → `${MIN_AGE}+`.
- **J. Eposter:** ingen (0 treff).
- **K. Tester:** oppdater de 5 filene i P; skriv A18-01…A18-15 guards (ny fil `__tests__/age18-conversion.test.ts` + endringer i eksisterende).
- **L. E2E:** `onboarding.spec.ts` — «21–99+» → «18–99+» hvis W-1=B; 99+-testene uendret.
- **M. Docs:** CURRENT-TRUTH-lista i T + `ACT-STATE.json` (samme commit).

**IKKE med i A18:** bonusfamilie, religion-redesign, free-text-removal, love-language multiselect, food/activity, onboarding-step-redesign (O2), pricing, Identity, Vipps.

## W. DECISIONS FOR GEORGE (kun genuine produktbeslutninger)

**W-1 — Default alderspreferanse for NYE brukere etter 18+-konvertering.**
Analyse av de tre alternativene (ingen ny algoritme):

| | A: default forblir 21–40 | B: default blir 18–40 | C: default relativt til egen alder |
|---|---|---|---|
| Produktklarehet | OK, men 18-åring får default som utelukker likealdrede (18–20) | Høyest — laveste velgbare min = laveste brukeralder, som dagens 21-er | Lav — usynlig regel, forvirrende i oppsummering |
| Implementering (scope) | Én konstant uendret; null UI-endring | Én default-tall (18) + e2e-tekst | Ny logikk (relativt uttrykk) — strider mot «ingen ny algoritme» |
| Matching-påvirkning | 18-åringer må manuelt senke min for å møte 18–20 | 18-åringer matcher likealdrede med default | Variabel avhengig av egen alder |
| Uønsket utelukkelse? | **JA** — 18-åring utelagt fra 18–20 ved default | NEI | Mulig (f.eks. 30-åring med min=30 møter aldri unge — samme som i dag) |

**Anbefaling: B (18–40).** Grunn: dagens produktlogikk er at default-min = minimumsalder (21→21). Å beholde 21 som default-min for en 18+-tjeneste ville stille utelukke 18- og 19-åringer fra likealdrede — det er en uønsket utelukkelse som krever at brukeren vet å endre innstillingen. B er ett tall, null ny logikk, og beholder maks=40.

**W-2 — Behandling av eksisterende lagrede preferanser.**
Anbefaling (i tråd med prinsippet i H): **behold uendret.** Ingen backfill, ingen stille endring av 21–40 → 18–40. Dersom George ønsker å gi eksisterende brukere mulighet til å senke til 18, skjer det via onboarding/profilredigering — aldri via migrasjon.

**W-3 — Advokat-etterspurt ordlyd/endringer.**
Ligger hos advokatgjennomgangen (se L/L2). Ingen teknisk beslutning nødvendig før advokaten svarer.

## X. FINAL RECOMMENDATION

18+-konverteringen er **teknisk enkel, lavrisiko og sikker**: én kanonisk konstant, seks hardkodinger koblet til konstanten, ~8 copy-steder, én juridisk tekstlinje, én ny kø-guard, ingen DB/migrasjon/backfill, ingen matching-logikk-endring, 99+ og bidireksjonell matching uberørt, eksisterende brukere uberørt.

**Anbefaling:** Godkjenne W-1=B og W-2=behold. Kjør A18 som ÉN koordinert ACT (V) med A18-01…15-testsuite grønn + e2e + verify:lang, deretter deploy via normal CD-gate. Legg 18+-endringen i advokatpakken som faktisk produktendring.

---

## STATUS (STOPP)

```
AGE 18 CONVERSION PLAN: COMPLETE
CURRENT MINIMUM AGE: 21
PROPOSED MINIMUM AGE: 18
18+ TECHNICAL FEASIBILITY: YES
18+ LEGAL STATUS: LAWYER REVIEW PENDING
99+ SEMANTICS: UNCHANGED
BILATERAL AGE MATCHING: PRESERVED
SCHEMA MIGRATION: NO
BACKFILL: NO
IMPLEMENTATION: NOT STARTED
COMMIT: NO
PUSH: NO
DEPLOY: NO
```

### Rapport (30 punkter)

1. **Gjeldende kanonisk minimumsalder:** 21 (`config/legal.ts:91`, `MIN_AGE`)
2. **Antall aktive runtime-alderstak:** 7 (MIN_AGE-konstant + onboarding-steps + onboarding-setup ×3 + profile.ts ×2 + api.ts ×1) — derav 6 hardkodede duplikater
3. **Publik 21+-plasser:** 8 aktive (Hero, AgeBadge ×2, AgeRequirement, login, layout-metadata, trygghet-metadata ×2, personvern, llms.txt) + 3 kodekommentarer
4. **Legal 21+-plasser:** 1 (personvern:56). vilkar/trygghet er dynamiske (MIN_AGE)
5. **Metadata/llms 21+-plasser:** 3 (layout.tsx BESKRIVELSE/JSON-LD, trygghet/layout.tsx, llms.txt)
6. **Email 21+-plasser:** 0
7. **Test-plasser:** 5 filer (login-age-21, onboarding-steps-validation, onboarding-language-clarity OCL-10/15, age99-open-ended, dealbreaker-gender-age) + e2e onboarding.spec.ts
8. **Schema-migrasjon:** NEI
9. **Backfill:** NEI
10. **Server-side under-18-beskyttelse i dag:** Indirekte — under-18 fullfører aldri onboarding (Zod 400), får aldri onboardingComplete, kommer aldri i kø, blir aldri matchet. Ingen EKSPLISITT alder-sjekk i kø/matching.
11. **Foreslått server-side beskyttelse:** Eksplicit `profile.age < MIN_AGE → 409` i `app/api/journey/queue/route.ts`
12. **Egen-alder-validering endres:** `MIN_AGE = 18` + 3× `min(21)→min(MIN_AGE)` i onboarding-setup + profile.ts/api.ts koblet
13. **Preferanse-intervall endres:** `agePrefMin` min 21→18, `agePrefMax` min 21→18 (via MIN_AGE). Maks-tak (99/98/99+) uendret.
14. **99+-påvirkning:** Ingen. `agePrefMax = null`-semantikken er uendra.
15. **Bidireksjonell matching-påvirkning:** Ingen — matching leser kun lagrede tall; tosidig logikk er uendra.
16. **Eksisterende brukere-påvirkning:** Ingen. Alle er ≥21 (dvs. ≥18). Ingen re-onboarding.
17. **Lagret preferanse-anbefaling:** Behold uendret (W-2). Aldri stille endring.
18. **Default-alder-alternativer:** A=21–40, B=18–40, C=relativt
19. **Anbefalt default:** B (18–40)
20. **Safety-endringer:** Ingen logikk. Kun driftsrunbok-tekst «under 21 (eller under 18)» → «under 18» + ny kø-guard.
21. **Religion/samtykke-påvirkning:** Ingen kode-endring. LAWYER REVIEW at 18-åring gir gyldig samtykke til sensitive data (art. 9).
22. **Legal-review-poster:** 18+-modellen som faktisk produktendring + aldersgrense 18 i vilkår/personvern + religion-samtykke for 18-årige.
23. **Historiske docs bevart:** JA — BETA-TEST, JURIDISK-GRUNNLAG, PAYMENT-VIPPS, LanseringCheckList, snapshots, archive/ skrives ikke om.
24. **Høyrisiko masseerstatnings-poster:** CSS-farger (212/21,32), SVG-koordinater, PRNG 2147483648, fagsider/DOI, lovreferanser (21. juni, art. 15–21), IDs/tidsstempler, 99/98/100-tak, 40-default.
25. **Foreslått A18-scope:** Én koordinert ACT, deler A–M i V.
26. **Krevde tester:** A18-01…A18-15 (se P) + oppdatering av 5 eksisterende testfiler + e2e.
27. **Gjenstående genuine beslutninger:** W-1 (default-preferanse), W-2 (lagrede preferanser), W-3 (advokat-ordlyd).
28. **Endrede filer:** 1 (denne planen, `docs/AGE-18-CONVERSION-PLAN-v1.0.md`). Ingen kdefiler.
29. **git status:** `main`, ren unntatt untracked `docs/IDENTITY-TRUST-PLAN-v1.0.md` (FROZEN) + `tmp/`. Denne planen er ny (untracked til den becomes commit-et).
30. **Endelig anbefaling:** Godkjenne B + behold; kjør A18 som én ACT med grønn testsuite + verify:lang, deploy via CD-gate, legg i advokatpakken.

## Y. ACT RESULT (29.10.2026)

A18 er **implementert i working tree** — STATUS: STOPP FØR COMMIT (venter George).

- **Beslutninger godkjent:** W-1 → **B (18–40)** som synlig/redigerbar default for nye
  (D3, «foreslått utgangspunkt», ingen anbefalings-claim); W-2 → **lagrede
  preferanser urørt** (D4, ingen backfill); W-3 → advokatpakke oppdatert,
  **LEGAL REVIEW: PENDING**.
- **Full gjennomføring:** `docs/AGE-18-CONVERSION-ACT-v1.0.md` (A–Q: produktbeslutning,
  runtime-aldermodell, MIN_AGE, egen alder, preferansealder, default 18–40,
  eksisterende brukere, 99+, kø-guard, bidireksjonell matching, publik, legal,
  safety, tester, historiske docs, advokatflag, sluttresultat).
- **Hovedendringer:** `MIN_AGE = 18`; 6 hardkodet-21-steder koblet til MIN_AGE;
  default 18–40; ny server-side kø-guard (under 18 → 409); publik/legal/metadata/llms
  → 18+; TERMS/PRIVACY versjon bump; 1 aktiv 21-minimum i UI-funn rettet
  (Step1Profile mikroguiding).
- **Uendret:** dealbreaker/matching-kode, consent, prisma (ingen migrasjon/backfill),
  Bli Kjent V2, Oppgaver V2, questions.ts, tasks.ts, IDENTITY-TRUST-PLAN.
- **Verifisering:** A18-01…15 + aldermatrise + E2E + OCL/AGE99/matching/consent
  grønne; `npm run verify` (lang + tsc + jest), lint, build, Playwright —
  tall i `docs/ACT-STATE.json` `health`.
- **Commit/push/deploy: NEI** — venter Georges «kjør».

## Z. GLOBAL PRODUKT-SANNHET-SVEP — RESULTAT (30.10.2026)

Før commit: én siste global sweep for ÉN aktiv produkt-sannhet (A18 +
ukentlig matching + 14 dager + dag 8). Detaljer:
`docs/AGE-18-CONVERSION-ACT-v1.0.md` §R.

- **Runtime bekreftet:** matching = ukentlig/natt til lørdag (vercel.json
  `0 2,3,4 * * 6`), journey = 14 dager (`config/journey.ts`), foto = dag 8
  (`PHOTO_REVEAL_DAY`/`isPhotosAllowed`). Ingen runtime endret.
- **Rettet (aktivt stale):** reisen:639 (21→18), JourneyView (30→14 via
  `JOURNEY_TOTAL_DAYS`), `ai/system_prompt.md` + `ai/system_skisse.md`
  (30-dagers/dag-15 → 14-dagers/dag-8), `scripts/setupE2eJourneys.ts`,
  LEGACY-markører på døde 30-dagers-artefakter, test-filnavn
  `photo-lock-before-day15` → `photo-lock-before-reveal`.
- **Beholdt:** alle lovlige 24t/30d/21-tegn-bruker, historiske docs, fryste
  bibliotek (Bli Kjent 180/12×15, Oppgaver 135/9×15), e-post (allerede alignet).
- **Ny guard:** `__tests__/canonical-product-truth.test.ts` (CPT-01…15) +
  `docs/CANONICAL-PRODUCT-TRUTH-v1.0.md` (sannhetsindeks).
- **Status:** STOPP FØR COMMIT — venter George.

