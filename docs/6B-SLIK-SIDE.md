# FASE 6B — Side: "Slik fungerer det" (/slik)

## Status
- **Fase:** 6B
- **Status:** ✅ FULLFØRT
- **Bygg:** ✅ SUKSESS (4.78 kB, static)

## Oppsummering
Oppretta undersida "Slik fungerer det" som forklarer den steg-vise prosessen på ToSom.

## Struktur

### Seksjonar
1. **Hero** — "Slik fungerer det" med mørk blå gradient-bakgrunn
2. **"Fem steg til connexion"** — 5 steg med tall, tittel, beskrivelse og detalj
3. **"Kva gjer ToSom annerleis?"** — 4 punkter (éin match, ingen bilder fyrst, guidet reise, ingen swipe)
4. **CTA** — "Klar til å starte?" → /onboarding
5. **Footer** — standard Footer-komponent

### Steg
1. Opprett din private profil
2. Få éin match basert på kunnskap
3. Dere aksepterer og låser saman
4. Gjennom ei guidet 30-dagers reise
5. Etter 30 dagar velji dere vidare

### Design
- Mørk blå gradient-bakgrunn (#162032 → #0F1923 → #0B1520)
- Glassmorphism-kort med gull-aksentar
- Steg-nummer med gull-runda kvadrat
- Typography: heading-lg, heading-md, heading-sm, body-lg, body-sm
- Konsistent med ToSom-designsystemet
- Rolig, varm, moden tone

### Teknologi
- Bruk av `typographyToStyle()` frå design-tokens
- Bruk av `color`, `spacing`, `radius`, `shadow` tokens
- GlassCard-hjelp komponent med inline styles frå tokens
- Ambient glød-effektar (blå)

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
- FASE 6C: "Reisen" (/reisen)