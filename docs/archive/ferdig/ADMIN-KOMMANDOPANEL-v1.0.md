# TOSOM — ADMIN KOMMANDOPANEL v1.0

**Dato:** 2026-08-21
**Commit:** `d1cae09`
**Status:** GJENNOMFØRT. D-1 … D-7 i `TOSOM-BETA-DRIFTSPLAN-v1.0.md` er alle lukket (K-1 … K-9).
**Kanonisk kilde:** `TOSOM-SUPER-MASTERPLAN-v1.0.md`
**Arbeidsmetode:** `ACT-PIPELINE-v1.0.md` — ett steg om gangen, patch-format, verifisering mellom hver.

---

## 0. Hva dette er

Admin-panelet skal være **den sentrale kommandoen over Tosom**. Ett sted hvor hele plattformen kan ses, forstås og styres.

Dokumentet inneholder ti steg (K-1 … K-9, pluss K-7a). Hvert steg har:

- hvilken fil som endres
- hvorfor
- komplett kodeforslag
- hvordan det verifiseres
- hva som **ikke** endres

Stegene er uavhengige og kan tas i valgfri rekkefølge, men den anbefalte rekkefølgen står i §12.

---

# DEL I — DESIGNGRUNNLAGET

## 1. Prinsippene

### 🔵 KONSEPT

**Cockpit, ikke arkade.** Panelet skal føles som et instrumentpanel i et moderne fly: teknisk presist, tett med informasjon, men helt rolig. Ingen neon, ingen raske animasjoner, ingen konkurranse om oppmerksomheten.

Seks regler:

| # | Regel |
|---|---|
| P-1 | **Ampel gjennomgående.** Grønn = ingen handling. Gul = se på det i dag. Rød = handle nå. Alltid samme tre farger, alltid samme betydning. |
| P-2 | **Hvert tall får en setning.** Ikke «Kø: 3», men «Kø: 3 — for få til lørdagens runde. Send flere invitasjoner.» |
| P-3 | **Stillhet er informasjon.** Er alt grønt, skal panelet si det med én linje og ellers holde kjeft. |
| P-4 | **SVG, ikke emoji.** Ett ikonspråk, 24×24, `currentColor`, `strokeWidth={2}` — samme stil som `components/icons/`. |
| P-5 | **Tokens, ikke hardkoding.** `ts-`-klasser fra `tailwind.config.js` framfor inline hex. |
| P-6 | **Tall i monospace.** Sifre skal kunne sammenlignes loddrett mellom kort. |

### Hva som ikke er lov

Panelet skal aldri bruke gamification, framgangsstolper som belønner, lyder, badges, eller varsler som haster uten grunn. Dette er en driftsflate for én voksen person.

## 2. Fargespråket

### 🟢 IMPLEMENTERT
Kilden er `components/admin/StatusBadge.tsx` og skal ikke endres. Den er riktig, testet og kanonisk.

| Severity | Farge | Bakgrunn | Betydning |
|---|---|---|---|
| `ok` | `#34D399` | `rgba(52,211,153,0.1)` | Ingen handling |
| `warn` | `#FBBF24` | `rgba(251,191,36,0.1)` | Se på det i dag |
| `critical` | `#FF4D4D` | `rgba(255,77,77,0.1)` | Handle nå |

De åtte terskelfunksjonene (`thresholdLastMatchRound`, `thresholdQueueSize`, `thresholdRoundDuration`, `threshold5xxRate`, `thresholdDbConnections`, `thresholdOpenReports`, `thresholdSentryErrors`, `thresholdFreeQuota`) er kanoniske. **De skal gjenbrukes, ikke skrives om.**

## 3. Nåværende tilstand

### 🟢 IMPLEMENTERT — alle lukket

De sju avvikene under var tilstanden da dette dokumentet ble skrevet. Alle er nå lukket i commit `d1cae09`. Stegene K-1 … K-9 nedenfor er referanse for hvordan de ble gjennomført.

| ID | Avvik (før) | Lukt med | Status |
|---|---|---|---|
| D-1 | Sju sider uten navigasjon | K-2 | ✅ |
| D-2 | Oppdiktede samtaler (`mockChats`) | K-7 | ✅ |
| D-3 | Oppdiktet logg (`mockLogs`) | K-8 | ✅ |
| D-4 | Tall uten mening | K-3 | ✅ |
| D-5 | Ingen handlingsoversikt | K-4 | ✅ |
| D-6 | Emoji + hardkodet farge | K-1 | ✅ |
| D-7 | Skjør sti-lesing (`x-url`) | K-9 | ✅ |

