# Cron-jobbar — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom har cron-jobbar for:
- **Dagleg matching** (éin match per 24 timer)
- **Journey-updates** (daglege oppdateringar)
- **Resonance-tracking** (dagleg resonansmåling)

---

## STRUKTUR

```
app/api/cron/
└── matching/route.ts    # Cron-endepunkt for dagleg matching
```

---

## DAGLEG MATCHING

Køyr: `GET /api/cron/matching`

Funksjonar:
1. Finn brukarar utan aktiv match
2. Kjør matching-engine for kvar brukar
3. Opprett match med score og explanation
4. Send notifikasjon til brukar
5. Oppdater lastMatchAt

---

## JOURNEY-UPDATES

Køyr: `GET /api/journey/today`

Funksjonar:
1. Hent aktive journeys
2. Oppdater phase (EARLY → BUILDING_TRUST → DEEPER → CHECKIN)
3. Generer dagleg innhald (refleksjon, prompt, oppgåve)
4. Update resonance

---

## SETTING OPP I PRODUKSJON

### Vercel Cron
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/matching",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Alternativ: GitHub Actions
```yaml
# .github/workflows/cron-matching.yml
on:
  schedule:
    - cron: '0 9 * * *'  # 09:00 CET
jobs:
  matching:
    runs-on: ubuntu-latest
    steps:
      - name: Run matching cron
        run: curl https://tosom.no/api/cron/matching
```

---

## TEST

```bash
# Test cron manually
curl https://tosom.no/api/cron/matching
curl https://tosom.no/api/journey/today
```

---

## FEILFINDING

### "Cron failed"
Sjekk logs i Vercel/Console

---

## HUSK

- Cron må vere autentisert (API-key header)
- Ingen user-facing feilmeldingar
- Rate limit på cron-kallar