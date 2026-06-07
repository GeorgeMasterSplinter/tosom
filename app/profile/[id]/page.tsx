import { getProfileById } from "./getProfileById";
import ProfileView from "./ProfileView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;

  const profile = await getProfileById(id);

  if (!profile) {
    return <div>Profil ikke funnet</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ProfileView profile={profile} />
    </main>
  );
}
