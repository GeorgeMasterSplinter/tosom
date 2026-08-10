# ToSom — Konto + Betalingsflyt

**Opprettet:** 2026-06-22  
**Status:** Design-forslag (ikke implementert)

## Flyt-overvisk

```
[1] Opprett konto
    ↓
[2] Fullfør grunnprofil (onboarding)
    ↓
[3] Velg abonnement / engangsbetaling
    ↓
[4] Få tilgang til matching + reise
```

### Steg 1: Opprett konto

- Brukeren oppretter konto med e-post
- ToSom sender ei magisk innloggingslenke til e-posten
- Brukeren klikker på lenken og er innlogga
- Implementert i: `app/login/page.tsx`

### Steg 2: Fullfør grunnprofil

- Brukeren fyller ut grunnprofilen
- Onboarding-steget: identitet, livssituasjon, personlighet, etc.
- Implementert i: `app/onboarding/OnboardingFlow.tsx`
- Komponentar i: `components/onboarding/Step*.tsx`

### Steg 3: Velg abonnement / engangsbetaling

- Brukeren velger betalingstype
- **IKKE implementert enda**
- Her skal betalingsintegrasjon (Stripe/annet)
- Feature-flag: `config/features.ts` → `enablePayments: false`

### Steg 4: Få tilgang til matching + reise

- Når betaling er gjennomført → full tilgang
- Brukeren får sin første match
- Starter ei guidet 30-dagers reise

## TODO

- [ ] Bestem betalingsleverandør (Stripe, Vippay, etc.)
- [ ] Lag /betaling side med skjema
- [ ] Implementer webhook for betalingsbekreftelse
- [ ] La feature-flag styre redirect-ferd
- [ ] Opprett betaling-relaterte API-endepunkt
- [ ] Opprett database-modellar for abonnement
- [ ] Test heile flyten

## Nøkkeldokumentasjon

- [HOW-TO-PRODUCT.md](HOW-TO-PRODUCT.md) — Produkt-sider
- [tosom-core-definition.md](../tosom-core-definition.md) — Kjerne-definisjon