Alle admin-ruter er nå lenket i `AdminSidebar.tsx` (4 grupper: Oversikt · Mennesker · System · Verktøy), inkludert `/admin/reports` (moderering) og `/admin/invites` (invitasjonsporten). `/admin/chat` og `/admin/tools` viser sannt data.

---

# DEL II — STEGENE

## K-1 — Admin-ikonsett

**Fil:** `components/admin/icons.tsx` (ny)
**Lukker:** D-6
**Type:** Ny fil, ingen avhengigheter

### Hvorfor
Sidebaren bruker emoji (📊 👥 💝 🕓). Emoji rendres ulikt på hver plattform, kan ikke fargelegges, og gir et uprofesjonelt uttrykk. Repoet har allerede ti SVG-ikoner i `components/icons/` med konsistent stil. Vi følger samme mønster.

### Kode

```tsx
'use client';

/**
 * Tosom — Admin-ikoner
 *
 * Samme stil som components/icons/: 24×24, currentColor,
 * strokeWidth 2, runde hjørner. Ingen eksterne avhengigheter.
 */

interface IconProps {
  className?: string;
  size?: number;
}

const base = (size: number) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

/** Oversikt — rutenett */
export const OverviewIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

/** Brukere */
export const UsersIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/** Matcher — to sirkler som møtes */
export const MatchIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="8" cy="12" r="5" />
    <circle cx="16" cy="12" r="5" />
  </svg>
);

/** Reiser — vei framover */
export const JourneyIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="5" r="2" />
    <path d="M7 18c4-1 8-6 10-11" />
  </svg>
);

/** Samtaler */
export const ChatIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

/** Rapporter — varseltrekant */
export const ReportIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

/** Invitasjoner — konvolutt */
export const InviteIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 5L2 7" />
  </svg>
);

/** System — puls */
export const SystemIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

/** Analyse — stolper */
export const AnalyticsIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

/** Logg — linjer */
export const LogIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="13" y2="17" />
  </svg>
);

/** Resonans — konsentriske buer */
export const ResonanceIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
    <path d="M7.76 16.24a6 6 0 0 1 0-8.49" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
  </svg>
);

/** Verktøy — skiftenøkkel */
export const ToolsIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

/** Reiseinnhold — bok */
export const ContentIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

/** Hengelås — brukes i sidebar-tittelen */
export const LockIcon = ({ className = '', size = 20 }: IconProps) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
```

### Verifisering
```bash
npx tsc --noEmit
```

### Endres ikke
`components/icons/` røres ikke. Admin-ikonene ligger for seg selv fordi de har eget bruksområde.

---

## K-2 — Sidebar med grupper og alle ruter

**Fil:** `components/admin/AdminSidebar.tsx`
**Lukker:** D-1, D-6
**Avhenger av:** K-1

### Hvorfor
Sju bygde sider er utilgjengelige fra navigasjonen. Samtidig gir en flat liste på 15 punkter ingen struktur. Løsningen er fire grupper som følger hvordan man faktisk jobber: se oversikten, håndtere mennesker, passe systemet, bruke verktøy.

### Kode

