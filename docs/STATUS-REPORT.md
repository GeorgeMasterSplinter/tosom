# ToSom — Offisiell Statusrapport

**Dato:** September 2026 
**Versjon:** 1.0  
**Status:** 🟡 BETA (klar for 30–50 brukere)

---

## 1. Oversikt

**ToSom** er et anonymt, 30-dagers samtaleformat for mennesker som leter after en dypere forbindelse. Ingen bilder, ingen navn, ingen overflatelighet. Bare ord — og tid.

**Kjernefunksjonalitet:**
- Anonym matching basert på 80+ dypdeled spørsmål
- 30-dagers guidet reise med faser, milestone og daglige spørsmål
- Reellidssamtale med stemning/mood-system
- Bilde deling låses opp ved dag 15
- Full data-sletting ved reiseslutt (GDPR)
- Admin-panel for overvåking

---

## 2. Teknologistack

| Lag | Teknologi | Notat |
|-----|-----------|-------|
| **Frontend** | Next.js 15 (App Router) | Server Components + Client Components |
| **Backend** | Next.js API Routes | Serverless functions (Vercel) |
| **Database** | PostgreSQL (Supabase/Neon) | Prisma ORM, 34 modeller |
| **Auth** | NextAuth v5 (JWT) | Email + magic link, RBAC |
| **Realtid** | Pusher (EU-cluster) | Chat, typing, presence |
| **Fil-lagring** | UploadThing (S3/R2) | Bilde-opplasting fra dag 15 |
| **Error tracking** | Sentry | Prod + staging |
| **Deploy** | Vercel | Edge + Serverless, auto-scaling |
| **Crons** | Vercel Cron | Journey (timevis) + Matching (lørdag) |
| **Testing** | Jest (196 test-filer) | Unit + integration |
| **Språk** | Norsk (Bokmål) | Språkvakt automatisk CI |

---

## 3. Funksjonalitet

| Feature | Status | Notat |
|---------|--------|-------|
| Registrering + login | ✅ | Email + magic link, NextAuth v5 |
| Onboarding (80+ spørsmål) | ✅ | Psykometrisk profil, kategorisert |
| Matching (cron) | ✅ | Lørdag 02–04, admin kan kjøre manuelt |
| Resonanse-skor | ✅ | 0–100 basert på samsvar |
| 30-dagers journey | ✅ | Cron +24t/dag, self-heal, 5 faser |
| Chat (reelltid) | ✅ | Pusher + polling fallback (3s) |
| Typing indicator | ✅ | Pusher-event + polling |
| Mood (per-bruker) | ✅ | localStorage, 6 farger/temaer |
| BliKjent-panel | ✅ | Guidet spørsmål, daglig |
| Oppgaver-panel | ✅ | Duglige samtale-impulser |
| Bilde deling (dag 15) | ✅ | UploadThing, låses opp av cron |
| Dag 30 — slutt | ✅ | "Fant hverandre" / "Ny reise" |
| Full data-sletting | ✅ | endJourney() cascade, verifisert |
| Kontosletting (GDPR) | ✅ | Settings → Slett konto |
| Sperreliste (block) | ✅ | 6 mnd cooldown per pair |
| Report/flag | ✅ | Admin-moderation |
| Admin panel | ✅ | Stats, freeze, analytics, audit |
| Notifikasjoner (DB) | ✅ | Journey, match, system |
| Push notifikasjoner | ❌ | Ikke implementert ennå |
| Transaksjonell e-post | ❌ | Ikke implementert ennå |

---

## 4. Sikkerhet

