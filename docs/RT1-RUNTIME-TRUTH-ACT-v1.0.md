# RT1 — RUNTIME TRUTH ALIGNMENT ACT (v1.0)

**Dato:** 10.27.2026 · **Kjør av:** Cline (kontrollert ACT per Georges «kjør»)
**Grunnlag:** `docs/RUNTIME-DOCUMENTATION-TRUTH-PLAN-v1.0.md` (seksjoner A–R) + produktbeslutninger D1–D7.
**Status:** IMPLEMENTERT · **STOPPED FOR COMMIT** (per direktiv: STOPP før commit).

---

## 1. Produktbeslutninger (innarbeidet)

| # | Beslutning | Implementert |
|---|-----------|--------------|
| D1 | Tosom = en datingtjeneste bygget for ekte relasjoner | Ja — 5 sider (landing, om-oss ×2, hvorfor, slik-fungerer-det) + llms.txt |
| D2 | Canonical brand line: «Bygget for ekte relasjoner» | Ja — hero (LogoAnimated-subline) + footer beholdes; aria-labels i logo-komponentene |
| D3 | Canonical logo: to-sirkler-merket; header/dashboard følger; ingen redesign | Ja — UniversalMenu (global header) + ToSomLogo (header/dashboard-nav) |
| D4 | Completion BILATERAL (begge må velge «Vi fant hverandre») | Ja — schema + exit-route + UI + API (se §4) |
| D5 | PDF KUN ved mutual FOUND | Ja — export-pdf gate (se §6) |
| D6 | PDF: tekst fra samtalen; ingen bilder; ingen interne image-API-stier | Ja — `type: { not: 'image' }` i meldingsquery (se §7) |
| D7 | 349 beholdes som fremtidig plan; 249 utsatt etter beta; ingen prisendring | Ja — intakt (PRICING single-source, RT-10 guard) |

## 2. Pre-flight

- `main` = `origin/main` = `0df1c7fe2774ee92f94068b2bfbb344bc90b7597` ✓
- Production health: `GET /` = 200, `GET /vilkar` = 200 ✓
- Working tree: ren bortsett fra 2 untracked docs (`docs/IDENTITY-TRUST-PLAN-v1.0.md`, `docs/RUNTIME-DOCUMENTATION-TRUTH-PLAN-v1.0.md`) ✓
- `docs/IDENTITY-TRUST-PLAN-v1.0.md` ikke staged ✓

## 3. KRITISK: no_action faktisk runtime (før implementering)

Verifisert i koden (`app/api/cron/journey/route.ts` + `lib/journey/endJourney.ts`):

**Trigger:** `JourneyProgress.day >= 14` OG `endedAt != null` (settes ~24 t etter at
dag 14 ble nådd) OG `Match.status === 'active'` (ingen har handlet) →
`endJourney(matchId, 'no_action')`.

**Hva slettes (A–G):**

| Klass | no_action-opptelling |
|---|---|
| A. Journey data | SLETTES (JourneyProgress, JourneyMilestone, JourneyStateLog) |
| B. Chat/bilder | SLETTES (alle Message-rader + R2/lokale bildeobjekter) |
| C. Match | SLETTES (Match; MatchHistory opprettes med de to ID-ene) |
| D. User account | **BEGGE User-kontoene SLETTES PERMANENT** (User + Account + Session + MagicLink + TwoFactor + PhoneVerification + PasswordResetToken) |
| E. Profile/onboarding | SLETTES (Profile for begge) |
| F. Queue eligibility | BORT (journeyState nullstilles via sletting; MatchHistory + UserBlock overlever) |
| G. Free quota/order | **Order SLETTES** (begge) → Quota-telleren (atomisk claim) brennes — plassen gis ikke tilbake |

Mellomlagret: MatchHistory, Report, AuditLog, JourneyStat (anonym). Begge får
«reiseslutt-epost (dag 14)» før sletting.

