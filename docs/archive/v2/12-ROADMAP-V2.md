# ToSom Roadmap v2 — Implementeringsplan

**Versjon:** 2.0 · **Dato:** 11. august 2026
**Status:** Godkjent av George
**Formål:** Full roadmap med faser, prioritering, avhengigheter og ACT-instruks for Qwen 3.6 27B

---

## 1. Samlet oversikt — Alle faser

| Fase | Navn | Varighet | Dokumenter | Avhengigheter |
|------|-----------------------|----------|------------|---------------|
| 0 | Forberedelse | 1-2 dager | — | Ingen |
| 1 | UI-system konsolidering | 3-5 dager | 03, 05, 06 | Fase 0 |
| 2 | Side-polering (bruker) | 5-7 dager | 04, 09 | Fase 1 |
| 3 | Journey + Matching finjustering | 3-4 dager | 07, 08 | Ingen (parallel med 2) |
| 4 | Admin v2 — Design | 5-7 dager | 01, 05, 06 | Fase 1 |
| 5 | Admin v2 — Funksjoner | 7-10 dager | 02, 07, 08 | Fase 4 |
| 6 | Deploy + Monitorering | 3-4 dager | 11 | Ingen (kan kjøre parallel) |
| 7 | Testing + QA | 3-5 dager | Alle | Alle faser |

**Totalt estimat:** 4-6 uker med én agent i ACT-mode.

---

## 2. Fase 0 — Forberedelse (1-2 dager)

### Oppgaver
- [ ] Sørg for at `docs/v2/` er tilgjengelig for Qwen-agent
- [ ] Verifiser at alle 13 v2-dokumenter er lesbare
- [ ] Kjør `npm install` og verifiser at prosjektet bygger lokalt
- [ ] Kjør eksisterende testsuite (`npx playwright test`) — dokumenter eventuelle feil

### Leveranser
- ✅ Green build + test-resultater logget

---

## 3. Fase 1 — UI-system konsolidering (3-5 dager)

**Referanse:** Dokument 03 (UI-system), Dokument 05 (Komponentbibliotek), Dokument 06 (Layout)

### Steg 1.1: CSS Custom Properties (dag 1)
- [ ] Legg til alle `--ts-*` tokens i `app/globals.css`
- [ ] Merger med eksisterende tokens fra `themePresets.ts`
- [ ] Verifiser at farger er identisk med nåværende utseende

### Steg 1.2: Oppdater components/ui/tokens.ts (dag 1-2)
- [ ] Les alle tokens fra CSS-vars
- [ ] Eksporter TS-interface med type-safety
- [ ] Legg til JSDoc som markerer som enkelt sannhetskilde

### Steg 1.3: Migrer komponenter (dag 2-4)
Prioritering:
1. ToSomButton, ToSomCard, ToSomInput (brukt av alt)
2. Glass.tsx → merge inn i ToSomCard
3. Onboarding-komponenter (10+ filer)
4. Dashboard/Chat/Profile komponenter

Per komponent:
- [ ] Erstatt `import { colors } from 'config/design-tokens'` med tokens.ts
- [ ] Erstatt hardcoded farger med token-referanser
- [ ] Test i browser

### Steg 1.4: Opprett nye basis-komponenter (dag 4-5)
- [ ] `ToSomModal.tsx`
- [ ] `ToSomTabs.tsx`
- [ ] `ToSomBadge.tsx`
- [ ] `ToSomTooltip.tsx`
- [ ] `ToSomSkeleton.tsx`
- [ ] `PageShell.tsx`

### Leveranser
- ✅ Én sannhetskilde for tokens (`components/ui/tokens.ts`)
- ✅ Alle nye basis-komponenter testet
- ✅ `config/design-tokens.ts` markert ARCHIVED (når alle importører migrert)

---

## 4. Fase 2 — Side-polering (bruker) (5-7 dager)

**Referanse:** Dokument 04 (Brand), Dokument 09 (Page Improvements)

### Prioriteringsrekkefølge
1. Login + Register (auth er førsteinntrykk)
2. Onboarding (lengste flow, mest kontakt med bruker)
3. Dashboard (sentral hub)
4. Chat (kritisk for daglig bruk)
5. Profil + Reise + Innstillinger
6. Offentlige sider (landing, slik-fungerer-det, priser, etc.)

