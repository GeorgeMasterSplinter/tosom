# ToSom — Sikkerhets- og Stabilitetsplan v1

**Dato:** 2026-08-05
**Versjon:** 1.0
**Status:** Plan (ingen filer endret enda)
**Ansvarlig:** Cline Agent, godkjent av George

---

## 1. Prioritert rekkefølge (1–10)

| # | Punkt | Kategori | Kritiskitet | Anslått tid | Avhengigheter |
|---|-------|----------|-------------|-------------|---------------|
| 1 | Admin-token er bare string-literal `'valid'` | 🔴 SIKKERHET | KRITISK | 2-3h | Ingen |
| 2 | Dev-login-ruter aksepterer hvilket som helst passord | 🔴 SIKKERHET | KRITISK | 2-4h | Ingen |
| 3 | Manglende input-validering på Profile JSON-felter | 🔴 SIKKERHET | HØY | 4-6h | #10 (zod) |
| 4 | Duplicate scoring-motorer gir ulik resultat for samme par | 🟠 STABILITET | KRITISK | 8-12h | Ingen |
| 5 | NextAuth v5 βeta i produksjon | 🟠 STABILITET | HØY | 4-6h | Ingen |
| 6 | To design-token-systemer ikke synkronisert | 🟠 STABILITET | MEDIUM | 2-3h | Ingen |
| 7 | Monster-filer & state-mønster | 🟡 ARKITEKTUR | MEDIUM | 8-16h | #4 (scoring) |
| 8 | Blueprint vs implementering (9→13 onboarding-steg) | 🟡 DOKUMENTASJON | LAV | 1-2h | Ingen |
| 9 | Duplisert VIPPS OAuth & Pusher+Supabase overlapping | 🟡 ARKITEKTUR | MEDIUM | 4-6h | #1 (admin auth) |
| 10 | @playwright/test i dependencies, ikke devDependencies | 🟡 DEPLOYMENT | LAV | <1h | Ingen |

---

## 2. Risikoanalyse per punkt

### Punkt 1: Admin-token `'valid'` — KRITISK

**Risiko:** Enhver kan sette `document.cookie = 'admin_token=valid'` i browser console og få full admin-tilgang til ban/unban brukere, se match-data, freeze samtaler.

**Nåværende kode:**
```typescript
// middleware.ts linje ~125
const hasAdminToken = req.cookies.get('admin_token')?.value === 'valid'
```

**Konsekvens ved angrep:** Full admin-tilgang uten autentisering. Alle brukere kan bans, samtaler freezes, match-data eksponeres.

---

### Punkt 2: Dev-login alt-passord — KRITISK

**Risiko:** Hvis `DEV_LOGIN_ENABLED=true` leaker til produksjon (via git commit, CI logs, Docker image), kan ALLE kontoer logges inn med ethvert passord.

**Nåværende kode:**
```typescript
// lib/auth/config.ts linje 61-70
if (rawPassword && rawPassword.length > 0) {
  return { id: user.id, email: user.email, ... }; // alt godkjent
}
// linje 73-78: ingen passord = også gyldig!
```

**Konsekvens ved angrep:** Alle bruker-kontoer kompromittert. Passords blir irrelevant.

---

### Punkt 3: Manglende input-validering — HØY

**Risiko:** Profile JSON-felter (`lifeSituation`, `personality`, etc.) har ingen server-side validering. Onboarding sender ~75 felter direkte til `/api/profile/setup/` uten sjekk. En angriper kan sende ugyldig JSON, store arrays, eller prototype pollution payloads.

**Konsekvens ved angrep:** Scoring-algoritmen krasjer med NaN, database forurenses, API responderer feil.

---

### Punkt 4: Duplicate scoring-motorer — KRITISK

**Risiko:** `scorer.ts` (5 sub-scorers, range [0.35, 1.0]) og `resonanceScore.ts` (9 dimensjoner, range [0-100]) gir **ulik score for samme par**. API `/api/match/` bruker `engine.ts → scorer.ts`, mens cron-jobben via `findBestResonance()` bruker `resonanceScore.ts`.

