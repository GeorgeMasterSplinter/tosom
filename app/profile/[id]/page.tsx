import { getProfileById } from "./getProfileById";
import ProfileView from "./ProfileView";
import NotFound from "@/components/ui/NotFound";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;

  const profile = await getProfileById(id);

  if (!profile) {
    return <NotFound
      title="Fant ikke profilen"
      description="Denne profilen finst ikkje eller er utilgjengeleg."
      backHref="/matching"
      backLabel="Tilbake til matcher"
    />;
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <ProfileView profile={profile} />
    </main>
  );
}
