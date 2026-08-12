# ToSom — Sikkerhets- og Stabilitetsplan v1

**Dato:** 2026-08-05  
**Omfang:** Kun `/mnt/master/tosom`  
**Status:** Plan-fase — ingen filer endret, ingen commits foreslått, ingen handlinger utført  
**Forfatter:** Cline (automatisk analyse basert på kode-graving)  

---

## 1. Prioritert rekkefølge (1–10)

| Prioritet | Punkt | Type | Alvorlighet |
|-----------|-------|------|-------------|
| **1** | Admin-token `'valid'` | 🔴 Sikkerhet | Kritisk |
| **2** | Dev-login "alt-passord" | 🔴 Sikkerhet | Kritisk |
| **3** | Manglende Profile JSON-validering | 🔴 Sikkerhet | Høy |
| **4** | Duplicate scoring-motorer | 🟠 Stabilitet | Høy |
| **5** | NextAuth v5 beta | 🟠 Stabilitet | Medium/høy |
| **6** | To design-token-systemer | 🟠 Visuell konsistens | Medium |
| **7** | Monster-filer (journey + onboarding) | 🟡 Arkitektur | Medium |
| **8** | Blueprint vs implementering (9→13 steg) | 🟡 Dokumentasjon | Lav/medium |
| **9** | Duplicate VIPPS OAuth + Pusher+Supabase | 🟡 Redundans | Medium |
| **10** | Playwright i dependencies | 🟡 Deployment | Lav |

---

## 2. Risikoanalyse for hvert punkt

### Punkt 1: Admin-token `'valid'` — KRITISK

**Sted:** `middleware.ts` linje ~125

**Sårbarhet:** Middleware sjekker `req.cookies.get('admin_token')?.value === 'valid'` — en streng-literal sammenligning. Merk: `lib/auth/admin-jwt.ts` eksisterer med korrekt JWT-system (`signAdminToken()` + `verifyAdminCookie()`) men blir **importert og ikke brukt**.

**Konsekvenser:**
- Enhver bruker kan sette `document.cookie = 'admin_token=valid'` i devtools → full admin-tilgang
- Ban/unban andre brukere uten logg
- Freeze/thaw samtaler — skjule meldinger for andre brukere
- Reset journey for enhver match
- Se all match-data, profiler og sensitive data
- Ingen audit-trace (uten JWT: ingen expiration, ingen sub/issuer)

**Risikonivå:** 🔴 **Kritisk** — Kreves kun devtools + 2 sekunder.

---

### Punkt 2: Dev-login "alt-passord" — KRITISK

**Sted:** `lib/auth/config.ts` (CredentialsProvider linje 38-81), `app/api/dev-login/route.ts`

**Sårbarhet:** Når `DEV_LOGIN_ENABLED === 'true'`, aksepterer CredentialsProvider **ethvert passord** eller **ingen passord i det hele tatt** mot hvilken som helst gyldig e-post. I tillegg setter `ensureDevUserInDb()` password-hash til SHA256("123456") for alle dev-brukere.

**Konsekvenser:**
- Full tilgang til alle bruker-kontoer hvis DEV_LOGIN_ENABLED leaker til produksjon
- Kan sende meldinger på vegne av andre brukere
- Kan endre/slette profildata
- Environment-var-leaks er et kjent scenario (git, CI/CD logs, Docker build args)

**Risikonivå:** 🔴 **Kritisk** — Hvis flagg leker til prod = alle kontoer bruttbare.

---

### Punkt 3: Manglende Profile JSON-validering — HØY

**Sted:** `prisma/schema.prisma` (alle `Json?`-felter), onboarding POST payload (~75 felter)

**Sårbarhet:** Onboarding sender ~75 felter direkte til API. Ingen server-side Zod-validering for JSON-feltene: `lifeSituation`, `lifestyle`, `personality`, `communication`, `intimacy`, `futureVision`, `boundaries`, `emotionalNeeds`. Prisma-typen `Json?` aksepterer alt — null, arrays, strings med ubegrenset lengde.

