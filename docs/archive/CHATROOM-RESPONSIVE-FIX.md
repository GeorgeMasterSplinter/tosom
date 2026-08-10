# ChatRoom Responsiv Fix — Rapport

**Dato:** 2026-06-30
**Status:** Responsiv layout + bokmål språk fullført

---

## DEL 1 — 401-FEIL

### Problem
401-feilen oppstår når brukaren ikkje er autentisert. `useChatMessages` håndterer dette ved å avslutte polling (line 46-49).

### Løysing
- Prisma schema: `senderId`, `userAId`, `userBId` er allerede `String` (matcher `User.id`)
- API-en sjekker `session?.user?.id` og returnerer 401 dersom manglar
- Bruk: `useChatMessages` håndterer 401 ved å avslutte polling utan error

### Merknad
401 er **forventa oppførsel** — ikkje ein feil. Dersom ein ikkje er logga inn skal ikkje meldingar lastast.

---

## DEL 2 — RESPONSIV CHAT ROOM

### ChatRoom.tsx
- Container: `w-full mx-auto flex flex-col bg-[#0B0E11]`
- Desktop: `max-w-[600px]` via parent page
- Mobil: `h-[100dvh]` for full skjermhøgd
- Ingen `overflow-hidden` på parent

### ChatMessages.tsx
- `flex-1 overflow-y-auto` — tek all ledig plass
- Ingen fixed heights
- IntroBubble med max 320px breidd

### ChatInput.tsx
- `sticky bottom-0` — alltid synleg nedst
- Parent har ikkje `overflow-hidden`

### ChatHeader.tsx
- `sticky top-0` — alltid synleg øvst
- God spacing for desktop

---

## DEL 3 — SPRÅK TIL BOKMÅL

### Endringar:
| Før (dialekt) | Etter (bokmål) |
|--------------|--------------|
| ikkje | ikke |
| sei | si |
| att | igjen |
| Det er tomt her — men det blir ikkje det. | Det er tomt her — men det blir ikke det. |
| Bare sei hei. | Bare si hei. |
| Dag X/30 – Y att | Dag X/30 – Y igjen |

---

## DEL 4 — FILSTATUS

| Fil | Status |
|-----|--------|
| components/chat/ChatRoom.tsx | ✅ Responsiv layout |
| components/chat/ChatMessages.tsx | ✅ Bokmål intro-bubble |
| components/chat/ChatInput.tsx | ✅ Sticky bottom |
| components/chat/ChatHeader.tsx | ✅ Sticky top |
| hooks/useChatMessages.ts | ✅ 401 håndtering |

---

## NESTE STEG

1. Test på mobil (iOS/Android)
2. Test på desktop (1920x1080)
3. Verifiser at chat fungerer utan 401-feil
4. Test at input-felt er klikkbart på mobil