```tsx
'use client';

/**
 * Tosom — Admin Sidebar
 *
 * Fire grupper: OVERSIKT · MENNESKER · SYSTEM · VERKTØY.
 * Alle admin-ruter er tilgjengelige herfra.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  OverviewIcon, UsersIcon, MatchIcon, JourneyIcon, ChatIcon,
  ReportIcon, InviteIcon, SystemIcon, AnalyticsIcon, LogIcon,
  ResonanceIcon, ToolsIcon, ContentIcon, LockIcon,
} from './icons';

interface NavItem {
  label: string;
  href: string;
  Icon: (props: { className?: string; size?: number }) => JSX.Element;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Oversikt',
    items: [
      { label: 'Kommandopanel', href: '/admin/dashboard', Icon: OverviewIcon },
      { label: 'Analyse', href: '/admin/analytics', Icon: AnalyticsIcon },
    ],
  },
  {
    title: 'Mennesker',
    items: [
      { label: 'Brukere', href: '/admin/users', Icon: UsersIcon },
      { label: 'Matcher', href: '/admin/matches', Icon: MatchIcon },
      { label: 'Reiser', href: '/admin/journeys', Icon: JourneyIcon },
      { label: 'Samtaler', href: '/admin/conversations', Icon: ChatIcon },
      { label: 'Rapporter', href: '/admin/reports', Icon: ReportIcon },
      { label: 'Invitasjoner', href: '/admin/invites', Icon: InviteIcon },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Status', href: '/admin/system/status', Icon: SystemIcon },
      { label: 'Systemlogg', href: '/admin/logs', Icon: LogIcon },
      { label: 'Resonans', href: '/admin/resonance', Icon: ResonanceIcon },
    ],
  },
  {
    title: 'Verktøy',
    items: [
      { label: 'Reiseinnhold', href: '/admin/journey-content', Icon: ContentIcon },
      { label: 'Verktøy', href: '/admin/tools', Icon: ToolsIcon },
    ],
  },
];

function isActiveHref(pathname: string, href: string): boolean {
  if (href === '/admin/dashboard') return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

export function AdminSidebar() {
  const pathname = usePathname() || '';

  return (
    <div
      className="fixed top-0 left-0 h-full flex flex-col border-r"
      style={{ width: '240px', background: '#0A1220', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {/* Tittel */}
      <div
        className="flex items-center gap-2.5 px-6"
        style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <LockIcon size={16} className="text-[#D4AF37]" />
        <span className="text-sm font-semibold tracking-wide text-[#D4AF37]">
          TOSOM ADMIN
        </span>
      </div>

      {/* Navigasjon */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-5">
            <div
              className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: 'rgba(255,255,255,0.28)' }}
            >
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map(({ label, href, Icon }) => {
                const active = isActiveHref(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    style={{
                      background: active ? 'rgba(212,175,55,0.10)' : 'transparent',
                      color: active ? '#D4AF37' : 'rgba(255,255,255,0.55)',
                      borderLeft: active ? '2px solid #D4AF37' : '2px solid transparent',
                    }}
                  >
                    <Icon size={17} className="flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bunn */}
      <div
        className="py-3 px-6 text-[11px]"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)' }}
      >
        Tosom Admin v1.0
      </div>
    </div>
  );
}

export default AdminSidebar;
```

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```
Deretter manuelt: klikk gjennom alle 13 lenker og bekreft at ingen gir 404.

### Endres ikke
Bredden på 240 px beholdes — `app/admin/layout.tsx` regner med den.

---

## K-3 — Handlingstekster til tersklene

**Fil:** `components/admin/thresholds.ts` (ny)
**Lukker:** D-4
**Type:** Ny fil, ren logikk

### Hvorfor
Dette er det viktigste steget for forståelighet. I dag sier panelet «Kø-størrelse: 3». Det forutsetter at du husker at 20 er grensen, og at du vet hva du gjør med tallet. Denne filen gjør hver indikator selvforklarende: hva den måler, hva verdien betyr, og hva du skal gjøre.

Terskelfunksjonene i `StatusBadge.tsx` gjenbrukes uendret.

### Kode

```ts
/**
 * Tosom — Indikatorbetydning
 *
 * Hver indikator får en forklaring og en handlingssetning.
 * Tersklene selv ligger i StatusBadge.tsx og gjenbrukes derfra.
 */

import type { Severity } from './StatusBadge';

export interface IndicatorMeaning {
  /** Hva indikatoren måler — vises som hjelpetekst */
  explains: string;
  /** Hva du skal gjøre, gitt severity. Null = ingen handling. */
  action: Record<Severity, string | null>;
}

export const INDICATOR_MEANING: Record<string, IndicatorMeaning> = {
  lastMatchRound: {
    explains: 'Tid siden forrige matcherunde. Runden går natt til lørdag.',
    action: {
      ok: null,
      warn: 'Runden nærmer seg å bli forsinket. Sjekk cron i Status.',
      critical: 'Runden har ikke kjørt. Sjekk cron, og kjør manuelt fra Verktøy.',
    },
  },
  queueSize: {
    explains: 'Antall personer som venter på match i neste runde.',
    action: {
      ok: null,
      warn: 'Få i kø. Runden gir færre matcher enn den kunne.',
      critical: 'Ingen i kø. Send flere invitasjoner.',
    },
  },
  roundDuration: {
    explains: 'Hvor lenge forrige matcherunde brukte på å fullføre.',
    action: {
      ok: null,
      warn: 'Runden bruker lengre tid enn normalt. Noter tallet.',
      critical: 'Runden er treg. Noter tallet — dette er data til tuning, ikke en hendelse.',
    },
  },
  openReports: {
    explains: 'Rapporter fra brukere som venter på behandling.',
    action: {
      ok: null,
      warn: 'Noen har meldt fra. Behandle i dag.',
      critical: 'Flere ubehandlede rapporter. Behandle nå.',
    },
  },
  errorsLast24h: {
    explains: 'Feil logget av systemet det siste døgnet.',
    action: {
      ok: null,
      warn: 'Flere feil enn vanlig. Se Systemlogg.',
      critical: 'Mange feil. Finn mønsteret i Systemlogg før du gjør noe annet.',
    },
  },
  freeQuota: {
    explains: 'Forbruk mot gratiskvoten på eksterne tjenester.',
    action: {
      ok: null,
      warn: 'Kvoten nærmer seg. Planlegg oppgradering.',
      critical: 'Kvoten er nesten brukt opp. Oppgrader før den treffer taket.',
    },
  },
  dbConnections: {
    explains: 'Andel av databaseforbindelser i bruk.',
    action: {
      ok: null,
      warn: 'Forbindelsene fylles opp. Følg med.',
      critical: 'Databasen går snart tom for forbindelser.',
    },
  },
  errorRate5xx: {
    explains: 'Serverfeil den siste timen.',
    action: {
      ok: null,
      warn: 'Enkelte serverfeil. Se Systemlogg.',
      critical: 'Vedvarende serverfeil. Undersøk umiddelbart.',
    },
  },
};

