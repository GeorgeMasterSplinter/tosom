# FASE 6C — Side: "Reisen" (/reisen)

## Status
- **Fase:** 6C
- **Status:** ✅ FULLFØRT
- **Bygg:** ✅ SUKSESS (4.77 kB, static)

## Oppsummering
Oppretta undersida "Reisen" som forklarer den guiderte 30-dagers reisa mellom to匹配的 par.

## Struktur

### Seksjonar
1. **Hero** — "30 dagar som endrar alt" med mørk blå gradient-bakgrunn
2. **"Reisa består av tre fasar"** — 3 fasar (dag 1–14, dag 15–21, dag 22–30) med tema-badgear
3. **"Kva skjer kvar dag?"** — 4 element (refleksjonsspørsmål, samtaletema, små oppgåver, resonansmåling)
4. **"Kva skjer etter 30 dagar?"** — 3 val (fortsetje, avslutte, ny reise)
5. **CTA** — "Berre éin match. Men éin som faktisk passar." → /onboarding
6. **Footer** — standard Footer-komponent

### Reise-fasar
1. **Dag 1–14** — Uten bilder, bygg tryggleik (Hvem er du egent?, Verdiar som binder, Kommunikasjon og nærheit)
2. **Dag 15–21** — Med bilder, djupe samtalar (Sårbarheit, Frykt og styrke, Intimitet og romantikk)
3. **Dag 22–30** — Felles reise, verktrueleg nærheit (Felles mål, Konflikt og løysing, Framtid og drømmer)

### Design
- Mørk blå gradient-bakgrunn (#162032 → #0F1923 → #0B1520)
- Glassmorphism-kort med gull- og blå-aksentar
- Tema-badgear i gull/blå fargar
- Typography: heading-lg, heading-md, heading-sm, body-lg, body-sm
- Konsistent med ToSom-designsystemet
- Rolig, varm, moden tone

### Teknologi
- Bruk av `typographyToStyle()` frå design-tokens
- Bruk av `color`, `spacing`, `radius`, `shadow` tokens
- GlassCard-hjelp komponent med inline styles frå tokens
- Ambient glød-effektar (gull)
- Fase-fargar (gold/blue) for badgear og element

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
- FASE 6D: "Kontakt" (/kontakt)