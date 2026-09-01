# ToSom — Tilgangsmodell

**Opprettet:** 2026-06-22  
**Status:** Første versjon

## Nivå-oversikt

```
Nivå 0: Uinnlogget → Public marketing-sider
         ↓
Nivå 1: Innloggt → Dashboard, onboarding, profil-under-arbeid
         ↓
Nivå 2: Betalt / aktiv profil → Matching, reise, chat
```

---

## Nivå 0: Uinnlogget (Public)

### Tilgjengelege sider:
- `/` — Landing page
- `/hvorfor` — Hvorfor ToSom
- `/slik` — Slik fungerer det
- `/reisen` — Guidet 30-dagers reise
- `/priser` — Priser (beta)
- `/betaling` — Betalings-side
- `/login` — Innlogging med magic link

### Beskriving:
Hvem som helst kan besøke desse sidene uten å logge inn. Dette er marknadsføring og informasjon om plattformen.

---

## Nivå 1: Innlogget

### Krev:
- Gyldig session (next-auth cookie eller tosom_session cookie)

### Tilgjengelege sider:
- `/dashboard` — Bruker-dashboard
- `/onboarding/*` — Profil-onboarding
- `/profile/*` — Profil-redigering
- `/questions` — Spørreskjema

### Beskriving:
Når en bruker er innlogga, kan de.fullføre grunnprofilen sin. De har ennå ikke full tilgang til matching eller reise.

---

## Nivå 2: Betalt / Full profil

### Krev:
- Gyldig session (nivå 1)
- **TODO:** Betalt abonnement eller engangsbetaling aktiv
- **TODO:** Profil markert som "fullført" i backend

### Tilgjengelege sider:
- `/matching` — Resonans-matching
- `/journey/*` — Guidet 30-dagers reise
- `/chat/*` — Samtale-rom

### Beskriving:
Når en bruker har betalt og profilen er fullført, får de tilgang til_matching, reise, og chat.

### TODO-kommentar for implementering:
```typescript
// TODO: Sjekk om brukeren har betalt / aktiv profil
// if (!user.hasPaid || !user.profileComplete) {
//   return NextResponse.redirect(new URL('/betaling', req.url));
// }
```

---

## Admin

### Krev:
- Gyldig session (nivå 1)
- Bruker har `ADMIN` rolle

### Tilgjengelege sider:
- `/admin/*` — Admin-panel

---

## Implementering

### Middleware-basert vern:
- `middleware.ts` styrer redirect basert på nivå
- Uinnloggede → redirect til `/login` med `callbackUrl`
- Innloggede uten betaling → kan bruke nivå 1-sider

### API-basert vern:
- `lib/auth/requireAuth.ts` — Verifiser session/token
- `lib/auth/adminAuthGuard.ts` — Admin-ber

---

## Test-scenario

1. **Inkognito-test:** Prøv å gå til `/dashboard` uten innlogging → bør redirect til `/login`
2. **Innlogget-test:** Logg inn → kan nå `/dashboard` men ikke `/matching`
3. **Betalt-test:** Når betaling er implementert → kan nå alle sider

---

## Nøkkeldokumentasjon

- [account-flow.md](account-flow.md) — Konto + betalingsflyt
- [HOW-TO-PRODUCT.md](HOW-TO-PRODUCT.md) — Produkt-sider
- [tosom-core-definition.md](../tosom-core-definition.md) — Kjerne-definisjon