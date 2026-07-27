#!/bin/bash
# ToSom — Database Backup Skript
# Dagleg database backup med pg_dump
# Køyrs daily via cron: 0 3 * * * /path/to/scripts/db-backup.sh

set -euo pipefail

# =====================================================================
# Konfigurasjon
# =====================================================================

BACKUP_DIR="${TOSOM_BACKUP_DIR:-/var/backups/tosom}"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/tosom_${TIMESTAMP}.sql.gz"

# Hent DATABASE_URL frå miljøvariabel eller .env-fil
if [ -n "$DATABASE_URL" ]; then
    DB_URL="$DATABASE_URL"
elif [ -f ".env.prod" ]; then
    DB_URL=$(grep '^DATABASE_URL=' .env.prod | cut -d'=' -f2-)
else
    echo "FEIL: DATABASE_URL er ikkje konfigurert."
    exit 1
fi

# =====================================================================
# Lag backup-katalog dersom han ikkje eksisterer
# =====================================================================

mkdir -p "$BACKUP_DIR"

# =====================================================================
# Køyrs pg_dump med gzip-komprimering
# =====================================================================

echo "📦 Startar database backup..."
echo "   Mål: ${BACKUP_FILE}"
echo "   Database: ${DB_URL%%*@}"  # Skjul credentials

pg_dump "$DB_URL" | gzip > "$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup fullført: ${FILE_SIZE}"
else
    echo "❌ Backup mislukkast!"
    exit 1
fi

# =====================================================================
# Hald berre dei siste RETENTION_DAYS med backupar
# =====================================================================

echo "🧹 Rensar gamale backupar (>${RETENTION_DAYS} dagar)..."
find "$BACKUP_DIR" -name "tosom_*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "📋 Gjeldande backupar:"
ls -lah "$BACKUP_DIR"/tosom_*.sql.gz 2>/dev/null || echo "   Ingen backupar funne."

echo "✅ Backup-skript fullført."