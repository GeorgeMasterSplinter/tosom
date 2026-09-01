# TOSOM — ACT-INSTRUKS v3.0 (Launch Edition)

**Dato:** 2026-08-25
**Commit:** `2f0eb6a`
**Gjelder:** Fra bølge A til full lansering. Vipps er utenfor omfanget.
**Forholder seg til:** [`ACT-PIPELINE-v1.0.md`](ACT-PIPELINE-v1.0.md) — pipelinen
er fortsatt arbeidsmetoden. Dette er *hva* som skal gjøres, ikke *hvordan*.

> Kun polish, UX, drift, E2E, premium og sikkerhet. Ingen nye funksjoner.
> Ingen konseptendringer. Ingen store planer under beta (DI-2).

---

## 0. Regler for denne fasen

1. **Én fil per patch.** `tsc` + `jest` mellom hver. Ett rødt → stopp.
2. **Ingen terskeljusteringer under beta.** Et tall som ser rart ut er data, ikke en hendelse.
3. **ACT-STATE.json oppdateres i samme commit** som siste kode i oppgaven.
4. **Koden vinner.** Finner du avvik mot dokumentasjonen: rapporter, ikke skjul.
5. **Ved usikkerhet: spør med et konkret forslag.** «Jeg foreslår X fordi Y. Alternativet er Z.»

---

## BØLGE A — Sikkerhet og kvalitetsport ✅ FULLFØRT 25.08.2026

Målet var å lukke alt som kunne skade en bruker eller slippe dårlig kode ut.

| ID | Fil | Endring | Status |
|---|---|---|---|
| A1 | `app/api/notifications/**` | Slettet død, uautentisert rute (IDOR) | ✅ |
| A2 | `middleware.ts` | `/api/notifications` + `/api/relationship` i `PROTECTED_API_PREFIXES` | ✅ |
| A3 | `.github/workflows/cd.yml` | `workflow_run`-gate: deploy krever grønn CI | ✅ |
| A4 | `lib/payment/freeQuota.ts`, `app/api/journey/queue/route.ts` | `releaseFreeQuota` — kvoteplass gis tilbake ved feilet kø | ✅ |
| A5 | `app/api/chat/send/route.ts` | Rate limiting via `pgCheck` (30/min/bruker) | ✅ |
| A6 | `app/api/onboarding/complete/route.ts` | Bokmål i brukervendte feilmeldinger | ✅ |
| A7 | `lib/auth/requireAuth.ts` | «Aðgang nei — admin bare» → forståelig norsk | ✅ |
| A8 | 15 filer i `app/`, `lib/` | 39 nynorsk-treff ryddet → `lang-guard` grønn | ✅ |

**Verifisert:** `tsc` 0 feil · `jest` 344/345 (40 suiter) · ESLint rent ·
alle seks CI-vakter grønne (lang, ai, concept, one-engine, 05:00, cron).

**Ny test:** `__tests__/free-quota-release.test.ts` (4 tester) låser at en
claimet gratisplass alltid gis tilbake, aldri teller under null, og aldri
kaster i en feilhåndteringssti.

---

## BØLGE B — Drift og data (dag 1–30)

Rekkefølgen er bevisst: **de to kritiske først**, fordi de ikke kan løses av en agent.

### B-1 · Bekreft én database 🔴 KREVER GEORGE

**Problem:** `.env.prod` peker på `db.prisma.io`, mens planen sier Neon
Frankfurt. To migrasjoner manglet der og ga 500-feil i onboarding-lagring.

```bash
# 1. Les DATABASE_URL i Vercel → Settings → Environment Variables
# 2. Kjør mot NØYAKTIG samme URL:
DATABASE_URL="<vercel-url>" npx prisma migrate status
# Forventet: 23 migrasjoner, alle applied
```

**Ferdig når:** `migrate status` viser 23/23 mot den databasen Vercel faktisk bruker.

### B-2 · Rett aldersløftet 🔴 KREVER GEORGE (juridisk)

**Problem:** `app/vilkar/page.tsx:83` lover BankID-verifisering. I beta settes
`age: 25` hardkodet i `lib/auth/config.ts:54`. Vi lover en kontroll vi ikke har.

To veier — velg én:

- **(a) Ærlig tekst:** «I betaperioden bekrefter du alderen selv. Ved lansering verifiseres den gjennom Vipps.»
- **(b) Reell kontroll:** krev fødselsdato ved registrering, valider mot `MIN_AGE`.

**Patch-skisse (a):**
```diff
- `Du må ha fylt ${MIN_AGE} år ... Alderen verifiseres gjennom Vipps, som bruker BankID.`
+ `Du må ha fylt ${MIN_AGE} år for å bruke Tosom. I betaperioden bekrefter du`
+ `alderen selv. Ved full lansering verifiseres den gjennom Vipps (BankID).`
```
**Verifiser:** `npx jest` · les `/vilkar` i nettleser · `TERMS_VERSION` bumpes.

### B-3 · `nextDayAt`-indeks

**Problem:** journey-cronen filtrerer på `nextDayAt` hver time. Ingen indeks.

```prisma
model JourneyProgress {
  @@index([nextDayAt])   // B-3: cron filtrerer på denne hver time
}
```
```bash
npx prisma migrate dev --name add_journey_next_day_index
```
**Verifiser:** `migrate status` · `jest journey` · `EXPLAIN` viser index scan.

