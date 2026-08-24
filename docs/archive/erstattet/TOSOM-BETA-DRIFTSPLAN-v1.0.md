# TOSOM — BETA-DRIFTSPLAN v1.0

**Dato:** 2026-08-21
**Commit:** `d1cae09`
**Status:** Aktiv. Gjelder fra siste kodeoppgave til beta er avsluttet.
**Kanonisk kilde:** `TOSOM-SUPER-MASTERPLAN-v1.0.md`
**Følgedokumenter:** `ADMIN-KOMMANDOPANEL-v1.0.md`, `BETA-ACCESS-PLAN-v1.0.md`, `ACT-PIPELINE-v1.0.md`, `ACT-STATE.json`

---

## Leseveiledning

Hver seksjon er merket:

| Merke | Betydning |
|---|---|
| 🔵 **KONSEPT** | Intensjonen. Uforanderlig uten Georges godkjenning. |
| 🟢 **IMPLEMENTERT** | Verifisert i kode med fil:linje. |
| 🔴 **AVVIK** | Kode og konsept er uenige. Referanse til tiltak-ID. |

Dette dokumentet beskriver ikke hva Tosom er — det står i SUPER-MASTERPLAN. Det beskriver **hva som gjenstår før første invitasjon, og hvordan plattformen driftes når brukerne er inne.**

---

# DEL I — HVOR VI STÅR

## 1. Helse

### 🟢 IMPLEMENTERT
Kilde: `docs/ACT-STATE.json` (oppdatert 2026-08-20).

| Mål | Verdi |
|---|---|
| Tester | 231/231 grønne |
| Typesjekk | 0 feil |
| Produksjonsbuild | Verifisert |
| Fase | `beta-klar-alle-runder-ferdig` |

Alle fire runder i SUPER-MASTERPLAN §15 er gjennomført: blokkere, PDF-eksport, beta-drift og opprydding.

## 2. Blokkere

### 🟢 IMPLEMENTERT — alle lukket

| ID | Sak | Status |
|---|---|---|
| B-1 | Magic link sendes aldri | ✅ lukket |
| B-2 | Vipps-callback er død kode | ✅ lukket |
| B-3 | PDF-eksport mangler før sletting | ✅ lukket |
| B-4 | Admin-endepunkter kan eskaleres | ✅ lukket |

Avvikene A-1 (bildesperre), A-2 (CHECKIN uoppnåelig), A-3 (to resonansterskler) og A-4 (permanent sperreliste) er håndtert gjennom M-items i `MATCHING-TUNING-PLAN-v1.0.md`.

Teknisk gjeld G-1, G-2, G-3 og G-5 er ryddet: døde motorer fjernet, kø-ventil fjernet, `memory.json` rettet, dokumentasjon restrukturert.

## 3. Gjenstår før første invitasjon

### 🔴 AVVIK — to poster, ingen av dem kode

| ID | Sak | Ansvar | Beskrivelse |
|---|---|---|---|
| F-6 | `.env` → passordhåndterer | George, manuelt | Hemmeligheter ligger i klartekst i `.env`. Skal flyttes før produksjonsdata finnes. Kilde: `MASTERSPLINTER-SIKKERHET-v1.0.md`. |
| F-7 | Sende invitasjoner | George, manuelt | Invitasjonsporten er bygget (`lib/beta/invites.ts`, `/admin/invites`). Ingen adresser er lagt inn. |

**Ingen av disse krever kodeendring.** Plattformen er teknisk klar.

## 4. Det som faktisk mangler

### 🔵 KONSEPT
Beta betyr at ekte mennesker legger ekte historier inn i systemet. Fra den dagen er ikke spørsmålet lenger «virker koden», men **«ser vi at den virker, og oppdager vi det når den ikke gjør det».**

Tosom har ingen supportavdeling. Det finnes én person som skal se hele plattformen: George. Da må plattformen kunne ses fra ett sted.

### 🟢 IMPLEMENTERT — D-1 … D-7 alle lukket
De sju avvikene i admin-panelet (kartlagt i `ADMIN-KOMMANDOPANEL-v1.0.md`) er alle lukket i commit `d1cae09` (K-1 … K-9):

