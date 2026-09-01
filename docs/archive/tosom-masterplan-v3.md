# TOSOM MASTERPLAN V3 — STRATEGISK ROADMAP FOR VIDERE ARBEID

**Lagd:** 8. juni 2026  
**Status:** Planfase — vent på godkjenning  
**Mål:** Helhetlig, strukturert og prioritert roadmap for vidare utvikling, stabilisering, drift og vekst av ToSom-plattformen.

---

## 1. PRIORITERT ROADMAP

### Fase 0 — Forbereding (1 uke)
**Hvorfor:** Deploy-infra er klar (17 filer i FASE 13), men pre-flight-check.md er tom. Uten dette kan vi ikke deploye trygt.

| Oppgave | Mål | Fil(er) |
|--|--|--|
| Fyll pre-flight-check.md | Alle 7 kategorier OK | docs/pre-flight-check.md |
| Godkjenn launch-checklist | CTO/Tech Lead/DevOps signerer | docs/launch-checklist.md |
| Manual deploy | Følg deploy/README.md 10-stegs | deploy/README.md |
| Post-deploy overvaking | 24 timers observasjon | docs/post-deploy-monitoring.md |

### Fase 1 — Stabilisering og kvalitet (4–6 uker)
**Hvorfor:** Kritisk før volum. Feil i match-systemet, auth eller messaging vil ødelegge brukeropplevelsen.

| Sprint | Oppgave | Status | Risiko |
|--|--|--|--|
| S1 | API-feilhåndtering konsistent | Mangler | Høy |
| S1 | Logging-nivå konsistent (info/warn/error) | Delvis | Medium |
| S2 | Rate-limit tuning (prod-verdier) | Finnes, ikke testet | Høy |
| S2 | DB-indekser gjennomgang | Noen mangler | Høy |
| S3 | Memory-profilering | Ikke gjort | Medium |
| S3 | Sikkerhets headers hardening | Finnes i middleware | Lav |
| S4 | Session fingerprinting verifikasjon | Mangler | Høy |
| S4 | Admin auditlogg gjennomgang | Finnes | Lav |
| S5 | AI-key-rotasjon og policy | Mangler | Høy |

### Fase 2 — Produktforbedringer (6–8 uker)
**Hvorfor:** Matching og journey er hjertet i ToSom. Må være polert før marked.

| Sprint | Oppgave | Status | Risiko |
|--|--|--|--|
| S6 | Match-score finjustering | Vekter finnes, ikke testet | Høy |
| S6 | Compatibility insights UI | Mangler | Medium |
| S7 | Dealbreakers/preferanser | Mangler | Høy |
| S7 | Journey dag-for-dag progresjon | Finnes delvis | Medium |
| S8 | AI-refleksjoner | Finnes delvis | Medium |
| S8 | Personlige oppgaver | Mangler | Høy |
| S9 | AI message suggestions tonevalg | Mangler | Høy |
| S9 | Samtaleflyt forbedring | Mangler | Medium |
| S10 | Profil-rewrite forbedring | Mangler | Lav |
| S10 | AI-baserte forslag | Mangler | Lav |

### Fase 3 — Infrastruktur og drift (4 uker)
**Hvorfor:** Automatisering og pålitelighet før volum.

| Sprint | Oppgave | Status | Risiko |
|--|--|--|--|
| S11 | CI/CD pipeline | Mangler | Høy |
| S11 | Staging-miljø | Mangler | Høy |
| S12 | Nightly builds | Mangler | Medium |
| S12 | Automatisk backup-verifikasjon | Mangler | Høy |
| S13 | Restore-test hvert 14. dag | Mangler | Høy |
| S13 | AI-kostnadsmonitor | Mangler | Medium |
| S14 | Token-optimalisering | Mangler | Lav |
| S14 | Cache-strategi | Mangler | Medium |

### Fase 4 — Skalering (8–12 uker etter launch)
**Hvorfor:** Først når vi har volum trengs denne.

