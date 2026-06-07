"use client";

import MatchBreakdown from "./MatchBreakdown";

export default function MatchCard({
  name,
  age,
  score,
  explanation,
  blocks,
}: {
  name: string;
  age: number;
  score: number;
  explanation: string;
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
  return (
    <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {name}, {age}
        </h2>

        <div className="text-sm font-medium text-blue-700">
          {score} / 100
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">
        {explanation}
      </p>

      <MatchBreakdown blocks={blocks} />
    </div>
  );
}
