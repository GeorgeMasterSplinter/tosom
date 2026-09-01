# Fake Match Profil-Fiks

**Dato:** 30. juni 2026  
**Status:** ✅ Løyst

---

## Problem

Når en bruker startar reisen via `Step10StartReisen`, blir brukeren navigert til `/chat/[convoId]`. Sida viser en spinner med teksten **"Lastar samtale..."** som aldri forsvinn.

## Rotårsak

**`hooks/useChatMessages.ts`** linje 36-38:

```typescript
if (!res.ok) {
  if (res.status === 401) return;  // ← loading forblir true!
  throw new Error('Kunne ikke hente meldinger');
}
```

Når API-et returnerer 401 (ugyldig sesjon/token), blir `loading` aldri sett til `false`. Derfor spinner den uendeleg.

### Løysing

Laegje til `setLoading(false)` før `return`:

```typescript
if (!res.ok) {
  if (res.status === 401) {
    setLoading(false);  // ← ny
    return;
  }
  throw new Error('Kunne ikke hente meldinger');
}
```

---

## Profile-oppdatering for User B

Fila `app/actions/createFakeMatch.ts` blei oppdatert med følgjande endringer for user B sin profil:

| Fel    | Gamal verdi                | Ny verdi                    |
|--------|----------------------------|-----------------------------|
| `age`  | `30`                       | `28`                        |
| `bio`  | `"Dummy-bruker for matching"` | `"Testbrukar for matching"` |
| `interests` | `["Testing", "AI"]`     | `["Musikk", "Reiser"]`      |

**Merk:** Schemaet har ingen `name`-felt på Profile-modellen. Korrekt felt er `identityName`.

---

## Filendringar

1. **`hooks/useChatMessages.ts`** — Laegje til `setLoading(false)` ved 401-respons
2. **`app/actions/createFakeMatch.ts`** — Oppdatert user B profil-data

---

## Teststeg

1. Fullfør onboarding
2. Gå til steg 10 og trykk "Start reisen"
3. Bekreft at samtalen lastar inn uten spinner
4. Sjekk at både user A og user B sin profil visast korrekt

---

## Notat

- Schemaet (prisma/schema.prisma) har ingen `name`-felt på Profile. Bruk `identityName` i staden.
- 401-feil oppstår når brukeren ikke er innlogga. Dette er forventa oppførsel — viktig at loading-state blir handsama korrekt.