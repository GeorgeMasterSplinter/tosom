# ToSom — Hvordan teste (Sjekkliste)

**Opprettet:** 2026-06-22  
**Status:** Første versjon

---

## Test-sjekkliste

### 1. Landing page (/)
- [ ] Sida lastar utan errors
- [ ] Hero-tekst synleg (overskrift + undertekst)
- [ ] CTA-knapp "Opprett konto" fungerer
- [ ] Sekundær-knapp "Logg inn" fungerar
- [ ] Tre punkter (Profil, Match, Trygghet) synleg
- [ ] Footer synleg med lenker
- [ ] Mobil-visual: CTA full bredde
- [ ] Animasjonar fungerer (ingen feil i konsollen)

### 2. Login (/login)
- [ ] Sida lastar utan errors
- [ ] E-post-input fungerer
- [ ] "Send magic link"-knapp fungerer
- [ ] Bekreftelsesmelding synleg etter innsending
- [ ] Magic link i e-post fungerer (redirect til /onboarding)

### 3. Profil / Onboarding (/onboarding)
- [ ] Stegvis prosess fungerer (livssituasjon, verdier, etc.)
- [ ] "Neste"/"Forrige"-knapp fungerer
- [ ] Data blir lagra i localStorage eller DB
- [ ] Progress-indikator oppdaterast
- [ ] Fullfør-knapp fungerar → redirect til /dashboard

### 4. Matching (/matching)
- [ ] Sida lastar utan errors
- [ ] Match-kort synleg med resonans-data
- [ ] "Aksepter" / "Avvis" knapp fungerer
- [ ] Ved aksept: redirect til /journey/[journeyId]
- [ ] Ingen nye matcher etter aksept (låst i 30 dagar)

### 5. Dashboard (/dashboard)
- [ ] Sida lastar utan errors
- [ ] Brukar-info synleg
- [ ] Match-status synleg (aktiv/reise pågår)
- [ ] Hurtigtilgang til reise og chat
- [ ] Profilstatus synleg (under arbeid / fullført)

### 6. Reise (/journey/[id])
- [ ] Daglege tema synleg
- [ ] Oppgaver/spørsmål fungerer
- [ ] Resonansmåling oppdaterast
- [ ] Progresjons-indikator fungerer
- [ ] Framdriftsvisning (dag 1/30)

### 7. Chat (/chat/[id])
- [ ] Meldingar lastar
- [ ] Send melding fungerer
- [ ] Guidede spørsmål synleg ved behov
- [ ] Bildefase etter 14 dagar fungerer

### 8. Admin (/admin) — Kun admin
- [ ] Redirect til /dashboard for ikkje-admin
- [ ] Admin-panel fungerer

---

## Test-scenarioer

### Fresh user flow
1. Gå til / → "Opprett konto" → /onboarding
2. Fullfør onboarding → /dashboard
3. Vent på match (eller bruk demo-mode)
4. Aksepter match → /journey/[id]
5. Test daglege oppgåver og chat

### Returning user flow
1. Gå til /login
2. Skriv e-post → mottak magic link
3. Klikk link → /dashboard
4. Sjekk at reise/chat er tilgjengeleg

### Mobile flow
1. Opne i Chrome DevTools (mobile emulator)
2. Test alle stega over på mobil-størrelse
3. Sjekk at CTA-knappar er full bredde
4. Sjekk at timeline er horisontal scroll med snap

---

## Automated tests (framtidig)

### Unit tests
- `lib/matching/` → Matching-algoritme
- `lib/journey/` → Journey-logging
- `lib/profile/` → Profil-fylling

### Integration tests
- `/api/auth/*` → Magic link flow
- `/api/matching/*` → Match-opprettelse
- `/api/journey/*` → Reise-steg

### E2E tests (Playwright)
- `landing → onboarding → dashboard → match → journey`
- `login → dashboard → journey → chat`

---

## Browser-kompatibilitet

- [ ] Chrome (senaste 2 versjon)
- [ ] Firefox (senaste 2 versjon)
- [ ] Safari (senaste 2 versjon)
- [ ] Edge (senaste 2 versjon)
- [ ] Mobile Safari (iOS 15+)
- [ ] Mobile Chrome (Android 10+)

---

## Performance checklist

- [ ] LCP < 2.5s på landing
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Mobil: LCP < 3.5s