**Konsekvenser:**
- Angriper kan sende null/undefined/array → crash eller feil i scoring-algoritmen
- Scorer.ts forventer strukturerte data — feil format gir NaN i beregninger
- Kan produsere falske match-resultater (skader plattform-reputasjon)
- JSON-injeksjon (f.eks. `__proto__`) kan påvirke app-logikk

**Risikonivå:** 🟠 **Høy** — Ødelegger kjernefunksjonaliteten: matching.

---

### Punkt 4: Duplicate scoring-motorer — HØY

**Sted:** `lib/matching/scorer.ts` (5 dimensjoner, skala [0,1]) OG `lib/matching/resonanceScore.ts` (9 dimensjoner, skala [0,100])

**Sårbarhet:** To uavhengige motorer med ulik formel og skala gir ulik score for samme par:
- `engine.ts` → bruker `calculateTotalScore()` fra `scorer.ts` → brukt i `/api/match/`
- `findBestResonance.ts` → bruker `calculateResonance()` fra `resonanceScore.ts` → brukt i cron-jobb

**Konsekvenser:**
- Samme par scoret ulikt av API vs cron → inkonsistente resultater
- Tier-bestemmelse (deepResonance vs moderateResonance) kan variere 2+ nivå
- AI-insights henter fra feil motor → uoverensstemmende tekster
- Brukere opplever "uærlig" matching

**Risikonivå:** 🟠 **Høy** — Ødelegger tillit til kjernefunksjonen.

---

### Punkt 5: NextAuth v5 beta — MEDIUM/HØY

**Sted:** `package.json`: `"next-auth": "^5.0.0-beta.25"`

**Sårbarhet:** Beta-versjon med caret (`^`) betyr at `npm install --production` kan oppgradere til ny beta med breaking API-endringer uten varsel.

**Konsekvenser:**
- Session-handtering bryter uten varsel
- OAuth callback-URIs kan endre format
- JWT-strategi kan kreve nytt config
- Admin-role overføring fra token → session kan feile

**Risikonivå:** 🟠 **Medium/Høy** — Breaking change kan legge plattformen nede.

---

### Punkt 6: To design-token-systemer — MEDIUM

**Sted:** `config/design-tokens.ts` (401 linjer, hardkodet HEX/RGB) OG `components/ui/tokens.ts` (584 linjer, CSS custom props)

**Sårbarhet:** To uavhengige systemer som ikke er synkronisert. Endring i én reflekterer ikke den andre.

**Konsekvenser:**
- Visuell inkonsistens mellom sider
- "Drift" av tema over tid
- Nye utviklere vet ikke hvilket system de skal bruke
- Dobbelt vedlikeholdsarbeid

**Risikonivå:** 🟡 **Medium** — Påvirker UX-kvalitet, ikke sikkerhet.

---

### Punkt 7: Monster-filer (journey + onboarding) — MEDIUM

**Sted:** `lib/journey/engine.ts` (1061 linjer), `app/onboarding/OnboardingFlow.tsx` (~484 linjer + 13 step-komponenter)

**Sårbarhet:** `engine.ts` inneholder PHASE_CONFIGS, MILESTONES, resonance-calculation, warmth-calculation, silent-moments detection, day-texts (30 dager), first-message generator, og impulse-generator — alt i én fil.

**Konsekvenser:**
- Merge-konflikter sannsynlig ved parallelle commits
- Manglende test-dekning (for stor fil for unit-tests)
- Ny utvikler bruker uker på å forstå sammenhenger
- Feature-parallellutvikling blokkerer hverandre

**Risikonivå:** 🟡 **Medium** — Forhindrer langsiktig skalering.

---

### Punkt 8: Blueprint vs implementering (9→13 steg) — LAV/MEDIUM

**Sted:** `tosom-blueprint.md`, `app/onboarding/` (13 step-komponenter), `prisma/schema.prisma` (deepProfileStep enum)