| Område | Implementasjon |
|--------|---------------|
| **Auth** | NextAuth v5, JWT (httpOnly cookie), bcrypt hashing |
| **CSRF** | Double-submit token + grace period |
| **Rate limiting** | Redis + PostgreSQL fallback (PG), per-IP + per-user |
| **RBAC** | user / admin / dev, route-guards |
| **Data isolation** | Conversation-scoped queries (verify membership) |
| **Audit log** | Alle sensitive handlinger logges (who, when, what) |
| **Encryption** | TLS 1.3 in transit, AES-256 at rest (DB) |
| **Secrets** | Vercel env vars, ingen i repo |
| **Input validation** | Zod/Prisma type-safety, API validator |
| **Advisory locks** | Cron overlap prevention (PostgreSQL) |
| **Sentry** | Error tracking + release health |
| **Health check** | `/api/system/health` (DB, Pusher, UploadThing) |

**Kjente begrensninger:**
- Pusher Hobby: 100k events/mnd (nok for beta, begrenset for scale)
- Vercel Hobby: Maks 2 crons (journey + matching = nøyaktig 2)
- Ingen 2FA for brukere (kun admin via TOTP)

---

## 5. Personvern (GDPR)

### Data vi samlar:
| Data | Formål | Retention |
|------|--------|-----------|
| Email | Auth | Inntil sletting |
| Spørsmålssvar | Matching | Slettes ved reiseslutt |
| Samtaler | Chat | Slettes ved reiseslutt |
| Bilde (dag 15+) | Chat | Slettes ved reiseslutt |
| Resonanse-skor | Quality | Slettes ved reiseslutt |
| Journey progress | UX | Slettes ved reiseslutt |

### Data vi IKKE samlar:
- Ingen geolokasjon (kun avstand i km, roundet)
- Ingen IP-logging i DB
- Ingen browser fingerprinting
- Ingen tredjeparts tracking/cookies
- Ingen salg av data

### Sletting:
- **Ved reiseslutt:** Alt innhold (meldinger, bilder, spørsmål, journey) slettes verifisert
- **MatchHistory:** Beholdes (kun 2 user IDs + outcome — ingen innhold)
- **AuditLog:** Beholdes (admin-handlinger, anonymisert)
- **Kontosletting:** Full cascade — alt forsvinner
- **Databehandlere:** Pusher (EU), UploadThing, Vercel (EU), DB (EU)

---

## 6. Skalbarhet & kapasitet

| Ressurs | Hobby-plan | Pro-plan | ToSom behov |
|---------|-----------|----------|-------------|
| **Vercel crons** | 2 | 8+ | 2 (journey + matching) ✅ |
| **Vercel functions** | 100k calls/mnd | Unlimited | ~50 brukere = ~2M calls/mnd |
| **Pusher events** | 100k/mnd | 1M+/mnd | 50 brukere × 50 meldinger/dag = ~75k/mnd ✅ |
| **PostgreSQL** | 500 MB | 8 GB+ | 50 brukere = ~100 MB ✅ |
| **UploadThing** | 10 GB | 100 GB+ | 50 brukere × 20 bilder = ~1 GB ✅ |

### Estimat:
| Plan | Maks brukere (samtidig) |
|------|------------------------|
| **Vercel Hobby + Pusher Hobby** | 50–100 |
| **Vercel Pro + Pusher Starter** | 500–1000 |
| **Vercel Pro + Pusher Pro + DB scale** | 5000+ |

### Skaleringstrategi:
1. Cron batch-size (`JOURNEY_BATCH_SIZE=100`) — justeres etter volum
2. PostgreSQL — auto-backup, read-replicas ved behov
3. Pusher — oppgrader ved 50k events/mnd
4. Image storage — S3/R2 (unlimited ved behov)

---

## 7. Health & operasjon

### Health endpoint:
`GET /api/system/health` — returnerer status for:
- Database (query roundtrip)
- Pusher (SDK init)
- UploadThing (token verify)
- Cron heartbeat (siste kjøring)

### Cron monitoring:
- `/api/cron/health` — heartbeat + lag-indikator
- Admin panel viser siste cron-kjøring + eventuelle feil
- Sentry alert ved 5xx-rate

### Admin panel:
- Overvåking: active journeys, match queue, system metrics
- Analytics: journey stats, completion rate, outcomes
- Moderation: freeze/unfreeze conversations, view reports
- Audit: full handle-historikk