**KONKLUSJON: no_action sletter hele User-kontoen → STOPP-kriteriet i ACT-brevet er
oppfylt.** Klassifisert **PRODUCT DECISION REQUIRED**: George skal beslutte
(a) om dagens full-kontosletting ved inaktivitet beholdes, og (b) hva som skjer med
en match der ÉN part har valgt (FOUND eller NEW) og partneren aldri gjør det —
se §4.4. **no_action-semantikk er uendret i denne ACT-en** (kun en defensiv guard
mot at part-valgte matcher rammes, som uansett ikke ville ha truffet queryen).

## 4. Bilateral completion (D4)

### 4.1 Datamodell (minste sikre, ingen shared boolean)

```prisma
enum JourneyDecision { PENDING  FOUND_EACH_OTHER  NEW_JOURNEY }

model Match {
  ...
  completionA        JourneyDecision @default(PENDING)
  completionADecidedAt DateTime?
  completionB        JourneyDecision @default(PENDING)
  completionBDecidedAt DateTime?
}
```

Migration: `prisma/migrations/20261027000000_bilateral_completion` (normal
Prisma-migrasjon, pålagt på dev- og test-DB; PROD pålegges ved neste deploy —
ingen DB-mutasjon mot prod i denne ACT-en).

### 4.2 `POST /api/journey/exit` (dag 14)

- Kun `found_each_other` / `ny_reise` / `new_journey` med `journey.day >= 14`
  går i bilateral-motoren. Tidlig avslutning (før dag 14) og `blocked` er uendret.
- Idempotent: allerede valgt → 409 «Du har allerede tatt stilling til reisen.»
- Valg skrives + partnerens valg leses i én transaksjon (row-lock seriariserer
  samtidige valg; nøyaktig én av to samtidige POST-er avgjør — ingen deadlock).

### 4.3 Deterministisk avgjørelsestabell

| Mitt valg | Partner (ved mitt valg) | Resultat |
|---|---|---|
| FOUND | PENDING | **WAITING** — reisen fortsetter, ingen sletting/avslutning |
| FOUND | FOUND | **MUTUAL** — `endJourney('found_each_other')`: status `ended`, grace 24 t (PDF), begge `COMPLETED`, e-post til begge |
| NEW | PENDING | **WAITING** — reisen fortsetter |
| NEW | FOUND | **NOT MUTUAL** — `endJourney('new_journey')`: innhold slettes, ingen PDF, begge til `IDLE`, profil beholdes, onboarding låst opp for NEW-valgeren, nøytral «reise avsluttet»-epost til FOUND-valgeren |
| NEW | NEW | **NOT MUTUAL** — samme som over, onboarding låst opp for begge |

Scenario-mapping fra ACT-brevet: A=FOUND/B=PENDING → WAITING FOR OTHER PERSON,
ingen PDF ✓ · A=FOUND/B=FOUND → MUTUAL, PDF ✓ · A=FOUND/B=NEW → NOT MUTUAL, ingen
PDF ✓ · A=NEW/B=FOUND/PENDING/NEW → ingen PDF ✓.

### 4.4 Timeout (uklarhet — PRODUCT DECISION REQUIRED)

Dagens trigger (ingen har handlet → ~24 t → no_action med kontosletting) er
uendret for fullstendig inaktive par. For **part-vælger-par** (én valgt, partner
PENDING) er det ingen auto-avslutning i denne ACT-en: matchen holder i WAITING
inntil partneren velger (cron-guard i §3). Kandidat-retninger for Georges
beslutning: (a) holde WAITING uendelig (dagens ACT-opptelling), (b) auto-avslutte
som not-mutual etter X timer, (c) andre. Ingenting slettes automatisk før beslutning.

## 5. Privacy of decisions

- API-ene (`/api/journey/check`, `/api/dashboard/overview`) eksponerer **kun
  brukerens eget valg** (`completion.decision` + `decidedAt`) og `mutualFound`
  (kun sann når begge har valgt FOUND — da er reisen avgjort uansett).
