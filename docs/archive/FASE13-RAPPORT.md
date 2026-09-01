# ToSom FASE 13 — Rapport: Produksjonsdeploy og Lansering

## Status: KLAR FOR GODKJENNING

---

## 1. Prod-miljo

**Status: KLAR**

Fullført:
- /docs/prod-env.md — Alle miljøvariablar, sikkerheitskrav, HTTPS/HSTS, sjekkliste
- /deploy/prod-config.json — Port, log-level, rate-limit, cache-ttl, sikkerheitsflagg
- /config/env.ts — Oppdatert med isProd og isPreprod støtte

Krav:
- Alle env-variablar er dokumenterte og listas opp med krav
- HTTPS og HSTS er spesifisert med korrekte verdier
- Sikkerheitsheaders er definerte

---

## 2. Backup og Restore

**Status: KLAR**

Fullført:
- /deploy/backup.md — Dagleg/ukentleg backup, 30 dagers retention, restore-prosess
- /scripts/backup/dbBackup.sh — pg_dump med timestamp og komprimering
- /scripts/backup/dbRestore.sh — Restore fra vald backup-fil

Krav:
- Dagleg backup kl. 03:00 CET
- Ukentleg full backup hverdag kl. 02:00
- Retention: 7 dager dagleg, 30 dager ukentleg
- Restore-prosess dokumentert steg-for-steg

---

## 3. Deploy-prosess

**Status: KLAR**

Fullført:
- /deploy/README.md — 10-stegs deploy-prosess med Docker, SSH, migreringar, verifikasjon
- /deploy/systemd.service — systemd-tjeneste-konfigurasjon med sikkerheitsoppsett
- /deploy/docker-compose.prod.yml — App, postgres, reverse-proxy med SSL-stotte

Krav:
- Stegvis prosess: bygg → push → SSH → stopp → trekk → migrer → start → verifiser → smoke → overvak
- Rollback-prosess inkludert i README.md

---

## 4. Monitoring

**Status: KLAR**

Fullført:
- /docs/post-deploy-monitoring.md — 24-timers overvaking med metrikk, alarm-nivå, sjekkliste
- /scripts/monitoring/quickCheck.ts — Health, latency, observability, security checks

Krav:
- Error-rate, latency, AI-kostnad, DB-latency, memory, CPU, rate-limit overvaka
- Alarm-kontakt definert for critical/high/medium/low
- QuickCheck.ts verifiserer alle kritiske endpoint

---

## 5. Rollback

**Status: KLAR**

Fullført:
- /docs/rollback.md — Rollback av Docker-image, DB, config, cache med steg-for-steg prosessar
- /scripts/deploy/rollback.sh — Automatisk rollback til forrige image

Krav:
- Docker-image rollback: funker
- DB rollback: backup restore eller prisma migrate resolve
- Config rollback: .env.prod og prod-config.json
- Rollback-sjekkliste med 7 steg

---

## 6. Launch-plan

**Status: KLAR**

Fullført:
- /docs/launch-plan.md — Lanseringsdato, trafikkforventingar, overvakingsplan, fallback, kommunikasjon, patch-runde
- /docs/launch-checklist.md — Komplett sjekkliste for pre-launch, launch-dag, og T+24 timer

Krav:
- T-2 timar → T-0 → T+15 min → T+1 time → T+6 timer → T+24 timer sjekkpunkt
- Fallback-plan for deploy-feil, AI-feil, DB-feil, sikkerheitsbrot
- Kommunikasjonsplan for internt og eksternt
- Launch-approvals (CTO, Tech Lead, DevOps)

---

## 7. Oppsummering

| Komponent | Status | Fil(er) |
|--|--|--|
| Prod-miljo | KLAR | /docs/prod-env.md, /deploy/prod-config.json, /config/env.ts |
| Backup/Restore | KLAR | /deploy/backup.md, /scripts/backup/dbBackup.sh, /scripts/backup/dbRestore.sh |
| Deploy | KLAR | /deploy/README.md, /deploy/systemd.service, /deploy/docker-compose.prod.yml |
| Monitoring | KLAR | /docs/post-deploy-monitoring.md, /scripts/monitoring/quickCheck.ts |
| Rollback | KLAR | /docs/rollback.md, /scripts/deploy/rollback.sh |
| Launch-plan | KLAR | /docs/launch-plan.md, /docs/launch-checklist.md |

---

## 8. Neste steg

- Ingen ny funksjonalitet er lagt til — bare drift, deploy og dokumentasjon
- Alle filer er klare for review
- **VENT PÅ GODKJENNING før faktisk deploy**
- Når godkjent: følg launch-checklist.md og deploy-prosess i deploy/README.md
