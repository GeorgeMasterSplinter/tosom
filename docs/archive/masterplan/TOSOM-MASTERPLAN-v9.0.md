# TOSOM — MASTERPLAN v9.0
## Drift & Skalering

**Dato:** 2026-08-19
**Commit:** `e7fe325` (main, rent arbeidstre)
**Forgjenger:** `TOSOM-SUPER-MASTERPLAN-v1.0.md` — fortsatt kanonisk for *hva Tosom er*
**Følgedokumenter:** `MASTERSPLINTER-HERDING-v1.0.md` · `HOSTING-MIGRATION-PLAN-v1.0.md` · `VIPPS-INTEGRATION-PLAN-v1.0.md`

> v1.0 beskrev **hva Tosom er**. v9.0 beskriver **hvordan Tosom drives og vokser** — uten å miste det som gjør det verdt å bygge.

---

# DEL I — NÅTILSTAND

## 1. Etter ACT-pipeline Runde 1–4

33 commits over `bc1ef13`. Alle fire opprinnelige blokkere rettet.

| Måling | Status |
|---|---|
| Tester | **164/164 grønne** |
| `tsc --noEmit` | **0 feil** |
| `next build` | **exit 0** — verifisert |
| Arbeidstre | Rent @ `e7fe325` |
| API-ruter | 112 |
| Datamodeller | 28 · 17 migrasjoner |

**Verifisert i kode:**

- **Én matchmotor.** Cron-ruten er eneste vei. 5 døde motorer / 7 filer fjernet (M-7).
- **Én fasedefinisjon.** `PHASE_CONFIGS` kanonisk; `journeySync.ts` importerer `dayToPhase`/`isPhotosAllowed`. CHECKIN (26–30) nåbar.
- **Bildelås håndhevet server-side** på dag 15.
- **M-4 differensiert sperreliste** — verifisert where-klausul:
  ```ts
  OR: [
    { OR: [{ outcomeA: { in: PERMANENT_OUTCOMES } }, { outcomeB: { in: PERMANENT_OUTCOMES } }] },
    { endedAt: { gte: sixMonthsAgo } },
  ]
  ```
- **PDF-eksport** før sletting. **Invitasjonsport** aktiv. **UserBlock** i hovedmotoren.

## 2. Forutsetninger

| Beslutning | Verdi |
|---|---|
| Gratis-bølgen | **5 000 gratis 30-dagers reiser** — ikke gratis kontoer |
| Etter reisen | Kjøp av ny reise. **Ingen har konto for alltid** |
| Pris | **349 kr** per reise |
| Innlogging | **Vipps — eneste vei.** Magic link kun for ~50 betatestere |
| Bilder | Åpnes dag 15, sendes direkte, **slettes ved reiseslutt** |
| PDF | Til begge når de velger hverandre — det eneste som overlever |
| Kø per lørdag | 400–1 500 forventet, **men må tåle 3 000+** |
| Beredskap | **8 000 registreringer på én uke skal ikke velte plattformen** |
| Produksjon | **Ingenting på MasterSplinter.** Alt hos leverandør |

---

# DEL II — KAPASITET

## 3. Målt, ikke antatt

Simulering med dealbreakere, haversine og sperreliste-oppslag med tidlig exit — slik koden faktisk fungerer:

| Kø | Par vurdert | CPU-tid |
|---|---|---|
| 1 000 | 499 500 | 0,05 s |
| 1 500 | 1 124 250 | **0,13 s** |
| 2 000 | 1 999 000 | 0,18 s |
| 3 000 | 4 498 500 | **0,34 s** |
| 4 000 | 7 998 000 | 0,75 s |
| 5 000 | 12 497 500 | **1,09 s** |

**Scoringen er ikke flaskehalsen.** Dealbreakerne kaster ut de fleste par før `unifiedScore()` kalles. O(n²) er uproblematisk i praksis.

## 4. Den virkelige grensen: databaseskrivingene

`app/api/cron/matching/route.ts:342-346` — **én transaksjon per par**, med 8 skrivinger:

```
Match · Conversation · JourneyProgress ×2 · Notification ×2 · User.update ×2
```

Ved 3 000 i kø → ~1 500 par → **~12 000 skrivinger i 1 500 sekvensielle transaksjoner.**