/** Handlingssetning for en indikator, eller null når alt er som det skal. */
export function actionFor(key: string, severity: Severity): string | null {
  return INDICATOR_MEANING[key]?.action[severity] ?? null;
}

/** Kort forklaring av hva indikatoren måler. */
export function explainFor(key: string): string {
  return INDICATOR_MEANING[key]?.explains ?? '';
}

/** Verste severity i en samling. Rød slår gul, gul slår grønn. */
export function worstSeverity(list: Severity[]): Severity {
  if (list.includes('critical')) return 'critical';
  if (list.includes('warn')) return 'warn';
  return 'ok';
}
```

### Verifisering
```bash
npx tsc --noEmit
```

---

## K-4 — «Krever handling»-stripe

**Fil:** `components/admin/ActionRequired.tsx` (ny)
**Lukker:** D-5
**Avhenger av:** K-1, K-3

### Hvorfor
I dag må du lese seks kort og tolke fargene for å vite om noe haster. Stripen gjør den jobben: den samler alt som er gult eller rødt øverst på siden, sortert etter alvor, med handlingssetning og lenke.

Er alt grønt, viser den én rolig linje — og da vet du at du er ferdig.

### Kode

```tsx
'use client';

/**
 * Tosom — Krever handling
 *
 * Samler alt som er gult eller rødt øverst på kommandopanelet.
 * Er alt grønt, vises én linje som bekrefter det.
 */

import Link from 'next/link';
import type { Severity } from './StatusBadge';

export interface ActionItem {
  key: string;
  label: string;
  value: string;
  severity: Severity;
  action: string | null;
  href?: string;
}

const TONE: Record<Exclude<Severity, 'ok'>, { text: string; bg: string; border: string }> = {
  critical: { text: '#FF4D4D', bg: 'rgba(255,77,77,0.06)', border: 'rgba(255,77,77,0.25)' },
  warn: { text: '#FBBF24', bg: 'rgba(251,191,36,0.06)', border: 'rgba(251,191,36,0.22)' },
};

export function ActionRequired({ items }: { items: ActionItem[] }) {
  const needsAttention = items
    .filter((i) => i.severity !== 'ok' && i.action)
    .sort((a, b) => (a.severity === 'critical' ? -1 : b.severity === 'critical' ? 1 : 0));

  if (needsAttention.length === 0) {
    return (
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-4"
        style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.18)' }}
      >
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: '#34D399', animation: 'ts-pulse 2s ease-in-out infinite' }}
          />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#34D399' }} />
        </span>
        <div>
          <p className="text-sm font-medium" style={{ color: '#34D399' }}>
            Ingen tiltak nødvendig
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Alle indikatorer er innenfor normalen.
          </p>
        </div>
      </div>
    );
  }

  const worst = needsAttention[0].severity as Exclude<Severity, 'ok'>;
  const tone = TONE[worst];

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: tone.bg, border: `1px solid ${tone.border}` }}>
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${tone.border}` }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: tone.text }}>
          Krever handling
        </h2>
        <span className="text-xs font-mono" style={{ color: tone.text }}>
          {needsAttention.length}
        </span>
      </div>

      <ul>
        {needsAttention.map((item) => {
          const itemTone = TONE[item.severity as Exclude<Severity, 'ok'>];
          const row = (
            <div className="flex items-start gap-3 px-5 py-3">
              <span
                className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
                style={{ background: itemTone.text }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    {item.label}
                  </span>
                  <span className="text-sm font-mono" style={{ color: itemTone.text }}>
                    {item.value}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {item.action}
                </p>
              </div>
              {item.href && (
                <span className="text-xs flex-shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  →
                </span>
              )}
            </div>
          );

          return (
            <li key={item.key} style={{ borderTop: `1px solid ${tone.border}` }}>
              {item.href ? (
                <Link href={item.href} className="block transition-colors hover:bg-white/[0.02]">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActionRequired;
```

