"use client";

import { useState } from "react";

export default function MatchBannerBreakdown({
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

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-blue-700 hover:underline"
      >
        {open ? "Skjul detaljer" : "Se matchdetaljer"}
      </button>

      {open && (
        <div className="mt-2 space-y-1 text-xs text-gray-700">
          <div>Grunnleggende: {blocks.basic}</div>
          <div>Livsstil: {blocks.lifestyle}</div>
          <div>Interesser: {blocks.interests}</div>
          <div>Behov: {blocks.needs}</div>
          <div>Grenser: {blocks.boundaries}</div>
          <div>Intensjoner: {blocks.intentions}</div>
        </div>
      )}
    </div>
  );
}
