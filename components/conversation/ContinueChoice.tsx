"use client";

import { useState } from "react";

export default function ContinueChoice({ onChoose }: { onChoose: (choice: "yes" | "no") => void }) {
  const [loading, setLoading] = useState(false);

  const handle = async (choice: "yes" | "no") => {
    setLoading(true);
    await onChoose(choice);
    setLoading(false);
  };

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => handle("yes")}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        Ja, jeg vil fortsette
      </button>

      <button
        onClick={() => handle("no")}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400"
      >
        Nei, jeg vil avslutte
      </button>
    </div>
  );
}
