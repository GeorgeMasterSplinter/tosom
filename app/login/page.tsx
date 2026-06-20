"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Typography from "@/components/ui/Typography";
import FadeIn from "@/components/ui/FadeIn";
import PremiumButton from "@/components/ui/PremiumButton";

const { H1, BodyMd, BodySm } = Typography;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Skriv inn en gyldig e-postadresse.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signIn("email", { email, callbackUrl: "/" });
    } catch {
      setError("Kunne ikke sende innloggingslenke. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ts-bg-primary text-ts-primary flex items-center justify-center px-section relative overflow-hidden">
      {/* UI 4.2: Subtle calm-gradient-gold bg */}
      <div className="absolute inset-0 calm-gradient-gold opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-ts-bg-primary/70 pointer-events-none" />

      <Section className="gap-2xl py-6xl relative z-10">
        <FadeIn>
          <div className="max-w-md mx-auto space-y-2xl">
            {/* Header — UI 4.2: gold glow text, display-m */}
            <div className="text-center space-y-lg">
              <BodySm className="text-ts-gold uppercase tracking-[0.25em] font-semibold">
                Velkommen tilbake
              </BodySm>
              <h1 className="ts-display-m text-gold-glow-text font-semibold">
                Logg inn
              </h1>
              <BodyMd className="text-text-muted">
                Send en Magic Link til e-posten din
              </BodyMd>
            </div>

            {/* Login form — UI 4.2: ts-glass-strong + gold border on hover */}
            <div className="ts-glass-strong rounded-[var(--ts-radius-2xl)] p-xl shadow-lg space-y-lg relative overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-lg relative z-10">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-sm block text-xs uppercase tracking-widest text-ts-gold font-semibold"
                  >
                    E-post
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="du@eksempel.no"
                    className="w-full bg-transparent border-b border-ts-gold/20 py-md text-ts-primary placeholder-text-subtle outline-none transition-all duration-[var(--ts-transition-normal)] focus:border-ts-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2)]"
                  />
                </div>

                {error && (
                  <BodySm className="text-ts-error">{error}</BodySm>
                )}

                <PremiumButton
                  variant="primary"
                  className="w-full gold-glow-md hover:gold-glow-lg transition-all duration-[var(--ts-transition-normal)]"
                  onClick={() => {}}
                >
                  {loading ? "Sender lenke…" : "Send innloggingslenke"}
                </PremiumButton>
              </form>

              {/* Sekundær knapp */}
              <div className="text-center relative z-10">
                <BodyMd className="text-text-muted">
                  Har du ingen konto?{" "}
                  <span
                    className="text-ts-gold cursor-pointer hover:text-ts-gold-light transition-colors duration-[var(--ts-transition-fast)] underline"
                  >
                    Opprett konto
                  </span>
                </BodyMd>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