### Nødvendig tillegg i `styles/globals.css`

```css
/* Rolig puls for aktive statusindikatorer i admin */
@keyframes ts-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50%      { opacity: 0.15; transform: scale(1.8); }
}
```

### Verifisering
```bash
npx tsc --noEmit
```

---

## K-5 — Kommandopanelet bygges om

**Fil:** `app/admin/dashboard/page.tsx`
**Lukker:** D-4, D-5, D-6
**Avhenger av:** K-1, K-3, K-4

### Hvorfor
Siden henter allerede riktige data fra `/api/admin/metrics` og `/api/admin/overview`. Det som mangler er at den **sier hva dataene betyr**. Vi beholder datalastingen uendret og bygger om presentasjonen.

Ny rekkefølge på siden — viktigst øverst:

1. Topplinje: tittel, tidsstempel, oppdater-knapp
2. **Krever handling** (K-4)
3. Nøkkeltall — seks kort, klikkbare
4. Alle indikatorer med forklaring
5. Systemtjenester + reisefaser side om side

### Nøkkelendringer

**a) Bygg `ActionItem[]` fra overview-dataene:**

```tsx
import { actionFor, explainFor, worstSeverity } from '@/components/admin/thresholds';
import { ActionRequired, type ActionItem } from '@/components/admin/ActionRequired';

function buildActionItems(overview: OverviewData): ActionItem[] {
  const ind = overview.indicators;

  const defs: Array<{ key: string; label: string; severity: Severity; value: string; href?: string }> = [
    {
      key: 'lastMatchRound',
      label: 'Siste matcherunde',
      severity: thresholdLastMatchRound(ind.lastMatchRound.hoursSince),
      value: ind.lastMatchRound.hoursSince !== null
        ? `${Math.round(ind.lastMatchRound.hoursSince)} t siden`
        : 'Aldri',
      href: '/admin/system/status',
    },
    {
      key: 'queueSize',
      label: 'Kø til neste runde',
      severity: thresholdQueueSize(ind.queueSize),
      value: `${ind.queueSize}`,
      href: '/admin/invites',
    },
    {
      key: 'roundDuration',
      label: 'Runde-varighet',
      severity: thresholdRoundDuration(ind.lastMatchRound.durationMs),
      value: ind.lastMatchRound.durationMs !== null
        ? `${(ind.lastMatchRound.durationMs / 1000).toFixed(1)} s`
        : '—',
    },
    {
      key: 'openReports',
      label: 'Åpne rapporter',
      severity: thresholdOpenReports(ind.openReports),
      value: `${ind.openReports}`,
      href: '/admin/reports',
    },
    {
      key: 'errorsLast24h',
      label: 'Feil siste døgn',
      severity: thresholdSentryErrors(ind.errorsLast24h),
      value: `${ind.errorsLast24h}`,
      href: '/admin/logs',
    },
    {
      key: 'freeQuota',
      label: 'Gratiskvote',
      severity: thresholdFreeQuota(ind.freeQuotaUsed),
      value: `${ind.freeQuotaUsed.toLocaleString('nb-NO')} / 10 000`,
    },
  ];

  return defs.map((d) => ({ ...d, action: actionFor(d.key, d.severity) }));
}
```

**b) Indikatorkort med forklaring:**

```tsx
function IndicatorCard({ item }: { item: ActionItem }) {
  const color = item.severity === 'ok' ? '#34D399' : item.severity === 'warn' ? '#FBBF24' : '#FF4D4D';

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
      </div>
      <div className="text-lg font-mono font-semibold mb-1" style={{ color }}>
        {item.value}
      </div>
      <p className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.28)' }}>
        {item.action ?? explainFor(item.key)}
      </p>
    </div>
  );
}
```

**c) Nøkkeltall med ikon og monospace:**

```tsx
function MetricCard({
  label, value, color, href, Icon,
}: {
  label: string;
  value: string | number;
  color: string;
  href: string;
  Icon: (p: { className?: string; size?: number }) => JSX.Element;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl p-4 block transition-colors duration-200 hover:bg-white/[0.04]"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <Icon size={15} className="opacity-40" />
        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>→</span>
      </div>
      <div className="text-2xl font-mono font-bold leading-none mb-1.5" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </Link>
  );
}
```

**d) Topplinje med gull-hårlinje og oppdatering:**

