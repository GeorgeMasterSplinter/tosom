# TOSOM — COOKIE / STORAGE / ANALYTICS TRUTH AUDIT v1.0

- **Dato:** 24.10.2026
- **Type:** PLAN/AUDIT ONLY (read-only). Ingen kode endret, ingen commit/push/deploy.
- **Production checkpoint:** `23284cc` (main = origin/main, clean tree), `/api/system/health` → 200 ok (15:51 UTC)
- **Metode:** Full kodegrep av repo + lesning av implementering + read-only GET-inspeksjon av `www.tosom.no` (headers, HTML, produksjonsbundles, endpoint-probe). **Ingen ekte browser/devtools** — localStorage/network er ikke visuelt inspisert live; deklarert der det gjelder.

## A. EXECUTIVE SUMMARY

Tosom er overraskende rent på sporing, men det er én teknologikonflikt og én usann cookie-sid:

1. **Aktive cookies i produksjon (3, alle strengt nødvendige):** Auth.js-sesjon (`__Secure-authjs.session-token`), CSRF-double-submit (`csrf_token`), admin-JWT (`admin_token`, kun `/admin`). Ingen cookies settes på noen offentlig rute (verifisert: 8 ruter, 0 `Set-Cookie`).
2. **Vercel Speed Insights er installert og rendret på alle sider — men deaktivert av egen CSP i produksjon** (`va.vercel-scripts.com` er ikke tillatt i `script-src`/`connect-src`). Komponentene ligger der, data sendes (med stor sannsynlighet) ikke. Konflikt mellom kode, CSP og personverncopy som må avgjøres bevisst.
3. **Sentry (10.70.0) er aktiv** i klient og server (DSN maskert; SDK + ingest-host verifisert i produksjonsbundles; PII-skrubbing + `sendDefaultPii:false` på plass). Juridisk: UNCERTAIN / LEGAL REVIEW REQUIRED (CNIL-precedent: feilmonitoring er sjelden «strengt nødvendig»).
4. **Vercel Web Analytics: IKKE installert.** Ingen GTM/Meta/Hotjar/Clarity/PostHog/Plausible/Umami/Fathom eller andre pixels — ikke i kode, bundle eller live HTML.
5. **Egen analytics er deaktivert i produksjon:** live-probe `/api/analytics/track` → `403 {"status":"analytics_disabled"}`. Plausible/Umami-kode i `AnalyticsProvider` er død (mangler env; uansett CSP-blokkert).
6. **Største avvik i /cookies:** «Vi har et minimalt, privat analyserverktøy som ikke deler data med noen» beskriver en ting som **ikke eksisterer aktivt**. Reell performance-telemetri (Speed Insights, tredjepart: Vercel) nevnes ikke. «opptil 1 år»-varigheten er også feil (sesjonscookie ~30 dager; ingen cookie har 1 års max-age).
7. **Største avvik i /personvern:** minst. Behandler-tabelen navngir Vercel, Neon, Cloudflare, Resend, R2, Sentry, Pusher, Vipps (fremtidig), og nevner eksplicit «IP-adresse og tekniske logger (inkl. Speed Insights)». Speed Insights er i realiteten CSP-blokkert (copy foran reality; disclosure er tillatt, men bør avspeile avgjørelsen).
8. **Anbefalt Minimal Safe Launch Configuration:** beholde de 3 nødvendige cookieene + Sentry; **fjerne `<SpeedInsights />` fra root layout før launch** (ell. porte bak samtykke — se §R/Q); la analytics være av; rette /cookies-copy til å samsvare med runtime; **ingen cookie-banner** (ingen valgfri aktiv storage/analytics som krever det).

## B. RUNTIME INVENTORY

| Lag | Teknologi | Rolle |
|---|---|---|
| Edge/CDN | **Cloudflare** (OSL PoP: `cf-ray: …-OSL`, `server: cloudflare`) foran Vercel | DNS/CDN/beskyttelse; injiserer `cloudflare-static/email-decode.min.js` (egen origin, tillatt av CSP `'self'`) |
| Hosting | **Vercel** (`x-vercel-id`, `x-vercel-cache`) | Next.js, functions, crons (matching+journey), Vercel logs |
| App | Next.js 15.5.27 App Router, React 18, Prisma 5.14 | — |
| DB | **Neon/Postgres** | Profil, matching, logger |
| Rate-limit | **Upstash Redis** | Server-side, ikke bruker-synlig |
| Realtime | **Pusher** (`pusher-js` 8.5, EU-cluster, WSS `*.pusher.com`; private kanaler via `/api/pusher/auth`) | Chat (kun når innlogget bruker åpner chat) |
| Epost | **Resend via SMTP** (`nodemailer`) | Varsler/broadcast (server) |
| Bilder | **Cloudflare R2** (presigned S3-URLer) | Chat-bilder |
| Feil | **Sentry** 10.70.0 (klient+server) | Error monitoring |
| Performance | **Vercel Speed Insights** 2.0.0 | Rendret, men CSP-blokkert (se §F) |
| Auth | **Auth.js v5** (JWT-strategi) | Sesjonscookies |
| Fremtidig | **Vipps** (bak `NEXT_PUBLIC_VIPPS_ENABLED`, 403/404 i prod), **Stripe** (CSP-tillatelser kun) | IKKE aktiv i runtime |

## C. COOKIE INVENTORY

Metode: kodelesning av alle `cookies.set`-kall + live `Set-Cookie`-headers på 8 representative GET-ruter (`/`, `/metoder`, `/motpol`, `/personvern`, `/cookies`, `/login`, `/trygghet`, `/onboarding`). **Obs: 0 `Set-Cookie`-linjer på alle.**

| # | NAVN | STATUS | SETTES AV | FORMÅL | FLAGG (prod) | VARIGHET | KLASSE |
|---|---|---|---|---|---|---|---|
| 1 | `__Secure-authjs.session-token` | CODE-POSSIBLE (settes ved login) | Auth.js v5 (`lib/auth/config.ts`) | Innlogging/sesjon (JWT: role, sub, createdAt) | httpOnly, **Secure**, SameSite=Lax, path=/ | ~30 dager (Auth.js default) | STRICTLY NECESSARY — CLEAR |
| 2 | `csrf_token` | CODE-POSSIBLE (settes i nettleseren ved første `csrfFetch`) | **Klient** (`lib/api/csrfClient.ts` → `document.cookie`) | CSRF double-submit (header `X-CSRF-Token` må matche cookie) | SameSite=Lax, path=/, max-age 24 t, **IKKE Secure, IKKE httpOnly** (server-hjelp `setCsrfCookie` med Secure+httpOnly+strict finnes men kalles fra ingen rute) | 24 t | SECURITY — CLEAR; **Secure-flagg-inkonsistens å fikse i ACT** |
| 3 | `admin_token` | CODE-POSSIBLE (kun `POST /api/admin/auth`) | `app/api/admin/auth/route.ts` | Admin-sesjon (HS256 JWT, issuer `tosom-admin`) | httpOnly, **Secure**, SameSite=Lax, path=/ | 8 timer | SECURITY (intern) — CLEAR |
| 4 | `tosom_session` | DØD I PROD (route 404; dev/test-only) | `app/api/auth/phone/verify/route.ts` | Fremtidig phone-auth | httpOnly, `secure:false`, Lax, 24 t | 24 t | N/A (ikke aktiv) |

