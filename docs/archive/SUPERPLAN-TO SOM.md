# TO SOM — SUPERPLAN

**Versjon:** 1.0
**Dato:** 22. juni 2026
**Status:** FASE 1–7 FULLFØRT, FASE 8–12 I ARBEID

---

## MÅL

Bygg en komplett, rolig, trygg og forskningsbasert relasjonsplattform for voksne (23+).
Ingen swipe. Ingen feed. Ingen overflatefokus. Kun én match basert på kompatibilitet.

---

## OVERSYKT OVER FASER

| Fase | Beskrivelse | Status | Størrelse |
|------|------------|--------|----------|
| 1 | Prosjektstruktur | ✅ FULLFØRT | - |
| 2 | Designtokens (color, spacing, radius) | ✅ FULLFØRT | - |
| 3 | Designsystem (typography, glass, motion) | ✅ FULLFØRT | - |
| 4 | Landing page redesign | ✅ FULLFØRT | 4.68 kB |
| 5 | Navbar + Footer | ✅ FULLFØRT | - |
| 6 | Undersider (6 stk) | ✅ FULLFØRT | 15.38 kB |
| 7 | Blogg-seksjon | ✅ FULLFØRT | 3.29 kB |
| 8 | Konto-flyt | 🔴 PLAN | - |
| 9 | Matching-flyt | 🔴 PLAN | - |
| 10 | Tilgangsstyring | 🔴 PLAN | - |
| 11 | UI konsistens | 🟡 NICE TO HAVE | - |
| 12 | Prod-kvalitet | 🟡 NICE TO HAVE | - |

---

## BYGGSTATUS

```
Første Load JS shared by all    102 kB
Totalt side-størrelser: ~45 kB

Landing page:    4.68 kB
/hvorfor:         4.78 kB
/slik:           2.35 kB
/reisen:         2.34 kB
/kontakt:        (inkludert)
/om-oss:         1.32 kB
/personvern:     1.59 kB
/blogg:          1.36 kB
/blogg/[slug]:   1.93 kB
```

---

## DETALJERT OVERSYKT PER FULLFØRT FASE

### FASE 1–5: Designsystem & UI-fundament

#### FASE 1: Prosjektstruktur
- ✅ Next.js 15 med App Router
- ✅ TypeScript strict mode
- ✅ Prisma + PostgreSQL + Redis + ChromaDB
- ✅ Docker + Vercel for deploy
- ✅ Tailwind v4 med moderne tokens
- ✅ Eslint + Husky + commitlint

