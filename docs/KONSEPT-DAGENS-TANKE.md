# Dagens tanke

> Én tanke. Én dag. Én stille rom mellom deg og to andre.

## Filosofi

ToSom handler om ro, nærvær og én ting om gangen. "Dagens tanke" er en forlengelse av den samme holdningen:

- **Skårhet = premium.** Én per dag. Ikke mer. Du må velge ordene dine.
- **Anonymt som default.** Du deler en tanke, ikke en identitet.
- **Nærhet, ikke mengde.** Du ser 2–3 andre svar. Ikke en feed med 200.
- **Ingen engagement-game.** Ingen likes, ingen follows, ingen "vis mer". Du deler, du leser, du går videre.
- **Koblet til resonansen.** Hver dag roterer spørsmålet gjennom de seks dimensjonene.

## Hva det IKKE er

| ❌ Ikke dette | ✅ Dette i stedet |
|---|---|
| Blogg (artikler, forfattere) | Korte refleksjoner, 1–3 setninger |
| Forum (tråder, replies) | Én tanke per person per dag |
| Chat (sanntid, konversasjon) | Asynkron, ingen dialog |
| Feed (uendelig scroll) | Max 3 andre svar synlig |
| Social media (likes, shares) | Ingen reaksjoner, ingen tellere |
| Community (rom, tags, follows) | Én side, én dag, én tanke |

## Brukeropplevelse

### Wireframe (tekst)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ☀️  Dagens tanke                                   │
│  Torsdag 22. august                                  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │  "Hva er noe du verdssetter ved en         │   │
│  │   person — som ingen andre ser?"            │   │
│  │                                             │   │
│  │  ── Verdi-dagen ──                          │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │  Skriv din tanke...                         │   │
│  │  (Maks 300 tegn)                            │   │
│  │                                             │   │
│  │  🔒 Anonymt          [Send min tanke]      │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ─── 2 andre har delt i dag ────────────────────    │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  "At de er stille i rommet. At de ikke      │   │
│  │   trenger å fylle hvert sekund med ord."    │   │
│  │                                             │   │
│  │  — En i rommet                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  "At de husker små ting. Kaffen jeg         │   │
│  │   nektet å ta, og likevel sto opp og        │   │
│  │   laget den."                               │   │
│  │                                             │   │
│  │  — En i rommet                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  Du deler én tanke per dag.                        │
│  I morgen er det et nytt spørsmål.                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Tilstander

| Tilstand | Visning |
|---|---|
| Har ikke delt i dag | Composer synlig + 0–3 andre svar |
| Har delt i dag | Composer erstattet av "Du har delt din tanke i dag." + egne svar + 2 andre |
| 0 andre har delt | Composer synlig + "Du er den første i dag." |
| Alle 3 plasser tatt | Composer synlig (du kan fortsatt dele), men feed viser maks 3 |
| Anonym (default) | Navn: "En i rommet" |
| Ikke-anonym (toggle) | Navn: brukerens `name` fra profil |

### Interaksjon

- **Ingen knapper** utom "Send" og "Vis mitt navn"
- **Ingen** "les mer", "vis alle", "se tråd"
- **Ingen** reaksjoner, ingen replies
- **Ingen** deling (ingen "del på Facebook" eller lign.)
- **Én handling:** Skriv → Send → Ferdig. Gå videre.

## Datamodell (Prisma)

```prisma
model DailyPrompt {
  id          String   @id @default(cuid())
  date        DateTime @unique        // Start of day (UTC)
  question    String              // "Hva er noe du verdssetter..."
  dimension   ResonanceDimension  // Hvilken dimensjon i dag
  createdAt   DateTime @default(now())

  answers     DailyAnswer[]

  @@index([date])
}

model DailyAnswer {
  id          String   @id @default(cuid())
  promptId    String
  prompt      DailyPrompt @relation(fields: [promptId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  body        String            // Max 300 tegn
  isAnonymous Boolean  @default(true)
  displayName String?           // Kachet: "En i rommet" eller brukerens navn
  status      AnswerStatus @default(PUBLISHED)  // PUBLISHED | HIDDEN | DELETED
  createdAt   DateTime @default(now())

  @@unique([promptId, userId])  // Én svar per person per dag
  @@index([promptId, status])
}

enum AnswerStatus {
  PUBLISHED
  HIDDEN        // Moderert bort
  DELETED       // Slettet av forfatter
}
```

**Legg til i User-model:**
```prisma
dailyAnswers  DailyAnswer[]
```

**Rebruker eksisterende** `ResonanceDimension` enum fra matching:
```
VALUES | ATTACHMENT | PERSONALITY | COMMUNICATION | EMOTIONAL_REGULATION | LIFE_SITUATION
```

## Spørsmålsrotasjon

6 dimensjoner × 2 spørsmål = **12 dager per syklus**, deretter repeteres.

