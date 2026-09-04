Games.md — Spill i ToSom Chat
🎯 Formål
ToSom‑chatten skal tilby lavterskel minispill som gir par noe gøy å gjøre sammen, uten å ta fokus fra samtalen. Spillene skal være:

enkle

raske

sosiale

visuelt integrerte i chatten

nyttige som “icebreakers” eller små beslutningsverktøy

Spillene skal kunne brukes både som ren underholdning og som et verktøy for å avgjøre hvem som:

starter en oppgave

svarer først på et spørsmål

velger aktivitet

tar første trekk i en samtale

eller hva paret selv finner på

🧩 Spill som implementeres
1. Tic‑Tac‑Toe (X og O)
Et klassisk 3×3 brettspill.
Perfekt for par som vil gjøre noe enkelt mens de venter eller bare vil ha det litt gøy.

2. Stein–Saks–Papir
Superraskt, null kompleksitet, og perfekt for å avgjøre “hvem starter”.

🛠️ Teknisk arkitektur
1. Game State (server)
Hvert spill får en egen state per conversationId:

ts
{
  type: "tic-tac-toe" | "rps",
  state: { ... },
  players: ["userA", "userB"],
  turn: "userA" | "userB",
  winner: null | "userA" | "userB"
}
State lagres i Postgres (GameSession-model).

2. API‑ruter
To endepunkter per spill:

POST /api/game/start

POST /api/game/move

Begge sender Pusher‑eventer til:

Kode
private-conversation-{conversationId}
3. Pusher‑synkronisering
Når en spiller gjør et trekk:

server validerer

state oppdateres

Pusher sender event til begge klienter

UI oppdateres i sanntid

4. UI‑komponenter
To React‑komponenter:

<TicTacToeBoard />

<RockPaperScissors />

Begge rendres som interaktive paneler i chatten (GamesPanel, slide-down fra header — samme mønster som BliKjentPanel).

🎨 Designprinsipper
skal se ut som en del av chatten

minimal grafikk

store klikkflater (mobilvennlig)

tydelig tur‑indikator

resultat vises som en chat‑melding

spill kan restartes med én knapp

spill startes via visuelle knapper, ikke tekstkommandoer

🚦 Flyt i chatten (oppdatert)
⭐ Tic‑Tac‑Toe
Spillet startes via en visuell knapp i chatten:

[ Start Tic‑Tac‑Toe ]

Flyt:

Bruker trykker på knappen

Chat‑motoren starter spillet

Vises som et panel i chatten

Spiller 1 trykker på et felt

Pusher oppdaterer begge klienter

Når noen vinner → resultat vises i chatten

Chat viser en ny knapp:

[ Spill igjen ]

⭐ Stein–Saks–Papir
Spillet startes via en visuell knapp:

[ Start Stein–Saks–Papir ]

Flyt:

Bruker trykker på knappen

UI‑komponenten vises med tre store ikoner:

✊ Stein

✋ Papir

✌️ Saks

Begge velger ikon

Resultat vises i chatten

Chat viser en ny knapp:

[ Spill igjen ]

💡 Bruksområder (for par)
Spillene fungerer som sosiale verktøy:

avgjøre hvem som starter en oppgave

avgjøre hvem som svarer først på et bli‑kjent‑spørsmål

avgjøre hvem som velger aktivitet

bryte isen når man ikke vet hva man skal si

skape litt lek og humor i chatten

gjøre ventetid hyggeligere

Dette gir ToSom en varm, leken og trygg atmosfære.

🔒 Sikkerhet
alle Pusher‑kanaler er private

spill‑state er isolert per samtale

ingen personlig data lagres

ingen spill kan påvirke journey‑logikk

alle API‑ruter er CSRF‑beskyttet

spill kan ikke trigge sensitive operasjoner

📦 Implementasjonsplan
Backend
[ ] Opprett game‑state modell

[ ] Lag /api/game/start

[ ] Lag /api/game/move

[ ] Legg inn Pusher‑eventer

[ ] Valider trekk (tic‑tac‑toe engine + rps engine)

Frontend
[ ] Lag <TicTacToeBoard />

[ ] Lag <RockPaperScissors />

[ ] Lag visuelle “Start spill”‑knapper

[ ] Integrer i chat‑panelet

[ ] Legg inn Pusher‑listeners

[ ] Legg inn restart‑knapp

Chat‑motor
[ ] Oppdag spill‑intensjon via knapp‑klikk

[ ] Start spill automatisk

[ ] Send resultat som chat‑melding

[ ] Foreslå videre bruk via knapper

Testing
[ ] Enhetstester for game‑engine

[ ] E2E‑tester for chat‑integrasjon

[ ] Mobilvennlighet (48px targets)

[ ] Pusher‑synkronisering

🧪 Eksempler på chat‑bruk
“La oss spille om hvem som starter” → trykk på knappen

“Stein saks papir — taperen svarer først”

“X og O mens vi venter på svar”

“La oss ta en runde for å velge aktivitet”

🏁 Konklusjon
Spillene gir ToSom:

mer varme

mer lek

mer sosial dynamikk

mer premium‑følelse

mer verdi for par som vil ha noe lett og gøy

Dette er en lavterskel, høyverdi funksjon som passer perfekt inn i ToSom‑chatten.