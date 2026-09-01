# ToSom — Produksjonsdeploy til tosom.no

**Dato:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 KLAR FOR PRODUKSJONSDEPLOY

---

## OVERSIKT

Dette dokumentet inneholder steg-for-steg guide for å sette opp og deploye ToSom til produksjon med domenet `tosom.no`.

---

## OPPGAVE 1 — VERCEL PRODUKSJONSMILJØ

### Environment Variablar (Production)

I Vercel → Your Project → Settings → Environment Variables → Production:

| Variable | Verdi | Type |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-*.aws-region.supabase.co/tosom` | Production |
| `DIRECT_URL` | `postgresql://user:pass@ep-*.aws-region.supabase.co/tosom` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://*.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...*` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...*` | Production |
| `STRIPE_SECRET_KEY` | `sk_live_*` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_*` | Production |
| `PUSHER_APP_ID` | `*` | All |
| `PUSHER_KEY` | `*` | All |
| `PUSHER_SECRET` | `*` | Production |
| `PUSHER_CLUSTER` | `eu` | All |
| `OPENAI_API_KEY` | `sk-*` | Production |
| `UPLOADTHING_SECRET` | `sk_*` | Production |
| `UPLOADTHING_APP_ID` | `*` | All |
| `CRON_SECRET` | `*` | Production |
| `JWT_SECRET` | `*` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://tosom.no` | All |

---

## OPPGAVE 2 — PRODUKSJONSDATABASE

### 1. Oppsett Supabase

