#!/usr/bin/env bash
#
# ToSom Alpha-lansering (A-1)
# Kontrollert lansering med 5–20 brukere
#
set -euo pipefail

# ─── Farge / logging ───
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[A-1]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()  { echo -e "${RED}[ERR]${NC} $*"; }

# ─── 1. Forutsetninger ───
log "Steg 1: Forutsetninger"

if ! command -v psql &>/dev/null; then
  err "psql må vere installert"
  exit 1
fi

if ! command -v npx &>/dev/null; then
  err "npx/npm må vere installert"
  exit 1
fi

# ─── 2. Miljø-var sjekk ───
log "Steg 2: Miljø-var"

: "${TOSOM_ENV:?TOSOM_ENV er påkrava (production eller alpha)}"
: "${DATABASE_URL:?DATABASE_URL er påkrava}"

if [ "$TOSOM_ENV" != "production" ] && [ "$TOSOM_ENV" != "alpha" ]; then
  err "TOSOM_ENV må vere 'production' eller 'alpha'"
  exit 1
fi

# ─── 3. Database-tilkobling ───
log "Steg 3: Database-tilkobling"

ALPHA_DB="${DATABASE_URL}"
log "Bruker DATABASE_URL: ${ALPHA_DB%%@*}@<redacted>"

# Verifiser tilkobling
if ! psql "$ALPHA_DB" -c "SELECT 1;" &>/dev/null; then
  err "Kan ikkje kople til database"
  exit 1
fi
log "✅ Database-tilkobling OK"

# ─── 4. Prisma migrate ───
log "Steg 4: Prisma migrate"

npx prisma migrate deploy 2>&1 | tail -5
log "✅ Database-migrering ferdig"

# ─── 5. Admin-konto oppretting ───
log "Steg 5: Admin-konto"

ADMIN_EMAIL="${ADMIN_EMAIL:-admin@tosom.no}"

npx tsx scripts/alpha/createAdmin.ts 2>&1 <<EOF
{
  "email": "${ADMIN_EMAIL}",
  "password": "${ADMIN_PASSWORD:-AdminTosom2026!}"
}
EOF

log "✅ Admin-konto klar: ${ADMIN_EMAIL}"

# ─── 6. Demo-brukarar oppretting ───
log "Steg 6: Demo-brukarar"

DEMO_USERS="${DEMO_USERS:-10}"
log "Opprettar ${DEMO_USERS} demo-brukarar"

npx tsx scripts/alpha/createDemoUsers.ts 2>&1 <<EOF
{
  "count": ${DEMO_USERS},
  "password": "${DEMO_PASSWORD:-DemoTosom2026!}"
}
EOF

log "✅ ${DEMO_USERS} demo-brukarar oppretta"

# ─── 7. Deaktiver debug ───
log "Steg 7: Debug-logger"

if [ "$TOSOM_ENV" = "alpha" ] || [ "$TOSOM_ENV" = "production" ]; then
  log "✅ Debug er allereie deaktivert i prod-modus"
fi

# ─── 8. Miljø-oppsett ───
log "Steg 8: Miljø-oppsett"

cat > .env.alpha <<ALPHA_ENV
# ToSom Alpha Environment
NODE_ENV=production
TOSOM_ENV=alpha
DATABASE_URL="${ALPHA_DB}"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET:-alpha-secret-$(date +%s)}"
LOG_LEVEL=warn
ENABLE_AI_LOGGING=false
ENABLE_AUDIT_LOG=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALPHA_ENV

log "✅ .env.alpha oppretta"

# ─── 9. Build ───
log "Steg 9: Build"

npm run build 2>&1 | tail -5
log "✅ Build ferdig"

# ─── 10. Start ───
log "Steg 10: Start server"

log ""
log "=========================================="
log "  ToSom Alpha-lansering A-1"
log "=========================================="
log ""
log "  Admin:    ${ADMIN_EMAIL}"
log "  Brukarar: ${DEMO_USERS} demo-brukarar"
log "  URL:      http://localhost:3000"
log "  .env:     .env.alpha"
log ""
log "  Tilgjengelege sider:"
log "    /signup"
log "    /login"
log "    /onboarding"
log "    /dashboard"
log "    /chat"
log "    /journey"
log ""
log "  Observer utan å gripe inn!"
log ""
log "  Start med:"
log "    npm run dev -- -p 3000"
log ""
log "=========================================="
log ""