### B-4 · Rate limiting på skrivende ruter

Mønster fra A5 (`pgCheck` er atomisk og fail-open):

| Rute | Tak | Vindu |
|---|---|---|
| `/api/journey/queue` | 10 | 60 s |
| `/api/onboarding/save` | 60 | 60 s |
| `/api/onboarding/draft` | 120 | 60 s |
| `/api/profile/setup` | 20 | 60 s |
| `/api/chat/image` | 10 | 60 s |

Én rute per patch. **Verifiser:** `jest` + manuell 429-sjekk.

### B-5 · Admin-passord: timing-safe og hashet

`app/api/admin/auth/route.ts:23` bruker `!==`. Cron-rutene bruker
`timingSafeEqual` — admin bør ikke være svakere.

```diff
- if (email !== adminEmail || password !== adminPassword) {
+ const emailOk = safeCompare(email ?? '', adminEmail)
+ const passOk  = await verifyPassword(password ?? '', adminPasswordHash)
+ if (!emailOk || !passOk) {
```
**Merk:** krever `ADMIN_PASSWORD_HASH` i env (bcrypt). Koordiner med B-6.
**Verifiser:** `jest admin-authorization` · manuell innlogging.

### B-6 · Hemmeligheter ut av `.env` (F-6)

`.env` inneholder ekte admin-passord og `CRON_SECRET`. Kun `.gitignore`
beskytter dem. Flytt til passordhåndterer **før produksjonsdata finnes**.
Roter aldri `AUTH_SECRET` etter første innlogging (invaliderer alle sesjoner).

### B-7 · Slipp inn testere, observer

10 → 50. Observer i `/admin/`:

| Hva | Hvor | Hvorfor |
|---|---|---|
| `rejectReasons`: `kjonn`, `alder` | `/admin/logs` | WP1-filtre er nye — høye tall = filterbug, ikke normalt |
| Kø-alder | Admin-panel | > 14 dager = noen venter for lenge |
| «Reiser som venter på fremrykk» | Admin-panel | `0` = friskt · `≥100` = cron kjører ikke |
| Draft-frafall | `/admin/users` | Forsvinner folk som tidligere mistet data? |

**Juster ingenting.** Skriv ned. Tuning kommer etter beta.

---

## BØLGE C — Skala og polish (dag 31–60)

| ID | Sak |
|---|---|
| C-1 | Fjern `components/MatchCard.tsx`-katalogen og den korrupte git-stien |
| C-2 | Konsolider duplikatmoduler (`analytics`, `matching`, `rate-limit`×3) |
| C-3 | Slå sammen `utils/flags.ts` og `config/features.ts` til én kilde |
| C-4 | `git rm -r --cached test-results playwright-report prisma/dev.db prisma/schema` + `.gitignore` |
| C-5 | Oppdater `ai/memory.json` til seks dimensjoner (lyver i dag) |
| C-6 | E2E grønn i CI (Playwright-suiten feiler i dag) |
| C-7 | Aktiver CSRF (`lib/auth/csrf.ts` er skrevet, aldri importert) |
| C-8 | Fortsettelses-cron for matcherunden + hev kø-tak |
| C-9 | Auth på `/api/analytics/track` og `/api/system/latency` |
| C-10 | DPA + DPIA (juridisk, før kampanje) |
| C-11 | Tetthetsbasert radius 30–300 / 50–400 km |

---

## Verifisering — alltid

```bash
npx tsc --noEmit          # 0 feil
npx jest --ci --silent    # alle grønne
npx next lint --max-warnings 0
```

**Ved matching-endring:** `unified-scorer` · `dealbreaker` ·
`radius-dealbreaker-b14` · `sjekk9-reject-counters` · `matching-score-round`
**Ved journey-endring:** `journey-engine` · `journey-queue-exit-b8`
**Ved auth-endring:** `admin-authorization` · `cron-auth` · `middleware-cookie-salt`
**Ved kvote-endring:** `free-quota-claim` · `free-quota-release` · `free-quota-threshold`

**Språkvakt før push (bokmål overalt — ingen nynorsk):**
```bash
npm run verify:lang
# «ingen nynorsk-treff» = grønn. Ordliste: scripts/verify-language.mjs.
# CI kjører samme skript (jobben lang-guard); rød vakt = blokkert deploy.
```

---

## State-tracking

Etter hver oppgave, i **samme commit** som koden:

```json
{
  "health": { "tests": "…", "typecheck": "…", "productionBuild": "…" },
  "leveranser": [{ "dato": "", "id": "B-x", "title": "", "content": "" }],
  "nextAction": ""
}
```

Rapportformat (ACT-PIPELINE §14): Utført · Filer · Verifisert · Neste.
Ingen overforklaring. Ingen selvros.

---

## Gjør ikke

- Sett aldri `PAYMENTS_ENABLED=true` før Vipps er koblet (kaster ved oppstart, med vilje)
- Rør aldri produksjons-DBen direkte — alltid repo → deploy
- Juster ikke terskler under beta (DI-2)
- `DEV_LOGIN_ENABLED` aldri `true` i produksjon
- Ikke skriv nye store planer mens vi måler

---

*Hver patch berører noe som betyr noe for noen. Jobb rolig. Jobb presist.*
