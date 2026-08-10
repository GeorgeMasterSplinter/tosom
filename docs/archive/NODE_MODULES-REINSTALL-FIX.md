# Node_modules Reinstall Fix

## Problemet

`npm run dev` ga feil som:
- `next: not found`
- `ENOENT: ... _document.js`
- `Failed to find Server Action`

## Løsning

### 1. Slett node_modules og package-lock.json
```bash
rm -rf node_modules
rm -f package-lock.json
```

### 2. Installer alt på nytt
```bash
npm install
```

**Resultat:**
- 846 packages installert
- Audittert 847 packages
- Varighet: 32 sekunder

### 3. Slett .next
```bash
rm -rf .next
```

### 4. Start dev-server
```bash
npm run dev
```

**Resultat:**
```
▲ Next.js 15.5.19
  - Local:        http://localhost:3000
  - Network:      http://192.168.10.184:3000
  - Environments: .env.local

✓ Starting...
✓ Ready in 1043ms
```

## Bekreftelse

Dev-serveren starter uten feil:
- ✅ Ingen "next: not found"
- ✅ Ingen "ENOENT: ... _document.js"
- ✅ Ingen "Failed to find Server Action"
- ✅ Next.js 15.5.19 kjører på localhost:3000

## Oppsummering

Problemet var forårsaket av korrupte eller manglende dependencies i `node_modules`.全-reinstall av dependencies løste alle problemer. Next.js starter nå korrekt og er klar for bruk.

## Dato

30. juni 2026