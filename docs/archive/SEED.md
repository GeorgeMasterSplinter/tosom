# Seed System — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom har et seed-system som oppretter realistiske testdata for utvikling og testing.

---

## BRUK

### Basic seed (3 brukere)
```bash
npx ts-node prisma/seeds/seed.ts
```

### Test-seed (10 brukere)
```bash
npx ts-node prisma/seeds/seed.ts test
```

### Full-seed (20 brukere + match + journey)
```bash
npx ts-node prisma/seeds/seed.ts full
```

---

## HVA BLIRD

| Data | Beskrivelse |
|--|--|
| **Brukere** | Bruker + profil med full djup profil |
| **Profiler** | 10+ dimensjonar (verdier, livssituasjon, kommunikasjon, intimitet, etc.) |
| **Matches** | En aktiv match med scoring og explanation |
| **Conversations** | En conversation knytt til matchen |
| **Journeys** | En journey med milestones |

---

## PROFIL-DATA

Hver profil inneholder:

| Dimensjon | Data |
|--|--|
| Basis | namn, alder, identitet |
| Livssituasjon | jobb, bosted, økonomi |
| Livsstil | aktivitetar, sosial preferanse |
| Personlighet | eigenskapar, styrkar, natur |
| Relasjonsstil | korleie en søker relasjon |
| Kommunikasjon | stil, djupde, konflikt |
| Intimitet | tilnærming, kjærleiksspråk |
| Framtid | mål, dealbreakers |
| Grenser | avstand, behov, limitar |
| Emosjonelt | behov, støtte-stil |
| Livsrytme | morning/evening/balanced |
| Modenheit | 1-10 skala |
| Trygghet | secure/ambivalent/unsicher |

---

## INSTALLASJON

```bash
# Sikker at bcryptjs er installert
npm install bcryptjs
```

---

## UTSKRIFT

```
🌱 ToSom Seed — mode: full

🌱 Seedar 20 brukere...
  ✅ Erik Hansen (test1@tosom.no) — alder: 34
  ✅ Ingrid Olsen (test2@tosom.no) — alder: 28
  ...

🌱 Totalt: 20 brukere oppretta

  ✅ Match: Erik Hansen ↔ Ingrid Olsen
  ✅ Conversation oppretta
  ✅ Journey starta (dag 5/30)

🌱 Seed-fullført! ✨
```

---

## FEILFINDING

### "Cannot find module 'bcryptjs'"
Installer bcryptjs:
```bash
npm install bcryptjs
```

### "Database connection failed"
Sjekk at databasen kjør og at DATABASE_URL er riktig

### "Duplicate key error"
Bruk seed med same email — den oppretter opp (upsert)

---

## HUSK

- Seed skriv IKKE over produksjonsdata
- Bruk `prisma db push --schema prisma/schema.prisma` først
- Seed bruker `upsert` — trygt å køre flere ganger