#### FASE 2: Designtokens
- ✅ `/config/design-tokens.ts` — color, spacing, radius, shadow
- ✅ Fargepalett: mørk blå (#162032 → #0F1923 → #0B1520)
- ✅ Glassmorphism: blur(12px), rgba(255,255,255,0.04)
- ✅ Gull-aksent: #D4AF37, hover: #E8C766
- ✅ Ambient glød: gull og blå

#### FASE 3: Designsystem
- ✅ `/config/typography.ts` — 12 typography-stiler (bindestrek-konvensjon)
- ✅ `/config/motion.ts` — 5 animasjonspreferanser
- ✅ `/components/ui5/Footer.tsx` — 3 kolonner, glassmorphism
- ✅ `/components/ui5/Navbar.tsx` — glassmorphism, mobil-hamburger
- ✅ `/components/ui5/Logo.tsx` — ren tekst, 5 størrelser, 3 fargevarianter

#### FASE 4: Landing page redesign
- ✅ `/app/page.tsx` — komplett redesign
- ✅ 7 seksjonar: Hero, Hva er ToSom, Hvordan, Faser, CTA, Resonans, Footer
- ✅ Mørk blå gradient-bakgrunn
- ✅ Ambient glød-effektar
- ✅ Glassmorphism-kort
- ✅ Typography: heading-xl, heading-lg, heading-md, body-lg
- ✅ CTA-knapp: gull, hover → gold-hover, gull-box-shadow

#### FASE 5: Navbar + Footer
- ✅ Navbar: glassmorphism, LogoSmall, 4 lenker, CTA-knapp
- ✅ Footer: 3 kolonner, 6 temaer, 3 lenker per kolonne, sosial ikon
- ✅ Konsistent med designsystemet

### FASE 6: Undersider (6 stk)

#### 6A: Hvorfor ToSom (/hvorfor)
- ✅ 4.78 kB, statisk
- ✅ Seksjonar: Hero, "ikke ein datingapp", "hvorfor eksisterer", "leverer", "rolegheit", CTA
- ✅ 6 + 3 + 6 + 3 GlassCard-kort
- ✅ Ambient glød (gull)

#### 6B: Slik fungerer det (/slik)
- ✅ 2.35 kB, statisk
- ✅ Seksjonar: Hero, "Fem steg", "Hva gjer annerleis", CTA
- ✅ 5 steg med tall, tittel, beskrivelse, detalj
- ✅ 4 GlassCard-kort

#### 6C: Reisen (/reisen)
- ✅ 2.34 kB, statisk
- ✅ Seksjonar: Hero, "tre fasar", "kvar dag", "etter 30 dager", CTA
- ✅ 3 fase-kort med tema-badgear (gull/blå)
- ✅ 4 daglege element
- ✅ 3 etter-moglegheiter

#### 6D: Kontakt (/kontakt)
- ✅ Inkludert
- ✅ Seksjonar: Hero, kontaktformular, FAQ, CTA
- ✅ Skjema: namn, e-post, melding
- ✅ 3 FAQ-punkt

#### 6E: Om oss (/om-oss)
- ✅ 1.32 kB, statisk
- ✅ Seksjonar: Hero, "verdier", "teamet", CTA
- ✅ 4 verdier (Ro, Verdighet, Forskning, Privatliv)
- ✅ 1 team-medlem

#### 6F: Personvern (/personvern)
- ✅ 1.59 kB, statisk
- ✅ Seksjonar: Hero, "data-behandling", "rettigheter", kontak
- ✅ 6 data-seksjonar
- ✅ 6 rettigheter

### FASE 7: Blogg-seksjon

#### 7A: Blogg-arkiv (/blogg)
- ✅ 1.36 kB, statisk
- ✅ 3 bloggposter med titel, utdritning, dato, lestid
- ✅ GlassCard-kort med hover-effekt
- ✅ Lenke til kvar artikkel

#### 7B: Blogg-artiklar (/blogg/[slug])
- ✅ 1.93 kB, dynamisk
- ✅ 3 artiklar: kompatibilitet, reisetemaer, rolegheit
- ✅ Back-link til /blogg
- ✅ "ikke funnet"-side for ukjende slugar
- ✅ 3 min, 4 min, 5 min lestid

---

## FASE 8: Konto-flyt (PLAN)

### 8A: Oppret konto-side (/onboarding)
- **Mål:** Enkel, rolig konto-opprettning
- **Deloppgaver:**
  1. E-post-innskriving
  2. Magisk innloggingslenke
  3. Telefon-bekreftelse (valgfritt)
  4. Betalings-side (valgfritt)
  5. Tilgang til onboarding
- **Prioritet:** MUST HAVE
- **Avhengigheter:** Ingen (uavhengig)
- **Kan gjøres parallelt:** Ja, med 8B

### 8B: Magisk lenke-system
- **Mål:** E-post-basert, null-passord innlogging
- **Deloppgaver:**
  1. API route for å sende magisk lenke
  2. API route for å bekrefte lenke
  3. JWT-token generering
  4. Session-håndtering
- **Prioritet:** MUST HAVE
- **Avhengigheter:** 8A
- **Kan gjøres parallelt:** Nei, etter 8A

### 8C: Telefon-bekreftelse
- **Mål:** Valgfritt telefonnummer for tryggleik
- **Deloppgaver:**
  1. Telefon-innskriving
  2. SMS-bekreftelse (Twilio eller liknande)
  3. Lagring i database
- **Prioritet:** NICE TO HAVE
- **Avhengigheter:** 8B
- **Kan gjøres parallelt:** Nei, etter 8B

### 8D: Betalings-side
- **Mål:** Enkel betaling for premmium
- **Deloppgaver:**
  1. Betalingsformulær (kort, Vipps, eller liknande)
  2. Stripe-integrasjon
  3. Bekreftelse-side
- **Prioritet:** NICE TO HAVE
- **Avhengigheter:** 8C
- **Kan gjøres parallelt:** Nei, etter 8C

---

## FASE 9: Matching-flyt (PLAN)

### 9A: Matching-API
- **Mål:** Resonans-basert matching
- **Deloppgaver:**
  1. Matching-algoritme (resonans)
  2. API route for å hente match
  3. Daily cron-job for nye matcher
- **Prioritet:** MUST HAVE
- **Avhengigheter:** Ingen (uavhengig)
- **Kan gjøres parallelt:** Ja, med 9B

### 9B: Match-visning-side (/match)
- **Mål:** Vis én match med detaljer
- **Deloppgaver:**
  1. Match-card komponent
  2. Accept/Decline-knapper
  3. Låse-mekanikk (30 dager)
- **Prioritet:** MUST HAVE
- **Avhengigheter:** 9A
- **Kan gjøres parallelt:** Nei, etter 9A

### 9C: Profilskjema (/profile/edit)
- **Mål:** Rediger profil med spacing og konsistens
- **Deloppgaver:**
  1. Profil-felt (livssituasjon, verdier, personlighet)
  2. Validering
  3. Auto-save
- **Prioritet:** MUST HAVE
- **Avhengigheter:** 9B
- **Kan gjøres parallelt:** Nei, etter 9B

---

## FASE 10: Tilgangsstyring (PLAN)

### 10A: Middleware-basert beskyttelse
- **Mål:** Beskyttede ruter
- **Deloppgaver:**
  1. Middleware for å sjekke autentisering
  2. Redirect-logic (ugautentiserte → /login)
  3. Rolle-basert tilgang (admin, user)
- **Prioritet:** MUST HAVE
- **Avhengigheter:** 8B
- **Kan gjøres parallelt:** Ja, med 10B

### 10B: Dashboard-side (/dashboard)
- **Mål:** Bruker-dashboard
- **Deloppgaver:**
  1. Match-status
  2. Reise-status
  3. Hurtigtilgang
- **Prioritet:** MUST HAVE
- **Avhengigheter:** 10A
- **Kan gjøres parallelt:** Nei, etter 10A

### 10C: Chat-side (/chat)
- **Mål:** Guidede samtaler
- **Deloppgaver:**
  1. Chat-vindue komponent
  2. Guidede tema
  3. Resonansmåling
- **Prioritet:** MUST HAVE
- **Avhengigheter:** 10B
- **Kan gjøres parallelt:** Nei, etter 10B

---

## FASE 11: UI-konsistens (NICE TO HAVE)

### 11A: Komplette tokens
- **Mål:** Alle UI-komponenter bruker tokens
- **Deloppgaver:**
  1. Gjennomgå alle sider for inline-styles
  2. Bytt til tokens (color, spacing, typography)
  3. Konsistent radius på alle komponenter
- **Prioritet:** NICE TO HAVE
- **Avhengigheter:** Ingen
- **Kan gjøres parallelt:** Ja, med 11B

### 11B: Animasjonskonsistens
- **Mål:** Samme animasjonsstil på heile sida
- **Deloppgaver:**
  1. Definer 3-4 standard-animasjonar
  2. Bruk motion.ts preferanser
  3. Sjekk alle overganger
- **Prioritet:** NICE TO HAVE
- **Avhengigheter:** 11A
- **Kan gjøres parallelt:** Nei, etter 11A

---

## FASE 12: Prod-kvalitet (NICE TO HAVE)

### 12A: Testing
- **Mål:** Automatisk testing
- **Deloppgaver:**
  1. Unit-tests for utils/hooks
  2. Integration-tests for API
  3. E2E-tests for kritiske flows
- **Prioritet:** MUST HAVE
- **Avhengigheter:** 10B
- **Kan gjøres parallelt:** Ja, med 12B

### 12B: Performance
- **Mål:** Rask lasting (< 2s)
- **Deloppgaver:**
  1. Bildoptimalisering (next/image)
  2. Code-splitting
  3. Bundle-analyse
- **Prioritet:** MUST HAVE
- **Avhengigheter:** 12A
- **Kan gjøres parallelt:** Nei, etter 12A

### 12C: SEO
- **Mål:** God søkemotor-optimalisering
- **Deloppgaver:**
  1. Meta-tags på alle sider
  2. Sitemap
  3. robots.txt
  4. Open Graph
- **Prioritet:** MUST HAVE
- **Avhengigheter:** Ingen
- **Kan gjøres parallelt:** Ja, med 12A

### 12D: Analytics
- **Mål:** Spor bruker-atferd
- **Deloppgaver:**
  1. Google Analytics eller Plausible
  2. Hendingar for CTA-klikk
  3. Dashboard med statistikk
- **Prioritet:** NICE TO HAVE
- **Avhengigheter:** 12C
- **Kan gjøres parallelt:** Nei, etter 12C

---

## AVHENGERIGHETSMATRISE

```
FASE 1-5 (Designsystem)
    ↓
FASE 6 (Undersider) ← kan parallelliserast internt
    ↓
FASE 7 (Blogg) ← kan parallelliserast med 6
    ↓
FASE 8-10 (Konto, Matching, Tilgang) ← KRI TISK VEI
    ↓
FASE 11 (UI-konsistens) ← kan gjerast parallelt
    ↓
FASE 12 (Prod-kvalitet)
```

### Kan gjørast parallelt:
- FASE 6 internt: 6A + 6B + 6C + 6D + 6E + 6F
- FASE 7: Kan gjerast parallelt med 6
- FASE 11A + 11B: Kan gjerast parallelt med 10
- FASE 12A + 12C: Kan gjerast parallelt

### Kriisk vei:
```
8A → 8B → 9A → 9B → 10A → 10B
```

---

## PRIORITERING

### MUST HAVE (må gjøras først)
- FASE 1–7: ✅ FULLFØRT
- FASE 8A: Oppret konto-side
- FASE 8B: Magisk lenke-system
- FASE 9A: Matching-API
- FASE 9B: Match-visning
- FASE 9C: Profilskjema
- FASE 10A: Middleware-beskyttelse
- FASE 10B: Dashboard
- FASE 10C: Chat-side
- FASE 12A: Testing
- FASE 12B: Performance
- FASE 12C: SEO

### NICE TO HAVE (kan gjerast senere)
- FASE 8C: Telefon-bekreftelse
- FASE 8D: Betalings-side
- FASE 11: UI-konsistens
- FASE 12D: Analytics

---

## NESTE STEG

1. **FASE 8A: Oppret konto-side** (/onboarding)
2. **FASE 8B: Magisk lenke-system**
3. **FASE 9A: Matching-API**
4. **FASE 9B: Match-visning**
5. **FASE 10A: Middleware-beskyttelse**
6. **FASE 10B: Dashboard**
7. **FASE 10C: Chat-side**
8. **FASE 11: UI-konsistens**
9. **FASE 12: Prod-kvalitet**

---

## OPPSUMMERING AV FULLFØRT ARBEID

### Designsystem:
- ✅ Komplett design-tokens (color, spacing, radius, shadow)
- ✅ Typografi-system (12 stiler, bindestrek-konvensjon)
- ✅ Glassmorphism-standard
- ✅ Ambient glød-effektar
- ✅ Footer-komponent (3 kolonner)
- ✅ Navbar-komponent (glassmorphism, mobil)
- ✅ Logo-komponent (5 størrelser, 3 fargar)

### Landing page:
- ✅ Komplett redesign (4.68 kB)
- ✅ 7 seksjonar med rolig, varm tone
- ✅ Mørk blå gradient-bakgrunn
- ✅ Ambient glød-effektar

### Undersider (6 stk):
- ✅ Hvorfor ToSom (4.78 kB)
- ✅ Slik fungerer det (2.35 kB)
- ✅ Reisen (2.34 kB)
- ✅ Kontakt (inkludert)
- ✅ Om oss (1.32 kB)
- ✅ Personvern (1.59 kB)

### Blogg (3 artiklar):
- ✅ Blogg-arkiv (1.36 kB)
- ✅ 3 artiklar (1.93 kB per artikkel)

### TOTALT:
- **9 sider fullførte**
- **Bygg: alle vellykka**
- **Totalt: ~60 kB for heile sida-set**