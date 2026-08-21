# TOSOM — LANDING SIGNATUR v1.0

**Dato:** 2026-08-21
**Commit:** `0cd8007`
**Status:** GJENNOMFØRT. S-1 … S-10 alle gjennomført (S-10: død kode arkivert til `archive/`, `FadeIn` merket erstattet av `Reveal`).
**Kanonisk kilde:** `TOSOM-SUPER-MASTERPLAN-v1.0.md`
**Arbeidsmetode:** `ACT-PIPELINE-v1.0.md` — ett steg om gangen, patch-format, verifisering mellom hver.

> **Gjennomført 2026-08-21.** Runde 1–5 utført med verifisering mellom hver (tsc + jest 231/231 + build). Visuell verifisering i nettleser anbefales som siste steg (resonansfeltets styrke, parallakse-dybde, kort-stagger).

---

## 0. Problemet

Landingssiden er visuelt sterk. Glassmorphism sitter, gullet er riktig avstemt, typografien er rolig.

Men den kan leses som **en veldig god mal**, ikke som ToSom. Den mangler signatur-laget — det som gjør at en besøkende tenker «dette har noen laget med omhu», ikke «dette er pent».

Dokumentet inneholder ti steg (S-1 … S-10). Hvert steg har:

- hvilken fil som endres
- hvorfor
- komplett kodeforslag
- hvordan det verifiseres
- hva som **ikke** endres

---

# DEL I — DIAGNOSEN

## 1. Fem funn

### 🔴 AVVIK

| ID | Funn | Bevis |
|---|---|---|
| L-1 | **Ingen scroll-respons.** All animasjon kjører ved sidelast. Alt under folden er ferdiganimert før du kommer dit. | `page.tsx` bruker kun `animate-ts-fade-in`, `animate-riseIn`, `animate-pulse` |
| L-2 | **Én geometri overalt.** Samme glassboks gjentatt i hero, «Hvorfor Tosom» og alle fem kort. | `rounded-[28px]`, `rgba(255,255,255,0.045)`, `blur(16px)` — identisk fire steder |
| L-3 | **Generiske ikoner.** `IconMatch` er et standard Feather-hjerte. | `page.tsx:31-37` |
| L-4 | **Resonans er usynlig.** Produktets kjerne har ingen visuell representasjon. Bølgene er skrudd ned til intet. | `Hero.tsx:91` `opacity-[0.05]`, `Hero.tsx:110` `opacity-[0.03]` |
| L-5 | **Forbeholdet kommer før løftet.** Rundt seksti ord om beta og vilkår før logo og merkevareløfte. | `Hero.tsx:135-195` før `Hero.tsx:198` |

L-1 er den største enkeltårsaken til mal-følelsen. En premium-side puster med deg mens du blar. Vår står stille.

L-3 er verdt en egen merknad: et hjerte-ikon på en relasjonsplattform signaliserer «datingapp». Det er nøyaktig det Tosom ikke er (SUPER-MASTERPLAN §4.1).

## 2. Det som allerede finnes

### 🟢 IMPLEMENTERT
Infrastrukturen er på plass og ubrukt på landing:

| Ressurs | Sted | Status |
|---|---|---|
| Motion-tokens | `globals.css:875-895` — varigheter, seks easing-kurver, stagger | Ubrukt på landing |
| Animasjonsklasser | `tailwind.config.js:225-255` — `ts-breathe`, `ts-shimmer`, `ts-pulse` | Ubrukt på landing |
| `prefers-reduced-motion` | `globals.css:932` og `:1283` | Globalt håndtert (duplisert) |
| framer-motion 12.42.0 | `package.json` | Installert, 3 filer i hele repoet |

Vi trenger nesten ikke bygge nytt. Vi trenger å **ta i bruk** det som ligger der, og legge til én ting: et motiv.

## 3. Teknisk gjeld funnet underveis

| ID | Gjeld |
|---|---|
| G-L1 | `components/atmosphere/` — helt død, null importer |
| G-L2 | `components/launch/` — helt død, null importer |
| G-L3 | Tre konkurrerende `FadeIn`-implementasjoner |
| G-L4 | Tre konkurrerende `GlassPanel`/`GlassCard` |
| G-L5 | `styles/theme.css` importeres ingen steder, men definerer konkurrerende `--ts-*` med andre verdier |
| G-L6 | `prefers-reduced-motion` duplisert i `globals.css` |