**Sårbarhet:** Blueprint beskriver 9 onboarding-steg, men faktisk implementasjon har 13 steg. Prisma-enums kan ha inkonsistente navnelister mot frontend.

**Konsekvenser:**
- Nyutviklere får feil antakelser om flow
- Admin-support har feil dokumentasjon
- Progress-metrics kan vise feil tallssett

**Risikonivå:** 🟡 **Lav/Medium** — Forvirring, ikke funksjonelt brudd.

---

### Punkt 9: Duplicate VIPPS OAuth + Pusher+Supabase — MEDIUM

**Sted:** `app/api/auth/vipps/` OG `app/api/auth/oauth/vipps/` (to stier). `lib/pusher/` + `lib/chat/typingTracker.ts` (Pusher + Supabase).

**Sårbarhet:** To identiske OAuth-stier og to parallele realtidskanaler.

**Konsekvenser:**
- 301 redirect-lokker mellom stier mulig
- Dobbelt nettverkstrafikk per chat-side (Pusher + Supabase)
- Feilhåndtering divergerer over tid
- Økt infrastrukturkostnad

**Risikonivå:** 🟡 **Medium** — Redundans → økt kostnad og kompleksitet.

---

### Punkt 10: Playwright i dependencies — LAV

**Sted:** `package.json` (dependencies, ikke devDependencies)

**Sårbarhet:** `@playwright/test: ^1.62.0` under dependencies.

**Konsekvenser:**
- ~45MB inkludert i production build
- Native binaries blir deployed til Vercel
- Lengre CI/CD install-tid

**Risikonivå:** 🟢 **Lav** — Bare ressursøkonomisk ineffektivitet.

---

## 3. Konkrete filer som berøres per punkt

### Punkt 1: Admin-token JWT-migrering
| Fil | Handling |
|-----|----------|
| `middleware.ts` | Slett linje ~125 (`=== 'valid'`). Erstatt med `verifyAdminCookie(req)`. |
| `lib/auth/admin-jwt.ts` | Allerede implementert — skal brukes. (Eksporterer `signAdminToken()` og `verifyAdminCookie()`) |

### Punkt 2: Dev-login "alt-passord"
| Fil | Handling |
|-----|----------|
| `lib/auth/config.ts` | Fjern hele CredentialsProvider-blokken (linje 38-81). Flytt til separat modul. |
| `lib/auth/dev-login-provider.ts` | **Ny fil** — dynamic import av dev-provider, kun ved `NODE_ENV === 'development'`. |
| `app/api/dev-login/route.ts` | Legg til IP-whitelist sjekk (X-Forwarded-For). Fjern password-setting i DB. |

### Punkt 3: Profile JSON-validering
| Fil | Handling |
|-----|----------|
| `lib/validation/profile-schemas.ts` | **Ny fil** — Zod-schemas for lifeSituation, lifestyle, personality, communication, intimacy, futureVision, boundaries, emotionalNeeds. |
| `app/api/profile/setup/route.ts` (eller tilsvarende) | Legg Zod `parse()` før Prisma.create/update. |

### Punkt 4: Duplicate scoring-motorer
| Fil | Handling |
|-----|----------|
| `lib/matching/resonanceScore.ts` | **Kilde** — behold og utvid. |
| `lib/matching/scorer.ts` | Refaktor til å bruke resonanceScore internt, eller fjern. |
| `lib/matching/engine.ts` | Erstatt import `calculateTotalScore` → `calculateResonance`. Tilpass score-skala. |
| `/api/cron/matching/` (route-filer) | Bytt fra `findBestResonance` → `matchingEngine` med unified resonanceScore. |

### Punkt 5: NextAuth v5 beta
| Fil | Handling |
|-----|----------|
| `package.json` | `"next-auth": "^5.0.0-beta.25"` → `"5.0.0-beta.25"` (nøyaktig) eller stabil versjon. |
| `lib/auth/config.ts` | Test etter endring: callback-URI, session-strategy, provider syntax. |

