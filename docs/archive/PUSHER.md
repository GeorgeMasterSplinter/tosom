# Pusher-integrasjon — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0

---

## OVERSIKT

ToSom brukar Pusher for realtime-funksjonar:
- **Chat-meldingar** (realtime)
- **Typing-indikator**
- **Presence** (online status)
- **Match-notifikasjonar**

---

## KONFIGURASJON

```bash
PUSHER_APP_ID=tosom-app
PUSHER_KEY=your-push-key
PUSHER_SECRET=your-push-secret
PUSHER_CLUSTER=eu
PUSHER_USE_TLS=true
```

---

## STRUKTUR

```
lib/pusher/
├── client.ts    # Pusher client (frontend)
└── server.ts    # Pusher client (backend)
```

---

## CHANNELS

| Channel | Formål |
|--|--|
| `private-tosom-{userId}` | Private meldingar |
| `presence-journey-{journeyId}` | Journey status |
| `chat-{conversationId}` | Chat-meldingar |

---

## EVENTS

| Event | Beskrivelse |
|--|--|
| `message:new` | Ny melding |
| `message:typing` | Skriv-indikator |
| `message:read` | Leest-melding |
| `match:new` | Ny match |
| `journey:update` | Reise-endring |

---

## SETUP

1. Opprett Pusher-konto
2. Opprett app
3. Kopier credentials
4. Test med Pusher Console

---

## FEILFINDING

### "Pusher connection failed"
Sjekk PUSHER_KEY og PUSHER_CLUSTER

---

## HUSK

- Bruk private channels for sensitive data
- Presence channels for online status