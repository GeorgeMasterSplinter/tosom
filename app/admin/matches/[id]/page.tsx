import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      userA: {
        include: {
          profile: true,
        }
      },
      userB: {
        include: {
          profile: true,
        }
      },
    }
  });

  if (!match) {
    notFound();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Match Details</h1>
      
      {/* Admin Actions */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <div className="flex flex-wrap gap-4">
          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/matches/${id}/unmatch`, {
                method: 'POST',
              });
              if (response.ok) {
                alert('Match force unmarked successfully');
                revalidatePath(`/admin/matches/${id}`);
              } else {
                alert('Failed to force unmark match');
              }
            } catch (error) {
              alert('Error: ' + error);
            }
          }}>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Force Unmatch
            </button>
          </form>
          
          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/matches/${id}/reset`, {
                method: 'POST',
              });
              if (response.ok) {
                alert('Match reset successfully');
                revalidatePath(`/admin/matches/${id}`);
              } else {
                alert('Failed to reset match');
              }
            } catch (error) {
              alert('Error: ' + error);
            }
          }}>
            <button
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors"
            >
              Reset Match
            </button>
          </form>
          
          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/matches/${id}/review`, {
                method: 'POST',
              });
              if (response.ok) {
                alert('Match marked as reviewed successfully');
                revalidatePath(`/admin/matches/${id}`);
              } else {
                alert('Failed to mark match as reviewed');
              }
            } catch (error) {
              alert('Error: ' + error);
            }
          }}>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Mark as Reviewed
            </button>
          </form>
        </div>
      </div>

      {/* Match Info */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Match Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Match ID</p>
            <p>{match.id}</p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <p>{match.status}</p>
          </div>
          <div>
            <p className="text-gray-400">Match Score</p>
            <p>{match.matchScore}</p>
          </div>
          <div>
            <p className="text-gray-400">Created At</p>
            <p>{new Date(match.createdAt).toLocaleString("no-NO")}</p>
          </div>
        </div>
      </div>

      {/* User A */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User A</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Name</p>
            <p>{match.userA?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">ID</p>
            <p>{match.userAId}</p>
          </div>
          <div>
            <p className="text-gray-400">Age</p>
            <p>{match.userA?.profile?.age || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Bio</p>
            <p>{match.userA?.profile?.bio || "N/A"}</p>
          </div>
        </div>
        {match.userA?.image && (
          <div className="mt-4">
            <p className="text-gray-400">Image</p>
            <img 
              src={match.userA.image} 
              alt="User A" 
              className="w-32 h-32 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        )}
      </div>

      {/* User B */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User B</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Name</p>
            <p>{match.userB?.name || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">ID</p>
            <p>{match.userBId}</p>
          </div>
          <div>
            <p className="text-gray-400">Age</p>
            <p>{match.userB?.profile?.age || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Bio</p>
            <p>{match.userB?.profile?.bio || "N/A"}</p>
          </div>
        </div>
        {match.userB?.image && (
          <div className="mt-4">
            <p className="text-gray-400">Image</p>
            <img 
              src={match.userB.image} 
              alt="User B" 
              className="w-32 h-32 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