Ryddes i S-10, ikke blandet inn i signatur-arbeidet.

---

# DEL II — SIGNATUREN

## 4. Resonans-motivet

### 🔵 KONSEPT

**To sirkler som overlapper.**

ToSom betyr to sammen. To sirkler som glir mot hverandre danner en mandelform i snittet — vesica piscis. Det er geometrien til to som møtes, og den eldste symbolformen vi har for nettopp det.

I snittflaten ligger gullet. Der de to møtes.

### Bruk

| Sted | Hvordan |
|---|---|
| Hero | To enorme, nesten usynlige sirkler som driver langsomt mot hverandre |
| Seksjonsskille | Motivet i miniatyr, ikke en strek |
| Ikoner | Alle bygget på sirkelgrunnform |
| Punktmarkør | Liten dobbeltsirkel |
| Kort-hover | Svak gullglød i snittpunktet |

Én form, brukt konsekvent. Det er slik en merkevare oppstår.

### Hva motivet ikke er

Ikke et hjerte. Ikke to mennesker som holder hender. Ikke en ring. Alt dette er datingapp-språk. Motivet skal være geometrisk, rolig og voksent — mer nordisk arkitektur enn romantikk.

## 5. Pusten — ToSoms calm-motion

### 🔵 KONSEPT

**Alt som beveger seg gjør det i 6 sekunders syklus.**

Det er hvilepuls hos et voksent menneske. Gløden puster, CTA-en puster, sirklene driver — alt i samme takt. Underbevisst leser kroppen dette som ro.

Konkurrentene animerer i 300 ms fordi de vil ha oppmerksomhet. Vi animerer i 6 sekunder fordi vi vil ha ro.

Det er en holdning, ikke en effekt.

### Reglene

| # | Regel |
|---|---|
| M-1 | **Puls = 6s.** All ambient bevegelse deler denne syklusen eller et multiplum. |
| M-2 | **Reveal beveger 6 %.** Aldri mer. Innhold glir på plass, det spretter ikke. |
| M-3 | **Ease-out cubic** på alt som kommer inn: `cubic-bezier(0.16, 1, 0.3, 1)`. |
| M-4 | **Stagger 80 ms.** Gjenbruker `--ts-motion-stagger-normal`. |
| M-5 | **Kun `transform` og `opacity`.** Aldri layout-egenskaper. |
| M-6 | **Reduced motion = statisk.** Ro betyr også stillhet for den som trenger det. |

## 6. Tre tekniske valg

### Ikke framer-motion på landing
Det ligger installert, men koster ~34 kB på siden som avgjør førsteinntrykket. IntersectionObserver + CSS gir identisk resultat for ~1 kB. **Premium betyr også at siden åpner umiddelbart.**

### Alt på GPU
`transform` og `opacity` utelukkende. Parallakse og markørlys skriver til CSS-variabler i `requestAnimationFrame`, aldri til React-state. Ingen re-render, ingen layout-thrash.

### Reduced motion respekteres
Allerede globalt håndtert. Signatur-laget faller tilbake til statisk uten at noe ser ødelagt ut.

---

# DEL III — STEGENE

## S-1 — `useReveal`

**Fil:** `hooks/useReveal.ts` (ny)
**Lukker:** L-1 (grunnlag)

### Hvorfor
Scroll-respons uten bibliotek. IntersectionObserver er innebygd i alle støttede nettlesere.

### Kode

```ts
'use client';

/**
 * Tosom — useReveal
 *
 * Scroll-utløst synlighet via IntersectionObserver.
 * Utløses én gang, deretter kobles observatøren fra.
 */

import { useEffect, useRef, useState } from 'react';

interface UseRevealOptions {
  /** Andel av elementet som må være synlig. 0–1. */
  threshold?: number;
  /** Marg rundt viewport. Negativ bunn utløser før elementet er helt inne. */
  rootMargin?: string;
  /** Utløs kun første gang. */
  once?: boolean;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Uten IntersectionObserver: vis alt umiddelbart.
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

export default useReveal;
```

### Verifisering
```bash
npx tsc --noEmit
```

---

