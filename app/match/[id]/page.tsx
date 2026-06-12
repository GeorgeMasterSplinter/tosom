"use client";

import MatchProfileView from "./MatchProfileView";

export default function MatchProfilePage({ params }: { params: { id: string } }) {
  return <MatchProfileView matchId={params.id} />;
}
