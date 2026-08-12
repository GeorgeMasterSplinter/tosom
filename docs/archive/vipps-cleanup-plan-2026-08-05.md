# ToSom — VIPPS OAuth Cleanup Plan (Punkt 9)

## Status: FULLFØRT ✅ 2026-08-05

**Resultat:** Punkt 9 er fullført. To duplicate VIPPS OAuth-stier fjernet, dead Supabase code slettet. Ingen imports ble brutt — alt var uaktiv kode.

---

## Problem

To identiske VIPPS OAuth-stier eksisterer:

| Sti | Route fil | Callback fil | Brukt av frontend? | Status |
|-----|-----------|--------------|-------------------|--------|
| `/api/auth/vipps/authorize` | `app/api/auth/vipps/authorize/route.ts` | `app/api/auth/vipps/callback/route.ts` | ✅ JA (E2E tests) | KANONISK |
| `/api/auth/oauth/vipps/authorize` | `app/api/auth/oauth/vipps/authorize/route.ts` | `app/api/auth/oauth/vipps/callback/route.ts` | ❌ NEI | DUBLETT — til sletting |

**Viktig:** Begge authorize-rutene peker sin `redirectUri` til `/api/auth/vipps/callback`, ikke `/api/auth/oauth/vipps/callback`. Dette betyr at `/oauth/vipps/authorize`-rutens callback ALDRIG blir kalt.

---

## Løsning

1. **Behold** `/api/auth/vipps/` som kanonisk sti (brukes av frontend + E2E tests)
2. **Slett** `/api/auth/oauth/vipps/authorize/route.ts` og `callback/route.ts`
3. **Legg til 301 redirect** i middleware fra gammel → ny sti

---

## Supabase Typing Tracker

**Problem:** Pusher brukes for meldinger, Supabase brukes for typing-status. To realtime-kanaler per chat-room.

| Kanal | Bruk | Fil |
|-------|------|-----|
| Pusher | Meldinger + typing (delvis) | `lib/pusher/server.ts`, `client.ts` |
| Supabase | Kun typing-status | `lib/chat/typingTracker.ts`, `lib/supabase.ts` |

**Løsning:** Migrer typing fra Supabase til Pusher. Fjern `lib/supabase.ts` og `lib/chat/typingTracker.ts`. Bruk kun Pusher for alt realtime (meldinger + typing).

---

## Trinn A: VIPPS OAuth Cleanup

1. [x] Slett `app/api/auth/oauth/vipps/authorize/route.ts`
2. [x] Slett `app/api/auth/oauth/vipps/callback/route.ts`
3. [x] Oppdater alle imports/referanser (ingen funnet — ingen frontend-kall)
4. [-] 301 redirect ikke nødvendig — gammel sti aldri ble brukt

## Trinn B: Typing Migration (Supabase → Pusher)

5. [x] Slett `lib/supabase.ts` og `lib/chat/typingTracker.ts`
6. [-] Ikke nødvendig — typingTracker var død kode (0 imports!)
7. [-] E2E-test ikke nødvendig — Supabase-never ble brukt
