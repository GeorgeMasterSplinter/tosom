# TOSOM — BETA ACCESS PLAN v1.0

**Dato:** 2026-08-19
**Commit:** `bc1ef13`
**Omfang:** Lukket beta, 50–100 inviterte brukere
**Grunnlag:** `TOSOM-PLATTFORMDIAGNOSE-v2.0.md`, `SECURITY-STABILITY-PLAN-v2.0.md`

---

## 1. Utgangspunkt

**Ingen ekte bruker kan logge inn i dag.** Dette er ikke en risiko — det er tilstanden.

`lib/auth/config.ts:32-37` erstatter e-postutsendelsen med en `console.log`. EmailProvider er eneste provider. Magic link-lenken eksisterer kun i serverloggen.

Alt annet i dette dokumentet forutsetter at B-1 er løst.

### Blokkere før én eneste invitasjon sendes

| ID | Sak | Hvorfor |
|---|---|---|
| 🔴 B-1 | Magic link sendes ikke | Ingen kommer inn |
| 🔴 B-4 | Admin-eskalering | Enhver bruker kan lese admin-data |
| 🔴 B-3 | PDF-eksport mangler | Vi sletter data vi lovet å utlevere |
| 🔴 S-18 | Ingen verifisert `next build` | Vet ikke om produksjon bygger |
| 🟠 A-1 | Bildesperre ikke håndhevet | Bryter kjerneløftet |
| 🟠 A-2 | CHECKIN uoppnåelig | Reisen lander aldri |
| 🟠 S-15 | Blokkering ufullstendig | Trygghet i 30 dagers samtale |

---

## 2. Innlogging

### 2.1 Valgt vei: magic link på e-post

For 50–100 inviterte er magic link riktig. Ingen passord å glemme, ingen passord å lekke, og invitasjonen *er* tilgangen.

Hele flyten finnes allerede — kun utsendelsen mangler.

### 2.2 Tiltak

**Implementer reell `sendVerificationRequest`.** SMTP er allerede konfigurert (`EMAIL_SERVER_HOST/PORT/USER/PASSWORD`, `EMAIL_FROM`).

E-posten skal følge språkmanualen — rolig, varm, uten hastverk:

> **Emne:** Din innlogging til Tosom
>
> Hei,
>
> Her er lenken din til Tosom. Den er gyldig i 24 timer.
>
> [Logg inn]
>
> Hvis du ikke ba om denne lenken, kan du se bort fra e-posten.

Ingen markedsføring. Ingen «skynd deg». Ingen utropstegn.

**Akseptanse:** En invitert person mottar e-posten og kommer inn i dashbordet.

### 2.3 Vipps

Callback er død kode (`vipps/callback/route.ts:229` kaller en fjernet provider).

**Beslutning for beta:** Skjul Vipps-knappen bak `VIPPS_ENABLED=false`. Behold koden. En knapp som alltid feiler er verre enn ingen knapp.

Vipps fullføres før åpen lansering, ikke før beta.

---

## 3. Invitasjonsport

### 3.1 Krav
Kun inviterte skal komme inn — også hvis noen deler lenken videre.

### 3.2 Anbefalt: hviteliste på e-post

Enkleste løsning som faktisk holder:

1. Tabell `BetaInvite`: `email`, `invitedAt`, `usedAt`, `note`
2. `signIn`-callback avviser e-poster som ikke står i tabellen
3. Avvisning gir en rolig melding:
   > «Tosom er i lukket beta. Vi åpner for flere etter hvert.»
4. `REGISTRATION_ENABLED=false` stenger den åpne registreringen

Ingen invitasjonskoder å miste, ingen lenker som lekker. Adressen er nøkkelen.

### 3.3 Administrasjon
Enkel admin-flate for å legge til e-poster og se hvem som har tatt i bruk invitasjonen. Bak `adminAuthGuard()` — etter at B-4 er rettet.

---

## 4. Rekruttering

### 4.1 Geografisk konsentrasjon — viktigst

Radius er en hard dealbreaker. 60 brukere spredt over Norge gir få gyldige par; 60 i Oslo/Akershus gir mange.

**Anbefaling:** Rekrutter fra Oslo/Akershus først. Dette løser radius-problemet i rekrutteringen i stedet for i koden — langt bedre enn å svekke filteret.

### 4.2 Balanse
Matching krever kompatible par. Skjev kjønnsfordeling eller aldersfordeling gir en kø som aldri tømmes.