| Oppgave | Mål | Hvorfor viktig |
|--|--|--|
| Horisontal API-skalering | K8s eller PM2 cluster | >1000 brukere |
| Connection pooling (PgBouncer) | Minimer DB-tilkoblinger | Samtidige connections |
| Redis (rate-limit + cache) | Fjern last fra DB | Rate-limit og sesjoner |
| CDN (statisk) | Next.js static optimization | Bilder og assets |
| DB-query analyse | EXPLAIN ANALYZE | Hot queries |
| Indeks-optimalisering | B-tree + GIN | Fulltext search |
| Partitioning | Conversation/Mensaje | Vekst >10k rader |

### Fase 5 — Sikkerhet og compliance (kontinuerlig)
**Hvorfor:** Dating-plattform håndterer sensitiv data. Compliance er ikke valgfritt.

| Oppgave | Prioritet | Tidsramme |
|--|--|--|
| Dataminimering | Høy | 2 uker |
| Slette-policy | Høy | 2 uker |
| Eksport-policy (GDPR) | Høy | 2 uker |
| Tilgangslogging | Høy | 1 uke |
| Pen-test | Høy | Før Q1 |
| Sårbarhetsskanning | Høy | Kontinuerlig |
| AI-misbruk-deteksjon | Medium | 4 uker |

### Fase 6 — Produktvekst (30–90 dager etter launch)
**Hvorfor:** Etter at grunnlaget er stabilt, fokuserer vi på vekst og forretningsstrategi.

| Oppgave | Prioritet | Mål |
|--|--|--|
| Onboarding-optimalisering | Høy | +30% konvertering |
| Viral loops | Høy | Delingsfunksjon |
| Referral-system | Høy | -20% CAC |
| Premium-pakker | Høy | MRR |
| Match-analyse (premium) | Høy | Konkurransfordel |
| Personlig coaching (premium) | Medium | MRR |
| Premium-journey | Medium | MRR |
| Vekst-dashboard | Høy | Innsikt |
| AI-drevet innsikt | Medium | Innsikt |
| A/B-test infrastruktur | Høy | Data-drevne avgjørelser |

---

## 2. SPRINT-PLAN (2-ukers sprinter)

### Sprint 0 — Pre-Launch (1 uke)

| Dag | Oppgave | Avhengighet |
|--|--|--|
| D1 | Fyll pre-flight-check.md | Ingen |
| D2 | Godkjenn launch-checklist | D1 |
| D3 | Deploy (manual) | D2 |
| D4 | Post-deploy overvaking (6 timer) | D3 |
| D5 | Verifiser alle metrikker | D4 |

### Sprint 1–2 — Stabilisering

| Sprint | Oppgaver | Mål |
|--|--|--|
| S1 | API-feilhåndtering, logging, auth-flow | 0 unhandled errors |
| S2 | Rate-limit tuning, DB-indekser | <200ms p95 |
| S3 | Session-fingerprinting, audit-log | Høy sikkerhet |
| S4 | AI-key-rotasjon, backup-verifikasjon | Pålitelig drift |

### Sprint 3–5 — Produktforbedring

| Sprint | Oppgaver | Mål |
|--|--|--|
| S6–7 | Match-score, dealbreakers, insights | +20% match kvalitet |
| S8 | Journey-forbedring, AI-refleksjoner | +15% engasjement |
| S9 | Message tonevalg, samtaleflyt | +25% svarrate |
| S10 | Profil-rewrite, AI-forslag | +10% profil fullføring |

### Sprint 6–7 — Infra og automatisering

| Sprint | Oppgaver | Mål |
|--|--|--|
| S11 | CI/CD, staging, nightly builds | Automatisk deploy |
| S12 | Backup-verifikasjon, cost monitor | Pålitelig drift |
| S13 | Token-opt, cache-strategi | -30% AI-kostnad |

