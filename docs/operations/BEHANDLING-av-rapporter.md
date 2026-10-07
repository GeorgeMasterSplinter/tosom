# Behandling av rapporter — rutine for ToSom

**Status:** UTKAST (PL-G9) — George skal godkjenne navne/endringer før lansering.
**Gjelder fra:** lansering
**Ansvarlig eier av rutinen:** George

## Hvem leser rapporter

- Rapporter vises i admin-panelet under **Rapporter** (inkl. vedlegg, bevis og
  konversationsekstrakt fra den aktuelle samtalen).
- Hver rapport behandles av en person ToSom stoler på (i dag: George).
  Ved høyt nivå er hastighet viktigst — da behandles rapporten umiddelbart,
  ikke ved neste rutinegjennomgang.
- Brukere som rapporterer svarer vi alltid, også når vi ikke handler:
  «Vi har sett på dette. Takk for at du meldte fra.»

## Hvor raskt

| Prioritet | Eksempel | Svar til rapporterende | Handlingsfrist |
|---|---|---|---|
| **Høy** | Trusler, vold, seksuelt innhold, selvskading, mindreårige | Samme dag | Samme dag |
| **Middel** | Stalking-lignende, gjentatt uønsket kontakt, mobbing | Innen 24 timer | Innen 72 timer |
| **Lav** | Uvett, overtramp, usmakelig språk | Innen 24 timer | Neste rutinegjennomgang (daglig) |

Gjennomgangen skjer daglig i åpningstidene. Høyprioriterte rapporter behandles
akkurat når de kommer inn.

## Hva skjer — eskalering

1. **Advarsel** — ved første overtramp. Brukeren får en kort, rolig melding
   fra ToSom om hva som ikke er lov her, og at gjentakelse gir utestengelse.
2. **Tidsavgrenset utestengelse** (7–30 dager) — ved gjentakelse eller
   alvorlig overtramp.
3. **Permanent utestengelse** — ved alvorlig eller gjentatt alvorlig
   overtramp (trusler, sexting, stalking, hat).
4. **Politiet** — ved trusler om vold, seksuelt innhold knyttet til
   mindreårige, eller selvskading. Vi sletter aldri bevis vi mener politiet
   trenger: beviset ligger i rapporten i 90 dager (PL-15), og utestengelse
   stopper ikke bevisopplagringen.

## Personvern

- Kun den ansvarsfulle ser rapportene (i dag: George).
- Rapporten og vedleggene slettes automatisk 90 dager etter mottak
  (cron, PL-15) — med mindre saken er overlevert politiet.
- Rapportøren er alltid anonym for den rapporterte.

## Vedlegg til rutinen

- Admin: Rapporter-tabellen + «Svar på rapport»-handlingen.
- Blokkering: skjer i samme panel; utestengelse er permanent blokkering
  + sletting av match (reiser avsluttes stille, PL-15).