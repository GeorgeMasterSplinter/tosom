# Supabase-integrasjon — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom har Supabase-klienten oppsett:
- **Asset-lagring** (profilbilete, filer)
- **Kanonisk kilde** for storage
- **Fallback** til Uploadthing for bilede-opplasting

---

## KONFIGURASJON

```bash
SUPABASE_URL=https://tosom.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
```

---

## STRUKTUR

```
lib/supabase.ts    # Supabase client
```

---

## BRUK

```typescript
import { supabase } from '@/lib/supabase'

// Upload til bucket
const { data } = await supabase.storage
  .from('profiles')
  .upload(`${userId}/photo.jpg`, file)
```

---

## SETUP

1. Opprett Supabase-prosjekt
2. Opprett buckets: profiles, assets
3. Kopier URL og keys
4. Test upload med bilde

---

## FEILFINDING

### "Bucket not found"
Opprett bucket i Supabase dashboard

---

## HUSK

- Bruk anon-key i frontend
- Bruk service-key i server API
- Policy-reglar for tilgang