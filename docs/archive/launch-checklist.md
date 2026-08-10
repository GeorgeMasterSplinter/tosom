# ToSom Launch Sjekkliste

## Formål
Den endelege sjekklista som må vere ferdig utført før ToSom kan lanserast til produksjon.

---

## Pre-Launch Krav

### Readiness og Godkjenning
- [ ] READINESS_FOR_PROD = true (sjå /docs/readiness-gate.md)
- [ ] Alle komponentar i readiness-gate er OK:
  - Pre-prod: OK/FAIL
  - Smoke tests: OK/FAIL
  - Load tests: OK/FAIL
  - AI quota: OK/FAIL
  - Admin verification: OK/FAIL
  - Observability: OK/FAIL
  - Security: OK/FAIL

### Miljø og Konfigurasjon
- [ ] Prod-miljo er oppsett (sjå /docs/prod-env.md)
- [ ] Alle miljøvariablar er sette i secrets-manager
- [ ] DATABASE_URL peiker på produksjons-DB
- [ ] NEXTAUTH_SECRET er unik og trygg
- [ ] AI-nøkkel er ekte med høg kvote
- [ ] HTTPS er aktiv med gyldig sertifikat
- [ ] HSTS er konfigurert
- [ ] prod-config.json er oppdatert

### Backup og Restore
- [ ] Backup-korrekt konfigurert (/deploy/backup.md)
- [ ] Dagleg backup kjører automatisk
- [ ] Restore testet manuelt
- [ ] retention-policy er sett til 30 dagar
- [ ] backup/restore skript er testet

### Deploy Test
- [ ] Deploy testet i staging/pre-prod
- [ ] Docker-image bygg fungerer
- [ ] Container startar utan feil
- [ ] Migreringar køyrer utan feil
- [ ] Healthcheck returnerer 200

### Testing
- [ ] Smoke tests OK mot pre-prod
- [ ] Load tests innanfor tersklar
- [ ] AI quota test OK
- [ ] Admin-verifikasjon OK
- [ ] Observability OK
- [ ] Security OK
- [ ] Rollback testet

### Monitoring og Overvakning
- [ ] Observability-dashboard viser data
- [ ] Security-dashboard viser data
- [ ] QuickCheck.ts fungerer
- [ ] Alarm-kontakt er oppsett
- [ ] Overvakingsplan godkjent

### Dokumentasjon
- [ ] deploy/README.md oppdatert
- [ ] backup.md oppdatert
- [ ] rollback.md oppdatert
- [ ] launch-plan.md oppdatert
- [ ] post-deploy-monitoring.md oppdatert

---

## Launch-Dag Sjekkliste

### T-2 timar før launch
- [ ] Alle team-medlem informert
- [ ] Backup kjører og er verifisert
- [ ] Healthcheck gronn
- [ ] Ingen pågående incident

### T-1 time før launch
- [ ] Docker-image bygd og klar
- [ ] Admin-token er gyldig
- [ ] QuickCheck viser alle OK
- [ ] Fallback-plan er klar

### Deploy (T-0)
- [ ] Stopp eksisterande container
- [ ] Trekk nytt image
- [ ] Koy migreringar
- [ ] Start container
- [ ] Verifiser healthcheck
- [ ] Koy smoke tests

### T+15 min
- [ ] Alle smoke tests OK
- [ ] Admin dashboard fungerer
- [ ] Observability viser data
- [ ] Security dashboard viser data
- [ ] Ingen 500-feil

### T+1 time
- [ ] Error-rate < 1%
- [ ] Latens innanfor mål
- [ ] AI-kostnad innanfor budsjett
- [ ] Ingen uventa rate-limit

### T+6 timar
- [ ] Backup kjorer som forventet
- [ ] Ingen critical eller high-priority feil
- [ ] AuditLog viser normale handlingar

### T+24 timar
- [ ] Alle metrikk innanfor normal
- [ ] POST_DEPLOY_OK = true
- [ ] LAUNCH_APPROVED = true
- [ ] Etter-lans evaluering gjort

---

## Rollback Sjekkliste

Ved deploy-feil:
- [ ] Koyr rollback: bash scripts/deploy/rollback.sh
- [ ] Verifiser healthcheck
- [ ] Verifiser smoke tests
- [ ] Dokumenter feil og årsak
- [ ] Informer team

---

## Launch Approvals

| Roll | Namn | Signatur | Dato |
|--|--|--|--|
| CTO | George Iulian Stanica | George Iulian Stanica | 08.06.2026 |
| Tech Lead | George Iulian Stanica | George Iulian Stanica | 08.06.2026 |
| DevOps | George Iulian Stanica | George Iulian Stanica | 08.06.2026 |

**LAUNCH_APPROVED = false** (set til true etter signatur)

---

## Etter-lans Evaluering

| Felt | Verdi |
|--|--|
| LAUNCH_SUCCESS | false |
| Launch-dato | |
| Launch-kl | |
| Launch-av | |
| Evaluert av | |
| Evaluert kl | |
| Merknader | |

Set `LAUNCH_SUCCESS = true` når alle T+24-timars-krav er oppfylde.
