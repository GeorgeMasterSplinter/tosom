# ToSom — Operational Stability Audit

## Build Status

**`npm run build` (prisma generate + next build with lint): FAIL**
- Prisma Client generated successfully (v5.22.0, outdated — latest is 7.9.1).
- Next.js compiled successfully in ~3s.
- **Type checking passed.**
- **Failed at ESLint step** with 2 errors (build-blocking because ESLint errors, not warnings):
  - `components/dashboard/WaitingForMatch.tsx:167:9` — `@next/next/no-html-link-for-pages`: raw `<a href="/onboarding/">` instead of `<Link />`.
  - `components/layout/Header.tsx:72:9` — same rule, raw `<a href="/">`.
- These are trivial, cosmetic lint rules, not type or bundler errors, but as configured they **hard-fail production builds** (`next build` treats ESLint errors as fatal). If CI/CD runs `npm run build` verbatim, deployment is currently broken.

**`npx next build --no-lint`: PASS**
- Confirms the underlying TypeScript/bundler build is healthy — no compile errors once linting is skipped.
- 61 routes generated (mix of static `○` and dynamic `ƒ`).
- Shared JS baseline: **102 kB** first load (chunks 1255: 46.3 kB, 4bd1b696: 54.2 kB) — reasonable for a Next.js App Router app.
- Heaviest pages: `/dashboard` (14.1 kB page / 162 kB total), `/chat/[id]` (11.2 kB / 161 kB), `/onboarding` (17 kB / 119 kB). None are alarming, but `/dashboard` and `/chat/[id]` are the two to watch if more client bundle is added.
- All ~90 `/api/*` routes report a uniform 374 B / 103 kB — expected since API routes don't ship client JS.
- No explicit bundle-size warnings emitted by Next.js itself.
- Middleware bundle: 34.9 kB — moderate; every request pays this cost.

**Actionable fix:** either wrap the two `<a>` tags in `next/link`'s `<Link>` component (trivial, ~2 line fix) or explicitly disable/downgrade that ESLint rule for the build step — but the code fix is preferred since it's nearly free. Until fixed, `npm run build` (the documented build command) fails and blattforms like Vercel/Docker that invoke `npm run build` verbatim (Dockerfile line 16: `RUN npm run build`) will fail to build the image entirely.

---

## Database/Prisma Findings

**Provider:** PostgreSQL via `DATABASE_URL` env var. Prisma 5.22.0 (client) — significantly behind current major (7.x); no `@@check` constraint support, no `driverAdapters`, etc.

**Indexing — generally solid:**
- `User`: indexed on `role`, `email` (already unique+indexed), `lastMatchAt`, `lockedUntil`. Missing an index on `bannedAt`/`deletedAt` even though the matching cron filters on both (`bannedAt: null, deletedAt: null`) combined with `onboardingComplete`/`deepProfileComplete` — those two boolean flags plus `bannedAt`/`deletedAt` are not indexed at all, meaning `findBestResonance`/cron matching queries can force sequential scans over the full `User` table as it grows.
- `Match`: well indexed — `status`, `userAId`, `userBId`, `createdAt`, `expiresAt`, `score`, `normalizedScore`, plus a composite unique `[userAId, userBId]`. Good coverage for the matching/cron queries (`OR: [{userAId...status:'active'}, {userBId...status:'active'}]`), though Prisma/Postgres can't always use a single-column index efficiently across an `OR` on two different columns — a composite index on `(userAId, status, expiresAt)` and `(userBId, status, expiresAt)` would better serve the cron's exact WHERE clause.
- `Conversation`: indexed on `[userAId, userBId]` composite, `matchId`, `endedAt`, `frozenAt`, `lastMessageAt`, `imageShareAllowedAt`. Good.
- `Message`: **only indexed on `createdAt`.** Missing indexes on `conversationId` and `senderId`, which are the two most frequently filtered/joined foreign keys (every chat page load queries `WHERE conversationId = ...`). This is a meaningful gap — as message volume grows this will become a slow, full-table-scanning query on the hottest table in the app.
- `Notification`: indexed on `[userId, createdAt]`, `type`, `readAt`. Good.
- `JourneyProgress`: indexed on `userId` (already unique). Fine.
- `JourneyStateLog`, `ResonanceSession`, `JourneyMilestone`, `PasswordResetToken`, `MagicLinkToken`, `PhoneVerification`, `AuditLog`, `SystemLog`, `PerformanceMetric`, `MatchInsight`, `QuestionCategory`, `GuidedQuestion`: all reasonably indexed on their foreign keys / query fields.
- `Account`: indexed on `userId` + unique `[provider, providerAccountId]`. Good.
- `Session`: **no index on `userId`** (only `sessionToken` unique) — NextAuth session lookups by user could be slow at scale, though session lookups are normally by `sessionToken` so this is low severity.

