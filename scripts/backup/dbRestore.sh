#!/bin/bash
# ToSom DB Restore Script
# Koyrs med: bash scripts/backup/dbRestore.sh <backup-fil>
# Eksempel: bash scripts/backup/dbRestore.sh /backups/daily/tosom_prod_20260608_030000.sql.gz

set -e

if [ -z "$1" ]; then
  echo "Bruk: bash scripts/backup/dbRestore.sh <backup-fil>"
  echo "Eksempel: bash scripts/backup/dbRestore.sh /backups/daily/tosom_prod_20260608_030000.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"
DB_HOST="${POSTGRES_HOST:-prod-db-host}"
DB_NAME="${POSTGRES_DB:-tosom_prod}"
DB_USER="${POSTGRES_USER:-tosom_prod}"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "FEIL: Backup-fil finst ikkje: ${BACKUP_FILE}"
  exit 1
fi

echo "== ToSom DB Restore =="
echo "Backup-fil: ${BACKUP_FILE}"
echo "DB: ${DB_NAME} pa ${DB_HOST}"
echo "Start: $(date)"

# Dekomprimer og restore
if echo "${BACKUP_FILE}" | grep -q '\.gz$'; then
  gunzip -c "${BACKUP_FILE}" | psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}"
else
  psql -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" < "${BACKUP_FILE}"
fi

echo "Restore ferdig: $(date)"
echo ""
echo "Verifiser med:"
echo "  psql -h ${DB_HOST} -U ${DB_USER} -d ${DB_NAME} -c 'SELECT count(*) FROM users;'"