- Partnerens konkrete valg (FOUND vs NEW vs PENDING) eksponeres aldri: fra eget
  perspektiv er «partner PENDING» og «partner NEW_JOURNEY» uunterskelte
  («valget ditt er registrert, reisen avgjøres når begge har tatt stilling»).
- Ingen nytt meldingssystem: partene får kun de eksisterende e-postene
  (mutual: found-e-post; not-mutual: nøytral «reise avsluttet»-epost).

## 6. PDF-autorisasjon (D5)

`GET /api/journey/export-pdf` krever i rekkefølge:
1. `requireAuth` (autentisert deltaker),
2. konto ikke slettet/bannlyst (403),
3. match der brukeren er userA/userB (status `active`|`ended`),
4. **mutual FOUND** (`completionA === 'FOUND_EACH_OTHER' && completionB ===
   'FOUND_EACH_OTHER'`) — ellers 409 «PDF er tilgjengelig når begge har valgt
   «Vi fant hverandre»»,
5. grace/access-state: ved status `ended` må `expiresAt` fremdeles være
   fremtidig (ellers 410 — alt er slettet).

Én FOUND er ikke nok (RT-04 guard).

## 7. PDF-innhold (D6) — nøyaktig

- Meldingsquery: `where: { conversationId, deletedAt: null, type: { not: 'image' } }`
  → bilde-meldinger **skippes fullstendig**. Verken `<img>`, `/api/chat/image/`-
  stier, R2-URL-er, signed URL-er, image-ID-er eller skjult metadata kan nå
  PDF-en (content-feltet på image-rader inneholdt tidligere bare sti-strengen —
  nå aldri med).
- Med i PDF-en: `user`-tekst (forfatter + dato/tid), `system`-meldinger
  (senteret, kursiv — de forhåndsskrevne 💬-impulsene dere så i chatten;
  **BEHOLDT** og omtalt nøyaktig her — valgt bevisst: de er del av «teksten
  fra chatten» begge så), `continue_choice`-rader renderes som vanlige bobler
  (eksisterende atferd, uendret).
- Header: begge parters fornavn/visningsnavn (uendret — intentionell design).
- Note-boks i PDF-en sier i dag: «PDF-en inneholder teksten fra samtalen —
  bilder blir ikke med.»
- Arkitektur uendret (D8): on-demand, aldri persistert server-side,
  `Cache-Control: no-store`, kun deltaker. Ingen PDF-storage bygd.

## 8. UI

- **Chat (dag 14, `ChatContainer`):** tre tilstander — (1) PENDING: de to
  knappene (uendret), (2) valgt + mutual: «Dere har valgt «Vi fant hverandre»»
  + PDF-knapp, (3) valgt, ikke mutual: «Valget ditt er registrert…». Fetch er
  best-effort (`/api/journey/check`) — ved feil vises knappene (fallback).
- **/reisen/avslutning:** leser `journey.completion` fra
  `/api/dashboard/overview`: mutual → takkeside (PDF-knapp,
  kontoslettingsmulighet), valgt+venter → «Valget ditt er registrert»-side,
  PENDING → valg-kort med oppdatert bekreftelses-modal:
  - FOUND-modal: «Når begge har valgt «Vi fant hverandre», får dere 24 timer
    til å laste ned teksten fra samtalen som PDF — bilder blir ikke med.
    Deretter slettes alt permanent.»
  - NEW-modal: «Når begge har tatt stilling, avsluttes reisen, samtalen
    slettes og profilen din beholdes. Det kan ikke angres.»
  - Takkeside: «…last ned teksten fra samtalen som PDF i løpet av 24 timer
    (bilder blir ikke med). Deretter slettes alt automatisk.»
  - Den gamle «PDF-tilbud før sletting»-modalen er fjernet (PDF lever nå i
    grace-vinduet etter mutual — å tilby den før valg ville vært usant).
