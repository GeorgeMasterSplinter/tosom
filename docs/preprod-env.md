# Pre‑prod Environment Setup

## Formål
Pre‑prod er eit eige miljø som speilar produksjon, men utan ekte brukarar eller ekte data. Det blir brukt til kvalitetssikring, testing og verifikasjon før deploy til produksjon.

## Miljøvariablar

Kryss alle nødvendige miljøvariablar:

| Variabel | Verdi | Merknad |
|------ ----|-----|-----|
| DATABASE_URL | postgresql://... | Eiga pre‑prod DB — aldri same som prod |
| NEXTAUTH_SECRET | tilfeldig streng | Unik for pre‑prod |
| NEXTAUTH_URL | https://preprod.tosom.no | Pre‑prod frontend URL |
| AI_API_KEY | dummy eller begrenset | Aldri prod‑AI‑nøklar |
| LOG_LEVEL | info | Aktiv logging |
| NODE_ENV | production | Production‑modus |
| TOSOM_ENV | preprod | Kjent for app-logikk |
| API_BASE_URL | https://api-preprod.tosom.no | Pre‑prod API URL |
| FRONTEND_BASE_URL | https://preprod.tosom.no | Pre‑prod frontend URL |
| PORT | 3000 | Standard port |

**Viktig:** Del aldri DB med produksjon. All data i pre‑prod er testdata og kan sletast kva som helst.

## Deploy‑prosess

### 1. Bygg appen
docker build -f deploy/docker/Dockerfile -t tosom:preprod .

### 2. Start serveren
docker run -d -e DATABASE_URL=postgresql://preprod-host/db -e NEXTAUTH_SECRET=unik -e NEXTAUTH_URL=https://preprod.tosom.no -e AI_API_KEY=dummy-key -e LOG_LEVEL=info -e NODE_ENV=production -e TOSOM_ENV=preprod -e API_BASE_URL=https://api-preprod.tosom.no -e FRONTEND_BASE_URL=https://preprod.tosom.no -p 3000:3000 tosom:preprod

### 3. Køyre migrasjonar
docker exec -it container-namn npx prisma migrate deploy

### 4. Verifisere healthcheck
curl https://api-preprod.tosom.no/api/system/health

Forventa respons:
{ status: ok, database: connected, timestamp: ... }

## URL‑struktur

| Komponent | URL |
|-- ----|- ---|
| API base URL | https://api-preprod.tosom.no |
| Frontend base URL | https://preprod.tosom.no |
| Healthcheck | https://api-preprod.tosom.no/api/system/health |
| Readiness | https://api-preprod.tosom.no/api/system/readiness |

## Testing

Før readiness‑gate skal desse testane køyrast mot pre‑prod:

1. Smoke tests:
   SMOKE_BASE_URL=https://api-preprod.tosom.no SMOKE_ADMIN_TOKEN=token npx tsx scripts/smoke/smokeTest.ts

2. Load tests:
   LOAD_BASE_URL=https://api-preprod.tosom.no LOAD_ITERATIONS=100 npx tsx scripts/load/basicLoadTest.ts

3. AI‑kvotetest:
   AI_API_KEY=dummy-key AI_TEST_BASE_URL=https://api-preprod.tosom.no npx tsx scripts/ai/aiQuotaTest.ts

## Sikkerheit

- Ingen ekte brukarar — pre‑prod er berre for testing
- Ingen ekte AI‑nøklar — bruk dummy-nøklar eller nøklar med låg kvote
- Ingen sensitiv data — all data kan sletast kva som helst
- Logging skal vere aktivert — sjå til at SystemLog fyller med WARN og ERROR

## Status

| Felte | Verd |
|------|----|
| PREPROD_READY | false |
| Sist verifisert | — |
| Verifisert av | — |

Set PREPROD_READY til true når:
- Healthcheck returnerer 200
- Smoke tests er grøne
- Load tests er innanfor tersklar
- Observability-dashboard viser data
- Security-dashboard viser ingen flagg