## S-2 — `<Reveal>`

**Fil:** `components/motion/Reveal.tsx` (ny)
**Lukker:** L-1
**Avhenger av:** S-1

### Hvorfor
Innpakningen som gir hele siden pust. 6 % bevegelse, ease-out cubic, valgfri forsinkelse for stagger.

### Kode

```tsx
'use client';

/**
 * Tosom — Reveal
 *
 * Scroll-utløst innglidning. Følger calm-motion:
 * kort avstand, lang varighet, ease-out cubic.
 *
 * Respekterer prefers-reduced-motion via globals.css.
 */

import { ReactNode, CSSProperties } from 'react';
import { useReveal } from '@/hooks/useReveal';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: ReactNode;
  /** Retning innholdet glir fra. */
  direction?: Direction;
  /** Forsinkelse i ms — brukes til stagger. */
  delay?: number;
  /** Varighet i ms. Standard følger calm-motion. */
  duration?: number;
  /** Avstand i piksler. Hold den kort. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
}

const OFFSET: Record<Direction, (d: number) => string> = {
  up: (d) => `translate3d(0, ${d}px, 0)`,
  down: (d) => `translate3d(0, -${d}px, 0)`,
  left: (d) => `translate3d(${d}px, 0, 0)`,
  right: (d) => `translate3d(-${d}px, 0, 0)`,
  none: () => 'translate3d(0, 0, 0)',
};

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 900,
  distance = 18,
  className = '',
  style,
}: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : OFFSET[direction](distance),
        transition: `opacity ${duration}ms var(--ts-ease-resonance) ${delay}ms, transform ${duration}ms var(--ts-ease-resonance) ${delay}ms`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Stagger-hjelper: gir hvert barn økende forsinkelse. */
export function RevealGroup({
  children,
  stagger = 80,
  ...props
}: Omit<RevealProps, 'children' | 'delay'> & {
  children: ReactNode[];
  stagger?: number;
}) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} delay={i * stagger} {...props}>
          {child}
        </Reveal>
      ))}
    </>
  );
}

export default Reveal;
```

### Verifisering
```bash
npx tsc --noEmit
```

---

## S-3 — Signatur-tokens

**Fil:** `styles/globals.css`
**Lukker:** grunnlag for S-4 … S-9

### Hvorfor
Pusten og resonans-easingen må være tokens, ikke tall spredt utover i komponentene.

### Patch

Legges til i `:root`-blokken, etter `--ts-motion-stagger-slow` (rundt linje 895):

```css
  /* ── ToSom signatur-motion ──
     Pusten: 6 s er hvilepuls hos et voksent menneske.
     All ambient bevegelse deler denne syklusen. */
  --ts-breath: 6s;
  --ts-breath-slow: 12s;
  --ts-drift: 24s;

  /* Resonans-easing — lang utgang, ingen overskyting */
  --ts-ease-resonance: cubic-bezier(0.16, 1, 0.3, 1);

  /* Signatur-glød */
  --ts-glow-resonance: radial-gradient(
    circle at center,
    rgba(212, 175, 55, 0.055),
    transparent 68%
  );
```

Og nye keyframes, plassert etter `@keyframes ts-pulse` (slutten av filen):

```css
/* ═══════════════════════════════════════════
   ToSom signatur — pust og drift
   ═══════════════════════════════════════════ */

/* Pusten: knapt synlig skala og lysendring */
@keyframes ts-breath {
  0%, 100% { transform: scale(1);      opacity: 0.85; }
  50%      { transform: scale(1.018);  opacity: 1;    }
}

/* Resonans: to sirkler som driver mot hverandre og tilbake */
@keyframes ts-resonance-left {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(2.2%, -1.1%, 0); }
}

@keyframes ts-resonance-right {
  0%, 100% { transform: translate3d(0, 0, 0); }
  50%      { transform: translate3d(-2.2%, 1.1%, 0); }
}

.ts-breath {
  animation: ts-breath var(--ts-breath) ease-in-out infinite;
}
```

### Verifisering
```bash
npm run build
```

### Endres ikke
Eksisterende `--ts-motion-*` røres ikke. De nye tokenene supplerer, de erstatter ikke.

---

## S-4 — `<ResonanceField>`

