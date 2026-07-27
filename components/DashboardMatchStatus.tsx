"use client";

import { useEffect, useState } from "react";

export default function DashboardMatchStatus() {
  const [status, setStatus] = useState<{ state: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/match/status");
      const data = await res.json();
      setStatus(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#1E2A38]/60 border border-[#D4AF37]/20 rounded-xl p-6 animate-pulse">
        <p className="text-neutral-400 leading-relaxed">Laster status…</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-[#1E2A38]/60 border border-[#D4AF37]/20 rounded-xl p-6">
        <p className="text-neutral-400 leading-relaxed">Ingen status tilgjengelig.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E2A38]/60 border border-[#D4AF37]/20 rounded-xl p-6">
      <h2 className="text-xl font-semibold leading-tight text-white mb-4 tracking-wide">
        Match‑status
      </h2>

      <div className="space-y-4">
        {status.state === "idle" && (
          <p className="text-neutral-300 leading-relaxed">
            Du er ikke i kø. Trykk for å starte matching.
          </p>
        )}

        {status.state === "queue" && (
          <p className="text-neutral-300 leading-relaxed">
            Du står i kø… vi finner en match til deg.
          </p>
        )}

        {status.state === "matched" && (
          <p className="text-[#D4AF37] leading-relaxed">
            Du har en match! Gå til chat for å starte samtalen.
          </p>
        )}
      </div>
    </div>
  );
}
