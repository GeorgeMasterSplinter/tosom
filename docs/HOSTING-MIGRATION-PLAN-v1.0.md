# TOSOM — HOSTING MIGRATION PLAN v1.0

**Dato:** 2026-08-19
**Commit:** `e7fe325`
**Grunnlag:** `TOSOM-MASTERPLAN-v9.0.md` Del III · `MASTERSPLINTER-HERDING-v1.0.md`

> **Bærende prinsipp:** Ekte brukerdata skal aldri lagres på MasterSplinter. Utvikling skjer mot syntetiske data. (Invariant **I-15**)

**Merking:** **[GEORGE]** = kun du · **[AGENT]** = jeg · **[G+A]** = sammen

---

## 1. Hvorfor flytte

Tosom lagrer noe av det mest sensitive som finnes i en database: tilknytningsmønstre, grenser, sårbarhet, intimitetsønsker. GDPR klassifiserer dette som **særlige kategorier personopplysninger** (art. 9).

Ved selvhosting hjemme er du personlig og alene: brannmur, backup-ansvarlig, DDoS-vern, oppetidsgaranti, sertifikathåndterer og databehandler — uten vaktordning. Ved et brudd har du **72 timers varslingsplikt** til Datatilsynet.

Managed leverandører løser kryptering i ro, backup med PITR, failover og fysisk sikkerhet som en del av tjenesten. Det er ikke en luksus; det er forutsetningen for å be 5 000 mennesker om å stole på oss.

---

## 2. Arkitektur

Alt i EU/EØS. Ingen overføring til tredjeland.

| Komponent | Leverandør | Region | Begrunnelse |
|---|---|---|---|
| App (Next.js) | **Vercel Pro** | Frankfurt (`fra1`) | `vercel.json` er allerede skrevet for dette. Null drift. |
| **Database** | **Neon** (anbefalt) eller Supabase | Frankfurt | Innebygd pooler — løser spike-problemet. PITR. Kryptert i ro. |
| Bilder | **Cloudflare R2** eller Supabase Storage | EU | Erstatter `writeFile`. Signerte URL-er. |
| E-post | **Postmark** eller **Resend** | EU | Kun ~50 beta-lenker + systemvarsler |
| Sanntid | **Pusher** | **EU-cluster** | Allerede i bruk — verifiser at cluster er `eu` |
| Feilsporing | **Sentry** | EU | Med PII-skrubbing (S-16) |
| Cron | Vercel Cron | — | Definert i `vercel.json` |

### Hvorfor Neon framfor Supabase
Neons **innebygde connection pooler** løser direkte det som ellers velter plattformen ved en registreringsspike: uten pooler åpner hver serverless-instans egne tilkoblinger og treffer `max_connections`.

Supabase er et godt alternativ hvis du vil ha lagring og database fra samme leverandør — færre DPA-er å håndtere.

### Kostnad

| Nivå | Estimat/md |
|---|---|
| Beta (50 brukere) | ~350–600 kr |
| 5 000 brukere | **~700–1 400 kr** |
| 20 000 brukere | ~2 500–4 000 kr |

Ved 349 kr per reise er 5 000-nivået dekket av **3–4 salg i måneden**.

---

## 3. Det som må bygges før migrering

### 3.1 🔴 Bildelagring — blokker

**Nåtilstand:** `app/api/chat/image/route.ts:6,149`
```ts
import { writeFile, mkdir } from 'fs/promises';
await writeFile(filePath, buffer);
```

Ingen lagringsbibliotek i `package.json`. På Vercel er filsystemet **efemert** — et bilde delt på dag 16 forsvinner ved neste deploy.

**Krav** **[AGENT]**:

1. Objektlagring i EU, kryptert i ro
2. **Signerte URL-er** med kort levetid (f.eks. 15 min) — aldri offentlige lenker. Et bilde delt i fortrolighet skal ikke ligge på en gjettbar URL.
3. Behold bildelåsen: opplasting avvises før dag 15 (M-6)
4. **Filsletting ved reiseslutt** — ikke bare DB-rader
5. Test som verifiserer at filen faktisk er borte fra lagringen

Punkt 4 er både løftet til brukeren («alt slettes når reisen er ferdig») og GDPR art. 17.

### 3.2 🟠 Delt rate limiting

Fire in-memory implementasjoner i dag (`lib/rate-limit.ts`, `lib/rateLimit.ts`, `lib/api/rateLimit.ts`, `lib/security/phoneRateLimit.ts`). Prosesslokal `Map` nullstilles ved kaldstart og deles ikke mellom instanser.

