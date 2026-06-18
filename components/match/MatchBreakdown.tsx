"use client";

import { useState } from "react";

export default function MatchBreakdown({
  blocks,
}: {
  blocks: {
    basic: number;
    lifestyle: number;
    interests: number;
    location: number;
    needs: number;
    boundaries: number;
    intentions: number;
  };
}) {
  const [open, setOpen] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 55) return "text-[var(--color-gold)]";
    return "text-red-400";
  };

  const getBarColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 55) return "bg-[var(--color-gold)]";
    return "bg-red-400";
  };

  const entries = [
    { label: "Grunnleggende kompatibilitet", value: blocks.basic },
    { label: "Livsstil", value: blocks.lifestyle },
    { label: "Interesser", value: blocks.interests },
    { label: "Lokasjon", value: blocks.location },
    { label: "Behov", value: blocks.needs },
    { label: "Grenser", value: blocks.boundaries },
    { label: "Intensjoner", value: blocks.intentions },
  ];

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-[var(--color-gold)] hover:text-[var(--color-gold)]/80 transition-colors duration-200"
      >
        {open ? "Skjul detaljer" : "Vis hvorfor dere ble matchet"}
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-[var(--space-sm)] text-sm">
          {entries.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-[var(--color-muted)]">{label}</span>
                <span className={`font-medium ${getScoreColor(value)}`}>
                  {value}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${getBarColor(value)} transition-all duration-1000 ease-out`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}