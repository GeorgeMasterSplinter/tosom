# Partner Presence Engine — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Delvis implementert (backend + UI-komponent)

---

## OVERSIKT

Partner Presence Engine gir hver part innsyn i:
- Kor partneren er i reisa (dag, fase, progresjon)
- Om partneren er online og hva vedkommande gjer
- Samanfall i reise-posisjon
- Resonans-nivå mellom partane
- Gentle nudge ved lang inaktivitet

---

## ARKITEKTUR

```
lib/presence/
├── presenceEngine.ts   # Backend-logikk
└── heartbeat.ts        # Presence-heartbeat

components/presence/
└── PartnerPresenceBar.tsx   # Frontend-komponent
```

---

## FUNKSJONAR

### Backend (lib/presence/presenceEngine.ts)

| Funksjon | Formål |
|--|--|
| `getUserPresence(userId)` | Hent presence-state for en bruker |
| `getJourneyPosition(userId)` | Hent dag/fase/progresjon i reisa |
| `calculateSharedPosition(posA, posB)` | Beregn samanfall i reise-posisjon |
| `calculateResonance(userAId, userBId)` | Beregn resonans-data |
| `shouldSendNudge(lastActivity, day)` | Sjekk om gentle nudge skal sendast |
| `updatePresenceHeartbeat(userId, activity)` | Oppdater heartbeat (Pusher/Redis) |
| `getPartnerPresenceData(userAId, userBId)` | Hent heile presence-data |

### Frontend (components/presence/PartnerPresenceBar.tsx)

Varm, rolig presence-bar som viser:
- Aktivitetsemoji (📖✍️🧘🌿 etc.)
- Online/offline status (grøn ring)
- Sist sett-tid
- Resonans-nivå med emoji (🌱💛✨💫)
- Shared position melding

---

## DESIGN

### Fargar
- **Online:** Grøn (animate pulse)
- **Offline:** Grå
- **Resonans:** Grøn → Gull → Gull-lys

### Emojisar
| Aktivitet | Emoji |
|--|--|
| Idle | 😌 |
| Reading | 📖 |
| Writing | ✍️ |
| Reflecting | 🧘 |
| Viewing match | ✨ |
| In journey | 🌿 |
| Paused | ⏸️ |

| Resonans | Emoji |
|--|--|
| Gentle | 🌱 |
| Moderate | 💛 |
| Strong | ✨ |
| Deep | 💫 |

### Meldinger for shared position
- **Same dag + same fase:** "De er på same stad i reisa — et vakkert samfall 🌿"
- **Same fase, ulike dager:** "De er i same fase, men litt ulike dager"
- **Ulike faser:** "De utforsker ulike delar av reisa — hver med sin tempo 🌊"

---

## GENTLE NUDGE

Køyr etter 48 timar uten aktivitet i reisa:
```
"Din partner savnar deg i reisa. Hvordan har det gått de siste dagane?"
```

---

## INTEGRASJON

### Pusher/Redis (produksjon)
```typescript
// Frontend heartbeat
setInterval(() => {
  fetch('/api/presence/heartbeat', {
    method: 'POST',
    body: JSON.stringify({ userId, activity: 'in-journey' }),
  })
}, 30000) // hver 30 sekund

// Lytt på presence-endringer
const channel = pusher.subscribe('presence-journey-{id}')
channel.bind('partner-update', (data) => {
  updateLocalPresence(data)
})
```

### Database (produksjon)
```sql
-- Presence-table (kan leggast til)
CREATE TABLE Presence (
  userId TEXT PRIMARY KEY,
  isOnline BOOLEAN,
  lastSeenAt TIMESTAMP,
  activity TEXT,
  journeyDay INT,
  journeyPhase TEXT,
  updatedAt TIMESTAMP
);
```

---

## BRUK I UI

```tsx
import PartnerPresenceBar from '@/components/presence/PartnerPresenceBar'

function ChatRoom({ partnerId, partnerName, presenceData }) {
  return (
    <div>
      {/* Chat-innhold */}
      
      {/* Presence-bar */}
      <PartnerPresenceBar
        partnerId={partnerId}
        partnerName={partnerName}
        isOnline={presenceData.userB.isOnline}
        lastSeenAt={presenceData.userB.lastSeenAt}
        activity={presenceData.userB.activity}
        sharedPositionMessage={presenceData.sharedPosition.message}
        resonanceLevel={presenceData.resonance.level}
      />
    </div>
  )
}
```

---

## UTVEKKING

### Påkrav for produksjon:
1. Sette opp Redis eller Pusher presence
2. Legge til Presence i Prisma schema
3. Opprette `/api/presence/heartbeat` endpoint
4. Kople til ekte DB-data istadenfor simulert
5. Teste med to brukere samstundes

### Valfritt:
- Animert overgang mellom status
- Historikk av presence (timeline)
- Resonans-chart over tid

---

## HUSK

- Presence må være **privat** (bare partane ser)
- Ingen push-notifikasjonar for presence
- Heartbeat maks hver 30 sekund (ikke oftere)
- Alltid rolig og ikke-påkrevjande