- **Kjøremeldinger** i exit-route rettet (stale «Begge kontoene er slettet»
  → faktisk grace/PDF-fakta).

## 9. Public copy (D9/D11–D20)

| Overflate | Endring |
|---|---|
| `public/llms.txt` | Full rewrite til current truth: 14-dagersreise, bilder dag 8, egne spørsmål (ingen PVQ-10/BFI-10/ERQ-6-claim), ingen 30-dager/dag-15, begrenset beta + invitasjon, gratis i dag, fremtidig plan 349 NOK (ingen aktiv betaling), ingen Vipps-identitetsclaim |
| FAQ «Hva skjer etter dag 14?» | Bilateral truth + PDF-fakta + «Velger ingen av dere noe innen 24 timer, slettes alt automatisk» (verifisert runtime) |
| FAQ «Hva koster Tosom?» | + «Tosom er foreløpig i en begrenset beta, og registrering skjer via invitasjon.» |
| Landing (CTA-blokk) | + «Tosom er foreløpig i en begrenset beta — registrering skjer via invitasjon.» |
| /login | + samme beta-notis under introduksjonsteksten |
| /metoder | «Spørsmålene vi bruker» + egen-spørsmåls-tekst (6 dimensjoner: personlighet, verdier, tilknytning, kommunikasjon, emosjonsregulering, livssituasjon; inspirert av etablert psykologi, ingen tester/kliniske skjemaer, svarene brukes i matchingen). «Nå er ærligheten» fjernet. Verifisert mot spørsmåls-arkitekturen |
| /motpol | «vitrinasjestykke» fjernet → «Profilen din ligger ikke ute i en katalog. Den brukes som utgangspunkt for matchingen og når dere blir kjent.» (visibility-truth verifisert: privat profil, match ser begrenset utvalg) |
| /tips | Nytt kort «Før dere møtes» (første date: enkelt, avtal lengde, offentlig sted, si fra til noen du stoler på) + /trygghet-lenke; «Gjør de daglige små oppgavene…» → «Gjør små oppgaver sammen…» |
| /reisen | D12-tekst: «Dere bestemmer tempoet… trenger ikke fullføre noe bestemt hver dag. Bruk det som passer når det passer.» (hvert utsagn verifisert mot runtime: fri chat ✓, selvvalgte spørsmål/oppgaver ✓, valgfritt daglig fokuskort ✓, ingen aktivitetskrav ✓, tidsstyrt progresjon ✓) |
| /slik-fungerer-det | «daglige små oppgaver» → «små oppgaver dere kan velge»; datingside → datingtjeneste |
| /priser (×2) | «daglige spørsmål … små oppgaver» → «daglige refleksjoner, samtaletema og enkle oppgaver dere kan velge» |
| Mood (D13) | Uendret — ingen offentlig omtale av mood eksisterer (privat/local-only, «bare deg, din farge»); ingen partner-synlig claim (RT-11 guard) |
| Legal (D10) | **UENDRET.** vilkar §16 + personvern §10 («begge må bekrefte») er nå sanne mot runtime. Lawyer-baseline holder: PENDING LAWYER REVIEW (13+11 åpne spørsmål) |

## 10. Logo (D17)

- Canonical = eksisterende to-sirkler-resonansmerket
  (`components/branding/LogoVariants.tsx`, `ResonanceMark`/`ResonanceLogo`) —
  samme komponent som hero + footer + login/samtykke.
- `components/layout/UniversalMenu.tsx` (den faktiske globale headeren,
  rendres via root layout på alle sider): wordmark →
  `<ResonanceMark size={40} glow />`, `aria-label="Tosom — Bygget for ekte
  relasjoner"` på lenken.
- `components/global/ToSomLogo.tsx` (brukt av GlobalHeader + `DashboardNavBar`):
  wordmark → `<ResonanceMark size={44} glow resonate />`, «Made in Norway»-
  tagline beholdes, aria-label oppdatert.
