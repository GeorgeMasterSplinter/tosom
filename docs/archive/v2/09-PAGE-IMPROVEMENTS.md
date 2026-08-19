# ToSom Side-for-side Forbedringsliste v2

**Versjon:** 2.0 · **Dato:** 11. august 2026
**Status:** Godkjent av George
**Formål:** Konkret forbedringsliste for hver bruker-side i ToSam-plattformen

---

## 1. Offentlige sider

### Landing (`/`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Hero-spacing | Høy | Øk vertikal padding til `space-3xl` (64px) for mer premium-luft |
| 2 | CTA-knapper | Høy | Bruk ToSomButton variant='primary' med loading-state |
| 3 | Scroll-animasjoner | Middels | Legg til subtil fade-in på seksjoner ved scroll (intersection observer, respekt reduced-motion) |
| 4 | Meta-tags | Høy | Fullt SEO: ogImage, description, Twitter Cards |
| 5 | Mobil-hero | Høy | Reduser display-xl til 28px på `<sm` for bedre lesbarhet |

### Slik fungerer det (`/slik-fungerer-det`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Steg-kort konsistens | Høy | Bruk ToSomCard med uniform padding og radius |
| 2 | Ikoner per steg | Middels | Legg til Lucide-ikoner for hver fase (onboarding→match→reise→chat) |
| 3 | Spacing mellom seksjoner | Høy | Bruk `space-xl` (32px) mellom alle steg-kort |

### Priser (`/priser`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Pris-kardesign | Høy | Glassmorphism med gull-border på anbefalt-plan |
| 2 | Feature-list | Middels | Konsistent checkmark-ikoner (grønn for inkludert, grå for ikke-inkludert) |

### Om oss (`/om-oss`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Team-seksjon | Lav | Placeholder tilgjengelig — vent med innhold til team vokser |
| 2 | Verdi-kort | Middels | Same design som landing-verdier for konsistens |

### Personvern / Vilkår / Kontakt

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Typografi-konsistens | Høy | Bruk body-md (16px/24px) for lesbarhet på lange tekst-sider |
| 2 | Side-notice-bar | Middels | Tilbakemelding at sider er under utvikling med lenke til kontakt |
| 3 | Kontakt-formular | Høy | Validert email + beskjed-felt, submit → sendEmail (lib/email.ts) |

---

## 2. Auth-sider

### Login (`/login`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Glass-card design | Høy | Konsistent med ToSomCard, ambient gold/blue glow bak |
| 2 | Vipps-CTA | Høy | Tydelig "Fortsett med Vipps" knapp med logo |
| 3 | Error-handtering | Høy | Varm, klar tekst på feil: "Noe gikk galt. Sjekk innlogging og prøv igjen." |
| 4 | Redirect-logikk | Middels | Etter login: sjekk user-state → redirect til riktig side (onboarding/dashboard/reise) |

### Register (`/register`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Samme design som login | Høy | Identisk glass-card, Vipps OAuth |
| 2 | Alder-krav-info | Høy | Vis "Du må være 23 år eller eldre" før register-knappen |
| 3 | Lenke til personvern/vilkår | Middels | Checkbox: "Jeg har lest og godtar personvernerklæring og vilkår" |

---

## 3. Onboarding (`/onboarding/[step]`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Progress-bar polering | Høy | Tynn gull-bar øverst med smooth transition mellom steg |
| 2 | Spørsmåls-tekst | Høy | Bruk body-lg (18px/28px) for alle spørsmål — føles mer innbydende |
| 3 | textarea-autogrow | Høy | Input-felt vokser med innhold (min 3-linjer, max 10-linjer) |
| 4 | Validering-meldinger | Høy | Varm tekst: "Fortell oss litt mer om deg" istedenfor "Dette feltet er påkrevd" |
| 5 | Overgangs-animasjon | Middels | Fade-out innhold → fade-in neste steg (400ms ease-out) |
| 6 | Tastaturnavigering | Høy | Enter-knapp går til neste steg når tekstfelt er fokusert |
| 7 | Mobil-spacing | Høy | På <sm: full-screen per steg med sticky bottom for "Neste"-knapp |

---

## 4. Dashboard (`/dashboard`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Hilsning-personalisering | Høy | "God morgen, [navn]" med tidsbasert hilsen (morgen/ettermiddag/kveld) |
| 2 | WaitingForMatch-polering | Høy | Pulsring-animasjon med rolig tempo (3s cycle), tekst: "Din match er på vei, [navn] 💛" |
| 3 | Action-knappegitter | Middels | Konsistent 2-kolonne grid på desktop, 1-kolonne på mobil |
| 4 | Journey-progress-visning | Høy | Tydelig "Dag X av 30" med progress-bar og fase-badge |
| 5 | Skeleton-states | Høy | Bruk ToSomSkeleton mens data lastes (ingen blank skjermer) |
| 6 | Profil/Partner-kort | Middels | Konsistent MatchCard-design med hover-tilstand |

---

## 5. Chat (`/chat` og `/chat/[id]`)