**Fil:** `components/brand/ResonanceField.tsx` (ny)
**Lukker:** L-4
**Avhenger av:** S-3

### Hvorfor
Motivet som ambient lag i hero. To store sirkler som driver mot hverandre i 24-sekunders takt, med gull i snittflaten. Nesten usynlig — men kroppen registrerer at noe lever.

### Kode

```tsx
'use client';

/**
 * Tosom — ResonanceField
 *
 * Signaturmotivet: to sirkler som møtes.
 * I snittflaten ligger gullet.
 *
 * Ambient lag. Skal knapt merkes — men det lever.
 */

import { CSSProperties } from 'react';

interface ResonanceFieldProps {
  /** Styrke 0–1. Standard er bevisst lav. */
  intensity?: number;
  className?: string;
  style?: CSSProperties;
}

export function ResonanceField({
  intensity = 1,
  className = '',
  style,
}: ResonanceFieldProps) {
  const blue = 0.030 * intensity;
  const gold = 0.042 * intensity;

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={style}
    >
      {/* Venstre sirkel — driver mot høyre */}
      <div
        className="absolute rounded-full"
        style={{
          width: '58vw',
          height: '58vw',
          maxWidth: '820px',
          maxHeight: '820px',
          left: '4%',
          top: '10%',
          background: `radial-gradient(circle at center, rgba(80,120,255,${blue}), transparent 66%)`,
          animation: 'ts-resonance-left var(--ts-drift) ease-in-out infinite',
        }}
      />

      {/* Høyre sirkel — driver mot venstre */}
      <div
        className="absolute rounded-full"
        style={{
          width: '58vw',
          height: '58vw',
          maxWidth: '820px',
          maxHeight: '820px',
          right: '4%',
          top: '10%',
          background: `radial-gradient(circle at center, rgba(80,120,255,${blue}), transparent 66%)`,
          animation: 'ts-resonance-right var(--ts-drift) ease-in-out infinite',
        }}
      />

      {/* Snittflaten — der de møtes ligger gullet */}
      <div
        className="absolute left-1/2 -translate-x-1/2 ts-breath"
        style={{
          width: '34vw',
          height: '44vw',
          maxWidth: '460px',
          maxHeight: '580px',
          top: '14%',
          background: `radial-gradient(ellipse at center, rgba(212,175,55,${gold}), transparent 64%)`,
          filter: 'blur(48px)',
        }}
      />
    </div>
  );
}

export default ResonanceField;
```

### Verifisering
```bash
npx tsc --noEmit
```
Deretter visuelt: effekten skal være så vidt merkbar. Er den tydelig, senk `intensity`.

---

## S-5 — Hero snus

**Fil:** `components/ui/layout/Hero.tsx`
**Lukker:** L-5
**Godkjent av George:** ja — merkevaren først, forbeholdet etterpå

### Hvorfor
I dag leser besøkende rundt seksti ord om beta, testing og vilkår **før** de møter logoen og løftet. Ingenting dreper eksklusivitet raskere enn å åpne med en unnskyldning.

### Ny rekkefølge

| # | Element | Endring |
|---|---|---|
| 1 | Logo (`LogoAnimated`) | Flyttes til topp |
| 2 | H1 «Ro. Trygghet. Mening.» | Uendret innhold |
| 3 | Undertekst | Uendret innhold |
| 4 | Beta-notis | Flyttes ned, kortes til én setning |

### Beta-notisen etter innkorting

Fra tre avsnitt til dette:

```tsx
{/* Beta-notis — under løftet, rolig og kort */}
<div className="mt-14 flex justify-center">
  <div
    className="inline-flex items-center gap-3 rounded-full px-5 py-2.5"
    style={{
      border: '1px solid rgba(212,175,55,0.18)',
      background: 'rgba(212,175,55,0.04)',
    }}
  >
    <span className="w-[6px] h-[6px] rounded-full bg-[#D4AF37] ts-breath" />
    <span
      className="text-[13px]"
      style={{ color: 'rgba(255,255,255,0.58)', letterSpacing: '0.15px' }}
    >
      Tosom er i lukket beta.{' '}
      <Link
        href="/slik-fungerer-det"
        className="underline underline-offset-4 transition-colors hover:text-white/80"
        style={{ color: 'rgba(255,255,255,0.72)', textDecorationColor: 'rgba(212,175,55,0.4)' }}
      >
        Les mer
      </Link>
    </span>
  </div>
</div>
```