### Punkt 6: To design-token-systemer
| Fil | Handling |
|-----|----------|
| `config/design-tokens.ts` | Behold som "source of truth" for HEX-verdier. |
| `components/ui/tokens.ts` | Erstatt dupliserte verdier med referanse til design-tokens.ts. Eksporter kun CSS custom properties. |

### Punkt 7: Monster-filer
| Fil (oppført) | Handling |
|---------------|----------|
| `lib/journey/engine.ts` (1061 linjer) → bryt ut til: | |
| ↳ `lib/journey/phases.ts` | PHASE_CONFIGS, THEME_RANGES, MILESTONES, getPhaseForDay, isPhotosAllowed |
| ↳ `lib/journey/resonanceCalculations.ts` | calculateResonance, createResonanceSnapshot, getPhaseResonanceBias |
| ↳ `lib/journey/warmthCalculator.ts` | calculateWarmScore, addWarmHistoryEntry, calculateWarmTrend, getWarmUI |
| ↳ `lib/journey/silenceDetection.ts` | SILENT_MOMENT_CONFIG, detectSilence, getRandomSilentMoment, getSilentMomentUI |
| ↳ `lib/journey/dayContent.ts` | dayData (30 dager), getDayConfig, getJourneyImpulse, generateFirstMessage |
| ↳ `lib/journey/engine.ts` (rest) | buildJourneyState, buildMessages — kun orkestrering (<150 linjer) |
| `app/onboarding/OnboardingFlow.tsx` | Flytt 13 step-komponenter til `app/onboarding/steps/Step1Profile.tsx`, etc. |

### Punkt 8: Blueprint vs implementering
| Fil | Handling |
|-----|----------|
| `tosom-blueprint.md` | Oppdater for å reflektere 13 steg (eller reduser til 9 ved merging). |
| `prisma/schema.prisma` (deepProfileStep enum) | Sørg at enum-navn stemmer med implementerte steg. |

### Punkt 9: Duplicate OAuth + realtime
| Fil | Handling |
|-----|----------|
| `app/api/auth/vipps/authorize/route.ts` | Slett eller legg 301 → `/api/auth/oauth/vipps/authorize`. |
| `lib/chat/typingTracker.ts` (Supabase) | Fjern Supabase realtime-subscription for typing. Bruk kun Pusher. |

### Punkt 10: Playwright i dependencies
| Fil | Handling |
|-----|----------|
| `package.json` | Flytt `"@playwright/test": "^1.62.0"` fra `dependencies` → `devDependencies`. |

---

## 4. Forslag til trygg arbeidsflyt per punkt

### Punkt 1: Admin-token JWT-migrering
```
1. Les eksisterende lib/auth/admin-jwt.ts (signAdminToken + verifyAdminCookie finnes ✅)
2. Lag NY api/admin/auth/login/route.ts som:
   - Aksepterer email + ADMIN_AUTH_SECRET fra miljøvariabel
   - Returnerer JWT-cookie med signAdminToken()
3. Oppdater middleware.ts:
   - Erstatt `=== 'valid'` → `verifyAdminCookie(req) !== null`
4. Test: manual curl mot /api/admin/auth/login med gyldige credentials
5. Test: middleware blockerer på /admin/ uten cookie
6. Deploy til staging først
7. Verifiser at eksisterende admin-brukere med NextAuth-session fortsatt har tilgang (ROLLE=ADMIN i JWT)
```

### Punkt 2: Dev-login fjerning fra hovedkonfig
```
1. Kopier CredentialsProvider-blokken fra config.ts → lib/auth/dev-login-provider.ts
2. I config.ts: dynamic import av dev-provider kun ved NODE_ENV === 'development'
3. I dev-login/route.ts: legg til IP-whitelist (kun localhost/10.x.x.x/172.16.x.x)
4. Fjern ensureDevUserInDb som setter passord-hash → bruk i stedet JWT-basert dev-session
5. Test: med DEV_LOGIN_ENABLED=true fra localhost → fungerer
6. Test: med DEV_LOGIN_ENABLED=true fra eksternt IP → blokkert
7. Verifiser at CredentialsProvider ikke finnes i production bundle (tree-shake)
```