**Mål:** Jevn fordeling på kjønn og søkepreferanse. Aldersspenn konsentrert, f.eks. 28–45, framfor 23–70.

### 4.3 Volum
Start med **20–30**. Kjør to lørdagsrunder. Observer. Utvid deretter til 50–100.

En liten første kohort gjør at feil rammer få mennesker. Det er verdt mer enn rask vekst.

### 4.4 Forventninger til deltakerne
Vær ærlig i invitasjonen:
- Dette er en beta
- Matcherunden går natt til lørdag
- Får du ikke match, venter du til neste lørdag
- Reisen er 30 dager
- Ting kan gå galt, og vi vil gjerne høre om det

---

## 5. Observasjon

### 5.1 Per matcherunde
Se MATCHING-TUNING M-9. Minimum:

`queueSize` · `pairsEvaluated` · avvisninger per dealbreaker-type · `pairsBelowMinScore` · `matchesCreated` · scorefordeling · nivåfordeling · `oldestQueueAgeDays` · `durationMs`

### 5.2 Per bruker gjennom trakten

| Punkt | Måler |
|---|---|
| Invitasjon sendt → første innlogging | Fungerer e-posten? |
| Innlogging → onboarding startet | Er terskelen for høy? |
| Onboarding startet → fullført | **Hvilket steg mister vi folk på?** |
| Fullført → i kø | Er overgangen tydelig? |
| I kø → match | Hvor mange runder venter de? |
| Match → første melding | Tør de å begynne? |
| Dag 1 → dag 30 | Frafall per fase |
| Dag 30 → valg | Hvilket utfall? |

Onboarding har 13 steg. Frafall per steg er den mest verdifulle enkeltmålingen i hele betaen.

### 5.3 Varsling til George
- Matcherunden feilet eller uteble
- Null matcher med ≥ 10 i kø
- Noen har ventet > 14 dager
- Rapport eller blokkering opprettet — **umiddelbart**
- Feilrate over normalen i Sentry

### 5.4 Personvern i observasjonen
Vi måler **atferd**, aldri innhold. Ingen skal lese brukernes samtaler. Ingen skal lese `DeepProfile`. Aggregerte tall og hendelser er nok.

Dette er ikke bare jus. Det er hele premisset for at noen tør å skrive noe ekte hos oss.

---

## 6. PDF-eksport — blokker

### 6.1 Problemet
`endJourney.ts:211-213` sletter begge kontoer permanent ved «Vi fant hverandre». `avslutning/page.tsx:240` lover eksport først. **Generatoren finnes ikke.**

To mennesker som lykkes mister 30 dager med samtaler, etter å ha blitt lovet det motsatte.

### 6.2 Krav

**Innhold:**
- Begge fornavn, start- og sluttdato
- Alle 30 dagers temaer
- Hele samtalen i kronologisk rekkefølge
- Delte oppgaver og refleksjoner
- Resonansen i ord — aldri tall (I-12)

**Utforming:**
Dette er ikke en datadump. Det er et minne fra begynnelsen av en relasjon.
Tosom Blue, Nordic Gold, Inter, rolig typografi, god luft.

**Flyt:**
1. Bruker velger «Vi fant hverandre»
2. Eksporten tilbys — tydelig at kontoen slettes etterpå
3. Bruker laster ned eller avviser aktivt
4. Først da utføres slettingen

Slettingen skal **ikke** kunne fullføres uten at eksporten er tilbudt.

### 6.3 Teknisk
Server-side generering. Bruk eksisterende avhengigheter hvis mulig; ellers ett minimalt PDF-bibliotek.

Merk: begge parter må kunne laste ned. Den som velger sist skal ikke miste muligheten fordi den andre allerede utløste slettingen.

### 6.4 Test
- Bruker laster ned → PDF inneholder hele samtalen → sletting utføres
- Bruker avviser → sletting utføres
- Bruker lukker vinduet → **ingen sletting**
- Begge parter får hver sin kopi

---

## 7. Testmatrise

### 7.1 Innlogging
- [ ] Invitert e-post mottar magic link
- [ ] Lenken logger inn
- [ ] Ikke-invitert avvises med rolig melding
- [ ] Utløpt lenke gir forståelig feil
- [ ] Vipps-knapp er skjult

