# Legacy Notes — ToSom

This document preserves historical notes about deprecated systems that were removed during Phase 1 cleanup.

## Removed Files

### Legacy API Routes (deleted from `legacy/api/`)
- `legacy/api/match/findBest/route.ts` — Old matching algorithm
- `legacy/api/match/new/route.ts` — Old match creation
- `legacy/api/matching/route.ts` — Legacy matching endpoint
- `legacy/api/matching/accept/route.ts` — Legacy match acceptance
- `legacy/api/matching/detail/route.ts` — Legacy match detail

### Legacy MatchCard Variants (deleted from `legacy/matchcard/`)
- `legacy/matchcard/MatchCard.tsx` — Original MatchCard
- `legacy/matchcard/components_MatchCard.tsx` — Variant
- `legacy/matchcard/components_ui_MatchCard.tsx` — UI variant
- `legacy/matchcard/components_ui_cards_MatchCard.tsx` — Cards variant
- `legacy/matchcard/components_ui5_MatchCard.tsx` — UI5 variant
- `legacy/matchcard/components_match_MatchCard.tsx` — Match variant

### Legacy Templates (deleted from `legacy/templates/`)
- `legacy/templates/templates/ChatTemplate.tsx`
- `legacy/templates/templates/CoupleTemplate.tsx`
- `legacy/templates/templates/DashboardTemplate.tsx`
- `legacy/templates/templates/JourneyTemplate.tsx`
- `legacy/templates/templates/MatchTemplate.tsx`
- `legacy/templates/templates/ProfileTemplate.tsx`
- `legacy/templates/templates3.tsx`

### Legacy Matching (deleted from `legacy/matching/`)
- `legacy/matching/explainMatch.ts`

### Broken Components (deleted from `legacy/broken/`)
- `legacy/broken/DashboardMatchStatus`
- `legacy/broken/MatchBreak`

### Dead Code (deleted from `legacy/deadcode/`)
- `legacy/deadcode/KnowYourCard.js`
- `legacy/deadcode/Layout.js`
- `legacy/deadcode/testData.ts`
- `legacy/deadcode/MatchHistory/MatchHistoryEmpty.tsx`
- `legacy/deadcode/MatchHistory/MatchHistoryItem.tsx`
- `legacy/deadcode/MatchHistory/MatchHistoryList.tsx`
- `legacy/deadcode/MatchHistory/MatchHistorySkeleton.tsx`

## Migration Notes

All matching functionality was consolidated into:
- `app/matching/` — Main matching pages
- `app/api/match/` — Match API routes
- `components/ui5/MatchCard.tsx` — Canonical MatchCard component

---

Generated: 2026-06-26
Action: Phase 1 — Security & Cleanup