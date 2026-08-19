# ToSom Deploy-dokumentasjon v2

**Versjon:** 2.0 · **Dato:** 11. august 2026
**Status:** Godkjent av George
**Formål:** Produksjonsdeploy, backup og monitorering for ToSom-plattformen

---

## 1. Nåtilstand — Deploy-innstillinger

### Eksisterende filer
| Fil | Formål | Status |
|-----|--------|--------|
| `docker-compose.yml` | Local development | ✅ Fungerer |
| `docker-compose.test.yml` | Test-miljø | ✅ Fungerer |
| `Dockerfile` | Next.js-container | ✅ Fungerer |
| `deploy/docker-compose.prod.yml` | Produksjons-stack | ✅ Eksisterer |
| `deploy/prod-config.json` | Prod-konfig | ✅ Eksisterer |
| `deploy/systemd.service` | Systemd-service-fil | ✅ Eksisterer |
| `deploy/README.md` | Deploy-instruks | ⚠️ Kan oppdateres |
| `vercel.json` | Vercel-config | ✅ Eksisterer |

### Nåværende deploy-mønster
- Docker-compose med Next.js app + PostgreSQL
- Systemd-service for automatisk restart
- Manuell deploy via SSH + docker-compose up -d

---

## 2. Måltilstand — Deploy v2

### 2.1 Produksjons-stack

```
┌─────────────────────────────────────────────┐
│            PRODUKSJONSMILJØ                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Nginx (reverse proxy + SSL)        │    │
│  │  :443 → nextjs:3000                 │    │
│  └─────────────┬───────────────────────┘    │
│                │                             │
│  ┌─────────────▼───────────────────────┐    │
│  │  Next.js (production build)         │    │
│  │  Container: tosom-next              │    │
│  │  Port: 3000                         │    │
│  │  ENV: NODE_ENV=production           │    │
│  └─────────────┬───────────────────────┘    │
│                │                             │
│  ┌─────────────▼───────────────────────┐    │
│  │  PostgreSQL                         │    │
│  │  Container: tosom-db                │    │
│  │  Port: 5432 (internal only)         │    │
│  │  Volume: /data/postgresql           │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  Cron Container                     │    │
│  │  Matching: 0 3 * * *                │    │
│  │  Journey: 0 0 * * *                 │    │
│  │  Cleanup: 0 4 * * 0                 │    │
│  └─────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘
```

### 2.2 Miljøvariabler (produksjon)

| Variabel | Verdi | Plakat |
|----------|-------|--------|
| `DATABASE_URL` | `postgresql://user:pass@db:5432/tosom` | docker-compose.prod.yml |
| `NEXTAUTH_SECRET` | 32-char random string | .env.production |
| `VIPPS_OAUTH_CLIENT_ID` | Vipps client ID | .env.production |
| `VIPPS_OAUTH_CLIENT_SECRET` | Vipps secret | .env.production |
| `OPENAI_API_KEY` | OpenAI API-nøkkel | .env.production |
| `NODE_ENV` | `production` | Dockerfile |
| `NEXT_PUBLIC_APP_URL` | `https://tosom.no` | .env.production |
| `ADMIN_EMAIL` | Admin email | .env.production |
| `ADMIN_PASSWORD_HASH` | Hashet passord | Settes ved init |

### 2.3 Deploy-prosess (manuell)

```bash
# 1. SSH til serveren
ssh prod@tosom.no

# 2. Pull ny kode
cd /opt/tosom
git pull origin main

# 3. Kjør database-migreringer
docker compose -f deploy/docker-compose.prod.yml run --rm nextjs npx prisma migrate deploy

# 4. Rebuild og restart
docker compose -f deploy/docker-compose.prod.yml up -d --build nextjs

# 5. Verifiser at alt fungerer
curl -s https://tosom.no/api/system/health | jq

# 6. Sjekk container-logs
docker compose -f deploy/docker-compose.prod.yml logs --tail=50 nextjs
```

### 2.4 Deploy-prosess (forbedret v2)

**Forslag — deploy-script:**

Opprett `scripts/deploy.sh`:

```bash
#!/bin/bash
set -euo pipefail

echo "🚀 ToSom Deploy starting..."

# Pull latest code
git pull origin main

# Install dependencies
npm ci --production

# Run database migrations
npx prisma migrate deploy

# Build Next.js
npm run build

# Restart via systemd
sudo systemctl restart tosom

# Verify health
sleep 3
curl -sf https://tosom.no/api/system/health | jq '.status'

echo "✅ Deploy complete!"
```

---

## 3. Backup-strategi

### 3.1 Database-backup (daglig)

**Forslag — cron-job for auto-backup:**

```bash
# Legges i crontab: 0 2 * * *
#!/bin/bash
BACKUP_DIR="/data/backups/tosom"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# Dump database
docker exec tosom-db pg_dump -U postgres tosom > "$BACKUP_DIR/db_$DATE.sql.gz"

# Behold kun de siste 14 dagene
find "$BACKUP_DIR" -name "db_*.sql.gz" -mtime +14 -delete

echo "Backup: $BACKUP_DIR/db_$DATE.sql.gz"
```

### 3.2 Backup-gjenoppretting

```bash
# Restore fra backup
docker exec -i tosom-db psql -U postgres tosom < /data/backups/tosom/db_20260811_020000.sql.gz
```

### 3.3 Offsite-backup

**Forslag — sync til cloud (valgfritt):**
- Rclone → Google Drive / S3
- Kjører samme cron som backup, men med `rclone copy` etter dump

---

## 4. Monitorering og Alerting

### 4.1 System-helse (eksisterende)

`GET /api/system/health` returnerer:
```json
{
  "status": "ok",
  "uptime": 86400,
  "memory": { "used": 524288, "total": 1048576 },
  "disk": { "used": 20480, "total": 102400 },
  "database": "connected"
}
```

### 4.2 DriftScore (nytt — se dokument 02)

Admin-panel viser samlet helserapport med:
- Database-tilgjengelighet (%)
- API-response tid (p50, p95, p99)
- Memory-bruk vs threshold
- Disk-bruk vs threshold
- Aktiv feilrate (feil per minute)

### 4.3 Alerting-forslag

| Hendelse | Metode | Mottaker |
|----------|--------|----------|
| DriftScore < 50 | Email | George |
| Database disconnected | Email + Slack (optional) | George |
| Disk > 85% | Email | George |
| Memory > 90% | Email | George |
| Feilrate > 10/min | Email | George |

---

## 5. SSL og Domene

### Let's Encrypt (Certbot)

```bash
# Opprett sertifikat
sudo certbot --nginx -d tosom.no -d www.tosom.no

# Auto-renewal (crontab)
0 3 * * 1 certbot renew --quiet
```

### Nginx-konfig (oppsummert)

```nginx
server {
    listen 443 ssl http2;
    server_name tosom.no www.tosom.no;

    ssl_certificate /etc/letsencrypt/live/tosom.no/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tosom.no/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name tosom.no www.tosom.no;
    return 301 https://$host$request_uri;
}
```

---

## 6. Security Checklist

- [x] HTTPS kun (HTTP redirect til HTTPS)
- [x] Database-port (5432) ikke eksponert offentlig
- [ ] Rate-limiting på API-ruter (i middleware/)
- [ ] CSRF-protection på auth-endepunkter
- [ ] Input-validering på alle POST/PATCH-ruter
- [x] Miljøvariabler ikke i git (.gitignore + .env)
- [ ] Automated deploys skal kreve manuell godkjenning (git branch protection)
- [ ] Database-backup krypteres før offsite-lagring

---

## 7. Qwen ACT-instruks

```
Når du jobber med deploy-relaterte endringer:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. IKKE kjør deploy-kommandoer mot produksjon uten eksplisitt godkjenning fra George
3. Alle nye .env-varianter skal dokumenteres i denne filen
4. Database-migrasjoner skal alltid testes lokalt før prod
5. Backup-script skal testes minst en gang før cron-settes opp
6. Deploy-script skal ha ROLLBACK-instruksjoner (dokumenter hvordan du rull tilbake)
```

---

*Slutt på Deploy-dokumentasjon v2.*