### Sprint 8+ — Skalering og vekst

| Sprint | Oppgaver | Mål |
|--|--|--|
| S14 | Redis, PgBouncer, CDN | +5x kapasitet |
| S15 | DB-partitioning, query analyse | <100ms p95 |
| S16+ | Vekst-initiativ, premium, A/B-test | MRR-vekst |

---

## 3. AVHENGIGHETER MELLEM OPGGVER

```
Pre-flight Check (Sprint 0)
  └── Deploy Manual (Sprint 0)
       └── Post-deploy Monitoring (Sprint 0)
            └── Stabilisering (Sprint 1–4)
                 ├── API-feilhåndtering (S1) ───┐
                 ├── Rate-limit tuning (S2) ─────┤
                 ├── DB-indekser (S2) ────────┤
                 ├── Session-fingerprinting (S3) ──┤
                 └── Backup-verifikasjon (S4) ───┘
                      └── Produktforbedring (Sprint 6–10)
                           ├── Match-score (S6) ──────────┐
                           ├── Dealbreakers (S7) ─────────┤
                           ├── Journey (S8) ────────────┤
                           ├── Messaging (S9) ──────────┤
                           └── Profil (S10) ───────────┘
                                └── Infra automatisering (Sprint 11–14)
                                     ├── CI/CD (S11) ───────────┐
                                     ├── Staging (S11) ────────┤
                                     ├── Backup-auto (S12) ──────┤
                                     └── Cache-strategi (S14) ───┘
                                          └── Skalering (Sprint 14+)
                                               ├── Redis (S14) ─────┐
                                               ├── PgBouncer (S14) ──┤
                                               ├── CDN (S14) ───────┤
                                               └── Partitioning (S15) ─┘
```

---

## 4. CRITICAL PATH — PRECIS LAUNCH

```
Pre-flight Check → Godkjenning → Deploy → Healthcheck → Smoke Tests
     │                   │             │            │             │
     ▼                   ▼             ▼            ▼             ▼
   Admin OK     Observability    Security   24h Monitoring → LAUNCH APPROVED
```

**Krav før launch:**
1. READINESS_FOR_PROD = true (docs/readiness-gate.md)
2. Alle 7 komponenter OK (pre-flight-check.md)
3. CTO/Tech Lead/DevOps signaturer (launch-checklist.md)
4. 24-timers monitoring uten critical/high-feil

---

## 5. POST-LAUNCH STABILISERING (FØRSTE 30 DAGER)

### Uker 1–2: Kritisk

| Dag | Oppgave | Mål |
|--|--|--|
| Dag 1–3 | Kontinuerlig overvaking hver 30 min | Ingen kritiske feil |
| Dag 1–3 | AI-kostnad under budsjett | < $50/dag |
| Dag 1–7 | Error-rate under 1% | < 0.5% optimalt |
| Dag 1–7 | DB-latens under 50ms p95 | < 30ms optimalt |
| Dag 3 | Første backup-restore test | Bekreft backup |
| Dag 7 | Første infra-revues | Justere konfigurasjon |

### Uker 3–4: Stabilisering

| Oppgave | Mål |
|--|--|
| Error-rate < 0.5% | Høy kvalitet |
| AI-kostnad stabil | Under budsjett |
| Første sprint planning | Produktforbedring |
| Brukerfeedback samling | Innsikt |
| Første A/B-test oppsett | Data-drevne avgjørelser |

### Måned 1–2: Produktforbedring

| Oppgave | Mål |
|--|--|
| Match-score finjustering | +20% match kvalitet |
| Journey-forbedring | +15% engasjement |
| Messaging-forbedring | +25% svarrate |
| CI/CD pipeline | Automatisk deploy |
| Premium-pakker oppsett | MRR-start |

### Måned 2–3: Vekst