**Konsekvens ved feil:** Brukere får inkonsistente match-resultater. Admin-seere viser ulik score for samme match. Tier-bestemmelse (deepResonance vs moderate) varierer tilfeldig. Bruker-trust på matching-systemet ødelegges.

---

### Punkt 5: NextAuth v5 βeta — HØY

**Risiko:** `"next-auth": "^5.0.0-beta.25"` med caret (^) betyr at `npm install` kan oppgradere til ny beta med breaking API changes. Beta-pakker har ingen migrerings-garanti.

**Konsekvens ved feil:** Auth-systemet stopper plutselig. Login, Magic Link, VIPPS OAuth alt brytes. Ingen varsel i CI/CD.

---

### Punkt 6: To design-token-systemer — MEDIUM

**Risiko:** `config/design-tokens.ts` (401 linjer, hardkodet RGB) og `components/ui/tokens.ts` (584 linjer, CSS custom props) er **ikke synkronisert**. Endring i én reflekterer ikke den andre.

**Konsekvens ved feil:** Visuell inkonsistens ("drift") mellom sider. Gullfarge A ≠ gullfarge B på ulike sider. Høy support-last fra brukere som rapporterer "farger ser rart ut".

---

### Punkt 7: Monster-filer & state-mønster — MEDIUM

**Risiko:** `lib/journey/engine.ts` (1061 linjer) og `app/onboarding/OnboardingFlow.tsx` (484+ linjer) er for store. Ren `useState` + localStorage på onboarding uten global state management (Zustand/Redux). Pusher + Supabase som realtime-kanaler uten samlet tilstandsmønster.

**Konsekvens ved feil:** Høy risiko for utilsiktete sideeffekter. Merge-konflikter øker eksponentielt med team-størrelse. Testing blir umulig (for stor scope per test). Onboarding state race conditions ved rask navigering mellom steg.

---

### Punkt 8: Blueprint vs implementering — LAV

**Risiko:** `tosom-blueprint.md` sier "9 onboarding-steg", men `app/onboarding/steps/` har 13 step-filer med delte nummer (2x Step2, 2x Step5, 2x Step8). CHECKIN-fasen finnes i `JourneyPhase` enummen men er ikke brukt.

**Konsekvens ved feil:** Forvirring for nye utviklere. Feil antagelser om flow-steg. Progress-metrics viser feil tall ("steg X av 9" vs "steg X av 13"). Ingen funksjonelt brudd.

---

### Punkt 9: Duplisert VIPPS OAuth & Realtime — MEDIUM

**Risiko:** To identiske VIPPS OAuth-stier (`/api/auth/vipps/` og `/api/auth/oauth/vipps/`) gir dobbelt vedlikehold, ulik feilhåndtering over tid. Pusher (meldinger + typing) og Supabase (typing via PostgreSQL real-time) gir to abonnement per chat-room — økt kompleksitet og kostnad.

**Konsekvens ved feil:** Redirect-loop mellom OAuth-stier. Typing-status dupliseres eller forsinkes. Økt infrastrukturnkostnad (Pusher + Supabase Realtime). Feilhåndtering divergerer over tid.

---

### Punkt 10: @playwright/test i dependencies — LAV

**Risiko:** `@playwright/test: ^1.62.0` under `dependencies` betyr ~45MB Playwright binaries blir inkludert i production build. Native Chromium/WebKit binaries deploys til Vercel.

**Konsekvens ved feil:** 11% økning i container image size. Lengre CI/CD deploy-tid (~3-5 min ekstra per deploy). Ingen funksjonelt brudd.

---

## 3. Konkrete filer som berøres

