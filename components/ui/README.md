# ToSom Premium UI Components

Komponentbibliotek for ToSom — Nordic Gold Design System v1.

---

## 📦 Komponenter

### Button
Primær, sekundær og ghost variant.

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="lg" href="/onboarding">
  Kom i gang
</Button>
```

**Props:**
- `variant`: `primary` | `secondary` | `ghost` (default: `primary`)
- `size`: `sm` | `md` | `lg` (default: `md`)
- `href`: optional, rander som `<a>` dersom satt
- `disabled`, `className`, etc.

---

### Card
Standard, glass og elevated variant.

```tsx
<Card variant="glass" padding="lg">
  Innhold
</Card>
```

**Props:**
- `variant`: `standard` | `glass` | `elevated`
- `padding`: `none` | `sm` | `md` | `lg` | `xl`

---

### Input / Textarea / Select
Glassmorphism input-felt med gull-highlight på fokus.

```tsx
<Input placeholder="Skriv her..." />
<Textarea placeholder="Lang tekst... />
<Select>
  <option>Valg 1</option>
</Select>
```

---

### Modal
Overlay-basert modal med backdrop-blur.

```tsx
<Modal open={isOpen} onClose={() => setIsOpen(false)} title="Tittel">
  Innhold
</Modal>
```

---

### Section
Wrapper med fade-in via IntersectionObserver.

```tsx
<Section centered fadeIn maxWidth="xl">
  Seksjon-innhold
</Section>
```

**Props:**
- `centered`: sentrert tekst (default: `true`)
- `fadeIn`: IntersectionObserver fade-in (default: `true`)
- `maxWidth`: `default` | `xl` | `full` (default: `default` = max-w-5xl)

---

### FeatureCard
Ikon + tittel + beskrivelse med staggered fade-in.

```tsx
<FeatureCard
  icon={<ShieldIcon />}
  title="Trygt"
  description="Beskrivelse"
  delay={100}
/>
```

---

### Footer
Enkel footer med lenker.

```tsx
<Footer brand="ToSom" year="2026" />
```

---

### Navbar
Glassmorphism sticky header med mobilmeny.

```tsx
<Navbar links={[
  { label: "Hjem", href: "/" },
  { label: "Logg inn", href: "/login" },
]} />
```

---

### Toast
Varsel med 4 typer: success, error, info, warning.

```tsx
<Toast message="Suksess!" type="success" duration={4000} />
```

---

### Skeleton / Shimmer
Lastetilstand-komponenter.

```tsx
<Skeleton rounded="md" />
<Shimmer animated />
```

---

### Avatar
Bilde eller initial-basert avatar med status-indikator.

```tsx
<Avatar src="/foto.jpg" fallback="A" size="lg" status="online" />
```

---

### Dialog
Bekreftelsesdialog basert på Modal.

```tsx
<Dialog
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="Er du sikker?"
  variant="danger"
/>
```

---

## 🎨 Design Tokens

Alle komponenter bruker CSS-variable definert i `styles/globals.css`:

| Token | Verdi |
|---|---|
| `--ts-gold` | `#D4AF37` |
| `--ts-bg-primary` | `#0A0F1F` |
| `--ts-text-primary` | `#F5F5F5` |
| `--ts-spacing-lg` | `24px` |
| `--ts-radius-md` | `12px` |

## 🚀 Bruk i Landing Page

```tsx
import { Navbar, Section, FeatureCard, Footer, Button } from "@/components/ui";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Section centered fadeIn>
        <h1>Velkommen</h1>
        <Button href="/onboarding">Kom i gang</Button>
      </Section>
      <Footer />
    </>
  );
}
```