| ID | Avvik | Status |
|---|---|---|
| D-1 | Sju sider ikke lenket i navigasjonen | ✅ K-2 — alle ruter lenket i 4 grupper |
| D-2 | `/admin/chat` viste oppdiktede samtaler | ✅ K-7 — mot ekte data, `mockChats` fjernet |
| D-3 | `/admin/tools` viste oppdiktet logg | ✅ K-8 — mot ekte logg, `mockLogs` fjernet |
| D-4 | Indikatorer uten mening | ✅ K-3 — `thresholds.ts` sier hva tallet betyr |
| D-5 | Ingen handlingsoversikt | ✅ K-4 — «Krever handling»-stripe |
| D-6 | Emoji + hardkodet farge | ✅ K-1 — SVG-ikoner, tokens |
| D-7 | Layout leste sti via `x-url`-header | ✅ K-9 — restrukturert med rutegruppe `(panel)/` |

**Et panel som viser oppdiktede tall er verre enn ingen panel** — derfor var D-2 og D-3 forutsetningen for første invitasjon. De er nå mot sannt data.

---

# DEL II — DRIFTSRUTINEN

## 5. Rytmen

### 🔵 KONSEPT
Tosom har én matcherunde i uken, natt til lørdag (invariant I-10). Driften følger samme rolige rytme som produktet. Ingen overvåkning døgnet rundt, ingen varsler som vekker deg.

Tre faste blikk:

| Når | Hva | Varighet |
|---|---|---|
| **Lørdag formiddag** | Gikk matcherunden bra? | 5 minutter |
| **Mandag morgen** | Ukesblikk — reiser, rapporter, kø | 10 minutter |
| **Daglig** | Kun hvis panelet er gult eller rødt | 0–5 minutter |

Er alt grønt på forsiden, er du ferdig. Det er hele poenget med panelet.

## 6. Lørdag formiddag — matcherunden

### Sjekkliste

| Indikator | Grønt betyr | Terskel |
|---|---|---|
| Siste matcherunde | Runden kjørte i natt | < 26 t siden |
| Runde-varighet | Motoren jobbet normalt | < 30 s |
| Kø-størrelse | Nok folk til neste runde | ≥ 20 |
| Feil 24 t | Ingenting brast under kjøringen | < 10 |

**Hvis siste matcherunde er rød (> 48 t):** runden har ikke kjørt. Sjekk cron i `/admin/system/status`, kjør manuelt fra `/admin/tools`, og logg hva som skjedde.

**Hvis kø-størrelsen er rød (0):** ingen står i kø. Under beta er dette forventet i starten — det betyr at flere invitasjoner må ut, ikke at noe er ødelagt.

**Hvis runde-varigheten er rød (> 50 s):** motoren bruker for lang tid. Noter tallet, ikke grip inn. Dette er data til tuning etter beta, ikke en hendelse.

## 7. Mandag morgen — ukesblikk

### Sjekkliste

| Indikator | Grønt betyr | Terskel |
|---|---|---|
| Åpne rapporter | Ingen har meldt fra om noe | 0 |
| Feil 24 t | Systemet er stille | < 10 |
| Gratiskvote | God margin på tjenestekvoter | < 8 000 |
| Reisefaser | Par beveger seg framover | Ingen fast terskel |

Se også: hvor mange invitasjoner er tatt i bruk, hvor mange reiser er i hver fase, og om noen par har stått stille en hel uke.

**Åpne rapporter behandles alltid samme dag.** Én rapport er gult, mer enn fem er rødt. Dette er den eneste indikatoren hvor gult krever handling umiddelbart — noen har tatt seg bryet med å si fra.

## 8. Terskler og eskalering

### 🟢 IMPLEMENTERT
Tersklene er kanoniske og ligger i kode: `components/admin/StatusBadge.tsx`.

| Indikator | 🟢 Grønn | 🟡 Gul | 🔴 Rød |
|---|---|---|---|
| Siste matcherunde | < 26 t | 26–48 t | > 48 t |
| Kø-størrelse | ≥ 20 | 1–19 | 0 |
| Runde-varighet | < 30 s | 30–50 s | > 50 s |
| Åpne rapporter | 0 | 1–5 | > 5 |
| Feil 24 t | < 10 | 10–50 | > 50 |
| Gratiskvote | < 8 000 | 8 000–9 500 | > 9 500 |
| 5xx siste time | 0 | 1–5 | > 5 |
| DB-forbindelser | < 50 % | 50–80 % | > 80 % |

### Hva fargene betyr

| Farge | Betydning | Handling |
|---|---|---|
| 🟢 Grønn | Alt som forventet | Ingen |
| 🟡 Gul | Verdt å se på | Samme dag |
| 🔴 Rød | Noe er galt nå | Umiddelbart |