### Punkt 3: Profile JSON-validering
```
1. Lag lib/validation/profile-schemas.ts med Zod-schema per felt:
   - required: true/false, max length 5000, ikke null/array for numeriske felt
2. For hvert av 7 JSON-felter: lifeSituation, personality, communication, intimacy, futureVision, boundaries, emotionalNeeds
3. I api/profile/setup/route.ts: før Prisma.create/update, kall Zod parse() på alle JSON-felter
4. Ved valideringsfeil: returner 400 med detaljert feilmelding (hvilket felt + forventet type)
5. Test: send gyldig payload → 200
6. Test: send null i lifeSituation → 400
7. Test: send array [1,2,3] i personality → 400
8. Test: send 6000-char string → 400 (max length breached)
```

### Punkt 4: Konsolider scoring-motorer
```
1. Velg resonanceScore.ts (9 dimensjoner) som EN kilde
2. Opprett lib/matching/unifiedScorer.ts med interface:
   - unifiedScore(userA, userB): UnifiedResult — score 0-100 + breakdown i alle 9 dim
3. I engine.ts: tilpass scoreToTier() for 0-100 skala (grenser: 85, 70, 55, 40)
4. I findBestResonance.ts: bytt fra calculateResonance → unifiedScore (ingen logikkendring)
5. Slett eller deprecated (@deprecated comment) gamle eksport-funksjoner
6. Lag unit-tests for hvert av 9 dimensjoner med kjente inputs → verifiser output
7. Compare: same pair scored via engine.ts vs findBestResonance.ts → identisk score
```

### Punkt 5: NextAuth beta-lås
```
1. Sjekk GitHub for stabil utgivelse: github.com/nextauthjs/next-auth/releases
2. Hvis stabil tilgjengelig: upgrade + kjør auth-testsuite manuelt
3. Hvis ikke: lås versjon "5.0.0-beta.25" (fjern caret ^) i package.json
4. Test alle 7 auth-fluss: magic link, vipps OAuth, phone verify, 2FA, session expiry, admin role, concurrent sessions
```

### Punkt 6: Unifiser design-tokens
```
1. Velg config/design-tokens.ts som "source of truth"
2. Oppdater components/ui/tokens.ts til å importere fra design-tokens.ts (ingen dupliserte verdier)
3. Søk etter hardkodete farger i komponenter: grep '#D4AF37', '#0B1520'
4. Erstatt med var(--ts-brand-gold), var(--ts-bg-primary), etc.
5. Visuell QA på alle sider (admin, chat, journey, onboarding, profile)
```

### Punkt 7: Refaktor monster-filer
```
JOURNEY ENGINE:
1. Lag lib/journey/README.md med modulstruktur-oversikt
2. Bryt ut funksjonsgrupper til egne moduler (phases, resonance, warmth, silence, dayContent)
3. Oppdater engine.ts: importer fra nye moduler → <150 linjer
4. Test: npm run build uten feil
5. Test: API-caller mot /api/journey/today → samme output som før refaktor

ONBOARDING FLOW:
1. Lag app/onboarding/steps/ mappe
2. Flytt 13 step-komponenter til steps/Step[N]Name.tsx
3. Oppdater OnboardingFlow.tsx imports
4. Test: onboarding flow via E2E — identisk resultat
```

### Punkt 8: Blueprint vs implementering
```
1. Detaljopptelling av alle 13 eksisterende steg i /app/onboarding/
2. Oppdater tosom-blueprint.md med nøyaktig steg-navn, beskrivelse og Prisma felt-mapping
3. Hvis deepProfileStep enum i schema.prisma ikke matcher: oppdater både schema OG blueprint
4. Dokumenter hvorfor 13 steg valgt over 9 (business decision)
```