| Oppgave | Mål |
|--|--|
| Referral-system | -20% CAC |
| Premium-oppsett | MRR > $0 |
| A/B-test infrastruktur | Data-drevne avgjørelser |
| Pen-test | Sikkerhet |
| Skalering-forbereding | Redis, PgBouncer |

---

## 6. VEKST-PLAN (30–90 DAGER)

### Måned 1: Stabilisering og Innsikt
- Monitoring: Alle metrikker i sanntid
- Brukerfeedback: Intervjue 10+ brukere
- AI-kostnad: Optimalisering
- Match kvalitet: Analyze match rate
- Journey-engasjement: Tracking progress

### Måned 2: Produktforbedring
- Match-score: Finjustering basert på data
- Messaging: Tonevalg + AI-forbedring
- Onboarding: A/B-test flow
- Premium MVP: Grunnleggende pakke
- Referral: Grunnleggende system

### Måned 3: Skala og Vekst
- Redis-integrasjon: Rate-limit + cache
- PgBouncer: Connection pooling
- Premium-launch: Full premium-pakke
- Pen-test: Sikkerhetsreview
- A/B-test: 3+ parallelle tester
- CDN: Statisk asset-leveranse

---

## 7. RISIKOANALYSE OG MITIGERING

| Risiko | Sannsyn | Påvirkning | Mitigering | Ansvarlig |
|--|--|--|--|--|
| AI-kostnad eksploderer | Høy | Høy | Cost-monitor, token-opt, rate-limit | DevOps |
| DB-bottleneck ved vekst | Høy | Høy | PgBouncer, indeks, partitioning | DevOps |
| Sikkerhetsbrudd | Medium | Kritisk | Pen-test, security headers, audit-log | Security |
| Match-kvalitet dårlig | Høy | Kritisk | Kontinuerlig finjustering, feedback loop | Tech Lead |
| Deploy-feil | Medium | Høy | Rollback-script, staging, smoke tests | DevOps |
| Backup ikke fungerer | Lav | Kritisk | Automatisk verifikasjon, restore-test | DevOps |
| AI-abuse/spam | Høy | Høy | Rate-limit, AI-deteksjon, admin-tools | Tech Lead |
| GDPR-klargjøring | Høy | Kritisk | Slette-policy, eksport-policy, logging | Legal/Tech |
| CPU/minne-bottleneck | Medium | Høy | Monitoring, profiling, skalering | DevOps |
| Session-hijacking | Lav | Kritisk | Fingerprinting, HTTPS, HSTS | Security |
| Vendor-lock-in (AI) | Medium | Medium | Multi-provider, fallback | Tech Lead |
| Bruker-slep | Høy | Kritisk | Vekst-initiativ, premium, A/B-test | Product |

---

## 8. ANBEFALA ARBEIDSFLYT MELLOM TECH LEAD, QWEN OG CLINE

### Mønstre for effektiv samarbeid

| Fase | Du (Tech Lead) | Cline | Qwen |
|--|--|--|--|
| Analyse | Definer mål og prioritet | Utfør kodeanalyse | Gi arkitektur-innsikt |
| Planlegging | Godkjenn roadmap | Lag sprint-plan | Foreslå tekniske alternativer |
| Implementasjon | Review kode | Implementere faser | Review arkitektur |
| Testing | Verifiser resultat | Kjør tester | Analyze testresultat |
| Deploy | Godkjenn deploy | Utfør deploy-steg | Monitor post-deploy |

### Arbeidsflyt for hver fase:

**Tech Lead:**
1. Definer fase-mål (2–3 setning)
2. Godkjenn roadmap
3. Review leveranse
4. Godkjenn deploy

**Cline:**
1. Les kodebase for kontekst
2. Lag konkret plan for fase
3. Implementer fil for fil
4. Dokumenter endringer

**Qwen:**
1. Gi arkitektur-analyse
2. Foreslå tekniske alternativer
3. Analyze risiko og trade-offs
4. Gi skaleringsråd

