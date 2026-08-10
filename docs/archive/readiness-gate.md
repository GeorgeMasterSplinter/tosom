# Readiness Gate (Pre-prod -> Prod)

## 1. Formål
Dokumentet skal fungere som siste kontrollpunkt før ToSom kan settes i produksjon. Alle tester, dashboards og sikkerhetsmekanismer må være grønne før lansering.

---

## 2. Forutsetninger
Følgende må være fullført:

| Fil | FASE | Mål |
|---|---|---|
| /docs/preprod-env.md | 12 | Pre-prod miljø er oppsett |
| /scripts/smoke/smokeTest.ts | 12 | Smoke tests verifiserer kritiske endpoint |
| /scripts/load/basicLoadTest.ts | 12 | Load tests måler stabilitet under trykk |
| /scripts/ai/aiQuotaTest.ts | 12 | AI-endepunkt og kvote er verifisert |
| /docs/admin-verification.md | 12 | Admin-panelet er testet |
| /docs/observability-security-check.md | 12 | Observability og security er verifisert |

---

## 3. Readiness-sjekkliste

### Pre-prod miljø
- [ ] Pre-prod kjører uten feil
- [ ] Healthcheck OK
- [ ] Migreringer er kjørt
- [ ] Logging aktiv

### Smoke tests
- [ ] Alle endpoint returnerer 200 OK
- [ ] Ingen FAIL i smokeTest.ts

### Load tests
- [ ] p95 messaging < 500ms
- [ ] p95 AI < 800ms
- [ ] error-rate < 5%
- [ ] Ingen 500-feil

### AI-kvote test
- [ ] Normal-kall OK
- [ ] Rate-limit trigges minst én gang
- [ ] Feilhåndtering gir korrekt statuskode
- [ ] AIRequestLog fylles

### Admin-verifikasjon
- [ ] Admin login OK
- [ ] System dashboard OK
- [ ] Observability OK
- [ ] Security dashboard OK
- [ ] AI logs OK
- [ ] Admin actions OK
- [ ] AuditLog oppdateres

### Observability & Security
- [ ] Metrics viser trafikk
- [ ] Heatmap viser ruter
- [ ] Traces viser traceId
- [ ] Security overview OK
- [ ] Brute-force fungerer
- [ ] Sensitiv data maskeres
- [ ] Security headers aktive

---

## 4. Endelig vurdering

| Komponent | Status | Kommentar |
|--|---|--|
| Pre-prod | OK / FAIL | |
| Smoke tests | OK / FAIL | |
| Load tests | OK / FAIL | |
| AI quota | OK / FAIL | |
| Admin verification | OK / FAIL | |
| Observability | OK / FAIL | |
| Security | OK / FAIL | |

---

## 5. Konklusjon
**READINESS_FOR_PROD = false**  
(Settes til true når ALLE komponenter er OK)

---

## 6. Neste steg
Når READINESS_FOR_PROD = true:

1. Oppdater /deploy/README.md med produksjonssteg  
2. Klargjør backup  
3. Forbered manuell produksjonsdeploy  

### Produksjonsdeploy-steg
1. Bygg Docker-image: `docker build -f deploy/docker/Dockerfile -t tosom:prod .`
2. Push til container register
3. Deploy til produksjonsinfra
4. Kjør migreringer: `npx prisma migrate deploy`
5. Verifiser healthcheck mot prod
6. Kjør smoke tests mot prod
7. Overvåk observability-dashboard i 30 min
8. Verifiser security-dashboard (ingen nye flagg)

---

## 7. Merknad (Sprint 0 — Dag 2)
READINESS_FOR_PROD settes til true når:
- Prod-miljø = OK
- Domene og SSL = OK
- Alle andre kategorier = OK