| # | Berørte filer | Type endring |
|---|--------------|--------------|
| 1 | `middleware.ts`, `lib/auth/admin-jwt.ts` (finnes allerede) | Ny: JWT-signing endpoint i `/api/admin/login/route.ts`. Middleware oppdateres til å bruke `verifyAdminCookie()` |
| 2 | `lib/auth/config.ts`, `app/api/dev-login/route.ts`, `app/api/dev-login/[users]/route.ts` | Fjern CredentialsProvider. Legg IP-whitelist + JWT-basert dev-session |
| 3 | `prisma/schema.prisma`, `/api/profile/setup/` | Ny: `lib/validation/profile-schemas.ts` med Zod schemas for alle 7+ JSON-felter |
| 4 | `lib/matching/scorer.ts`, `lib/matching/resonanceScore.ts`, `lib/matching/engine.ts`, `lib/matching/index.ts`, cron matching-ruter | Merge scoring til én motor (`scorer.ts`). Fjern/depreker `resonanceScore.ts` |
| 5 | `package.json` | Endre `"^5.0.0-beta.25"` → `"5.0.0-beta.25"` (eksakt versjon) |
| 6 | `config/design-tokens.ts`, `components/ui/tokens.ts`, Tailwind config, ~100+ komponenter | Konsolider til én kilde (`tokens.ts`). Bytt ut hardkodete farger med CSS custom properties |
| 7 | `lib/journey/engine.ts`, `app/onboarding/OnboardingFlow.tsx` + 13 steg-komponenter, `package.json` (zustand) | Split engine.ts → 5+ moduler. Legg Zustand store for onboarding/chat |
| 8 | `tosom-blueprint.md`, `prisma/schema.prisma` (deepProfileStep enum), `app/onboarding/steps/` | Oppdater blueprint til å dokumentere alle 13 steg. Eventuell enum-sync |
| 9 | `/api/auth/vipps/authorize/route.ts`, `/api/auth/oauth/vipps/authorize/route.ts`, chat realtime-lag (`lib/pusher/`, `lib/chat/`) | Slett én VIPPS sti, legg 301 redirect. Fjern Supabase typing, behold Pusher |
| 10 | `package.json` | Flytt `@playwright/test` fra `dependencies` → `devDependencies` |

---

## 4. Forslag til trygg arbeidsflyt per punkt

### Generell workflow (gjelder alle punkter):

```
PLAN → BRANCH → IMPLEMENTER → TEST → CODE REVIEW → STAGING → PROD
```

### Spesifikke flows:

**Punkt 1 (Admin JWT):**
1. Lag `feature/admin-jwt-auth` branch
2. Implementer JWT-signing med `jsonwebtoken` i `/api/admin/login/` — bruk eksisterende `lib/auth/admin-jwt.ts`
3. Oppdater `middleware.ts` til å bruke `verifyAdminCookie()` fra admin-jwt.ts (finnes allerede!)
4. Test: curl POST til /api/admin/login med gyldige credentials → får JWT-cookie. curl GET /admin/ uten cookie → 301 redirect
5. Staging deploy + manual verifisering

**Punkt 2 (Dev-login):**
1. Lag `feature/dev-login-security` branch
2. Fjern CredentialsProvider fra `lib/auth/config.ts` eller gjør den IP-basert med whitelist
3. Legg `DEV_LOGIN_IP_WHITELIST=127.0.0.1,::1` i `.env.example`
4. Test: POST /api/dev-login fra localhost → 200. POST fra eksternt IP → 403

**Punkt 3 (Profile validering):**
1. Lag `feature/profile-validation` branch
2. Implementer Zod schemas i `lib/validation/profile-schemas.ts` for hvert JSON-felt (lifeSituation, personality, etc.)
3. Legg `.parse()` eller `.safeParse()` i `/api/profile/setup/` før database-write
4. Test: POST med gyldig payload → 201. POST med null/personality array → 400

**Punkt 4 (Scoring konsolidering):**
1. Lag `feature/unified-scoring` branch
2. Merge `scorer.ts` og `resonanceScore.ts` til én motor i `lib/matching/scorer.ts` — behold scorers.ts struktur, integrer resonance dimensjoner
3. Oppdater `lib/matching/index.ts` exports
4. Fjern `resonanceScore.ts` eksport fra index.ts
5. Test: POST /api/match/ med par (A,B) → score X. Call findBestResonance() med samme par → samme score X

**Punkt 5 (NextAuth låsing):**
1. Lag `feature/lock-nextauth-version` branch
2. Endre caret til eksakt versjon i package.json
3. Kjør full auth-test-suite (se seksjon 7)
4. Test: Magic Link login, VIPPS OAuth callback, phone verify, session expiry → alt fungerer