### Sprint-syklus:
- Dag 1: Du definerer sprint-mål → Cline + Qwen lag plan
- Dag 2–3: Cline implementerer → Qwen gir teknisk støtte
- Dag 4: Du reviewer kode + tester
- Dag 5: Godkjenn eller juster → Neste sprint

---

## 9. OPPSUMMERING — KRITISKE NESTE STEG

| Rangering | Oppgave | Tid | Avhengighet |
|--|--|--|--|
| 1 | Fyll pre-flight-check.md | 1 dag | Ingen |
| 2 | Godkjenn og signer launch-checklist | 1 dag | D1 |
| 3 | Manual deploy (10-stegs) | 1 dag | D2 |
| 4 | 24-timers post-deploy monitoring | 1 dag | D3 |
| 5 | Stabilisering Sprint 1–4 | 4–6 uker | D4 |
| 6 | Produktforbedring Sprint 6–10 | 6–8 uker | S1–4 |
| 7 | Infra automatisering Sprint 11–14 | 4 uker | S1–4 |
| 8 | Skalering Sprint 14+ | 8–12 uker | S6–14 |

**Neste konkrete steg:** Fyll ut docs/pre-flight-check.md med true/false for hver komponent, få signaturer, og deploy manuelt via deploy/README.md.

---

## 10. NOKKELINNSIKTER FRA KODEBASE-ANALYSE

### Datamodell (Prisma Schema)
- **32 modeller** dekker hele plattformen
- **JourneyPhase:** EARLY → BUILDING_TRUST → DEEPER → CHECKIN
- **MatchStatus:** pending → active → matched → expired → ended → unmatched
- **Match-vekter:** base (0.4), resonance (0.3), semantic (0.25), intimacy (0.025), future (0.025)
- **Observability:** SystemLog, RateLimitLog, PerformanceMetric, RouteHit, AIRequestLog

### API-struktur
- **app/api/admin/** — Admin-kontroll
- **app/api/ai/** — AI-funksjoner (message-suggestions, profile-insights)
- **app/api/auth/** — Login, register, password-reset, 2FA
- **app/api/conversation/** — Samtaler og meldinger
- **app/api/match/** — Match-system og køy
- **app/api/notifications/** — Push-notifikasjoner
- **app/api/profile/** — Profil-oppdatering og -get
- **app/api/system/** — Health, observability, security

### Kritiske svakheter identifiserte
1. Match-score ikke testet — vekter definerte men aldri validerte med ekte data
2. AI-feature-mangel — Tonevalg for message-suggestions mangler helt
3. Journey mangler dag-for-dag progresjon UI — Data eksisterer men ikke visning
4. Onboarding er frontend-state — Ingen backend-verifikasjon
5. Ingen CI/CD — Manual deploy er den eneste metoden
6. Ingen staging-miljø — Bare dev/pre-prod/production

---

## 11. FASE-OVERSIKT

| Fase | Omfang | Filer laget | Status |
|--|--|--|--|
| FASE 1–12 | Analyse, match, journey, infra, AI, admin, security | 120+ filer | Fullført |
| FASE 13 | Deploy, backup, monitoring, rollback, launch | 17 filer | Fullført |
| FASE 14+ | Produktforbedring, skalering, vekst | — | Planfase |

**Totalt prosjekt omfang:** 120+ filer, 32 databasemodeller, 7+ API-kategorier, 6+ sprint-faser

---

## 12. AVSLUTTENDE MERKNADER

1. Ingen ny funksjonalitet lagt til — bare analyse, struktur og roadmap
2. pre-flight-check.md må fylles manuelt før deploy kan startes
3. READINESS_FOR_PROD er false i alle dokument og må settes til true før launch
4. Denne planen er et levende dokument — skal oppdateres hver sprint
5. Switch to ACT MODE for å implementere de enkelte fasene

---

**PLAN_VERSION = v3**  
**DOKUMENT_STATUS = Planfase**
