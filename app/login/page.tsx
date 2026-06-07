"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

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
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Velkommen tilbake</p>
          <h1 className="mt-3 text-2xl font-light text-stone-800">Logg inn</h1>
          <p className="mt-2 text-sm text-stone-500">
            Send ei Magic Link til e-posten din
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wider text-stone-500">
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
              className="w-full border-b border-stone-300 bg-transparent py-3 text-stone-800 placeholder-stone-400 outline-none transition focus:border-stone-800"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-stone-800 py-3 text-sm uppercase tracking-wider text-white transition hover:bg-stone-700 disabled:opacity-50"
          >
            {loading ? "Sender lenke…" : "Send innloggingslenke"}
          </button>
        </form>
      </div>
    </div>
  );
}
