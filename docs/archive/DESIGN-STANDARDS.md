# ToSom Design Standards — Innstillinger

## Innstillingssider

### Brukerinnstillinger (Hovedside)
- **Rute:** `/settings`
- **Komponenter:** `components/settings/*`
- **Status:** ENKELE og PREMIUM versjon
- **Beskrivelse:** Dette er den eneste innstillingssiden brukere skal se. Alle brukerinnstillinger konsolideres her.

### Admin-innstillinger (Separat)
- **Rute:** `/admin/settings`
- **Komponenter:** `app/admin/settings/*` og `components/admin/*`
- **Status:** SEPARAT fra brukerinnstillinger
- **Beskrivelse:** Admin har egne behov og skal aldri blandes med brukerinnstillinger.

## Forbudt

- Dashboard skal ALDRI ha egen settings-side (`/dashboard/settings` er slettet)
- Onboarding skal ikke ha egne settings-paneler
- Profile-siden skal ikke ha egne settings-paneler
- Journey skal ikke ha egne settings-paneler
- Ingen andre ruter skal ha egne settings-paneler

## Settings-komponenter

Alle settings-komponenter ligger i `components/settings/`:

| Komponent | Beskrivelse |
|-----------|-------------|
| `SettingsCard.tsx` | Glassmorphism-kort for settings-seksjoner |
| `ToggleRow.tsx` | Rad med toggle-bryter for innstillinger |
| `DangerButton.tsx` | Knapp for fare-sonen (slett konto osv.) |
| `SecuritySettings.tsx` | Sikkerhetsinnstillinger |
| `ExportButton.tsx` | Dataeksport-knapp |

## Språk og tone

- Bokmål
- Varm, moden, trygg tone
- Ingen nynorsk i settings
- Ingen teknisk jargon mot bruker

## Designsystem

- ToSom Blue (#0A1A2A) + Nordic Gold (#D4AF37)
- Glassmorphism-kort
- Premium-design med store luftige flater
- Myke animasjoner