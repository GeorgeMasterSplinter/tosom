# Functional Integrity Audit — Part A: Journey Engine + Matching Engine + Cron Jobs

Scope: `lib/journey/engine.ts`, `__tests__/journey-engine.test.ts`, `lib/matching/*.ts`, `config/matching.ts`, `app/api/cron/journey/route.ts`, `app/api/cron/matching/route.ts`, plus directly-related callers (`app/api/match/*`, `app/api/journey/*`, `lib/match/journeySync.ts`) needed to evaluate correctness.

---

## Journey Engine

### Phases and exact day ranges (`lib/journey/engine.ts:191-221`, `PHASE_CONFIGS`)

| Phase | startDay | endDay |
|---|---|---|
| EARLY | 1 | 14 |
| BUILDING_TRUST | 15 | 21 |
| DEEPER | 22 | 25 |
| CHECKIN | 26 | 30 |

`getPhaseForDay(day)` (`lib/journey/engine.ts:277-290`) does `PHASE_CONFIGS.find(p => day >= p.startDay && day <= p.endDay)`, falling back to `{ phase: CHECKIN, startDay: 1, endDay: 30, description: "Ukjent fase..." }` when no range matches (i.e. `day <= 0` or `day > 30`).

**BUG — Fallback phase config is internally inconsistent (`lib/journey/engine.ts:284-289`).** When day is out of range (e.g. day 0 or day 31+), the returned object has `phase: CHECKIN` but `startDay: 1, endDay: 30` (the *whole* journey range), not the actual CHECKIN range (26-30). This object is consumed directly by `buildJourneyState()` (`lib/journey/engine.ts:461-463`) to compute `phaseProgress`:
```
phaseProgress = Math.round(((day - phaseStart) / (phaseEnd - phaseStart)) * 100)
```
For day=31: `((31-1)/(30-1))*100 = 103%`, which then gets clamped to 100 by `Math.min(Math.max(phaseProgress,0),100)` (line 478) — so the clamp masks the bug for large `day`, but the *fallback description* text "Ukjent fase – reisen er kanskje ferdig." never surfaces anywhere in the UI, because `buildJourneyState` overwrites `phaseDescription` using `PHASE_DESCRIPTIONS[phaseConfig.phase]` (line 459), which for CHECKIN is the real CHECKIN description, not the "unknown phase" text. So the fallback "Ukjent fase" text defined in `getPhaseForDay` is effectively **dead/unreachable output** — a sign of leftover/unused defensive code, not an active bug per se, but indicates the fallback path was never actually exercised/tested for its real intended behavior.

For `day = 0` or negative days: `PHASE_CONFIGS.find` also fails to match (since `startDay:1` is the lowest bound), so the same fallback (`CHECKIN`, startDay 1, endDay 30) is returned. This means **day 0 or a negative day incorrectly reports phase = CHECKIN** instead of some "not started" concept. There is no explicit `NOT_STARTED` handling in `getPhaseForDay` — this is only handled downstream by clamping in `buildJourneyState` (`const day = Math.max(1, Math.min(currentDay, totalDays))`, line 456), which silently forces day 0 → day 1 → EARLY phase for state building, but if `getPhaseForDay` is called directly (as cron jobs and `/api/journey/progress/advance` do via their own **locally re-implemented** copy — see below) the raw, unclamped value is used.

### Duplicated/divergent `getPhaseForDay` implementations — CRITICAL CONSISTENCY BUG

There are **three separate, independently-maintained implementations** of the day→phase mapping logic that are supposed to represent the same business rule:

1. `lib/journey/engine.ts:277-290` (`PHASE_CONFIGS`-driven, the "canonical" one used by `journeyAPI` and UI).
2. `app/api/cron/journey/route.ts:100-105` — a **local nested function** re-implementing the same ranges:
   ```ts
   function getPhaseForDay(day: number): JourneyPhase {
     if (day <= 14) return JourneyPhase.EARLY;
     if (day <= 21) return JourneyPhase.BUILDING_TRUST;
     if (day <= 25) return JourneyPhase.DEEPER;
     return JourneyPhase.CHECKIN;
   }
   ```