- Ingen redesign, ingen ny SVG, ingen ny logo-generering. Accessibility beholdt
  (aria-label på alle logo-lenker).
- Oppdagelse undervegs: PLAN-rapportens «GlobalHeader» er ikke live — den
  faktiske headeren er `UniversalMenu` (app/layout.tsx). Både komponenter
  oppdatert.

## 11. Pricing (D7)

Uendret. `config/legal.ts` = single source (349). `PAYMENTS_ENABLED`-kill-switch
intakt. 5 000 gratis per person (atomisk claim). «249» finnes fortsatt ingen
sted i aktiv copy (RT-10). 249 = **DEFERRED PRODUCT DECISION AFTER FREE BETA**.

## 12. DB JourneyDayContent-sjekk (read-only)

- **Prod:** UNKNOWN — ingen prod-DB-tilgang fra repo (prod env bor på Vercel).
- **Dev-DB (localhost:5432/tosom_dev):** `SELECT count(*) FROM "JourneyDayContent"`
  = **0 rader**. Runtime-konsekvens: `/api/journey/check` + `/api/journey/today`
  faller tilbake på fallback-innhold (phase-baserte spørsmål/oppgaver).
  Konsistent med D11 («ett valgfritt daglig fokus/refleksjonskort **der det
  faktisk finnes**») — ingen aktiv copy lover DB-innhold.
- **Ingen data-endringer utført** (read-only). Dersom prod mangler rader 1–14:
  P2-funn å vurdere (seed vs. acceptere fallback) — STOPP-kriteriet er
  overholdt (ingen dataendring forsøkt).

## 13. Endrede filer

**Nye:**
- `prisma/migrations/20261027000000_bilateral_completion/migration.sql`
- `__tests__/rt1-runtime-truth.test.ts` (RT-01…RT-12, 741 asserts)
- `docs/RT1-RUNTIME-TRUTH-ACT-v1.0.md` (dette)

**Endrede:**
- `prisma/schema.prisma` (JourneyDecision + 4 Match-felter)
- `app/api/journey/exit/route.ts` (bilateral-motor)
- `app/api/journey/export-pdf/route.ts` (mutual-gate, text-only, banned-gate)
- `app/api/cron/journey/route.ts` (defensiv no_action-guard)
- `app/api/journey/check/route.ts` (+completion)
- `app/api/dashboard/overview/route.ts` (+completion)
- `app/chat/components/ChatContainer.tsx` (dag-14-tilstander)
- `app/reisen/avslutning/page.tsx` (bilateral UI + copy)
- `components/layout/UniversalMenu.tsx` (logo)
- `components/global/ToSomLogo.tsx` (logo)
- `public/llms.txt` (rewrite)
- `app/metoder/page.tsx`, `app/motpol/page.tsx`, `app/tips/page.tsx`,
  `app/reisen/page.tsx`, `app/faq/page.tsx`, `app/login/page.tsx`,
  `app/(landing)/page.tsx`, `app/om-oss/page.tsx`, `app/hvorfor/page.tsx`,
  `app/slik-fungerer-det/page.tsx`, `app/priser/page.tsx` (copy)
- `docs/RUNTIME-DOCUMENTATION-TRUTH-PLAN-v1.0.md` (seksejon S: ACT result)

**Bevisst uendret:** `lib/journey/endJourney.ts` (semantikk dekket av
eksisterende utfall — ingen endring trengtes), legal-sidene (D10),
`config/legal.ts`, `config/journey.ts`, `docs/IDENTITY-TRUST-PLAN-v1.0.md`.

**Migrasjon pålagt på:** tosom_dev (5432) + tosom_test (5433) — begge lokale.
PROD: `prisma migrate deploy` ved neste (ikke-kjørte) deploy.

## 14. Verifikasjon

