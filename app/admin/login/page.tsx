"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Ugyldig brukernavn eller passord.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-md p-[var(--space-xl)] bg-[var(--color-card)] border border-[var(--color-card-border)] rounded-xl flex flex-col gap-[var(--space-lg)]">
        <h1 className="text-3xl font-semibold text-[var(--color-text)] tracking-tight">
          Innlogging
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-md)]">
          <div className="flex flex-col gap-[var(--space-xs)]">
            <label className="text-sm text-[var(--color-muted)]">Brukernavn</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-card-border)] text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-gold)]"
              required
            />
          </div>
          <div className="flex flex-col gap-[var(--space-xs)]">
            <label className="text-sm text-[var(--color-muted)]">Passord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-[var(--color-card-border)] text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-gold)]"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="btn-primary w-full"
          >
            Logg inn
          </button>
        </form>
      </div>
    </div>
  );
}
