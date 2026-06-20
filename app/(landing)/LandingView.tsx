"use client";

import { useRouter } from "next/navigation";
import Section from "@/components/ui/Section";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";

const { H1, H2, H3, BodyMd } = Typography;

export default function LandingView() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-ts-bg-primary text-ts-primary">
      {/* Hero Section — UI 4.2 */}
      <div className="section-spacing flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Subtle gold gradient bg */}
        <div className="absolute inset-0 calm-gradient-gold opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-ts-bg-primary/80 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-section space-y-2xl">
          <FadeIn>
            <div className="space-y-lg">
              {/* UI 4.2: display-xl + gold glow text */}
              <h1 className="ts-display-xl text-gold-glow-text">
                ToSom — en reise for to
              </h1>
              <BodyMd className="text-text-muted text-xl max-w-xl mx-auto leading-relaxed">
                En varm, moderne og guidet plattform for ekte relasjoner.
              </BodyMd>
              {/* UI 4.2: gold button + glow on hover */}
              <PremiumButton
                variant="primary"
                onClick={() => router.push("/login")}
                className="gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
              >
                Start reisen
              </PremiumButton>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Filosofi — UI 4.2: section spacing + ts-glass cards */}
      <Section className="space-y-2xl">
        <FadeIn>
          <div className="text-center space-y-lg">
            <h2 className="ts-font-heading-2xl text-text-primary">
              Filosofien bak ToSom
            </h2>
            <BodyMd className="text-text-muted max-w-xl mx-auto">
              En moderne, varm og rolig tilnærming til relasjoner.
            </BodyMd>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl">
          {/* Kort 1 — ts-glass + shadow-soft + gold-border on hover */}
          <FadeIn>
            <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg h-full transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              <div className="w-12 h-12 rounded-[var(--ts-radius-md)] bg-ts-gold-soft border-border-gold inline-flex items-center justify-center text-ts-gold font-semibold">
                ✦
              </div>
              <h3 className="ts-font-heading-l text-text-primary">Bygg din egen historie</h3>
              <BodyMd className="text-text-secondary leading-relaxed">
                Du lager en privat profil som viser hvem du er — ikke hvem du tror du må være.
              </BodyMd>
            </div>
          </FadeIn>
          {/* Kort 2 */}
          <FadeIn>
            <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg h-full transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              <div className="w-12 h-12 rounded-[var(--ts-radius-md)] bg-ts-gold-soft border-border-gold inline-flex items-center justify-center text-ts-gold font-semibold">
                ◈
              </div>
              <h3 className="ts-font-heading-l text-text-primary">Vi hjelper deg å vise hvem du er</h3>
              <BodyMd className="text-text-secondary leading-relaxed">
                Forskningbasert veiledning hjelper deg å lage en profil som gir ekte kompatibilitet.
              </BodyMd>
            </div>
          </FadeIn>
          {/* Kort 3 */}
          <FadeIn>
            <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg h-full transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              <div className="w-12 h-12 rounded-[var(--ts-radius-md)] bg-ts-gold-soft border-border-gold inline-flex items-center justify-center text-ts-gold font-semibold">
                ⊹
              </div>
              <h3 className="ts-font-heading-l text-text-primary">Når dere matcher, starter reisen</h3>
              <BodyMd className="text-text-secondary leading-relaxed">
                En varm, rolig og guidet reise som bygger nærhet, forståelse og trygghet.
              </BodyMd>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Hvordan det fungerer — UI 4.2: calm-gradient-blue bg, gold steps */}
      <Section className="space-y-2xl">
        <div className="text-center space-y-lg">
          <h2 className="ts-font-heading-2xl text-text-primary">
            Hvordan det fungerer
          </h2>
          <BodyMd className="text-text-muted max-w-xl mx-auto">
            En enkel, varm og guidet prosess – steg for steg.
          </BodyMd>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2xl">
          {/* Steg 1 */}
          <FadeIn>
            <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg text-center transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ts-gold-soft border-ts-gold/20 text-ts-gold font-bold text-lg">
                1
              </div>
              <h3 className="ts-font-heading-m text-text-primary">Logg inn</h3>
              <BodyMd className="text-text-secondary leading-relaxed">
                Opprett konto og kom i gang på få minutter.
              </BodyMd>
            </div>
          </FadeIn>
          {/* Steg 2 */}
          <FadeIn>
            <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg text-center transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ts-gold-soft border-ts-gold/20 text-ts-gold font-bold text-lg">
                2
              </div>
              <h3 className="ts-font-heading-m text-text-primary">Fyll ut profilen</h3>
              <BodyMd className="text-text-secondary leading-relaxed">
                Forskningbasert veiledning hjelper deg å lage en autentisk profil.
              </BodyMd>
            </div>
          </FadeIn>
          {/* Steg 3 */}
          <FadeIn>
            <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg text-center transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ts-gold-soft border-ts-gold/20 text-ts-gold font-bold text-lg">
                3
              </div>
              <h3 className="ts-font-heading-m text-text-primary">Få matches</h3>
              <BodyMd className="text-text-secondary leading-relaxed">
                Algoritmen din finner folk som matcher dine sanne behov.
              </BodyMd>
            </div>
          </FadeIn>
          {/* Steg 4 */}
          <FadeIn>
            <div className="ts-glass rounded-[var(--ts-radius-xl)] p-xl shadow-soft space-y-lg text-center transition-all duration-[var(--ts-transition-normal)] hover:border-ts-gold/20 hover:gold-glow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-ts-gold-soft border-ts-gold/20 text-ts-gold font-bold text-lg">
                4
              </div>
              <h3 className="ts-font-heading-m text-text-primary">Start reisen</h3>
              <BodyMd className="text-text-secondary leading-relaxed">
                En guidet, varm og rolig samtale starter — steg for steg.
              </BodyMd>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Under utvikling — UI 4.2: calm-gradient-violet bg */}
      <FadeIn>
        <div className="mx-section mb-2xl calm-gradient-violet rounded-[var(--ts-radius-3xl)] p-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-lg">
            <h2 className="ts-font-heading-2xl text-text-primary">
              Under utvikling
            </h2>
            <BodyMd className="text-text-secondary leading-relaxed">
              ToSom er under aktiv utvikling.
              Vi bygger en rolig, varm og moderne plattform for ekte relasjoner.
              Design, funksjoner og opplevelser forbedres fortløpende mens vi gjør oss klare for lansering.
            </BodyMd>
            <p className="text-text-muted text-sm">
              © 2026 ToSom. Alle rettigheter forbeholdt.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Footer */}
      <footer className="text-center text-text-muted text-sm py-2xl">
        <p>© 2026 ToSom — bygget for ekte relasjoner</p>
      </footer>
    </div>
  );
}