| Tjek | Resultat |
|---|---|
| RT-01…RT-12 (`rt1-runtime-truth.test.ts`) | 741/741 PASS |
| Targeted suites (completion/endJourney/PDF/chat/journey/questions/tasks/mood/Metoder/Motpol/FAQ/legal/free-beta/plain-copy/email/journey-end/grand-finale/photo-lock/beta-invite/health/integration) | 24/24 suites, 856 tests PASS |
| `npm run verify` (verify:lang + `tsc --noEmit` + full jest) | PASS — 85 suites, 2238 tests (1 skipped: e2e-exkludering) |
| `npm run lint` | 0 warnings/errors |
| `npm run build` | OK (alle sider, inkl. /reisen/avslutning, /tips) |
| Playwright (chat.spec, match.spec, matching-journey.spec; 120 tests) | **97 passed / 23 failed — alle 23 feil = `browserType.launch: Host system is missing dependencies` for Mobile Safari (WebKit)** (manglende system-liber for WebKit-build på denne hosten; pre-eksisterende environment-avhengighet, ikke RT1-kode). Alle øvrige prosjekter (Chromium desktop + mobile, Firefox) PASS — 0 assertsjon-feil |
| Preview (rendered HTML via dev-server) | Alle 14 påvirkede sider 200. Verifisert: datingtjeneste-copy (landing), beta-notis (landing/FAQ/login), to-sirkler-logo i renderet header (viewBox 22×22, aria-label), /metoder-ny tekst, /tips «Før dere møtes» + /trygghet-lenke, /motpol uten vitrinasjestykke, /reisen D12-tekst, /llms.txt-nytt innhold. Visuell desktop+mobile-inspeksjon: begrenset (ingen browser-verktøy i denne ACT-en); Playwright Chromium-prosjektene dekker chat/match-flatens layout |

## 15. Åpne punkt / blockers

1. **OPPLØST (27.10.2026, RT1 FINAL):** no_action = JOURNEY END ONLY
   (ingen User-sletting); 72-timers beslutningsvindu med deterministic
   timeout (PENDING+PENDING→NO_ACTION; FOUND+PENDING→NOT MUTUAL) — se
   seksjon 17–18 i dette dokumentet.
2. **Prod JourneyDayContent:** UNKNOWN fra repo; dev = 0 rader (fallback aktiv).
   Vurder seed av dager 1–14 eller godta fallback.
3. **Prod-migrasjon:** `20261027000000_bilateral_completion` må kjøres ved
   deploy (migrasjonsfil ligger i repo; intakt Prisma-workflow).
4. **Legal:** PENDING LAWYER REVIEW (uforandret; 13+11 åpne spørsmål).
5. **249:** utsatt etter beta (bevis: gjentaks-etterspørsel, «Start ny
   reise»-valg, prisoppfatning).

## 16. Statuslinjer

```
RT1 RUNTIME TRUTH ACT: COMPLETE
COMPLETION: BILATERAL / no_action = INVESTIGATE (PRODUCT DECISION REQUIRED)
PDF: MUTUAL-ONLY / TEXT-ONLY
JOURNEY CONTENT: TRUTH-ALIGNED
CANONICAL BRAND: BYGGET FOR EKTE RELASJONER
PRODUCT CATEGORY: DATINGTJENESTE
PRICE: 349 FUTURE PLAN / 249 DEFERRED
PRODUCT LOGIC CHANGED: COMPLETION ONLY (+ PDF-gate; no_action uendret)
REAL USERS INVITED: NO
COMMIT: NO
PUSH: NO
DEPLOY: NO
```

---

# RT1 FINAL — PRODUCT DECISION IMPLEMENTATION (27.10.2026)

George godkjente bilateral completion og øvrig RT1-arbeid, og tok den
utfersatte produktbeslutningen:

- **D8 — ACCOUNT != JOURNEY:** Journey-end sletter ALDRI User-kontoer.
  Manglende handling ved fullføring = reisen avsluttes uten gjensidig
  resultat — IKKE kontosletting.