**Punkt 6 (Design-tokens):**
1. Lag `feature/unify-design-tokens` branch
2. Velg `components/ui/tokens.ts` som "source of truth" — eksporter fra én kilde
3. Oppdater alle imports i komponenter (~grep -r "design-tokens" --include="*.tsx")
4. Visuell QA: Sjekke hver side (landing, onboarding, chat, dashboard, admin) på desktop + mobile

**Punkt 7 (Monster-filer):**
1. Lag `refactor/journey-engine-split` branch
2. Split `lib/journey/engine.ts` → `/lib/journey/phases.ts`, `/lib/journey/resonanceCalculator.ts`, `/lib/journey/warmthCalculator.ts`, `/lib/journey/impulseMessages.ts`
3. Oppdater alle imports
4. Legg Zustand: `npm i zustand`, lag `/store/onboardingStore.ts`, `/store/chatStore.ts`
5. Test: Onboarding flow gjennom alle 13 steg. Journey day 1→2→30 → ingen errors

**Punkt 8 (Blueprint oppdatering):**
1. Lag `docs/sync-blueprint-implementation` branch
2. Oppdater `tosom-blueprint.md` til å reflektere alle 13 onboarding-steg med fil-referanser
3. Validerer at `DeepProfileStep` enum i Prisma stemmer

**Punkt 9 (VIPPS + Realtime):**
1. Lag `feature/unify-vipps-oauth-realtime` branch
2. Slett `/api/auth/vipps/authorize/route.ts` → behold `/api/auth/oauth/vipps/authorize/` som kanonisk sti
3. Legg 301 redirect fra gammel sti i middleware eller API-route
4. Fjern Supabase typing-subscription — bruk kun Pusher for alt realtime (typers + meldinger)
5. Test: VIPPS OAuth login → fullfører uten error. Chat typing → vises korrekt via Pusher

**Punkt 10 (Playwright flytting):**
1. Lag `fix/playwright-dev-deps` branch
2. Flytt i package.json, kjør `npm install`, verifiser at builds fungerer
3. Test: `npm run build` → Playwright IKKE i prod bundle

---

## 5. Avhengigheter mellom punktene

```
Punkt 1 (Admin JWT) ──────────────────────────────┐
                                                   ▼
Punkt 2 (Dev-login)          Punkt 9 (VIPPS OAuth) │ (krever admin-token fix før admin-rutes sikring)
                                                   │
Punkt 3 (Profile validering) ←── Punkt 10 (Zod i   │
                                    devDeps)        │
                                                   │
Punkt 4 (Scoring) ──────────────▶ Punkt 7 (Monster-filer, scoring er del av journey engine)
                                                   │
Punkt 5 (NextAuth) ◄────────────┘                  │
                                                   ▼
Punkt 6 (Design-tokens)    Punkt 8 (Blueprint)    (uavhengige)
```

**Kritiske avhengigheter:**
- **#1 → #9:** Admin-token må fikses før admin-rutene (inkl. VIPPS OAuth-admin) sikres
- **#4 → #7:** Scoring-motor må konsolideres FØR journey engine splittes (scoring er del av engine.ts)
- **#5 → alt auth-relatert:** NextAuth oppgradering påvirker Magic Link, VIPPS OAuth og session-håndtering

**Uavhengige (kan paralleliseres):** #6, #8, #10

---

## 6. Estimert tidsbruk per punkt

| # | Punkt | Implementasjon | Testing | Code Review | Total |
|---|-------|---------------|---------|-------------|-------|
| 1 | Admin JWT | 1h | 30m | 30m | **2h** |
| 2 | Dev-login | 1.5h | 45m | 30m | **3h** |
| 3 | Profile validering | 3h | 1.5h | 1h | **5.5h** |
| 4 | Scoring konsolidering | 6h | 3h | 2h | **11h** |
| 5 | NextAuth låsing | 1h | 3h (full auth-suite) | 1h | **5h** |
| 6 | Design-tokens | 1.5h | 1h | 30m | **3h** |
| 7 | Monster-filer + Zustand | 8h | 4h | 2h | **14h** |
| 8 | Blueprint oppdatering | 1h | 15m | 15m | **1.5h** |
| 9 | VIPPS + Realtime | 3h | 1.5h | 1h | **5.5h** |
| 10 | Playwright flytting | 15m | 15m | 15m | **0.5h** |

