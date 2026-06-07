"use client";
type RecommendationItem = {
  user: {
    userId: string;
    name: string;
    age: number;
    distance: string;
    image?: string;
  };
  summary: {
    whyGood: string;
    whyBad: string;
    potentialChallenge: string;
  };
};

import { useEffect, useState } from "react";
import PublicMatchCard from "./PublicMatchCard";

export default function Recommendations() {
  const [recs, setRecs] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/match/recommendations");
      const data = await res.json();
      setRecs(data);
    }
    load();
  }, []);

  if (!recs.length) {
    return (
      <div className="text-neutral-500 text-sm">
        Ingen anbefalinger akkurat nå.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {recs.map((rec) => (
<PublicMatchCard
  key={rec.user.userId}
  data={{
    name: rec.user.name,
    age: rec.user.age,
    distance: rec.user.distance,
    image: rec.user.image,
    summary: {
      whyGood: rec.summary.whyGood,
      whyBad: rec.summary.whyBad,
      potentialChallenge: rec.summary.potentialChallenge,
    }
  }}
        />
      ))}
    </div>
  );
}
