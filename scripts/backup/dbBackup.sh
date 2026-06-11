#!/bin/bash
set -e
BACKUP_DIR="${BACKUP_DIR:-/backups/daily}"
DB_HOST="${POSTGRES_HOST:-prod-db-host}"
DB_NAME="${POSTGRES_DB:-tosom_prod}"
DB_USER="${POSTGRES_USER:-tosom_prod}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/tosom_prod_${TIMESTAMP}.sql.gz"
mkdir -p "${BACKUP_DIR}"
echo "== ToSom DB Backup =="
echo "Start: $(date)"
echo "DB: ${DB_NAME} on ${DB_HOST}"
pg_dump -h "${DB_HOST}" -U "${DB_USER}" -d "${DB_NAME}" -Fp --no-owner --no-privileges | gzip > "${BACKUP_FILE}"
FILE_SIZE=$(stat -c%s "${BACKUP_FILE}" 2>/dev/null || stat -f%z "${BACKUP_FILE}" 2>/dev/null)
if [ "${FILE_SIZE}" -gt 0 ] 2>/dev/null; then
  echo "Backup done: ${FILE_SIZE} bytes"
  find "${BACKUP_DIR}" -name "tosom_prod_*.sql.gz" -mtime +7 -delete
  exit 0
else
  echo "ERROR: Backup file empty or missing"
  exit 1
fi