Ikke observert: Cloudflare `__cf_bm`/bot-cookies, Vercel preview-cookies, Pusher-cookies. `cookie`-npm-pakken er ikke importert. **Ingen cookie har 1 års max-age** (relevant for §L). Server-side CSRF-verifisering krever dessuten env `ENABLE_CSRF_PROTECTION=true` (verdi i Vercel er ikke synlig fra repo — USIKKERHET).

## D. BROWSER-STORAGE INVENTORY

| KEY | TYPE | FIL | S KRIVES | FORMÅL | DATA | CONSENT GATE | KLASSE |
|---|---|---|---|---|---|---|---|
| `tosom_onboarding_completed` | localStorage | `lib/app/navigationState.ts`, `components/app/AppShell.tsx` | ved fullført onboarding | Navigasjon/flagg | boolean | Nei | FUNCTIONAL (brukerens egen tilstand) |
| `tosom_onboarding_draft` | sessionStorage | `lib/onboarding-draft.ts`, `app/onboarding/OnboardingFlow.tsx` | kontinuerlig under onboarding | Utkast til svar (svir også server-side utkast via `/api/onboarding/draft`) | svar-JSON | Nei | FUNCTIONAL/nødvendig for eksplicit forespurt funksjon (egen utkast) |
| `tosom_mood` | localStorage | `app/chat/context/ChatContext.tsx` | ved mood-valg | Chat-mood | enum | Nei | FUNCTIONAL (valgfri funksjon) |
| `tosom-memory` | localStorage | `app/dashboard/core/MemoryEngine.ts` | ved fremdrift | Reise-fremdrift/weekly summary/question history (lokal kopi) | fremskritt-JSON | Nei | FUNCTIONAL (valgfri) |
| `tosom_demo` | localStorage | `lib/demoMode.ts` | ved demo-modus | Demo-flagg | boolean | Nei | FUNCTIONAL (valgfri) |
| `tosom_install_prompt_dismissed` | localStorage | `components/pwa/InstallPrompt.tsx` | ved lukking av PWA-prompt | Husk lukking | "1" | Nei | FUNCTIONAL (UI-preferanse) |
| `tosom-personalization` | localStorage | `components/ui/personalization.tsx` | ved endring | theme/motion/density/cardStyle | UI-pref-JSON | Nei | FUNCTIONAL (valgfri preferanse) |

- **Ingen IndexedDB, ingen service worker, ingen Cache Storage, ingen device-fingerprinting.** («fingerprint» i `ChatContext.tsx` er et in-memory dedup-streng, ikke identifikasjon.)
- PWA = `manifest.json` + InstallPrompt kun (ingen SW) → ingen ekstra storage.
- Ingen av nøklene lagrer epost/navn/tokens (lokal UI-/driftstilstand). Ingen konsentgate finnes for noen av dem.

## E. VERCEL WEB ANALYTICS AUDIT

| Spørsmål | Svar | Bevis |
|---|---|---|
| Installed? | **NEI** | Ikke i `package.json`, ikke i `package-lock.json` (`grep node_modules/@vercel/analytics` = 0), ingen import i app/kode |
| Rendered? | NEI | Ingen `<Analytics />` i root layout eller providers |
| Aktiv i produksjon? | NEI | Ingen script/endepunkt i live HTML eller bundles |
| Custom events / identifiers? | N/A | — |
| Klassifisering | **ABSENT/INACTIVE** | — |

Ingen handling nødvendig. (Den selvlagde `AnalyticsProvider`-en som omtaler Plausible/Umami er død kode — se §I.)

## F. VERCEL SPEED INSIGHTS AUDIT

| Spørsmål | Svar | Bevis |
|---|---|---|
| Package | `@vercel/speed-insights` **2.0.0** (lockfile) | `package.json` |
| Load method | `<SpeedInsights />` fra `@vercel/speed-insights/next` i **root layout** (`app/layout.tsx:129`) — rendres på **alle sider, alle brukere, uavhengig av innlogging, INGEN consent-gate** | `app/layout.tsx` |
| Script | Komponent injecter ved runtime eksternt script: `https://va.vercel-scripts.com/v1/speed-insights/script.js` (prod) | `node_modules/@vercel/speed-insights/dist/react/index.js` |
| Data endpoint | Eksternt script (endpoint inne i Vercels script; dokumentert: Web Vitals + tekniske datapunkter til Vercel) | pakke + Vercel docs |
| **CSP i produksjon (live-verifisert)** | `script-src 'self' 'unsafe-inline' *.stripe.com stripe.com` og `connect-src 'self' api.stripe.com auth.vipps.no vipps.no *.pusher.com *.pubnub.com wss://… *.ingest.sentry.io *.sentry.io` — **verken `va.vercel-scripts.com` eller Vercel-endepunkter er tillatt** → script lastes IKKE, beacons ville blokkert | live CSP-header på `www.tosom.no/` + `next.config.js` |
| **Status** | **INSTALLED + RENDERED, men EFFECTIVELY INACTIVE i produksjon (CSP-blokkert).** NOT VERIFIED READ-ONLY i ekte browser — CSP-analysen følger standard CSP-semantikk (eksternt `src`-script krever opphav-treff) | live HTML (ingen eksterne Vercel script-tagger) + kode |
| Cookies | Ingen (per Vercel-design; ingen `Set-Cookie` observert) | vendor docs + live |
| Route exposure | Hvis aktivert: route/URL, nettverkstype, browser, enhetstype, OS, **land**, Web Vital, tidspunkt | Vercel docs (leverandørdokumentert) |
| Anonymitet (vendor) | Designet uten å knytte datapunkt til individuell besøkende/IP; ingen økt-rekonstruksjon | Vercel docs — **avgjør ikke norsk samtykkeplikt alene (§19)** |
| Offentlig copy | /personvern nevner «IP-adresse og tekniske logger (inkl. Speed Insights)» i behandler-tabellen | live /personvern |
| Usikkerhet | (1) CSP-blokkering ikke browser-verifisert; (2) om Vercel-server-side logs (x-vercel-id m.m.) er «Speed Insights» vs Vercel-platformslogs | — |
| Klassifisering | PERFORMANCE/ANALYTICS (teknisk) — **LEGAL REVIEW REQUIRED hvis den skal aktiveres**; i dag: inaktiv | — |

**Konflikt som må avgjøres:** kode sier «aktiv», CSP sier «av», personvern sier «brukes». Én bevisst avgjørelse (se §Q/R).

