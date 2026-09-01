# Cron-jobbar — Dokumentasjon

**Oppdatert:** 31. juli 2026
**Versjon:** 1.1

---

## OVERSIKT

ToSom har cron-jobbar for:
- **Dagleg matching** (éin match per 24 timer, kl. 05:00 CET)
- **Journey-updates** (daglege oppdateringar, kl. 07:00 CET)

---

## STRUKTUR

```
app/api/cron/
├── matching/route.ts    # Cron-endepunkt for dagleg matching
└── journey/             # (kommande) Journey-updates
```

---

## DAGLEG MATCHING

**Køyr:** `GET /api/cron/matching?secret=<CRON_SECRET>`

**Funksjonar:**
1. Finn brukere uten aktiv match
2. Kjør matching-engine (`findBestResonance`) for hver bruker
3. Opprett match med score og explanation
4. Oppdater lastMatchAt (24t-regel)

**Tidspunkt:** Vercel cron kjører hver dag kl. 05:00 CET

---

## JOURNEY-UPDATES

**Køyr:** `GET /api/cron/journey` (kommande)

**Funksjonar:**
1. Hent aktive journeys
2. Oppdater phase (EARLY → BUILDING_TRUST → DEEPER → CHECKIN)
3. Generer dagleg innhold (refleksjon, prompt, oppgåve)
4. Update resonance

**Tidspunkt:** Vercel cron kjører hver dag kl. 07:00 CET

---

## KONFIGURASJON

Cron-jobbar er konfigurert i `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/matching",
      "schedule": "0 5 * * *"
    },
    {
      "path": "/api/cron/journey",
      "schedule": "0 7 * * *"
    }
  ]
}
```

---

## TEST

```bash
# Test cron matching lokalt (krever CRON_SECRET i .env.local)
curl 'http://localhost:3000/api/cron/matching?secret=din-cron-secret'

# Test cron journey
curl 'http://localhost:3000/api/cron/journey?secret=din-cron-secret'
```

---

## FEILFINDING

### "Cron failed"
- Sjekk logs i Vercel Dashboard → Functions → Cron Jobs
- Sørg for at `CRON_SECRET` er sett i Vercel environment variables

### "Ugyldig secret"
- Bruk korrekt `?secret=` parameter ved manuell testing
- I produksjon kjører Vercel cron automatisk uten manual kall

---

## HUSK

- Cron må være autentisert (CRON_SECRET)
- Ingen user-facing feilmeldingar
- Rate limit på cron-kallar
- Matching bare éin gong per 24t per bruker