```tsx
<div className="pb-4" style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
  <div className="flex items-start justify-between gap-4">
    <div>
      <h1 className="text-xl font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.92)' }}>
        Kommandopanel
      </h1>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
        {lastUpdated
          ? `Oppdatert ${lastUpdated.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}`
          : 'Henter data …'}
      </p>
    </div>
    <button
      onClick={load}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
      style={{
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.2)',
        color: '#D4AF37',
      }}
    >
      {loading ? 'Henter …' : 'Oppdater'}
    </button>
  </div>
</div>
```

Datalastingen flyttes til en `useCallback` slik at knappen kan gjenbruke den, og `lastUpdated` settes når svaret kommer.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

### Endres ikke
API-kallene, `StatusBadge.tsx`, tersklene og `JourneyPhaseMonitor`-logikken. Kun presentasjon.

---

## K-6 — Beta-panel

**Fil:** `components/admin/BetaPanel.tsx` (ny)
**Lukker:** D-5 (beta-delen)
**Avhenger av:** K-1

### Hvorfor
Under beta er tre spørsmål viktigere enn alt annet: Hvor mange er invitert? Hvor mange har tatt invitasjonen i bruk? Står det nok folk i kø til lørdagens runde?

Svarene finnes i dag spredt over `/admin/invites` og kø-tallet på forsiden. Panelet samler dem.

### Kode

```tsx
'use client';

/**
 * Tosom — Beta-panel
 *
 * Invitasjoner, kø og neste matcherunde samlet.
 * Vises på kommandopanelet så lenge beta pågår.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { InviteIcon } from './icons';

interface Invite {
  id: string;
  email: string;
  invitedAt: string;
  usedAt: string | null;
}

/** Neste matcherunde: natt til lørdag, 03:00 norsk tid. */
function nextRound(from: Date = new Date()): Date {
  const d = new Date(from);
  d.setHours(3, 0, 0, 0);
  const daysUntilSaturday = (6 - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + daysUntilSaturday);
  if (d <= from) d.setDate(d.getDate() + 7);
  return d;
}

function Stat({ label, value, tone = 'rgba(255,255,255,0.85)' }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className="text-xl font-mono font-semibold leading-none mb-1" style={{ color: tone }}>
        {value}
      </div>
      <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</div>
    </div>
  );
}

export function BetaPanel({ queueSize }: { queueSize: number | null }) {
  const [invites, setInvites] = useState<Invite[] | null>(null);

  useEffect(() => {
    fetch('/api/beta/invites')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setInvites(d?.invites ?? []))
      .catch(() => setInvites([]));
  }, []);

  const total = invites?.length ?? 0;
  const used = invites?.filter((i) => i.usedAt).length ?? 0;
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;

  const round = nextRound();
  const hoursLeft = Math.max(0, Math.round((round.getTime() - Date.now()) / 3_600_000));

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <InviteIcon size={15} className="text-[#D4AF37]" />
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#D4AF37]">
            Lukket beta
          </h3>
        </div>
        <Link href="/admin/invites" className="text-xs transition-colors hover:text-white/60" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Administrer →
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <Stat label="Invitert" value={invites === null ? '—' : String(total)} />
        <Stat label="Tatt i bruk" value={invites === null ? '—' : String(used)} tone="#34D399" />
        <Stat label="I kø" value={queueSize === null ? '—' : String(queueSize)} tone={queueSize === 0 ? '#FF4D4D' : '#D4AF37'} />
        <Stat label="Til neste runde" value={`${hoursLeft} t`} />
      </div>

      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #D4AF37, #E8C766)' }}
        />
      </div>
      <p className="text-[11px] mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {total === 0
          ? 'Ingen invitasjoner sendt ennå.'
          : `${pct} % av de inviterte har logget inn. Neste matcherunde ${round.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long' })}.`}
      </p>
    </div>
  );
}