### Punkt 9: Fjern duplicate OAuth + realtime
```
VIPPS OAUTH:
1. Sjekk hva /api/auth/vipps/authorize gjør vs /api/auth/oauth/vipps/authorize
2. Hvis identisk: slett den ene og legg 301 redirect
3. Test: gammel URI → 301 → ny URI → OAuth fullfører

REALTIME:
1. Identifiser hvilke komponenter som abonnerer på Pusher vs Supabase realtime
2. Flytt typing-status fra Supabase til kun Pusher
3. Test: typing-indikator vises via Pusher alene
```

### Punkt 10: Playwright til devDependencies
```
1. I package.json: flytt "@playwright/test" fra dependencies → devDependencies
2. Kjør npm install for å verifisere intakt avhengighetsgraf
3. Test: npm run build (Playwright IKKE i produksjonsbundle)
```

---

## 5. Avhengigheter mellom punktene (HVA MÅ GJØRES FØR HVAD)

```
┌─────────────────────────────────────────────────────┐
│                   KRITISK VEI                       │
│                                                     │
│  Punkt 2 (Fjern dev-login CredentialsProvider)     │
│       │                                             │
│       ▼                                             │
│  Punkt 1 (Admin JWT-migrering)                     │
│       │                                             │
│       ▼                                             │
│  Punkt 3 (Profile JSON-validering)                 │
└─────────────────────────────────────────────────────┘

  GRUNN: Punkt 2 må være ferdig før punkt 1 starter,
  fordi migrationen av admin-token krever at dev-login
  CredentialsProvider er fjernet (ellers kan en angriper
  eksperimentere med admin-auth mens dev-login er aktiv).

┌─────────────────────────────────────────────────────┐
│                PARALLEL VEI (uavhengig)             │
│                                                     │
│  Punkt 5 (NextAuth beta-lås)   Punkt 6 (Tokens)    │
│       │                           │                 │
│       ▼                           ▼                 │
│  [deploy-test]              [UI-visual QA]          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                ETTER PUNKT 3-6                      │
│                                                     │
│  Punkt 4 (Scoring-motorer)                         │
│       │                                             │
│       ▼                                             │
│  Punkt 7 (Monster-filer refaktor)                  │
│       │                                             │
│       ▼                                             │
│  Punkt 8 (Blueprint oppdatering)                   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                UHENGIG AV ALT                       │
│                                                     │
│  Punkt 9 (Duplicate OAuth/Realtime)   Punkt 10      │
│       │                           │                 │
│       ▼                           ▼                 │
│  [deploy-test]              [build-test]            │
└─────────────────────────────────────────────────────┘
```

---

## 6. Estimert tidsbruk per punkt

| # | Punkt | Est. Timer | Kompleksitet | Test-effort |
|---|-------|-----------|-------------|-------------|
| 1 | Admin-token JWT | **3-4h** | Medium | Lav — curl + manual test |
| 2 | Dev-login CredentialsProvider | **3-4h** | Medium | Medium — IP-test via VPN |
| 3 | Profile JSON-validering | **6-10h** | Høy (75 felter × 7 JSON-felter) | Høy — 20+ valideringscases |
| 4 | Konsolider scoring-motorer | **8-16h** | Høy (2 motorer → 1 unified) | Høy — compare same-pair scores |
| 5 | NextAuth beta-lås | **2-3h** | Lav (endre package.json + test) | Medium — 7 auth-fluss |
| 6 | Unifiser design-tokens | **4-8h** | Medium (grep+replace ~100 filer) | Medium — visuell QA per side |
| 7 | Refaktor monster-filer | **10-20h** | Høy (splitte 2 store filer + import-oppdatering) | Medium — E2E-test |
| 8 | Blueprint vs implementering | **2-3h** | Lav (dokumentasjon + enum-sync) | Lav — manual sjekk |
| 9 | Duplicate OAuth/Realtime | **4-6h** | Medium (slett duplikat, redirect, migration) | Medium — OAuth flow test |
| 10 | Playwright til devDeps | **<1h** | Trivial (flytt i package.json) | Lav — build-verifisering |

