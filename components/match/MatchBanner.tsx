"use client";

import MatchBannerBreakdown from "./MatchBannerBreakdown";

export default function MatchBanner({
  name,
  age,
  score,
  explanation,
  blocks,
  onClose,
}: {
  name: string;
  age: number;
  score: number;
  explanation: string;
  blocks?: {
    basic: number;
    lifestyle: number;
    interests: number;
    location: number;
    needs: number;
    boundaries: number;
    intentions: number;
  };
  onClose: () => void;
}) {
  return (
    <div className="p-4 bg-blue-50 border-b border-blue-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">
            Matchet med {name}, {age}
          </h3>
          <p className="text-sm text-gray-700 mt-1">
            {explanation}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="mt-2 text-sm text-blue-700 font-medium">
        Matchpoeng: {score} / 100
      </div>

      {blocks && <MatchBannerBreakdown blocks={blocks} />}
    </div>
  );
}