### Per side:
- [ ] Implementér alle "Høy prioritet"-punkter fra dokument 09
- [ ] Bruk PageShell-wrapper
- [ ] Test på mobil (375px) og desktop (1280px)
- [ ] Verifiser at all tekst er bokmål + ToSom-tone

### Leveranser
- ✅ Alle sider med konsistent UI (tokens, spacing, typografi)
- ✅ Mobilresponsiv på alle sider
- ✅ Ingen blank skjermer ved lasting (skeleton-states)

---

## 5. Fase 3 — Journey + Matching finjustering (3-4 dager)

**Referanse:** Dokument 07 (Matching), Dokument 08 (Journey)

### Steg 3.1: Matching vekt-finjustering (dag 1)
- [ ] Oppdater `lib/matching/weightConfig.ts` med nye vekter
- [ ] Kjør eksisterende tests
- [ ] Verifiser scoring 0-100

### Steg 3.2: Minimum score-threshold (dag 1)
- [ ] Legg til `minAcceptableScore` i config
- [ ] Oppdater `findBestResonance.ts` med tidlig-utgang

### Steg 3.3: Match-logging (dag 2)
- [ ] Opprett `MatchLog` interface + Prisma-modell
- [ ] Kjør `npx prisma migrate dev`
- [ ] Logg hver match med full breakdown

### Steg 3.4: Journey språklig polering (dag 2-3)
- [ ] Gjennomgå alle 30 dager
- [ ] Sjekk mot språkmanualen
- [ ] Test at tekster føles varme og rolige

### Steg 3.5: Fase-overgang-bannerer (dag 3)
- [ ] Opprett `PhaseTransitionBanner.tsx`
- [ ] Implementer dag 15 og dag 22

### Steg 3.6: Avslutningsside-polering (dag 3-4)
- [ ] Reise-oppsummering på `/reisen/avslutning`
- [ ] Varmere tekst for begge valg
- [ ] Overgangs-animasjon ved valg

### Leveranser
- ✅ Matching med finjusterte vekter + threshold + logging
- ✅ Journey med polerte tekster og fase-overganger
- ✅ Avslutningsside med oppsummering

---

## 6. Fase 4 — Admin v2 Design (5-7 dager)

**Referanse:** Dokument 01 (Admin Design), Dokument 05 (Komponentbibliotek)

### Steg 4.1: AdminSidebarV2 (dag 1-2)
- [ ] Opprett `components/admin/AdminSidebarV2.tsx`
- [ ] Hierarkisk navigasjon (5 grupper)
- [ ] Konsistente 20px ikoner
- [ ] Aktiv/inaktiv state med gull-system

### Steg 4.2: AdminBreadcrumb (dag 2)
- [ ] Opprett `components/admin/AdminBreadcrumb.tsx`
- [ ] Legg inn i hver admin-side

### Steg 4.3: Dashboard v2 Layout (dag 3-4)
- [ ] Oppdater `app/admin/dashboard/page.tsx`
- [ ] Opprett `MetricCardV2.tsx`
- [ ] Opprett `TwoColumnLayout.tsx`
- [ ] 8 metrikk-kort + SystemStatus + JourneyPhaseMonitor

### Steg 4.4: Admin token-separasjon (dag 4)
- [ ] Opprett `config/admin-tokens.ts` med admin-spesifikke farger
- [ ] Bruk i alle admin-komponenter

### Steg 4.5: Login-polering (dag 5)
- [ ] Oppdater `/admin/login` med konsistent glass-design
- [ ] Ambient glow-effekt

### Leveranser
- ✅ Admin v2 med hierarkisk navigasjon
- ✅ Ny dashboard med 8 metrikker + 2-kolonne layout
- ✅ Breadcrumbs på alle admin-sider

---

## 7. Fase 5 — Admin v2 Funksjoner (7-10 dager)

**Referanse:** Dokument 02 (Admin Features), Dokument 07 (Matching-insights), Dokument 08 (Journey-insights)