export default BetaPanel;
```

### Verifisering
```bash
npx tsc --noEmit
```

### Merk
Panelet skal fjernes fra kommandopanelet når beta avsluttes. Det er en midlertidig flate med et tydelig formål.

---

## K-7 — `/admin/chat` mot ekte data

**Fil:** `app/admin/chat/page.tsx`
**Lukker:** D-2
**Alvor:** 🔴 Høyest prioritet

### Hvorfor
Siden viser ti oppfunne par med navn som «Ane Bjørnstad» og «Magnus Solheim». I drift er dette direkte farlig: du kan tro du ser på plattformen mens du ser på fiksjon. Bryter driftsinvariant DI-4.

### Datakilden
`GET /api/admin/conversations?page=1&limit=50&frozenOnly=false` returnerer:

```ts
{
  data: Array<{
    id: string;
    userAId: string;
    userBId: string;
    matchId: string | null;
    frozenAt: string | null;
    frozenBy: string | null;
    endedAt: string | null;
    lastMessageAt: string | null;
    createdAt: string;
    imageShared: boolean;
    imageShareAllowedAt: string | null;
    userA: { id: string; email: string; name: string | null; role: string };
    userB: { id: string; email: string; name: string | null; role: string };
  }>,
  pagination: { page: number; limit: number; total: number; pages: number }
}
```

### Kolonnetilpasning

| Kolonne i mock | Finnes i API? | Løsning |
|---|---|---|
| `userA`, `userB` | ✅ | `userA.name ?? userA.email` |
| `startDate` | ✅ | `createdAt` |
| `lastMessage` | ✅ | `lastMessageAt` |
| `frozen` | ✅ | `frozenAt !== null` |
| `images` | Delvis | Erstattes av `imageShared` (ja/nei) |
| `messages` | ❌ | Krever K-7a — ellers utelates kolonnen |
| `flagged` | ❌ | Erstattes av lenke til `/admin/reports` |

### Framgangsmåte
1. Slett `mockChats` (linje 165–178)
2. Legg til `useEffect` som henter fra `/api/admin/conversations`
3. Endre `ChatRow`-typen til `Conversation`
4. Flytt søk og paginering til server via query-parametre
5. Legg til tom-tilstand: «Ingen samtaler ennå.»
6. Legg til feiltilstand: «Kunne ikke hente samtaler.»
7. Fjern kolonnene som ikke har dekning i data

### Personvern
Panelet viser **at** en samtale finnes og hvor aktiv den er. Aldri innholdet. Driftsinvariant DI-1: admin leser aldri en samtale uten at en rapport foreligger.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
grep -n "mock" app/admin/chat/page.tsx   # skal ikke gi treff
```

---

## K-7a — Meldingstall i conversations-ruten

**Fil:** `app/api/admin/conversations/route.ts`
**Type:** 🔶 **BACKEND — krever egen godkjenning fra George**

### Hvorfor
For å vise «142 meldinger» trengs et tall som ruten ikke returnerer i dag. Prisma kan telle relasjonen uten ekstra spørring.

### Patch

```diff
--- a/app/api/admin/conversations/route.ts
+++ b/app/api/admin/conversations/route.ts
@@
           imageShared: true,
           imageShareAllowedAt: true,
           userA: { select: { id: true, email: true, name: true, role: true } },
-          userB: { select: { id: true, email: true, name: true, role: true } }
+          userB: { select: { id: true, email: true, name: true, role: true } },
+          _count: { select: { messages: true } }
         }
```

### Vurdering
- **Risiko:** lav. Additiv endring, ingen eksisterende felt røres.
- **Ytelse:** Prisma løser `_count` med en join. Ubetydelig ved beta-volum.
- **Personvern:** eksponerer et antall, ikke innhold. Bryter ingen invariant.
- **Forutsetning:** ✅ verifisert. `prisma/schema.prisma` har `messages Message[]` på `Conversation`.


**Sies dette nei til**, utelates meldingskolonnen i K-7. Siden fungerer uansett.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
curl -s localhost:3000/api/admin/conversations | jq '.data[0]._count'
```

---

## K-8 — `/admin/tools` mot ekte logg

**Fil:** `app/admin/tools/page.tsx`
**Lukker:** D-3
**Alvor:** 🔴 Høy prioritet

### Hvorfor
`mockLogs` (linje 94) later som om verktøy har vært kjørt: «Kjør cron — journey-oppdatering · OK · 5 min siden». Ingenting av det har skjedd. Verre: `handleToolAction` legger til en ny linje i listen **uten å kalle noe API**, så knappene ser ut til å virke uten å gjøre noe.

Dette er den mest villedende flaten i panelet.

### Datakilden
`GET /api/admin/system-logs?page=1&limit=20` returnerer:

```ts
{
  data: Array<{
    id: string;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
    module: string;
    metadata: string | null;
    createdAt: string;
  }>,
  stats: { errorCount: number; warningCount: number; infoCount: number; total: number },
  pagination: { page: number; limit: number; total: number; pages: number }
}
```

### Framgangsmåte
1. Slett `mockLogs` (linje 92–99)
2. Hent ekte logg: `/api/admin/system-logs?limit=20`
3. Fargelegg etter `level`: ERROR rød, WARN gul, INFO nøytral
4. Vis relativ tid fra `createdAt` (`date-fns` finnes allerede i prosjektet)
5. **`handleToolAction` må kalle et faktisk endepunkt.** Har verktøyet ingen backend, skal knappen deaktiveres og merkes «Ikke tilgjengelig ennå» — aldri late som.
6. Etter vellykket kjøring: hent loggen på nytt i stedet for å dikte opp en rad

### Regel
En knapp som ikke gjør noe skal se ut som en knapp som ikke gjør noe.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
grep -n "mock" app/admin/tools/page.tsx   # skal ikke gi treff
```