- **D9 — DECISION WINDOW:** 72 timer fra dag 14 til fullføringsvalget
  (produkregel — IKKE forskningsbasert, presentert aldri som det).
  Sentralisert: `COMPLETION_DECISION_WINDOW_HOURS/MS` i `config/journey.ts`.

## 17. no_action — final semantikk

`endJourney('no_action')` = **reise lukkes uten gjensidig resultat.**
Destruktiv User-sletting er **fjernet fra hele journey-stien** (to steder:
endJourney no_action-greina + crons grace-cleanup — sistnevnte slettet
før også begge kontoer for mutual-found-par 24 t etter PDF-vinduet; begge
er nå reise-sletting kun).

| Data | no_action |
|---|---|
| JOURNEY (JourneyProgress/Milestones/StateLogs/Resonance) | **SLETTES** |
| CHAT (Conversation + Messages, soft) | **SLETTES** |
| IMAGES (R2-objekter via imageKey) | **SLETTES** (best-effort, logget) |
| MATCH | **SLETTES** |
| MATCH HISTORY | BEHOLDT (outcome 'no_action') |
| SAFETY RECORDS (Report/UserBlock/AuditLog) | BEHOLDT |
| USER ACCOUNT (User/Account/Sessions/tokens/2FA) | **BEHOLDT** |
| PROFILE | **BEHOLDT** |
| ONBOARDING | **BEHOLDT** (ingen reset — kun eksplisitt NEW_JOURNEY-velg resettes) |
| FREE ORDER/QUOTA | **BEHOLDT** (person-basert; ingen journey-basert recycling; Quota-teller uendret) |

Begge brukere resettes til `journeyState: IDLE` → kan starte ny reise
etter vanlige kvalifikasjonsregler. Nøytral e-post sendes begge
("reisen er slettet — kontoen din beholdes").

Eksplisitte destruktive fløyer er **uventet og uforsvakket**:
`/api/settings/delete-account` (GDPR), `lib/admin/deleteUser.ts`
(admin), blokkering/safety, aldersgrense-brudd. (RT-C12.)

## 18. 72-timers-vinduet — final semantikk

Anker: `journeyProgress.endedAt` (tidspunktet reisen fullførte dag 14).
Delte, deterministiske funksjoner i `lib/journey/completion.ts`
(rente — testet enhetsnivå; exit-route og cron importerer samme tabell):

- `resolveCompletionState(a, b)`: FOUND+FOUND→MUTUAL · NEW+bestemt→NOT_MUTUAL ·
  ellers WAITING. Ord-uavhengig (commutatitiv — race-deterministisk).
- `decisionWindowState(day14At, now, a, b)`: vinduet er utløpt ved
  `now − day14At ≥ 72 h` (boundary inkludert).

| Tilstand ved utløpt vindu (match fortsatt 'active') | Utfall |
|---|---|
| PENDING + PENDING | **NO_ACTION** — reise lukket, konto beholdes |
| FOUND + PENDING (eller motsatt) | **NOT MUTUAL / NO_ACTION-ekvivalent** — samme cleanup |
| (MUTUAL/NOT_MUTUAL kan ikke stå her — avgjort umiddelbart ved 2. valg) | — |

Exit-route håndhever vinduet også: valg etter utløpt vindu → **410**
nøytralt («Vinduet for fullføringsvalget har gått ut. Reisen er avsluttet.»).
Cron (timevis) lukker reiser når `cronOutcome === 'no_action'`.

## 19. Endrede filer (final delt)

