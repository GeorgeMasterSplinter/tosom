# ToSom Lanseringsplan

## 1. Formål
Dokumentet beskriver lanseringsplanen for ToSom-produksjon. Det inkluderer dato, trafikkforventingar, overvakingsplan, fallback-plan, kommunikasjon og første patch-runde.

## 2. Lanseringsdato

| Felt | Verdi |
|--|--|
| Planlagt lanseringsdato | [Fyll ut] |
| Lansert (true/false) | false |
| Lansert av | |
| Lansert kl | |

## 3. Trafikkforventingar

| Periode | Forventa brukere | API-kall/dag | Merknad |
|--|--|--|--|
| Dato 0-1 | 10-50 | < 1000 | Lansering, tidlege brukere |
| Dato 2-7 | 50-200 | < 5000 | Fierdare innkomst |
| Dato 8-30 | 200-1000 | < 20000 | Stabilisering |
| Dato 31+ | 1000+ | < 50000 | Normal drift |

## 4. Overvakingsplan

### Fyrste 72 timer (kritisk periode)
- **Kontinuerleg:** Observability-dashboard /admin/observability/metrics
- **Hver 30 min:** Healthcheck + quickCheck.ts de fyrste 6 timene
- **Hver time:** Security-dashboard /admin/security/overview
- **Hver 6 time:** AI-kostnad (billing dashboard)
- **Hver dag:** Backup-verifisering

### Alarm-nivå
| Nivå | Krav | Respons |
|--|--|--|
| Critical | System nede eller data tap | Umiddelbart (< 5 min) |
| High | Error-rate > 5% eller AI-kvota tom | Innen 15 min |
| Medium | Latens > 2x mål | Innen 1 time |
| Low | Advarsel (avvik uten feil) | Neste dag |

## 5. Fallback-plan

### Ved alvorleg deploy-feil (system nede > 30 min)
1. Koyr rollback: `bash scripts/deploy/rollback.sh`
2. Verifiser healthcheck
3. Send varsel til brukere (system message)
4. Dokumenter incident

### Ved AI-feil
1. Deaktiver AI: Set AI_API_KEY=""
2. Bruk fallback-tekster (manuelle AI-svar)
3. Fix AI-key eller provider
4. Reaktiver AI med ny key

### Ved DB-feil
1. Failover til standby-DB (dersom konfigurert)
2. Eller restore fra backup (se /deploy/backup.md)
3. Send varsel til brukere
4. Dokumenter incident

### Ved sikkerheitsbrotsm
1. Skjerm IP-er med uvanleg aktivitet
2. Revocere kompromittere token
3. Endre alle secrets (DB, AI, NEXTAUTH)
4. Dokumenter og rapporter

## 6. Kommunikasjonsplan

### Internt
| Kanal | Målgruppe | Frekvens |
|--|--|--|
| Slack (#tosom-deploy) | Utviklarsteam | Kontinuerleg de fyrste 72 timene |
| Email | Leadership | Dager 1, 3, 7 etter deploy |

### Eksternt
| Kanal | Målgruppe | Tilfelle |
|--|--|--|
| Status-side | Alle brukere | Systemdruft eller vedlikehald |
| Email | Alle brukere | Ved lengre avbrot (> 1 time) |
| App-notifikasjon | Aktive brukere | Ved vedlikehald |

## 7. Første patch-runde (72 timer etter launch)

### Dato 1-3: Kritiske feil
- [ ] Alle critical bugs fikset
- [ ] Alle high-priority bugs fikset
- [ ] Backup-verifisering gjort
- [ ] AI-funksjonalitet testet

### Dato 4-7: Important funksjonar
- [ ] Brukarfeedback integrert
- [ ] Performance-optimeringar
- [ ] Security-hardening (dersom behov)

### Dato 8-30: Stabilisering
- [ ] Alle medium-priority issues fikset
- [ ] Overvaking optimalisert
- [ ] Prosessdokumentasjon oppdatert

## 8. Launch-checkliste

- [ ] READINESS_FOR_PROD = true (se /docs/readiness-gate.md)
- [ ] Backup testet og fungerande
- [ ] Deploy testet i staging/pre-prod
- [ ] Smoke tests OK mot pre-prod
- [ ] Admin-verifikasjon OK
- [ ] Observability OK
- [ ] Security OK
- [ ] Rollback-test gjort
- [ ] Kommunikasjonsplan godkjent
- [ ] Overvakingsplan godkjent

## 9. Status

| Felt | Verdi |
|--|--|
| LAUNCH_APPROVED | false |
| Launch-fase | Ikke starta |
| Lansert | |
| Etter-lans evaluering | |

Set `LAUNCH_APPROVED = true` når alle krav i launch-checklista er oppfylde og leadership har godkjent lansering.
