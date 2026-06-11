# ToSom Backup & Restore-strategi

## 1. Formål
Dokumentet beskriver backup- og restore-prosess for ToSom-produksjon. Målet er å sikre at data kan restaureres ved databrest eller data tap.

## 2. Backup-strategi

### Daglig backup
- **Klokkeslett:** 03:00 CET (automatisk cron)
- **Type:** PostgreSQL full backup via pg_dump
- **Mål:** Lagrer alle tabellar og data
- **Format:** SQL med komprimering
- **Lagring:** /backups/daily/ på backup-server

### Ukentlig full backup
- **Klokkeslett:** Søndag kl. 02:00 CET
- **Type:** Full backup inkludert migreringar
- **Lagring:** Lagret i 30 dagar før rotasjon

## 3. Retention Policy

| Type | Lagring | Rengjering |
|------|---------|-----------|
| Dagleg backup | 7 dagar | Kvaidag |
| Ukentleg backup | 30 dagar | Kvart kvartal |
| Migreringar | 90 dagar | Manuell |

## 4. Restore-prosess

### Steg 1: Finn backup-fil
```bash
ls /backups/daily/
# Eksempel: tosom_prod_20260608.sql.gz
```

### Steg 2: Last ned backup til server
```bash
scp /backups/daily/tosom_prod_20260608.sql.gz root@prod-server:/tmp/
```

### Steg 3: Dekomprimer
```bash
gunzip -c /tmp/tosom_prod_20260608.sql.gz > /tmp/tosom_prod_restore.sql
```

### Steg 4: Test restore (først i staging)
```bash
psql -h staging-db -U tosom_prod -d tosom_prod < /tmp/tosom_prod_restore.sql
```

### Steg 5: Verifiser data
- Sjekk antal rader i nøkletabellar
- Sjekk at admin-login fungerer
- Verifiser at data er korrekt

### Steg 6: Restore i produksjon
```bash
psql -h prod-db -U tosom_prod -d tosom_prod < /tmp/tosom_prod_restore.sql
```

### Steg 7: Verifiser produksjon
- Healthcheck: `curl https://api.tosom.no/api/system/health`
- Admin dashboard
- AI-logs
- Observability

## 5. Test-sjekkliste

- [ ] Dagleg backup kjører automatisk
- [ ] Backup-verifisering (file size > 0)
- [ ] Restore test i staging kvart kvartal
- [ ] Backup-restore tid dokumentert (mål: < 30 min)
- [ ] Alarm ved failed backup

## 6. Disaster Recovery

Ved full systembrest:
1. Klargjer ny server
2. Last ned siste backup
3. Køy restore-prosess
4. Verifiser alle API-endepunkt
5. Oppdater DNS om nødvendig
6. Overvak i 60 min