### Steg 5.1: Observability — DriftScore (dag 1-3)
- [ ] Opprett `lib/admin/driftScore.ts`
- [ ] Opprett `GET /api/admin/observability/drift-score`
- [ ] Opprett `/admin/observability/health/page.tsx` med ring + komponenter

### Steg 5.2: Observability — Logging (dag 3-4)
- [ ] Opprett `lib/admin/logger.ts`
- [ ] Opprett `GET /api/admin/observability/logs`
- [ ] Opprett `/admin/observability/logs/page.tsx`

### Steg 5.3: Observability — Feil (dag 4-5)
- [ ] Koble opp `lib/errorTracker.ts` mot admin-API
- [ ] Opprett `GET /api/admin/observability/errors`
- [ ] Opprett `/admin/observability/errors/page.tsx`

### Steg 5.4: Match-insights (dag 5-7)
- [ ] Opprett `GET /api/admin/operations/matches/[id]/breakdown`
- [ ] Opprett `/admin/operations/matches/page.tsx` (tabell)
- [ ] Opprett `/admin/operations/matches/[id]/page.tsx` (detaljer med bar-chart)

### Steg 5.5: Journey-insights (dag 7-8)
- [ ] Opprett `GET /api/admin/operations/journeys/[id]/timeline`
- [ ] Opprett `/admin/operations/journeys/page.tsx` (tabell)
- [ ] Opprett `/admin/operations/journeys/[id]/page.tsx` (detaljer med tidslinje)

### Steg 5.6: Analytics-sider (dag 8-10)
Implementer én om gangen:
- [ ] `/admin/analytics/users` + API
- [ ] `/admin/analytics/engagement` + API
- [ ] `/admin/analytics/conversion` + API
- [ ] `/admin/analytics/trends` + API

### Leveranser
- ✅ Full observability med DriftScore, logging og feil
- ✅ Match + Journey insights med detaljsider
- ✅ Analytics-modul med 4 undersider

---

## 8. Fase 6 — Deploy + Monitorering (3-4 dager)

**Referanse:** Dokument 11 (Deploy v2)

### Steg 6.1: Backup-system (dag 1)
- [ ] Opprett backup-script i `scripts/backup.sh`
- [ ] Test manuelt: dump + restore
- [ ] Sett opp cron for daglig backup

### Steg 6.2: Deploy-script (dag 1-2)
- [ ] Opprett `scripts/deploy.sh`
- [ ] Legg til rollback-instruksjoner
- [ ] Test på staging-miljø (hvis tilgjengelig)

### Steg 6.3: Monitorering (dag 2-3)
- [ ] Implementér alerting for DriftScore < 50
- [ ] Sett opp health-check cron som sjekker `/api/system/health` hver 5. minutt

### Steg 6.4: Security checklist (dag 3-4)
- [ ] Rate-limiting på API-ruter
- [ ] CSRF-protection på auth-endepunkter
- [ ] Git branch protection (main krever approval)

### Leveranser
- ✅ Automatiske daglige backups med 14-dagers retention
- ✅ Deploy-script med rollback
- ✅ Monitorering med alerting

---

## 9. Fase 7 — Testing + QA (3-5 dager)

### Steg 7.1: E2E-testing (dag 1-2)
- [ ] Kjør full Playwright-testsuite
- [ ] Dokumenter og fix eventuelle feil
- [ ] Legg til nye e2e-tests for v2-funksjoner (admin-sider, etc.)

### Steg 7.2: Manuel testing (dag 2-3)
- [ ] Test onboarding-flow fra start til slutt
- [ ] Test chat i mobil + desktop
- [ ] Test admin-panel alle sider
- [ ] Test deploy-script på staging

### Steg 7.3: Dokumentasjons-review (dag 3-4)
- [ ] Sjekk at alle v2-dokumenter er oppdaterte
- [ ] Oppdater `ai/memory.json` med nye path/mapping hvis relevant
- [ ] Oppdater `README.md` med link til docs/v2/

### Steg 7.4: Sluttrapport (dag 4-5)
- [ ] Lag kort oppsummering av alle endringer
- [ ] Logg alle git-commits
- [ ] Merk eventuelle gjenstående todo-items