## G. WEB VITALS AUDIT

- **Ingen egen/custom Web Vitals-kode:** ingen `web-vitals`-pakke, ingen `PerformanceObserver`, `reportWebVitals`/`useReportWebVitals` eller `navigator.sendBeacon` i egen kode (app/lib/components/scripts).
- `LCP`-treff i `scripts/load/basicLoadTest.ts` er et lastetestsdkript, ikke produksjonstelemetri.
- Konsekvens: Core Web Vitals samles i produksjon **kun** via (a) Speed Insights — som er CSP-blokkert (se §F), og (b) Sentry tracing (server, `tracesSampleRate: 0.1`, feil-sampled — ikke RUM-CWV).
- **Faktisk tilstand: ingen klient-CWV-data nå i produksjon.**

## H. ERROR-MONITORING AUDIT (Sentry)

| Punkt | Funn | Bevis |
|---|---|---|
| Aktiv i prod | **Ja — klient + server** | SDK i produksjonsbundles: debug-id bootstrap (`_sentryDebugIds`) på landing, fullt SDK med `ingest.sentry.io`-host i onboarding-chunks, `tracesSampleRate:.1` i core-chunks; DSN **tilstede (maskert)** |
| Server-init | `instrumentation.ts`: `Sentry.init` (kun `NODE_ENV=production`), `tracesSampleRate: 0.1`, `sendDefaultPii: false`, `beforeSend: scrubPiiEvent`; **helter alle events hvis ingen DSN** | `instrumentation.ts`, `lib/observability/pii.ts` |
| PII-skrubbing | Én felles modul: fjerner forbudte nøkler (profile/deepProfile/content/email/phone/…)+ regex-redigering av epost/telefon i extra/contexts/request/breadcrumbs | `lib/observability/pii.ts` |
| Klient-rander | `SentryErrorBoundary` (root layout), `global-error.tsx`, error.tsx i chat/settings/faq/dashboard/onboarding/profile/matching/admin | grep 18 filer |
| Data som kan følge med | JS-feil + stack, breadcrumbs (rute/URL, timing), server: request-context (scrubbed), tracing 10 %. **Ingen cookies settes av Sentry. Ingen user-ID/epost.** **IP:** Sentry tilknytter klient-IP ved inntak (server-side) — `sendDefaultPii:false` fjerner IKKE dette | SDK-atferd (dokumentert) + kode |
| Konsentgate | Ingen — lastes alltid (driftsfunksjon) | `app/layout.tsx`, bundles |
| Alerting | `lib/observability/alert.ts` → Slack/Discord, epost, Sentry-fallback (server-side operasjon) | `lib/observability/alert.ts` |
| Retensjon | Sentry-org-innstilling — ikke verifisert read-only | UNKNOWN |
| Offentlig copy | /personvern: Sentry i behandler-tabellen; «Personopplysninger fjernes automatisk fra tekniske feilmeldinger» samsvarer med scrubbing (best effort) | live /personvern |
| Klassifisering | ERROR MONITORING / SECURITY-DRIFT. Samtykke: **UNCERTAIN — LEGAL REVIEW REQUIRED** (CNIL-praksis: feiltracking er sjelden «strictly necessary»; ingen norsk spesifikk praksis. Forsvarlighetstrekk på plass; vurder IP-strip i org-innstilling/`beforeSend`) | — |

## I. PRODUKT-/SERVERANALYTIKK (skilles fra nettlesersporing)

| Funn | SERVER/CLIENT | PERSON-LEVEL? | FORMÅL | STATUS I PROD | PRIVACY-COPY |
|---|---|---|---|---|---|
| `/api/analytics/track` (GET+POST) | Server | Ja (userId, IP, UA, referrer, url, properties) | Produkt-events (pageview, onboarding_complete, match_*, chat_open, purchase…) | **DEAKTIV**: live-probe → `403 analytics_disabled`. Mottar kun innloggede + rate-limit; `logEvent` = **console.log kun** (ingen DB-persistens) | Ikke nevnt i /cookies; dekes generelt i /personvern |
| `AnalyticsProvider` (Plausible/Umami/stub) | Client | — | Utsendt third-party analytics | **DØD**: env-flagg ikke satt; scripts ville også vært CSP-blokkert | — |
| SystemLog (IP, tekniske logger) | Server | Aggregated/operasjonell | Drift + sikkerhet (180 dager ifølge G-09) | Aktiv | /personvern: «IP-adresse og tekniske logger» |
| Rate-limit (Upstash/`pgCheck`) | Server | Aggregated | Sikkerhet | Aktiv (env-gated) | — |
| Matching/journey crons, audit-log, K-2 konsent i DB | Server | Person-level internt | Tjenestedrift + GDPR art.9-samtykke (PRODUTFUNKSJON, ikke storage-consent) | Aktiv | /personvern §4–5, /samtykke |

**Konklusjon:** Serverbasert driftsdata er tjenestedrift (avtale/berettiget interesse), IKKE cookie-sporing — men den hører under personvern. `P2-4` (analytics leser PII) gjelder KUN hvis flagget slås på: strip name/email først.

## J. TREDJEPARTSMATRISE (faktisk runtime)

| Leverandør | ROLLE | CLIENT/SERVER | DATA | COOKIES? | PUBLISERT? | AKTIV? |
|---|---|---|---|---|---|---|
| **Vercel** | Hosting, functions, crons, logs; (Speed Insights script blokkert) | Både | Request-metadata, funksjonslogs; CWV hvis aktivert | Ingen observert | Ja (personvern) | **Ja** (plattform); Speed Insights: **inaktiv (CSP)** |
| **Cloudflare** | CDN/WAF foran Vercel; email-decode script; R2 for bilder | Client (script) + server | IP/request via CDN; bilder | Ingen observert | Ja (personvern) | **Ja** |
| **Sentry** | Error monitoring + tracing | Client + server | Feil, breadcrumbs, ruter, IP (ved inntak); scrubbed PII | Nei | Ja (personvern) | **Ja** |
| **Pusher** | Realtime chat (WSS, EU) | Både | Chat-meldinger (tjenestekjernen), kanaler | Nei | Ja (personvern) | **Ja** (i chat) |
| **Neon/Postgres** | DB | Server | Alt personvern-relevant | Nei | Ja (personvern) | **Ja** |
| **Upstash** | Rate-limit | Server | Rate-limit-tellere | Nei | **NEI** i personvern (mangelfull disclosure) | **Ja** (server) |
| **Resend** | Epost (SMTP) | Server | Epostadresser, metadata | Nei | Ja (personvern) | **Ja** (server) |
| **Vipps** | Fremtidig auth/betaling | — | — | — | Ja (beta-avklaring) | **NEI** (403/404) |
| **Stripe** | Fremtidig betaling | — | — | — | Nei (CSP kun) | **NEI** (CSP-tillatelser kun) |
| **PubNub** | — | — | — | — | Nei | **DØD** (CSP-referanse uten dependency) |
| Plausible/Umami/Fathom/PostHog/GTM/Meta/Hotjar/Clarity/LogRocket/FullStory/Mixpanel/Amplitude | — | — | — | — | — | **IKKE TILSTEDE** (kun død kode i `AnalyticsProvider`) |