Med managed Postgres (5–15 ms nettverkslatens per rundtur):

| Kø | Par | Est. tid | Innenfor 50 s? |
|---|---|---|---|
| 1 000 | ~500 | ~20 s | ✅ |
| 2 000 | ~1 000 | ~40 s | ⚠️ nær |
| 3 000 | ~1 500 | **~60 s** | ❌ **over** |
| 5 000 | ~2 500 | ~100 s | ❌ |

**Klippekanten: ~1 200–1 500 par (≈2 400–3 000 i kø).** Årsak: I/O-latens, ikke CPU.

## 5. Fire tiltak som løser det

**S1 — Batch transaksjonene** 🔴
50 par per transaksjon i stedet for 1. Reduserer rundturer 50×. Estimert ny kapasitet: **5 000+ i kø innenfor budsjettet.** Dette er den viktigste enkeltendringen.

**S2 — `createMany` for Notification og JourneyProgress** 🟠
Fire enkeltskrivinger per par blir to bulk-operasjoner.

**S3 — Fortsettelses-cron** 🔴
Hvis budsjettet treffes: planlegg en oppfølgingsrunde 15 min senere som tar resten av køen. Advisory lock gjør dette trygt. **8 000 i kø blir tre runder — ingen krasj, ingen tap.**

**S4 — Gjør `take: 3000` konfigurerbar** 🟡
`route.ts:162`. Miljøvariabel `MATCHING_QUEUE_LIMIT`, standard 5 000.

Med S1 + S3 tåler plattformen mirakel-uken.

## 6. Registreringsspike: 8 000 på én uke

~1 150/dag mot normalt 30–50 — en 23–38× spike. Treffer registrering, onboarding-skriving, e-post og tilkoblinger.

| Tiltak | Hvorfor |
|---|---|
| **Connection pooling** (Neon/Supabase innebygd) | Uten pooler treffer du `max_connections` og alt stopper |
| **Delt rate limiting** (Postgres-basert) | In-memory er virkningsløs over flere instanser |
| **Kø-tak på registrering** | `REGISTRATION_ENABLED=false` som nødbrems |
| **Vipps tar autentiseringslasten** | Ingen e-postutsendelse i skala — stor fordel |

At Vipps er eneste innlogging fjerner faktisk det største spike-problemet: e-postvolum.

---

# DEL III — HOSTING

## 7. Arkitektur

Alt i EU/EØS, kryptert i ro, med databehandleravtale.

| Komponent | Leverandør | Merknad |
|---|---|---|
| App | **Vercel Pro**, EU | `vercel.json` er allerede bygget for dette |
| **Database** | **Neon** eller **Supabase**, Frankfurt/Stockholm | Pooling, PITR, kryptering — ferdig |
| Bilder | **Cloudflare R2** eller Supabase Storage, EU | Erstatter `writeFile` |
| E-post | **Postmark** / **Resend**, EU | Kun ~50 beta-lenker + systemvarsler |
| Cron | Vercel Cron | Holder med S1+S3 |
| Sanntid | Pusher **EU-cluster** | Allerede i bruk |

**Kostnad:** ~700–1 400 kr/md ved 5 000 brukere. ~2 500–4 000 kr/md ved 20 000. Dekket av 3–4 solgte reiser.

**MasterSplinter beholder:** utvikling, Qwen på GPU, syntetiske testdata. **Aldri ekte brukerdata.**

Detaljer: `HOSTING-MIGRATION-PLAN-v1.0.md`

## 8. Bildelagring — blokker

`app/api/chat/image/route.ts:6,149` bruker `writeFile` til lokalt filsystem. Ingen blob/S3/Cloudinary i `package.json`.

På Vercel er filsystemet **efemert** — et bilde delt på dag 16 er borte ved neste deploy.

**Krav:**
1. Objektlagring i EU, kryptert
2. Signerte URL-er med kort levetid — aldri offentlige lenker
3. **Filsletting ved reiseslutt** — ikke bare DB-rader
4. Test som verifiserer at filen faktisk er borte

Punkt 3 er både løftet til brukeren og GDPR art. 17.

---

# DEL IV — DRIFT

## 9. Lørdagsrutinen

