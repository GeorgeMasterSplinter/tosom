# POST-MATCH-UX — endringsrapport (2026-08-31)

Mål: rette opp det George observerte etter matching — navn som viser «Ukjent»,
match-kortet som kom tilbake, reisekalenderen som ikke markerer dag 1, chat-header
med «Tilbake»-tekst og «Dag X av 30», og spørsmåls/oppgave-utsending som krever
å skrolle ned til bunn av listen.

## 1. Navn (røtetermin)

**Hva var feil:** Onboarding spør «Hva vil du at vi skal kalle deg?» og lagrer
svaret i `profile.identityName`. API-ene leste derimot `firstName`/`lastName`
eller `User.name` — felt som er tomme for mange brukere → «Ukjent» i
match-kort, chat-header og hilsener.

**Løsning (én regel overalt):** `identityName` → `fornavn + etternavn` →
`User.name` → «Ukjent».

- `app/api/dashboard/overview/route.ts` — `displayName()`-hjelpar; brukes for
  match-navn, samtale-partners navn og et nytt `myName`-felt i responsen.
- `app/api/chat/conversation/[conversationId]/route.ts` — partners navn bruker
  `identityName` (laftet inn i profile-select) + nytt `myName`-felt.
- `app/api/chat/messages/route.ts` — `identityName` laftet inn i sender-profile.
- `app/dashboard/page.tsx` — hilsenen («God kveld, X») bruker `myName`.
- `app/matching/page.tsx` — venteromshilsenen bruker `myName`.
- `app/chat/context/ChatContext.tsx` — sender-navn i boblene løses fra
  `identityName`; egen melding får nå **eget** navn (partner-info var satt ved
  feile side av boblen).
- `app/chat/components/MessageBubble.tsx` — rolig navn (11px, dempet) i begge
  retninger: partner venstre, eget navn høyre — hvem som har skrevet/sendt
  hva er alltid tydelig.

## 2. Match-kort og dashboard

- **Åpenbaring vises 1 gang:** `sessionStorage` → `localStorage`
  (`tosom_revealed_<matchId>`). Tidligere viste «Din match er her» seg på ny ved
  hver loggings-/nettlesersesjon — nå vises den én gang per match, per enhet.
- **«Deg»-kortet fjernet** fra resonanse-kortet — kortet viser resonanse +
  match (navn, alder, avstand).
- **Én knapp for begge tilstander:** «💬 Samtale» (både dag 0 og dag 1+).
- **Reisekalender markerer dag 1 på dag 0** — «Tellingen starter når man har
  blitt matchet»; før var ingen dag markert før begge hadde vært innom.
- **Fasegrenser samanslått med motoren:** dashboardet hadde egne grenser
  (1–7 / 8–14 / 15–21 / 22–30) medan `lib/journey/engine.ts`
  (PHASE_CONFIGS — kjelder for cron, milestones og oppgave-utvelging) bruker
  1–14 / 15–21 / 22–25 / 26–30. Koden vinn: dashboardet bruker no motorens
  grenser og fasenamn (Bli kjent / Bygger tillit / Djupere samvær / Refleksjon).
- Smårydding: fjerna «[DASHBOARD DEBUG]»-console.log (markert «Fjern etter at
  loop er fikset»).

## 3. Chat-header

- Tilbakeknappen: pille med kun pil (←), `aria-label` bevart.
- «Dag X av 30» fjerna — i staden **eitt symbol per reisesteg**:
  🌱 Bli kjent · 🤝 Bygger tillit · 💫 Djupere samvær · 🌙 Refleksjon.
  Fasen kjem frå `getPhaseForDay()` (motoren), ikkje lausaste tall i headeren;
  dag 0 tel som første steg.

## 4. Spørsmål/oppgave — utsending

`BliKjentPanel.tsx` og `OppgaverPanel.tsx`:

- «Send til partner?»-boksen flytta **frå inni den rullbare lista til fast i
  botnen av panelet** — vises så snart eit spørsmål/én oppgave er valgt,
  uavhengig av kvar i lista det ligg. Panelet utverknar 480px → 640px medan
  boksen er synleg (same behandling for alle kategoriar).
- Innhaldet i boksen er uendra (spørsmålstekst, ✨ Send / 🎲 Send, Avbryt).

## 5. Bobler — kjelde-etikett («💎 Bli kjent» / «📋 Oppgave»)

**Hva var feil:** `source` blei allereie lagra i DB og returnert frå
`GET /api/chat/messages` (skalart-felt på Message — heile rekka vert returnert
uten select). Etiketten forsvann likevel fordi:

1. Optimistisk melding (eigen, straks etter send) mangla `source` i metadata.
2. Polling-dedupen (`lastMsgIdRef`) tidleg-returra, så lista aldri gjekk
   attende mot serveren for å hente feltet før neste sidebesøk.

**Fiksa:** `ChatContext.tsx` set `source` i metadata både på den optimistiske
meldingen og når server-svaret byttast inn → etiketten vises med en gang for
sender og vises ved lasting for mottakar (var allereie dekt av server-responsen).

## 6. Moods (verifisert — ingen kodeendring)

`__tests__/chat-mood-shared.test.ts` (grøn) låser opp aksen:

- A set mood → B ser **same** mood ved neste polling
- B bytter mood → A ser B sin (motretning — begge kan bytte, siste skriv vinn)
- Ikkje-deltakar → 403, ikkje-delt → 400, ingen overflødig DB-skriving

Delt-mood-oppførselen er altså testa i begge retningar. Om du likevel så
ulike moods for dei to, var det sannsynlegvis polling-tid (3 s) eller
mood-pulse-modusen — verifiser live i to nettlesarar (testA/testB).

