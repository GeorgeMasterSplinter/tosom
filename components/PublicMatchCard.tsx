"use client";

type PublicMatchCardData = {
  name: string;
  age: number;
  distance: string;
  image?: string;
  summary: {
    whyGood: string;
    whyBad: string;
    potentialChallenge: string;
  };
};

export default function PublicMatchCard({ data }: { data: PublicMatchCardData }) {
  if (!data) return null;

  return (
    <div className="bg-white/80 p-6 rounded-2xl border border-neutral-200 space-y-3">
      <h2 className="text-xl font-semibold text-neutral-900">
        {data.name}, {data.age}
      </h2>

      <p className="text-neutral-500 text-sm">{data.distance}</p>

      <div className="mt-4 space-y-2">
        <p className="text-neutral-800 text-sm">
          <strong>Hvorfor dere passer:</strong> {data.summary.whyGood}
        </p>

        <p className="text-neutral-800 text-sm">
          <strong>Mulig utfordring:</strong> {data.summary.potentialChallenge}
        </p>
      </div>
    </div>
  );
}
