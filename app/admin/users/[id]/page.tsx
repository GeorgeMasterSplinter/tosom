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
      profile: {
        select: {
          age: true,
          bio: true,
          gender: true,
          location: true,
          jobStatus: true,
          livingSituation: true,
          children: true,
          lifeRhythm: true,
          activityLevel: true,
          socialLevel: true,
          financialStyle: true,
          weekendStyle: true,
          travelStyle: true,
          structureStyle: true,
          energyStyle: true,
          communicationStyle: true,
          planningStyle: true,
          loveLanguage: true,
          giveStyle: true,
          needStyle: true,
          relationshipExpectation: true,
          dealbreaker: true,
          physicalComfort: true,
          emotionalPace: true,
          physicalImportance: true,
          boundaryStyle: true,
          intimacyStyle: true,
          futureWish: true,
          ambitionLevel: true,
          lifePace: true,
          longTermExpectation: true,
          lifeDirection: true,
        }
      }
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
            <p>{user.name || "N/A"}</p>
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

      {/* Journey Info Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Journey Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.profile?.jobStatus && (
            <div>
              <p className="text-gray-400">Job Status</p>
              <p>{user.profile.jobStatus}</p>
            </div>
          )}
          {user.profile?.livingSituation && (
            <div>
              <p className="text-gray-400">Living Situation</p>
              <p>{user.profile.livingSituation}</p>
            </div>
          )}
          {user.profile?.children && (
            <div>
              <p className="text-gray-400">Children</p>
              <p>{user.profile.children}</p>
            </div>
          )}
          {user.profile?.lifeRhythm && (
            <div>
              <p className="text-gray-400">Life Rhythm</p>
              <p>{user.profile.lifeRhythm}</p>
            </div>
          )}
          {user.profile?.activityLevel && (
            <div>
              <p className="text-gray-400">Activity Level</p>
              <p>{user.profile.activityLevel}</p>
            </div>
          )}
          {user.profile?.socialLevel && (
            <div>
              <p className="text-gray-400">Social Level</p>
              <p>{user.profile.socialLevel}</p>
            </div>
          )}
          {user.profile?.financialStyle && (
            <div>
              <p className="text-gray-400">Financial Style</p>
              <p>{user.profile.financialStyle}</p>
            </div>
          )}
          {user.profile?.weekendStyle && (
            <div>
              <p className="text-gray-400">Weekend Style</p>
              <p>{user.profile.weekendStyle}</p>
            </div>
          )}
          {user.profile?.travelStyle && (
            <div>
              <p className="text-gray-400">Travel Style</p>
              <p>{user.profile.travelStyle}</p>
            </div>
          )}
        </div>
      </div>

      {/* Account Info Section */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Age</p>
            <p>{user.profile?.age || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Gender</p>
            <p>{user.profile?.gender || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Location</p>
            <p>{user.profile?.location || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Bio</p>
            <p>{user.profile?.bio || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Images Section */}
      {user.image && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
              <img 
                src={user.image} 
                alt="User profile" 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
