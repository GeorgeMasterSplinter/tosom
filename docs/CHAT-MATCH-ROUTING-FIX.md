# CHAT-MATCH-ROUTING-FIX

**Dato:** 2026-08-30
**Status:** Ferdig
**Påvirker:** Venterom → Dashboard → Chat-ruten

---

## 1. Hva som var feil

| # | Problem | Fil |
|---|---------|-----|
| 1 | Venterommet (`/matching`) viste et match-kort til brukere med aktiv match i stedet for å redirect til `/dashboard`. Kommentar i filen sa «Har aktiv match → redirect /dashboard», men koden satt `queueState='matched'` og render UI. | `app/matching/page.tsx` |
| 2 | «Innstillinger»-knappen vises på bunnen av venterommet i alle tilstander — gir forvirring til brukere som kun venter. | `app/matching/page.tsx` |
| 3 | ChatContext brukte kun polling (3 s) — Pusher-klienten og -serveren var konfigurert men aldri koblet inn. `triggerNewMessage` eksisterte i `lib/pusher/server.ts` men ble aldri kalt fra send-ruten. | `app/chat/context/ChatContext.tsx`, `app/api/chat/send/route.ts` |
| 4 | ChatHeader hadde ingen tilbakeknapp. Brukere kunne ikke forlate chat-siden via headeren. | `app/chat/components/ChatHeader.tsx` |

DEL 4 (meldings-shape) og DEL 6 (dashboard-journey) var allerede korrekte — ingen endring nødvendig.

---

## 2. Hva som ble endret

### `app/matching/page.tsx`

- **Routing fix:** Når `journeyState === 'MATCHED'` eller `'ON_JOURNEY'`, kalles `router.replace('/dashboard')` umiddelbart. Venterommet vises aldri for brukere med aktiv match.
- **Meny-fjerning:** «Innstillinger»-knappen på bunnen av venterommet er fjernet. Venterommet viser kun innholdskort (kø, låst, ingen match, start) + modaler.

### `app/chat/components/ChatHeader.tsx`

- **Tilbakeknapp:** «← Tilbake»-knapp lagt til til venstre i headeren. Navigerer til `/dashboard`.

### `app/api/chat/send/route.ts`

- **Pusher trigger:** Etter `prisma.message.create(...)`, kalles `triggerNewMessage(conversationId, {...})` for å sende real-time event. Feil i Pusher logges men blokkerer ikke sendingen.

### `app/chat/context/ChatContext.tsx`

- **Pusher subscribe:** I `useEffect` der polling settes opp, abonneres nå også på Pusher-kanalen `private-conversation-${conversationId}` (private — auth via /api/pusher/auth). Ved `new-message`-event lastes meldinger umiddelbart. Polling beholdes som fallback (dedup via `lastMsgIdRef`).
- **Cleanup:** `pusher.unsubscribe(channelName)` ved unmount.

---

## 3. Nye routing-regler

```
Bruker med aktiv match (journeyState = MATCHED | ON_JOURNEY):
  /matching → redirect /dashboard  (klient-side, i load-effekten)
  /dashboard → viser journey (kalendar, milepæler, samtale-knapp)
  /chat/[id] → chat, tilbak → /dashboard

Bruker UEN match:
  /dashboard → redirect /matching  (klient-side, i load-effekten)
  /matching → viser venterom (kø, låst, ingen match, start)
  /chat/[id] → umulig (ingen conversationId)
```

**Ingen server-side redirect** (middleware kun beskytter API-ruter). Sjekkene skjer i klient-komponentenes `useEffect`-load, mot `/api/dashboard/overview`.

---

## 4. Pusher-kobling

**Kanal-navn:** `private-conversation-${conversationId}` (PRIVATE — pusher-js henter auth-token fra /api/pusher/auth)

**Fløte:**
1. Bruker A sender melding → `POST /api/chat/send`
2. Server: `prisma.message.create()` → `triggerNewMessage(conversationId, message)`
3. Pusher sender `new-message`-event på `private-conversation-${conversationId}`
4. Bruker B (i chat): Pusher `channel.bind('new-message')` → `loadMessages(true)` (dedup-sjekk)
5. Fallback: polling hvert 3 s (om Pusher-tilkoblingen er borte)

**Konfig:** `lib/pusher/client.ts` (NEXT_PUBLIC_PUSHER_KEY + NEXT_PUBLIC_PUSHER_CLUSTER) og `lib/pusher/server.ts` (PUSHER_APP_ID + PUSHER_KEY + PUSHER_SECRET + PUSHER_CLUSTER).

---

## 5. Verifisering

```
tsc --noEmit:        0 feil
jest --ci --silent:  366 passed, 1 skipped (43 suiter)
```

---

## 6. Ikke endret

- **Dashboard:** viser journey korrekt, redirect til `/matching` uten match
- **Meldings-API:** shape `{ id, content, senderId, createdAt, sender: {...} }` er korrekt
- **Venterom-tilstander:** `in_queue`, `locked`, `no_match`, `start`, `not_started` beholdes
- **Pusher-konfig-filer:** (oppdatert 03.09 — private-kanal + authEndpoint; se §7)
- **Polling:** beholdes som fallback
- **Ingen nye avhengigheter**

---

## 7. Oppfølging 03.09 — private Pusher-kanal + venterom-redirect

Denne fixen brukte en **public** Pusher-kanal (`conversation-${conversationId}`). 03.09 ble den
migrert til en **private** kanal for å lukke et IDOR-hull: på en public kanal kunne hvem som helst
med en `conversationId` abonnere og lese meldingene i sanntid (REST-rutene var IDOR-sjekket, men
live-kanalen var det ikke).

**Endringer:**
- `lib/pusher/server.ts`: `triggerNewMessage`/`triggerTyping`/`triggerMoodChange` triggerer nå på
  `private-conversation-${conversationId}`. (`user-${userId}` beholdt — kun dashboard-varsling uten innhold.)
- `app/chat/context/ChatContext.tsx` + `hooks/useChatRealtime.ts`: abonnerer på
  `private-conversation-${conversationId}`; pusher-js henter auth-token via `authEndpoint`.
- `lib/pusher/client.ts`: `authEndpoint: '/api/pusher/auth'` i klient-konfigen.
- **NY** `app/api/pusher/auth/route.ts`: signerer private-kanalen (HMAC-SHA256 med `PUSHER_SECRET`)
  KUN for innloggede samtale-deltakere (401 uten sesjon/Pusher-konfig, 403 for ikke-deltaker).
- `app/matching/page.tsx`: venterom redirect-er matchede brukere til `/dashboard` (§1.1) i stedet for
  å vise et matched-kort.
- Bonus: `useChatRealtime.stop()` fikset (double-prefix på unsubscribe → bruker kanal-navnet direkte).

**Test:** `__tests__/pusher-auth-private-channel.test.ts` (6 tests). **Verifisert:** tsc 0, `next build` EXIT=0,
jest chat 32/32 + pusher-auth 6/6. Krever ny prod-deploy + testere-test.