### Leveranser
- ✅ Green e2e-testsuite
- ✅ Manuel testing dokumentert
- ✅ Alle docs oppdatert
- ✅ Sluttrapport levert

---

## 10. Risiko og Mitigering

| Risiko | Sjanse | Impact | Mitigering |
|--------|--------|--------|------------|
| Token-migrasjon bryter komponenter | Høy | Høy | Én komponent om gangen, test hver, behold gamle filer til alt er migrert |
| Matching-vektendring påvirker quality | Middels | Høy | Test med eksisterende profiler før deploy, rollback-klar |
| Admin-v2 tar lengre tid enn estimert | Høy | Middels | Start med Observability (høy verdi), rest kan fases ut |
| Database-migrering feiler i prod | Lav | Kritisk | Alltid test lokalt først, backup før migrering |
| Qwen-agent mister kontekst | Middels | Høy | Ha v2-dokumenter tilgjengelig, referer til spesifikt dokument per steg |

---

## 11. Avhengighetskart

```
Fase 0 (Forberedelse)
    │
    ▼
Fase 1 (UI-system) ─────────┐
    │                        │
    ▼                        │
Fase 2 (Side-polering) ─────┼────┐
                            │    │
    (parallelt)             │    │
Fase 3 (Journey+Matching)───┘    │
                            │    │
    (venter på Fase 1)      │    │
Fase 4 (Admin Design) ──────┘    │
    │                            │
    ▼                            │
Fase 5 (Admin Funksjoner) ───────┤
                                         │
    (parallelt med 4/5)                │
Fase 6 (Deploy) ───────────────────────┤
                                         │
                                         ▼
                                  Fase 7 (QA + Testing)
```

---

## 12. Qwen ACT-instruks — Full versjon

```
============================================
TOSOM V2 — ACT-INSTRUKS FOR QWEN 3.6 27B
============================================

FØR HVERT STEG:
1. Les ai/system_prompt.md (obligatorisk)
2. Les det relevante v2-dokumentet for oppgaven
3. Lag en PLAN før du utfører noe
4. Utfør kun ÉN oppgave om gangen

GENERELLE REGLER:
- Evolusjon, ikke revolusjon — forbedre eksisterende kode, rewrite ikke
- Patch-format for alle endringer (små, reverserbare commits)
- Bokmål på all brukertilrettet tekst
- Ingen AI-chat/feed/swipe/gamification — ALDRI
- Følg ToSom-filosofi: ro, varme, modenhet, trygghet, enkelhet, konsistens
- Test etter hver endring (npm run build + relevante tests)
- Bruk tokens fra components/ui/tokens.ts — aldri hardcoded farger

ARBEIDSREKKER:
Fase 0 → Fase 1 → Fase 2 → Fase 3 (parallelt med 2) →
       Fase 4 → Fase 5 → Fase 6 (parallelt) → Fase 7

KOMMUNIKASJON MED GEORGE:
- Still spørsmål ved uklarheter
- Rapportér feil umiddelbart
- Be om godkjenning før backend-endringer
- Oppdater task_progress etter hvert steg

FILSTRUKTUR-V2:
Alle v2-dokumenter ligger i docs/v2/ (00 til 12).
Les README (00) først, deretter relevante dokumenter per oppgave.
============================================
```

---

## 13. Succeskriteria — Hvordan vet vi at v2 er ferdig?

| Kriterium | Verifikasjon |
|-----------|-------------|
| Én sannhetskilde for tokens | `components/ui/tokens.ts` importeres av alle komponenter |
| Konsistent UI på alle sider | Manuel visual review + ingen hardcoded farger i codebase |
| Matching med finjusterte vekter | `weightConfig.ts` oppdatert + tests passer |
| Journey med polerte tekster | Alle 30 dager gjennomgått mot språkmanualen |
| Admin v2 med Observability | DriftScore-side fungerer med real data |
| Match/Journey insights i admin | Detaljsider viser score-breakdown og timeline |
| Backup-system operativt | Daglig backup cron kjører + testet restore |
| Green testsuite | Alle Playwright-tests passer |
| Dokumentasjon oppdatert | `docs/v2/` med alle 13 dokumenter |

---

*Slutt på Roadmap v2. Dette er det siste dokumentet i serien.*