**Missing FK index — highest priority:** `Message.conversationId` and `Message.senderId` have no explicit `@@index`. Given Message is presumably the largest/fastest-growing table (chat), this should be fixed before scale.

**Cascade deletes:**
- Only two `onDelete: Cascade` relations exist in the whole schema: `Account.user` and `Session.user` (both NextAuth-managed tables) — both sensible (deleting a User should cascade-delete their OAuth accounts/sessions).
- **Every other relation has no `onDelete` behavior specified**, which defaults to Prisma's implicit restrict-like behavior at the DB level (`ON DELETE NO ACTION` / referential action left to Postgres default, i.e. `RESTRICT`). This means deleting a `User` who has a `Profile`, `Match`, `Conversation`, `Message`, `JourneyProgress`, `Notification`, etc. will throw a foreign-key constraint error rather than cascading — likely intentional (soft-delete via `deletedAt`/`bannedAt` is used instead of hard deletes), but there is no explicit `onDelete: Restrict` documented, so this relies on implicit Postgres/Prisma defaults rather than an intentional decision codified in the schema. No risky/accidental cascades found — the opposite risk exists (an admin "delete user" hard-delete operation would fail with FK violations across nearly every table unless a cleanup/cascade is done manually in application code, e.g. as seen in `app/api/admin/users/[id]/route.ts`'s manual `$transaction` cleanup).

**Connection pooling:** No connection-pool configuration found anywhere (`connection_limit`, `pool_timeout`, `pgbouncer` params in `DATABASE_URL`, or Prisma Accelerate/Data Proxy setup). `lib/prisma.ts` uses the standard singleton-via-global pattern (correct for avoiding hot-reload connection leaks in dev), but there's no `connection_limit=` query param on `DATABASE_URL` in `.env.example`/`.env.prod`. The production `DATABASE_URL` in `.env.prod` points to `db.prisma.io` (Prisma Postgres/Accelerate-style host) which may pool internally, but this isn't confirmed/documented anywhere in the codebase. In a serverless (Vercel) deployment this is a real risk of exhausting Postgres max connections under concurrent cron + user traffic, since there's no pgbouncer/Accelerate config visible in code.

---

## Sequential-Await Performance Risks

Grep of `app/api`, `lib/journey/`, `lib/matching/` for `for (...)` loops with `await` inside, and `.map(async ...)` not wrapped in `Promise.all`:

**Confirmed sequential-await-in-loop risks (real DB round-trips per iteration):**