Runden kjører 02:00. George sjekker søndag morgen — ikke om natten.

| Sjekk | Hvor |
|---|---|
| Kjørte runden? | `SystemLog`, `module: cron:matching` |
| Antall matcher vs kø | Admin-panel |
| Traff budsjettet? | `durationMs` mot 50 000 |
| Eldste i kø | > 14 dager = noen venter forgjeves |
| Avvisningsfordeling | Dominerer radius? |

**Ved feil:** advisory lock gjør manuell rekjøring trygg. Dokumenter kommandoen.

## 10. Kill switches

`config/features.ts` — endres i leverandørpanelet, ingen deploy:

| Env | Virkning |
|---|---|
| `MATCHING_ENABLED=false` | Stanser runden; køen består |
| `REGISTRATION_ENABLED=false` | Nødbrems ved spike |
| `MAINTENANCE_MODE=true` | Tar ned alt |
| `PAYMENTS_ENABLED` | Kaster ved oppstart til Vipps er koblet |

## 11. Backup

Managed Postgres gir PITR. **Men:** verifiser gjenoppretting til tom database **før** første ekte bruker. En backup som aldri er gjenopprettet, finnes ikke.

## 12. Varsling (S-17)

Varsle George ved: runden feilet · runden uteble innen 03:00 · null matcher med ≥10 i kø · budsjett truffet · eldste i kø >14 dager · **rapport eller blokkering — umiddelbart.**

---

# DEL V — GEOGRAFI & RADIUS

## 13. Koordinat-hullet må lukkes først

```
Postnummer totalt: 5 146
Med koordinater:   3 375
UTEN koordinater:  1 771   ← 34,4 %
```

Og `checkRadius` **feiler åpent** (`lib/matching/dealbreaker.ts:145-151`):
> «Manglende data → IKKE blokkér»

For en tredjedel av norske postnummer gjør radius-innstillingen **ingenting**. Brukeren tror hun har satt 50 km, men kan matches 800 km unna.

De manglende er systematisk **spredtbygde steder** — nøyaktig der du vil ha bred radius. Storbyene er dekket, så beta i Oslo/Akershus går fint. Men 5 000-bølgen når hele landet.

**Tiltak:** hent fullt datasett fra Bring/Posten eller Kartverket (åpne data). Mål: **100 % dekning.** Deretter varsle i admin hvis en bruker mangler koordinater.

## 14. Tetthetsbasert radius

Etter at koordinatene er komplette:

| Område | Min | Maks |
|---|---|---|
| Tett (by) | 30 km | 300 km |
| Spredt (land) | 50 km | 400 km |

**Automatisk tetthetsutledning:** antall postnummer innenfor 25 km fra brukerens punkt. Over terskel = tett. Mulighet for manuell overstyring per kommune.

Brukeren velger fritt innenfor sitt intervall. Radius forblir **hard dealbreaker** — en aktiv preferanse, ikke en gradient.

---

# DEL VI — BRAND & NORSK RELASJONSMODELL

## 15. Stemmen finnes allerede

Signaturgrepet i koden er **negasjon → bekreftelse**:

> «Ikke ti samtaler samtidig. Ikke hundre profiler. Ikke konkurranse. Ikke jag.»
> → «Bare deg — og én person som faktisk passer deg.»
> — `app/hvorfor/page.tsx:317,327`

Og pivoten, gjentatt tre steder som gullinje:

> «Fordi moderne dating har gjort det vanskelig å finne dette. Tempoet er for høyt. Valgene er for mange. Oppmerksomheten er for kort. Folk hopper videre før de rekker å kjenne etter.»
> → **«Tosom gjør det motsatte.»**

Hero: **«Ro. Trygghet. Mening.»** Tre ord, tre punktum.

Dette er ikke markedsføringsspråk lagt på toppen. Det er produktet uttrykt i språk. **v9.0 kodifiserer det — finner det ikke opp.**

## 16. Den norske relasjonsmodellen

Tosom er ikke en norsk oversettelse av en amerikansk app. Modellen er kulturelt spesifikk:

