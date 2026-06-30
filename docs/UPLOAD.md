# Uploadthing-integrasjon — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom brukar Uploadthing for fil-opplasting:
- **Profilbilete** (éi foto-url per brukar)
- **Bilede-sharing** etter 14 dagar i reise
- **Max filstorleik:** 5MB
- **MIME-types:** image/jpeg, image/png, image/webp

---

## KONFIGURASJON

```bash
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=tosom-app
```

---

## STRUKTUR

```
app/api/uploadthing/
├── core.ts        # Uploadthing router
└── route.ts       # API endpoint
```

---

## BRUK

### Profilbilete
```typescript
import { uploadServer } from '@/lib/uploadthing'

const result = await uploadServer(['/profile'])
// result[0].url → bilete-url
```

### Bilede-sharing (etter 14 dagar)
- Phase 1 (dag 1-14): Ingen bilede
- Phase 2 (dag 15+): Bilede tillatne
- Conversation.imageShareAllowedAt styrer tilgang

---

## SETUP

1. Opprett Uploadthing-konto
2. Kopier SECRET og APP_ID
3. Opprett router i app/api/uploadthing/core.ts
4. Test med bilete < 5MB

---

## FEILFINDING

### "Upload failed"
Sjekk filstorleik og MIME-type

---

## HUSK

- Max 1 bilete per profil
- Bilda er private (berre eigar ser)
- Bilede-sharing erstatt av AI-genererte bilete (valfritt)