1. **`lib/matching/findBestResonance.ts:212`** — `for (const candidate of candidates) { ... unifiedScore(...) }`. This loop itself is CPU-only (no `await` inside), so it's not an I/O bottleneck, but it iterates over up to 50 candidates synchronously per matching call; fine for now but scales linearly with candidate pool size.
2. **`lib/matching/findBestMatchFor.ts:99`** — same pattern (CPU-bound `matchingEngine` call per candidate, no await inside loop) — not a race/perf risk per se, but note both matching engines (`findBestResonance` and `findBestMatchFor`) exist in parallel as seemingly duplicate/competing implementations, which is a maintenance risk more than a perf one.
3. **`app/api/cron/matching/route.ts:62`** — `for (const user of eligibleUsers) { await findBestResonance(...); await prisma.match.create(...); await prisma.conversation.create(...); ... await prisma.user.update(...) }`. **This is the highest-risk finding.** For every eligible user (uncapped — `eligibleUsers` query has no `take` limit), the cron does ~4-6 sequential awaited DB calls, entirely serially, one user at a time. With hundreds/thousands of eligible users this cron run time grows linearly and could exceed serverless function timeout limits (Vercel default 10s/60s depending on plan). No `Promise.all`/batching/concurrency-limiting is used.
4. **`app/api/cron/matching/route.ts:114`** — nested `for (const userId of [user.id, result.candidateId]) { await prisma.journeyProgress.upsert(...) }` inside the outer loop — a small additional 2x sequential-await multiplier per matched user, could trivially be `Promise.all([...])`.
5. **`app/api/cron/journey/route.ts:51`** — `for (const journey of eligibleJourneys) { await prisma.match.findFirst(...); await prisma.journeyProgress.update(...); await prisma.journeyMilestone.create(...); await prisma.notification.create(...) }`. Same pattern as matching cron — fully sequential per-journey processing, 3-4 awaited calls per record. Mitigated somewhat by `take: 100` cap on `eligibleJourneys`, but still runs up to ~100 × 4 = 400 sequential round trips per invocation.
6. **`app/api/match/accept/route.ts:126`** — `for (const uid of [match.userAId, match.userBId]) { await prisma.journeyProgress.upsert(...) }` — only 2 iterations, low risk, but trivially fixable with `Promise.all`.
7. **`app/api/admin/journeys/route.ts:74`** — `journeys.map(async (j) => { await prisma.match.findFirst(...) })` — this one **is** correctly wrapped in `Promise.all(...)` (line 73), so it's fine — a proper N+1 avoidance pattern using parallel fan-out, though it's still N+1 queries total (one per journey row) rather than a single joined/batched query. Low-medium risk given it's an admin-only paginated list (`limit` param, default 50).
8. **`app/api/questions/route.ts:29`** — `categories.map(async (c) => { await prisma.guidedQuestion.count(...) })` — also correctly wrapped in `Promise.all`. Fine, low volume (fixed category count).
9. **`app/api/admin/resonance/route.ts:73,88,101`** and **`app/api/admin/users/[id]/route.ts:86,88`** (inside `$transaction`) — `for (const match of activeMatches) await tx.match.update(...)` and `for (const conv of conversations) await tx.conversation.update(...)` — sequential awaits, but scoped inside a transaction on a single admin action (single-user ban/deactivate), so volume is bounded and low-risk, though still not using `updateMany` where it could (e.g. `tx.match.updateMany({where: {id: {in: activeMatches.map(m=>m.id)}}, data:{status:'ended'}})` would be strictly better).
10. **`lib/payment/stripe.ts:80`** — `for (const customer of customers.data) { ... }` — Stripe SDK pagination loop; scope/impact not fully assessed but worth a follow-up look if it awaits network calls per customer.

**Summary:** The two cron jobs (`/api/cron/matching`, `/api/cron/journey`) are the clearest scalability risk — fully sequential per-record processing with no concurrency, no batching via `Promise.all`/`p-limit`, and (for matching) no upper bound (`take`) on the eligible-user query at all. As the user base grows, these crons risk timing out or running for increasingly long wall-clock durations, which compounds with the "no overlap protection" finding below.

---

## Race Condition Risks

**`$transaction` usage vs total mutation call sites:**
- Total `create|update|delete|upsert|createMany|updateMany|deleteMany` call sites across `app/` + `lib/`: **~137**
- Total `prisma.$transaction` usages: **5** (`app/api/auth/phone/verify/route.ts:86`, `app/api/match/route.ts:206`, `app/api/admin/users/[id]/route.ts:77` and `:84` (two separate transactions), `lib/chat/markRead.ts:12`)
- **Ratio: ~5/137 ≈ 3.6%.** The overwhelming majority of multi-step mutation flows are NOT wrapped in transactions, meaning partial-state / non-atomic writes are the norm rather than the exception across the codebase.

