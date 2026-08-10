# CI/CD Pipeline — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom har nå en full CI/CD-pipeline med GitHub Actions som kjører:
- **Linting** (ESLint)
- **TypeScript typechecking**
- **Prisma schema-validering**
- **Next.js build**
- **Docker build og push**
- **Vercel deployment**
- **Post-deploy health check**

---

## PIPELINE-OVERSIKT

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   PR/Push    → │ Lint + Typecheck │ → │   Build      │
└──────────────┘    └──────────────┘    └──────────────┘
                                              ↓
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Health Check │ ← │  Docker Push │ ← │  Deploy Vercel│
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## FILER

| Fil | Beskrivelse |
|--|-|
| `.github/workflows/ci.yml` | CI-pipeline (lint, typecheck, build, test, prisma) |
| `.github/workflows/cd.yml` | CD-pipeline (Vercel deploy + Docker build/push) |

---

## AKKERDETS KRAV (SECRETS)

Sett opp følgende secrets i GitHub Repository Settings → Secrets and variables → Actions:

### Vercel
| Secret | Beskrivelse | Eksempel |
|--------|----|--------|
| `VERCEL_TOKEN` | Vercel API token | `vercel_tok_xxxx` |
| `VERCEL_ORG_ID` | Vercel org ID | `org_xxxxx` |
| `VERCEL_PROJECT_ID` | Vercel project ID | `prj_xxxxx` |

### Docker
| Secret | Beskrivelse | Eksempel |
|--------|----|--------|
| `DOCKER_USERNAME` | Docker Hub username | `tosomdev` |
| `DOCKER_PASSWORD` | Docker Hub password/token | `dckr_pat_xxxxx` |

### GitHub (automatisk)
| Secret | Beskrivelse | Eksempel |
|--------|----|--------|
| `GITHUB_TOKEN` | Automatisk generert | — |

---

## HVORDAN DET VIRKER

### CI (ved PR eller push til develop)

1. **Checkout** — Henter kode
2. **Setup Node.js** — Node 20 med npm cache
3. **Install dependencies** — `npm ci`
4. **Lint** — `npx next lint --max-warnings 0`
5. **TypeCheck** — `npx tsc --noEmit`
6. **Prisma Validate** — `npx prisma validate`
7. **Build** — `npx next build`
8. **Tests** — `npx jest` (med PostgreSQL test DB)

### CD (ved push til main/master)

1. **Deploy to Vercel** — `vercel deploy --prod`
2. **Docker Build & Push** — Multi-arch (amd64 + arm64)
3. **Health Check** — `curl https://tosom.no/api/system/health`

---

## MANUAL KJØRING

### CI pipeline
Gå til GitHub → Actions → "ToSom CI" → "Run workflow"

### CD pipeline
Gå til GitHub → Actions → "ToSom CD" → "Run workflow"

---

## VERCEL ENVIRONMENT VARIABLES

I Vercel settings, sett følgende miljøvariabler:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://tosom.no
DEV_LOGIN_ENABLED=false
AI_API_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
UPLOADTHING_SECRET=...
PUSHER_APP_ID=...
PUSHER_KEY=...
PUSHER_SECRET=...
PUSHER_CLUSTER=...
SUPABASE_URL=...
SUPABASE_KEY=...
LOG_LEVEL=info
```

---

## DOCKER IMAGE

Bygget til to registre:
- `docker.io/tosom/tosom`
- `ghcr.io/GeorgeMasterSplinter/tosom`

Tagging:
- `main` branch → `main`
- Commit SHA → `sha-abcdef12`
- Semver tags → `1.0.0`, `1.0`, `1`

---

## FEILFINDING

### "VERCEL_TOKEN is not set"
Gå til GitHub → Settings → Secrets and variables → Actions → og sett VERCEL_TOKEN

### "Docker login failed"
Sjekk at DOCKER_USERNAME og DOCKER_PASSWORD er riktig

### "Health check failed"
Vent 60s og prøv igjen. Vercel deployment kan ta noen minutter.

### "Build failed"
Sjekk build-logs i GitHub Actions. Vanlige feil:
- TypeScript-feil
- Manglende dependencies
- Prisma schema-feil

---

## BRUK I PRODUKSJON

```bash
# Push til main for auto-deploy
git push origin main

# Manual trigger av CD
GitHub → Actions → ToSom CD → Run workflow

# Rollback til tidligere deploy
GitHub → Actions → Velg tidligere run → Re-run
```

---

## SIKKERHET

- CI/CD kjører kun på main/master
- PRs trigger kun CI (ingen deploy)
- Secrets er aldri eksponert i logs
- Docker images er private (kun med auth)