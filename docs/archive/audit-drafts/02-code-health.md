# ToSom Code Health & Architecture Audit

Scope: lib/, components/ (all subfolders), hooks/, app/ (API routes + largest pages), config/, styles/.
Method: static grep/regex import-graph analysis (no bundler build run), `madge` circular-dependency check, manual reads of largest files.

---

## Dead Code Candidates (full list, file paths)

Verified via `grep -rl` for every plausible import path (barrel path, direct path, named export) across `app/`, `components/`, `hooks/`, `lib/`. A file is only listed as dead if **zero** real import sites were found (doc-comments and dead-barrel-only references do not count as "alive").

### Previously-found list — all 27 RE-VERIFIED as still dead (confirmed, not repeated in detail)
lib/analytics.ts, lib/constants.ts, lib/conversationStore.ts, lib/createSystemMessage.ts, lib/demoMode.ts, lib/emotional.ts, lib/journeyEvents.ts, lib/journeyStore.ts, lib/journeyTasks.ts, lib/matchHistory.ts, lib/matchingWorker.ts, lib/onboardingGuard.ts, lib/profileCompletion.ts, lib/resonance.ts, lib/semantic.ts, lib/user-state.ts, lib/routes.ts, lib/matching.ts, lib/matching/resonanceScore.ts, lib/matching/feedback.ts, lib/matching/breakdown.ts, lib/matching/ranking.ts, lib/release/* (errorBoundary.tsx, performance.ts, preload.ts), lib/notifications/events.ts.

### NEW dead files found in lib/

- lib/jwt.ts
- lib/api.ts
- lib/seo.ts
- lib/email.ts
- lib/realtime.ts
- lib/api-validator.ts — **CORRECTION: this one is ALIVE** (12 importers), do not treat as dead.
- lib/dashboard/data.ts (316 lines — duplicate of inline logic in app/api/dashboard routes)
- lib/profile/dynamicProfile.ts
- lib/presence/presenceEngine.ts (has its own `calculateResonance` duplicate — see Duplicate Systems)
- lib/match/matchFlow.ts
- lib/match/journeySync.ts
- lib/notifications/unread.ts
- lib/pusher/client.ts
- lib/pusher/server.ts (only consumed by dead lib/chat/messageService.ts)
- lib/auth/hash.ts
- lib/auth/csrf.ts (self-referencing only)
- lib/chatAnimations/chatAnimations.ts
- lib/matching/normalizer.ts
- lib/matching/index.ts (barrel, zero external importers — everything re-exported here is reached directly instead)
- lib/validation/index.ts, lib/validation/admin.ts, lib/validation/input.ts, lib/validation/message.ts, lib/validation/match.ts, lib/validation/journey.ts
- lib/admin/adminSystem.ts, lib/admin/ai.ts, lib/admin/audit.ts, lib/admin/security.ts, lib/admin/observability.ts, lib/admin/realtime.ts, lib/admin/data.ts (538 lines — this is a **major** finding, see Duplicate Systems)
- lib/system/cache.ts, lib/system/errorBoundary.ts, lib/system/heatmap.ts, lib/system/logQuery.ts, lib/system/perf.ts, lib/system/rateMonitor.ts, lib/system/trace.ts, lib/system/messages.ts
- lib/analytics/analyticsEngine.ts
- entire lib/chat/* except none are used: autoSummary.ts, chatFlow.ts, conversationService.ts, createConversation.ts, createMessage.ts, deleteMessage.ts, editMessage.ts, freeze.ts, getConversation.ts, getMessages.ts, getUserConversations.ts, markRead.ts, media.ts, messageService.ts, messageState.ts, metadata.ts, pagination.ts (16 files — real chat send/receive flow lives in app/api/chat/* routes directly with inline Prisma calls, this whole "chat service layer" was superseded and abandoned)
- lib/app/navigationState.ts

### NEW dead files found in hooks/
- hooks/useAutoSave.ts
- hooks/useAutoSaveForm.ts
- hooks/useHaptics.ts
- hooks/useMediaQuery.ts
- hooks/useMotionPreferences.ts
- hooks/useOnboarding.ts
- hooks/useScroll.ts
- hooks/useChatMessages.ts, hooks/useChatRealtime.ts, hooks/useSendMessage.ts (only consumed by the dead components/chat/ChatRoom.tsx cluster below)

(Alive hooks: useMediaQuery is dead but usePresence.ts is alive — used by app/chat/components/ChatContainer.tsx)

### NEW dead files found in components/ (huge — this is where most bloat lives)

**Entire dead directories:**
- components/app/ (AppShell.tsx, ModalStack.tsx, NavigationDemo.tsx) — self-contained dead cluster, embeds dead PartnerProfileView/UserProfileView duplicates
- components/sections/ (Features.tsx, ForWho.tsx, Founder.tsx, Hero.tsx, Process.tsx, Safety.tsx, SectionFeatures.tsx, SectionHero.tsx, Why.tsx, index.ts — 10 files). The real landing page uses `components/ui/layout/Hero.tsx` instead.
- components/launch/ (JourneyUpdateScreen.tsx, LaunchDemo.tsx, LaunchFlow.tsx, LoadingScreen.tsx, MatchSearchScreen.tsx, SplashScreen.tsx — 6 files)
- components/global/ (GlobalHeader.tsx, ToSomLogo.tsx — 2 files)
- components/presence/ (PartnerPresenceBar.tsx — 1 file; note: the *hook* usePresence.ts is alive, this component is not)
- components/release/ (FadeLoading.tsx, FallbackScreen.tsx, OfflineScreen.tsx — 3 files)
- components/relationship/ (Memories.tsx, MilestoneCard.tsx, SocialGraph.tsx, Timeline.tsx, WeeklyDigest.tsx — 5 files; only reachable via the also-dead components/dynamic/index.ts barrel)
- components/dynamic/index.ts (the whole "lazy-load" barrel has zero real importers)
- components/chat/ (ChatBubble.tsx, ChatHeader.tsx, ChatInput.tsx, ChatMessages.tsx, ChatRoom.tsx, ChatTypingIndicator.tsx, MilestoneBubble.tsx, index.ts — 8 files). Only `components/chat/useChatScroll.ts` survives (imported directly by app/chat/components/ChatContainer.tsx).
- components/branding/ (BrandButton.tsx, BrandDemo.tsx, BrandIcon.tsx, BrandProvider.tsx, BrandText.tsx — 5 files; LogoVariants.tsx is the one survivor, used by ui/layout/Footer & Hero)
- app/ui/design-system/ (typography.ts, radii.ts, components.tsx [464 lines!], shadows.ts, colors.ts, spacing.ts, index.ts — 7 files, no page.tsx, not a route, zero importers — entirely separate from the live `app/design-system/page.tsx`)

**Partial-directory dead files:**
- components/layout/: Footer.tsx, Header.tsx, PageWrapper.tsx, GlobalHeaderWrapper.tsx (dead) — only UniversalMenu.tsx is alive. All real pages import `components/ui/layout/Footer.tsx` (different file!) instead.
- components/auth/AuthCTA.tsx (dead — 1 file, whole dir)
- components/icons/: BellIcon.tsx, DownloadIcon.tsx, ImageIcon.tsx, JourneyIcon.tsx, LanguageIcon.tsx, MailIcon.tsx, MoonIcon.tsx (dead) — ChatIcon, ProfileIcon, SettingsIcon are alive (used in app/dashboard/page.tsx)
- components/journey/: JourneyCard.tsx, JourneyMap.tsx, JourneySection.tsx, JourneySummaryMini.tsx, JourneyView.tsx, ResonanceBar.tsx (dead) — ImageShareLockBanner, JourneyTimeline, PremiumJourneyDayView, PremiumJourneyProgressTracker, TodayCard are alive (used in app/dashboard/page.tsx)
- components/dashboard/: DashboardHeader.tsx, PremiumResonanceMeter.tsx, PrimaryButtons.tsx (dead) — WaitingForMatch.tsx is alive
- components/atmosphere/: AtmosphereLayer.tsx, GridPattern.tsx (dead) — AmbientGlow.tsx, GradientOverlay.tsx are alive
- components/profile/: index.ts (barrel), PartnerProfileDemo.tsx, UserProfileDemo.tsx (dead, only reached via dead barrel or dead components/app/AppShell.tsx) — ProfileActions.tsx, ProfileForm.tsx, ProfileHeader.tsx, ProfileLockBanner.tsx, ProfileView.tsx are alive. **ProfileDetails.tsx is dead** (zero importers) despite importing live GlassCard/GlassPanel.
- Top-level components/: AgeRequirement.tsx, DashboardMatchBanner.tsx, DashboardMatchStatus.tsx, DashboardSkeleton.tsx, ImageUpload.tsx, MatchActions.tsx, MatchBreakdown.tsx, MatchBreakdownItem.tsx, MatchBreakdownSkeleton.tsx, MatchPopup.tsx, NotificationCenter.tsx, PublicMatchCard.tsx, Recommendation.tsx (13 files, all dead — only cross-referenced by other dead files or the dead components/dynamic barrel)

### NEW dead files found in components/ui/ (the single biggest source of dead weight)

This is effectively an abandoned **"UI 4.0/5.0 Experience Layer"** rewrite that was scaffolded but never wired into any real page. Its own barrel (`components/ui/index.tsx`) imports files that **don't even exist** (`./pwa/InstallPrompt`, `./platformRegistry`, `./deescalationPanel`, `./memorySummary`, `./coupleInsights`, `./journalCompanion`, `./emotionalExercise`) — meaning this barrel would fail to compile if anyone ever tried to import it. It is dead by construction.

Dead top-level files (components/ui/):
microcopy.ts (1703 lines — **largest file in repo, 100% dead**), onboarding4.tsx (503 lines), emptyStates.tsx, successStates.tsx, errorStates.tsx, illustrations.tsx, guidedFlows.tsx, personalization.tsx, toneMeter.tsx, moodTag.tsx, emotionalSuggestions.tsx, relationshipHealth.tsx, emotionTemplates.tsx, desktop3.tsx, navigation3.tsx, couplesMobile.tsx, aiMobile.tsx, platformComponents.tsx, motion.tsx, emotionTypes.ts, index.ts, index.tsx, platform.ts, tokens.ts (584 lines — 4th-largest file in repo, 100% dead, see Duplicate Systems), ActionGrid.tsx, Avatar.tsx, Button.tsx, Card.tsx, Dialog.tsx, Divider.tsx, Dropdown.tsx, FeatureCard.tsx, MessagesSkeleton.tsx, Modal.tsx, ModalV2.tsx, Navbar.tsx, PremiumTypingIndicator.tsx, ProgressBar.tsx, RadioGroup.tsx, ResonanceMeter.tsx, SectionTitle.tsx, Skeleton.tsx, SlideUp.tsx, StepIndicator.tsx, SettingsCard.tsx, Toast.tsx, Tooltip.tsx, Typography.tsx, DesktopChrome.tsx, pwaLoading.tsx, Input.tsx, Chip.tsx.
(Alive top-level ui files: PulseGlow.tsx, GlassPanel.tsx, PremiumButton.tsx, FadeIn.tsx, ErrorState.tsx, NotFound.tsx, LoadingSkeleton.tsx.)

Dead subfolders (entire contents unused outside the dead cluster):
- components/ui/ai/ (AIIcebreakers, AIInsightsPanel, AIJourneyGuide, AIRewritePanel — 4 files)
- components/ui/chat/ (ChatBubbleV2, ChatInputV2, ChatSuggestions, ChatWindowV2 — 4 files)
- components/ui/couples/ (MemoryLane, SharedCalendar, SharedGoals, SharedHome, SharedJournal — 5 files)
- components/ui/lists/ (ChatListItem, List.tsx, NotificationItem — 3 files)
- components/ui/navigation/ (AppNavbar, BottomNav, MobileNavbar, Sidebar — 4 files)
- components/ui/overlays/ (Drawer, ModalV3, Popover, Tooltip — 4 files)
- components/ui/typography/ (Body, Display, Heading, Label, Subheading — 5 files)
- components/ui/form/ (index.ts) + components/ui/forms/ (Input, Textarea, Select, Toggle, Slider, DatePicker, TagInput, FormField — 9 files total)
- components/ui/base/ (Glass.tsx — 1 file)

Partial dead in components/ui/cards/: ElevatedCard.tsx, GradientCard.tsx, ProfileCard.tsx, index.ts are dead. **GlassCard.tsx and MemoryCard.tsx are alive** (imported directly, bypassing the dead barrel, by NotificationCenter/ProfileDetails/MatchBreakdown [themselves dead] and by relationship/Memories.tsx [dead] and ui/platform.ts [dead] — so transitively these two "alive" files are only kept alive by other dead files; effectively **also dead in practice** but technically reachable).

Partial dead in components/ui/layout/: PageShell.tsx, Section.tsx, AppHeader.tsx, Container.tsx, Grid.tsx, Stack.tsx are dead. **Footer.tsx and Hero.tsx are alive** (used by nearly every marketing page).

components/ui/relationship/ — MilestoneCardV2.tsx, SocialGraphV2.tsx, WeeklyDigestV2.tsx, TimelineV2.tsx: all 4 dead (a "V2" rewrite of the already-dead relationship feature, doubly dead).

**components/ui/system/ — partially dead (21 of 26 files):**
Only ToSomButton.tsx, ToSomCard.tsx, ToSomSection.tsx, ToSomTagline.tsx, ToSomGlassPanel.tsx (via named export `GlassPanelStyles` only) are actually imported by live pages. The other 21 files (ToSomBadge, ToSomChatBubble, ToSomChatInput, ToSomDashboardCard, ToSomDivider, ToSomForm, ToSomGrid, ToSomIconButton, ToSomInput, ToSomModal, ToSomNavbar, ToSomOnboardingLayout, ToSomPage, ToSomProfileCard, ToSomSelect, ToSomSidebar, ToSomStack, ToSomStepper, ToSomTabs, ToSomTextArea, ToSomToast) are dead but re-exported from the same `index.ts` barrel that also re-exports the 5 live ones — so the barrel itself cannot be deleted, only pruned.

### Approximate dead-file tally
~140+ confirmed dead/orphan `.ts`/`.tsx` files across lib/, components/, hooks/, and app/ui/design-system/ — roughly **19–20% of the ~709 non-generated source files**. The single biggest cluster is the abandoned "UI 4.0/5.0" `components/ui/*` experience layer (~90 files) followed by the abandoned `lib/chat/*` service layer (16 files) and the abandoned `lib/admin/*` reporting layer (7 files, ~1,600 combined lines including the 538-line lib/admin/data.ts).

---

## Duplicate Systems Still Present

1. **Match scoring — mostly consolidated, but one zombie duplicate remains.**
   `lib/matching/unifiedScorer.ts` (calculateTotalScore / unifiedScore, 9-dimension 0–100 scale) is the **single real engine**, used by both `lib/matching/engine.ts` (API path, called from `findBestMatchFor.ts` → `app/api/match/route.ts`) and `lib/matching/findBestResonance.ts` (cron path, called from `app/api/cron/matching/route.ts`). The old `scorer.ts` was already removed as claimed.
   However, **`lib/matching/resonanceScore.ts` (345 lines) is a completely separate, never-imported, duplicate scoring engine** with its own `calculateResonance()`, its own breakdown shape (9 different sub-scores), and its own resonance-level enum. It was not deleted, just orphaned. Recommend outright deletion.
   A **third** `calculateResonance()` implementation exists in `lib/presence/presenceEngine.ts` (also dead) — three independent, incompatible "resonance" scoring functions exist in the codebase, none of which fully agree, and only one of the three code paths (unifiedScorer) is live.

2. **`/api/match/score` uses yet a fourth scoring system.**
   `app/api/match/score/route.ts` calls `lib/match/score.ts` (`calculateMatchScores`), which is a hand-rolled weighted-average scorer completely independent of `unifiedScorer.ts`. This route and its 4th scoring engine are alive but architecturally disconnected from the "real" matching engine used by the actual match-creation flow (`/api/match` POST). Two live, unrelated scoring systems currently coexist in production.

3. **Design tokens — three separate systems, only one truly canonical.**
   - `config/design-tokens.ts`: **66 importers** — this is the de-facto standard, used throughout app/, components/onboarding, components/ui/system/Tosom*, components/branding, components/chat (dead), etc.
   - `components/ui/tokens.ts` (584 lines): **5 importers**, and all 5 (`couplesMobile.tsx`, `navigation3.tsx`, `PageShell.tsx`, `Section.tsx`) are themselves confirmed-dead files. Net effect: **tokens.ts is 100% dead in practice** despite technically having "importers."
   - `styles/tokens.ts`: **0 importers** — a third, completely orphaned token definition file, never wired to anything.
   Verdict: only `config/design-tokens.ts` should survive; the other two should be deleted.

4. **Admin reporting/observability — dashboard-facing stub routes vs. dead "real" implementation.**
   `lib/admin/data.ts` (538 lines, 5th-largest file audited), `lib/admin/adminSystem.ts`, `lib/admin/ai.ts`, `lib/admin/audit.ts`, `lib/admin/security.ts`, `lib/admin/observability.ts`, `lib/admin/realtime.ts` are a fully-built admin data/reporting layer with **zero callers**. Meanwhile the *actual* live routes under `app/api/admin/observability/*`, `app/api/admin/system/*`, `app/api/admin/security/overview`, `app/api/admin/notifications` are **hard-coded stubs returning empty literals** (e.g. `{ metrics: [] }`, `{ overview: {} }`, `{ traces: [] }`) instead of calling the real lib implementation that already exists. This looks like an incomplete migration: the frontend renders admin dashboards against endpoints that always return empty data, while a fully-featured (but disconnected) implementation sits unused in lib/admin.
   By contrast `lib/admin/notifications.ts`, `lib/admin/conversation.ts`, `lib/admin/system.ts`, `lib/admin/analytics.ts` (data.ts's sibling) ARE wired up correctly and used by their respective routes — so this is not "the whole module is dead," but a specific, severe half-migration.

5. **Chat component/service layer duplicated 3 times.**
   - `components/chat/*` (8 files, dead) — a full ChatRoom/ChatInput/ChatBubble/ChatMessages implementation, superseded by
   - `app/chat/components/*` (ChatContainer.tsx, MessageBubble.tsx, etc. — alive, the real implementation), and
   - `components/ui/chat/*` (ChatBubbleV2, ChatInputV2, ChatWindowV2, ChatSuggestions — dead, a third "V2" attempt).
   Similarly `lib/chat/*` (16 files: messageService.ts, chatFlow.ts, conversationService.ts, etc.) is a fully-built message/conversation service layer that is entirely dead — the live `app/api/chat/*` routes talk to Prisma directly instead of using this layer.

6. **Relationship feature duplicated (V1 + V2, both unused).**
   `components/relationship/*` (5 files) + `components/ui/relationship/*V2.tsx` (4 files) are two generations of the same "shared memories / milestones / social graph / weekly digest" feature, gated behind `utils/flags.ts` feature flags that appear to be permanently off — both generations are fully dead, only reachable via the also-dead `components/dynamic/index.ts` lazy-import barrel.

---

## Lint Blind Spot Findings (lib/matching, lib/system, lib/notifications, lib/release)

These four directories are **fully exempt from ESLint** via `ignorePatterns` in `.eslintrc.json`. Findings:

- **lib/matching/**: Only 2 `any` casts found (`findBestMatchFor.ts:12` — `profile: any`; `unifiedScorer.ts:335` — `weights: W as any`). Otherwise reasonably typed. The bigger issue in this directory is not lint-hygiene but the **dead duplicate scoring engine** (`resonanceScore.ts`, 345 lines) and 4 other dead files (feedback.ts, breakdown.ts, ranking.ts, normalizer.ts, index.ts) sitting unlinted and unused — the lint exemption means these will never surface as "unused" via CI even if unused-import rules were later turned back on repo-wide.
- **lib/system/**: 2 `any` casts (`errors.ts:30`, `log.ts:24`, both `metadata as any` — a recurring pattern of casting loosely-typed metadata objects). 8 of 12 files in this directory are fully dead (cache.ts, errorBoundary.ts, heatmap.ts, logQuery.ts, perf.ts, rateMonitor.ts, trace.ts, messages.ts) — a full "system observability" subsystem (anomaly detection, heatmaps, tracing, rate monitoring) was built and then abandoned, invisible to lint and, since it's excluded from most audits, easy to miss.
- **lib/notifications/**: 1 `any` cast (`dispatcher.ts:19` — `metadata as any`). 2 of 3 files dead (events.ts, unread.ts); only dispatcher.ts is alive.
- **lib/release/**: 0 `any` casts found, but **100% of the directory is dead** (errorBoundary.tsx, performance.ts, preload.ts) — the exemption is protecting code that provides zero runtime value.

**Net risk**: the lint-ignore list was presumably added to unblock a noisy migration, but it has become a permanent blind spot that now shields ~15 confirmed-dead files and the repo's most concentrated `metadata as any` pattern from any static-analysis visibility. Recommend removing the ignore once dead files here are deleted, then re-enabling standard rules.

---

## Circular Dependency / Architecture Smells

- **No `@/app` imports found inside `lib/`** — clean separation, lib/ never reaches "up" into app/.
- **No lib/matching ↔ lib/match backwards imports** — the two similarly-named directories (`lib/matching/` and `lib/match/`) do not import each other, though the naming collision itself is a code-smell / maintainability risk (a `lib/match/score.ts` scorer and `lib/matching/unifiedScorer.ts` scorer sit one directory apart with confusingly similar names, see Duplicate Systems #2).
- **No `@/components` imports found inside `lib/`** — direction of dependency (components → lib, never lib → components) is respected.
- **`madge --circular` run separately against `lib/`, `components/`, and `app/` reports zero circular dependencies in all three.** The architecture's *layering* is genuinely clean; the problems in this codebase are dead code and duplication, not cyclic coupling.
- **Naming-collision smell**: `lib/matching/` vs `lib/match/`, `components/ui/tokens.ts` vs `config/design-tokens.ts` vs `styles/tokens.ts`, `components/layout/Footer.tsx` vs `components/ui/layout/Footer.tsx`, `components/chat/` vs `components/ui/chat/` vs `app/chat/components/`, `components/relationship/` vs `components/ui/relationship/`, `app/design-system/page.tsx` vs `app/ui/design-system/*` — this repo has at least 7 pairs of near-identically-named directories/files serving different (often one dead, one live) purposes, which is a serious discoverability/onboarding hazard even though it doesn't create true circular imports.

---

## Large & Complex Files Needing Refactor (prioritized top 15)

| # | File | Lines | Reason |
|---|------|-------|--------|
| 1 | `components/ui/microcopy.ts` | 1703 | Largest file in repo and **100% dead** — highest-value deletion target, not a refactor target. |
| 2 | `lib/journey/engine.ts` | 1073 | "God file" merging 8+ formerly-separate subsystems (phases, milestones, progression, resonance, warmth, silent-moments, day-texts, journeyAPI); only ~30% of its exports (JOURNEY_TOTAL_DAYS, getPhaseForDay, buildJourneyState) are actually used by live code — the rest (calculateResonance, calculateWarmScore, detectSilence, getJourneyImpulse, generateFirstMessage, the whole `journeyAPI` object) is dead weight inflating a business-critical file. |
| 3 | `lib/admin/data.ts` | 538 | Entirely dead (0 importers) yet still the 5th-largest file — duplicate/superseded admin reporting logic never wired to the stub routes that need it. |
| 4 | `components/ui/tokens.ts` | 584 | Effectively 100% dead (all 5 importers are themselves dead files) — a third competing design-token system. |
| 5 | `app/chat/components/ChatContainer.tsx` | 663 | Live and complex: 14 hooks/functions in one component (presence polling, message send, scroll management, typing indicators) — needs decomposition into smaller hooks/components. |
| 6 | `app/settings/page.tsx` | 649 | Live; 29 useState/useEffect/function declarations in a single page component — classic monolithic page-component smell. |
| 7 | `app/reisen/page.tsx` | 638 | Live marketing/journey page; large, likely mixes content + layout + logic that could be extracted into sub-components. |
| 8 | `app/hvorfor/page.tsx` | 604 | Live marketing page; large static-content page that should be data-driven/extracted rather than one big JSX tree. |
| 9 | `app/chat/components/MessageBubble.tsx` | 546 | Live; 8 nested function components in one file (including MilestoneBubble duplicate logic) — should be split into separate files. |
| 10 | `components/ui/onboarding4.tsx` | 503 | 100% dead — part of the abandoned UI 4.0 layer; delete rather than refactor. |
| 11 | `app/om-oss/page.tsx` | 492 | Live marketing page, same large-static-JSX smell as #7/#8. |
| 12 | `app/onboarding/OnboardingFlow.tsx` | 483 | Live and **business-critical** (the real onboarding orchestrator calling `/api/profile/setup` and `/api/match`); 15 internal functions/effects — high complexity in a critical path, deserves careful decomposition rather than deletion. |
| 13 | `app/ui/design-system/components.tsx` | 464 | 100% dead — entire directory has no route and no importers; delete the whole `app/ui/design-system/` tree. |
| 14 | `app/cookies/page.tsx` | 457 | Live legal/marketing page; large static content, same pattern as other marketing pages — low logic complexity but still a maintenance-heavy single file. |
| 15 | `lib/matching/unifiedScorer.ts` (336 lines, not in the original "largest" list but flagged here) | 336 | Live and **the single most business-critical scoring function in the app** — currently carries only 2 `any` casts and is lint-exempt (see Blind Spots); given its criticality it deserves the *opposite* of neglect: dedicated tests and lint coverage, not a size-driven refactor. Included here because criticality × lint-blindness outweighs raw line count. |

Note on methodology: files 1, 3, 4, 10, 13 are "needing refactor" only in the sense that the correct refactor is **deletion**, not restructuring. Files 5, 6, 7, 8, 9, 11, 12, 14 are live and genuinely would benefit from decomposition/splitting.

---

## Type Safety Gaps

- `tsconfig.json` has `strict: true` but `noImplicitAny: false` — this materially weakens "strict" mode; any un-annotated parameter silently becomes `any` with no compiler warning.
- `.eslintrc.json` disables `@typescript-eslint/no-explicit-any` and `@typescript-eslint/no-unused-vars` repo-wide, and fully exempts `lib/matching/*`, `lib/system/*`, `lib/notifications/*`, `lib/release/*` from all linting.
- Explicit `any` usage (`: any`, `<any>`, `as any`) found in **56 files** across lib/components/app (95 total occurrences). Concentrations:
  - `lib/matching/findBestMatchFor.ts` — untyped `profile: any` parameter feeding the core matching pipeline.
  - `lib/system/errors.ts`, `lib/system/log.ts`, `lib/notifications/dispatcher.ts` — repeated `metadata as any` pattern for logging payloads (3 instances, same shape of bug across 3 files — a shared `Metadata` type would fix all three at once).
  - `components/ui/tokens.ts` — 3 `any` usages inside an already-dead file.
- `app/chat/components/ChatContainer.tsx` (663 lines, live, business-critical) has at least 1 `any` cast in a high-traffic user-facing flow.
- Given `noImplicitAny: false`, the true count of untyped values is almost certainly much higher than the 95 explicit `any` occurrences — many function parameters/returns are implicitly `any` without any lexical marker, which grep cannot detect.

---

## Zod Validation Gaps

- Total API route files: **96**
- Routes importing `zod` directly or using `validateWithZod`/`.safeParse(`: **6** (`app/api/auth/request-reset`, `app/api/chat/send`, `app/api/match/score`, `app/api/payment/create-checkout-session`, `app/api/presence/update`, `app/api/profile`) → **~6% of all routes**.
- Routes that call `await req.json()` / `await request.json()` (i.e., accept a JSON body that could be validated): **27**.
- Of those 27 body-parsing routes, only 6 validate with zod → **~22% Zod coverage among routes that actually need it**; the remaining **21 routes (78%) parse untrusted JSON with no schema validation at all**, including sensitive routes like `app/api/match/route.ts` (match creation), `app/api/match/accept`, `app/api/match/[id]/complete`, `app/api/onboarding/save`, `app/api/admin/auth`, `app/api/admin/users/[id]`, `app/api/conversation/create`, `app/api/auth/phone/send`, `app/api/auth/phone/verify`, `app/api/auth/test-login`, `app/api/dev-login`.
- A `lib/validation/*` module suite exists (auth.ts, api.ts, onboarding-setup.ts, profile.ts — each with exactly 1 real importer) alongside 5 fully **dead** validation files (index.ts barrel, admin.ts, input.ts, message.ts, match.ts, journey.ts) that were apparently built for routes that never adopted them.

---

## Error Handling Gaps

- Total API route files: **96**; files containing at least one `try {` block: **89** → **~93% try/catch coverage** by file (109 total try-block occurrences, so some files have 2+).
- **7 routes have zero try/catch blocks**: `app/api/auth/[...nextauth]/route.ts`, `app/api/auth/request-reset/route.ts`, `app/api/relationship/digest/route.ts`, `app/api/admin/session/route.ts`, `app/api/admin/logout/route.ts`, `app/api/dev-login/status/route.ts`, `app/api/dev-login/users/route.ts`. Several of these touch auth/session state directly — worth a deliberate pass even though `dev-login/*` is presumably dev-only.
- 93 `console.log`/`console.error`/`console.warn` calls inside `app/api/*` — logging is ad-hoc (console) rather than routed through the structured `lib/system/log.ts` logger in most places, despite that logger existing and being used in some routes (e.g., `app/api/match/route.ts` uses `logInfo`/`captureError` correctly — this is the good example, not the norm).
- Cron/webhook/callback routes (`api/cron/journey`, `api/cron/matching`, `api/payment/webhook`, `api/auth/vipps/callback`) correctly have **no frontend caller** by design — not flagged as dead, per audit instructions.

---

## Unused API Routes (zero frontend caller, excluding cron/webhook/callback)

Confirmed via string-search of route paths inside `app/` and `components/` for `fetch(...)` call sites:

- `api/admin/ai/logs`
- `api/admin/logout`
- `api/admin/notification/[id]`, `api/admin/notifications`
- `api/admin/observability/heatmap`, `api/admin/observability/metrics`, `api/admin/observability/traces` (all 3 are stub routes returning empty literals, see Duplicate Systems #4)
- `api/admin/security/overview` (also a stub)
- `api/admin/session`
- `api/admin/setup`
- `api/admin/stats` (superseded — admin dashboard actually calls `/api/admin/metrics` instead)
- `api/admin/system-message`
- `api/admin/system/errors`, `api/admin/system/logs`, `api/admin/system/overview`, `api/admin/system/rate-limits`, `api/admin/system/realtime` (all stubs)
- `api/admin/matches/[id]/reset`, `api/admin/matches/[id]/unmatch`, `api/admin/matches/[id]/review` (admin matches page has no reset/unmatch/review UI wired up despite these actions existing server-side)
- `api/auth/phone/send`, `api/auth/phone/verify`
- `api/auth/request-reset`
- `api/auth/test-login`
- `api/conversation/create`
- `api/dev/setup`
- `api/journey/check`
- `api/journey/[conversationId]` (self-deprecated per its own code comment)
- `api/journey/progress/advance`
- `api/journey/reflect`
- `api/journey/resonance`
- `api/match/score` (live route, but its only "caller path" is itself — no frontend fetch call found anywhere; see Duplicate Systems #2, may be dead-on-arrival despite being a fully-built, validated route)
- `api/notifications`, `api/notifications/[id]/read`
- `api/onboarding/complete`, `api/onboarding/progress`, `api/onboarding/save` (the real onboarding flow calls `/api/profile/setup` and `/api/match` instead — all 3 onboarding-namespaced routes are orphaned)
- `api/questions/[category]`, `api/questions/categories` (the `/questions` page reads static local data instead of hitting these API routes)

Excluded from "dead" (expected to have no frontend caller by design): `api/cron/journey`, `api/cron/matching`, `api/payment/webhook`, `api/auth/vipps/callback`, `api/auth/[...nextauth]`.

---

## Full TODO/FIXME List

1. `components/system/SystemMessageBox.tsx:6` — `TODO: Her kan vi vise flere meldinger dynamisk senere.`
2. `components/profile/UserProfileView.tsx:18` — `UP32 — TODO: Koble til ekte brukerdata fra backend senere`
3. `components/profile/UserProfileView.tsx:20` — `UP32 — TODO: Lagre profilendringar i database`
4. `components/profile/PartnerProfileView.tsx:7` — `PP22 — TODO-kommentar for backend-kobling`
5. `components/profile/PartnerProfileView.tsx:16` — `PP22 — TODO: Koble til ekte partnerdata fra backend senere`
6. `app/chat/components/ChatContainer.tsx:654` — `senderId={undefined} // TODO: Hent fra session/context`
7. `app/api/payment/webhook/route.ts:44` — `TODO: Oppdater subscription-status i databasen når Prisma-modell finnes`
8. `lib/chat/chatFlow.ts:3` — `TODO: matchContext og journeyState skal komme fra backend senere.`
9. `lib/system/systemMessages.ts:3` — `TODO: Her kan vi senere koble til AI-generering av meldinger.`
10. `lib/system/systemMessages.ts:4` — `TODO: Her kan vi hente meldinger fra en konfigurasjonsfil eller CMS.`
11. `lib/matching/feedback.ts:14` — `TODO: implementer lagring av feedback til DB`
12. `lib/matching/feedback.ts:26` — `TODO: hent fra DB`
13. `lib/matching/engine.ts:37` — `TODO: Når verdier er i schema, sjekk for overlap her`
14. `e2e/tests/onboarding.spec.ts:52` — `TODO: Fikse onboarding-tester når dedikert auth-setup er på plass.`

(No `FIXME`, `HACK`, or `XXX` markers found anywhere in the non-generated source tree.)

Note: items 6, 7 are in **live, business-critical code paths** (chat message rendering, Stripe webhook) and should be prioritized over the others, which sit in already-dead or low-traffic files (items 1–5, 8–13 are in dead/near-dead files: SystemMessageBox, UserProfileView/PartnerProfileView are dead, chatFlow.ts is dead, matching/feedback.ts is dead).

---

## Code Health Score

# 52 / 100

**Justification:**

**What pulls the score down:**
- Roughly **19–20% of all source files are dead code** (~140+ files), concentrated in a single abandoned "UI 4.0/5.0" redesign attempt (~90 files, including the single largest file in the repo at 1,703 lines) plus an abandoned chat-service layer (16 files) and an abandoned admin-reporting layer (7 files, including the 538-line lib/admin/data.ts). This is not scattered cruft — it represents multiple full, half-finished feature migrations left in place.
- **Zod validation covers only ~6% of all routes and ~22% of routes that actually parse JSON bodies** — the majority of mutating endpoints (match creation, onboarding, admin auth, phone auth) accept unvalidated input.
- **Several admin observability/system routes are hard-coded stubs** returning empty data while a complete, unused implementation sits disconnected in lib/admin — a real half-migration bug, not just dead code.
- Duplicate/competing implementations exist for three separate concerns simultaneously: match scoring (4 independent scorers, only 1 fully wired end-to-end), design tokens (3 systems, 1 canonical), and resonance calculation (3 independent `calculateResonance` functions).
- A blanket lint-ignore over 4 directories (lib/matching, lib/system, lib/notifications, lib/release) plus repo-wide disabling of `no-explicit-any`/`no-unused-vars`/`exhaustive-deps` removes most of the safety net that would normally have caught this dead code and validation gap organically.

**What keeps the score from being lower:**
- **Zero circular dependencies** were found anywhere in lib/, components/, or app/ — the underlying layering discipline (components → lib, never lib → app or lib → components) is genuinely sound.
- **~93% of API routes have try/catch error handling**, and the small number of files that use structured logging (`lib/system/log.ts`) do it correctly, even if console.log is still the norm elsewhere.
- The live, business-critical code (the real matching pipeline via `unifiedScorer.ts`, the real onboarding flow, the real chat via `app/chat/components/*` and `app/api/chat/*`) is coherent, non-circular, and reasonably typed — the core product works through one consistent path per feature, it's the *abandoned alternates* sitting alongside it that create the mess.
- The TODO/FIXME backlog is small (14 items) and mostly sits in already-dead files rather than being a large hidden-debt iceberg in live code.

**Bottom line:** this is a codebase where the *live* product logic is architecturally sound (no cycles, decent error handling, one real scoring engine), but roughly a fifth of the repository by file count is abandoned redesign/rewrite attempts that were never cleaned up, plus a real half-finished admin-dashboard migration and thin input-validation coverage on mutating endpoints. A dedicated dead-code deletion pass (start with components/ui/* UI-4.0 layer, lib/chat/*, lib/admin/{data,adminSystem,ai,audit,security,observability,realtime}.ts, components/app/, components/sections/, components/launch/) would likely bring this from 52% to the mid-70s without touching a single line of live logic.
