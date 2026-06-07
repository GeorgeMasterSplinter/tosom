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

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-blue-700 hover:underline"
      >
        {open ? "Skjul detaljer" : "Vis hvorfor dere ble matchet"}
      </button>

      {open && (
        <div className="mt-3 space-y-2 text-sm text-gray-800">
          <div>Grunnleggende kompatibilitet: {blocks.basic}</div>
          <div>Livsstil: {blocks.lifestyle}</div>
          <div>Interesser: {blocks.interests}</div>
          <div>Lokasjon: {blocks.location}</div>
          <div>Behov: {blocks.needs}</div>
          <div>Grenser: {blocks.boundaries}</div>
          <div>Intensjoner: {blocks.intentions}</div>
        </div>
      )}
    </div>
  );
}
