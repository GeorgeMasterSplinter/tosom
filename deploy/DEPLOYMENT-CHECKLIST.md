# ToSom v1.0 — Deployment Checklist

## ✅ Environment Setup (Production)

### Miljøvariabler som TRENGS på prod-server:
- [ ] `DATABASE_URL` — PostgreSQL connection string
- [ ] `DIRECT_URL` — Direct database URL (for migrations)
- [ ] `NEXTAUTH_SECRET` — Random 32+ char string (generate with `openssl rand -hex 32`)
- [ ] `NEXTAUTH_URL` — `https://tosom.no`
- [ ] `AI_API_KEY` — OpenAI/Anthropic API key
- [ ] `API_BASE_URL` — `https://api.tosom.no`
- [ ] `FRONTEND_BASE_URL` — `https://tosom.no`
- [ ] `UPLOADTHING_TOKEN` — UploadThing token (for file uploads)
- [ ] `NODE_ENV` — `production`
- [ ] `TOSOM_ENV` — `production`
- [ ] `LOG_LEVEL` — `info`

### Variabler som er valgfrie:
- [ ] `EMAIL_SERVER` — SMTP connection string (hvis magic link login)
- [ ] `EMAIL_FROM` — Sender email address
- [ ] `ENABLE_AI_LOGGING` — `true`
- [ ] `ENABLE_AUDIT_LOG` — `true`
- [ ] `RATE_LIMIT_WINDOW_MS` — `900000`
- [ ] `RATE_LIMIT_MAX_REQUESTS` — `100`

---

## ✅ Docker Build

### Steg 1: Bygg Docker image
```bash
cd /home/george/tosom
docker build -f Dockerfile -t tosom:prod .
```

### Steg 2: Tag og push til registry
```bash
docker tag tosom:prod registry.tosom.no/tosom:prod
docker push registry.tosom.no/tosom:prod
```

### Steg 3: Verifiser image
```bash
docker run -d --name tosom-test -p 3000:3000 tosom:prod
# Test i browser: http://localhost:3000
docker stop tosom-test && docker rm tosom-test
```

---

## ✅ Deployment til Server

### Steg 1: SSH inn på server
```bash
ssh root@prod-server.tosom.no
```

### Steg 2: Pull latest image
```bash
docker pull registry.tosom.no/tosom:prod
```

### Steg 3: Stop eksisterende container
```bash
docker stop tosom-app || true
docker rm tosom-app || true
```

### Steg 4: Kjør database migrations
```bash
docker run --rm \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e DIRECT_URL="${DIRECT_URL}" \
  registry.tosom.no/tosom:prod \
  npx prisma migrate deploy
```

### Steg 5: Start container
```bash
docker run -d \
  --name tosom-app \
  --restart unless-stopped \
  -e DATABASE_URL="${DATABASE_URL}" \
  -e NEXTAUTH_SECRET="${NEXTAUTH_SECRET}" \
  -e NEXTAUTH_URL="https://tosom.no" \
  -e AI_API_KEY="${AI_API_KEY}" \
  -e LOG_LEVEL="info" \
  -e NODE_ENV="production" \
  -e TOSOM_ENV="production" \
  -e API_BASE_URL="https://api.tosom.no" \
  -e FRONTEND_BASE_URL="https://tosom.no" \
  -p 3000:3000 \
  registry.tosom.no/tosom:prod
```

### Steg 6: Verifiser container kjører
```bash
docker ps | grep tosom-app
docker logs tosom-app --tail 50
```

---

## ✅ Post-Deploy QA

### Manual Testing (i browser)
- [ ] `https://tosom.no` — Landing page laster (premium UI)
- [ ] `https://tosom.no/login` — Login-side fungerer
- [ ] `https://tosom.no/onboarding` — Onboarding fungerer
- [ ] `https://tosom.no/dashboard` — Dashboard laster (etter login)
- [ ] `https://tosom.no/match` — Match-side fungerer
- [ ] `https://tosom.no/journey` — Journey-side fungerer
- [ ] `https://tosom.no/profile/edit` — Profil-edit fungerer
- [ ] `https://tosom.no/robots.txt` — Returns valid robots.txt
- [ ] `https://tosom.no/sitemap.xml` — Returns valid sitemap

### Health Check
```bash
curl https://api.tosom.no/api/system/health
# Forvent: {"status":"ok","database":"connected"}
```

### Smoke Tests
```bash
SMOKE_BASE_URL=https://api.tosom.no \
SMOKE_ADMIN_TOKEN="${ADMIN_TOKEN}" \
npx tsx scripts/smoke/smokeTest.ts
```

---

## ✅ DNS & SSL

### DNS Records
- [ ] A-record: `tosom.no` → Server IP
- [ ] A-record: `www.tosom.no` → Server IP
- [ ] A-record: `api.tosom.no` → Server IP

### SSL/Sertifikater
- [ ] HTTPS fungerer på alle domener
- [ ] Let's Encrypt sertifikat aktivt
- [ ] HSTS header aktiv (max-age=31536000)
- [ ] HTTP → HTTPS redirect fungerer

### Verifiser:
```bash
# Test HTTPS
curl -I https://tosom.no

# Test HSTS
curl -I https://tosom.no | grep strict-transport-security

# Test HTTP → HTTPS redirect
curl -I http://tosom.no | grep location
```

---

## ✅ Monitoring & Logging

### Health Check Endpoint
- [ ] `/api/system/health` returns `{"status":"ok","database":"connected"}`
- [ ] `/api/system/latency` returns latency metrics

### Admin Observability
- [ ] `/admin/observability/metrics` viser statistikk
- [ ] `/admin/observability/traces` viser requests
- [ ] `/admin/security/overview` viser ingen feil

### Error Tracking
- [ ] Sentry konfigurert (production)
- [ ] Log drains satt opp (stdout → journald/Loki)
- [ ] CPU/Memory alerts konfigurert

---

## ✅ Lighthouse (etter deploy)

### Run Lighthouse:
```bash
# Install lighthouse
npm install -g lighthouse

# Run against production
lighthouse https://tosom.no --view --chrome-flags="--headless"
```

### Target Scores:
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 100

---

## ✅ Rollback Procedure

Ved deploy-feil:
```bash
# Start forrige versjon
docker stop tosom-app
docker run -d --name tosom-app \
  -e DATABASE_URL="${DATABASE_URL}" \
  registry.tosom.no/tosom:$(git log -1 --format=%h)
```

---

## 📋 Deployment Summary

| Item | Status |
|------|--------|
| Environment variables | ✅ Configured in .env.example |
| Dockerfile | ✅ Production-ready |
| docker-compose.prod.yml | ✅ Configured with nginx proxy |
| systemd service | ✅ Configured for direct deploy |
| Deploy README | ✅ 10-steg prosess dokumentert |
| Rollback | ✅ Dokumentert |
| Health check | ✅ /api/system/health |
| Smoke tests | ✅ scripts/smoke/smokeTest.ts |

---

## 🚀 Cluster IP

Produksjonsserver IP: **[SETT INN SERVER IP]**

Registry: `registry.tosom.no/tosom:prod`