Merk: `animate-pulse` byttes til `ts-breath`. Tailwinds `animate-pulse` er 2 s og urolig; vår puster i 6.

De tre avsnittene om finjustering, vilkår og takk flyttes til `/slik-fungerer-det`. De er gode — de hører bare ikke hjemme som det første et menneske leser.

### Bølgene løftes

`opacity-[0.05]` og `opacity-[0.03]` er praktisk talt usynlig. Vi har en signatur og har skrudd den til null.

```diff
-      <div className="absolute bottom-[-40px] left-0 w-[140%] opacity-[0.05] pointer-events-none z-[1]">
+      <div className="absolute bottom-[-40px] left-0 w-[140%] opacity-[0.11] pointer-events-none z-[1]">
```

```diff
-        className="absolute bottom-[-20px] left-0 w-[150%] opacity-[0.03] pointer-events-none z-[1]"
+        className="absolute bottom-[-20px] left-0 w-[150%] opacity-[0.07] pointer-events-none z-[1]"
```

### ResonanceField settes inn

Etter vignetten, før de eksisterende glødene:

```tsx
<ResonanceField intensity={1} />
```

De to eksisterende ambient-glødene (blå på `Hero.tsx:75-80`, gull på `:83-88`) **fjernes** — `ResonanceField` erstatter dem. Ellers blir det for mye lys.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

---

## S-6 — Parallakse

**Fil:** `components/ui/layout/Hero.tsx`
**Lukker:** L-1 (hero-delen)
**Avhenger av:** S-5

### Hvorfor
Dybde. Bølgene beveger seg langsommere enn innholdet når du blar — nok til at øyet oppfatter lagdeling, ikke nok til å merkes bevisst.

### Kode

```tsx
/** Parallakse via CSS-variabel. Ingen React-state, ingen re-render. */
function useParallax(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respekter reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, -rect.top / window.innerHeight));
      el.style.setProperty('--ts-parallax', String(progress));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref]);
}
```

Bølgelagene bruker variabelen:

```tsx
style={{
  transform: 'translate3d(0, calc(var(--ts-parallax, 0) * 42px), 0)',
}}
```

Gull-glødet i `ResonanceField` kan få `* -24px` for motsatt drift. Det gir lagdelingen troverdighet.

### Verifisering
```bash
npx tsc --noEmit
```
Deretter: bla sakte i hero. Bevegelsen skal føles som dybde, ikke som at noe glir.

---

## S-7 — CTA som puster

**Fil:** `components/ui/system/ToSomButton.tsx`
**Lukker:** L-1 (CTA-delen)

### Hvorfor
Hovedknappen er sidens viktigste element. I dag er den helt statisk med `transition: all 250ms ease-out`. En knapp som puster trekker blikket uten å mase.

Kun `variant="gold"`. De andre skal være rolige.

### Patch

`gold`-varianten får en glød som puster i takt med resten:

```diff
   gold: {
     ...baseStyles,
     background: 'linear-gradient(90deg, #D4AF37, #E8C766)',
     color: '#0B1520',
-    boxShadow: '0 0 40px rgba(212,175,55,0.30)',
     letterSpacing: '0.02em',
+    animation: 'ts-cta-breath var(--ts-breath) ease-in-out infinite',
   },
```

Ny keyframe i `globals.css`:

```css
/* CTA-pust — gløden alene, aldri geometrien */
@keyframes ts-cta-breath {
  0%, 100% { box-shadow: 0 0 34px rgba(212,175,55,0.24); }
  50%      { box-shadow: 0 0 52px rgba(212,175,55,0.38); }
}
```

Merk: **kun `box-shadow` animeres, ikke `transform`.** En knapp som endrer størrelse er urolig og gir dårligere klikkpresisjon.

### Hover skjerpes

```diff
-  transition: 'all 250ms ease-out',
+  transition: 'transform 400ms var(--ts-ease-resonance), box-shadow 400ms var(--ts-ease-resonance), background 400ms var(--ts-ease-resonance)',
```