Overføringer: Vercel/Sentry/Cloudflare = USA → dekket av personvernerklæringens SCC-setning (LEGAL REVIEW REQUIRED: bekreft DPA/SCC per behandler — «TODO før publisering: bekreft lokasjon for hver databehandler i §7» står fortsatt som kommentar i siden).

## K. PRODUKSJONSOBSERVATION (read-only, GET kun)

| Rute | HTTP | Set-Cookie | Eksterne scripts | Notat |
|---|---|---|---|---|
| `/` | 200 | 0 | Kun `_next/*` + `cloudflare-static/email-decode.min.js` (self-origin) | Sentry bootstrap + debug-id chunks lastes |
| `/metoder` `/motpol` `/personvern` `/cookies` `/login` `/trygghet` `/onboarding` | 200 | 0 hver | som over | — |
| `/api/system/health` | 200 | 0 | — | `{"status":"ok"}` |
| `/api/analytics/track?event=pageview` | **403** | — | — | `{"status":"analytics_disabled"}` → analytics-flagg AV i prod |

- Live CSP-header verifisert (full tekst i §F). Ingen iframes, ingen pixels, ingen beacons i HTML. **Ingen consent-UI i noen HTML.**
- **Begrensning:** ingen ekte browser — localStorage-innhold og faktiske network-beacons er IKKE visuelt inspisert. Set-Cookie for login-flow (POST) er ikke observert (krever write/auth; deklarert som CODE-POSSIBLE).
- Personvern-live bekrefter at navnene Vercel, Neon, Pusher, Cloudflare, Resend, R2, Sentry, Speed Insights, Vipps finnes på siden.

## L. /cookies CLAIM AUDIT (live copy)

| # | EXACT CLAIM (live) | ACTUAL RUNTIME EVIDENCE | STATUS |
|---|---|---|---|
| L1 | «Tosom bruker bare det nødvendige av cookies. … deler aldri data med tredjeparts-tracking.» | 3 cookies, alle strengt nødvendige (sant for cookies). MEN: Sentry (tredjepart, aktiv) mottar feildata inkl. rute+IP; Cloudflare (tredjepart CDN) mottar requests. «tracking» er ikke presis for error monitoring, men absolutt-setningen er misvisende | **PARTLY TRUE** |
| L2 | «Vi deler aldri informasjonen din med annonsører, sporingstjenester eller tredjeparter.» | Ingen annonsører/storingstjenester — sant. «Tredjeparter» absolutt — usant (Sentry/Cloudflare/Vercel mottar data; de er behandlere, ikke markedsføringsdeling) | **TOO VAGUE** |
| L3 | «Disse er nødvendige … De lagrer session-token og autentisering. Du kan ikke slå av disse.» | Stemmer med Auth.js-sesjonscookie | **TRUE** |
| L4 | «Vi bruker ingen analytics-cookies som sporer deg personlig.» | Ingen cookies i det hele tatt brukes til analytics | **TRUE** |
| L5 | «Vi har et minimalt, privat analyserverktøy som ikke deler data med noen.» | **Ingen aktivt analyserverktøy finnes.** `/api/analytics/track` er 403 (disabled); Plausible/Umami er døde; Speed Insights (tredjepart Vercel) er rendret men CSP-blokkert og nevnes ikke | **FALSE / MISSING INFORMATION — største avvik** |
| L6 | «Session-cookies blir slettet når du lukker nettleseren. Permanente cookies kan bli lagret i opptil 1 år.» | Sesjonscookie er PERSISTENT (~30 dager, ikke session-scoped); ingen cookie har 1 års max-age; CSRF=24 t, admin=8 t | **FALSE/OUTDATED** |
| L7 | «Du kan kontrollere cookies gjennom innstillingene i nettleseren din.» | Generisk; sant men uten konkret info om hvilke cookies/varighet; localStorage/sessionStorage, Sentry, Vercel, Cloudflare og avvikling nevnes ikke | **TOO VAGUE / MISSING INFORMATION** |

## M. /personvern CLAIM AUDIT (fokus cookie/analytics/telemetri)

| # | EXACT CLAIM (live) | EVIDENCE | STATUS |
|---|---|---|---|
| M1 | Behandler-tabellen: Vercel, Neon, Cloudflare, Resend, R2, Sentry, Pusher (+Vipps fremtidig) | Alle til stede i runtime; **Upstash mangler**; «Speed Insights» nevnt under «IP-adresse og tekniske logger» | **PARTLY TRUE** (mangler Upstash; Speed Insights nevnt selv om den er CSP-blokkert — disclosure tillatt, men skal avspeile avgjørelsen) |
| M2 | «Personopplysninger fjernes automatisk fra tekniske feilmeldinger» | PII-skrubbing (`scrubPiiEvent`) + `sendDefaultPii:false` — best effort (regex), ikke full garanti | **PARTLY TRUE** |
| M3 | «Per nettleserøkt (sessionStorage) … Server-utkastet slettes når profilen lagres.» | Stemmer med `tosom_onboarding_draft` + `/api/onboarding/draft` | **TRUE** |
| M4 | «Vi bruker et minimum av informasjonskapsler, og ingen til reklame eller sporing på tvers av nettsteder.» | Stemmer (3 nødvendige cookies; ingen cross-site tracking) | **TRUE** (tynn, men korrekt) |
| M5 | «Vi tilstreber at data lagres innenfor EU eller EØS … standard personvernbestemmelser / tilstrekkelighetsbeslutning» | Vercel/Sentry/Cloudflare = USA; DPA/SCC ikke verifisert read-only | **LEGAL REVIEW NEEDED** (TODO-kommentar i koden bekrefter uferdighet) |
| M6 | Logger-retensjon: «Logger inntil 90 dager»; «Inntil 3 år, i anonymisert form»; «5 år bokføringsloven» | G-09/checklist: SystemLog IP=180 dager — «180» finnes IKKE i personvernteksten | **MISSING INFORMATION** (180-dagers IP-logging ikke eksplisitt) |
| M7 | Feilmonitoring som behandlingskategori | «Tekniske feilmeldinger»-raden dekker det; Sentrys IP-enrichment nevnes ikke | **PARTLY TRUE** (ufullstendig) |

## N. CONSENT/LEGAL KLASIFISERING (Datatilsynet-veileder som utgangspunkt)

