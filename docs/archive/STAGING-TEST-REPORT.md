# ToSom — Staging Deploy & Test Report

**Dato:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 KLAR FOR STAGING DEPLOY

---

## OVERSIKT

Dette dokumentet inneheld guide for å setje opp og teste ToSom staging-miljøet, samt testrapport etter staging-deploy.

---

## OPPGAVE 1 — VERCEL STAGING-MILJØ

### Steg:

1. Gå til [vercel.com](https://vercel.com) → Your Project → Settings → Environments
2. Klikk "Add Environment" → "Staging"
3. Namn: `staging`
4. Preview URL: `https://staging.tosom.vercel.app`

### Environment Variables (kopier frå production, med staging-verdiar)

| Variable | Verdi | Merknad |
|---|---|--|
| `DATABASE_URL` | `postgresql://*staging*` | Egen staging-database |
| `DIRECT_URL` | `postgresql://*staging*` | Egen staging-database |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://staging***.supabase.co` | Egen staging-Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon-staging-key` | Egen staging-anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service-role-staging` | Egen staging-service role |
| `STRIPE_SECRET_KEY` | `sk_test_***` | Test mode |
| `STRIPE_WEBHOOK_SECRET` | `whsec_test_***` | Test webhook |
| `PUSHER_APP_ID` | `*staging*` | Egen staging-app |
| `PUSHER_KEY` | `*staging*` | Egen staging-key |
| `PUSHER_SECRET` | `*staging*` | Egen staging-secret |
| `PUSHER_CLUSTER` | `eu` | Same |
| `OPENAI_API_KEY` | `sk-***` | Samme som prod |
| `UPLOADTHING_SECRET` | `secret` | Samme |
| `UPLOADTHING_APP_ID` | `app-id` | Samme |
| `CRON_SECRET` | `cron-staging-secret` | Egen staging secret |
| `JWT_SECRET` | `jwt-staging-secret` | Egen staging JWT |
| `NEXT_PUBLIC_APP_URL` | `https://staging.tosom.vercel.app` | Staging URL |

---

## OPPGAVE 2 — STAGING-DATABASE

### 1. Opprett staging-database

1. Gå til [supabase.com](https://supabase.com)
2. Klikk "New Project"
3. Namn: `ToSom Staging`
4. Region: Europe (Frankfurt)
5. Database passord: `strong-staging-password`
6. Vent til prosjektet er klart

### 2. Connection String

1. Settings → Database → Connection string (Pool mode)
2. Kopier og set som `DATABASE_URL` i Vercel staging

### 3. Migrering

```bash
# Oppdater DATABASE_URL lokalt til staging
cp .env.production .env.staging
# Rediger DATABASE_URL til staging

# Kør migrering
npx prisma migrate deploy
```

---

## OPPGAVE 3 — STAGING-DEPLOY

### 1. Opprett staging branch

```bash
git checkout -b staging
git push origin staging
```

### 2. Vercel bygg automatisk

- Vercel detectar staging branch automatisk
- Gå til Vercel → Deployments → Sjekk at bygg er grønn

### 3. Verifiser

```bash
# Test staging URL
curl -I https://staging.tosom.vercel.app

# Test API
curl https://staging.tosom.vercel.app/api/health

# Test login
curl -X POST https://staging.tosom.vercel.app/api/auth/login
```

---

## OPPGAVE 4 — STAGING-TESTAR

### Test 1: Onboarding

| Steg | Status | Merknad |
|---|---|--|
| Opprett konto | ⏳ | |
| E-post verifisering | ⏳ | |
| Identity-fase | ⏳ | |
| Livssituasjon | ⏳ | |
| Livsstil | ⏳ | |
| Personlegdom | ⏳ | |
| Relasjonsstil | ⏳ | |
| Kommunikasjon | ⏳ | |
| Intimitet & nærheit | ⏳ | |
| Framtidsønsker | ⏳ | |
| Oppsummering | ⏳ | |
| Stepper fungerer | ⏳ | |

### Test 2: Matching

| Steg | Status | Merknad |
|---|---|--|
| Match generert | ⏳ | |
| Match-visning | ⏳ | |
| Resonans-score | ⏳ | |
| Aksepter match | ⏳ | |
| 30-dagers lås | ⏳ | |

### Test 3: Journey

| Steg | Status | Merknad |
|---|---|--|
| Journey startar | ⏳ | |
| Dag 1 tema | ⏳ | |
| Refleksjonsspørsmål | ⏳ | |
| Oppgåver | ⏳ | |
| Resonans måling | ⏳ | |
| Progresjon | ⏳ | |

### Test 4: Chat

| Steg | Status | Merknad |
|---|---|--|
| Chat lastar | ⏳ | |
| Send melding | ⏳ | |
| Motta melding | ⏳ | |
| Typing-indikator | ⏳ | |
| Partner presence | ⏳ | |
| Atmosphere lag | ⏳ | |
| Premium animations | ⏳ | |

### Test 5: AI-forslag

| Steg | Status | Merknad |
|---|---|--|
| Foreslå svar | ⏳ | |
| Refleksjon | ⏳ | |
| Forbedre profil | ⏳ | |
| AI-tone endrar | ⏳ | |

### Test 6: WarmFlow

| Mood | Status | Test |
|---|---|--|
| calm | ⏳ | standard |
| warm | ⏳ | match/melding |
| deep | ⏳ | refleksjon |
| gentle | ⏳ | onboarding |
| celebratory | ⏳ | milestone |

### Test 7: Admin Dashboard

| Seksjon | Status | Merknad |
|---|---|--|
| System helse | ⏳ | |
| Brukar-innsikt | ⏳ | |
| Moderering | ⏳ | |
| Freeze user | ⏳ | |
| Unfreeze user | ⏳ | |
| Reset journey | ⏳ | |
| Boost match | ⏳ | |

---

## OPPGAVE 5 — LOGGING OG FEILRAPPORT

### Funn

| # | Kva | Kvar | Alvor | Fikse status |
|---|---|---|---|---|
| 1 | — | — | — | — |

### Observasjonar

| # | Kva | Kvar | Prioritet |
|---|---|---|---|
| 1 | — | — | — |

---

## POST-TEST CHECKLIST

### Funktionel

- [ ] Onboarding flyt fungerer
- [ ] Matching fungerer
- [ ] Journey-fase oppdaterer
- [ ] Chat realtids-funksjonell
- [ ] AI-knappar returnerer forslag
- [ ] Admin dashboard visar data

### Teknisk

- [ ] Build grønn
- [ ] Ingen errors i Vercel logs
- [ ] Database tilkopling fungerer
- [ ] Supabase funker
- [ ] Stripe test betalingar funker
- [ ] Pusher realtids-oppdateringar
- [ ] AI API-kall fungerer

### UI/UX

- [ ] Atmosphere lag synleg
- [ ] WarmFlow fargar endrar med mood
- [ ] Premium message animations
- [ ] Partner presence indicator
- [ ] All responsivitet testet

---

## STAGING vs PRODUKSJON

| Komponent | Staging | Produksjon |
|---|---|---|
| Database | staging-db | prod-db |
| Supabase | staging-prosjekt | prod-prosjekt |
| Stripe | test mode | live mode |
| Pusher | staging-app | prod-app |
| URL | staging.tosom.vercel.app | tosom.vercel.app |
| Cron | deaktivert | aktiv |

---

## NESTE STEG ETTER STAGING

### Om alt testar grønt

1. Opprett main branch deploy
2. Kopier environment variablar til production
3. Bytt Stripe til live mode
4. Aktiver cron-jobbar
5. Deploy til produksjon

### Om det finst feil

1. Logg alle feil i "Funn"-tabellen
2. Fiks i staging først
3. Test på nytt
4. Deploy når alt grønt

---

## DEPLOYMENT COMMANDS

### Staging

```bash
git checkout -b staging
git push origin staging
```

### Produksjon (etter staging-test)

```bash
git checkout main
git pull origin main
git push origin main
```

---

**Dato:** 30. juni 2026
**Status:** 🟡 KLAR FOR STAGING DEPLOY

**Neste steg:** Følg oppgåve 1-4 ovanfor for å setje opp og teste staging.