**Totalt estimert: 42-75 timer** (ca. 6-10 virkedager med én utvikler)

---

## 7. Hvilke punkter kan testes med E2E (Playwright)

| Punkt | Playwright-testbar? | Test-scenario |
|-------|---------------------|---------------|
| **1: Admin-token JWT** | ✅ JA | Naviger til /admin/ → forventes redirect til /admin/login. POST /api/admin/auth/login med gyldige credentials → forventer JWT-cookie med expiry < 24h. |
| **2: Dev-login** | ✅ JA | POST /api/dev-login med localhost IP → forventes 200. Simuler eksternt IP via header → forventes 403. |
| **3: Profile JSON-validering** | ✅ JA | POST /api/profile/setup/ med null lifeSituation → forventes 400. Med array → 400. Med 6000-char string → 400. |
| **4: Scoring-motorer** | ✅ JA (kritisk) | POST match for samme par via API og cron-trigger → sammenlign score-resultat. MÅ være identisk. |
| **5: NextAuth beta** | ✅ JA | Login med Magic Link → verifiser session-cookie format. Refresh → ny cookie. Logout → slettet cookie. |
| **7: Monster-filer refaktor** | ✅ JA | Onboarding flow gjennom alle 13 steg → fullfør profil → forvent match uten feil. Journey dag 1→2→3 → ingen errors. |
| **9: Duplicate OAuth** | ✅ JA | Naviger til gammel /api/auth/vipps/authorize → forventes 301 redirect til ny sti. Fullfør OAuth flow via ny sti. |
| **10: Playwright flytt** | ⚠️ PARTIELL | Build-verifisering: Playwright IKKE i produksjonsbundle. `npm list @playwright/test` check. |

---

## 8. Hvilke punkter krever manuell QA

| Punkt | Manuell QA nødvendig? | Hva skal testes manuelt |
|-------|----------------------|-------------------------|
| **1: Admin-token JWT** | ✅ JA | Manuell curl-test med utløpt token (eyJ... expired 1s ago). Test admin-bruker med NextAuth-session vs JWT-cookie. |
| **3: Profile JSON-validering** | ✅ JA | Manual testing av alle 7 JSON-felter med edge-cases: tomt objekt `{}`, nestede strukturer, emoji i tekst, Unicode-spesielle tegn. |
| **5: NextAuth beta** | ✅ JA | Manuell test av VIPPS OAuth flow (krever faktisk app-register). Magic Link e-post (ikke automatiserbar uten mail-server). 2FA QR-code scan. |
| **6: Design-tokens** | ✅ JA | **Må testes visuelt** på desktop + mobil. Sjekk at gull-farge er identisk på alle knapper, border-color på hover-states, glassmorphism-effekter. Per side: admin, chat, journey, onboarding, profile. |
| **7: Monster-filer refaktor** | ✅ JA | Manuell gjennomgang av eksport-struktur. Verifiser at alle import-stier er oppdatert. Sjekk at journeyAPI-objektet eksporterer samme funksjoner som før. |
| **9: Duplicate OAuth/Realtime** | ✅ JA | VIPPS OAuth krever faktisk Vipps-app og telefon. Pusher vs Supabase typing — må sjekkes i Network tab i devtools. |

---

## Oppsummering

Denne planen er en ren analyse og strategisk veiledning. **Ingen filer er endret.** For å iverksette:

1. Les hele planen
2. Velg start-punkt (anbefaling: Punkt 1 — admin-token JWT)
3. Følg arbeidsflyten per punkt
4. Test før deploy
5. Dokumentér resultat i denne filen

**Neste steg:** Bytt til Act mode for å iverksette punkter ett om gangen, begynne med kritisk sikkerhet (Punkt 1-3).

---

*Slutt på Sikkerhets- og Stabilitetsplan v1*