**Disse tersklene endres ikke under beta.** Å flytte en grense fordi tallet er ubehagelig er å slutte å måle. Er en terskel feil, noteres det og justeres etter beta med data i hånd.

---

# DEL III — RAMMER

## 9. Suksesskriterier

### 🔵 KONSEPT
Beta lykkes ikke hvis mange melder seg på. Beta lykkes hvis **noen få kommer helt gjennom reisen og sier at den var verdt tiden.**

| Mål | Kriterium |
|---|---|
| Fullført onboarding | ≥ 60 % av inviterte som logger inn |
| Match gitt | ≥ 80 % av kø får match i første runde de deltar i |
| Reise passerer dag 15 | ≥ 40 % av par |
| Reise fullført til dag 30 | ≥ 20 % av par |
| «Vi fant hverandre» | ≥ 1 par |
| Rapporter om upassende oppførsel | 0 |

Det siste tallet er det viktigste. Tosom lover et trygt rom.

## 10. Avbruddskriterier

### 🔵 KONSEPT
Beta stanses umiddelbart dersom ett av disse inntreffer:

| # | Hendelse |
|---|---|
| 1 | Personopplysninger lekker mellom brukere |
| 2 | En bruker ser en annens private onboarding-profil |
| 3 | Bilder blir synlige før dag 15 (invariant I-6) |
| 4 | En bruker får mer enn én aktiv match (invariant I-1) |
| 5 | Matcherunden gir samme person to matcher i samme runde |
| 6 | Sletting etter «vi fant hverandre» etterlater data (invariant I-13) |

Stans betyr: `MAINTENANCE_MODE=true` i `config/features.ts`, deretter diagnose. Ikke retting i produksjon under press.

## 11. Invarianter for drift

### 🔵 KONSEPT
De 14 invariantene i SUPER-MASTERPLAN §16 gjelder uendret. I tillegg gjelder fire driftsinvarianter under beta:

| # | Driftsinvariant |
|---|---|
| DI-1 | Admin leser aldri innholdet i en samtale uten at en rapport foreligger |
| DI-2 | Terskler endres ikke mens beta pågår |
| DI-3 | Ingen retting direkte i produksjon — alt går gjennom patch, test og deploy |
| DI-4 | Admin-panelet viser aldri oppdiktede tall |

DI-1 er en tillitsregel. Panelet skal vise **at** en samtale finnes og hvor aktiv den er — ikke hva som ble sagt. DI-4 er grunnen til at D-2 og D-3 må lukkes før første invitasjon.

## 12. Rekkefølge

### Før første invitasjon

| Steg | Hva | Dokument | Status |
|---|---|---|---|
| 1 | Lukk D-2 og D-3 — fjern alle oppdiktede tall | KOMMANDOPANEL K-7, K-8 | ✅ lukket (`d1cae09`) |
| 2 | Lukk D-1 — gjør alle sider synlige | KOMMANDOPANEL K-2 | ✅ lukket (`d1cae09`) |
| 3 | Lukk D-4 og D-5 — panelet skal si hva som skal gjøres | KOMMANDOPANEL K-3, K-4, K-5 | ✅ lukket (`d1cae09`) |
| 4 | F-6 — hemmeligheter til passordhåndterer | MASTERSPLINTER | ⏳ manuelt (George) |
| 5 | Legg inn 10 adresser, ikke 50 | BETA-ACCESS | ⏳ manuelt (George) |

### Etter de første ti

| Steg | Hva |
|---|---|
| 6 | Én uke observasjon. Én matcherunde. Panelet i bruk hver dag. |
| 7 | Rett det som dukker opp. |
| 8 | Utvid til 50 inviterte. |

**Ti først.** Finner du en feil med ti brukere, er det en samtale. Finner du den med hundre, er det en krise.

## 13. Sluttord

Tosom er ferdig nok til å møte mennesker. Testene er grønne, invariantene holder, blokkerene er lukket.

Det som gjenstår er ikke å bygge mer produkt, men å kunne **se** produktet mens det er i bruk. Et kommandopanel som forteller sannheten, sier hva som krever handling, og tier når alt er som det skal.

Deretter: ti mennesker, én lørdag, og tretti dager.

---

*Neste dokument: `ADMIN-KOMMANDOPANEL-v1.0.md` — gjennomføring av D-1 … D-7.*