---

## 8. Kjente begrensninger

| # | Begrensning | Impact | Lösning |
|---|-------------|--------|---------|
| 1 | Pusher Hobby (100k events/mnd) | Begrenser skala | Oppgrader ved 50k+ events |
| 2 | Vercel Hobby (2 crons) | Ingen flere crons | Pro-plan (8+ crons) |
| 3 | Ingen push notifikasjoner | Brukere må ha app åpen | APNs/FCM (Fase 2) |
| 4 | Ingen transaksjonell e-post | Ingen match-varsel per e-post | Resend/SendGrid (Fase 2) |
| 5 | Polling (3s) som fallback | Litt forsinkelse uten Pusher | Pusher er primær, polling er backup |
| 6 | No 2FA for brukere | Lav risiko (anonymt) | TOTP (Fase 3) |

---

## 9. Lanserings-forutsetninger

### Må til before live:
- [ ] Org.nr + Vipps (betalingsflyt)
- [ ] Personvernpolicy (publisert, juridisk review)
- [ ] Brukervilkår (publisert, juridisk review)
- [ ] Databehandler-avtaler (Pusher, UploadThing, Vercel)
- [ ] Push notifications (APNs + FCM)
- [ ] Transaksjonell e-post (match-varsel, journey updates)
- [ ] Analytics (Plausible/PostHog — privacy-friendly)
- [ ] Support-kanal (e-post + FAQ)
- [ ] Vercel Pro-plan (production)
- [ ] Push notifications testing (iOS + Android)
- [ ] Load testing (simulere 200+ brukere)
- [ ] Security review (pentest ved 500+ brukere)
- [ ] Uptime monitoring (Vercel + custom)
- [ ] Database backup + recovery test

### Skal til etter launch:
- [ ] AI-tilpassede spørsmål (personlig reise)
- [ ] Grupper (3–5 personer)
- [ ] Premium (forlengd reise, ekstra features)
- [ ] Native app (React Native / Expo)
- [ ] Flerspråk (EN, DE, FR)

---

## 10. Testdekning

| Metric | Verd |
|--------|------|
| TypeScript errors | **0** |
| Test-filer | **196** |
| Tests passing | **427/428** (1 skipped) |
| Språkvakt (nynorsk) | **0 treff** |
| Coverage (estimat) | ~70% av core logic |
| E2E (playwright) | Alpha-stage |

---

## 11. Nylige endringer (7 dager)

| Commit | Beskrivelse |
|--------|-------------|
| `134526a` | Settings: "Medlem siden" — createdAt i JWT/session |
| `3b2035c` | Chat: bytt boblestyling (partner lys/fokus) |
| `711f0c6` | Dashboard: fjern Dag 0, profil sentret + resonans |
| `abff7bd` | Cleanup: slett game-API, lib/games, Pusher-triggere |
| `f924ecf` | Journey self-heal dag 0→1 + bilde-lås dag 15 + mood per-bruker |
| `6743c94` | Mood: ikke optimistisk — vent på server-bekreftelse |
| `a351f25` | Fjern GamesPanel.tsx |
| `37c2848` | Fjern spill (RPS) komplett |
| `8754b27` | Dag 30: steng chat + vis valg |
| `3af7a3d` | Journey starter på match: day 1 + bothSeenAt |

---

## 12. Konklusjon

**ToSom er beta-klar** for 30–50 brukere. Kjernefunksjonalitet (matching, 30-dagers reise, chat, bildedeling, data-sletting) er implementert, testet og operasjonalisert. Sikkerhet er på plass med CSRF, rate limiting, RBAC, audit log og full GDPR-sletting.

For **produksjonslansering** kreves: juridiske dokumenter, Vipps-integrasjon, push notifications, transaksjonell e-post, og oppgradering til Vercel Pro. Estimert tid: **1–2 uker** fra beta-start (parallellt med beta-testing).

---

*Denne rapporten oppdateres ved hver større endring. Siste oppdatering: September 2025.*
