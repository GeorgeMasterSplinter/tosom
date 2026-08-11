# 🔒 ToSom — Post-Launch Hardening

## Fase 7: Etter launch — overvåking og hardning

### Umiddelbart etter deploy (første 24 timer)

#### ✅ Overvåk disse metricene

| Metrik | Verktøy | Terskel for eskalering |
|--------|---------|----------------------|
| HTTP 5xx feilrate | /admin/observability/metrics | >1% av total trafikk |
| API-latens (p95) | /admin/observability/metrics | >2000ms |
| Database-forbindelser | pg_stat_activity | >80% av max_connections |
| CPU/Memorybruk | docker stats / systemd | >80% vedvarende |
| Disk-plass | df -h på server | <10GB ledig |

#### ✅ Sjekk disse filene

```bash
# System logs (systemd)
journalctl -u tosom --since "30 minutes ago" --no-pager

# Docker logs
docker logs tosom-app --since 30m

# Next.js runtime errors (hvis Sentry er aktivert)
curl https://tosom.no/api/system/health
```

---

### Første uke etter launch

#### 📋 Manuel sjekkliste

- [ ] **Ingen backdoor-ruter igjen**
  ```bash
  # Verifiser at disse rутene ikke finnes
  grep -r "super-login\|dev-api/test" app/api/ --include="*.ts"
  ```

- [ ] **Dealbreaker fungerer korrekt**
  ```bash
  npx tsx scripts/verify-matching.ts
  # Alle 4 tester skal passere
  ```

- [ ] **Databasebackup kjører daglig**
  ```bash
  # Legg til i crontab (server)
  0 2 * * * cd /path/to/tosom && docker run --rm -e DATABASE_URL="..." registry.tosom.no/tosom:prod npx tsx scripts/db/backup.ts >> /var/log/tosom-backup.log 2>&1
  ```

- [ ] **Rate limiting fungerer**
  ```bash
  # Test med raske gjentakende kall
  for i in {1..50}; do curl -s -o /dev/null -w "%{http_code}\n" https://tosom.no/api/match; done
  # Skal se 429-respons etter en stund
  ```

- [ ] **CSP headers er på plass**
  ```bash
  curl -I https://tosom.no | grep -i content-security-policy
  ```

---

### Kontinuerlig (hver uke)

#### 🔄 Automatisering

| Oppgave | Frekvens | Verktøy |
|---------|----------|---------|
| Databasebackup | Daglig (02:00) | cron + backup.ts |
| Log-rotasjon | Ukentlig | logrotate / journalctl --vacuum-time=7d |
| Sårbarhetsscan | Ukentlig | npm audit / trivy |
| Avhengighetsoppgradering | Ukentlig | npm outdated |
| Prisma migreringer verifisering | Ved behov | `npx prisma migrate status` |

#### 📊 Ukentlig rapport-sjabelon

```
Date: YYYY-MM-DD
Deploy hash: <git rev-parse --short HEAD>

Metrics (forrige 7 dager):
  Total requests: 
  Error rate (5xx): %
  Avg latency (p95): ms
  Active users: 
  Matches made: 

Security:
  Failed login attempts (24h): 
  Rate-limited IPs (24h): 
  CSP violations: 

Database:
  Size: MB
  Backup status: ✅/❌
  Connection pool usage: %

Issues found:
  - 
  
Action items:
  - 
```

---

### Eskaleringsprosedure

#### Kritisk feil (>5% feilrate eller nedetid)

1. **Rollback umiddelbart**
   ```bash
   docker stop tosom-app
   docker run -d --name tosom-app \
     -e DATABASE_URL="${DATABASE_URL}" \
     registry.tosom.no/tosom:$(git log -2 --format=%h | tail -1)
   ```

2. **Verifiser helse**
   ```bash
   curl https://tosom.no/api/system/health
   ```

3. **Varsl teamet** (Slack/e-post)

4. **Debug i ro** — repliker feilen lokalt før fix

#### Moderate feil (1-5% feilrate)

1. Dokumenter feilen i GitHub Issues
2. Fiks innen 24 timer
3. Test med `npx tsx scripts/verify-matching.ts`
4. Deploy fix som patch-release

#### Minorske feil (<1%)

1. Legg på backlog
2. Fix i neste sprint
3. Sørg for at brukerpåvirkning er minimal

---

### Opprydding etter Fase 1-6

Følgende filer fra arbeidet kan arkiveres eller fjernes:

```bash
# Arkiver rapportene til docs/archive/
mv TOSOM_DUPLICATE_ANALYSIS_REPORT.md docs/archive/ 2>/dev/null
mv TOSOM_READINESS_REPORT.md docs/archive/ 2>/dev/null
mv MOTION_21_REPORT.md docs/archive/ 2>/dev/null

# Fjern dev-database (valgfritt)
rm prisma/dev.db prisma/dev.db-journal 2>/dev/null

# Fjern arkiverte root-filer dersom de ikke lenger trengs
# rm -rf docs/archive/root-cleanup/
```

---

### Siste sjekkliste før "produsert" ✅

- [ ] Databasebackup automatisk (cron)
- [ ] Log-rotasjon aktivt
- [ ] Monitoring/varsel konfigurert
- [ ] Rollback-testet og verifisert
- [ ] `npx tsx scripts/verify-matching.ts` passer på prod
- [ ] Ingen secrets eksponert i logs eller .git
- [ ] `.env.prod` beskyttet (kun tilgjengelig på server)
- [ ] CSP headers verifisert
- [ ] Rate limiting testet
- [ ] Dealbreaker-funksjon verifisert mot prod-database