| Dag | Dimensjon | Spørsmål A | Spørsmål B |
|-----|-----------|-----------|-----------|
| 1 | Verdier | Hva er noe du verdssetter ved en person — som ingen andre ser? | Hva er noe du aldri kompromisser på i en relasjon? |
| 2 | Tilknytning | Hva betyr trygghet for deg — i et forhold? | Er du nær, eller trenger du luft? Hva gjør at du velger det ene eller det andre? |
| 3 | Personlighet | Hva er din måte å være i et rom med noen du liker? | Hva er noe du gjør som andre synes er rart, men som du trenger? |
| 4 | Kommunikasjon | Hva er det vanskeligste å si til noen du er nær? | Hvordan vet du at noen egentlig lytter? |
| 5 | Emosjonsregulering | Hva er noe som roer deg — som ikke handler om telefon? | Hvordan reagerer du når det blir tungt? Og hva hjelper? |
| 6 | Livssituasjon | Hva er noe du ser frem til — denne uken? | Hva er en dag som er full for deg? |
| 7–12 | (repeteres med A/B byttet) | ... | ... |

**Rotasjonslogikk (cron, daglig 00:00 UTC):**
```typescript
const dayIndex = Math.floor(Date.now() / 86400000) % 12;
const prompt = PROMPTS[dayIndex]; // { question, dimension }
// Opprett DailyPrompt for i dag hvis den ikke finnes
```

## API

Én API-route, to metoder:

### `GET /api/community/thought`

Henter dagens spørsmål + 2–3 tilfeldige andre svar (ikke brukeren selv).

**Response:**
```json
{
  "date": "2026-08-22",
  "question": "Hva er noe du verdssetter ved en person — som ingen andre ser?",
  "dimension": "VALUES",
  "hasAnswered": false,
  "myAnswer": null,
  "otherAnswers": [
    {
      "id": "abc123",
      "body": "At de er stille i rommet...",
      "displayName": "En i rommet",
      "createdAt": "2026-08-22T09:14:00Z"
    }
  ]
}
```

### `POST /api/community/thought`

Sender dagens tanke.

**Body:**
```json
{
  "body": "At de ikke trenger å fylle hvert sekund med ord.",
  "isAnonymous": true
}
```

**Validasjon:**
- Min 10 tegn, maks 300 tegn
- `@@unique([promptId, userId])` — returnerer 409 hvis allerede svart i dag
- Regex-filter: ingen epost, telefon, URL
- Rate-limit: 1 per dag per bruker (database-constraint)

**Response (201):**
```json
{
  "id": "def456",
  "status": "PUBLISHED",
  "message": "Tanken din er delt. I morgen er det nytt spørsmål."
}
```

### `DELETE /api/community/thought`

Sletter egnet svar for i dag (gjør `status = DELETED`). Ingen undo.

## Moderering (forenklet)

Etterhvert som dette er **maks ~200 svar/dag** (beta-størrelse), kan vi starte uten manuell moderering:

1. **Regex-filter ved POST:**
   - Ingen epost (`/@/`)
   - Ingen telefon (`/\d{8}/`)
   - Ingen URL (`/https?:\/\//`)
   - Ingen @mention (`/@\w+/`)

2. **Auto-HIDDEN trigger:**
   - Regex-match → `status = HIDDEN` (brukeren får "Tanken din er delt." allikevel — ingen feilmelding)
   - Manuell: Admin kan se HIDDEN posts i `/admin` og evt. fjerne

3. **Manuell (fase 2):**
   - `/admin/community/thoughts` — liste over dagens HIDDEN posts
   - Én-knapp: "Gjør synlig" / "Fjern"

## UI

### Filer

```
app/community/page.tsx              → Siden (server component wrapper)
app/community/ThoughtClient.tsx     → Client component (polling + composer)
components/community/
├── DailyPromptCard.tsx             → Spørsmålskort (GlassCard, gold border)
├── ThoughtComposer.tsx             → Textarea + anonym toggle + Send
├── ThoughtAnswer.tsx               → Én respons (body + displayName)
└── DimensionBadge.tsx              → Farget badge: "Verdi-dagen"
```

### Design

- **Bakgrunn:** Same som resten av ToSom (`#0B1520` gradient)
- **Spørsmålskort:** GlassCard med `gold` prop, `glow` — sentrert, max-w-3xl
- **Composer:** GlassCard, textarea med 3-linje height, placeholder "Skriv din tanke..."
- **Anonym toggle:** Liten switch under textarea: "🔒 Anonymt" (default ON)
- **Svar:** GlassCard uten gold, `padding="md"`, max-w-3xl. Body i `body-lg`, `displayName` i `body-sm` + `text.muted`
- **Dimensjon badge:** Liten pill over spørsmålet. Farge per dimensjon (se under)
- **Footer-tekst:** "Du deler én tanke per dag. I morgen er det nytt spørsmål." i `text.muted`, sentrert
- **Ingen** scroll. Én viewport. Alt ror.

