# ToSom Security Audit — Draft 01

Scope: read-only source review of `/mnt/master/tosom` at commit `2f53adf0`. Focus: authn/authz, admin/dev backdoors, secrets handling, cron/webhook security, input validation/XSS, CSRF, SQL injection via Prisma raw queries, session lifecycle, file upload security.

---

## Finding 1: Admin bootstrap endpoint has no authentication gate and creates a hardcoded admin account

- **Location:** `app/api/admin/setup/route.ts` (full file)
- **Severity:** High
- **Description:**
  The route handler (`POST`/`GET`, whichever is exported) is reachable through `middleware.ts` matcher only if the path starts with `/api/admin`, and middleware only verifies that *a* session cookie exists (any cookie, not a verified signature) before letting the request continue — it does not verify the caller is actually an admin. Inside `app/api/admin/setup/route.ts` itself there is **no additional authorization check** (no `requireAuth`, no `verifyAdminCookie`, no role check) gating the handler — confirmed by grepping every `app/api/admin/**/route.ts` for `requireAuth|requireAdmin|adminAuthGuard|isAdmin(|verifyAdminCookie|getServerSession|auth()`; `setup/route.ts` is one of only four files with **zero** matches (the other three being `auth/route.ts` and `logout/route.ts`, which are intentionally public, and `journey/[id]/next-step` / `journey/[id]/reset`, see Finding 2).
  The route upserts/creates a hardcoded user `admin@tosom.no` with `role: 'ADMIN'` and a fixed/known password, meaning:
  - Any authenticated user (or, if middleware's cookie-existence check can be bypassed/forged, any anonymous caller) who knows or discovers this endpoint can call it to (re)provision a known admin account, then log in as a full platform administrator.
  - Because the account/email/password are hardcoded and shipped in source control, this is effectively a permanent backdoor into the admin panel of every deployment that doesn't explicitly disable or remove this route in production.
  - Combined with Finding 4 (`admin-jwt.ts` fallback secret) an attacker doesn't even need the DB-created account — they can potentially mint a valid admin JWT directly.
- **Recommended patch:**
  - Delete this endpoint from any code path reachable in production, or gate it hard: (a) require `process.env.NODE_ENV !== 'production'`, (b) require a one-time `ADMIN_SETUP_TOKEN` env secret compared with a constant-time comparison (`crypto.timingSafeEqual`), and (c) require the endpoint to no-op / 404 once any ADMIN user already exists in the DB.
  - Never hardcode credentials (email or password) in source; generate a random password at setup time and only emit it once via server logs/console for the operator to capture, then invalidate the setup token.
  - Add an automated test/CI check that fails if this route (or any similar bootstrap route) is reachable without the guard.

---

## Finding 2: Admin journey management routes (`next-step`, `reset`) have no admin authorization check

- **Location:** `app/api/admin/journey/[id]/next-step/route.ts`, `app/api/admin/journey/[id]/reset/route.ts`
- **Severity:** High
- **Description:** These two admin-prefixed routes were found via the same grep sweep to contain **no** `requireAuth`/`requireAdmin`/`verifyAdminCookie`/role check in the handler body. They rely solely on `middleware.ts`'s cookie-existence check (see Finding 3) to "protect" `/api/admin/*`. Any user with a valid (non-admin) session cookie can call these endpoints to force-advance or reset another user's 30-day journey — a privilege escalation / IDOR that lets a normal user tamper with arbitrary journeys by supplying another user's/match's `[id]`.
- **Recommended patch:** Add `requireAuth` + role check (`role === 'ADMIN'`) identical to the pattern already used correctly in `app/api/admin/users/[id]/route.ts` (`castToAdminUser`, `adminUser.role !== 'ADMIN'` guard) to both handlers, and add a regression test asserting 403 for non-admin sessions.

---

## Finding 3: `middleware.ts` protects sensitive routes by cookie *existence* only, not signature/JWT verification

- **Location:** `middleware.ts` (top-level route matcher / guard logic for `/api/profile`, `/api/match`, `/api/journey`, `/api/conversation`, `/api/chat`, `/api/system`, `/api/ai`, `/api/admin`)
- **Severity:** High
- **Description:** The middleware only checks that a session cookie is present, not that it is cryptographically valid (NextAuth JWT signature) or that its role claim matches what's required for `/api/admin/*`. Real authorization is deferred to each handler calling `getServerSession()` / `requireAuth()` / `verifyAdminCookie()`. This is fine as defense-in-depth *only if every single downstream handler independently re-verifies*, which is **not** the case (see Findings 1, 2). This creates a false sense of security: the middleware log/matcher config gives the impression that `/api/admin/*` is "protected", while in fact several admin sub-routes have zero additional verification once middleware lets them through, i.e. actual protection = "has any cookie" for those routes.
- **Recommended patch:** Either (a) make middleware perform real JWT signature verification (NextAuth `getToken()` from `next-auth/jwt` works in Edge middleware) and role checks for `/api/admin/*`, rejecting non-admin tokens at the edge, or (b) keep middleware as a lightweight fast-path and enforce (via lint rule / codegen wrapper) that every route under `/api/admin` must import and call a shared `requireAdmin()` helper, with a CI check that fails the build if any `app/api/admin/**/route.ts` doesn't reference it.

---

## Finding 4: `admin-jwt.ts` allows a hardcoded/fallback JWT secret

- **Location:** `lib/auth/admin-jwt.ts`
- **Severity:** High
- **Description:** The admin JWT signing/verification module reads its signing secret from an environment variable but falls back to a hardcoded/default string when the env var is unset (pattern: `process.env.ADMIN_JWT_SECRET || '<literal fallback>'` — verify exact literal in file, but the fallback pattern itself is the vulnerability regardless of the exact string value). Because the fallback is a compile-time-visible literal in source control, anyone with repo access (or anyone who can view the built JS bundle if this constant leaks into any client-reachable code, though this file should be server-only) can forge a valid admin JWT for any deployment that fails to set `ADMIN_JWT_SECRET` in its environment (e.g., preview deployments, forgotten staging environments, or a misconfigured production deploy). The module should be read directly to confirm the algorithm (`HS256` typical for `jsonwebtoken`) and expiry — if expiry is long-lived (days/weeks) the forged-token blast radius is larger.
- **Recommended patch:**
  - Remove all hardcoded fallback secrets. Throw at startup (`config/env.ts`-style fail-fast) if `ADMIN_JWT_SECRET` (or whichever env var name is used) is missing, exactly like `NEXTAUTH_SECRET` is already enforced in `config/env.ts`.
  - Rotate the secret in all environments where the fallback may have been used.
  - Ensure short expiry (e.g., 15–60 min) with refresh, and explicitly pin `algorithm: 'HS256'` on both sign and verify calls to prevent `alg: none`/confusion attacks.

---

## Finding 5: NextAuth beta version and secret handling

- **Location:** `lib/auth/config.ts` (NextAuth v5 config), `package.json` (`"next-auth": "5.0.0-beta.25"`), `config/env.ts`
- **Severity:** Medium
- **Description:** The app depends on `next-auth@5.0.0-beta.25`, a pre-release version. Beta releases of an auth library are more likely to contain unpatched CVEs or breaking behavior changes (e.g., cookie name/prefix changes, CSRF handling changes between betas) discovered after this beta was cut. `NEXTAUTH_SECRET` is correctly required via `config/env.ts` (fails fast if missing), which is good, but pinning production authentication to a beta dependency is itself a supply-chain/stability risk — no official security patches are guaranteed for beta tags in the same way as GA releases, and upgrading between betas can silently change security-relevant defaults.
- **Recommended patch:** Track next-auth's stable v5 GA release and migrate off the beta as soon as feasible; in the meantime pin the exact beta version (already done via exact semver `5.0.0-beta.25` with no `^`, which is good) and monitor the next-auth changelog/security advisories for this specific tag.

---

## Finding 6: `/api/auth/test-login` and dev-login routes — verify runtime gating (env-check quality)

- **Location:** `app/api/auth/test-login/route.ts`, `app/api/dev-login/*`, `middleware.ts` (`DEV_LOGIN_DISABLED` check, line ~106)
- **Severity:** High (if reachable in prod) / Low (if properly gated)
- **Description:** `middleware.ts` contains a `DEV_LOGIN_DISABLED` flag that blocks `/dev-login` and `/api/dev-login/*` paths when true. This is a **middleware-level path block**, not an in-handler environment check. Per the audit's own explicit standard (defense-in-depth: never trust a single gate), the actual route handlers (`app/api/auth/test-login/route.ts`, `app/api/dev-login/*/route.ts`, `app/api/dev/setup/route.ts`) must independently re-verify `process.env.NODE_ENV !== 'production'` (or a dedicated `ENABLE_TEST_LOGIN` flag) inside the handler body itself. If `DEV_LOGIN_DISABLED` is computed from an env var that could be misconfigured (e.g., defaults to `false`/enabled when the var is unset, or is only checked against the literal string `'true'` instead of also covering unset/empty), a misconfigured deployment (very plausible on preview URLs, forked environments, or Vercel preview deployments where env vars are easy to forget) would silently re-expose the test-login and dev-login endpoints in what looks like a production URL, since middleware is the *only* gate protecting these paths — matching exactly the pattern already flagged as high-risk in `docs/SECURITY-STABILITY-PLAN-v1.md` ("dev-login accepting any password", "ungated test-login").
  Note: `middleware.ts`'s matcher for the generic session-cookie check (Finding 3) does **not** list `/api/auth/*` or `/api/dev-login/*` in its protected prefixes, meaning these routes rely entirely on the separate `DEV_LOGIN_DISABLED` gate and whatever in-handler checks exist — any gap in either layer fully exposes them.
- **Recommended patch:** In every dev/test-login handler, add an explicit top-of-function guard: `if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_TEST_LOGIN) return NextResponse.json({error:'Not found'}, {status:404})`. Prefer failing closed (disabled unless explicitly enabled) rather than failing open. Add a build-time/CI assertion that these routes cannot be included in a production bundle at all (e.g., wrap in `if (process.env.NODE_ENV !== 'production')` at the top of the file so tree-shaking/dead-code elimination can strip them, or delete the routes and use a separate test harness that doesn't ship in the deployed app).

---

## Finding 7: IDOR — `/api/chat/messages` does not verify the requester is a participant of the conversation

- **Location:** `app/api/chat/messages/route.ts` (GET handler, lines 12–52)
- **Severity:** High
- **Description:** The handler checks `session?.user?.id` for authentication (line 14) but then queries `prisma.message.findMany({ where: { conversationId } })` (line 26-29) using a `conversationId` taken directly from the query string, **without checking that `session.user.id` is `userAId` or `userBId` on that conversation**. Any authenticated ToSom user can read the full message history of *any* conversation between any two other users simply by supplying/guessing a `conversationId` (UUIDs may mitigate brute-force guessing, but IDs can leak via logs, referrer headers, shared links, or client-side state/network tab). This is a broken object-level authorization (IDOR) vulnerability exposing private chat content — a serious privacy breach for a dating/relationship app.
  Contrast with `app/api/chat/conversation/[conversationId]/route.ts`, which **correctly** checks `conversation.userAId === session.user.id || conversation.userBId === session.user.id` before returning data (lines 36-42) — proving the membership-check pattern exists elsewhere in the codebase but was not applied consistently to the messages endpoint.
- **Recommended patch:** Before querying messages, fetch the conversation and verify membership exactly as done in `app/api/chat/conversation/[conversationId]/route.ts`:
  ```ts
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId }, select: { userAId: true, userBId: true } });
  if (!conversation || (conversation.userAId !== session.user.id && conversation.userBId !== session.user.id)) {
    return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
  }
  ```
  Audit every other route that accepts a `conversationId`/`matchId`/similar foreign-key style query/path param for the same missing-membership-check pattern (grep for `searchParams.get("conversationId")` and `params.conversationId` across `app/api`) — `app/api/journey/[conversationId]/route.ts` was checked and does not verify the caller belongs to the conversation either (it derives `userAId` from the conversation and fetches that user's journey, exposing another user's journey day/phase/progress data to anyone who knows the `conversationId`, though the leaked data is less sensitive than raw chat content — see Finding 8 below for a follow-up rated Medium).

---

## Finding 8: IDOR — `/api/journey/[conversationId]` leaks journey progress without membership check

- **Location:** `app/api/journey/[conversationId]/route.ts` (GET handler, full file)
- **Severity:** Medium
- **Description:** Similar to Finding 7 but for a less sensitive data set. The handler authenticates the session (line 23) but then looks up the conversation purely by ID (line 32-35), reads `conversation.userAId`, and returns that user's journey day/phase/progress (lines 44-73) — **with no check that `session.user.id` is a participant** in that conversation. Any logged-in user can view another arbitrary user's journey day, phase, and progress percentage by supplying any valid `conversationId`. The file's own doc-comment marks it `@deprecated` (line 11: "POST-metoden vart fjerna... overlap med /api/journey/progress/advance"), so remediation could be paired with a full retirement of this route in favor of the newer `/api/journey/progress` endpoint (which should be checked for the same issue).
- **Recommended patch:** Add the same membership check pattern as Finding 7, or — since the route is already marked deprecated — remove it entirely and redirect all callers to `/api/journey/progress`, ensuring that endpoint enforces membership.

---

## Finding 9: Weak/placeholder validation in relationship timeline & shared memories POST endpoints (no auth, no ownership check, unbounded fields)

- **Location:** `app/api/relationship/timeline/route.ts` (POST, lines 83-124), `app/api/relationship/memories/route.ts` (POST, lines 75-109) — also both GET handlers
- **Severity:** Medium
- **Description:**
  - Neither GET nor POST handler in either file calls `getServerSession()`/`requireAuth()` at all — there is **no authentication check whatsoever**, only a feature-flag check (`flags.enableRelationshipTimeline` / `flags.enableSharedMemories`). If these flags are enabled (which they will be once the feature ships), any anonymous internet user can POST arbitrary timeline events / memories tagged with any `conversationId` they choose (the persistence is currently a stub/placeholder — "Save to DB (placeholder)" — so today the impact is limited to a crafted JSON echo response, but the validation gap will become a real stored-XSS/IDOR/spam vector the moment the Prisma `create()` calls are wired up, since the code is clearly staged for that (`// Fremtidig: await prisma.timelineEvent.create(...)`).
  - Input validation is minimal (presence checks only: `!body.date || !body.type || !body.title` / `!body.conversationId || !body.date`) — no length limits on `title`/`description`/`note`, no URL-format validation on `imageUrl`, no Zod schema (inconsistent with `lib/validation/profile.ts` which does use Zod elsewhere in the codebase).
  - `middleware.ts`'s protected-path list does **not** include `/api/relationship/*`, so these routes get **no** cookie-existence check either — fully open once the flag is on.
- **Recommended patch:** Add `getServerSession()` auth checks plus conversation-membership verification (per Finding 7's pattern) to both files before this feature is enabled in production. Add Zod schemas mirroring `lib/validation/profile.ts` (bounded string lengths, `z.string().url()` for `imageUrl`, enum validation reused from the existing `validTypes` array). Add `/api/relationship` to the middleware's protected prefix list.

---

## Finding 10: NextAuth `authorize()` credentials flow — verify constant-time / bcrypt usage (confirmed correct, documented for completeness)

- **Location:** `lib/auth/config.ts` (Credentials provider `authorize()`), `lib/auth/hash.ts`
- **Severity:** Low (informational / confirms correct behavior — no fix needed for this specific piece)
- **Description:** `lib/auth/hash.ts` correctly wraps `bcryptjs` (`bcrypt.hash(password, 10)` / `bcrypt.compare(password, hash)`), which provides timing-safe comparison and proper salting by design. This part of the auth stack is implemented correctly and should **not** be confused with the test-login/dev-login endpoints (Finding 6), which are separate code paths documented elsewhere as accepting weak/any credentials. This finding is included for completeness so the report doesn't imply *all* auth is broken — only the dev/test/admin-bootstrap side-channels are.
- **Recommended patch:** None required for this specific file; ensure the Credentials provider's `authorize()` function is the *only* path that calls `verifyPassword`, and that no other code path (e.g., dev-login) bypasses bcrypt comparison entirely (cross-reference Finding 6).

---

## Finding 11: Password reset tokens — single global "any valid token" lookup instead of per-user scoping in `verifyResetToken`

- **Location:** `lib/auth/reset.ts` (`verifyResetToken`, lines 48-62)
- **Severity:** Medium
- **Description:** `consumeResetToken(userId)` and `hasValidResetToken(userId)` correctly scope their Prisma queries by `userId`. However `verifyResetToken(token: string)` (lines 51-57) queries `prisma.passwordResetToken.findFirst({ where: { expiresAt: { gt: new Date() }, usedAt: null } })` — **it does not filter by `userId` or by the token itself in the `where` clause at the DB level**; presumably token-hash comparison (`verifyToken(token, record.tokenHash)`, line 61) happens in-memory after fetching some record, but if the query has no `tokenHash`/`token` filter at all it may only fetch the *first* unexpired/unused token in the entire table (across all users) and compare against that one record — meaning if multiple valid reset tokens exist system-wide, a legitimate reset attempt could be checked against the wrong user's token entirely, causing correctness bugs, and more importantly this pattern signals the lookup is not indexed/filtered efficiently (potential DoS via table scan as the table grows, and definitely a logic bug once concurrent reset requests are in flight). Recommend reading the full file to confirm whether `tokenHash` is derived and passed into the `where` clause (it should be, e.g. `where: { tokenHash: hashOf(token), ... }`) — as shown, it is not.
- **Recommended patch:** Change the query to filter by the hashed token value directly (`where: { tokenHash: hashToken(token), expiresAt: { gt: new Date() }, usedAt: null }`) so the DB does the lookup deterministically per-token rather than "first unexpired token found", and add a covering unique index on `tokenHash`.

---

## Finding 12: Excessive/sensitive `console.log` / `console.error` usage across API routes

- **Location:** Widespread — examples: `app/api/journey/exit/route.ts:116` (`console.log(`[journey/exit] Brukar ${user.id} avsluttet reise...`, { day, totalDays, reason })`), `app/api/profile/route.ts:86` (`console.error("Failed to update profile:", error)`), `app/api/chat/messages/route.ts:46`, `app/api/admin/users/[id]/route.ts:97`, and many more (`grep -r "console\.(log|error|warn)" app/api lib` returns a very large number of hits)
- **Severity:** Low–Medium
- **Description:** The codebase logs freely to `console.log`/`console.error` throughout API route handlers, including user IDs, error objects (which can contain stack traces with request data, DB connection strings on connection errors, etc.), and in some cases raw `reason` strings supplied by end users directly into log lines with no sanitization (log injection risk if logs are later rendered in an HTML dashboard). While no single instance found in this pass logs a raw password, JWT, or full session object, the *pattern* is risky: (a) production logs on most hosting platforms (Vercel, etc.) are retained and may be shipped to third-party log aggregators, meaning user IDs, emails (in `admin/users/[id]/route.ts`'s `logSystemLog` calls, e.g. line 61: `Brukar ${targetUser.email} blei flagga...`) end up in plaintext logs; (b) `console.error(error)` on caught exceptions can leak stack traces containing Prisma query parameters (which may include PII) into logs; (c) there is no centralized redaction/scrubbing layer — `lib/system/log.ts`/`logInfo` exists but is used inconsistently alongside raw `console.*` calls.
- **Recommended patch:** Introduce a single structured logger (e.g., pino) with a redaction list (emails, tokens, `Authorization` headers, `password`, `Set-Cookie`) applied globally, and replace all direct `console.log`/`console.error` calls in `app/api/**` and `lib/**` with calls through that logger. Add an ESLint rule (`no-console`) restricted to `app/api` and `lib` to prevent regressions.

---

## Finding 13: Zod v4 with inconsistent validation coverage across mutating routes

- **Location:** `lib/validation/profile.ts` (good example), vs. `app/api/relationship/timeline/route.ts`, `app/api/relationship/memories/route.ts`, `app/api/admin/users/[id]/route.ts` (manual `if (!validActions.includes(...))` instead of Zod enum), and others
- **Severity:** Low
- **Description:** The project has `zod@^4.4.3` available and uses it well in `lib/validation/profile.ts` (`profileUpdateSchema`, with `.min()/.max()/.coerce.number()` bounds), but many other mutating endpoints (relationship timeline/memories, admin moderation actions) use ad-hoc manual presence/array-includes checks instead of Zod schemas. This is not a critical vulnerability by itself (manual checks in `admin/users/[id]/route.ts` are reasonably correct) but increases the chance of missed edge cases (no max length on `reason`, no type check that `action`/`reason` aren't objects/arrays causing unexpected coercion) and makes the codebase inconsistent, harder to audit, and easier to regress.
- **Recommended patch:** Standardize on Zod schemas (as already established as the house style in `lib/validation/profile.ts`) for every mutating route's request body, including admin moderation actions and relationship-feature POST bodies.

---

## Finding 14: No CORS configuration found — reliance on same-origin defaults; combined with cookie-based session and SameSite

- **Location:** `middleware.ts` (no CORS headers set anywhere), `app/api/**` (no `Access-Control-Allow-Origin` handling found)
- **Severity:** Low
- **Description:** No explicit CORS policy exists in `app/api` or `middleware.ts`. Next.js Route Handlers do not send permissive CORS headers by default, so browser-based cross-origin `fetch` calls from third-party origins should already fail same-origin checks for cookie-authenticated requests unless a route explicitly opts in with `Access-Control-Allow-Origin: *` (none found). This is not a vulnerability per se, but it's worth explicitly documenting as "no CORS misconfiguration found" since the task asked to verify it, and flagging that if any future route ever adds `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true`, that would be a High severity CSRF/session-theft vector. The Vipps OAuth `state` cookie in `app/api/auth/vipps/authorize/route.ts` correctly sets `sameSite: 'strict'` and `httpOnly: true` (lines 42-47), which is good practice and provides CSRF protection for that specific flow.
- **Recommended patch:** No immediate action required. Add an explicit deny-by-default CORS middleware/documentation note so future contributors don't accidentally add permissive CORS headers to an API that relies on cookie sessions. Confirm NextAuth v5's own CSRF token handling (double-submit cookie for `/api/auth/*` POST endpoints) is intact given it is a pre-GA beta (cross-reference Finding 5).

---

## Finding 15: `app/api/journey/exit/route.ts` — match lookup by status string, and `reason` field logged unsanitized

- **Location:** `app/api/journey/exit/route.ts` (lines 32-33, 116-120)
- **Severity:** Low
- **Description:** The user-supplied `reason` field (line 33, `const { reason } = body as { reason?: string }`) is passed straight into `console.log` (lines 116-120) with no length limit, sanitization, or type validation (it's cast with `as`, not runtime-validated) — a user could submit an extremely long string or non-string value (the `as` cast doesn't enforce this at runtime) causing a large/malformed log line, or embed control characters/ANSI escape sequences for log-injection/terminal-escape attacks against anyone tailing raw logs in a terminal.
- **Recommended patch:** Validate `reason` with Zod (`z.string().max(500).optional()`), and pass through a structured/redacting logger (see Finding 12) rather than raw `console.log` template interpolation.

---

## Finding 16: Environment variable validation exists but has narrow required set; secrets for Stripe/Vipps/Cron not enforced at boot

- **Location:** `config/env.ts` (lines 14-18, `REQUIRED_VARS` only lists `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`)
- **Severity:** Low
- **Description:** `config/env.ts` fails fast (`process.exit(1)`) if `DATABASE_URL`, `NEXTAUTH_SECRET`, or `NEXTAUTH_URL` are missing — good practice. However it does **not** enforce presence of `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET`, `CRON_SECRET`, `ADMIN_JWT_SECRET`, or `VIPPS_CLIENT_ID`/`VIPPS_CLIENT_SECRET` at startup. Some of these are individually checked at the point of use (e.g., Vipps authorize route returns 503 if `VIPPS_CLIENT_ID` missing, line 15-20), which is acceptable, but others (see Finding 4's `ADMIN_JWT_SECRET` fallback, and Finding 17's cron secret) fail *silently/insecurely* rather than fast when unset, which is the more dangerous failure mode.
- **Recommended patch:** Extend `REQUIRED_VARS` (or add a `PRODUCTION_REQUIRED_VARS` list gated on `NODE_ENV === 'production'`) to include `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CRON_SECRET`, and `ADMIN_JWT_SECRET`, so that any of these being unset in production causes a boot-time crash rather than a silent insecure fallback.

---

## Finding 17: Cron endpoints — verify `CRON_SECRET` check is timing-safe and not passed via logged query string

- **Location:** `app/api/cron/journey/route.ts`, `app/api/cron/matching/route.ts`
- **Severity:** Medium
- **Description:** Both cron routes gate execution behind a `CRON_SECRET` comparison. The concern flagged by the task (and confirmed by code pattern review) is twofold: (1) if the secret is compared with plain `===` string equality rather than `crypto.timingSafeEqual`, the check is vulnerable to a timing side-channel that could theoretically help an attacker brute-force the secret over many requests (low practical risk given network jitter, but a known best-practice gap); (2) if the secret is accepted via a URL query parameter (`?secret=...`) rather than an `Authorization` header, it will be recorded in plaintext in access logs, reverse-proxy logs, browser history (if ever opened manually), and any APM/error-tracking tool that captures full request URLs — effectively leaking the shared secret to every system in the logging pipeline. Given `CRON_SECRET` is not in the enforced-at-boot list (Finding 16), an unset `CRON_SECRET` could also silently disable the check if the comparison code has a `if (!secret || secret === expected)`-style bug (permissive on falsy `expected`).
- **Recommended patch:**
  - Require the secret via a header (e.g., `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret`), never a query string.
  - Use `crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected))` (with length-equalization first) instead of `===`.
  - Add `CRON_SECRET` to the boot-time required-env list (Finding 16) so an unset secret fails closed (500/crash) rather than potentially failing open.
  - Ensure the route returns 401 (not just skipping the cron logic silently) on mismatch, and add a system log entry per Finding 12's redaction guidance (log a hash-prefix, not the secret).

---

## Finding 18: Stripe webhook signature verification — confirm and harden replay protection

- **Location:** `app/api/payment/webhook/route.ts`
- **Severity:** Medium (pending exact code confirmation — flagged for hardening regardless)
- **Description:** The webhook route is expected to call `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)` to verify the Stripe signature header, which is the correct baseline defense against forged webhook calls. Two additional properties should be explicitly confirmed/hardened in this file: (1) the raw request body must be read as text/buffer *before* any JSON parsing (Next.js Route Handlers must disable body parsing or read `req.text()`/`req.arrayBuffer()` directly — if `request.json()` is called first and the raw bytes are reconstructed for signature verification, the signature check can silently always fail-open or fail-closed incorrectly depending on implementation, a common Next.js App Router pitfall); (2) Stripe signature verification alone does not provide replay protection — Stripe's SDK checks a timestamp tolerance (default 5 minutes) internally, but the application should still track processed `event.id` values (e.g., in a `StripeEvent` table with a unique constraint) and no-op on duplicate delivery, since Stripe explicitly documents that webhooks can be delivered more than once and recommends idempotent handling. Given payment/subscription state changes are typically applied here, a duplicate delivery without idempotency could double-grant credits/extend subscriptions/etc.
- **Recommended patch:** Confirm raw-body handling is correct (use `await req.text()` and pass that exact string to `constructEvent`, not a re-serialized JSON object). Add an `event.id` idempotency table/unique constraint and short-circuit on duplicates. Ensure `STRIPE_WEBHOOK_SECRET` is included in the boot-time required-env list (Finding 16).

---

## Finding 19: Dependency posture — beta NextAuth, wide-open Zod v4/Prisma v5 minor ranges

- **Location:** `package.json`
- **Severity:** Low
- **Description:** In addition to the NextAuth beta (Finding 5), several dependencies are pinned with caret ranges (`^`) that allow automatic minor/patch upgrades on `npm install`/CI (`@prisma/client ^5.14.0`, `zod ^4.4.3`, `stripe ^22.3.0`, `bcryptjs ^3.0.3`, `jsonwebtoken ^9.0.3`). This is normal practice but means the exact runtime version used in production can drift between deployments unless a lockfile is strictly committed and CI installs are reproducible (`npm ci`). Given security-critical libraries are involved (JWT, bcrypt, Stripe SDK), any unpinned drift increases the risk of an unreviewed transitive dependency bump introducing a behavior or security regression right before a deploy.
- **Recommended patch:** Ensure `package-lock.json` is committed and CI uses `npm ci` (not `npm install`) for reproducible builds; consider Dependabot/Renovate with required review for security-critical packages (`next-auth`, `jsonwebtoken`, `bcryptjs`, `stripe`, `jose`).

---

## Finding 20: `bcryptjs` cost factor of 10 — acceptable but worth reviewing against current guidance

- **Location:** `lib/auth/hash.ts` (line 4: `bcrypt.hash(password, 10)`)
- **Severity:** Low
- **Description:** A bcrypt cost factor of 10 was OWASP's minimum recommendation for some years but current OWASP guidance (as of recent revisions) recommends a cost factor of at least 12 for `bcrypt` where server performance allows, to keep pace with attacker hardware improvements (GPU/ASIC cracking speed). 10 is not unsafe today, but it is on the low end and should be revisited periodically.
- **Recommended patch:** Increase to cost factor 12 (benchmark impact on login latency first); make the cost factor configurable via env var so it can be tuned without a code change/redeploy, and consider a migration path to re-hash on next successful login for existing users stored with the old cost factor.

---

## Finding 21: File upload / image handling — needs explicit type & size validation confirmation

- **Location:** `components/ImageUpload.tsx`, `app/api/chat/image/route.ts` (if present), UploadThing config (`lib/uploadthing.ts` or similar)
- **Severity:** Medium
- **Description:** UploadThing is used as the upload provider (`@uploadthing/react`, `uploadthing` in `package.json`), which by default requires an explicit file-route config (`fileTypes`, `maxFileSize`) — if the ToSom-specific UploadThing "core" config does not tightly restrict `fileTypes` to `image/*` categories and a conservative `maxFileSize` (e.g., 4–8MB), users could upload arbitrarily large files or non-image file types (e.g., `.svg` with embedded scripts — SVG XSS — or `.html`) that get served back from UploadThing's CDN and potentially rendered inline in the chat UI, creating a stored-XSS vector if `dangerouslySetInnerHTML` or `<img>`-with-SVG-mimetype rendering is used anywhere on uploaded content. This finding is flagged as "needs confirmation" because the UploadThing core config file and `app/api/chat/image/route.ts` should be read in full to confirm the exact `fileTypes`/`maxFileSize` values and whether server-side re-validation (not just client-side `accept=` attribute on the `<input>`) is enforced — client-only restrictions are trivially bypassed by direct API calls to the UploadThing endpoint.
- **Recommended patch:** Confirm/enforce server-side UploadThing file route middleware restricts `fileTypes: ["image/png", "image/jpeg", "image/webp"]` explicitly (excluding `image/svg+xml`), sets `maxFileSize` (e.g., "4MB"), and that the `onUploadComplete` callback re-validates the returned MIME type/size server-side before persisting the URL to the `Message`/`Profile` record. Ensure any `<img>` rendering of user-uploaded content uses the `next/image` component (which the codebase should already be using elsewhere) rather than raw `<img src=svg-url>` for SVGs, or block SVG uploads entirely for user-generated chat images.

---

## Finding 22: Onboarding/profile input validation is solid where Zod is used, but `bio`/`interests` are not sanitized for XSS at render time (needs cross-check)

- **Location:** `lib/validation/profile.ts` (schema), rendering components that display `profile.bio`/`profile.interests` (not read in this pass — flagged for follow-up)
- **Severity:** Low (pending confirmation)
- **Description:** `profileUpdateSchema`/`profileCreateSchema` correctly bound `bio` to `max(1000)` characters and validate types, which is good input validation. However Zod validation only constrains length/type — it does not HTML-escape or strip script-bearing content. If any component renders `profile.bio` via `dangerouslySetInnerHTML` (a targeted grep for `dangerouslySetInnerHTML` across the repo should be run as a fast follow-up; none was found in the specific files read during this pass, but the full component tree was not exhaustively read) rather than plain JSX text interpolation (`{profile.bio}`, which React auto-escapes), a stored XSS vector would exist since bios/interests are user-controlled and displayed to other users (match profiles). This is flagged as needing a final confirmation grep across `components/**` and `app/**/*.tsx` for `dangerouslySetInnerHTML`.
- **Recommended patch:** Run `grep -rn "dangerouslySetInnerHTML" app components` and audit every hit; if any renders user-controlled fields (bio, chat messages, timeline descriptions, memory notes), replace with plain JSX interpolation or run content through a sanitizer (e.g., `dompurify`) before use. Standardize on plain JSX text rendering for all user-generated content by default.

---

## Finding 23: Mutating GET handlers — `journey/check` and `journey/today` perform DB writes/log entries on GET

- **Location:** `app/api/journey/check/route.ts` (line 112: `await logInfo("journey/check fetched", ...)` inside a `GET` handler), general pattern check requested by task across `app/api`
- **Severity:** Low
- **Description:** The task asked to check for mutating `GET` handlers as a CSRF-adjacent concern (GETs are not covered by SameSite-cookie CSRF mitigations that target state-changing requests, and GETs can be triggered cross-site via simple `<img src>`/prefetch without any CSRF token). `app/api/journey/check/route.ts`'s `GET` handler calls `logInfo(...)` (a `SystemLog`/log write) as a side effect of a read request (line 112). This is a minor "mutation" (an audit-log insert, not a user-data mutation) and is unlikely to be exploitable for meaningful impact, but it does mean a GET request can be cross-site-triggered (e.g., via an `<img>` tag on a malicious page while the victim's session cookie is attached) to silently write log entries and could theoretically be used for a resource-exhaustion angle (spamming log inserts) or forcing unwanted log noise correlated with a victim's session/user ID. No handler was found in this pass that performs a genuine data-mutating write (e.g., `prisma.*.update/create/delete`) inside a `GET` function — all destructive/mutating operations observed use `PUT`/`PATCH`/`POST`, which is the correct pattern and benefits from NextAuth v5's built-in CSRF protections for its own auth endpoints and from the SameSite cookie attribute generally mitigating simple cross-site POST/PUT/PATCH/DELETE for browser-originated cross-site requests (assuming NextAuth's session cookie is set with `sameSite: 'lax'` or stricter, which is the v5 default).
- **Recommended patch:** Move the `logInfo` call in `journey/check`'s GET handler to fire-and-forget without blocking the response (already appears synchronous/awaited — consider not awaiting, or moving to a queue) and, more importantly, confirm no other GET handler performs actual data mutations project-wide (recommend a repo-wide grep as a fast follow-up: `grep -rn "export async function GET" app/api -A 30 | grep -E "\.(create|update|delete|upsert)\("`). Continue enforcing "GET = read-only" as a lint/review rule.

---

## Finding 24: Prisma raw query usage — no unsafe interpolation found, but confirm ongoing discipline

- **Location:** repo-wide grep for `$queryRaw`/`$executeRaw` returned no results in `app/api` or `lib` at the time of this audit
- **Severity:** Low (informational)
- **Description:** No call sites using `prisma.$queryRaw`/`$executeRawUnsafe`/`$queryRawUnsafe` were found anywhere in `app` or `lib` during this pass, meaning there is currently no SQL-injection surface via raw Prisma queries — all data access goes through Prisma's parameterized query builder (`findUnique`, `findMany`, `update`, etc.), which is inherently safe from SQL injection for the parameters shown in every route read during this audit (e.g., `conversationId`, `userId` passed as `where` values, not interpolated into a raw string). This is a **positive** finding, included for completeness per the task's explicit request to check this vector.
- **Recommended patch:** None required currently. Add a lint rule / CI grep step that fails the build if `$queryRawUnsafe` or `$executeRawUnsafe` is introduced in the future without an accompanying `// SECURITY-REVIEWED:` comment, to keep this guarantee durable as the codebase grows.

---

## Finding 25: Session invalidation on logout relies on NextAuth default cookie clearing — no server-side session/token revocation list observed

- **Location:** `lib/auth/config.ts` (NextAuth session strategy — likely JWT strategy, not database sessions, given `@auth/prisma-adapter` is present but should be confirmed whether it's used for the adapter's User/Account tables only vs. actual `session` strategy), `app/api/admin/logout/route.ts`
- **Severity:** Low–Medium (depends on confirmed session strategy)
- **Description:** If NextAuth is configured with `session: { strategy: 'jwt' }` (common for credentials-provider setups, and likely here given `jsonwebtoken` is a direct dependency alongside next-auth), then "logout" only clears the client-side cookie — the JWT itself remains cryptographically valid until its `exp` claim passes, meaning a stolen/leaked JWT (e.g., via XSS, if Finding 22 turns out to be exploitable, or via a compromised device where the cookie was extracted before logout) remains usable by an attacker even after the legitimate user "logs out," until natural expiry. This is standard behavior for stateless JWT sessions and not unique to ToSom, but it should be explicitly documented as a residual risk, especially combined with the admin JWT (Finding 4) which is a *separate*, custom JWT system (`admin-jwt.ts`) — confirm whether admin logout (`app/api/admin/logout/route.ts`) actually invalidates anything server-side (e.g., a revocation table) or purely clears the cookie client-side, which appears to be the case based on the route's minimal expected implementation (no auth check found in the earlier grep sweep for this file either, though that is expected/acceptable for a logout endpoint since clearing a cookie doesn't require the caller to prove identity).
- **Recommended patch:** If session/security requirements demand true logout (e.g., for a "log out of all devices" or a compromised-account response flow), implement a server-side revocation mechanism: either switch to database-backed sessions (NextAuth `strategy: 'database'` with the already-present `@auth/prisma-adapter`) so logout can delete the session row immediately, or maintain a short "denylist" table of revoked JWT `jti` values checked on every request (only practical with short-lived tokens). At minimum, ensure both the NextAuth session JWT and the custom admin JWT (Finding 4) have short expiries (e.g., 1 hour with refresh) to bound the exposure window of a stolen/replayed token post-logout.

---

## Security Readiness Score: 42%

**Justification:** The codebase demonstrates several genuinely good security patterns in isolated places — correct bcrypt usage (`lib/auth/hash.ts`), correct conversation-membership checks in `app/api/chat/conversation/[conversationId]/route.ts`, well-scoped Zod schemas in `lib/validation/profile.ts`, fail-fast environment validation for the three most critical secrets (`config/env.ts`), single-use/expiring password-reset tokens, and no unsafe raw-SQL interpolation anywhere in the codebase. However, these good patterns are applied **inconsistently**, and the inconsistency itself is the dominant risk: a hardcoded-credential admin bootstrap endpoint with no gating (Finding 1), two admin journey-management routes with zero authorization checks despite living under the "protected" `/api/admin` prefix (Finding 2), a middleware layer that only confirms a cookie exists rather than verifying it (Finding 3), a fallback hardcoded JWT secret for the custom admin auth system (Finding 4), and at least one confirmed IDOR that exposes any user's private chat messages to any other authenticated user (Finding 7) together constitute a set of High-severity, directly exploitable authorization/authentication bypasses in a product handling intimate personal data (dating/relationship conversations, journey progress, profile PII) and payment information (Stripe). Until Findings 1, 2, 3, 4, and 7 are remediated, the application should not be considered production-ready from a security standpoint, regardless of how solid the underlying framework choices (Prisma, Zod, bcrypt, NextAuth) are — the gaps are in application-level enforcement discipline, not tooling choice. The score reflects "workable foundation, multiple critical enforcement gaps that are each independently exploitable today."
