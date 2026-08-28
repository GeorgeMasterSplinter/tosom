#!/usr/bin/env bash
#
# install-hooks.sh — installerer git-kroker for ToSom.
#
# Kjør én gang etter kloning:
#   bash scripts/install-hooks.sh
#
# Kroken kjører språkvakten før push. Bakgrunn: nynorsk rakk to ganger å nå
# main (25.08 og 28.08) fordi vakten kun kjørte i CI. Andre gang havnet den i
# brukervendt tekst i produksjon. Siden CD er gated på grønn CI, blokkerte en
# rød språkvakt i tillegg all deploy.

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK_DIR="$REPO_ROOT/.git/hooks"

if [ ! -d "$HOOK_DIR" ]; then
  echo "✗ Fant ikke .git/hooks — kjør fra repo-roten."
  exit 1
fi

cat > "$HOOK_DIR/pre-push" <<'HOOK'
#!/usr/bin/env bash
# ToSom pre-push — språkvakt (bokmål). Installert av scripts/install-hooks.sh
echo "→ Språkvakt (bokmål)…"
if ! npm run --silent verify:lang; then
  echo ""
  echo "✗ Push stoppet: nynorsk funnet."
  echo "  Rett ordene over, eller bruk 'git push --no-verify' hvis du er sikker."
  exit 1
fi
HOOK

chmod +x "$HOOK_DIR/pre-push"
echo "✓ pre-push installert ($HOOK_DIR/pre-push)"
echo "  Kjører 'npm run verify:lang' før hver push."
