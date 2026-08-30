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

- **Pusher subscribe:** I `useEffect` der polling settes opp, abonneres nå også på Pusher-kanalen `conversation-${conversationId}`. Ved `new-message`-event lastes meldinger umiddelbart. Polling beholdes som fallback (dedup via `lastMsgIdRef`).
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

**Kanal-navn:** `conversation-${conversationId}`

**Fløte:**
1. Bruker A sender melding → `POST /api/chat/send`
2. Server: `prisma.message.create()` → `triggerNewMessage(conversationId, message)`
3. Pusher sender `new-message`-event på `conversation-${conversationId}`
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
- **Pusher-konfig-filer:** `lib/pusher/client.ts` og `lib/pusher/server.ts` uendret
- **Polling:** beholdes som fallback
- **Ingen nye avhengigheter**