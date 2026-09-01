# ToSom — Testing & E2E Readiness Audit

Audit date basis: repo HEAD `2f53adf` (2026-08-12). Read-only audit; no source files modified.

---

## Current Test Inventory

### Unit tests (Jest) — `__tests__/journey-engine.test.ts`

Runner: `npm test` → `jest` (config: `jest.config.js`, using `next/jest`, `testEnvironment: 'node'`).

**30 tests, all passing.** Pure logic tests against `lib/journey/engine.ts`. No DB, no network, no React rendering.

`describe('Journey Engine')`
- `describe('getPhaseForDay')`
  - EARLY: dag 1 skal være EARLY
  - EARLY: dag 14 skal være EARLY (siste dag i fase 1)
  - BUILDING_TRUST: dag 15 skal være BUILDING_TRUST (første dag i fase 2)
  - BUILDING_TRUST: dag 21 skal være BUILDING_TRUST
  - DEEPER: dag 22 skal være DEEPER (første dag i fase 3)
  - DEEPER: dag 25 skal være DEEPER
  - CHECKIN: dag 26 skal være CHECKIN (første dag i fase 4)
  - CHECKIN: dag 30 skal være CHECKIN (siste dag)
  - Ukjent dag > 30 skal falle tilbake til CHECKIN
- `describe('isPhotosAllowed')`
  - dag 1: bilder IKKE tillatt
  - dag 14: bilder IKKE tillatt (siste dag i EARLY)
  - dag 15: bilder tillatt (første dag BUILDING_TRUST)
  - dag 30: bilder tillatt
- `describe('isJourneyActive / isJourneyCompleted')`
  - dag 1: aktiv, ikke fullført
  - dag 30: aktiv, ikke fullført
  - dag 31: IKKE aktiv, fullført
  - dag 0: IKKE aktiv
- `describe('JOURNEY_TOTAL_DAYS')`
  - skal være 30 dager
- `describe('getThemeForDay')`
  - dag 1: intro
  - dag 6: trygghet
  - dag 13: fordydning
  - dag 21: modning
  - dag 27: integrasjon

`describe('Matching Weights')`
  - base vekt skal være 0.35
  - resonance vekt skal være 0.25
  - semantic vekt skal være 0.20
  - intimacy vekt skal være 0.10
  - future vekt skal være 0.10
  - summen av alle vekter skal være 1.0

`describe('24-hour Match Delay Rule')`
  - MATCH_DELAY_HOURS skal være 24
  (+ additional related weight/delay assertions rounding out the 30 total)

**No other unit/integration tests exist anywhere in the repo** — zero tests for any of the 96 API route handlers, zero React component tests, zero hook tests, zero Prisma/DB integration tests.

### E2E tests (Playwright) — `e2e/tests/*.spec.ts`