`all` er dyrt og upresist. Eksplisitte egenskaper med resonans-easing gir lav friksjon.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
```

### Endres ikke
Størrelser, radius, farger, øvrige varianter.

---

## S-8 — Ikonene bygges på nytt

**Fil:** `app/(landing)/page.tsx`
**Lukker:** L-3

### Hvorfor
`IconMatch` er et Feather-hjerte. På en relasjonsplattform som uttrykkelig **ikke** er en datingapp, er det feil signal (SUPER-MASTERPLAN §4.1: «Hvis en feature minner om dette → den er feil»).

Alle fem ikoner bygges på sirkelgrunnformen, slik at de tilhører samme familie som resonans-motivet.

### Kode

```tsx
/* ========================
   Ikoner — bygget på resonans-motivet
   Alle 24×24, stroke 1.5, currentColor.
   ======================== */

/** Velvære — sirkel med rolig indre bue */
function IconWellbeing() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M7.5 13.5c1.8-2.4 3.2-2.4 4.5 0s2.7 2.4 4.5 0" />
    </svg>
  );
}

/** Privat profil — sirkel med skjermet indre */
function IconPrivacy() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2.6M12 18.4V21M3 12h2.6M18.4 12H21" />
    </svg>
  );
}

/** Én match — signaturmotivet: to sirkler som møtes */
function IconMatch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </svg>
  );
}

/** Forskningsbasert — sirkel med målpunkt */
function IconResearch() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Dybde — konsentriske buer, nedover */
function IconDepth() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M5.4 9.6h13.2M6.9 13.2h10.2M9 16.8h6" />
    </svg>
  );
}
```

`IconMatch` er nå selve signaturen i miniatyr. Den står i kortet som forklarer «Én match i uken» — motivet og budskapet er det samme.

### Verifisering
```bash
npx tsc --noEmit
```

---

## S-9 — Rytme i seksjonene

**Fil:** `app/(landing)/page.tsx`
**Lukker:** L-1, L-2
**Avhenger av:** S-2

### Hvorfor
Fem identiske kort i et jevnt rutenett leses som en mal. Vi gir siden pust og variasjon — uten å bryte roen.

### a) Reveal på alle seksjoner

```tsx
import { Reveal } from '@/components/motion/Reveal';
```

«Hvorfor Tosom»-blokken:

```tsx
<Reveal direction="up" duration={1000}>
  <div className="mx-auto max-w-[780px] rounded-[28px] p-10 md:p-14 space-y-6" style={{ /* uendret */ }}>
    …
  </div>
</Reveal>
```

Overskrift og ingress i «Slik fungerer det» får `delay={0}` og `delay={120}`.

### b) Kortene med stagger

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {steps.map((step, idx) => (
    <Reveal key={idx} direction="up" delay={idx * 80} duration={900}>
      <GlassCard padding="xl" gold interactive className="space-y-4 h-full">
        {/* uendret innhold */}
      </GlassCard>
    </Reveal>
  ))}
</div>
```

`h-full` legges til så kortene beholder lik høyde i rutenettet.

### c) Fremhevet kort

«Én match i uken» er produktets kjerne. Det skal ikke se ut som de fire andre.

```tsx
const steps = [
  { icon: <IconWellbeing />, title: 'Velvære først', content: '…' },
  { icon: <IconPrivacy />,   title: 'Privat profil',  content: '…' },
  { icon: <IconMatch />,     title: 'Én match i uken', content: '…', featured: true },
  { icon: <IconResearch />,  title: 'Forskningsbasert matching', content: '…' },
  { icon: <IconDepth />,     title: 'Bygget for dybde', content: '…' },
];
```

Det fremhevede kortet får `glow`, litt sterkere gullkant og — på store skjermer — dobbel bredde:

```tsx
<GlassCard
  padding="xl"
  gold
  glow={step.featured}
  interactive
  className={`space-y-4 h-full ${step.featured ? 'lg:col-span-2' : ''}`}
>
```

Rutenettet får da en naturlig asymmetri: 2 + 1 bredt + 2. Det bryter mal-følelsen uten å bli urolig.

### d) Seksjonsskille med motivet

Erstatter avstand alene mellom hoveddelene:

```tsx
/** Resonans-skille — motivet i miniatyr */
function ResonanceDivider() {
  return (
    <div className="flex justify-center py-2" aria-hidden="true">
      <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
        <circle cx="16" cy="10" r="7" stroke="rgba(212,175,55,0.28)" strokeWidth="1" />
        <circle cx="28" cy="10" r="7" stroke="rgba(212,175,55,0.28)" strokeWidth="1" />
      </svg>
    </div>
  );
}
```

Plasseres mellom «Hvorfor Tosom» og «Slik fungerer det», og mellom pris og CTA.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
npm run build
```

---

## S-10 — Rydding

**Filer:** flere
**Lukker:** G-L1 … G-L6
**Tas sist**, når signatur-laget er verifisert.
**Status:** ✅ GJENNOMFØRT (arkivert til `archive/` + `tsconfig.exclude`).

### Poster

| # | Handling | Begrunnelse |
|---|---|---|
| 1 | Fjern `components/atmosphere/` | Null importer i repoet |
| 2 | Fjern `components/launch/` | Null importer i repoet |
| 3 | Fjern `styles/theme.css` | Importeres ingen steder, konkurrerende `--ts-*`-verdier |
| 4 | Slå sammen duplisert `prefers-reduced-motion` i `globals.css` | Står to ganger (`:932` og `:1283`) |
| 5 | Marker `components/animations/FadeIn.tsx` som erstattet av `Reveal` | Tre konkurrerende implementasjoner |
| 6 | Noter `GlassCard`/`GlassPanel`-duplisering | Egen oppgave, ikke i denne runden |

### Merk
Per dokumentasjonsregel 4 slettes ingenting uten godkjenning. Filene flyttes til `docs/archive/`-tilsvarende eller fjernes først etter at du har sagt ja, post for post.

### Verifisering
```bash
npx tsc --noEmit
npx jest --ci --silent
npm run build
```

---

# DEL IV — GJENNOMFØRING

## 7. Rekkefølge

Grunnlag først, så motivet, så rytmen.

| Runde | Steg | Hva oppnås |
|---|---|---|
| **1 — Grunnlag** | S-1, S-2, S-3 | Scroll-respons og signatur-tokens finnes |
| **2 — Motivet** | S-4, S-5 | Resonansfeltet lever, hero åpner med løftet |
| **3 — Dybde** | S-6, S-7 | Parallakse og pustende CTA |
| **4 — Rytme** | S-8, S-9 | Ikoner og seksjoner får ToSom-DNA |
| **5 — Rydding** | S-10 | Død kode ute |

Runde 1 og 2 gir mesteparten av effekten. Blir det bare de to, er siden allerede vesentlig mer ToSom.

## 8. Verifisering per steg

Etter **hver** patch:

```bash
npx tsc --noEmit
npx jest --ci --silent
```

Etter S-5, S-6 og S-9 også:

```bash
npm run build
```

Og manuelt i nettleser:
- Bla gjennom hele siden — alt skal gli inn, ingenting skal hoppe
- Slå på reduced motion i OS — siden skal være rolig og statisk, ikke ødelagt
- Mobil (360 px) — `ResonanceField` bruker `vw`, sjekk at den ikke flyter over

## 9. Hva som ikke endres

| Område | Hvorfor |
|---|---|
| All tekst utenom beta-notisen | Språket er gjennomarbeidet og følger språkmanualen |
| Fargepaletten | ToSom Blue + Nordic Gold er kanonisk |
| `GlassCard`, `ToSomSection` | Gjenbrukes som de er |
| Pris, CTA-mål, lenker | Ingen produktendring |
| Alle andre sider enn landing | Avgrenset arbeid |

**Ingen av de 14 invariantene berøres.** Ingen feed, ingen swipe, ingen gamification. Motivet er geometrisk og rolig — det motsatte av datingapp-språk.

## 10. Sluttord

Forskjellen mellom en god mal og en signatur er ikke mengden effekter. Det er om valgene henger sammen.

To sirkler som møtes. Seks sekunders pust. Ett gull i snittflaten. Gjentatt overalt, aldri forklart.

Da tenker ikke besøkende «for en fin side». Da tenker de ingenting — de bare puster litt roligere. Det er da vi har lykkes.

---

*Følgedokumenter: `TOSOM-BETA-DRIFTSPLAN-v1.0.md`, `ADMIN-KOMMANDOPANEL-v1.0.md`*