| Norsk verdi | I Tosom |
|---|---|
| Ro over intensitet | Ukentlig runde, ikke døgnkontinuerlig strøm |
| Likeverd | Én match begge veier — ingen rangering, ingen «liker» |
| Tillit før nærhet | 14 dager uten bilder |
| Ærlighet | «Vi fant hverandre» sletter kontoen. Vi tjener ikke på at du blir |
| Uten fasade | Dyp profil, aldri offentlig |
| Måtehold | Ingen gamification, ingen streaks, ingen push |

**Posisjonering:**
- Tinder/Bumble: volum, utseende, hastighet → Tosom: én, dybde, langsomhet
- Sukker.no: norsk, men fortsatt liste-basert → Tosom: ingen liste
- Match: algoritme + betaling for flere → Tosom: betaling for **én** reise

Setningen som bærer forretningsmodellen:
> **«Vi tjener ikke penger på at du blir. Vi tjener penger på at du prøver — én gang, ordentlig.»**

---

# DEL VII — TRYGGHET FOR KVINNER

## 17. Som strategi, ikke funksjonsliste

Dette er Tosoms sterkeste konkurransefortrinn, og det er strukturelt — ikke bolt-on.

| Mekanisme | Effekt |
|---|---|
| **14 dager uten bilder** | Fjerner utseendebasert seleksjon *og* uønskede bilder i åpningsfasen |
| **Én match** | Ingen meldingsflom fra ti fremmede |
| **Ingen søk, ingen liste** | Ingen kan lete deg opp |
| **Privat profil** | Kun motoren leser den |
| **Blokkering → permanent sperre** | Aldri matchet med samme person igjen (M-4) |
| **Sletting for begge** | Ved exit forsvinner samtalen |
| **Trygghetsgap som dealbreaker** | Motoren gambler ikke |

Dette er, samlet, en av de tryggeste relasjonsflatene på markedet — og det er verdt å si tydelig.

## 18. Det som mangler

| Tiltak | Prioritet |
|---|---|
| **Synlig trygghetsside** — samle alt over på ett sted | 🔴 Før lansering |
| **Exit uten forklaring** — alltid tilgjengelig, uten skjema | 🔴 |
| **Vipps-verifisering som identitetsanker** — reelle personer | 🟢 Følger av Vipps |
| Rapportering med rask responstid | 🟠 |
| Bilder kan avvises uten begrunnelse | 🟠 |
| Ingen posisjon i sanntid — kun avstand | ✅ Allerede |

Vipps gir en utilsiktet, stor gevinst: **BankID-verifiserte, betalende voksne.** Det hever terskelen for misbruk dramatisk sammenlignet med e-postregistrering.

---

# DEL VIII — 5 000-BØLGEN

## 19. Mekanikken

5 000 gratis 30-dagers reiser. Ingen konto for alltid. Etter reisen: 349 kr for en ny.

**Verdi gitt bort:** 5 000 × 349 = **1,745 mill. kr.**

| Konvertering | Inntekt |
|---|---|
| 15 % | 262 000 kr |
| 20 % | 349 000 kr |
| 30 % | 524 000 kr |
| 40 % | 698 000 kr |

## 20. Konverteringsøyeblikket

Det viktigste punktet i hele produktet: rett etter en reise som endte.

Tre utfall krever tre helt ulike toner:

**«Vi fant hverandre»** → Ingen salg. Aldri. De får PDF-en og en varm avslutning. *Disse menneskene er markedsføringen din* — de forteller det videre.

**Fullført, men ikke riktig** → Her ligger konverteringen. Rolig:
> «Reisen er over. Hvis du vil prøve igjen, står vi her.»
Ingen nedtelling. Ingen rabatt som utløper. Ingen «du har 24 timer».

**Tidlig avslutning** → Ikke selg umiddelbart. Gi ro. Kanskje en melding etter en uke.

**Ufravikelig:** ingen kunstig knapphet, ingen mørke mønstre. Det ville brutt hele premisset — og brukerne som passer Tosom er nettopp de som gjennomskuer slikt.

## 21. Rekruttering

**Geografisk konsentrasjon først.** Radius er hard dealbreaker: 60 brukere spredt over Norge gir få par; 60 i Oslo/Akershus gir mange.

Bølger: Oslo/Akershus → Bergen/Stavanger/Trondheim → landet.

