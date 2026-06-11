#!/bin/bash
# ToSom Rollback Script
# Koyrs med: bash scripts/deploy/rollback.sh [image-tag]
# Eksempel: bash scripts/deploy/rollback.sh v1.2.3
# Eller: bare rollback til forrige image utan argument

set -e

REGISTRY="${REGISTRY:-registry.tosom.no}"
CONTAINER_NAME="tosom-app"
DB_HOST="${POSTGRES_HOST:-prod-db-host}"
DB_NAME="${POSTGRES_DB:-tosom_prod}"
DB_USER="${POSTGRES_USER:-tosom_prod}"

IMAGE_TAG="${1:-}"

echo "== ToSom Rollback =="
echo "Start: $(date)"

# Finn forrige image tag viss ingen er oppgitt
if [ -z "${IMAGE_TAG}" ]; then
  echo "Finn forrige image..."
  IMAGE_TAG=$(ssh root@prod-server.tosom.no "docker images ${REGISTRY}/tosom --format '{{.Repository}}:{{.Tag}}' | grep -v prod | tail -1" | tr -d ' ')
  if [ -z "${IMAGE_TAG}" ]; then
    echo "FEIL: Kunne ikkje finne forrige image"
    exit 1
  fi
  echo "Forrige image: ${IMAGE_TAG}"
fi

# Stopp eksisterande container
echo "Stopp container..."
ssh root@prod-server.tosom.no "docker stop ${CONTAINER_NAME} || true"

# Start forrige image
echo "Start forrige versjon: ${IMAGE_TAG}"
ssh root@prod-server.tosom.no "docker run -d --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -e DATABASE_URL=\"\${DATABASE_URL}\" \
  -e NEXTAUTH_SECRET=\"\${NEXTAUTH_SECRET}\" \
  -e NEXTAUTH_URL=\"https://tosom.no\" \
  -e LOG_LEVEL=\"info\" \
  -e NODE_ENV=\"production\" \
  -e TOSOM_ENV=\"production\" \
  -e API_BASE_URL=\"https://api.tosom.no\" \
  -e FRONTEND_BASE_URL=\"https://tosom.no\" \
  -p 3000:3000 \
  ${REGISTRY}/tosom:${IMAGE_TAG}"

# Vent for startup
echo "Vent 15 sekund for startup..."
sleep 15

# Verifiser healthcheck
echo "Verifiser healthcheck..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://api.tosom.no/api/system/health 2>/dev/null || echo "000")

if [ "${HEALTH}" = "200" ]; then
  echo "OK: Healthcheck gronn (${HEALTH})"
  echo "Rollback ferdig: ${IMAGE_TAG}"
  exit 0
else
  echo "FEIL: Healthcheck returnerte ${HEALTH}"
  echo "Manuell inspektasjon nødvendig"
  exit 1
fi
