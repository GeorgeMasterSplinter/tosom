import MatchProfileView from "./MatchProfileView";

export default async function MatchProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchProfileView matchId={id} />;
}