---

## K-9 — Rydde sti-lesing i layout

**Fil:** `app/admin/layout.tsx`
**Lukker:** D-7
**Alvor:** 🟡 Lav

### Hvorfor
Layouten avgjør om sidebaren skal vises ved å lese `x-url`-headeren som middleware setter, med `referer` som reserve og en hardkodet URL som siste utvei:

```tsx
const url = new URL(headerStore.get('x-url') || headerStore.get('referer') || 'http://localhost/admin/dashboard');
```

Feiler alle tre, får login-siden en sidebar den ikke skal ha.

### Løsning
Flytt login ut av layoutens ansvarsområde ved å bruke en rutegruppe:

```
app/admin/
├── layout.tsx              → kun redirect-fri passthrough
├── (panel)/
│   ├── layout.tsx          → sidebar + innholdsramme
│   ├── dashboard/
│   ├── users/
│   └── …
└── login/
    └── page.tsx            → ingen sidebar, ingen sjekk
```

Rutegrupper med parentes påvirker ikke URL-ene. `/admin/dashboard` forblir `/admin/dashboard`.

### Gevinst
- Ingen header-avhengighet
- Ingen strengsammenligning av stier
- Server-komponent uten `headers()`-kall — raskere
- Ny admin-side får riktig ramme automatisk

### Merk
Dette flytter filer. Per `ACT-PIPELINE` §4 tas det som eget steg, sist, når alt annet er verifisert. `x-url`-headeren i `middleware.ts` beholdes — andre deler kan bruke den.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
npm run build
```
Deretter manuelt: `/admin/login` uten sidebar, `/admin/dashboard` med.

---

# DEL III — GJENNOMFØRING

## 12. Rekkefølge

Sannheten først, så strukturen, så forståelsen, så finpussen.

| Runde | Steg | Hva oppnås |
|---|---|---|
| **1 — Sannhet** | K-8, K-7 (+ K-7a) | Ingen oppdiktede tall igjen. DI-4 innfridd. |
| **2 — Tilgang** | K-1, K-2 | Alle 15 sider tilgjengelige, SVG-ikoner |
| **3 — Forståelse** | K-3, K-4, K-5 | Panelet sier hva som skal gjøres |
| **4 — Beta** | K-6 | Invitasjoner og kø samlet |
| **5 — Opprydding** | K-9 | Layout ryddet |

Runde 1 og 2 må være ferdig før første invitasjon. Runde 3 bør. Runde 4 og 5 kan tas mens beta pågår.

## 13. Verifisering per steg

Etter **hver** patch, uten unntak:

```bash
npx tsc --noEmit
npx jest --ci --silent
```

Begge grønne før neste steg. Ved feil: rett før du går videre.

Etter K-2, K-5 og K-9 også manuell klikkrunde gjennom alle admin-ruter.

## 14. Hva som ikke endres

| Fil | Hvorfor |
|---|---|
| `components/admin/StatusBadge.tsx` | Tersklene er kanoniske og testet |
| `middleware.ts` | Admin-autorisasjon er lukket blokker B-4 |
| `app/api/admin/*` | Med unntak av K-7a, som godkjennes separat |
| `prisma/schema.prisma` | Ingen datamodellendring i dette arbeidet |
| Alle brukervendte flater | Dette er ren admin |

**Ingen av de 14 invariantene berøres.** I-12 («brukeren ser ord, aldri tall») gjelder brukerflaten — admin skal se tall, det er hele poenget.

## 15. Sluttord

Et kommandopanel er ikke et dashbord. Et dashbord viser tall. Et kommandopanel forteller deg hva som skjer, hva det betyr, og hva du skal gjøre — og tier når det ikke er noe å gjøre.

De ti stegene her gjør tre ting: fjerner løgnene, åpner dørene, og gir hvert tall en stemme.

Når de er gjennomført kan Tosom styres fra én skjerm av én person på ti minutter i uken. Det er det beta trenger.

---

*Forrige dokument: `TOSOM-BETA-DRIFTSPLAN-v1.0.md` — hvor vi står og hvordan vi drifter.*
