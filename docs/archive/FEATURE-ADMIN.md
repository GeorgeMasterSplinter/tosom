# Admin System — Dokumentasjon

**Oppdatert:** 30. juni 2026
**Versjon:** 1.0
**Status:** 🟡 Backend-logikk ferdig, frontend-komponent mangler

---

## OVERSIKT

Admin system gir et komplett dashboard for å overvåke og styre ToSom:
- **Bruker-oversikt** med filter og detaljer
- **Journey-oversikt** med resonans-sporing
- **Match-oversikt** med scoring
- **System-health** med uptime og latency
- **Moderering** (warn/suspend/ban)
- **Analytics** og statistikk

---

## ARKITEKTUR

```
lib/admin/
└── adminSystem.ts    # Backend-logikk
```

---

## ADMIN-RUTER

| Rute | Formål |
|--|--|
| `/admin` | Dashboard |
| `/admin/users` | Bruker-oversikt |
| `/admin/journeys` | Journey-oversikt |
| `/admin/matches` | Match-oversikt |
| `/admin/analytics` | Analytics |
| `/admin/settings` | Innstillingar |
| `/admin/moderation` | Moderering |

---

## ADMIN STATS

| Stat | Beskrivelse |
|--|--|
| Total users | Alle registrerte brukere |
| Active users | Aktive siste 7 dager |
| Active journeys | Pågående reiser |
| Daily matches | Dagelege match |
| Average resonance | Snitt-resonans |
| Conversion rate | Premium-konvertering |

---

## SYSTEM HEALTH

| Metric | Beskrivelse |
|--|--|
| Status | healthy/warning/critical |
| Uptime | % tid |
| Database latency | ms |
| API latency | ms |
| Error rate | % |
| Last backup | Tidsstempel |

---

## MODERERING

Handlingar:
- **Warn** — Skriftleg advarsel
- **Suspend** — Midlertidig deaktivering
- **Ban** —Permanent deaktivering

---

## BRUK I UI

```tsx
import { getAdminDashboard } from '@/lib/admin/adminSystem'

function AdminDashboard() {
  const data = await getAdminDashboard()

  return (
    <div>
      {/* Stats kort */}
      {/* Health indikator */}
      {/* Bruker-liste */}
      {/* Journey-liste */}
    </div>
  )
}
```

---

## AUTENTISERING

Bare brukere med `role: 'ADMIN'` kan aksesere admin-ruter.

---

## HUSK

- Admin panel er **ikke for offentlege brukere**
- Alle handlingar blir logga
- Moderering krev grunn
- System health skal være **healthy** til alle tider