**Total estimering: 51.5 timer (~6-7 virkedager)**

---

## 7. Hvilke punkter kan testes med E2E (Playwright)

| # | Punkt | Kan E2E testes? | Test-strategi |
|---|-------|-----------------|---------------|
| 1 | Admin JWT | ✅ JA | Naviger til /admin/ uten cookie → forventes 301 redirect. POST /api/admin/login med gyldig token → GET /admin/ → 200 |
| 2 | Dev-login | ✅ JA | POST /api/dev-login fra localhost IP → 200. Simuler eksternt IP → 403 |
| 3 | Profile validering | ✅ JA | Fullfør onboarding med gyldig payload → 201. Send ugyldig JSON til /api/profile/setup/ → 400 |
| 4 | Scoring konsolidering | ⚠️ PARTIELL | API-calls er enkle å teste, men scoring-resultat krever kjente inputs/kjente outputs (unit-test bedre enn E2E) |
| 5 | NextAuth låsing | ✅ JA | Full auth-suite: Magic Link login → vipps OAuth flow → session expiry → logout |
| 6 | Design-tokens | ❌ NEI | Visuell testing krever menneskelig øye. Kan bruke Percy/Chromatic for visual diffs, men ikke Playwright |
| 7 | Monster-filer | ✅ JA | Onboarding flow gjennom alle steg. Journey day-advancement. Chat melding → vises i sanntid |
| 8 | Blueprint | ❌ NEI | Kun dokumentasjon — ingen kode endres |
| 9 | VIPPS + Realtime | ⚠️ PARTIELL | OAuth-flow kan simuleres med mock endpoint. Typing-status via Pusher er automatisk testing-vendt men krevende å mocke i E2E |
| 10 | Playwright flytting | ✅ JA | `npm run build` + sjekk at `node_modules/@playwright` IKKE finnes i prod Docker image (via `npm ls --production`) |

---

## 8. Hvilke punkter krever manuell QA

| # | Punkt | Manuell QA nødvendig? | Hva testes manuelt |
|---|-------|----------------------|-------------------|
| 1 | Admin JWT | ✅ JA | Logg inn som admin → sjekk at cookie er signert JWT (ikkje "valid"). Slett cookie → forventes redirect til /admin/login |
| 2 | Dev-login | ❌ NEI | Kan automatiseres med IP-mocking |
| 3 | Profile validering | ✅ JA | Manuell input-testing: sende tomme felter, ekstra lange strings, emoji i JSON-felter, nullverdier |
| 4 | Scoring konsolidering | ✅ JA | Sammenligne match-resultat for samme par før/etter konsolidering. Sjekke at tier-bestemmelse (deepResonance/moderate) er konsistent |
| 5 | NextAuth låsing | ✅ JA | Manual login via Magic Link + VIPPS app → begge fungerer. Session expiry testing (vent eller mock clock) |
| 6 | Design-tokens | ✅ JA | Gå gjennom hver side manuelt på desktop + mobile. Sjekke gullfarge-konsistens, glassmorphism-effekter, hover-tilstander |
| 7 | Monster-filer | ✅ JA | Full onboarding flow → full journey 30 dager → chat med typing-indikator. Sjekke at ingenting er ødelagt av refaktorering |
| 8 | Blueprint | ❌ NEI | Kun dokumentasjon — les gjennom og godkjenn |
| 9 | VIPPS + Realtime | ✅ JA | Full VIPPS OAuth login via mobil-app → fungerer med ny sti. Chat typing → viser korrekt uten Supabase duplicate |
| 10 | Playwright flytting | ❌ NEI | Automatisert: `npm run build` + `npm ls --production` |

---

## Sammenfatning

ToSom har et solid fundament, men disse 10 punktene må løses før produksjons-launch. Arbeidet er delt i tre faser:

- **FASE 1 (Sikkerhet — uke 1):** Punkt 1, 2, 3
- **FASE 2 (Stabilitet — uke 2):** Punkt 4, 5, 6
- **FASE 3 (Arkitektur — uke 3-4):** Punkt 7, 8, 9, 10

**Prioritert anbefaling:** Start med Fase 1. Admin-token og dev-login er åpneporter til hele systemet som MÅ lukkes før alt annet.