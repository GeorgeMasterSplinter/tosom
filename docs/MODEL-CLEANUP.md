# Model Cleanup — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

Dette dokumentet gir en oversikt over hvilke Prisma-modeller som er markert som **deprecated** og hva som bør gjøres med dem.

---

## DEPRECATED MODELLER

### 1. MatchQueue

**Status:** ❌ MERKET SOM DEPRECATED
**Bruk i kode:** Ingen (kun i User-relasjoner)
**Anbefaling:** FJERN fullstendig

```prisma
// Fjern fra prisma/schema.prisma:
/// DEPRECATED – not used in codebase (Phase 4)
model MatchQueue {
   id        String        @id @default(cuid())
  userId    String
  status    QueueStatus   @default(PENDING)
  createdAt DateTime      @default(now())

  user      User          @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

**Før fjerning:**
1. Fjern `matchQueues MatchQueue[]` fra User-modellen
2. Slett modelldefinisjonen
3. Slett eventuelle migreringer

---

### 2. MatchFeedback

**Status:** ❌ MERKET SOM DEPRECATED
**Bruk i kode:** Brukt i `lib/matching/feedback.ts` (men kan erstattes med MatchInsight)
**Anbefaling:** ERSATT med MatchInsight

```prisma
// Fjern fra prisma/schema.prisma:
/// DEPRECATED – not used in codebase (Phase 4)
model MatchFeedback {
   id        String   @id @default(cuid())
  matchId   String
  userId    String
  rating    Int
  reason    String?
  createdAt DateTime @default(now())

  match     Match    @relation(fields: [matchId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@index([matchId])
  @@index([userId])
  @@index([rating])
}
```

**Før fjerning:**
1. Fjern `matchFeedbacks MatchFeedback[]` fra User-modellen
2. Fjern `feedbacks MatchFeedback[]` fra Match-modellen
3. Slett modelldefinisjonen
4. Oppdater `lib/matching/feedback.ts` til å bruke MatchInsight istedenfor

---

### 3. MatchHistory

**Status:** ⚠️ DEPRECATED, men har egen lib (`lib/matchHistory.ts`)
**Bruk i kode:** `lib/matchHistory.ts`
**Anbefaling:** BEHOLD eller flytt til MatchInsight

**Valgfritt:** Hvis `lib/matchHistory.ts` brukes, behold modellen eller migrer til `MatchInsight`.

---

### 4. SystemMessage

**Status:** ⚠️ DEPRECATED, men har aktiv bruk i koden
**Bruk i kode:** `lib/createSystemMessage.ts`, `lib/system/systemMessages.ts`, `lib/system/messages.ts`
**Anbefaling:** BEHOLD (ikke faktisk deprecated)

Dette er **IKKE faktisk deprecated** — det er mye logikk som bruker denne typen.
Enten fjern alle referanser først, eller fjern "deprecated"-merketing.

**Anbefaling:** Fjern kun "deprecated"-merketinget siden modellen faktisk brukes.

---

### 5. RateLimitLog

**Status:** ❌ MERKET SOM DEPRECATED
**Bruk i kode:** Ingen direkte referanser
**Anbefaling:** FJERN fullstendig

```prisma
// Fjern fra prisma/schema.prisma:
/// DEPRECATED – not used in codebase (Phase 4)
model RateLimitLog {
   id        String   @id @default(cuid())
  userId    String?
  route     String
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([route])
  @@index([createdAt])
}
```

**Før fjerning:**
1. Slett modelldefinisjonen
2. Ingen relasjoner å oppdatere

---

### 6. RouteHit

**Status:** ❌ MERKET SOM DEPRECATED
**Bruk i kode:** `lib/system/heatmap.ts` (recordRouteHit funksjon)
**Anbefaling:** VURDER — har varm funksjon

Hvis `lib/system/heatmap.ts` er i bruk, behold modellen eller migrer til `PerformanceMetric`.

---

## ANNET — MODELLER SOM BØR REVISJONERES

### SystemMessageType enum

**Bruk:** `lib/system/messages.ts`
**Anbefaling:** Behold (brukt aktivt)

---

## HANDLINGSPLAN

### Fase 1: Trygg fjerning (ingen avhengigheter)

| Modell | Handling | Risiko |
|--------|----------|--------|
| MatchQueue | Fjern fullstendig | Lav |
| RateLimitLog | Fjern fullstendig | Lav |

### Fase 2: Erstattning (krever kodeendringer)

| Modell | Handling | Risiko |
|--------|----------|--------|
| MatchFeedback | Erstatt med MatchInsight | Midt |

### Fase 3: Revurdering ( faktisk i bruk)

| Modell | Handling | Risiko |
|--------|----------|--------|
| SystemMessage | Fjern deprecated-merking | Lav |
| MatchHistory | Behold eller migrer til MatchInsight | Midt |
| RouteHit | Behold eller migrer til PerformanceMetric | Lav |

---

## KOMMANDOER FJERNING

```bash
# 1. Slett modeller fra schema.prisma
# 2. Generer ny Prisma Client
npx prisma generate

# 3. Slett gamle tabeller fra database (MANUELT!)
docker exec -it tosom_dev_db psql -U tosom -d tosom_dev -c "DROP TABLE IF EXISTS MatchQueue CASCADE;"
docker exec -it tosom_dev_db psql -U tosom -d tosom_dev -c "DROP TABLE IF EXISTS RateLimitLog CASCADE;"
docker exec -it tosom_dev_db psql -U tosom -d tosom_dev -c "DROP TABLE IF EXISTS MatchFeedback CASCADE;"

# 4. Valider schema
npx prisma validate
```

---

## VERIFISERING

Etter fjerning:

```bash
# Valider schema
npx prisma validate

# Tjek for broken imports
grep -r "MatchQueue" --include="*.ts" --exclude-dir=node_modules
grep -r "RateLimitLog" --include="*.ts" --exclude-dir=node_modules
grep -r "MatchFeedback" --include="*.ts" --exclude-dir=node_modules
```

---

## MERK

- **Ikke kjør denne fjerningen i produksjon uten test først**
- **Backup database før du gjør noen endringer**
- **Test i dev og test-database før produksjon**