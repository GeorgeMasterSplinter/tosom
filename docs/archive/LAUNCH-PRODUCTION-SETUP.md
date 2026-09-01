# ToSom — Produksjonsoppsettr

**Dato:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 KLAR FOR SETUP

---

## OVERSIKT

Dette dokumentet inneholder steg-for-steg guide for å sette opp ToSom-produksjonsmiljøet:
1. Vercel-prosjekt
2. Environment Secrets
3. Supabase-database
4. Stripe-betalingar
5. Pusher-realtime
6. Cron-jobbar
7. Første deploy
8. Validering

---

## OPPGAVE 1 — VERCEL-PROSJKT

### Steg:

1. Gå til [vercel.com](https://vercel.com)
2. Logg inn med GitHub
3. Klikk "New Project"
4. Importer repoet: `GeorgeMasterSplinter/tosom`
5. Konfigurer:

```
Framework: Next.js
Root Directory: /
Build Command: npm run build
Output Directory: .next
Development Command: npm run dev
```

6. Klikk "Deploy"

### Miljøvariablar (Environment Variables)

I Vercel → Settings → Environment Variables:

| Variable | Verdi | Miljø |
|---|---|---|
| `DATABASE_URL` | `postgresql://***` | Production |
| `DIRECT_URL` | `postgresql://***` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://***.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon-public-key` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `service-role-key` | Production |
| `STRIPE_SECRET_KEY` | `sk_live_***` | Production |
| `STRIPE_WEBHOOK_SECRET` | `whsec_***` | Production |
| `PUSHER_APP_ID` | `***` | All |
| `PUSHER_KEY` | `***` | All |
| `PUSHER_SECRET` | `***` | Production |
| `PUSHER_CLUSTER` | `eu` | All |
| `OPENAI_API_KEY` | `sk-***` | Production |
| `UPLOADTHING_SECRET` | `secret-key` | Production |
| `UPLOADTHING_APP_ID` | `app-id` | All |
| `CRON_SECRET` | `cron-secret-key` | Production |
| `JWT_SECRET` | `jwt-secret-key` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://tosom.vercel.app` | All |

---

## OPPGAVE 2 — ENV-FILER (commit til repoet)

### .env.production (skal IKKE committe)

```bash
# Kopier fra Vercel environment variables
# .env.production skal være lokalt, ikke i repoet
```

### .env.example (skal committe)

```bash
# DATABASE
DATABASE_URL=postgresql://user:password@localhost:5432/tosom
DIRECT_URL=postgresql://user:password@localhost:5432/tosom

# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key

# STRIPE
STRIPE_SECRET_KEY=sk_test_key
STRIPE_WEBHOOK_SECRET=whsec_key

# PUSHER
PUSHER_APP_ID=app-id
PUSHER_KEY=key
PUSHER_SECRET=secret
PUSHER_CLUSTER=eu

# AI
OPENAI_API_KEY=sk-key

# UPLOADTHING
UPLOADTHING_SECRET=secret
UPLOADTHING_APP_ID=app-id

# SECURITY
CRON_SECRET=cron-secret
JWT_SECRET=jwt-secret

# APP
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## OPPGAVE 3 — SUPABASE-DATABASE

### 1. Oppsett

1. Gå til [supabase.com](https://supabase.com)
2. Opprett nytt prosjekt
3. Vel region: Europe (Frankfurt)
4. Set passord for database
5. Vent til prosjektet er klart (5-10 min)

### 2. Connection String

1. Gå til Settings → Database
2. Kopier "Connection string" (Pool mode)
3. Lim inn som `DATABASE_URL` i Vercel

### 3. Migrering

```bash
# Lokalt
npx prisma migrate deploy

# Verifiser
npx prisma db pull
```

### 4. Valider

```bash
# Test connection
npx prisma db execute --stdin < prisma/schema.prisma

# List tables
npx prisma db seed
```

---

## OPPAVE 4 — STRIPE-BETALINGAR

### 1. Stripe Dashboard

1. Gå til [dashboard.stripe.com](https://dashboard.stripe.com)
2. Logg inn / Opprett konto
3. Aktiver betalingar

### 2. API Keys

1. Gå til Developers → API keys
2. Kopier "Secret key" → `STRIPE_SECRET_KEY`
3. Gå til Webhooks → Add endpoint
4. URL: `https://tosom.vercel.app/api/webhook/stripe`
5. Kopier webhook secret → `STRIPE_WEBHOOK_SECRET`

### 3. Produkt

1. Gå til Products → Katalog
2. Klikk "Add Product"
3. Namn: "ToSom Premium"
4. Pris:
   - `kr 99/månad` (Rekurerande)
   - `kr 299/kvartal` (Rekurerande)
   - `kr 999/år` (Rekurerande)
5. Aktiver produkt

### 4. Test Mode

1. Gå til Settings → Test mode
2. Bruk test-kort: `4242 4242 4242 4242`

---

## OPPAVE 5 — PUSHER-REALTIME

### 1. Pusher Dashboard

1. Gå til [pusher.com](https://pusher.com)
2. Logg inn / Opprett konto
3. Klikk "Create app"

### 2. App Konfigurasjon

```
Name: ToSom Production
Cluster: Europe (Frankfurt)
Environment: Production
```

### 3. Keys

1. Gå til "App Keys"
2. Kopier:
   - App ID → `PUSHER_APP_ID`
   - Key → `PUSHER_KEY`
   - Secret → `PUSHER_SECRET`
   - Cluster → `PUSHER_CLUSTER=eu`

### 4. Test

```bash
# Lokalt test med pusher-cli
npx pusher-channels-mqtt
```

---

## OPPAVE 6 — CRON-JOBAR

### Vercel Cron Jobs

1. Gå til Vercel → Your Project → Settings → Cron
2. Legg til nye cron-ruter:

### /api/cron/daily

```
CRON: 0 4 * * *
URL: https://tosom.vercel.app/api/cron/daily
Header: x-vercel-signature: ${CRON_SECRET}
```

**Formål:** Daily match-generering og daglege oppgaver

### /api/cron/cleanup

```
CRON: 0 3 * * *
URL: https://tosom.vercel.app/api/cron/cleanup
Header: x-vercel-signature: ${CRON_SECRET}
```

**Formål:** Rydd opp gamle sessionar og temp-filer

### /api/cron/analytics

```
CRON: 0 * * * *
URL: https://tosom.vercel.app/api/cron/analytics
Header: x-vercel-signature: ${CRON_SECRET}
```

**Formål:** Timerleg analytics-samling

---

## OPPAVE 7 — FØRSTE DEPLOY

### Steg:

1. **Push til main**
   ```bash
   git add .
   git commit -m "Setup: Complete production environment"
   git push origin main
   ```

2. **Vercel bygg automatisk**
   - Gå til Vercel → Deployments
   - Sjekk at bygg er grønn

3. **Verifiser**
   ```bash
   # Test prod URL
   curl -I https://tosom.vercel.app
   
   # Test API
   curl https://tosom.vercel.app/api/health
   
   # Test db connection
   # Sjekk Vercel logs for DB-feil
   ```

4. **Custom Domain**
   - Gå til Settings → Domains
   - Legg til: `tosom.no` (eller ønska domene)
   - Opprett DNS A-record:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     ```

---

## OPPAVE 8 — PRODUKSJONSVALIDERING

### Sjekkliste

- [ ] Vercel bygg grønn (ingen errors)
- [ ] Alle environment variables importerte
- [ ] Database tilkopla (prisma migrate deploy)
- [ ] Stripe produkt oppretta
- [ ] Pusher app aktiv
- [ ] Cron-jobbar aktive
- [ ] Custom domain konfigurert
- [ ] SSL sertifikat aktivert
- [ ] First test-kjøp gjennomført
- [ ] Realtime chat fungerer
- [ ] AI-knapper funksjonelle
- [ ] Admin dashboard tilgjengeleg
- [ ] Onboarding-flow test
- [ ] Journey-fase test
- [ ] Match-generering test

### Monitoring

1. **Vercel Analytics**
   - Gå til Vercel → Analytics
   - Sjekk pageview og API-latency

2. **Sentry** (valfritt)
   - Gå til sentry.io
   - Opprett nytt prosjekt
   - Legg til `SENTRY_DSN` som environment variable

3. **Uptime**
   - Gå til uptimerobot.com
   - Opprett ny monitor for `https://tosom.vercel.app`

---

## DEPLOYMENT CHECKLIST

### Før deploy

- [ ] `.env.production` ikke committe
- [ ] Alle secrets i Vercel
- [ ] Database migrerte
- [ ] Test-knopar i Stripe
- [ ] Pusher app aktiv

### Under deploy

- [ ] Vercel bygg starta
- [ ] Ingen errors i logg
- [ ] Prisma migrate vellykka

### Etter deploy

- [ ] Hovedside lastar
- [ ] Login fungerer
- [ ] Onboarding fungerer
- [ ] Chat lastar
- [ ] Match viser
- [ ] Cron-jobbar køyrer

---

## PROBLEM-LØYSING

### Build feil

```bash
# Tøm cache og bygg på nytt
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

### Database tilkoplingsfeil

```bash
# Sjekk DATABASE_URL i Vercel
# Verifiser IP allowlist i Supabase
# Test locally: npx prisma db pull
```

### Stripe webhook feil

```bash
# Test lokalt med Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

### Pusher feil

```bash
# Test med pusher-cli
npx pusher-channels-mqtt --app_id=X --key=X --secret=X --cluster=eu
```

---

## MONITORING AFTER LAUNCH

### Dagleg

- [ ] Sjekke Vercel logs for errors
- [ ] Validera cron-jobbar køyrer
- [ ] Sjekk Stripe dashboard for betalingar

### Vekentleg

- [ ] Analyse brukartal
- [ ] Test alle ruter
- [ ] Backup database

### Månadsleg

- [ ] Oppdater dependencies
- [ ] Review security
- [ ] Analyze bruker-innsikt

---

## PROSJEKTSTATISTIKK

| Mål | Verdi |
|---|---|
| Totalt filer | 62 |
| Build tid | 3.8 sek |
| Komponentar | 40+ |
| API-ruter | 20+ |
| Dokumentasjon | 60+ |

---

**Dato:** 30. juni 2026
**Status:** 🟡 KLAR FOR PRODUKSJONSOPPSETT

**Neste steg:** Follow oppgavene 1-8 ovanfor for å sette opp fullt produksjonsmiljø.