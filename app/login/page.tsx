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
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex items-center justify-center px-[var(--space-sm)]">
      <Section className="gap-[var(--space-xl)] py-[var(--space-xl)]">
        <FadeIn>
          <div className="max-w-md mx-auto gap-[var(--space-md)]">
            {/* Header */}
            <div className="text-center gap-[var(--space-sm)]">
              <BodySm className="text-[var(--color-gold)] uppercase tracking-[0.2em]">Velkommen tilbake</BodySm>
              <H1 className="text-[var(--color-text)]">Logg inn</H1>
              <BodyMd className="text-[var(--color-muted)]">
                Send en Magic Link til e-posten din
              </BodyMd>
            </div>

            {/* Login form */}
            <Card className="gap-[var(--space-md)] transition-all duration-200 ease-out hover:scale-[1.005]">
              <form onSubmit={handleSubmit} className="gap-[var(--space-md)]">
                <div>
                  <label htmlFor="email" className="mb-[var(--space-xs)] block text-xs uppercase tracking-wider text-[var(--color-gold)]">
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
                    className="w-full border-b border-[var(--color-gold)]/20 bg-[var(--color-card)] py-[var(--space-sm)] text-[var(--color-text)] placeholder-[var(--color-muted)]/50 outline-none transition-all duration-200 ease-out focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]/30"
                  />
                </div>

                {error && (
                  <BodySm className="text-red-400">{error}</BodySm>
                )}

                <PremiumButton
                  variant="primary"
                  className="w-full"
                  onClick={() => {}}
                >
                  {loading ? "Sender lenke…" : "Send innloggingslenke"}
                </PremiumButton>
              </form>

              {/* Sekundær knapp */}
              <div className="text-center">
                <BodyMd className="text-[var(--color-muted)]">
                  Har du ingen konto?{" "}
                  <span className="text-[var(--color-gold)] cursor-pointer hover:underline transition-colors duration-200 ease-out">
                    Opprett konto
                  </span>
                </BodyMd>
              </div>
            </Card>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
}