### Chat-oversikt (`/chat`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Empty-state | Høy | Varm melding: "Ingen aktive samtaler ennå" med lenke til dashboard |
| 2 | Konversasjonskort | Middels | Glass-kort med avatar, navn, dag-teller, siste melding (truncated) |

### Chat-rom (`/chat/[id]`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Header-konsistens | Høy | Sticky header med partner-avatar, navn, dag-teller |
| 2 | Meldingsbobler | Høy | Oppdater til nye chat-tokens (received: glass-bg, sent: gold-soft) |
| 3 | Typing-indikator | Middels | Subtil "skriver..." med tre prikker som pulserer (langsomt, ikke stressende) |
| 4 | Mood-selector | Lav | Behold eksisterende funksjonalitet, oppdater gradient-farger per v2-palette |
| 5 | "Bli kjent"-panel | Middels | Smooth slide-in/slide-out (400ms), kategorier med ikoner |
| 6 | Input-felt | Høy | Glass-bg, gull-focus border, sticky bottom, auto-resize for lengre meldinger |
| 7 | Bilde-upload (dag 15+) | Middels | Drag-and-drop + klikk, preview før send, max 5MB |
| 8 | Scroll-to-bottom | Høy | Auto-scroll til nyeste melding, manual override når bruker scroller opp |

---

## 6. Profil (`/profile` og `/profile/edit`)

### Min profil (`/profile`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Avatar-størrelse | Høy | 80px radius-full med fase-farge border (EARLY=blå, BUILDING_TRUST=gull, DEEPER=grønn) |
| 2 | Profil-kort | Høy | Glass-morphism konsistent med ToSomCard |
| 3 | Sikkerhets-badge | Middels | Lås-ikon + "Profilen din er privat — kun synlig for [match-navn]" |
| 4 | Fase-info | Høy | Tydelig badge: "Introduksjon · Dag X/30" |

### Rediger profil (`/profile/edit`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Låse-banner (dag 1-29) | Høy | Varm tekst: "Profilen din er låst under reisen. Du kan redigere igjen etter dag 30." |
| 2 | Formular-layout | Middels | Same som onboarding (single-column, body-lg spørsmålstekst) |

---

## 7. Reise (`/reisen` og `/reisen/avslutning`)

### Reis-hovedside (`/reisen`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Fase-banner | Høy | Farget banner øverst med fase-navn, dag-teller, og kort beskrivelse |
| 2 | DayCard-polering | Høy | Glass-kort med tema-ikon, tittel, beskrivelse, refleksjonsknapp |
| 3 | Tidslinje | Middels | Horisontal scroll på mobil, vertikal på desktop |
| 4 | Dag-navigasjon | Høy | Forrige/Neste knapper med disabled-state for fremtidige dager |

### Avslutning (`/reisen/avslutning`)

Se Journey v2 Forbedringsplan (dokument 08) for detaljer.

---

## 8. Innstillinger (`/settings`)

| # | Forbedring | Prioritet | Beskrivelse |
|---|------------|-----------|-------------|
| 1 | Tabs-navigasjon | Høy | Bruk ToSomTabs (når opprettet) for Konto / Varsler / Personvern / Språk |
| 2 | Konsistent formular-design | Høy | Same som onboarding (body-lg labels, glass-inputs) |
| 3 | Slett konto | Høy | Rød seksjon nederst med bekreftelsesmodal: "Er du sikker? Dette kan ikke angres." |
| 4 | Be var data | Middels | Knapp: "Last ned alle mine data" → triggerer GDPR-export |

---

## 9. Prioriteringsmatrix

### Høy prioritet (implementér først)
- Login/Register glass-card + error-handtering
- Onboarding spacing, textarea-autogrow, varme validering-meldinger
- Dashboard skeleton-states, hilsning-personalisering
- Chat header-konsistens, meldings-bobler v2, input-felt sticky
- Profil avatar med fase-border, glass-kart konsistens
- Reise fase-banner, DayCard-polering

### Middels prioritet (etter høy er ferdig)
- Landing scroll-animasjoner
- Chat typing-indikator, "Bli kjent" panel-polering
- Journey dag-progresjon indikator
- Settings tabs-navigasjon
- Kontakt-formular

### Lav prioritet (når alt annet er ferdig)
- Mood-selector gradient-farger
- Team-seksjon på /om-oss
- Reise tidslinje-layout-endring

---

## 10. Qwen ACT-instruks

```
Når du implementerer side-for-side forbedringer:

1. Les ALWAYS ai/system_prompt.md før hvert steg
2. Velg ÉN side om gangen (start med Login → Register → Onboarding → Dashboard → Chat)
3. Implementér alle "Høy prioritet"-punkter for siden før du går til neste
4. Test på mobil (375px) og desktop (1280px) etter hver side
5. Bruk PageShell-wrapper på alle sider når den er opprettet
6. Alle tekster i bokmål, ToSom-tone per språkmanualen
7. Ikke endre funksjonalitet — kun UI/UX-polering
```

---

*Slutt på Side-for-side Forbedringsliste v2.*