# FASE 6A — Side: "Kvifor ToSom" (/kvifor)

## Status
- **Fase:** 6A
- **Status:** ✅ FULLFØRT
- **Bygg:** ✅ SUKSESS (4.78 kB, static)

## Oppsummering
Oppretta undersida "Kvifor ToSom" som forklarer kvifå ToSom er annerledes enn vanlege datingplattformer.

## Struktur

### Seksjonar
1. **Hero** — "Kvifor velje ToSom?" med mørk blå gradient-bakgrunn
2. **"ToSom er ikkje ein datingapp"** — 6 punkt (ingen swipe, feed, markedsplass, gamification, åpne profiler, konkurranse)
3. **"Det er kvifor ToSom eksisterer"** — 3 grunnar (datingkultur brotten, overflatefokus øydeleggjer djupde, menneske treng tryggleik)
4. **"Det ToSom leverer"** — 6 punkt (éin match, guidet reise, privat profil, resonans-matching, djupde/modenheit, null stress)
5. **"Kvifor vi valde rolegheit"** — 3 forskningsbaserte punkt (attachment-teori, overflate vs. djupde, kvalitet over kvantitet)
6. **CTA** — "Første steg er ein privat profil" → /onboarding
7. **Footer** — standard Footer-komponent

### Design
- Mørk blå gradient-bakgrunn (#162032 → #0F1923 → #0B1520)
- Glassmorphism-kort med gull-aksentar
- Typography: heading-lg, heading-md, heading-sm, body-lg, body-sm
- Konsistent med ToSom-designsystemet
- Rolig, varm, moden tone

### Teknologi
- Bruk av `typographyToStyle()` frå design-tokens
- Bruk av `color`, `spacing`, `radius`, `shadow` tokens
- GlassCard-hjelp komponent med inline styles frå tokens
- Ambient glød-effektar

### Tone-of-voice
- Rolig
- Varm
- Moden
- Trygg
- Ingen "gamification"-språk
- Ingen "dating-app"-språk

## Testing
- [x] Bygg vellykka
- [x] Ingen typ-feil
- [x] Tekst i ToSom-tone
- [x] Fargepalett følgjer designsystemet
- [x] Typografi følgjer tokens
- [x] Mobilmapper (grid responsiv)

## Avhengingar
- `components/ui5/Footer`
- `config/design-tokens` (color, spacing, typographyToStyle, radius, shadow)

## Neste
- FASE 6B: "Slik fungerer det" (/slik)