### 7.2 Onboarding
- [ ] Alle 13 steg kan fullføres
- [ ] Postnummer valideres og gir koordinater
- [ ] Halvferdig onboarding kan gjenopptas
- [ ] Ufullstendig profil kommer ikke i kø
- [ ] Fullført profil settes til `QUEUED` med `matchQueuedAt`

### 7.3 Matcherunden — i ekte database
- [ ] Runden kjører lørdag 02:00
- [ ] `CRON_SECRET` avviser uautoriserte kall
- [ ] Advisory lock hindrer parallell kjøring
- [ ] Under 2 i kø → defer, ingen match
- [ ] Match oppretter `Match` + `Conversation` + `JourneyProgress` + 2 varsler
- [ ] **Ingen e-post/SMS/push sendes** (I-4)
- [ ] Uten match → forblir `QUEUED` til neste lørdag
- [ ] Dealbreakere avviser korrekt
- [ ] Score under 40 gir ingen match
- [ ] Tidligere par matches ikke på nytt
- [ ] Korrupt profil velter ikke runden (M-3)

### 7.4 Reisen — i ekte database
- [ ] Dag 1 starter ved match
- [ ] Daglig cron framfører dagteller
- [ ] Fase skifter 1–14 / 15–21 / 22–25 / **26–30 CHECKIN**
- [ ] **Bildeopplasting avvises før dag 15** (403)
- [ ] Bildeopplasting tillates fra dag 15
- [ ] Dagens tema vises riktig
- [ ] Dag 30 leder til avslutningsvalget

### 7.5 Chat
- [ ] Meldinger sendes og mottas i sanntid
- [ ] Ferdige spørsmål legges i samtalen
- [ ] Ulest-teller stemmer
- [ ] **Bruker C får ikke tilgang til A og B sin samtale** (403)
- [ ] Rate limiting virker
- [ ] Blokkering stanser videre meldinger

### 7.6 «Vi fant hverandre»
- [ ] Valget vises på dag 30
- [ ] PDF tilbys før sletting
- [ ] PDF inneholder hele samtalen
- [ ] Begge kontoer slettes fullstendig
- [ ] `MatchHistory` består anonymisert
- [ ] Bildefiler slettes fra lagring
- [ ] Den andre parten får en verdig melding

### 7.7 Avslutning og sletting
- [ ] «Ny reise» → tilbake i kø
- [ ] Tidlig exit → samtalen slettes for begge
- [ ] Partner varsles rolig og respektfullt
- [ ] Kontosletting fjerner alt (S-9)
- [ ] JSON-eksport virker

### 7.8 Full loop
Én sammenhengende gjennomkjøring med to ekte testkontoer:

onboarding → kø → lørdagsrunde → match → 30 dager (framskyndet) → alle fire faser → bildesperre verifisert → avslutning → PDF → sletting

Dette er den viktigste testen. Alt annet er delmengder av den.

---

## 8. Tidslinje

### Uke 0 — blokkere
`next build` grønn · magic link · admin-auth · fasedefinisjon · bildesperre · Vipps skjult · dev-ruter stengt

### Uke 1 — PDF og port
PDF-eksport · invitasjonsport · blokkering fullført · Sentry PII-skrubbing

### Uke 2 — verifisering
Full loop-test i staging · gjenopprett backup · varsling · testmatrise gjennomført

### Uke 3 — første kohort
20–30 inviterte fra Oslo/Akershus · første lørdagsrunde · observer

### Uke 4–5 — utvidelse
Til 50–100 hvis runde 1–2 var sunne · andre og tredje runde · innsamling av data til Del B-tuning

---

## 9. Avbruddskriterier

Stans betaen umiddelbart ved:

- Datalekkasje mellom brukere
- Sletting som ikke sletter
- Matcherunden feiler to lørdager på rad
- Rapport om utrygghet uten fungerende blokkering
- PDF som mangler eller er ufullstendig ved sletting

`MATCHING_ENABLED=false` stanser runden uten å ta ned produktet. `MAINTENANCE_MODE=true` tar ned alt. Ingen deploy nødvendig.

---

## 10. Suksesskriterier

Ikke vekst. Ikke matcherate.

1. **Ingen mister data de ble lovet.**
2. **Ingen føler seg utrygg uten å kunne gjøre noe.**
3. **De som får match, begynner å snakke.**
4. **Minst ett par når dag 30.**
5. **Vi lærer hvor onboarding mister folk.**

Ett par som fant hverandre er en bedre beta enn hundre brukere som forsvant på steg 7.