## 7. Bilde-deling (lås for dag 15)

Bildeknappen er låst til `journeyDay >= 15` (designval, ikkje bug). For å
teste R2-flyten før dag 15 i **dev** (aldri mot prod):

```bash
# Finn conversationId til testA/testB-paret, deretter:
npx prisma db execute --stdin <<'SQL'
UPDATE "Conversation"
SET "imageShareAllowedAt" = now()
WHERE "id" = '<conversationId>';
SQL
```

Deretter: send bilete i begge retningar → skal sjåast som bobsler i begge
nettlesarar, og `GET /api/chat/images/[id]` skal returnere signert R2-URL.

## Endra filer (11)

| Fil | Endring |
|---|---|
| `app/api/dashboard/overview/route.ts` | `displayName()` + `myName` |
| `app/api/chat/conversation/[conversationId]/route.ts` | `identityName`-partner + `myName` |
| `app/api/chat/messages/route.ts` | `identityName` i sender-profile |
| `app/dashboard/page.tsx` | `myName`-hilsen, localStorage-åpenbaring, «Samtale»-knapp, «Deg»-kort vekk, kalender dag 1 på dag 0, motor-fasegrenser |
| `app/matching/page.tsx` | `myName` i venteromshilsen |
| `app/chat/components/ChatHeader.tsx` | pil-pille, 4 fase-symbol |
| `app/chat/components/BliKjentPanel.tsx` | fast send-linje |
| `app/chat/components/OppgaverPanel.tsx` | fast send-linje |
| `app/chat/context/ChatContext.tsx` | `myName`, sender-navn, `source` i optimistisk melding |
| `app/chat/[id]/ChatPageClient.tsx` | henter + rår `myName` til provider |
| `app/chat/components/MessageBubble.tsx` | eigen namnlinje (høyre) |

## Verifisering

- `tsc --noEmit` — 0 feil
- `npx jest` — 43/43 suiter, 366 passed / 1 skipped
- `npm run verify:lang` — grønt (spraakvakt)
- `npm run verify:api` — «Alle API-kall matcher eksisterende ruter»
- E2E (krev lokal dev-server + dev-login): kjør
  `npx playwright test e2e/tests/chat.spec.ts e2e/tests/match.spec.ts e2e/tests/matching-journey.spec.ts`
- Live-sjekkliste (to nettlesarar, testA/testB): navn, åpenbaring 1 gang,
  moods i begge retningar, send-linje utan skrolle, bilda etter dag-15-UPDATE.

---

## Bølgje 2 (31.08) — Presence v2 (DB-basert) + rolegare chat-UX

**Problemet:** online-punktet og «Skriver...» var døde i produksjon.
`lib/presence/presenceState.ts` brukte ein in-memory `Map` — på Vercel har
kvar funksjonskall eige isolerte og kortlevde minne, så parten sin
`GET /api/presence/get/[id]` såg aldri den andre si `PATCH`. I tillegg
sendte ChatInput éin `isTyping:true`-POST per tastetrykk (ingen throttling),
og Pusher-eventet `typing` (allerede triggera av `/api/chat/typing`) var
aldri binda på klienten.

**Løysinga:**

| Lag | Endring |
|---|---|
| DB | `User.lastSeenAt` + `User.typingUntil` (migrasjon `20260831175820_presence_last_seen_typing`) |
| `lib/presence/presenceState.ts` | Omskrive til Prisma: `setOnline` = hjartetikk, `setTyping` (TTL 5 s) / `clearTyping`, `getPresence` (online < 90 s). `setOffline` er no-op (mangel på tikking = offline) |
| `PATCH /api/presence/update` | `isOnline:true` = hjartetikk, `isTyping:true/false` = sett/rydd. `isOnline:false` = no-op |
| `GET /api/presence/get/[id]` | Les frå DB; ukjend bruker = offline-default |
| `ChatContext` | Binda Pusher-eventet `typing` → `partnerTyping` (4 s timeout; ignorerar eigne event). Pusher = umiddelbart, polling = fallback |
| `ChatContainer` (ChatInput) | Hjartetikk: ved sideåpning, kvar 30. s, ved synlighetsskifte. Typing throttla: første tast + maks 1 per 2. s, stopp etter 3 s i ro. Død `PresenceIndicator` fjerna; `TypingIndicator` («Skriver...»-boble) aktiverast via `partnerTyping` |
| `MessageBubble` | Navn + tid flytta **inni** bobla (éi metalinje, 10px, under teksten). Ytre `Timestamp`-komponent og namnelinjer fjerna |
| `ChatHeader` | Alder + avstand fjerna (står på match-kortet i dashboard). Online-punkt: 10px med glød + diskret puls (gull medan parten skriver) |
| Død kode | `lib/presence/presenceEngine.ts` sletta (aldri importert) |

**Semantikk:** «Online» = hjartetikk under 90 s gammalt. «Skriver» =
`typingUntil` i framtid (settest av klienten, utgår etter 5 s). Alt er
best-effort: presence-feil swalgarst i klienten og rører ikkje chatten.

**Verifisering:** språkvakt grønn (bokmål), `tsc` 0, jest 383/384 (44 suiter,
inkl. ny `__tests__/presence-v2.test.ts` med 17 kontrakstester), prod-build OK.
Prod-DB: CI kjører `prisma migrate deploy` (additiv migrasjon — to nullable
kolonner; overlap med Vercel-deployen er harmless).

**Live-sjekk (to nettlesarar):** A opnar chatten → B ser grønt punkt + «Online».
A skriv → B ser «Skriver...» + gullt punkt + boble i bunn av lista,
forsvinn etter ~4 s. A lukkar fanen → B: punkt blir grått etter ~90 s.
