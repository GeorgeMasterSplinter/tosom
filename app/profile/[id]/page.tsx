import { getProfileById } from "./getProfileById";
import ProfileView from "./ProfileView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;

  const profile = await getProfileById(id);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <p className="text-white text-lg font-light">Profilen ble ikke funnet.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950">
      <ProfileView profile={profile} />
    </main>
  );
}
