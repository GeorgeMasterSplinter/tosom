# ToSom — Development Protocol (v2026)

Denne filen definerer alle regler, retningslinjer og arbeidsmetoder som gjelder for utvikling av ToSom.  
Alle utviklere og AI-agenter må følge denne protokolten.

---

## 1. ARBEIDSMETODE

### Plan → Act → Validate-syklus
All utvikling følger tre-fase syklusen:

1. **PLAN**: Les regler → forstå systemet → lag detaljert plan
2. **ACT**: Utfør kun første steg av planen med patch-format
3. **VALIDATE**: Sjekk alt mot ToSom-regler, design og filosofi

### Hvert steg skal:
- være isolert og fullt fungerende
- ikke bryte eksisterende funksjonalitet
- følge patch-format for alle endringer
- validere mot TOSOM_MASTER_OVERVIEW.md før levering

### Aldri:
- Utføre hele planen på en gang
- Endre backend uten eksplisitt plan
- Ignorere ToSom-regler
- Improvisere uten godkjenning fra George

---

## 2. TOSOM-FILOSOFI (MÅ ALLTID FØLGES)

### Grunnprinsipper
- **Ro** — ingen stress, ingen jag
- **Varme** — trygghet i språk, UI og flows
- **To personer** — fokus på én relasjon
- **Langsomhet** — reisen skal ta tid
- **Guiding** — mild støtte, aldri press
- **Dybde** — meningsfulle samtaler og opplevelser

### ToSom er:
privat · forskningsbasert · moden · rolig · high-tech · premium · uten støy · uten press · uten swipe

### ToSom er IKKE:
en dating-app · en feed · en markedsplass · en konkurranse · en like-økonomi · en social medie-opplevelse

### Forbudte features (ALDRI bygg dette):
- AI-chat, AI-coach, AI-partner
- Feed, swipe, gamification
- Push-notifikasjoner som stresser
- Overflatefokus, "like"-økonomi

---

## 3. SPRÅKMANUAL

### Grunnprinsipper
- **Bokmål** — aldri nynorsk, aldri svorsk. Gjelder overalt: brukerflate, dokumentasjon, kodekommentarer og commit-meldinger.
- **Varmt, modent, trygt, klart**
- **Uten slang, teknisk jargon, "AI-aktig" språk**

### Tone-of-voice per kontekst
| Kontekst | Tone | Eksempel |
|----------|------|----------|
| Onboarding | Varm, nysgjerrig, trygg | “Fortell litt om hvordan du lever livet ditt i dag.” |
| Journey | Ro lig, moden, veiledende | “Hvordan opplevde du samtalen dere hadde i går?” |
| Chat | Varm, trygg, naturlig | “Det høres ut som du har mye på hjertet.” |
| Match | Positiv, klar | “Dere er en god match.” |
| Admin | Nøytral, profesjonell, presis | “Ingen data tilgjengelig for valgt tidsintervall.” |
| System | Kort, tydelig, uten varme | “Noe gikk galt. Prøv igjen.” |

### Setningsstruktur
**Bruk**: korte klare setninger, aktiv form, direkte tiltale ("du"/"dere")  
**Unngå**: lange tunge setninger, passiv form, "vi i ToSom mener…", "systemet har analysert…"

### Forbudte formuleringer (ALDRI bruk):
- “AI anbefaler…”
- “Du må…”
- “Partneren din bør…”
- “Systemet har analysert…”
- “Dette er den riktige måten…”

---

## 4. UI/UX DESIGNSPESIFIKASJON

### Fargepalett
| Token | Verdi |
|-------|-------|
| **Primary Background** | `#0A1A2A` (ToSom Blue) |
| **Secondary Background** | `#0F2233` |
| **Card/Surface** | `rgba(255, 255, 255, 0.04)` |
| **Border** | `rgba(255, 255, 255, 0.08)` |
| **Primary Text** | `#FFFFFF` |
| **Secondary Text** | `rgba(255, 255, 255, 0.70)` |
| **Gold Accent** | `#D4AF37` |
| **Gold Hover** | `#E8C766` |
| **Error** | `#FF4D4D` |
| **Success** | `#4DFF88` |

### Glassmorphism-krav
Alle kort, paneler, modaler og inputs skal bruke:
```css
backdrop-filter: blur(12px);
background: rgba(255, 255, 255, 0.04);
border: 1px solid rgba(255, 255, 255, 0.08);
border-radius: 16px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45);
```

### Typografi
- **Font**: Inter (system fallback)
- **Title XL**: 32px / 600
- **Title L**: 24px / 600
- **Title M**: 20px / 600
- **Body**: 16px / 400
- **Small**: 14px / 400

### Komponent-regler
| Komponent | Radius | Padding | Farge |
|-----------|--------|---------|-------|
| **Buttons** | 12px | 12px 20px | Background: `#D4AF37`, Text: `#0A1A2A` |
| **Inputs** | 16px | 12px 16px | Glassmorphism + gull-focus border |
| **Cards** | 20px | 24px | Glassmorphism |

### Chat UI
- **Bakgrunn**: `#0A1A2A` (ToSom Blue)
- **Mottatte meldinger**: `rgba(255, 255, 255, 0.06)` border + radius: 18px 18px 18px 4px
- **Egne meldinger**: `rgba(212, 175, 55, 0.15)` border + radius: 18px 18px 4px 18px

