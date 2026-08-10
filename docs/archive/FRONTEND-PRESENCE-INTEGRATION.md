# Frontend Presence-integrasjon — Rapport

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** ✅ FULLFØRT

---

## OVERSIKT

PartnerPresenceBar er no integrert i ChatRoom-frontenden (`app/chat/[id]/page.tsx`).

---

## ENDRAINGAR

### 1. Import
```tsx
import PartnerPresenceBar from '@/components/presence/PartnerPresenceBar';
```

### 2. PresenceData-interface
```tsx
interface PresenceData {
  isOnline: boolean;
  lastSeenAt: Date | null;
  activity: string;
  resonanceLevel: string;
  sharedPositionMessage: string;
}
```

### 3. AppState utvida
```tsx
interface AppState {
  partner: PartnerData | null;
  conversation: ConversationData | null;
  presence: PresenceData | null;  // NY
  loading: boolean;
  error: string | null;
}
```

### 4. Data-henting
- `fetchData` hentar både conversation-info **og** presence-data
- Presence er simulert (Math.random) — i produksjon: `/api/presence/conversation/:id`

### 5. Presentasjon
```tsx
<PartnerPresenceBar
  partnerId={partner.id}
  partnerName={partner.name}
  isOnline={presence.isOnline}
  lastSeenAt={presence.lastSeenAt}
  activity={presence.activity}
  sharedPositionMessage={presence.sharedPositionMessage}
  resonanceLevel={presence.resonanceLevel}
/>
```

Plassert **under** `<ChatRoom />` med omslutande div for riktig positioning.

---

## TESTING

### Når partner er aktiv
- `isOnline: true` → Grøn puls-ring
- `activity: 'reading'/'writing'/'in-journey'` → Relevant emoji
- `resonanceLevel: 'strong'/'deep'` → Gull-lys

### Når partner er inaktiv
- `isOnline: false` → Grå ring
- `activity: 'idle'` → 😌 emoji
- `resonanceLevel: 'gentle'` → 🌱 emoji

---

## NESTE STEG

1. **Kople til ekte presence-API** — erstatt Math.random med `/api/presence/conversation/:id`
2. **Live-updates via Pusher** — websocket for sanntids-endringar
3. **Test med to brukarar** — verifiser at begge ser korrekt status

---

## HUSK

- Presence-bar er **alltid synleg** når chat er lasta
- Fallback-verdier vises ved feil
- Ingen push-notifikasjonar for presence