### Dimensjon-farger (utvid `config/design-tokens.ts`):

```typescript
export const resonanceColors: Record<string, string> = {
  VALUES:               '#D4AF37',
  ATTACHMENT:           '#6A9BC7',
  PERSONALITY:          '#9B7BC7',
  COMMUNICATION:        '#6AC7A7',
  EMOTIONAL_REGULATION: '#C77B9B',
  LIFE_SITUATION:       '#C7B06A',
};
```

### Polling

- Hver 30 sek: `GET /api/community/thought`
- Hensikt: Nye svar dukker opp i feed (maks 3)
- Ingen push, ingen "live" indikator
- Ved send: Refetch med en gang (optimistisk update)

## Anonymitet

- **Default:** Anonym. `displayName = "En i rommet"`
- **Toggle:** "Vis mitt navn" — bruker kan velge å være synlig
- **DB:** `userId` er alltid satt (for rate-limit, admin, sletting)
- **API:** `displayName` returneres, aldri `userId` til andre brukere
- **Admin:** Kan se `userId` i modererings-view
- **Ingen** profil-lenke, ingen avatar, ingen "se profil"

## Feature-flag

```typescript
// config/features.ts
COMMUNITY_THOUGHT_ENABLED: process.env.NEXT_PUBLIC_COMMUNITY_THOUGHT_ENABLED === 'true',
```

Når disabled: `/community` returnerer "Dette rommet åpnes snart." + CTA.

## Navigasjon

- **Link:** I TopNav som "Tanken" (ikon: ☀️ eller en enkel sol/lys-ikon)
- **Alternativt:** Som et kort på dashboard: "Dagens tanke — Se dagens spørsmål →"
- **Ikke** i footer (for å holde den synlig uten å være dominant)

## Faseplan

### Dag 1: Backend (4-5 timer)
- [ ] Prisma migration: `DailyPrompt`, `DailyAnswer`
- [ ] Seed: 12 spørsmål (2 per dimensjon)
- [ ] Cron-route: `POST /api/cron/daily-prompt` (kjører 00:05 UTC)
- [ ] API: `GET /api/community/thought`
- [ ] API: `POST /api/community/thought`
- [ ] API: `DELETE /api/community/thought`
- [ ] Regex-filter i POST-handler
- [ ] Jest-test: POST validasjon, rate-limit (unique), regex

### Dag 2: Frontend (3-4 timer)
- [ ] `config/design-tokens.ts`: Legg til `resonanceColors`
- [ ] `app/community/page.tsx` (server component, auth-check)
- [ ] `ThoughtClient.tsx` (polling, state)
- [ ] `DailyPromptCard.tsx`
- [ ] `ThoughtComposer.tsx`
- [ ] `ThoughtAnswer.tsx`
- [ ] `DimensionBadge.tsx`
- [ ] Feature-flag i `config/features.ts`
- [ ] TopNav: Legg til "Tanken" link
- [ ] Test i browser: mobile (360px) + desktop

### Dag 3: Polish + Deploy (2-3 timer)
- [ ] Animasjoner: framer-motion fade-in for nye svar
- [ ] Empty state: "Du er den første i dag."
- [ ] Has-answered state: "Du har delt din tanke i dag."
- [ ] Error states (network, 409 already answered)
- [ ] `prisma migrate deploy`
- [ ] `npm run build`
- [ ] Commit + push → Vercel auto-deploy
- [ ] Verifiser i prod: POST, GET, DELETE, anonymitet

**Total: ~2-3 dager fulltid.**

## Skalering

| Størrelse | Strategi |
|---|---|
| < 500 brukere (beta) | Alt i Next.js. Polling 30 sek. PostgreSQL. Ingen cache nødvendig. |
| < 5 000 | Redis-cache for GET (TTL 60 sek). `otherAnswers` random-select i DB. |
| < 50 000 | Read-replica for GET. Cron på separat worker. |
| > 50 000 | Urellevant for dette konseptet (én per dag, max 3 synlige) |

**Poengen:** Med maks 3 svar synlig og 1 per bruker per dag, er dette **nesten statisk**. Load er trivialt uansett skala.

## Åpne spørsmål

- [ ] Skal dette være et eget top-level URL (`/community`) eller en sub-page under dashboard?
- [ ] Skal det være synlig for **alle** brukere, eller kun dem som er i en aktiv reise?
- [ ] Skal vi ha en "historikk" (se gårsdagens spørsmål)? Forvaltning: Nei til MVP. Kanskje fase 2.
- [ ] Skal spørsmålene skrives av oss, eller kan vi la AI generere dem (med manuell review)?
- [ ] Skal det være et admin-panel for å se alle svarene, eller er regex + HIDDEN nok til MVP?