### Animasjoner
- Myke, langsomme, bevisste
- Aldri flashy eller stressende
- Bruk framer-motion med lange durations (>300ms)

---

## 5. KODEKVALITET & STRUKTUR

### Filnavn
- Beskrivende, presise navn
- kebab-case for filer: `match-card.tsx`
- PascalCase for komponenter: `MatchCard.tsx`

### Import-struktur
```typescript
// 1. Eksterne pakker
import React from 'react';
import { motion } from 'framer-motion';

// 2. Interne moduler
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// 3. Type-definisjoner
import type { Match, Profile } from '@prisma/client';
```

### TypeScript-standard
- Bruk `type` istedenfor `interface` når mulig
- Eksplisitt typing på alle funksjonsparametere
- Ingen `any` — bruk `unknown` ved tvil

### Funksjonsstruktur
```typescript
// Dokumenterte funksjoner med JSDoc-kommentarer
/**
 * Beregn resonans-score mellom to profiler
 * @param profileA - Bruker A sin profil
 * @param profileB - Bruker B sin profil
 * @returns Objektiv score (0-100) og breakdown per kategori
 */
function calculateResonance(
  profileA: Profile,
  profileB: Profile
): ResonanceResult {
  // ... implementasjon
}
```

---

## 6. API-UTVIKLINGSPRINSIPPER

### Response-format-standard
Alle API-ruter skal returnere standardisert JSON:
```typescript
// Suksess
{
  success: true,
  data: { ... },
  message?: string
}

// Feil
{
  success: false,
  error: "Feilmelding",
  code?: string
}
```

### Auth-guards
Alle protected endpoints må sjekke auth først:
```typescript
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Ikke autentifisert" }, { status: 401 });
  }
  // ... resten av logikk
}
```

### Validering
Bruk Zod for alle inngangsdata:
```typescript
import { z } from 'zod';

const matchAcceptSchema = z.object({
  matchId: z.string().min(1),
});

// Validér input
matchAcceptSchema.parse(body);
```

---

## 7. DATABASE-REGLER (Prisma)

### Schema-endringer
1. Alltid oppdater `prisma/schema.prisma`
2. Alltid lag migration: `prisma migrate dev --name beskrivelse`
3. Aldri manuelt endre databasen uten schema-oppdatering
4. Bruk `@default()` for default verdier
5. Bruk `@@unique()`, `@@index()` for indekser

### Migrationer
```bash
# Lag ny migration
prisma migrate dev --name "beskrivelse_av_endring"

# Applere til produksjon
prisma migrate deploy
```

### Query-prinsipper
- Bruk `include` for relasjonshenting (unngå N+1)
- Alltid legg `@@index()` på filterede felt
- Bruk `@unique()` på felt som må være unike
- Aldri gjøre `SELECT *` — spesifiser felt

---

## 8. TESTINGSPRINSIPPER

### E2E-Testing (Playwright)
Kritiske flows må ha E2E-tester:
1. **Login/Register** — Magic link, Vipps, phone verification
2. **Onboarding** — Alle 13 steg
3. **Matching** — Match mottatt, akseptert
4. **Journey** — Dag 1-5 progression
5. **Chat** — Send/motta melding

### Test-struktur
```typescript
test('bruker kan fullføre onboarding', async ({ page }) => {
  // 1. Log inn
  // 2. Gå gjennom alle 13 steg
  // 3. Bekrefte at dashboard vises
});
```

---

## 9. DEPLOYMENT-REGLER

### Vercel Deploy
- Alle pusher til `main` → auto-deploy til produksjon
- Alle pusher til feature-greiner → preview-deploy
- Aldri deploye direkte til main uten review

### Build-prosess
```bash
prisma generate && next build
```

### Miljøvariabler i produksjon
Alltid sett miljøvariabler via Vercel Dashboard — aldri via `.env` filer i repoet.

---

## 10. AI-AGENT REGLER (spesielt for Qwen + Cline)

### Hva AI-agenten ALDRI skal gjøre:
- Bygge AI-chat, AI-coach, AI-partner
- Bygge feed, swipe, gamification
- Generere AI-svar i chat
- Ignoere ToSom-regler eller filosofi
- Endre backend uten eksplisitt plan

### Hva AI-agenten ALLTID skal gjøre:
- Leshe hele system_prompt.md før hver oppgave
- Legge PLAN før ACT
- Bruke patch-format for alle endringer
- Validere mot ToSom-regler
- Stille spørsmål til George ved uklarheter

---

## 11. DOKUMENTASJONSREGLER

### Hvor dokumentasjonen bor
```
/docs/core/          ← Offisiell master-dokumentasjon (alltid oppdatert)
/docs/system/        ← Auto-genererte rapporter
/docs/archive/       ← Historiske/utdaterte dokumenter
```

### Når man skal oppdatere dokumentasjon
- Hver gang en ny subsystem legges til
- Hver gang en eksisterende subsystem endres vesentlig
- Hver gang en kritisk bug fikses

### Dokumentasjons-standard
- Skriv i bokmål
- Bruk klare overskrifter
- Inkluder kodeeksempler der det hjelper
- Hold teksten konsis og presis

---

*Dette dokumentet er livskraftig for prosjektet.*  
*Versjon: 1.0 — Opprettet 2026-08-02*