| Teknologi | TYPE | SAMTYKKE? | KLASSE |
|---|---|---|---|
| `__Secure-authjs.session-token` | Sesjon/innlogging | Nei — strengt nødvendig | **CLEAR** |
| `csrf_token` | Security (CSRF) | Nei — strengt nødvendig | **CLEAR** |
| `admin_token` | Sesjon (intern admin) | Nei — strengt nødvendig | **CLEAR** |
| `tosom_onboarding_draft` (sessionStorage) | Egen utkast i forespurt funksjon | Nei (nødvendig for den eksplicit forespurte tjenesten) | **LIKELY → CLEAR** |
| Sentry (klient+server) | Error monitoring; ingen cookies; feil+rute+IP; PII-scrubbed | Spørsmålstegn: CNIL-praksis tilsier at feiltracking sjelden faller inn under strengt-nødvendig-unntaket; GDPR-grunnlag (berettiget interesse) kan likevel være forsvarlig uten samtykke siden ingen «cookie» settes — men ekomlovens teknologinøytrale regler + IP krever vurdering | **UNCERTAIN — LEGAL REVIEW REQUIRED** |
| Speed Insights | Performance/analytics (tredjepart) | I dag: **ingen processing (CSP-blokkert)** → ingenting å samtykke til. **Hvis aktivert:** vendor sier ikke-personlig, men rute+land+tekniske felter + norsk streng praksis → | **UNCERTAIN — LEGAL REVIEW REQUIRED** (hvis aktivert) |
| localStorage-preferanser (`tosom-personalization`, `tosom_mood`, `tosom_demo`, `tosom-memory`, install-prompt) | Valgfri funksjonal lagring | Strengt tatt ikke dekket av strengt-nødvendig-unntaket → samtykke; praksis: lav risiko, ingen identifiserbar data | **UNCERTAIN — LEGAL REVIEW REQUIRED** (lav prioritet) |
| Pusher (chat) | Nødvendig for eksplicit forespurt funksjon (chat) | Nei | **CLEAR** |
| Cloudflare CDN + email-decode script | Infrastruktur/CDN; ingen cookies observert | Nei (høyst sannsynlig; teknisk tjenesteyting) | **CLEAR/LOW** |
| Vercel Web Analytics | Absent | — | **N/A** |

**Viktig (per §19):** At Vercel «bruker ingen cookies» avgjør IKKE norsk samtykkeplikt alene.
**Viktig (per §20):** Siden det i dag **ikke finnes noen valgfri aktiv client-analytics som sender data ut av huset**, er korrekt løsning i dag **presis informasjon — ikke banner**.

## O. GAP ANALYSIS

| # | GAP | SVIRTHET | AKT |
|---|---|---|---|
| O-1 | Speed Insights: kode (aktiv) vs CSP (av) vs personvern (brukes) — trippelkonflikt | **HØY** (launch-blokkerende avgjørelse, ikke kode) | §Q/R |
| O-2 | /cookies L5 «minimalt, privat analyserverktøy» er usant | **HØY** (offentlig misinformasjon) | §Q (copy) |
| O-3 | /cookies L6 varighet («1 år», session-cookie) er feil | **MEDIUM** | §Q (copy) |
| O-4 | `csrf_token` settes klient-side uten `Secure` (og ikke httpOnly); server-hjelp med riktige flagg kalles aldri; aktivisering avhenger av env `ENABLE_CSRF_PROTECTION` (verdi ukjent fra repo) | **MEDIUM** (sikkerhetsinkonsistens) | §Q (valgfri hardening) |
| O-5 | Upstash ikke nevnt i personvern-behandlerliste | **MEDIUM** (disclosure) | §Q (copy) |
| O-6 | 180-dagers IP-logging (SystemLog/G-09) ikke eksplisitt i personvern | **MEDIUM** | §Q (copy) |
| O-7 | Sentry IP-enrichment ikke avklart/stripet; retensjon ukjent | **MEDIUM** (LEGAL REVIEW) | §P |
| O-8 | DPA/SCC per behandlere ikke bekreftet (TODO i personvern-kode) | **MEDIUM** (LEGAL REVIEW) | juridisk |
| O-9 | `AnalyticsProvider` + Plausible/Umami + døde CSP-referanser (pubnub) = død kode som forvirrer fremtidige audit | **LOW** | §Q (rydding, valgfri) |
| O-10 | `/api/analytics/track` P2-4 (PII i session) — latent så lenge flagg er av | **LOW** (aktivt: 403) | §Q (før aktivering) |

## P. TEKNOLOGI-FOR-TEKNOLOGI ANBEFALING

| Teknologi | Alternativer vurdert | **ANBEFALING** | Begrunnelse (PRIVACY / LEGAL / PRODUCT / KOST / UX / DATA / DRIFT) |
|---|---|---|---|
| **Speed Insights** | A alltid på · B consent-portet · C fjern · D annen løsning (self-hosted web-vitals → egen API) | **C (fjern) før launch** — D som oppfølging hvis CWV-data viser seg nødvendig | I dag samler den IKKE noe (CSP-blokkert) → fjerning koster ingen data. A/B krever CSP-endring + samtykkeusikkerhet + banner. D gir faktisk CWV-data + gjør /cookies-L5-lik påstand sann — men er ny implementering (post-launch). Enkel, null-data-tap, null-ny risiko |
| **Vercel Web Analytics** | — | **Ingen handling** (absent) | — |
| **Sentry** | A beholde · B consent · C fjern | **A (beholde alltid på)** + LEGAL REVIEW + vurder IP-strip | Feilmonitoring er driftsnødvendig (sikkerhet, feilfelle før/etter launch); PII-skrubbing + `sendDefaultPii:false` på plass; konsentporting av error monitoring er uvanlig og skader drift; juridisk grunnlag (berettiget interesse) trolig forsvarlig — få bekreftet |
| **Auth/CSRF/admin cookies** | — | **Beholde** (strengt nødvendig) + fikse `Secure`-flagg i `csrfClient.ts` | Sikkerhet |
| **`/api/analytics/track` + AnalyticsProvider** | A beholde av · B fjern død kode | **Beholde deaktivert** (403) + P2-4-strip FØR eventuell aktivering; fjerning av Plausible/Umami-dødkode valgfri | Null risiko i dag; hold døren åpen for server-side produkt-events (avtale/interesse, ikke cookie) |
| **localStorage-preferanser** | — | **Beholde** (funksjonell, lokal, ikke-identifiserbar) | Lav risiko; samtykke-UX for UI-farge er desproporsjonal (LEGAL REVIEW avgjør) |
| **Upstash/Cloudflare/Resend/Neon/Pusher** | — | **Beholde** + oppdater personvern-liste | Behørig disclosure |

## Q. MINIMAL SAFE LAUNCH CONFIGURATION (anbefalt)