**Balanse:** jevn fordeling på kjønn og søkepreferanse. Skjev fordeling gir en kø som aldri tømmes. **Følg dette per bølge, ikke totalt.**

**Kanaler:** Redaksjonell omtale (konseptet er en historie: «appen som sletter kontoen din når du lykkes»), podkast, organisk deling fra par som lyktes. **Ikke** performance-annonsering mot volum — det tiltrekker feil brukere.

## 22. Måling

Trakt: invitasjon → innlogging → onboarding startet → **fullført** → kø → match → første melding → dag 15 → dag 30 → valg.

**Viktigste enkeltmåling: frafall per onboarding-steg.** 13 steg er mye. Steg 0 (grunnprofil med postnummer, alder, høyde, kroppstype) er tyngst og først — der mister du flest.

Vi måler **atferd, aldri innhold.** Ingen leser brukernes samtaler.

---

# DEL IX — VIPPS ER KRITISK STI

Vipps er eneste innlogging. **Uten Vipps finnes ingen bølge.**

Dagens tilstand: `app/api/auth/vipps/callback/route.ts:229` kaller `signIn('credentials', …)` mot en fjernet provider — død kode, skjult bak `VIPPS_ENABLED`.

Søknadsbehandling tar uker. **Send søknaden før alt annet.**

Detaljer: `VIPPS-INTEGRATION-PLAN-v1.0.md`

---

# DEL X — KULTURBYGGING

## 23. Språket former brukerne

Tosom tiltrekker gjennom tone. Den som leter etter raske treff, finner ingenting av interesse — det er tilsiktet seleksjon.

**Kulturen vi vil ha:** voksne som tåler å vente en uke · som svarer på et spørsmål framfor å sende «hei» · som tør å skrive noe ekte · som avslutter ærlig framfor å ghoste.

**Hvordan den bygges:** onboarding som krever ettertanke · guidede spørsmål som gir noe å snakke om · 30 dager som gir tid · avslutningsvalget som gjør ærlighet til normen · ingen mekanismer som belønner overflate.

**Det farligste:** å vokse for fort med feil brukere. En kohort med gal kultur ødelegger opplevelsen for de neste. **Derfor bølger, ikke åpen sluse.**

---

# DEL XI — KLARHET

## 24. Beta (50 testere, magic link): **88 %**

| Område | % |
|---|---|
| Kjernefunksjonalitet | 100 % |
| Kodekvalitet (164 tester, 0 typefeil, build grønn) | 100 % |
| Invitasjonsport | 100 % |
| Sikkerhet i app | 90 % |
| Observability | 85 % |
| Geo-dekning | 66 % |
| Hosting | 20 % |
| **Bildelagring** | **0 %** |

**Blokkere:** bildelagring, hosting. Begge små. **3–5 dager.**

## 25. Offentlig lansering: **62 %**

| Område | % |
|---|---|
| Brand & stemme | 70 % |
| Trygghet for kvinner | 75 % |
| Skalering av runden | 55 % |
| Geo/radius | 40 % |
| Juridisk (DPA, personvern) | 30 % |
| Hosting & drift | 20 % |
| **Vipps Login** | **0 %** |
| **Vipps Betaling** | **0 %** |
| **Gratis-kvote (5 000)** | **0 %** |

**Realistisk: 6–10 uker**, der 4–6 er venting på Vipps.

---

# DEL XII — 30-DAGERS PLAN

Eier: **G** = George (kun han), **A** = agent, **G+A** = sammen.

## Uke 1 — Sikre og migrere

| Dag | Oppgave | Eier | Akseptanse |
|---|---|---|---|
| 1 | **Send Vipps merchant-søknad** | **G** | Bekreftelse mottatt |
| 1 | Lukk dev-databaser til `127.0.0.1` + nytt passord | A | `ss -tulnp` viser ikke 0.0.0.0 |
| 1 | Slå på ufw, lås SSH til Tailscale | **G** | `ufw status` = active |
| 2 | Opprett Vercel + Neon + R2, EU-region | **G** | Konti aktive |
| 2 | **Signer DPA hos alle tre** | **G** | Avtaler arkivert |
| 3 | Bildelagring til R2 + signerte URL-er | A | Bilde overlever deploy |
| 3 | Filsletting ved reiseslutt + test | A | Test bekrefter filen borte |
| 4 | Migrer database til Neon | G+A | App kjører mot Neon |
| 5 | Verifiser gjenoppretting av backup | G+A | Gjenopprettet til tom base |
| 5 | Sentry PII-skrubbing | A | Ingen profildata i feilrapport |

