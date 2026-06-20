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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Section className="space-y-16">
        {/* Hero */}
        <div className="text-center space-y-6 py-24 md:py-32">
          <FadeIn>
            <div className="space-y-6">
              <H1>ToSom — en reise for to</H1>
              <BodyMd className="text-[var(--color-muted)] text-lg max-w-xl mx-auto">
                En varm, moderne og guidet plattform for ekte relasjoner.
              </BodyMd>
              <PremiumButton variant="primary" onClick={() => router.push("/login")}>
                Start reisen
              </PremiumButton>
            </div>
          </FadeIn>
        </div>

        {/* Filosofi */}
        <FadeIn>
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <H2>Filosofien bak ToSom</H2>
              <BodyMd className="text-[var(--color-muted)] max-w-xl mx-auto">
                En moderne, varm og rolig tilnærming til relasjoner.
              </BodyMd>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kort 1 */}
              <FadeIn>
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 h-full transition-all duration-300 ease-out hover:scale-[1.02]">
                  <H3>Bygg din egen historie</H3>
                  <BodyMd className="text-[var(--color-text)] leading-relaxed">
                    Du lager en privat profil som viser hvem du er — ikke hvem du tror du må være.
                  </BodyMd>
                </div>
              </FadeIn>
              {/* Kort 2 */}
              <FadeIn>
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 h-full transition-all duration-300 ease-out hover:scale-[1.02]">
                  <H3>Vi hjelper deg å vise hvem du er</H3>
                  <BodyMd className="text-[var(--color-text)] leading-relaxed">
                    Forskningbasert veiledning hjelper deg å lage en profil som gir ekte kompatibilitet.
                  </BodyMd>
                </div>
              </FadeIn>
              {/* Kort 3 */}
              <FadeIn>
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 h-full transition-all duration-300 ease-out hover:scale-[1.02]">
                  <H3>Når dere matcher, starter reisen</H3>
                  <BodyMd className="text-[var(--color-text)] leading-relaxed">
                    En varm, rolig og guidet reise som bygger nærhet, forståelse og trygghet.
                  </BodyMd>
                </div>
              </FadeIn>
            </div>
          </div>
        </FadeIn>

        {/* Hvordan det fungerer */}
        <FadeIn>
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <H2>Hvordan det fungerer</H2>
              <BodyMd className="text-[var(--color-muted)] max-w-xl mx-auto">
                En enkel, varm og guidet prosess – steg for steg.
              </BodyMd>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Steg 1 */}
              <FadeIn>
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 h-full text-center transition-all duration-300 ease-out hover:scale-[1.02]">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 text-[var(--color-gold)] font-bold text-lg">1</div>
                  <H3>Logg inn</H3>
                  <BodyMd className="text-[var(--color-text)] leading-relaxed">
                    Opprett konto og kom i gang på få minutter.
                  </BodyMd>
                </div>
              </FadeIn>
              {/* Steg 2 */}
              <FadeIn>
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 h-full text-center transition-all duration-300 ease-out hover:scale-[1.02]">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 text-[var(--color-gold)] font-bold text-lg">2</div>
                  <H3>Fyll ut profilen</H3>
                  <BodyMd className="text-[var(--color-text)] leading-relaxed">
                    Forskningbasert veiledning hjelper deg å lage en autentisk profil.
                  </BodyMd>
                </div>
              </FadeIn>
              {/* Steg 3 */}
              <FadeIn>
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 h-full text-center transition-all duration-300 ease-out hover:scale-[1.02]">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 text-[var(--color-gold)] font-bold text-lg">3</div>
                  <H3>Få matches</H3>
                  <BodyMd className="text-[var(--color-text)] leading-relaxed">
                    Algoritmen din finner folk som matcher dine sanne behov.
                  </BodyMd>
                </div>
              </FadeIn>
              {/* Steg 4 */}
              <FadeIn>
                <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4 h-full text-center transition-all duration-300 ease-out hover:scale-[1.02]">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-gold)]/20 border border-[var(--color-gold)]/30 text-[var(--color-gold)] font-bold text-lg">4</div>
                  <H3>Start reisen</H3>
                  <BodyMd className="text-[var(--color-text)] leading-relaxed">
                    En guidet, varm og rolig samtale starter — steg for steg.
                  </BodyMd>
                </div>
              </FadeIn>
            </div>
          </div>
        </FadeIn>

        {/* Under utvikling */}
        <FadeIn>
          <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-4">
            <H2>Under utvikling</H2>
            <BodyMd className="text-[var(--color-text)] leading-relaxed">
              ToSom er under aktiv utvikling.
              Vi bygger en rolig, varm og moderne plattform for ekte relasjoner.
              Design, funksjoner og opplevelser forbedres fortløpende mens vi gjør oss klare for lansering.
            </BodyMd>
            <p className="text-[var(--color-muted)] text-sm">
              © 2026 ToSom. Alle rettigheter forbeholdt.
            </p>
          </div>
        </FadeIn>

        {/* Footer */}
        <p className="text-center text-[var(--color-muted)] text-sm py-10">
          © 2026 ToSom — bygget for ekte relasjoner
        </p>
      </Section>
    </div>
  );
}