3. `app/api/journey/progress/advance/route.ts:82-87` — **another independent copy**, byte-identical to #2.
4. `lib/match/journeySync.ts:9-14` — **yet another copy**, but with **DIFFERENT, WRONG ranges**:
   ```ts
   function phaseForDay(day: number): JourneyPhase {
     if (day <= 14) return "EARLY";
     if (day <= 21) return "BUILDING_TRUST";
     if (day <= 30) return "DEEPER";     // BUG: DEEPER now covers days 22-30
     return "CHECKIN";                    // BUG: CHECKIN is unreachable for day in 1..30
   }
   ```
   **This is a real logical bug.** In `lib/match/journeySync.ts`, days 26-30 are mapped to `DEEPER` instead of `CHECKIN`, and the `CHECKIN` phase (26-30 per the canonical definition) is **never returned** by this function for any value 1-30 (only reachable for `day > 30`, which `advanceMatchJourney` explicitly prevents by capping at `TOTAL_DAYS = 30`). If any code path relies on `journeySync.ts`'s `advanceMatchJourney`/`phaseForDay` to progress a user's `phase` field, that user's final 5 days (26-30) will incorrectly show `DEEPER` instead of `CHECKIN`, meaning they'd never get the "reflection/check-in" UX, notifications tied to `phaseChanged` (day 25→26) would misfire or never fire depending on which code path runs, and any UI that branches on `phase === CHECKIN` (e.g., end-of-journey messaging) would not activate for those users.

   **Risk**: `journeySync.ts` exports `advanceMatchJourney`, `startJourneyOnMatch`, `resetMatchJourney`, `getMatchJourney`, `isMatchJourneyComplete` — a search shows these are **not currently called from any `app/api` route or component** (dead code as of the current snapshot), which reduces but does not eliminate risk (it's likely a leftover from an older architecture, but if re-wired in the future the bug will resurface silently).

Since there are 4 independent copies of essentially the same mapping function with no shared import, this is a **maintainability/consistency bug class**: any future change to phase boundaries (e.g. moving DEEPER to start at day 23) requires editing 4 places, and it has already drifted in one of them (`journeySync.ts`).

### Photo-lock logic (`isPhotosAllowed`, `lib/journey/engine.ts:297-299`)

```ts
export function isPhotosAllowed(day: number): boolean {
  return day >= 15;
}
```
This matches BUILDING_TRUST start day (15) and is consistent with `PHASE_CONFIGS`. Tests cover day 1 (false), day 14 (false), day 15 (true), day 30 (true) — this part is solid and matches the canonical config.

**However**, there is a **separate, inconsistent "photo unlock" concept for image-sharing at the Conversation level**, unrelated to `isPhotosAllowed`:
- `app/api/match/accept/route.ts:135` sets `imageShareAllowedAt = acceptDate + 14 days` (i.e., **day 14**, not day 15).
- `lib/match/journeySync.ts:43` and `:143`: `photosEnabled: jp.day >= 13` (i.e., **day 13**, not day 15).
- `components/journey/JourneySummaryMini.tsx`: `const photosAllowed = day >= 15;` (matches canonical).
- `scripts/setupE2eJourneys.ts`: `imageShareAllowedAt = now + 14 days`.

**BUG — Three different thresholds for "when are photos/images allowed" exist across the codebase: day 13 (`journeySync.ts`), day 14 (`match/accept` via `imageShareAllowedAt`), and day 15 (`engine.ts` canonical `isPhotosAllowed` / BUILDING_TRUST start).** These are two somewhat different concepts (`isPhotosAllowed` = profile-photo visibility gate vs. `imageShareAllowedAt` = in-chat image sharing gate), but the inconsistency (13 vs. 14 vs. 15) across features that read as "the same rule" to an end user is confusing and not unified anywhere. There is no single source of truth constant (e.g., `PHOTO_UNLOCK_DAY = 15`) — the value `15` is hardcoded in at least 3 places (`engine.ts`, `JourneySummaryMini.tsx`, tests) while `13`/`14` are hardcoded elsewhere.

### Edge cases

- **Day 0**: `getPhaseForDay(0)` → falls to fallback → returns phase `CHECKIN` (see bug above). `isPhotosAllowed(0)` → `false`. `isJourneyActive(0)` → `false` (test-covered, `__tests__/journey-engine.test.ts:98-100`). `isJourneyCompleted(0)` → `false` (`day > 30` is false). So day 0 is "not active, not completed, but phase is reported as CHECKIN" — an inconsistent tri-state (not tested, not handled explicitly).
- **Negative days**: Same fallback path as day 0. `isJourneyActive(-5)` → false. No dedicated validation/guard for negative `day` anywhere in the engine; Prisma schema comment even flags this (`prisma/schema.prisma`: `day Int @default(1) // validering bør gjerast i API-nivå (day >= 1 AND day <= 30)`), confirming the team is aware there's no DB-level constraint and negative/zero/over-30 values are only prevented by application logic, which — as shown above — is inconsistent across 4 different implementations.
- **Day > 30 (e.g. 31, 1000)**: `getPhaseForDay(31)` → CHECKIN (test-covered: `__tests__/journey-engine.test.ts:55-57`, `93-96`). `isJourneyCompleted(31)` → true. `isJourneyActive(31)` → false. This combination is well tested for `engine.ts`, but **NOT** for the cron job's local `getPhaseForDay` copy or `advance/route.ts`'s copy (both cap `newDay` themselves via `day.day < 30` guards before calling their local function, so day > 30 should never reach their local `getPhaseForDay` — but this is only true if `journey.day` is always <= 30 to begin with, which is never enforced at the DB level).
- **Undefined/null day**: `buildJourneyState(currentDay, ...)` does `Math.max(1, Math.min(currentDay, totalDays))` — if `currentDay` is `undefined`, `Math.min(undefined, 30)` evaluates to `NaN`, and `Math.max(1, NaN)` is `NaN`. This would propagate `NaN` as `day` throughout `buildJourneyState`'s return value (`currentDay: NaN`, `phaseProgress: NaN`, `progress: NaN`). **BUG — `buildJourneyState` has no runtime guard against `NaN`/`undefined`/`null` input**, despite several callers passing `progress.day ?? 1` defensively (e.g. `app/api/journey/[conversationId]/route.ts:56`, `components/journey/JourneyView.tsx:15: const day = currentDay ?? 1`) — but not all callers do this consistently, and `getPhaseForDay(NaN)` itself: `PHASE_CONFIGS.find(p => NaN >= p.startDay && NaN <= p.endDay)` — every comparison with `NaN` is `false`, so it silently falls through to the fallback (CHECKIN phase) without ever throwing or logging a warning. Silent `NaN` propagation is a real defensive-programming gap.

### Journey advancement / cron duplication of business logic

The **actual mutation logic** for "advance the day" is implemented independently in two places with subtly different guard conditions:
1. `app/api/cron/journey/route.ts:51-150` (system-driven daily cron, gated by `nextDayAt <= now`).
2. `app/api/journey/progress/advance/route.ts:16-168` (user-driven manual advance endpoint, also gated by `nextDayAt`).

Both check `nextDayAt` and set a new `nextDayAt = now + 24h`, both bump `day += 1`, both write a `JourneyMilestone`, both send `Notification` on phase change. This is **fully duplicated business logic** with no shared function — a change to one (e.g. a change in milestone title format) must be manually mirrored in the other, and they've already drifted stylistically (cron's milestone title is `Dag ${newDay}`, advance's is `Dag ${newDay} — ${getPhaseForDay(newDay)}`).

**Race condition**: If a user calls `POST /api/journey/progress/advance` at the exact moment the cron job (`GET /api/cron/journey`) is processing the same `JourneyProgress` row (both triggered because `nextDayAt <= now`), there is **no locking/transaction** around the read-then-write sequence in either implementation (both do `findUnique` then a separate `update`, not `$transaction` or `updateMany` with an atomic guard on `nextDayAt`). This makes a **double-advance** possible depending on interleaving, and could create **two `JourneyMilestone` rows for the same day** since milestone creation isn't deduplicated by a unique constraint (`JourneyMilestone` has no `@@unique([progressId, day])` in schema) — confirmed by inspecting `prisma/schema.prisma`. This is a real, exploitable race/duplication bug given concurrent execution is plausible (a user opening the app right as the daily cron fires).

### Milestone deduplication gap

`JourneyMilestone` model has no unique constraint on `(progressId, day)` (`prisma/schema.prisma` — `JourneyMilestone` only has `@@index([progressId])` and `@@index([day])`, no `@@unique`). Both the cron job and the manual-advance endpoint blindly `create` a new milestone row every time they detect `journey.day !== newDay`, with no existence check first. Combined with the race condition above, or simply retried requests (e.g. client retry on network timeout), this can produce duplicate milestone rows for the same day. `app/api/journey/reflect/route.ts` (a different milestone-writing path) *does* check for an existing milestone first (`hasReflection` via `findFirst`) before creating — showing the codebase itself acknowledges this needs deduplication in that one path but not in the cron/advance paths.

### `advanceOneDay` (in-memory progress store) — orphaned/legacy code path

`lib/journey/engine.ts:519-551` — `advanceOneDay(userId, matchId, progressStore?)` operates on an optional in-memory `Record<string, UserProgress>` object rather than the database. This function, along with `getUserProgress`, `resetUserProgress`, `isUserJourneyComplete`, `getCompletedDaysOverview` (lines 495-581), represents a completely separate, **non-persistent** progress-tracking mechanism from the DB-backed `JourneyProgress` model used everywhere else (cron, advance route, reflect route). These are exported via `journeyAPI` (lines 1039-1043) but a search shows **no caller passes a real persistent `progressStore`** anywhere in `app/` — meaning if these ever get called without a store argument, they always return a fresh default progress object (day 1) and never actually track anything. This is dead/vestigial code left over from an earlier in-memory prototype (per the file's own header comment listing consolidated legacy modules) that could mislead future maintainers into thinking journey progress can be tracked this way.

### Test coverage assessment (`__tests__/journey-engine.test.ts`)

**Covered by tests:**
- `getPhaseForDay`: days 1, 14, 15, 21, 22, 25, 26, 30, 31 (phase boundaries, and day > 30 fallback → CHECKIN).
- `isPhotosAllowed`: days 1, 14, 15, 30.
- `isJourneyActive` / `isJourneyCompleted`: days 1, 30, 31, 0.
- `JOURNEY_TOTAL_DAYS === 30`.
- `getThemeForDay`: days 1, 6, 13, 21, 27 (one per theme range).
- `MATCH_WEIGHTS` values and their sum (imported from `config/matching.ts`, a static re-export, not the live `weightConfig.ts` values used at runtime — see Matching Engine section).
- `MATCH_DELAY_HOURS === 24` (a constant-value assertion only, not behavioral).

**NOT covered by tests (major gaps):**
- Negative days (`day: -1`, etc.) — untested for both `getPhaseForDay` and `isJourneyActive`/`isJourneyCompleted`.
- `NaN`/`undefined`/`null` day handling — completely untested; as shown above this silently propagates `NaN`.
- `buildJourneyState()` — the single most important composed function (used by every journey UI/API surface) has **zero direct unit tests**. No test asserts `progress`, `phaseProgress`, `daysRemaining`, `matchState`, or `messages` output for any day.
- `buildMessages()` (internal, drives `SystemMessage[]` output, dedup/sort logic) — untested.
- Milestone functions (`getMilestoneForDay`, `isMilestoneDay`, `getMilestoneDays`) — untested.
- `calculateResonance`, `calculateWarmScore`, `getPhaseResonanceBias`, `getResonanceVisual`, `getMatchVisual`, `getWarmUI`, warm trend/history helpers — all completely untested despite being nontrivial scoring formulas with clamping logic that is easy to get wrong (e.g. off-by-one in caps like `Math.min(messageCount * 5, 30)`).
- Silent-moment detection (`detectSilence`, `shouldTriggerSilentMoment`) — untested.
- `getDayConfig`/`dayData` fallback behavior for day 0 or day 31 (`FALLBACK_DAY`) — untested (only reachable via `journeyAPI.getDayConfig`).
- The **cron job's own local `getPhaseForDay` reimplementation** and the **advance route's local reimplementation** are never tested at all — the test file only imports and tests the canonical `lib/journey/engine.ts` version, so the drift documented above (`journeySync.ts`'s wrong DEEPER/CHECKIN boundary) would never be caught by the existing test suite.
- No test asserts the **24-hour lock mechanics** (`nextDayAt`) actually block/allow progression — the "24-hour Match Delay Rule" test block only checks the *constant* `MATCH_DELAY_HOURS === 24`, not any behavior enforcing it.
- No integration/behavioral test exists for phase-change notification firing, milestone creation, or end-of-journey (`day >= 30`) transitions in either cron or the advance endpoint.

---

## Matching Engine

### Two parallel, incompatible scoring/weighting systems

The codebase contains **two entirely separate matching engines** that produce different score scales, different dimension counts, and are wired into different call paths:

**System 1 — "5-category legacy" (`lib/matching/engine.ts` + `weightConfig.ts` + `types.ts`)**
- Weights (`lib/matching/weightConfig.ts:17-23`, `DEFAULT_WEIGHTS`):
  ```
  base:       0.35
  resonance:  0.25
  semantic:   0.20
  intimacy:   0.10
  future:     0.10
  ```
  (sums to 1.0; validated at runtime by `validateWeights`/`getWeightsWithOverride`, `lib/matching/weightConfig.ts:43-51`, `58-84`).
- Scale: `[0, 1]` (fractional score).
- Used by: `lib/matching/engine.ts` -> `matchingEngine()` -> called by `lib/matching/findBestMatchFor.ts` -> called by `app/api/match/route.ts` (POST, the **user-facing manual match request** endpoint).
- Also mirrored in `config/matching.ts:13-19` as `MATCH_WEIGHTS` — explicitly commented as "alias for legacy-importar", i.e. **not the live source of truth**, just kept for backward compatibility. The unit test file (`__tests__/journey-engine.test.ts:138-167`) tests **this legacy alias**, not the actual runtime values from `weightConfig.ts` — although in this snapshot the numbers happen to match, there is **no test enforcing that `config/matching.ts`'s `MATCH_WEIGHTS` and `lib/matching/weightConfig.ts`'s `DEFAULT_WEIGHTS` stay in sync**, so a future edit to one without the other would silently create scoring drift that the existing tests would not catch (the tests only import from `config/matching.ts`).
- Dealbreakers (hard filters) are applied **only** in this path, via `lib/matching/dealbreaker.ts` -> `sjekkAlleDealbreakers()` (`lib/matching/engine.ts:76-92`): maturity gap > 4, incompatible life rhythm (morning/evening, fast/slow), explicit `preferences.dealbreakers` tag overlap, boundary "excludes" violations, and security-level gap >= 2. If any dealbreaker triggers, `score: 0, rejected: true` is returned and `findBestMatchFor` explicitly excludes score-0 results (`lib/matching/findBestMatchFor.ts:112-113`: `if (!bestResult || bestResult.score === 0) return null;`).

**System 2 — "9-dimension unified scorer" (`lib/matching/unifiedScorer.ts`)**
- Weights (`lib/matching/unifiedScorer.ts:37-47`, `W`):
  ```
  values:            0.25
  personality:       0.20
  relationshipStyle: 0.15
  communication:     0.15
  futureVision:      0.10
  boundaries:        0.05
  emotionalNeeds:    0.05
  lifeRhythm:        0.03
  maturity:          0.02
  ```
  (sums to 1.0, but **no runtime validation function exists for this weight set** — unlike `weightConfig.ts`'s `validateWeights`, there's no equivalent check for `W` in `unifiedScorer.ts`).
- Scale: `[0, 100]` (integer score via `unifiedScore()`).
- Used by: `lib/matching/findBestResonance.ts` -> called by `app/api/cron/matching/route.ts` (the **automated daily matching cron job**).
- **No dealbreaker checks at all.** `findBestResonance()` never calls `sjekkAlleDealbreakers`. This means the cron-driven auto-matching path can match two users with a maturity gap of, say, 10, or with opposite/incompatible security levels, or with explicit stated dealbreakers in preferences — none of which is checked. **This is a significant functional gap**: the two matching entry points (manual `/api/match` POST vs. automated `/api/cron/matching`) apply fundamentally different safety rules, meaning a user could never get matched with a specific person via the app's "find match" button (due to a dealbreaker), yet the nightly cron could match them with exactly that same incompatible person because the cron path skips dealbreaker checks entirely.
- `calculateTotalScore()` (`lib/matching/unifiedScorer.ts:315-337`) is a bolted-on backward-compatibility wrapper that maps the 9 unified dimensions down into the old 5-category `SubScoreBreakdown` shape purely by *relabeling* certain dimensions (e.g. `resonance: result.breakdown.communication / 100`, `semantic: result.breakdown.values / 100`) — this is **not a recomputation using the 5-category weights**, it's a lossy renaming, so `matchingEngine()` (System 1) actually ends up computing its "5-category weighted sum" using the **9-dimension breakdown's raw values run through the 5-category weights** (`base * 0.35 + ...` where `base = result.score/100` already IS the full 9-dimension weighted total) — meaning `base` in System 1's breakdown is not really "base compatibility," it's the *entire unified score* being additionally weighted at 35% along with 4 other numbers that are just relabeled sub-slices of the same 9-dimension breakdown. This produces a **mathematically confused double-weighting**: the final `matchingEngine()` score is not a clean 5-category weighted average of independent signals — it's `(0.35 x [full 9-dim score]) + (0.25 x communication) + (0.20 x values) + (0.10 x emotionalNeeds) + (0.10 x futureVision)`, which double-counts `communication`, `values`, `emotionalNeeds`, and `futureVision` (they're already baked into `base` via the 9-dim weighted score) on top of counting them again individually. This is a **real scoring-logic bug**, not just a style issue — the actual weight distribution applied to, e.g., the `values` dimension effectively becomes much higher than either the documented 0.35 "base" or 0.20 "semantic" would suggest in isolation, and this compounding is undocumented anywhere in the code or comments.

### Is a "24-hour rule" actually implemented? Where?

Yes — but **inconsistently enforced depending on entry point**, and the constant `MATCH_DELAY_HOURS` (`config/matching.ts:5`) is **not actually referenced by the enforcement code** (it's a standalone constant only consumed by the test file).

Actual enforcement locations (all hardcode `24 * 60 * 60 * 1000` / `24` literally, not importing `MATCH_DELAY_HOURS`):
1. `lib/matching/findBestResonance.ts:117-128` (`isUserMatchable`) — checks `user.lastMatchAt`; if `hoursSinceMatch < 24`, returns `matchable: false` with `nextAvailableAt`. This is the check used by the **cron job** path.
2. `lib/matching/findBestMatchFor.ts:115-119` — computes `nextEligibleAt` **only if both** `lastMatchAt` AND `lockedUntil` are set (`if (queryUser.lastMatchAt && queryUser.lockedUntil)`), using `lockedUntil + 24h`, **not** `lastMatchAt + 24h`. This is a **different and arguably wrong formula** from `findBestResonance`'s — it conflates the 30-day lock (`lockedUntil`) with the 24-hour rule, and doesn't independently enforce a 24h gap from `lastMatchAt` at all when `lockedUntil` is null. Additionally, and more importantly: **`findBestMatchFor()` itself never checks or blocks based on `lastMatchAt`/24h at all** — it only *reports* a `nextEligibleAt` hint; the actual 24-hour gating for the manual `/api/match` POST path is done **upstream**, in `app/api/match/route.ts:141-161`, but that code **only checks `lockedUntil`** (the 30-day journey lock), not `lastMatchAt`/24h at all:
   ```ts
   // 24t-regel: Sjekk om bruker er låst   <-- comment claims this is the 24h rule
   const currentUser = await prisma.user.findUnique({ where: { id: userId }, select: { lockedUntil: true } });
   if (currentUser?.lockedUntil) { ... }
   ```
   **BUG (`app/api/match/route.ts:141-161`): the comment says "24t-regel" (24-hour rule) but the code only ever reads and checks `lockedUntil`, which is the 30-day journey lock set by match-acceptance, not `lastMatchAt` (which is what actually encodes the 24-hour cadence elsewhere in the codebase).** This means a user calling `POST /api/match` manually is **never actually blocked by the 24-hour rule** — only by the 30-day lock (if they have an active accepted match). If a user has no `lockedUntil` set (e.g., they were matched, rejected the match, and `lockedUntil` was never set because only *both-accept* sets it — see `app/api/match/accept/route.ts:100-123`), they could call `POST /api/match` repeatedly with no 24-hour cooldown enforced at all via this endpoint, even though `lastMatchAt` might have just been set moments ago. (Note: `lastMatchAt` is only written by the **cron** matching job — `app/api/cron/matching/route.ts:129-132` — never by the manual `/api/match` POST flow, so `findBestMatchFor`'s dependency on `queryUser.lastMatchAt` for computing `nextEligibleAt` will almost always be null for users going through the manual flow, making that hint permanently non-functional for that path too.)
3. `app/api/match/status/route.ts:75-82` — independently re-derives 24h-from-`lastMatchAt` for **display purposes only** (computing `nextAvailableAt` to show the user), again hardcoding `24 * 60 * 60 * 1000` rather than importing `MATCH_DELAY_HOURS`.

**Summary of the 24-hour rule gap**: the rule is real and enforced only in the **cron/automated matching path** (`findBestResonance`/`isUserMatchable`). The **manual match-request path** (`POST /api/match`) does not enforce a 24-hour cooldown at all — it only enforces the 30-day journey lock. The `MATCH_DELAY_HOURS` constant exported from `config/matching.ts` and asserted by the test suite is **decorative** — no production code path actually imports/uses it; all enforcement/display code hardcodes the literal `24`.

### Gaps: tie-breaking

- **`findBestResonance.ts:238`**: `candidateResonance.sort((a, b) => b.resonance.resonanceScore - a.resonance.resonanceScore)` — if two candidates have an identical score, `Array.prototype.sort` in V8 is stable, so the tie is broken by original array order, which itself comes from `prisma.user.findMany(...take: 50)` with **no `orderBy` clause** (`findBestResonance.ts:182-200`). Since there's no `orderBy`, the default ordering is not guaranteed deterministic, meaning **tie-breaking is effectively non-deterministic** across repeated runs — two different cron executions with the exact same underlying user set + scores could theoretically select a different "best" candidate. No explicit secondary tie-break key (e.g., `createdAt`, `id`, "most recently active", "waited longest") exists anywhere in either matching path.
- **`findBestMatchFor.ts:99-110`**: same issue — `for (const candidate of candidates)` picks strictly-greater score (`result.score > bestResult.score`), meaning **the first candidate in iteration order wins ties** (since `>` not `>=`), and candidates come from `prisma.user.findMany(...take: 100)` with no `orderBy` — same non-determinism concern.

### Gaps: zero-candidates case

- `findBestResonance.ts:202-204`: `if (candidates.length === 0) return null;` — handled gracefully, caller (`app/api/cron/matching/route.ts:67-70`) treats `null` as "processed but no match", continues loop. Good.
- `findBestResonance.ts:233-235`: `if (candidateResonance.length === 0) return null;` (all candidates scored below `minResonance`, default `0`, so in practice this branch is only reachable if `minResonance` is explicitly raised above 0 — currently unreachable in the cron's default call `findBestResonance({ userId: user.id })` with no `minResonance` override, since any score >= 0 passes). Effectively dead code path under current cron usage, but correctly handled if ever exercised.
- `findBestMatchFor.ts:92`: `if (candidates.length === 0) return null;` — handled; caller `app/api/match/route.ts:185-197` returns 404 "Ingen gyldig match funnet" to the user. Reasonable UX for zero candidates.
- **Neither path logs or alerts on a sustained zero-candidate situation** (e.g., a small user base where everyone is already matched) — no monitoring/metrics hook distinguishes "no eligible users at all" vs. "eligible users exist but all excluded for other reasons," which would matter operationally at low user volume (a realistic risk for an early-stage Norwegian niche platform).

### Gaps: mutual-match edge cases

- The **`Match`** model requires **both users to separately accept** via `acceptedByA`/`acceptedByB` (`app/api/match/accept/route.ts`). There is a `@@unique([userAId, userBId])` constraint on `Match` (`prisma/schema.prisma`) preventing a duplicate literal `(A,B)` pair, but **it does not prevent the reverse pair `(B,A)`** — Prisma's compound unique index is order-sensitive. If User A gets matched to User B via one path (say the cron, creating `Match{userAId: A, userBId: B}`) and independently User B triggers a manual `/api/match` POST that happens to also select User A as best candidate, `findBestMatchFor`/`app/api/match/route.ts` would create a **second, distinct** `Match{userAId: B, userBId: A}` row — the unique constraint does **not** catch this because the column order is reversed. **This is a real gap**: nothing in `findBestMatchFor.ts`, `findBestResonance.ts`, or `app/api/match/route.ts` explicitly excludes candidates by checking BOTH column orders together with the manual flow's candidate-exclusion logic. `findBestResonance.ts:162-179` does correctly build `excludedIds` from both `userAId` and `userBId` of existing matches (statuses `matched`/`active`), so the **cron** avoids re-creating a duplicate against its own prior matches — but this does not prevent the **manual** path from independently creating the reverse-direction duplicate if timing lines up (e.g., manual match created right as a conversation from a rejected/ended prior match closes), since `findBestMatchFor.ts`'s candidate query (lines 71-90) excludes only users with an open (non-ended) conversation, not users with an existing `Match` row in the opposite status/direction.
- **Re-matching after rejection**: When a match is rejected via `PUT /api/match/:id/complete` with `action: "reject"` (`app/api/match/[id]/complete/route.ts:104-134`), the match's `status` becomes `"rejected"`. Looking at `findBestResonance.ts:162-171`, the exclusion query only filters matches with `status: { in: ["matched", "active"] }` — **a `"rejected"` status match does NOT appear in `excludedIds`**, meaning **the same two users could be immediately re-matched by the very next cron run**, since a rejected match doesn't block re-pairing in the resonance/cron path. This directly contradicts the presumable product intent of "reject" (the transition table in `complete/route.ts:105-112` even defines `"rejected": ["reactivated"]` as the only valid next transition, implying rejected matches are meant to be a terminal/cooldown state, not simply ignored) — **this is a functional bug**: rejecting a match provides no actual protection against being immediately re-matched with the same rejected person by the automated cron.
  - The **manual** path (`findBestMatchFor.ts:71-79`) is even looser: it excludes users only by "has an open (non-ended) `Conversation`" — since a rejected match likely never created a `Conversation` (conversation is only created on `action: "accept"`, `complete/route.ts:154-164`), a user could immediately re-request a manual match via `POST /api/match` and be re-offered the exact same person they just rejected, with no cooldown/exclusion at all.
- **`app/api/match/[id]/complete/route.ts:125`**: the status-transition guard logic is convoluted and has a **bug of its own**:
  ```ts
  if (!allowedTransitions.includes(newStatus) && previousStatus !== "pending" && action !== "complete") {
    return 409 error...
  }
  ```
  This condition only *rejects* the transition if **all three** conditions are true simultaneously: (a) not in the allowed-transitions map, AND (b) previous status is not "pending", AND (c) action is not "complete". This means: **if `action === "complete"`, the guard is bypassed entirely regardless of `previousStatus`** — a match with `status: "rejected"` (a terminal-ish state) could have `action: "complete"` called on it and it would bypass the transition-table check entirely (since condition (c) is false, the whole `&&` chain is false, so no 409 is returned), directly contradicting the `transitions` map's own declaration that `"rejected": ["reactivated"]` (complete is not a valid transition from rejected). Similarly, `"completed": []` (declared as terminal, no transitions allowed) can still be re-marked "completed" again via `action: "complete"` because the guard is bypassed whenever `action === "complete"`. This is a **real state-machine enforcement bug** — the transition table exists but has an unconditional bypass for one action type, undermining the entire guard's purpose.

---

## Cron Jobs

### `app/api/cron/journey/route.ts` (daily journey advancement)

**Idempotency (safe to run twice in a row / same tick)?**
- **Not fully idempotent.** The query selects journeys where `nextDayAt: { lte: new Date() }` (line 26-33). If the cron is invoked twice back-to-back (e.g., a duplicate trigger, a retried Vercel cron invocation, or manual + scheduled overlap) **before the first run's `update` sets a new `nextDayAt` in the future**, the second invocation's query could re-select the same rows and advance them **twice** in a single logical "day," since there is no locking, no `SELECT ... FOR UPDATE`, and no idempotency key/marker (e.g., "already processed today"). The `update` call *does* push `nextDayAt` 24h into the future (line 118), which would prevent a *third* pass from re-selecting the row, but if the two invocations' `findMany` reads happen close enough together (before either's `update` commits), **both will read the same set of eligible rows and both will independently increment `day`**, resulting in a user's day counter jumping by 2 instead of 1 for that "tick." There's no unique constraint, transaction, or optimistic-locking (`version` column) protecting the update in `app/api/cron/journey/route.ts:66-130`.
- Given Vercel Cron's documented at-least-once semantics (no exactly-once guarantee) and no single-flight guard beyond the shared secret, this is a **real risk in production**, especially with `vercel.json`'s schedule (`"0 7 * * *"`) — if the endpoint is slow (many users) and a retry occurs, or if the endpoint is manually triggered for testing while the schedule also fires, double-advancement is possible.

**Error recovery / partial-failure handling** (batch of N users, fails on user 51):
- The main loop (`app/api/cron/journey/route.ts:51-150`) wraps **each individual journey's processing** in its own `try { ... } catch (journeyError)` block (lines 52-149). If processing journey #51 throws (e.g., a DB error, a constraint violation), the `catch` block logs the error to the `errors` array (line 147) and the loop **continues** to process journey #52, #53, etc. (`processed++` still increments; the loop is not aborted). This is **correct partial-failure handling** — a single bad row does not crash the whole batch, and the response includes `errors: errors.slice(0, 5)` (line 171) surfaced to the caller, plus all errors (up to 10) logged to `SystemLog` (line 160-161). **No rollback occurs for successfully-processed rows before the failure** (nor should there be, since each row is an independent unit of work with no cross-row transaction) — this is the correct behavior for this kind of batch job (partial success is acceptable and expected), but it's worth noting **there is no automatic retry mechanism** for the failed rows (#51 in the example) — they simply remain un-advanced with a stale `nextDayAt` that is already in the past, so they'll be picked up again on the *next* cron invocation's `nextDayAt: { lte: new Date() }` query (assuming the underlying error was transient) — this is implicit "retry on next run" behavior, not an explicit retry-with-backoff, and if the error is **persistent** (e.g., a data corruption issue specific to that row), the row will be **retried forever on every cron run indefinitely**, silently accumulating error log noise with no alerting/circuit-breaker to flag "this journey has failed N times in a row."
- **Outer catch-all** (`app/api/cron/journey/route.ts:173-189`): if something throws *outside* the per-journey loop (e.g., the initial `findMany` query itself fails, or the final `systemLog.create` for the summary fails), the entire endpoint returns HTTP 500 with a generic error, and none of the already-processed journeys' commits are rolled back (each per-row `update`/`create` was already committed independently — there's no wrapping transaction across the whole batch). This is reasonable for a fire-and-forget batch cron, but means a mid-batch outer-level crash (unlikely given the per-row try/catch, but possible e.g. if `prisma.systemLog.create` for the final summary log itself throws — which is **not** wrapped in its own try/catch, lines 155-162) would cause the **entire success response** to be replaced by an error response, even though most/all of the actual journey advancement work had already succeeded and committed — **this is a misleading-response bug**: the caller (cron scheduler / monitoring) would see a 500 error and might assume total failure, when in fact `advanced`/`ended` counts were fully processed; only the final logging step failed.

**Locking against overlapping runs:**
- **None.** There is no database advisory lock, no Redis/external mutex, no `SELECT ... FOR UPDATE SKIP LOCKED` pattern, and no in-memory or persisted "is this cron currently running" flag anywhere in `app/api/cron/journey/route.ts`. Vercel's cron scheduling combined with the possibility of manual invocation (the endpoint is a plain authenticated `GET` — anyone with `CRON_SECRET` could trigger it manually at any time, including while the scheduled run is in-flight) makes **concurrent overlapping executions structurally possible**, and as detailed above, this can cause double-advancement of `day` for affected users.

### `app/api/cron/matching/route.ts` (daily auto-matching)

**Idempotency (safe to run twice)?**
- **Partially idempotent, with a real gap.** The `eligibleUsers` query (`app/api/cron/matching/route.ts:29-56`) filters for users with **no active match** (`matchesA: { none: { status: 'active', expiresAt: {gte: now} } }` OR similarly for `matchesB`). The query uses `OR` between the two "none" conditions, which is logically flawed: a user matches the `where` clause if **either** their `matchesA` has no active/unexpired match **or** their `matchesB` has no active/unexpired match — this means a user who **does** have an active match as `userA` but has never been `userB` in any match will still satisfy the second `OR` branch (`matchesB: { none: {...} }` is trivially true if they have zero `matchesB` records at all) and be considered "eligible" even though they already have one active match as `userA`. **This is a filtering logic bug** (`app/api/cron/matching/route.ts:36-53`): the intended semantic is almost certainly "user has NO active match in either role" (which would require an `AND` of two `none` conditions), but the actual Prisma query expresses "user lacks an active match as A, OR lacks an active match as B" — which nearly all users satisfy trivially. Concretely: a user who already has ONE active match (as `userA`, say) still has `matchesB: { none: {status:'active',...} }` evaluate to **true** (since they have zero `matchesB` rows, "none match the filter" is trivially satisfied), so the `OR` as a whole is **true**, and **this already-matched user is incorrectly included in `eligibleUsers`**. The **only** real protection against re-matching an already-matched user is then downstream, inside `findBestResonance`'s `isUserMatchable()` check for `lockedUntil`/`lastMatchAt` (lines 88-130) — but `lockedUntil` is only set once **both** users *accept* a match (`app/api/match/accept/route.ts:101-123`), not when a match is merely `created`/`active`-but-unaccepted. **This means: a user with an existing `active` (but not yet mutually-accepted) match, and no `lockedUntil` set, and whose `lastMatchAt` is more than 24h old (or null, if they were matched by the manual path which never sets `lastMatchAt`), will be re-matched again by the cron, potentially creating a SECOND simultaneous active match for the same user before they've even responded to the first.** This is a significant functional bug enabling multiple concurrent unaccepted matches per user, which likely violates the platform's stated "one match at a time" design intent (as documented in comments like `findBestMatchFor.ts:47-50`: "Bare en match per 24t... Bare en aktive reise om gangen").
- Beyond the above filtering bug, re-running the cron in immediate succession for a user who legitimately becomes eligible again: `findBestResonance`'s `isUserMatchable` would return `false` due to the fresh `lastMatchAt` (just set on the prior run, line 129-132), so a genuinely-back-to-back double run would be correctly blocked **for that specific check** — but only for the user who was actually just matched in run 1; it does nothing to fix the filtering bug for users incorrectly included in the eligible set to begin with.

**Error recovery / partial-failure handling:**
- Similar structure to the journey cron: the main loop (`app/api/cron/matching/route.ts:62-141`) wraps each user's `findBestResonance` + match/conversation/journey creation in a `try/catch` (lines 64-140). If user #51 throws, it's caught, logged to `errors[]`, `processed++` still increments, and the loop continues to user #52. **Correct continue-on-error behavior at the per-user level.**
- **However**, within a single user's processing block, there is **no transaction** wrapping the multi-step sequence: `match.create` (line 73-100) -> `conversation.create` (line 103-111, **with its own separate `.catch()` that only warns and swallows the error**, line 109-111) -> `journeyProgress.upsert` x2 (lines 114-126, **also independently `.catch()`-wrapped to only warn**) -> `user.update` for `lastMatchAt` (lines 129-132, **not wrapped in its own catch — if this specific call throws, it propagates to the outer per-user `catch` at line 136, but the `Match` and `Conversation` rows from the earlier steps in this same iteration have ALREADY been committed** since Prisma without an explicit `$transaction` commits each call independently). **This is a partial-failure/data-integrity bug**: if `user.update` (setting `lastMatchAt`) fails for any reason (e.g., transient DB error) *after* the `Match` and `Conversation` were already successfully created, the result is a **fully-created match+conversation with `lastMatchAt` never updated** — meaning the 24-hour rule's bookkeeping is now silently out of sync with reality (the user could be immediately re-matched by the very next cron tick since `lastMatchAt` was never stamped, potentially creating the double-active-match scenario described above). Compare this to the **manual** match path (`app/api/match/route.ts:206-239`), which explicitly wraps match+conversation+journeyProgress creation in `prisma.$transaction(...)` specifically to avoid partial state (per its own comment: "FASE 2.3 FIX: Alle tre opprettelser i en transaksjon for aa unnga partial state") — **the cron path was never given the same fix**, so the exact class of bug that was deliberately fixed in the manual path still exists, unfixed, in the cron path.
- The two inner `.catch()` blocks for `conversation.create` and `journeyProgress.upsert` (lines 109-111, 123-125) **deliberately swallow errors** (`console.warn` only, no re-throw, no addition to the `errors[]` array reported in the final response). This means: if conversation creation fails, the cron job will still report `created++` (line 134, unconditional) and treat the whole operation as a success in its returned counts/metrics — **a `Match` row can exist with no corresponding `Conversation`**, and the failure is only visible in server logs (`console.warn`), not in the cron's JSON response, `SystemLog` entry, or `errors` array. This is a **silent partial-failure masking bug**: the operator-facing success metrics (`created`, the `SystemLog` "Cron matching: N nye matcher" message) do not reflect that some of those "successful" matches may be missing their conversation or journey records.

**Locking against overlapping runs:**
- **None**, same as the journey cron — no advisory lock, mutex, or single-flight protection. `vercel.json` schedules this at `"0 5 * * *"` (once daily), but the endpoint remains a plain `GET` guarded only by a shared `CRON_SECRET` query param/header (`app/api/cron/matching/route.ts:18-22`), so nothing prevents concurrent/overlapping invocations (manual trigger during the scheduled window, or a platform-level retry). Given the filtering bug described above already risks creating duplicate active matches for a single user across *sequential* runs, a *concurrent* overlapping run would make duplicate-match creation for the same user in the same tick considerably more likely (two parallel iterations over the same `eligibleUsers` list, each independently calling `findBestResonance` and `match.create` for the same user before either has committed `lastMatchAt`).

**Authentication / secret handling note (cron-specific, minor):**
- `app/api/cron/journey/route.ts:19-20` accepts the secret **only** via query string (`req.nextUrl.searchParams.get('secret')`), whereas `app/api/cron/matching/route.ts:18-19` accepts it via **either** query string **or** `Authorization: Bearer` header. This inconsistency isn't a functional bug in the audited sense, but it does mean the two cron endpoints have different attack surfaces (query-string secrets are more likely to leak via server access logs, browser history, or referrer headers) despite both being equally sensitive automation endpoints — worth flagging as a hardening inconsistency between two otherwise-parallel jobs.

### Additional observation: `pausedAt` is a dead/unimplemented feature

Multiple journey-related routes read and branch on `journeyProgress.pausedAt` (e.g. `app/api/journey/check/route.ts`, `app/api/journey/progress/route.ts`, `app/api/match/route.ts`, `app/api/match/[id]/complete/route.ts`, `app/api/cron/journey/route.ts`'s query explicitly filters `pausedAt: null`), and the UI even has copy for it ("Reisa di er pausa..."). However, a full-codebase search shows **`pausedAt` is never actually SET to a non-null value anywhere in the application code** — there is no `POST /api/journey/pause` (or similar) endpoint, and no other code path writes `pausedAt: new Date()`. This means the "pause a journey" feature is entirely non-functional / a dead code path: all the read-side branching logic for a paused state exists, but nothing can ever trigger it, so `journeyProgress.pausedAt` is always `null` in practice. This isn't a "bug" that causes incorrect behavior today (since the condition is never true), but it is a functional gap — a documented, UI-surfaced feature ("pause your journey") that cannot currently be invoked by any user or admin action.

---

### Cross-cutting summary of the most severe items in this scope

1. **Cron matching-eligibility query has an OR-instead-of-AND filtering bug** (`app/api/cron/matching/route.ts:36-53`) that can include already-matched users as "eligible," combined with **no transaction** around match/conversation/journey/lastMatchAt creation (unlike the manual path, which was already fixed for this), risking duplicate active matches and inconsistent `lastMatchAt` bookkeeping.
2. **Rejecting a match does not prevent immediate re-matching** with the same person by either the cron (`findBestResonance.ts` only excludes `matched`/`active` statuses, not `rejected`) or the manual flow (`findBestMatchFor.ts` only excludes users with an open conversation, which a rejected match never has).
3. **Four independently-maintained day->phase mapping implementations**, one of which (`lib/match/journeySync.ts`) has objectively wrong boundaries (DEEPER swallows what should be CHECKIN, days 26-30), currently mitigated only by that module being unreferenced/dead code — a landmine if ever revived.
4. **The "24-hour rule" is not actually enforced on the manual `/api/match` POST path** despite a comment claiming it is (`app/api/match/route.ts:141`) — only the 30-day `lockedUntil` journey lock is checked there; `MATCH_DELAY_HOURS` is a decorative constant never imported by any enforcement code.
5. **No locking/idempotency protection on either cron job** against overlapping/duplicate invocations, with a demonstrable double-advancement risk for the journey cron and a demonstrable duplicate-match risk for the matching cron.
6. **State-transition guard bypass in `app/api/match/[id]/complete/route.ts:125`** — the `action === "complete"` case unconditionally skips the transition-table validation, allowing "complete" to be called from any prior status including terminal ones.
7. **Scoring double-counting** in the legacy `matchingEngine()` path caused by `calculateTotalScore()`'s lossy relabeling of the 9-dimension unified breakdown into 5 legacy categories, producing an undocumented, non-obvious effective weight distribution.
8. **Test coverage is narrow**: `buildJourneyState()` (the core composed journey-state function used by virtually every journey UI/API surface) has zero direct tests; matching engine's dealbreaker logic, tie-breaking, and both cron jobs have no automated tests at all; the existing 24-hour-rule test only checks a constant's value, not actual enforcement behavior.
9. **`pausedAt` pause-journey feature is entirely dead code** — extensively read/branched-on across 6+ files but never written anywhere, meaning the "pause your journey" UX message can never actually be triggered.
