# Database-backups — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom har backup-system for produksjonsdatabasen:
- **Automatiske daglege backups**
- **Manuell restore-funksjon**
- **Backup-retensjon:** 30 dager

---

## KONFIGURASJON

```bash
# Backup-konfig
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE="0 2 * * *"  # 02:00 hver natt

# Database
DATABASE_URL=postgresql://...
```

---

## AUTOMATISKE BACKUPS

### Docker (prod)
```yaml
# deploy/docker-compose.prod.yml
volumes:
  - /backups:/backups
```

### Script
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > /backups/tosom_$DATE.sql.gz
find /backups -name "tosom_*.sql.gz" -mtime +30 -delete
```

---

## MANUELL RESTORE

```bash
# Finn nyaste backup
ls -t /backups/tosom_*.sql.gz | head -1

# Restore
gunzip -c /backups/tosom_20260630_020000.sql.gz | psql -h $DB_HOST -U $DB_USER $DB_NAME
```

---

## VERVEI I PRODUKSJON

1. Oppsett backup-volume: `mkdir -p /backups`
2. Legg til cron-jobb for daglege dump
3. Test restore månadsvis
4. Overvåk backup-størrelse

---

## FEILFINDING

### "No backup found"
Kør backup-script manuelt

---

## HUSK

- Test restore hver månad
- Encrypt backups i lagring
- Ikke lagre backups i same maskin
- Notifiser admin ved backup-feil