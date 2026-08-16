# ToSom — Ekstern overvåking av cron-helsesjekken

## 1. Hvorfor ikke en cron-jobb i Vercel?

Helsesjekken (`GET /api/cron/health`) kan ikke kjøres som en Vercel-cron, fordi
Vercel Hobby-planen tillater maksimalt to cron-jobber. Begge er allerede brukt:

- `cron:matching` — matcherunden
- `cron:journey` — reise-utviklingen

Derfor må noe **utenfor** Vercel ringe til endepunktet med jevne mellomrom.

## 2. Endepunkt

```
https://<domene>/api/cron/health
```

Eksempel for produksjon: `https://app.tosom.no/api/cron/health`

## 3. Autentisering

Endepunktet krever alltid `CRON_SECRET`. To måter å levere hemmeligheten:

### Måte A — Bearer-header (anbefalt der det er mulig)

```
Authorization: Bearer <CRON_SECRET>
```

### Måte B — Query-parameter (når tjenesten ikke kan sende egendefinerte headere)

```
https://<domene>/api/cron/health?token=<CRON_SECRET>
```

Query-parameteren brukes **kun** når headeren mangler helt.

**Viktig:** `?token=` i URL betyr at hemmeligheten kan lande i loggene til
overvåkingstjenesten og i nettleserhistory dersom du tester i nettleser.
Bruk Måte A der tjenesten støtter det. Måte B finnes fordi mange gratis
overvåkingstjenester (f.eks. UptimeRobot Free, pingdom-klasser) bare sender en
enkelt URL uten mulighet for headere.

## 4. Anbefalt intervall

**15 minutter.** Endepunktets standard terskel er 30 minutter — to mistede
hjerteslag før alarm. Med 15-minutters intervall oppdager du et problem innen
om lag en time.

## 5. Alarmregel

Varsle ved:

- **HTTP 503** (STALE) — hjerteslaget er gammelt
- **Manglende svar / timeout** — tjeneren er nede helt
- **HTTP 500** — misconfiguration (f.eks. manglende `CRON_SECRET` i miljøet)

## 6. Hva betyr 503?

Matcherunden har ikke skrevet hjerteslag til `SystemLog` (modul
`cron:matching`) på terskelen (standard 30 minutter). Mulige årsaker:

- Cron-jobben kjører ikke (Vercel-kvote opp, deploy-feil)
- Matcherunden krasjer før den når loggeringen
- Databasetilkobling ned
- Kill switch (`MATCHING_ENABLED=false`) er satt — da er 503 **forventet**

> **v8 — ukentlig kadens:** Matcherunden kjører nå kun natt til lørdag
> (se seksjon 8). Helsesjekkens standard terskel på **30 minutter gir derfor
> ikke lenger mening for matcherunden** mellom lørdagene — den vil melde 503
> de syv dagene uten runde. Endepunktet bruker fortsatt én fellesterkel for
> begge jobbene, slik at matching-seksjonen i responsen vil vise
> `heartbeatRecent: false` til neste lørdag. Journey-seksjonen (daglig)
> fortolkes uendret. **Løsning er ikke implementert i v8** — se rapporten om
> at terskelen skal skilles per jobb (daglig for journey, ukentlig for
> matching). Til da: forvent 503 i `matching`-feltet mellom lørdagene, og
> bruk `journey`-feltet som bekrefter at tjeneren lever.

Responsen viser også `journey`-hjerteslaget, slik at du kan se om én eller
begge cron-jobbene er stille.

## 7. Setup i overvåkingstjenesten (steg for steg)

1. Logg inn i overvåkingstjenesten (f.eks. UptimeRobot, Pingdom, BetterStack,
   Cronitor).
2. Opprett en ny **HTTP(S) monitor** (ikke TCP-ping).
3. Sett URL til `https://<domene>/api/cron/health` (med `?token=` hvis
   tjenesten ikke støtter headere).
4. Under header-felt: legg til `Authorization: Bearer <CRON_SECRET>` hvis
   støttet.
5. Sett intervall til **15 minutter**.
6. Alarmbetingelse: «fail på 503, 5xx eller timeout».
7. Koble alarmen til kanal du faktisk ser (e-post/Slack/Telegram).
8. Bekreft at monitoren gir `up` mot et sunt system og `down` ved å
   midlertidig endre tokenet — før du gjenoppretter det.

## 8. Cron-tider (v8)

Vercel tolker cron-uttrykk alltid som UTC og støtter ikke tidssoner.

| Jobb | UTC | Norsk sommer (CEST, UTC+2) | Norsk vinter (CET, UTC+1) |
|---|---|---|---|
| matching (ukentlig) | `0 2 * * 6` | lørdag 04:00 | lørdag 03:00 |
| journey (daglig) | `0 4 * * *` | 06:00 | 05:00 |

Matcherunden kjører nå ukentlig — natt til lørdag. Journey-runden fortsetter
å kjøre daglig. Antall cron-jobber er fortsatt to (Hobby-grensen er uendret).
Sommertid er valgt som referanse. Forskyvningen én time om vinteren er
akseptert (A10).

## 9. Status for ACT v6


Dette dokumentet fullfører **repo-delen** av avvik A9. **Registrering av
monitoren i selve overvåkingstjenesten er en manuell oppgave utenfor
ACT v6** — den skjer i nettleseren mot den valgte tjenesten, ikke i dette
repoet. Den er listet som én av de fire gjenværende beta-oppgavene i
`docs/TOSOM-ACT-INSTRUKS-v6.0.md` del 8.2.