Runner: `npx playwright test` (config: `playwright.config.ts`). **These are NOT run by `npm test`** — Jest explicitly errors on all 4 spec files when `npm test` executes because Playwright's `test.describe`/`test` API throws `throwIfRunningInsideJest` when invoked under Jest. This means CI's "Unit Tests" job (which runs `npm test`) is not itself broken by the e2e specs sitting in the repo (Jest's `testPathIgnorePatterns` default excludes `e2e/`? — actually no default exclusion exists in `jest.config.js`; the failure trace below shows Jest DID attempt to pick up all `e2e/tests/*.spec.ts` files and only survived because they fail fast with a thrown error, not a "no tests found" — see CI Integration Status for the implication).

**e2e/tests/chat.spec.ts** — `describe('Chat Flow')`, 8 tests, all soft/conditional assertions (`if (await x.count() > 0)`):
  - skal vise chat-side etter match-aksept
  - skal vise tom-chat når ingen meldinger er tilgjengeleg
  - skal kunne skrive melding
  - skal kunne sende melding
  - skal vise egne meldinger til høyre
  - skal vise mottatte meldinger til venstre
  - skal vise typing-indikator dersom part skriv
  - skal vise melding-tidstempler

**e2e/tests/match.spec.ts** — `describe('Match Flow')`, 6 tests, all soft/conditional:
  - skal vise match-status på dashboard
  - skal vise "Vent på match" når ingen match er tilgjengeleg
  - skal kunne navigere til match-side
  - skal vise match-explanation dersom match er tilgjengeleg
  - skal kunne avise match
  - skal kunne akseptere match

**e2e/tests/matching-journey.spec.ts** — 5 describe blocks, 15 tests, mixed page/API request tests:
  - `describe('Matching Flow')`: skal vise dashboard med ResonanceMeter etter match; skal vise QuickActions-knapper; skal blokkere ny match med låst-bruker (API `POST /api/match`, only asserts status 200-499)
  - `describe('Journey Flow')`: skal vise Journey-side med progress-tracker og dag-innhold; skal vise PremiumJourneyDayView med refleksjon og oppgåve; skal vise ImageShareLockBanner dersom imageShareAllowedAt ikke passert
  - `describe('Premium UI')`: skal ha AmbientGlow-effekt på dashboard og journey; skal ha glassmorphism på alle cards; skal ha gull-gradient-knapper på CTA-element (all effectively no-op — pass regardless of DOM state via `toBeGreaterThanOrEqual(0)`)
  - `describe('Admin Flow')`: skal autentisere admin og vise dashboard (only checks login form conditionally visible); skal vise bruker-liste med ekte data fra /api/admin/users (accepts 200/401/403); skal blokkere ikke-admin fra /admin/users (accepts almost any outcome)
  - `describe('Vipps Auth Flow')`: skal initiere Vipps-autorisasjon og motta authorizeUrl; skal returnere authorizeUrl med korrekt state
  - `describe('Guidede Spørsmål API')`: skal returnere 10 kategorier med spørsmål-antall; skal returnere spørsmål i en kategori

  Note: This file imports `{ test, expect } from '@playwright/test'` directly (NOT the fixture in `e2e/fixtures/test-users.ts`), and defines its own `BASE_URL` from `process.env.NEXT_PUBLIC_APP_URL`. It runs unauthenticated by default relative to the fixture-based specs (it relies on whatever `storageState` the Playwright *project* injects, not a fixture).

**e2e/tests/onboarding.spec.ts** — `describe.skip('Onboarding Flow (13-stegs)')` — **ENTIRE FILE IS SKIPPED** (11 tests defined, 0 executed):
  - skal vise onboarding med progressbar og steg-tittel
  - skal kunna fylle ut grunnprofil og gå vidare
  - skal visa feilmelding ved tom selfDesc
  - skal kunna gå vidare fra steg 1 med gyldig selfDesc
  - skal kunna gå vidare fra steg 2 med gyldig responsibilities
  - skal kunna tilbake med BackButton på steg 1
  - skal kunna fullføre heile 13-stegs onboarding-flyten
  - skal autosave inndata til localStorage
  - skal restaurera draft etter side-opprettning
  - skal visa riktig progress-prosent

  A code comment explicitly documents why: *"TODO: Fikse onboarding-tester når dedikert auth-setup er på plass. Problem: dev-login redirecterer alltid til /dashboard for brukere med onboardingComplete=true. Løsning: Trenger egen auth-flow som navigerer til /onboarding og lagrer storageState derfra."* This was disabled in the same commit (`54b68b8`, 2026-08-10) that introduced the fix — i.e., rather than fix the underlying flakiness (10/10 tests failing per the archived `playwright-report/`), the whole suite was skipped.

### Setup / fixture files

- **`e2e/auth-dashboard-setup.ts`** — wired as `globalSetup` in `playwright.config.ts`. Logs in via `/dev-login` as the "E2E Dashboard" user, saves storageState to `e2e/.auth/dashboard-user.json`. Used by `chromium-dashboard`, `firefox-dashboard`, `Mobile Chrome`, `Mobile Safari` projects.
- **`e2e/auth-onboarding-setup.ts`** — logs in as "E2E Onboarding" user, saves to `e2e/.auth/onboarding-user.json`. Referenced by `chromium-onboarding`/`firefox-onboarding` projects' `storageState` option, but **NOT wired as `globalSetup`** in the config (only `auth-dashboard-setup` is). This means the onboarding storageState file is only ever produced if it's manually run once and left on disk, or never produced at all in a clean CI checkout (`e2e/.auth/` is presumably gitignored) — the onboarding projects would fail to find the file on a clean run even if the spec weren't already skipped.
- **`e2e/auth-setup.ts`** — legacy/unused generic setup (logs in as the first "Logg inn som" user, saves to `e2e/.auth/user.json`). Not referenced anywhere in `playwright.config.ts`. Dead code.
- **`e2e/fixtures/test-users.ts`** — defines `TEST_USERS` (`test-user-1`, `test-user-2`, `test-admin`, all hardcoded with `dev-*` IDs and `@tosom.no` emails) and a custom fixture (`devLogin`, `goToOnboarding`, `goToDashboard`). Only `chat.spec.ts` and `match.spec.ts` import from this fixture; `matching-journey.spec.ts` and `onboarding.spec.ts` import from `@playwright/test` directly and ignore it. Inconsistent usage across the 4 spec files.

---

## Coverage Matrix

| Flow / State | Unit test | E2E test | Notes |
|---|---|---|---|
| **Onboarding** — form rendering / step nav | No | **No (skipped)** | 11 tests exist in `onboarding.spec.ts` but entire `describe` is `.skip()`-ed due to dev-login redirect issue. Zero executable coverage. |
| **Onboarding** — validation (selfDesc min length, etc.) | No | No (skipped) | Same file, same skip. |
| **Onboarding** — autosave/draft restore (localStorage) | No | No (skipped) | Same file, same skip. |
| **Onboarding** — complete 13-step flow → dashboard/matching redirect | No | No (skipped) | Same file, same skip. |
| **Onboarding** — API (`/api/onboarding/save`, `/complete`, `/progress`) | No | No | No test of any kind touches these 3 API routes. |
| **Matching** — dashboard match banner/status display | No | Partial (soft) | `match.spec.ts` + `matching-journey.spec.ts` check for match UI conditionally (`if count>0`); tests pass even if elements never render. Not a real assertion of correctness. |
| **Matching** — accept/reject match, redirect | No | Partial (soft) | `match.spec.ts` "skal kunne akseptere/avise match" — conditional, only asserts if button exists. |
| **Matching** — `/api/match`, `/api/match/accept`, `/api/match/check`, `/api/match/score`, `/api/match/status`, `/api/match/[id]/complete` | No | Partial | Only `POST /api/match` is hit once (`matching-journey.spec.ts`, accepts any 2xx-4xx status — not a real contract test). All other match API routes untested by any test. |
| **Matching** — matching weights/algorithm constants | Yes | No | `journey-engine.test.ts` verifies `MATCH_WEIGHTS` sum to 1.0 and `MATCH_DELAY_HOURS = 24`. Pure constant checks, not actual matching algorithm behavior (no test of `lib/matching` scoring logic itself beyond constants). |
| **Journey** — phase transitions (day 14→15, 21→22, 25→26) | **Yes (strong)** | No | Fully covered by 30 passing Jest unit tests against `lib/journey/engine.ts`. |
| **Journey** — photo-lock logic (`isPhotosAllowed`) | **Yes (strong)** | Partial (soft) | Unit-tested directly; e2e only has a conditional "ImageShareLockBanner" visibility check that no-ops if banner absent. |
| **Journey** — theme-per-day | **Yes** | No | Unit-tested. |
| **Journey** — UI rendering (PremiumJourneyDayView, progress tracker) | No | Partial (soft) | `matching-journey.spec.ts` checks conditionally; passes regardless. |
| **Journey** — API (`/api/journey/*`: check, exit, progress, advance, reflect, reset, resonance, today, `[conversationId]`) | No | No | 8 journey API routes, zero test coverage of any kind. |
| **Chat** — page renders, container visible | No | Partial (soft) | `chat.spec.ts`, conditional. |
| **Chat** — send/receive message UI | No | Partial (soft, and **currently broken**) | `chat.spec.ts` "skal kunne sende melding" fills input and clicks send, but per known bug `/api/chat/send` schema only accepts `type: 'user'/'continue_choice'`, while UI sends `'text'/'image'` → **all real message sends are rejected by the API today**. The e2e test itself doesn't assert on the actual send succeeding server-side (no check of message appearing in list after send), so it would likely still report a false "pass" while the feature is broken in production. |
| **Chat** — image upload | No | **No** | `app/api/chat/image/route.ts` exists (5MB limit, JPEG/PNG/WebP validation, auth+conversation-membership checks) but has zero test coverage — no unit test of validation logic, no e2e test exercising file upload. |
| **Chat** — XSS / message content sanitization | No | **No** | Confirmed via grep: no test anywhere references XSS, sanitization, or malicious payloads in chat content. |
| **Chat** — typing indicator, timestamps, own/received message styling | No | Partial (soft) | `chat.spec.ts`, all conditional no-ops. |
| **Dashboard** — overview rendering | No | Partial (soft) | Covered indirectly by match/journey/premium-UI conditional checks in `matching-journey.spec.ts`. |
| **Dashboard** — API (`/api/dashboard`, `/api/dashboard/overview`) | No | No | Zero coverage. |
| **Settings / Profile** | No | **No** | No spec file references `/settings` or `/profile` at all. `/api/profile`, `/api/profile/setup` — zero coverage. |
| **Admin panel** — login page | No | Partial (soft) | `matching-journey.spec.ts` "skal autentisere admin og vise dashboard" just checks a login form is conditionally visible at `/admin/login`; does not actually log in or test any authenticated admin screen. |
| **Admin panel** — `/api/admin/users` | No | Partial (weak) | Two tests hit this endpoint but accept almost any status code (200/401/403) as "pass" — not a real authorization contract test. |
| **Admin panel** — all other 33+ admin API routes** (journey-content, journeys, matches, metrics, notifications, observability/*, resonance, security, session, setup, stats, system/*, system-logs, system-message, ai/logs, analytics, auth, logout) | No | **No** | Confirmed via grep — zero test references any of these routes. |
| **Cron** — `/api/cron/journey`, `/api/cron/matching` | No | **No** | Confirmed via grep — zero test references either cron endpoint. No test of cron auth/secret validation, no test of the batch logic they trigger. |
| **Webhook** — `/api/payment/webhook` (Stripe) | No | **No** | Confirmed via grep — zero test references the webhook route, its signature verification, or event handling. |
| **Auth / session** — dev-login, NextAuth, session retrieval | No | Indirect only | No spec tests auth directly; all e2e specs *depend on* dev-login working (via globalSetup) but don't verify it as a first-class test. `/api/auth/test-login`, `/api/auth/request-reset`, `/api/auth/phone/send`, `/api/auth/phone/verify`, `/api/auth/[...nextauth]` — zero direct test coverage. |
| **Auth / Vipps OAuth** | No | Yes (partial) | `matching-journey.spec.ts` `describe('Vipps Auth Flow')` — 2 tests hit `/api/auth/vipps/authorize` and check for either a 503 "not configured" response or a valid `authorizeUrl`. Reasonable smoke coverage of the authorize step only; callback (`/api/auth/vipps/callback`) is never tested. |
| **Premium / Payment** — Stripe checkout session creation | No | **No** | `/api/payment/create-checkout-session` has zero coverage of any kind. |
| **Premium / Payment** — webhook-driven premium activation | No | **No** | Same as Webhook row above. |
| **Questions API** (guided questions) | No | Yes | `matching-journey.spec.ts` `describe('Guidede Spørsmål API')` — 2 reasonable API tests against `/api/questions` (categories + filtered by categoryId). One of the better-covered, more meaningful test pairs in the whole e2e suite. |
| **Notifications** (`/api/notifications`, `/[id]/read`) | No | No | Zero coverage. |
| **Presence** (`/api/presence/get`, `/update`) | No | No | Zero coverage. |
| **Relationship** (`digest`, `memories`, `milestones`, `timeline`) | No | No | Zero coverage. |
| **System health** (`/api/system/health`, `/latency`, `/messages`) | No | No (only touched by CD workflow's post-deploy curl, not a real test) | `cd.yml` curls `/api/system/health` post-deploy as a soft smoke check (failure is swallowed with `|| echo ...`), not a Playwright/Jest test. |

---

## CI Integration Status

- **`.github/workflows/ci.yml`** (ToSom CI) runs on push/PR to main/master/develop: `lint` (ESLint), `typecheck` (tsc), `build` (next build), **`test` (Jest — `npm test`)**, `prisma` (validate/format), `ai-guard` (grep for deleted AI code), `lang-guard` (grep for nynorsk words). A final `status` job requires all of the above to succeed.
- **Playwright/E2E tests are NOT run in CI at all.** Confirmed via grep: zero occurrences of the string "playwright" in any `.github/workflows/*.yml` file. There is no e2e job, no `npx playwright test` step, no Playwright browser install step, and no artifact upload step for `playwright-report/`.
- Because e2e specs live under `e2e/tests/*.spec.ts` and `jest.config.js` has no `testPathIgnorePatterns` excluding `e2e/`, running `npm test` locally causes **Jest to attempt to load all 4 Playwright spec files**, each of which throws `throwIfRunningInsideJest` immediately at module scope (before any assertions run). This is confirmed by the actual `npm test` output captured during this audit: **4 failed test suites** (chat, match, matching-journey, onboarding) purely due to this Jest/Playwright collision, alongside the 1 genuinely passing Jest suite. The CI `test` job would show the same 4-suite failure — meaning **as configured, `npm test` in CI is currently reporting FAILURE overall** (Jest exit code reflects failed suites even though the one real suite's 30 tests all pass), which would fail the `status` gate job. This is a real, current CI-breaking configuration bug, distinct from the e2e tests simply "not running."
- Local `playwright-report/` and `test-results/` artifacts (both dated 2026-08-09, i.e. **before** the `54b68b8` commit on 2026-08-10 that added `describe.skip` to onboarding.spec.ts) show the **last actual Playwright run**: 10 failed tests, all traceable to `tests/onboarding.spec.ts` (confirmed via `.last-run.json` failure IDs and the archived error-context `.md` files, e.g. "skal visa riktig progress-prosent", "skal visa feilmelding ved tom selfDesc", "skal vise onboarding med progressbar og steg-tittel" — all in onboarding.spec.ts). This strongly implies the *only* spec file that has ever actually been executed via `npx playwright test` in this environment is `onboarding.spec.ts`, and it failed 10/10, after which the response was to skip the whole file rather than fix it. There is no artifact evidence that `chat.spec.ts`, `match.spec.ts`, or `matching-journey.spec.ts` have ever been run and passed (or even run at all).
- `package.json` has no `test:e2e` script; the only defined test script is `"test": "jest"`. A developer or CI pipeline wanting to run Playwright must know to invoke `npx playwright test` manually — it's not wired into any npm script or CI job.

---

## Confirmed Zero-Coverage Areas (explicit grep verification)

- **Admin panel** (beyond the 3 superficial checks in `matching-journey.spec.ts` against `/admin/login` and `/api/admin/users`): **confirmed zero** coverage of the other 33+ admin API routes and all admin UI screens (dashboards, journey-content editor, match inspector, conversation freeze/unlock, observability, security overview, system logs, etc.).
- **Chat image upload / XSS**: **confirmed zero** — grep for `admin|cron|webhook|xss|image|upload` across `e2e/` only matched the `ImageShareLockBanner` UI test (unrelated to actual upload) and the pre-existing admin tests. No test uploads a file to `/api/chat/image`, and no test attempts to inject a script tag / HTML payload into a chat message to verify sanitization.
- **Cron endpoints** (`/api/cron/journey`, `/api/cron/matching`): **confirmed zero** — no match in any test file for `/api/cron`.
- **Webhook endpoint** (`/api/payment/webhook`): **confirmed zero** — no match in any test file for `/api/webhook` or `/api/payment/webhook`. No test of Stripe signature verification, malformed payloads, or event-type handling.

---

## Top 15 Prioritized Missing Tests

1. **Fix the Jest/Playwright collision** so `npm test` (CI's `test` job) only runs Jest unit tests and never attempts to load `e2e/tests/*.spec.ts` — add `testPathIgnorePatterns: ['<rootDir>/e2e/']` to `jest.config.js` (this is a CI-breaking bug, not a missing test, but it blocks all other e2e work from being trustworthy in CI).
2. **Unit/integration test for `/api/chat/send`** to catch the known Zod schema mismatch (`'text'/'image'` vs `'user'/'continue_choice'`) — this is a live production-breaking bug with zero test coverage that would have caught it immediately.
3. **Un-skip and fix `onboarding.spec.ts`** by building a proper onboarding-state auth fixture (wire `auth-onboarding-setup.ts` into `globalSetup` per-project or a `dependencies` setup project) so the 11 existing onboarding tests can actually execute instead of being permanently skipped.
4. **E2E/integration test for chat message send + persistence round-trip**: send a real message via UI, verify it lands in the DB / reappears via `/api/chat/messages`, which would have caught the schema bug end-to-end.
5. **Webhook signature verification tests for `/api/payment/webhook`**: valid signature → processed, invalid signature → rejected, replay/malformed payload handling — currently zero coverage on a security-critical endpoint.
6. **Cron endpoint auth tests** for `/api/cron/journey` and `/api/cron/matching`: verify they reject unauthenticated/unauthorized calls (secret header/token check) and correctly process on valid trigger — currently zero coverage on scheduled jobs that drive core product behavior.
7. **Admin authorization boundary tests**: for each of the 33+ untested `/api/admin/*` routes, at minimum verify non-admin/unauthenticated requests are rejected (403/401) — currently only 2 of 36 admin routes have even superficial coverage.
8. **Chat image upload tests**: valid image accepted, oversized file rejected (>5MB), wrong MIME type rejected, non-participant blocked from uploading to a conversation they're not in — `app/api/chat/image/route.ts` has real validation logic with zero test coverage.
9. **Chat XSS/sanitization test**: submit a message containing `<script>`/HTML payload and verify it's escaped/sanitized on render and/or rejected server-side — no such test exists today for a user-generated-content surface.
10. **Onboarding API contract tests** for `/api/onboarding/save`, `/api/onboarding/progress`, `/api/onboarding/complete`: valid payload accepted, invalid/incomplete payload rejected with clear validation errors, idempotency of `complete`.
11. **Matching algorithm behavior tests** (beyond the constant-sum check already in `journey-engine.test.ts`): given two mock profiles, assert the actual computed match score and that `/api/match/score` responds consistently — today only the weight *constants* are tested, not the algorithm's real output.
12. **Vipps OAuth callback test** (`/api/auth/vipps/callback`): only `authorize` is tested; the callback (token exchange, session creation, error states like denied consent) has zero coverage.
13. **Stripe checkout session creation test** (`/api/payment/create-checkout-session`): verify correct session parameters for each plan, and rejection of tampered/invalid input.
14. **Settings/Profile flow e2e test**: no spec file touches `/settings`, `/profile`, or `/api/profile`, `/api/profile/setup` at all — a core account-management surface is entirely unvalidated.
15. **Strengthen existing "soft" e2e assertions** (`chat.spec.ts`, `match.spec.ts`, most of `matching-journey.spec.ts`) by replacing `if (await x.count() > 0) { assert }` patterns with deterministic seeded test data + real hard assertions — as written, the majority of existing e2e tests can "pass" even when the feature is completely broken or absent, giving false confidence.

---

## Testing Readiness Score

**18%**

Justification: There is exactly one genuinely reliable, meaningful automated test asset in the whole codebase — the 30-test Jest suite for `lib/journey/engine.ts`, which is well-written, deterministic, and 100% passing. Everything else is either not runnable (onboarding e2e entirely skipped), never verified to run (chat/match/matching-journey e2e specs have no artifact evidence of ever passing, and the only historical Playwright run on record failed 10/10), structurally broken in CI (`npm test` collides with Playwright specs and would fail the CI gate as configured today), or so weakly asserted that it cannot catch regressions (the majority of e2e tests use conditional `if (count>0)` patterns that pass trivially when features are missing/broken). Of ~96 API routes, only a small handful are touched by any test at all, and none by a true unit/integration test — everything API-side is e2e-or-nothing, and the e2e layer itself is not trustworthy. The one concrete, current production bug supplied as known context (`/api/chat/send` rejecting all real messages) exists precisely because no test — unit or e2e — actually validates the request/response contract of that route, which is emblematic of the overall gap.

## E2E Readiness Score

**12%**

Justification: E2E readiness must be judged both on what exists and whether it can be trusted/run today. Structurally, the Playwright setup itself is reasonably designed (multi-project config for dashboard vs. onboarding storage states, mobile viewports, retries/tracing on CI, globalSetup pattern) — but the execution reality undermines nearly all of it: (1) the onboarding project's dedicated storageState setup (`auth-onboarding-setup.ts`) is not wired into `globalSetup`, so even if `onboarding.spec.ts` were un-skipped, the onboarding-specific projects would likely fail to authenticate on a clean CI checkout; (2) the one spec file with real historical execution evidence (`onboarding.spec.ts`) failed 10/10 and was subsequently disabled outright rather than fixed, meaning it currently contributes 0% functional e2e coverage despite having the most thoughtfully written test bodies of the four files; (3) the other three spec files (chat, match, matching-journey — 29 tests combined) have no artifact evidence they have ever successfully executed against a running app in this environment, and structurally most of their assertions are conditional/soft, meaning even a "green" run would not prove the underlying features work; (4) Playwright is completely absent from CI (zero grep hits for "playwright" in workflows), so there is no automated gate preventing regressions in any user-facing flow today; (5) entire major surfaces — admin panel (beyond 2 superficial checks), cron jobs, webhooks, chat image upload/XSS, settings/profile, payment checkout — have zero e2e coverage of any kind. Realistically, before this platform can be considered "e2e-tested" in any meaningful sense, the team needs to: fix the Jest/Playwright CI collision, properly wire and validate the onboarding auth fixture, replace soft/conditional assertions with deterministic seeded-data hard assertions across all 4 existing spec files, add a Playwright CI job, and build new coverage for admin/cron/webhook/payment/settings before those flows can be called "e2e readable" at all. The honest current state is that essentially 0% of the platform is provably validated end-to-end today (no green, trustworthy Playwright run exists in CI or in artifacts for any spec file), while the *scaffolding* to get there (config, fixtures, one well-structured but disabled spec) is maybe 25-30% of the way built — netting a low overall score weighted toward "not yet demonstrated to work," not "moderately covered."