1. **Behold:** `__Secure-authjs.session-token`, `csrf_token`, `admin_token` (alle strengt nødvendig).
2. **Fjern `<SpeedInsights />`** fra `app/layout.tsx` (og importen) — avklarer O-1; personvern-raden om Speed Insights justeres til å reflektere avgjørelsen (eller beholdes som «tekniske logger»-referanse ved avgjørelse D).
3. **Sentry:** behold (PII-skrubbing på plass). Få LEGAL REVIEW av grunnlag + vurder IP-strip i Sentry-org.
4. **Analytics:** hold `NEXT_PUBLIC_ANALYTICS_ENABLED` usatt (403-beholdes).
5. **Rett /cookies-copy:** fjern L5 («privat analyserverktøy») og L6 («1 år»); legg inn faktisk cookie-liste (3 stk med formål/varighet), kort om localStorage/sessionStorage (utkast + preferanser), og at Sentry/Cloudflare/Vercel brukes som behandlere (med peker til /personvern). Ingen påstander om teknologi som ikke kjører.
6. **Rett /personvern:** legg til Upstash; gjør 180-dagers IP-logging eksplisitt; (juridisk) bekreft DPA/SCC-raden.
7. **Valgfri hardening (ACT):** `csrfClient.ts` → legg `; secure` på cookie-set i produksjon; fjern `*.pubnub.com` fra CSP (død tillatelse); vurder å kalles server-side `setCsrfCookie` eller dokumentere at klient-set er designet.
8. **IKKE:** ingen cookie-banner, ingen CMP, ingen ny analytics, ingen pixels.

## R. BESLUTNINGER OG CONSENT-KRAV

### R1. Speed Insights (egen beslutning, §22)

| Kriterium | Vurdering |
|---|---|
| Faktisk datainnsamling i dag | **Ingen** (CSP-blokkert) |
| Anonymitet (vendor) | Ingen cookies; datapunkter designet ikke knyttet til person/IP; ingen økt-rekonstruksjon — men rute + **land** (fra IP) + tekniske felter lagres hos Vercel |
| Norsk samtykkeusikkerhet | **Høy** ved aktivering (ekomloven er teknologinøytral; vendor-tiltak avgjør ikke alene) |
| Tosoms behov før launch | Lav-moderat: CWV er nyttig, men Sentry-tracing (server) + Vercel-platformsmetrikk dekker det meste akutt; ingen brukerveiledning avhenger av det |
| CWV kan måles på annen måte | Ja: (D) self-hosted `web-vitals` → egen server-ende (aggregert, EU, egen retensjon) eller Vercel-dashboard etter samtykkeavgjørelse |
| Offentlig copy | Fjernes: personvern-rad «(inkl. Speed Insights)» + eventuelle /cookies-referanser |

**Beslutning (anbefalt): C — FJERN `<SpeedInsights />` før launch.**
- PRIVACY: null tredjeparts-performance-innsamling, null samtykke-overveielser.
- LEGAL UNCERTAINTY: null (ingen processing).
- PRODUCT VALUE: mister CWV i Vercel-dashboard (som i dag ikke mottar data likevel).
- IMPLEMENTATION COST: 2 linjer.
- UX: ingen endring.
- DATA LOSS: ingen (inget samles i dag).
- MAINTENANCE: færre avhengigheter + CSP konsistens.
- **Follow-up (post-launch, valgfri):** D — self-hosted Web Vitals mot egen server-ende (aggregert) — dette er også det som ville gjort /cookies-påstanden om «minimalt, privat analyserverktøy» sann.

Alternativ B (consent-porting) er forsvarlig MEN: krever CSP-endring, consent-UI, gating-tester og LEGAL REVIEW likevel — strengt mer komplekst uten datavinning før avgjørelsen er tatt.

### R2. Vercel Web Analytics (egen beslutning, §23)

**Ikke installert, ikke rendret, ikke aktiv. Ingen beslutning nødvendig.** Hvis det senere ønskes: behandle som ny teknologi (samme spor som Speed Insights: samtykkespørsmål, copy, CSP).

### R3. Hvis samtykke likevel blir nødvendig (fremtidig aktivering av valgfri analytics)

Kravspesifikasjon (ingen design/implisering her):
- Knapper: **«Godta valgfrie»** og **«Avvis valgfrie»** — like store/tilgjengelige, ingen forhåndsvalg.
- Informasjon FØR valg: formålsnivå (performance-måling), hvem (Vercel), varighet, hvordan endre.
- Optional scripts lastes IKKE før godkjent (CSP/DNS-level verifiserbar).
- Endre/tilbake trekke like enkelt (f.eks. lenke i footer → samme modaal), ingen cookie-wall.
- Keyboard/skjermleser, mobil-tilpasset, `role="dialog"`, fokus-håndtering.
- Status dokumenterbar (f.eks. `tosom_consent`-cookie med formål+tidstempel+versjon — se R4).

### R4. Samtykkelagringsparadoks (§26)

- **Nødvendig:** selve valget må lagres for å respektere det (avvis må huskes!). Én liten cookie (`tosom_consent`, path=/, maxAge ~6 mnd, SameSite=Lax) med formål+tidsstempel+policy-versjon. Lagring av AVVISNING er like nødvendig som lagring av godkjennelse.
- **IKKE nødvendig:** identifiserende samtykkelogg (user-ID-kobling, historikk, «audit-trail» i DB) uten dokumentert behov — skaper unødvendig tracking/personvern-overflat.
- Valget er ikke personopplysning i seg selv med mindre koblet til identitet; hold det device-basert og kortlevet.

## S. TESTPLAN FOR SENERE ACT (CA-01–CA-15)

| ID | Test | Metode |
|---|---|---|
| CA-01 | Inventar over aktive cookies/storage stemmer med runtime | Ekte browser (devtools): sammenlign dokumenterte cookies/nøkler mot observert; gjenkjør §K-skriptet |
| CA-02 | Nødvendige cookies fungerer uten optional consent | Login → API-kall → logout, med alle valgfrie things av |
| CA-03 | Optional analytics laster ikke før tillatelse (dersom consent kreves) | Devtools Network: ingen `va.vercel-scripts.com`/analytics-endepunkter før godkjenning |
| CA-04 | Avvis blokkerer optional scripts | Velg «Avvis valgfrie» → refresh → verifiser ingen optional requests; verifiser at avvisning er persistert |
| CA-05 | Godta aktiverer kun valgte formål | Velg delvalg → kun tilhørende endpoints dukker opp |
| CA-06 | Tilbaketrekking stopper videre optional innsamling | Godta → endre til avvis → ny sideinnlasting → ingen optional requests |
| CA-07 | Avvis og godta er like tilgjengelige | Keyboard-test: begge knapper nåbar, samme visuelle vekt, ingen ekstra steg for avvis |
| CA-08 | Ingen pre-checked options | Inspeksjon av consent-UI (DOM) |
| CA-09 | Cookie-copy samsvarer med faktisk runtime | Gjenkjør §L-tabellen mot ny copy; alle OBSERVED-items nevnt, ingen døde teknologier |
| CA-10 | Personverncopy samsvarer med faktisk runtime | Gjenkjør §M-tabellen (behandler-liste vs `package.json`+runtime) |
| CA-11 | Ingen ukjente tredjepartspixels | Network-inspeksjon på 5 representative ruter; whitelist-motsetning (alle eksterne requests er forklart) |
| CA-12 | Auth/login fungerer uten valgfrie cookies | Ny profil (ingen cookies) → register/login → onboarding → API 200 |
| CA-13 | Analytics errors påvirker ikke produktet | Blokker analytics-endepunkter (devtools) → produkt-flow feilfritt |
| CA-14 | Do-Not-Track håndteres kun hvis eksplisitt besluttet | DNT=1 → oppførsel er dokumentert avgjørelse (i dag: DNT ignoreres — dokumenter som bevisst valg) |
| CA-15 | Production network-smoke bekrefter forventede endpoints | Read-only: kun forventede eksterne opphav (Sentry ved feil, Pusher i chat, R2 for bilder); ingen overraskelser |

