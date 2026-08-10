# Port 3000 Zombie Process Fix

**Dato:** 30. juni 2026  
**Status:** ✅ Løyst

---

## Problem

Port 3000 var blokkert av ein zombie-prosess som hindra Next.js dev-server i å starte.

```
LISTEN 0      511                              *:3000             *:*    users:(("next-server (v1",pid=764693,fd=24))
```

## Rotårsak

Fleire `npm run dev`-prosesser blei starta utan å bli korrekt stoppa. Dei blei att som zombie-prosessar som heldt på porten.

## Løysing

### 1. Drepe prosessar på port 3000

```bash
kill -9 764693 2>/dev/null
kill -9 767121 2>/dev/null
kill -9 769446 2>/dev/null
```

### 2. Verifisere at port er tom

```bash
ss -tlnp | grep 3000
# Inga utdata = port er tom
```

### 3. Restart dev-server

```bash
npm run dev
```

---

## Resultat

Next.js starta suksessfullt:

```
✓ Compiled /middleware in 93ms (115 modules)
 ○ Compiling / ...
 ✓ Compiled / in 2.4s (1477 modules)
 GET / 200 in 2725ms
LISTEN 0      511                              *:3000             *:*    users:(("next-server (v1",pid=781497,fd=24))
```

**URL:** http://localhost:3000

---

## Forebygging

For å unngå zombie-prosessar i framtida:

```bash
# Drepe alle node-prosessar før du startar dev-server
pkill -f "npm run dev" || true
pkill -f "next-server" || true

# Eller drepe spesifikt på port
sudo lsof -t -i:3000 | xargs kill -9