Nye: `lib/journey/completion.ts`, `__tests__/rt1-final-decisions.test.ts`.
Endrede: `config/journey.ts`, `lib/journey/endJourney.ts`,
`app/api/cron/journey/route.ts`, `app/api/journey/exit/route.ts`,
`lib/email/index.ts`, `app/reisen/avslutning/page.tsx`,
`app/chat/components/ChatContainer.tsx`, `app/faq/page.tsx`,
`app/vilkar/page.tsx`, `app/personvern/page.tsx`,
`__tests__/integration/s9-deletion.test.ts` (rewrite: beholdte kontoer),
`__tests__/email-journey-end.test.ts`, `__tests__/rt1-runtime-truth.test.ts`
(RT-03 måler nå delt lib), `docs/LEGAL-REVIEW-PACKAGE-v1.0.md`,
`docs/LEGAL-PAGES-PRELAWYER-REVIEW-v1.0.md` (C-19).

## 20. Tests (RT-C01…RT-C18)

`__tests__/rt1-final-decisions.test.ts` (unit + route-mocks + statiske D8/D9
guards) + `__tests__/integration/s9-deletion.test.ts` (rewrite; ekte
endJourney mot test-DB: RT-C08/C09/C10/C11/C13) + eksisterende
`__tests__/integration/delete-account.test.ts` (RT-C12: eksplisitt GDPR-sletting
sletter fortsatt kontoen). Kart:

C01 check-ruten eksponerer kun eget valg (partnerens NEW lekket ikke) ·
C02 FOUND+FOUND→mutual · C03 FOUND+PENDING→waiting · C04 FOUND+PENDING→PDF 409 ·
C05 FOUND+FOUND→PDF 200 · C06 NEW+noe→not mutual/ingen PDF ·
C07 P+P før 72 t→waiting (ingen lukking; inkl. 71.98 h) ·
C08 P+P ved/etter 72 t→no_action (boundary inkludert) ·
C09 FOUND+PENDING etter 72 t→no_action (begge retninger) ·
C10 no_action sletter aldri User (integrasjon + statisk: ingen
user/account/profile/order-sletting i journey-stien) ·
C11 profile/onboarding beholdt + journeyState IDLE ·
C12 eksplisitt GDPR-sletting intakt (delete-account-ruten + integrasjon) ·
C13 gratisorden + Quota-teller uendret ·
C14 PDF-query `type: { not: 'image' }` + ingen image-stier i HTML ·
C15 PDF 409 uten mutual FOUND · C16 gjenvalg→409 idempotent ·
C17 3×3-matriks ord-uavhengig + write-then-read i én transaksjon ·
C18 blandede samtidige valg → samme avgjørelse uansett rekkefølge.

## 21. Legal/lawyer (D11)

- `/vilkar` og `/personvern`: «slettes begge kontoer» → «slettes samtalen,
  bildene og reisen permanent — kontoen deres beholdes» (faktisk samsvar
  kun — ingen nye juridiske konklusjoner. **Lawyer-flag:** den gamle
  klauselen var en avtalebetingelse om kontosletting som nå er fjernet;
  versjonsmarkør bør vurderes ved lawyer-review).
- `docs/LEGAL-REVIEW-PACKAGE-v1.0.md`: nytt produktfaktum-blokke
  «JOURNEY END vs ACCOUNT DELETION» (reise-inaktivitet sletter aldri
  konto; konto-sletting kun via eksplisitte GDPR/admin/blokkering/
  aldersgrense-fløyer) + retta retensjonspost i §6.
- `docs/LEGAL-PAGES-PRELAWYER-REVIEW-v1.0.md`: claim C-19 oppdatert til
  ny runtime-fakta.

## 22. Statuslinjer (OPPDATERT — erstatter §16)

```
RT1 FINAL: COMPLETE
COMPLETION: BILATERAL
DECISION WINDOW: 72 HOURS
NO_ACTION: JOURNEY END ONLY
AUTOMATIC ACCOUNT DELETION ON INACTIVITY: REMOVED
PDF: MUTUAL-ONLY / TEXT-ONLY
FREE QUOTA: PERSON-BASED / UNCHANGED
PRICE: 349 FUTURE / 249 DEFERRED
PRODUCT LOGIC: TRUTH-ALIGNED
REAL USERS INVITED: NO
COMMIT: NO
PUSH: NO
DEPLOY: NO
```