## T. KORTRAPPORT (17 PUNKTER) + FILER PÅVIRKET I SENERE ACT

1. **Aktive cookies:** `__Secure-authjs.session-token` (sesjon, ~30 d), `csrf_token` (CSRF, 24 t), `admin_token` (admin, 8 t) — alle strengt nødvendig. Ingen andre.
2. **Aktiv browser storage:** 6 localStorage-nøkler + 1 sessionStorage-nøkkel (alle `tosom_*`, lokal UI-/driftstilstand, ingen PII). Ingen IndexedDB/SW.
3. **Aktiv Web Analytics:** **NEI** (ikke installert).
4. **Aktiv Speed Insights:** **installert + rendret, men CSP-blokkert i prod → effektivt INAKTIV** (ikke browser-verifisert).
5. **Aktiv error monitoring:** **Ja — Sentry 10.70.0 (klient+server)**, PII-skrubbing, `sendDefaultPii:false`, IP ved inntak.
6. **Aktive tredjepartsscripts:** Cloudflare email-decode (self-origin) + Sentry SDK (eget bundle, sender til Sentry) + Pusher (i chat) + R2 (bilder) + CDN/WAF (Cloudflare). Ingen pixels/analytics/embeds.
7. **Om samtykke finnes:** **NEI** (ingen cookie-consent). Kun GDPR-art.9/termssamtykke (produkt, i DB).
8. **Om optional tracking skjer før samtykke:** **NEI** — ingen optional tracking er aktiv i det hele tatt.
9. **Største avvik i /cookies:** L5 «Vi har et minimalt, privat analyserverktøy som ikke deler data med noen» — **usant** (ingen aktivt verktøy; Speed Insights er den reelle performance-telemetrien og er ikke nevnt).
10. **Største avvik i /personvern:** mangler **Upstash** i behandlerlisten + 180-dagers IP-logging ikke eksplisitt (M1/M6). Ellers god.
11. **Anbefalt Minimal Safe Launch Configuration:** se §Q (3 cookies + Sentry beholder; Speed Insights fjernes; analytics av; /cookies + /personvern-copy rettes; ingen banner).
12. **Om banner anbefales:** **NEI** (ingen valgfri aktiv teknologi som krever det i dag).
13. **Speed Insights:** **fjernes før launch** (C); post-launch-vurdering av D (self-hosted) eller B (consent-portet).
14. **Web Analytics:** N/A (absent) — intet å gjøre.
15. **Juridiske usikkerheter:** se §U.
16. **Anbefalt neste ACT:** «C1-ACT: Speed Insights removal + cookie/privacy copy alignment + csrf Secure-flag» (små, lav risiko; filer under).
17. **git status:** ren bortsett fra ny dokumentfil `docs/COOKIE-ANALYTICS-TRUTH-AUDIT-v1.0.md` (IKKE committet).

**Filer sannsynligvis påvirket i senere ACT:**
- `app/layout.tsx` — fjern/gate `<SpeedInsights />`
- `app/cookies/page.tsx` — copy-justering (L1–L7)
- `app/personvern/page.tsx` — Upstash, 180 dagers IP, Speed Insights-rad, DPA-bekreftelse
- `next.config.js` — fjern død `*.pubnub.com`-tillatelse (valgfri)
- `lib/api/csrfClient.ts` — legg `secure` på cookie-set (valgfri hardening)
- `components/analytics/AnalyticsProvider.tsx` — fjern/hold død Plausible/Umami-kode (valgfri)
- `app/api/analytics/track/route.ts` — P2-4 PII-strip FØR eventuell aktivering
- `docs/LanseringsCheckList.md` — P2-2/P2-4 status ETTER godkjent ACT (ikke før)

## U. REMAINING LEGAL UNCERTAINTIES

1. **Sentry:** er feilmonitoring (uten cookies, med IP) dekket av strengt-nødvendig-unntaket, eller kreves samtykke/annet grunnlag i norsk praksis? → **LEGAL REVIEW REQUIRED** (CNIL tilsier nei til unntaket; GDPR-grunnlag kan likevel bære det).
2. **Speed Insights hvis aktivert:** er rute+land+tekniske datapunkter (uten cookies) samtykkespliktig under ekomloven? → **LEGAL REVIEW REQUIRED**.
3. **localStorage-preferanser:** valgfri funksjonal lagring — samtykke eller berettiget interesse? (Lav risiko.) → **LEGAL REVIEW REQUIRED** (lav prioritet).
4. **DPA/SCC** for Vercel/Sentry/Cloudflare/Neon/Upstash/Resend/Pusher ikke verifisert (TODO i personvern-kode). → juridisk.
5. **Sentry IP-strip + retensjon** ikke verifisert read-only (krever Sentry-dashboard).
6. **`ENABLE_CSRF_PROTECTION`/`ENABLE_RATE_LIMITING` prod-verdier** ikke synlige fra repo (Vercel env) — verifiser i dashboard.

## V. CHECKLIST-KOBBLING (§31) + BEGRENSNINGER

Denne auditen gjelder **P2-2 / checklist-punkt 6** («Vercel speed insights — verifisere innvirkning») og **P2-4** («Analytics leser PII») i `docs/LanseringsCheckList.md`. **Status endres IKKE** før anbefalingen i §Q/R er godkjent og ACT utført.

**Begrensninger (ærlighet):**
- Ingen ekte browser: localStorage-innhold og faktiske network-beacons er **ikke** visuelt inspisert; CSP-blokkering av Speed Insights er analysert (standard CSP-semantikk), ikke observert.
- Set-Cookie for login-flow (POST/auth) ikke observert (krever write) — deklarert CODE-POSSIBLE.
- Vercel/Sentry/Cloudflare-retensjon og DPA-er ikke verifisert read-only.
- DSN/tokens/cookie-verdier er **maskert** i hele rapporten.

---