1. Gå til [supabase.com](https://supabase.com)
2. Klikk "New Project"
3. Namn: `ToSom Production`
4. Region: Europe (Frankfurt)
5. Database passord: `strong-production-password`
6. Size: DB1 (minst)
7. Vent til prosjektet er klart (5-10 min)

### 2. Connection String

1. Gå til Settings → Database
2. Kopier "Connection string" (Pool mode)
3. Lim inn som `DATABASE_URL` i Vercel Production

### 3. Migrering

```bash
# Sett DATABASE_URL til produksjons-db lokalt
# (bruk Vercel env pull)
npx vercel env pull .env.production

# Deploy migrations
npx prisma migrate deploy

# Verifiser
npx prisma db pull
```

---

## OPPAVE 3 — STRIPE LIVE MODE

### 1. Aktiver live mode

1. Gå til [dashboard.stripe.com](https://dashboard.stripe.com)
2. Gå til Settings → Account settings
3. Klikk "Activate live mode"
4. Fyll ut needed info (bank, identity)

### 2. API Keys

1. Gå til Developers → API keys
2. Kopier "Live secret key" → `STRIPE_SECRET_KEY=sk_live_*`

### 3. Produkt

1. Gå til Products → Katalog
2. Klikk "Add Product"
3. Namn: `ToSom Premium`
4. Beskriving: `1 måned med ToSom — dik dybde, varme og resonans`
5. Priser (kroner):
   | Periode | Pris |
   |---|---|
   | Månadleg | kr 99 |
   | Kvartal | kr 299 |
   | År | kr 999 |
6. Aktiver produkt

### 4. Webhook

1. Gå til Developers → Webhooks
2. Klikk "Add endpoint"
3. URL: `https://tosom.no/api/webhook/stripe`
4. Event: `checkout.session.completed`, `invoice.payment_failed`
5. Kopier webhook secret → `STRIPE_WEBHOOK_SECRET=whsec_*`

---

## OPPAVE 4 — PUSHER PRODUKSJON

### 1. Opprett app

1. Gå til [pusher.com](https://pusher.com)
2. Klikk "Create app"
3. Namn: `ToSom Production`
4. Cluster: Europe (Frankfurt)
5. Environment: Production

### 2. Keys

1. Gå til "App Keys"
2. Kopier:
   - App ID → `PUSHER_APP_ID`
   - Key → `PUSHER_KEY`
   - Secret → `PUSHER_SECRET`
3. `PUSHER_CLUSTER=eu`

### 3. Test

```bash
# Test med pusher-cli
npx pusher-channels-mqtt \
  --app_id=* \
  --key=* \
  --secret=* \
  --cluster=eu
```

---

## OPPAVE 5 — CRON-JOBAR I PRODUKSJON

### Vercel Cron Jobs

1. Gå til Vercel → Your Project → Settings → Cron
2. Legg til nye ruter:

### /api/cron/daily

```
Schedule: 0 4 * * *
Path: /api/cron/daily
Secret: ${CRON_SECRET}
```

**Formål:** Daily match-generering og daglege oppgaver

### /api/cron/cleanup

```
Schedule: 0 3 * * *
Path: /api/cron/cleanup
Secret: ${CRON_SECRET}
```

**Formål:** Rydd opp gamle sessionar og temp-filer

### /api/cron/analytics

```
Schedule: 0 * * * *
Path: /api/cron/analytics
Secret: ${CRON_SECRET}
```

**Formål:** Timerleg analytics-samling

---

## OPPAVE 6 — PRODUKSJONSDEPLOY

### Steg:

1. **Sjekk at alt er klart**

```bash
# Environment variablar
vercel env ls production

# Database tilkopling
npx prisma migrate status

# Alle tester grøne
npm test
```

2. **Push til main**

```bash
git checkout main
git pull origin main
git status

# Commit alle endringer
git add .
git commit -m "Release: ToSom v1.0 — produksjonsdeploy"
git push origin main
```

3. **Vercel bygg automatisk**

- Vercel detectar push til main
- Bygg startar automatisk
- Gå til Deployments → sjekk at bygg er grønn

4. **Custom Domain**

- Gå til Settings → Domains
- Legg til: `tosom.no`
- Opprett DNS-record:
  ```
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```
  ```
  Type: VERCEL-PROOF-RECORD
  Name: _vercel
  Value: vercel-proof-code
  ```

5. **Verifiser**

```bash
# Test hovedside
curl -I https://tosom.no

# Test API
curl https://tosom.no/api/health

# Test onboarding
curl https://tosom.no/onboarding

# Test chat
curl https://tosom.no/chat
```

---

## OPPAVE 7 — PRODUKSJONSVERIFIKASJON

### Sjekkliste etter deploy

| Komponent | Status | Verifisering |
|---|---|--|
| Hovedside | ⏳ | tosom.no lastar |
| Login/Register | ⏳ | /logg-inn fungerer |
| Onboarding | ⏳ | Full prosess |
| Dashboard | ⏳ | Viser match og reise |
| Chat | ⏳ | Realtime fungerer |
| Journey | ⏳ | Fase og dag oppdaterer |
| Profile | ⏳ | Edit og visning |
| Admin | ⏳ | /admin/dashboard |
| Stripe | ⏳ | Test-kjøp |
| Pusher | ⏳ | Presence oppdaterer |
| AI-knapper | ⏳ | Foreslår svar |
| WarmFlow | ⏳ | Mood endrar |
| Atmosphere | ⏳ | Bakgrunn animert |
| Cron | ⏳ | Jobbar køyrer |
| SSL | ⏳ | HTTPS aktiv |
| Analytics | ⏳ | Vercel viser data |

---

## PROBLEMLØYSING ETTER DEPLOY

### Build feil

```bash
# Tøm Vercel cache
vercel detach
vercel link
vercel --prod
```

### Database feil

```bash
# Sjekk IP allowlist i Supabase
# Legg til Vercel IP-adresser
# Test connection
npx prisma db pull
```

### Stripe feil

```bash
# Test med Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### Pusher feil

```bash
# Test connection
npx pusher-channels-mqtt --app_id=X --key=X --secret=X --cluster=eu
```

---

## POST-DEPLOY MONITORING

### Dagleg

- [ ] Sjekke Vercel logs for errors
- [ ] Validera cron-jobbar køyrer
- [ ] Sjekk Stripe dashboard for betalingar
- [ ] Test main flows (login, chat, match)

### Vekentleg

- [ ] Analyse brukartal
- [ ] Test alle ruter
- [ ] Backup database

### Månadsleg

- [ ] Oppdater dependencies
- [ ] Review security
- [ ] Analyze bruker-innsikt
- [ ] Sjekk Stripe rapportar

---

## PROSJEKTSTATISTIKK

| Mål | Verdi |
|--|--|
| Totalt filer | 64 |
| Build tid | 3.8 sek |
| Komponentar | 40+ |
| API-ruter | 20+ |
| Dokumentasjon | 60+ |
| Environment variablar | 17 |
| Cron-jobbar | 3 |
| Stripe planer | 3 |

---

## PRE-DEPLOY CHECKLIST

### Infrastruktur

- [ ] Vercel prosjekt oppretta
- [ ] Production environment konfiguert
- [ ] Supabase database oppretta
- [ ] Stripe konto aktiv
- [ ] Pusher app oppretta
- [ ] Cron-jobbar konfigurerte

### Environment variablar

- [ ] DATABASE_URL ✅
- [ ] DIRECT_URL ✅
- [ ] SUPABASE_URL ✅
- [ ] SUPABASE_ANON_KEY ✅
- [ ] SUPABASE_SERVICE_ROLE_KEY ✅
- [ ] STRIPE_SECRET_KEY ✅
- [ ] STRIPE_WEBHOOK_SECRET ✅
- [ ] PUSHER_APP_ID ✅
- [ ] PUSHER_KEY ✅
- [ ] PUSHER_SECRET ✅
- [ ] PUSHER_CLUSTER ✅
- [ ] OPENAI_API_KEY ✅
- [ ] UPLOADTHING_SECRET ✅
- [ ] UPLOADTHING_APP_ID ✅
- [ ] CRON_SECRET ✅
- [ ] JWT_SECRET ✅
- [ ] NEXT_PUBLIC_APP_URL ✅

### Domeene

- [ ] tosom.no kopla til Vercel
- [ ] DNS-record konfiguert
- [ ] SSL sertifikat aktivert

### Test

- [ ] Build grønn
- [ ] Hovedside lastar
- [ ] Login fungerer
- [ ] Onboarding fullfør
- [ ] Chat fungerer
- [ ] Match fungerer
- [ ] Admin dashboard fungerer
- [ ] Stripe test-kjøp gjennomført
- [ ] Realtime chat fungerer
- [ ] AI-knapper fungerer
- [ ] Cron-jobbar køyrer

---

**Dato:** 30. juni 2026
**Status:** 🟡 KLAR FOR PRODUKSJONSDEPLOY

**Neste steg:** Følg oppgåve 1-6 ovanfor for å sette opp og deploye til tosom.no