**Tiltak:** Én Postgres-basert implementasjon. Krever ingen ny infrastruktur.

### 3.3 🟠 Sentry PII-skrubbing

Sentry må aldri motta profilinnhold, meldinger eller e-post. En stack trace med `DeepProfile` i konteksten er en lekkasje av det mest sensitive vi har.

**Tiltak:** `beforeSend` som fjerner `profile`, `deepProfile`, `message`, `content`, `email`, `phone`. `sendDefaultPii: false`. Verifiser med en bevisst framkalt feil.

### 3.4 🟡 Skaleringstiltakene S1–S4

Se `TOSOM-MASTERPLAN-v9.0.md` §5. S1 (batching) og S3 (fortsettelses-cron) bør være på plass før ekte volum, siden nettverkslatens til managed Postgres er høyere enn til lokal Docker.

---

## 4. Migreringsrekkefølge

### Fase 0 — Forberedelse **[GEORGE]**

| # | Oppgave | Akseptanse |
|---|---|---|
| 1 | Opprett Vercel Pro, region `fra1` | Prosjekt opprettet |
| 2 | Opprett Neon, region Frankfurt | Tilkoblingsstreng mottatt |
| 3 | Opprett R2-bøtte, EU | Nøkler mottatt |
| 4 | Opprett e-postkonto (Postmark/Resend) | Domene verifisert |
| 5 | **Signer DPA hos alle** | Avtaler arkivert |
| 6 | Legg alle hemmeligheter i passordhåndterer | Ingen i repo |
| 7 | Domene + DNS klar | Peker mot Vercel |

**Merk:** hemmelighetene legges direkte i Vercels miljøvariabler. De skal ikke sendes til meg og ikke lagres i lokal `.env`.

### Fase 1 — Bygg om lagring **[AGENT]**

| # | Oppgave | Akseptanse |
|---|---|---|
| 8 | Bildeopplasting til R2 med signerte URL-er | Bilde overlever en deploy |
| 9 | Filsletting ved reiseslutt | Test bekrefter filen borte |
| 10 | Delt rate limiting (Postgres) | Virker over flere instanser |
| 11 | Sentry PII-skrubbing | Ingen profildata i testfeil |
| 12 | S1 + S3 (batching + fortsettelses-cron) | 3 000 i kø fullføres |

Verifiser etter hvert steg: `npx tsc --noEmit` og `npx jest --ci`.

### Fase 2 — Database **[G+A]**

| # | Oppgave | Akseptanse |
|---|---|---|
| 13 | Kjør migrasjoner mot Neon | 17 migrasjoner anvendt |
| 14 | Seed journey-innhold og spørsmålskategorier | Innhold på plass |
| 15 | Sett `DATABASE_URL` i Vercel | App kobler til |
| 16 | Verifiser pooler-tilkobling | Pooled endpoint i bruk |

**Ingen datamigrering nødvendig.** Det finnes ingen ekte brukere ennå — dette er en ren nyoppsetting. Det er en fordel: vi starter rent, uten arvet gjeld.

### Fase 3 — Deploy og verifiser **[G+A]**

| # | Oppgave | Akseptanse |
|---|---|---|
| 17 | Deploy til Vercel | Build grønn |
| 18 | Verifiser cron er registrert | Begge jobber synlige |
| 19 | Sett kill switches | `MATCHING_ENABLED=true`, `PAYMENTS_ENABLED=false` |
| 20 | **Gjenopprett backup til tom base** | Verifisert gjenoppretting |
| 21 | Full loop-test med to testkontoer | Onboarding → PDF → sletting |
| 22 | Verifiser at bilder overlever deploy | Bilde intakt etter ny deploy |

Steg 20 er ikke valgfritt. En backup som aldri er gjenopprettet, finnes ikke.

### Fase 4 — Beta

Se `TOSOM-MASTERPLAN-v9.0.md` Del XII, uke 4.

---

## 5. Hemmelighetshåndtering

| Regel |
|---|
| Alle produksjonshemmeligheter kun i Vercels miljøvariabler |
| Kopi i passordhåndterer — aldri i fil på disk |
| **Aldri i repo.** `.gitignore:56` dekker `.env*` — bekreftet |
| Aldri i chat, aldri til meg |
| Egne nøkler for utvikling og produksjon |
| Roter nøkler ved mistanke om lekkasje |

### Miljøvariabler som må settes