**COOKIE / ANALYTICS AUDIT: COMPLETE**
**APPLICATION CODE CHANGED: NO**
**CONSENT IMPLEMENTED: NO**
**COMMIT: NO**
**PUSH: NO**
**DEPLOY: NO**

## W. ACT C1 RESULT (24.10.2026)

**Type:** Kontrollert ACT (utført). PLAN C1 godkjent av George. STOPP før commit — ingen commit/push/deploy.
**Checkpoint:** `23284cc` (main = origin/main) · prod `/api/system/health` → 200.

### W.1 Hva ble gjort
- **Speed Insights fjernet** — `<SpeedInsights />` + importen borte fra `app/layout.tsx`; `@vercel/speed-insights` fjernet fra `package.json` og lockfile (38 slettelinjer) og fra `node_modules`. 0 aktive referanser i kode.
- **PubNub CSP fjernet** — død `*.pubnub.com`-tillatelse fjernet fra `next.config.js` (0 packages / imports / runtime-refs).
- **CSRF Secure-flagg** — `lib/api/csrfClient.ts` setter nå `; secure` på `csrf_token` kun når `NODE_ENV === 'production'` **og** `window.location.protocol === 'https:'` (lokal HTTP-development og preview påvirkes ikke). Server-side `setCsrfCookie` hadde allerede `secure: production`.
- **/cookies rettet** — presist hovedbudskap, faktisk cookie-inventar (3 nødvendige cookies med navn/formål/varighet), lokal nettleserlagring, ingen analyse/markedsføringscookies, ingen banner, fremtidig valg. Fjernet «privat analyserverktøy» og «opptil 1 år».
- **/personvern rettet** — Vercel-raden uten «(inkl. Speed Insights)»; Sentry-raden → «Feil- og driftsmonitorering».
- **Guard-test** — ny `__tests__/privacy-analytics-guard.test.ts` (CA-01–15).
- **Checklist** — P2-2 FIXED, P2-4 LATENT, TC-16 FIXED + status-tell oppdatert.

### W.2 Final status per teknologi
| Teknologi | Final status |
|---|---|
| Vercel Speed Insights | **REMOVED** — 0 komponent, 0 dependency, 0 lock, 0 node_modules, 0 kode-refs. 0 ACTIVE RUNTIME. |
| Vercel Web Analytics | **NOT USED** — ikke installert. |
| Marketing pixels (gtag/GA/GTM/Meta/Hotjar/Clarity/…) | **IKKE TILSTEDE** — 0 treff i kode. |
| Cookie-banner / CMP | **IKKE IMPLEMENTERT** — bevisst produktvalg: ingen valgfri aktiv storage/analytics i dag. |
| Sentry 10.70.0 | **ACTIVE** — feil- og driftsmonitorering (IKKE analytics). PII-skrubbing + `sendDefaultPii:false` på plass. |
| Upstash Redis | **IKKE AKTIV I PROD** — `UPSTASH_*` ikke satt i noen env; rate-limit → Postgres, cache → in-memory. Oppføres derfor ikke i /personvern. |
| IP / SystemLog | 180-dagers retensjon **IKKE verifisert i kode/config** (SystemLog har ingen IP-kolonne, ingen retensjonscron) → **publiseres ikke**. Eksisterende «Inntil 90 dager» (tekniske logger) er pre-eksisterende og flagges til G-09. |
| CSRF `csrf_token` | Secure i produksjon (env + protocol-sensitiv); SameSite=Lax, 24 t. |
| PubNub CSP | **REMOVED** (død tillatelse). |

### W.3 Aktive cookies / browser storage (final inventar)
Cookies (alle strengt nødvendig, CODE-VERIFIED):
- `__Secure-authjs.session-token` — innlogging/sesjon (Auth.js v5), httpOnly+Secure+Lax, ~30 dager.
- `csrf_token` — CSRF double-submit (klient), Lax, 24 t, Secure i prod.
- `admin_token` — admin-sesjon (HS256), httpOnly+Secure+Lax, 8 t, kun `/admin`.

Browser storage (NECESSARY/FUNCTIONAL, ikke cookies):
- localStorage: `tosom_onboarding_completed`, `tosom_mood`, `tosom-memory`, `tosom_demo`, `tosom_install_prompt_dismissed`, `tosom-personalization`.
- sessionStorage: `tosom_onboarding_draft`.
Ingen IndexedDB, ingen service worker. Ingen PII i browser storage.

### W.4 CA-01–CA-15 (testdekning)
CA-01 SpeedInsights import/render = 0 · CA-02 `@vercel/speed-insights` dep = 0 · CA-03 `@vercel/analytics` = absent · CA-04 ingen marketing pixels · CA-05 /cookies beskriver aktive cookies/storage · CA-06 «privat analyserverktøy» = 0 · CA-07 «1 år» = 0 · CA-08 /personvern Upstash truth-aligned (ikke aktiv → ikke oppført) · CA-09 «180 dager» ikke publisert · CA-10 Sentry = feil-/driftsmonitorering · CA-11 CSRF Secure i prod · CA-12 auth/cookie-tester grønne (eksisterende suiter) · CA-13 ingen banner/CMP · CA-14 /cookies + /personvern indexable og bygger · CA-15 guard fanger reintroduksjon.
Kjør: `npx jest privacy-analytics-guard --ci --silent` + full gate (`npm run verify` / `lint` / `build`).

### W.5 Gjenstående usikkerheter / follow-ups (IKKE løst i denne ACT-en)
1. **Sentry — LEGAL REVIEW:** behandlingsgrunnlag, IP-håndtering og retensjon (CNIL-praksis; GDPR berettiget interesse kan bære det). Foreløpig IKKE grunn til cookie-banner.
2. **DPA/SCC per behandlere** (O-8) — juridisk, ikke verifisert read-only.
3. **180-dagers IP/SystemLog-retensjon** — verifiser mot prod (G-09) før den publiseres; SystemLog-modellen har ingen IP-kolonne i dag.
4. **`/api/analytics/track` PII-strip (P2-4)** — må gjøres FØR eventuell aktivering av analytics; latent i dag (403).
5. **Upstash** — hvis `UPSTASH_*` settes i Vercel, retillegg Upstash i /personvern og oppdater CA-08.

---

**COOKIE/ANALYTICS TRUTH ALIGNMENT: COMPLETE**
**SPEED INSIGHTS: REMOVED**
**WEB ANALYTICS: NOT USED**
**COOKIE BANNER: NOT IMPLEMENTED**
**SENTRY: ACTIVE**
**COMMIT: NO**
**PUSH: NO**
**DEPLOY: NO**

- Klassifisering (ekomloven, teknologinøytralt): utkast = tjenesten brukeren selv ber om (CLEAR/LIKELY uten samtykke); preferanser/mood/demo = valgfri lagring → **LEGAL REVIEW REQUIRED** (lav risiko; i praksis sjelden gjenstand for kontroll, men strengt tatt ikke dekket av strengt-nødvendig-unntaket).