**`app/api/match/accept/route.ts` — confirmed read-then-write race condition:**
- Flow: (1) `findUnique` match → (2) check `match[acceptField]` is not already set → (3) `update` match setting `acceptedByA`/`acceptedByB` → (4) re-check `bothAccepted` from the *just-updated* record → (5) if both accepted, `update` status to `matched` + lock users + create journey + create conversation.
- **None of steps 1-5 are wrapped in a `$transaction`.** If both users call `/api/match/accept` for the same `matchId` at nearly the same instant:
  - Both requests can pass the "already accepted?" check (step 2) before either's `update` (step 3) commits, since there's no row lock / optimistic concurrency check (no `WHERE acceptedByA IS NULL` guard on the update, no `updateMany` with a conditional count check).
  - More critically: even without that race, the **second** request's step-7 `update` will independently reload `acceptedByA`/`acceptedByB` from the DB, so a genuine double-accept isn't likely to cause duplicate side effects most of the time — but the **"both accepted" branch (steps 8-9)** creates a `conversation` (`prisma.conversation.create`) with no idempotency check. Because `Conversation` has no unique constraint on `matchId`/`[userAId,userBId]` pair, if both requests reach the `bothAccepted` branch concurrently (e.g. userA's accept request is slightly delayed and re-reads a state where userB already accepted), it is possible for **two `Conversation` rows to be created for the same match**, and **two sets of "lock user" updates** to fire redundantly. This is a genuine, exploitable double-processing bug under concurrent requests, and it is not covered by any transaction, unique constraint, or advisory lock.
  - Fix recommendation: wrap the whole accept flow in `prisma.$transaction`, use a conditional `updateMany` (`where: { id: matchId, acceptedByA: null }`) to atomically detect "I am the one flipping this field", and/or add a unique constraint on `Conversation.matchId` to make double-creation fail loudly instead of silently duplicating.

**`app/api/match/[id]/complete/route.ts` — similar risk, lower severity:**
- Flow: `findUnique` match (read status) → validate transition → `update` match status → conditionally `create` conversation / `upsert` journeyProgress / `update` user lock.
- **Also not wrapped in a transaction.** The status-transition validation (`allowedTransitions.includes(newStatus)`) is checked against a value read *before* the write, so two concurrent `PUT` calls with different `action`s (e.g. one user calls "accept" while an admin/other flow calls "reject") could both pass validation against the same stale `previousStatus` and then both write, with the last write wins and no re-validation. Additionally, calling `action: "accept"` twice in quick succession (e.g. double-click / retry) could create **two `Conversation` rows** for the same match (no unique constraint on `Conversation.matchId`, no check for "does a conversation already exist for this match" before creating).
- Lower severity than `/api/match/accept` because this endpoint's transitions object partially guards against re-entry (`"completed": []`, `"ended": []` as terminal states with no allowed transitions), but the double-accept-creates-duplicate-conversation risk is the same underlying flaw.

**Other transactional mutation flows (good examples):**
- `app/api/match/route.ts:206` — correctly wraps match+conversation+journeyProgress creation in a single `$transaction`, explicitly commented `// FASE 2.3 FIX: Alle tre opprettelser i en transaksjon for å unngå partial state`. This shows the team is aware of the pattern but has not applied it consistently to `match/accept` or `match/[id]/complete`, which are arguably higher-risk (user-triggered, concurrent-by-nature) than the cron-triggered `match/route.ts` flow.
- `lib/chat/markRead.ts:12` — transactional wrapper.
- `app/api/admin/users/[id]/route.ts:77,84` — transactional admin ban/deactivate cleanup.

**Conclusion:** Race-condition protection is inconsistent and the two highest-value targets for user-facing concurrency (mutual match acceptance and match completion) are exactly the two endpoints missing it.

---

## Logging & Error Tracking

**`lib/logging.ts`:**
- Provides a clean `logger.{debug,info,warn,error}` API with a consistent `LogEntry` shape (`level`, `message`, `module`, `metadata`, `timestamp`).
- **Structured JSON logging is conditional on `NODE_ENV === 'production'`** — in production, `console.log`/`warn`/`error` receive `JSON.stringify({...})` (good, machine-parseable for log aggregators). In development, it falls back to a human-readable `[timestamp] [LEVEL] [module] message {metadata}` string. This is a reasonable, intentional design — not a flaw.
- All output still goes through `console.log`/`console.warn`/`console.error` — there is no external log shipper/transport (no Winston/Pino transport, no stdout-to-file rotation, no integration with Vercel Log Drains or Datadog/CloudWatch explicitly wired in code — it just relies on the hosting platform to capture stdout).

**`lib/errorTracker.ts`:**
- `trackError`/`trackWarn`/`trackInfo` write to `logger.*` (console) **and** persist to the `SystemLog` Prisma model (DB-backed error log). This is a reasonable lightweight "poor man's Sentry" — errors are queryable via `/api/admin/system/errors` presumably.
- DB write failures are silently swallowed (`catch { /* ignore */ }`) which is correct defensive behavior (logging should never crash the request), but means DB-logging failures are themselves invisible — no fallback secondary channel.
- **No external error-tracking service (Sentry, Bugsnag, Rollbar, etc.) is actually wired up.** `components/system/SentryErrorBoundary.tsx` exists but its own header comment says *"Krever @sentry/nextjs og react-error-boundary for full funksjon"* (requires @sentry/nextjs and react-error-boundary for full function) and the actual Sentry capture call is **commented out**:
  ```
  // If Sentry is installed, log to Sentry:
  // if (typeof window !== "undefined" && (window as any).__SENTRY__) {
  //   (window as any).__SENTRY__.captureException(error);
  // }
  ```
- Confirmed via `package.json` and `node_modules`: **`@sentry/nextjs` (or any Sentry package) is NOT installed** — it's purely scaffolded/aspirational code, not a working integration.
- `utils/flags.ts` defines `enableSentry: process.env.NEXT_PUBLIC_SENTRY_DSN !== ""` — this flag exists but nothing in the codebase actually reads `NEXT_PUBLIC_SENTRY_DSN` to initialize a Sentry client. It's a dead/unused feature flag.
- `config/env.ts` — the required/optional env var registry does **not list `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`, or any error-tracking DSN at all**, in either `REQUIRED_VARS` or `OPTIONAL_VARS`. So there isn't even a documented/validated slot for it; it's referenced ad hoc in `utils/flags.ts` only.

**Conclusion:** Logging is reasonably solid for a self-hosted/DB-backed approach (structured JSON in prod, persisted SystemLog table for querying via admin panel), but there is **no real external error tracking** in production — if the app/server crashes hard (e.g. unhandled promise rejection outside a try/catch, out-of-memory, etc.) before an error reaches `trackError`, there is no external alerting mechanism (no Sentry, no PagerDuty, no Slack webhook on error) to notify the team. All error visibility depends on someone manually checking the admin panel or platform logs.

---

## Webhook Idempotency

**`app/api/payment/webhook/route.ts` — NO idempotency/duplicate-event protection.**
- Signature validation via `validateWebhook(payload, signature)` is present and correct (rejects invalid signatures with 400).
- However, **there is no check against Stripe's `event.id` to detect/reject duplicate deliveries.** Stripe explicitly documents that webhooks can and will be delivered more than once (network retries, at-least-once delivery guarantee) and recommends storing processed `event.id`s (e.g. in a DB table with a unique constraint) to make handlers idempotent.
- Current handler behavior on retry: for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`, the code only `console.log`s the event — there's a `// TODO: Oppdater subscription-status i databasen når Prisma-modell finnes` comment indicating **the actual database write for subscription/payment state is not implemented yet**. This means the webhook is currently a no-op observability shim, so duplicate delivery is *currently* harmless (no double-charging or double-granting side effects), but once the TODO is implemented (persisting subscription status), duplicate webhook deliveries **will** cause redundant/incorrect writes unless idempotency is added at that time.
- There is also no `Prisma` model for `Subscription`/`Payment`/`WebhookEvent` in `prisma/schema.prisma` at all — payment/subscription state isn't modeled in the database yet, which is consistent with the TODO comment. This is a functional gap as much as an idempotency gap.
- **Recommendation:** before wiring up real subscription persistence, add a `WebhookEvent` table (`id` = Stripe event id, unique) and check-and-insert at the top of the handler (`try { await prisma.webhookEvent.create({data:{id: event.id}}) } catch { return NextResponse.json({received:true}) /* already processed */ }`) before executing any side effects.

---

## Cron Overlap Protection

**`app/api/cron/journey/route.ts` and `app/api/cron/matching/route.ts` — NO locking/mutex against overlapping runs.**
- Both routes are plain `GET` handlers gated only by a `CRON_SECRET` query-param/header check (`secret !== process.env.CRON_SECRET` → 401). There is no:
  - Advisory lock (e.g. Postgres `pg_advisory_lock`)
  - "is a run currently in progress" flag/row (e.g. a `CronLock` table or a Redis lock)
  - Idempotency/run-id tracking
  - Any check of `SystemLog`/timestamps to bail out if a previous invocation is still active
- **Risk scenario:** Vercel Cron (per `vercel.json`, `/api/cron/matching` at `0 5 * * *` and `/api/cron/journey` at `0 7 * * *`) fires once daily, which is low collision risk *by schedule*, BUT:
  - If a manual/duplicate trigger occurs (e.g. someone hits the URL manually, a retry from a failed cron dispatch, or a second Vercel Cron region fires — Vercel has documented rare double-invocation edge cases), two concurrent runs of `/api/cron/matching` could each fetch the same `eligibleUsers` list (since neither run marks users as "being processed"), and could **create duplicate `Match` records for the same user pair** in the same window if the first run's `prisma.user.update({lastMatchAt})` hasn't landed yet when the second run reads `eligibleUsers`. There's a `@@unique([userAId, userBId])` constraint on `Match`, which would cause the second `prisma.match.create` to throw on true duplicates for the *same* pair — but two concurrent runs could still each independently match `user.id` to *different* candidates (candidate B for run 1, candidate C for run 2), effectively giving one user two simultaneous active matches, violating the app's core "one match at a time" rule, since the exclusion logic (`isUserMatchable` / `excludedIds` set) is computed via read queries with no locking, so both runs can pass the "matchable" check simultaneously.
  - Similarly, `/api/cron/journey` advancing `day`/`phase` twice for the same `JourneyProgress` row in overlapping runs could double-advance a user's journey day count (skip a day) since there's no `WHERE nextDayAt <= now()` re-check inside a locked transaction — the update just sets absolute new values, so two concurrent runs reading the same stale `journey.day` would both compute `newDay = journey.day + 1` and the second write would just overwrite with the same value (not a double-increment in this specific case, since both writes converge on the same `newDay`), but a duplicate `JourneyMilestone` and duplicate `Notification` (phase-change) row would be created — an idempotency/duplicate-side-effect issue rather than corrupted state.
- **Recommendation:** Add a simple `CronRun` table (or Postgres advisory lock keyed by cron name) that the cron acquires at the start and releases (or expires via TTL) at the end, returning `200 { skipped: true }` if a lock is already holder. This is a low-effort, high-value fix given the current complete absence of protection.

---

## Next.js Production Config

**`next.config.js` — reviewed in full:**
- **Security headers:** Good baseline set applied globally via `headers()`:
  - `X-Content-Type-Options: nosniff` ✅
  - `X-Frame-Options: DENY` ✅
  - `X-XSS-Protection: 1; mode=block` ✅ (legacy/deprecated header, harmless to include but no longer meaningful in modern browsers)
  - `Referrer-Policy: strict-origin-when-cross-origin` ✅
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` ✅ — but **applied unconditionally**, not gated to production-only despite the comment "// HSTS (production only)" — in dev this header is harmless (browsers ignore HSTS on `localhost`/non-HTTPS), so low risk, but the comment is misleading/inaccurate versus the actual code.
  - **Missing: Content-Security-Policy (CSP).** No CSP header is set anywhere. This is the most significant gap in the security-header set — CSP is one of the strongest defenses against XSS given the app renders user-influenced content (chat messages, profile bios) and there's no explicit inline-script/style lockdown.
  - **Missing: Permissions-Policy** (restricting camera/mic/geolocation) — not critical for this app's feature set but a common hardening addition.
- **Image config:** `remotePatterns` explicitly allow-lists `**.uploadthing.com`, `*.s3.amazonaws.com`, `tosom-storage.up.railway.app` over HTTPS only — reasonable allow-list approach (not overly permissive wildcard-all).
- **`experimental.serverActions.allowedOrigins: ['*']`** — **this is a real concern.** Allowing `*` for server actions' allowed origins effectively disables CSRF-style origin checking for Next.js Server Actions, which could allow cross-site requests to trigger server actions if any are exposed. Should be restricted to the actual production domain(s) (`tosom.no`, `www.tosom.no`, preview deployment domains).
- **`generateBuildId: async () => 'build-' + Date.now()`** — ensures every build gets a unique ID (defeats any static-asset long-term caching collisions across deploys); reasonable but means Next.js's built-in build-id-based cache-busting is always "fresh" — no functional issue.
- **Output mode:** **No `output: 'standalone'` (or any `output` key) is set.** This is notable because:
  - `Dockerfile` (root) does a full `npm ci` + copies `node_modules` + runs `npm start` — works fine without standalone mode (larger image, but functional).
  - `deploy/docker/Dockerfile` (the "production" one, multi-stage, with healthcheck) explicitly does `CMD ["node", "server.js"]` and copies `.next` — **this will fail** because without `output: 'standalone'` in `next.config.js`, Next.js does not generate a `server.js` file in `.next/standalone/` (confirmed: `.next/standalone` directory does not exist in this build). This is a **deploy-breaking mismatch** between the Dockerfile's expectations and the Next.js config. Either `next.config.js` needs `output: 'standalone'` added, or `deploy/docker/Dockerfile` needs to be changed to use `npm start` instead of `node server.js`.
- **Redirects:** No `redirects()` function defined — no forced HTTPS redirect, www/non-www canonicalization, or legacy-path redirects configured at the Next.js level (may be handled by the reverse proxy/nginx instead — see Docker section).
- `compress: true` and `poweredByHeader: false` — both good, minor hardening/perf defaults.
- Cache-Control headers for `_next/static/*` (1yr immutable) and `favicon.ico` (1 day) are correctly configured.

---

## Docker/Deploy Config

Two separate Dockerfiles exist, which is itself a maintenance smell (unclear which is authoritative):

**Root `Dockerfile`:**
- 3-stage build (`base` → `deps` → `builder` → `runner`), reasonably structured, uses `node:20-alpine`.
- Runs `npm ci` (not `--only=production` in the deps stage, so full devDependencies are installed for the build stage — correct, needed for `next build`).
- Copies full `node_modules` (not pruned) into the final `runner` image — **image will be larger than necessary** since dev dependencies remain in `node_modules` in the runner stage (no separate "prod-only install" step for the final copy).
- Creates and uses a non-root `nodejs` user — good security practice.
- `EXPOSE 3000`, `CMD ["npm", "start"]` — functional given no `output: standalone`.
- **No `HEALTHCHECK` instruction.**
- **No resource limits** (these are typically applied at the orchestrator level — docker-compose/k8s — not in the Dockerfile itself, so this is expected here, but see docker-compose below, which also lacks them).

**`deploy/docker/Dockerfile` (the "production" variant, per its header comment):**
- Proper 3-stage build (`base`/deps, `builder`, `production`), `npm ci --only=production` for the runtime-deps stage — better dependency hygiene than the root Dockerfile.
- Non-root user (`nextjs`) — good.
- **`HEALTHCHECK` instruction present** (`wget --spider http://localhost:3000/api/system/health`, 30s interval, 3 retries) — good practice, and better than the root Dockerfile.
- **However, as noted above, `CMD ["node", "server.js"]` will fail** because the build doesn't produce a standalone `server.js` without `output: 'standalone'` in `next.config.js`. This Dockerfile is currently broken/unusable as-is unless that config change is made.
- Copies `prisma/` folder into production image (needed for the `prisma generate` client, though the generated client itself should already be in `node_modules/.prisma` from the builder stage — copying the schema folder too is redundant but harmless).

**Root `docker-compose.yml`** (dev-only, single Postgres service):
- Just a local dev Postgres container (`postgres:15`), no app service, no healthcheck, no resource limits — acceptable for a pure local-dev compose file, not intended for production.

**`docker-compose.test.yml`:**
- Postgres 16-alpine on port 5433, **has a proper `healthcheck`** (`pg_isready`), good.
- No resource limits (acceptable for CI/test ephemeral containers).

**`deploy/docker-compose.prod.yml`:**
- 3 services: `app`, `postgres`, `reverse-proxy` (nginx), on a shared `tosom-internal` bridge network.
- `app` service: `restart: "no"` — **notable choice**; typically production services should use `restart: unless-stopped` or `always` so the container recovers automatically after a crash or host reboot. As configured, if the app container crashes, it stays down until manually restarted (or an external orchestrator like systemd — see `deploy/systemd.service` — restarts it; this may be the intended design, offloading restart policy to systemd instead of Docker, which is a valid pattern but not obviously documented).
- `app` service: **no `HEALTHCHECK`** defined at the compose level (the Dockerfile-level healthcheck from `deploy/docker/Dockerfile` would still apply if that image is used, assuming `docker-compose.prod.yml`'s `image: registry.tosom.no/tosom:prod` was built from that Dockerfile — consistent, but again gated on fixing the standalone/server.js mismatch above).
- **No resource limits** (`mem_limit`/`cpus` or `deploy.resources.limits`) on any service (`app`, `postgres`, `reverse-proxy`) — under memory pressure, a runaway container (e.g. a memory leak in the Node process, or Postgres under heavy load) has no ceiling and could OOM-kill the host or starve sibling containers.
- `postgres` service: `restart: unless-stopped` — correct. Data volume + a host-mounted `/backups` volume — good, implies backup tooling exists externally (see `deploy/backup.md`).
- `reverse-proxy` (nginx): terminates TLS (`/etc/letsencrypt` mounted read-only), correct pattern; exposes 80/443 to the host. No healthcheck on nginx itself.
- Secrets (`DB_USER`, `DB_PASS`, `NEXTAUTH_SECRET`, `AI_API_KEY`) are correctly pulled from `${VAR}` environment substitution rather than hardcoded — good practice, assuming the `.env` used to populate these at deploy time is itself properly secured/excluded from git (confirmed: only `.env.example` and `.env.test` are tracked in git; `.env`, `.env.local`, `.env.prod` are gitignored — good, though note `.env.prod` exists as a real file on disk in this workspace with a live-looking `CRON_SECRET` and a `db.prisma.io` connection string with an embedded credential, which is fine as long as it truly is `.gitignore`'d and not accidentally included in any Docker build context or CI artifact).

---

## Operational Stability Score

**Score: 46 / 100**

**Justification:**
- **Build pipeline is broken as documented** (`npm run build` fails on lint errors, and the "production" Dockerfile (`deploy/docker/Dockerfile`) is incompatible with the current `next.config.js` — missing `output: 'standalone'` — meaning neither the standard build command nor the dedicated production Docker image can be trusted to produce a deployable artifact without manual intervention today). This alone caps the score significantly, though the underlying TypeScript/bundler compilation itself is healthy and the fixes required are small and well-understood.
- **Race conditions in core user-facing flows** (mutual match acceptance, match completion) are real and unmitigated — no transactions, no unique constraints preventing duplicate conversation creation, no optimistic-concurrency guards. This directly threatens data integrity for the app's central feature (matching).
- **Cron jobs have zero overlap protection and are fully sequential/unbounded** (especially `/api/cron/matching`, which has no `take` limit on eligible users), risking both duplicate-match creation under concurrent invocation and eventual timeout/performance degradation as the user base scales.
- **No real external error tracking** — Sentry is scaffolded but not installed/wired, so production incidents depend entirely on someone manually reviewing DB-backed `SystemLog` or platform stdout logs; there's no proactive alerting.
- **Webhook idempotency is currently masked by incomplete implementation** (the Stripe webhook doesn't yet persist anything, so duplicate deliveries are harmless today) but this is a ticking time bomb — the moment subscription persistence is added (per the visible `TODO`), duplicate-delivery bugs will appear unless idempotency is added at the same time.
- **Positive findings that keep the score from being lower:** solid security headers baseline (minus CSP), sensible index coverage on most hot tables (Match, Conversation, Notification), structured JSON logging in production with DB-backed error persistence, a working multi-stage Docker build with non-root users and a healthcheck (in the `deploy/` variant), correct secret-management via env-var substitution in compose files, and at least one example of the transactional pattern being applied correctly (`app/api/match/route.ts`) showing the team already knows the right pattern — it just hasn't been applied consistently to the two highest-risk endpoints.
- Net assessment: the application is **functional under normal, non-concurrent, low-scale conditions**, but has multiple concrete, identified gaps that will surface as real incidents (duplicate matches, duplicate conversations, broken production Docker build, silent production errors) as soon as traffic, concurrency, or deployment automation increase — consistent with a 40-50% "operationally half-ready" rating rather than a passing grade.
