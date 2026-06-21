export const dynamic = "force-dynamic"

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  
  // Fetch user data from database
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      
      {/* Basic Info Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">ID</p>
            <p className="font-mono">{user.id}</p>
          </div>
          <div>
            <p className="text-gray-400">Name</p>
            <p>{`${user.profile?.firstName ?? ""} ${user.profile?.lastName ?? ""}`.trim() || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p>{user.email || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Created At</p>
            <p>{new Date(user.createdAt).toLocaleString("no-NO")}</p>
          </div>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profil</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Fornavn</p>
            <p>{user.profile?.firstName || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Etternamn</p>
            <p>{user.profile?.lastName || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Alder</p>
            <p>{user.profile?.age?.toString() || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Bio</p>
            <p>{user.profile?.bio || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Interess</p>
            <p>{user.profile?.interests?.join(", ") || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Photo Section */}
      {user.profile?.photoUrl && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Foto</h2>
          <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src={user.profile.photoUrl} 
              alt="Profile photo" 
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