## Uke 2 — Skalering og geografi

| Dag | Oppgave | Eier | Akseptanse |
|---|---|---|---|
| 6 | **S1: batch transaksjoner (50 par)** | A | 1 500 par under 20 s |
| 7 | S2: `createMany` for varsler/progresjon | A | Tester grønne |
| 8 | **S3: fortsettelses-cron** | A | 3 000 i kø fullføres over to runder |
| 9 | S4: `MATCHING_QUEUE_LIMIT` konfigurerbar | A | Standard 5 000 |
| 10 | **Fyll postnummer til 100 % dekning** | A | 0 uten koordinater |
| 11 | Tetthetsbasert radius 30–300 / 50–400 | A | Tester for by og land |
| 12 | Delt rate limiting (Postgres) | A | Virker over instanser |

## Uke 3 — Betaling og trygghet

| Dag | Oppgave | Eier | Akseptanse |
|---|---|---|---|
| 13 | Vipps Login (når godkjent) | G+A | Ekte innlogging virker |
| 14 | Gratis-kvote: teller for 5 000 reiser | A | Nr. 5 001 sendes til betaling |
| 15 | Vipps Betaling 349 kr | G+A | Testkjøp fullført |
| 16 | Konverteringsflyt etter reiseslutt | A | Tre toner per utfall |
| 17 | **Trygghetsside** | A | Publisert |
| 18 | Exit uten forklaring, alltid tilgjengelig | A | Ingen skjema kreves |
| 19 | Varsling S-17 | A | Testvarsel mottatt |

## Uke 4 — Beta og forberedelse

| Dag | Oppgave | Eier | Akseptanse |
|---|---|---|---|
| 20 | Full loop-test i produksjonsmiljø | G+A | Onboarding → PDF → sletting |
| 21 | Inviter 20–30 fra Oslo/Akershus | **G** | Invitasjoner sendt |
| 22 | **Første lørdagsrunde med ekte brukere** | G+A | Matcher opprettet |
| 23 | Gjennomgå M-9-tall | G+A | Avvisningsfordeling forstått |
| 24 | Rett det betaen avdekket | A | Tester grønne |
| 25 | Utvid til 50 testere | **G** | Andre runde sunn |
| 26 | Onboarding-frafall per steg | A | Data i admin |
| 27 | Lanseringsside for bølgen | A | Klar, ikke publisert |
| 28 | Beredskapsplan for 8 000/uke | G+A | Nødbrems dokumentert |
| 29 | Kostnadsgjennomgang | **G** | Faktisk mot estimat |
| 30 | **GO/NO-GO for 5 000-bølgen** | **G** | Beslutning tatt |

---

## 26. Invariantene består

Alle 14 fra v1.0 gjelder uendret. To presiseringer:

- **I-6** Ingen bilder før dag 15 — nå håndhevet server-side
- **I-13** «Vi fant hverandre» sletter begge kontoer — PDF leveres først, til begge

**Ny invariant:**

| # | Invariant |
|---|---|
| **I-15** | **Ekte brukerdata skal aldri lagres på MasterSplinter.** Utvikling skjer mot syntetiske data. |

---

## 27. Sluttord

Tosom er teknisk klar for beta og strukturelt klar for vekst. Det som gjenstår er ikke arkitektur, men **infrastruktur og betaling**.

Tre ting er verdt å holde fast ved når volumet kommer:

**Langsomheten er produktet.** Når 8 000 registrerer seg på en uke, vil presset for å matche oftere enn ukentlig bli stort. Ikke gi etter. Ventetiden til lørdag er ikke en mangel — den er grunnen til at folk møter hverandre forberedt.

**«Vi fant hverandre» skal aldri selges til.** De menneskene har fått det de kom for. At vi lar dem gå, med et minne i hånden, er det mest tillitsvekkende Tosom gjør.

**Bølger, ikke sluser.** Kulturen er skjørere enn koden.