```
DATABASE_URL              # Neon, pooled
AUTH_SECRET               # generert, 32+ tegn
NEXTAUTH_URL              # https://tosom.no
R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET
EMAIL_SERVER_HOST / PORT / USER / PASSWORD / EMAIL_FROM
PUSHER_APP_ID / KEY / SECRET / CLUSTER=eu
SENTRY_DSN
CRON_SECRET               # generert
MATCHING_ENABLED=true
REGISTRATION_ENABLED=true
MAINTENANCE_MODE=false
PAYMENTS_ENABLED=false    # kaster hvis true — se VIPPS-planen
VIPPS_ENABLED=false       # til avtalen er godkjent
MATCHING_QUEUE_LIMIT=5000
```

---

## 6. DPA-sjekkliste **[GEORGE]**

GDPR art. 28 krever skriftlig databehandleravtale med hver leverandør som behandler personopplysninger på dine vegne.

| Leverandør | DPA | Region bekreftet | Underleverandører gjennomgått |
|---|---|---|---|
| Vercel | ☐ | ☐ | ☐ |
| Neon / Supabase | ☐ | ☐ | ☐ |
| Cloudflare R2 | ☐ | ☐ | ☐ |
| Postmark / Resend | ☐ | ☐ | ☐ |
| Pusher | ☐ | ☐ | ☐ |
| Sentry | ☐ | ☐ | ☐ |
| Vipps | ☐ | ☐ | ☐ |

Alle tilbyr standard DPA-er som kan aksepteres digitalt.

### Øvrig dokumentasjon som kreves

| Dokument | Status |
|---|---|
| Behandlingsprotokoll (art. 30) | ☐ Må lages |
| Personvernerklæring | ✅ `app/personvern` finnes — må oppdateres med leverandører |
| Rutine ved brudd (72 t) | ☐ Må lages |
| **DPIA** — personvernkonsekvensvurdering | ☐ **Sannsynligvis påkrevd** (art. 35, særlige kategorier) |

DPIA-en er verdt å ta på alvor. Ved særlige kategorier personopplysninger i stor skala er den normalt obligatorisk, og den er også en god øvelse: den tvinger fram en gjennomgang av hva vi faktisk lagrer og hvorfor.

**Vurder personvernrådgiver** for DPIA og behandlingsprotokoll.

---

## 7. Rullback

| Situasjon | Handling |
|---|---|
| Deploy feiler | Vercel: rull tilbake til forrige deploy, ett klikk |
| Database korrupt | Neon PITR til tidspunkt før feilen |
| Bildelagring nede | Opplasting deaktiveres midlertidig; chat fungerer |
| Alt galt | `MAINTENANCE_MODE=true` |

Ved beta finnes ingen ekte data å miste, så risikoen er lav i denne fasen. Det er argumentet for å migrere **nå**, før brukerne kommer.

---

## 8. Klar-kriterier

Ingen invitasjoner sendes før alle er grønne:

- [ ] `next build` grønn på Vercel
- [ ] Database på Neon med 17 migrasjoner
- [ ] Pooler-tilkobling verifisert
- [ ] Bilder til R2, overlever deploy
- [ ] Filsletting verifisert med test
- [ ] Sentry uten PII, verifisert
- [ ] Backup gjenopprettet til tom base
- [ ] Cron registrert, `CRON_SECRET` satt
- [ ] Kill switches virker
- [ ] Full loop-test bestått
- [ ] **DPA signert hos alle**
- [ ] Personvernerklæring oppdatert
- [ ] Ingen hemmeligheter i repo
- [ ] MasterSplinter fri for ekte brukerdata

---

## 9. Etterpå: rollefordeling

| Miljø | Hvor | Data |
|---|---|---|
| **Produksjon** | Vercel + Neon + R2, EU | Ekte brukerdata. Kun via leverandørpanel. |
| **Utvikling** | MasterSplinter | **Kun syntetiske data** |
| **AI/Qwen** | MasterSplinter | Ingen brukerdata |
| **Test (CI)** | Docker, loopback | Syntetiske data |

**Den regelen som brytes lettest:** «jeg laster ned en produksjonsdump for å debugge». Ikke gjør det. Bruk logger og aggregerte tall. Det er nettopp derfor M-9-observability ble bygget.

---

## 10. Sluttord

Migreringen er enklere nå enn den noen gang blir igjen, fordi det ikke finnes ekte data å flytte. Vi setter opp rent, verifiserer, og inviterer først deretter.

Det viktigste dette gir deg, er ikke oppetid eller ytelse. Det er at du kan sove om natten mens 5 000 menneskers reiser ligger trygt et sted som har backup, kryptering og noen som har vakt.