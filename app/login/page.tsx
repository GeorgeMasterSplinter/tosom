"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Section from "@/components/ui/Section";
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
      setError("Skriv inn ein gyldig e-postadresse.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signIn("email", { email, callbackUrl: "/" });
    } catch {
      setError("Kunne ikkje sende innloggingslenke. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <Section className="space-y-16 py-12">
        <FadeIn>
          <div className="max-w-md mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <BodySm className="text-gold uppercase tracking-[0.3em]">Velkommen tilbake</BodySm>
              <H1 className="text-white">Logg inn</H1>
              <BodyMd className="text-gray-400">
                Send ei Magic Link til e-posten din
              </BodyMd>
            </div>

            {/* GlassPanel: Login-form */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-md shadow-black/20 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wider text-gray-500">
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
                    className="w-full border-b border-white/10 bg-transparent py-3 text-white placeholder-gray-600 outline-none transition focus:border-gold/50"
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
                <BodyMd className="text-gray-500">
                  Har du ingen konto?{" "}
                  <span className="text-gold cursor-pointer hover:underline">
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
