export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export default async function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const match = await prisma.match.findUnique({
    where: { id },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
    }
  });

  if (!match) {
    notFound();
  }

  // ⭐ Correct Prisma typing with relations
  const m = match as Prisma.MatchGetPayload<{
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
    }
  }>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Match Details</h1>

      {/* Admin Actions */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <div className="flex flex-wrap gap-4">
          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/matches/${id}/unmatch`, { method: 'POST' });
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
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors">
              Force Unmatch
            </button>
          </form>

          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/matches/${id}/reset`, { method: 'POST' });
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
            <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors">
              Reset Match
            </button>
          </form>

          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/matches/${id}/review`, { method: 'POST' });
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
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors">
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
            <p>{m.id}</p>
          </div>
          <div>
            <p className="text-gray-400">Status</p>
            <p>{m.status}</p>
          </div>
          <div>
            <p className="text-gray-400">Resonansnivå</p>
            <p>{m.resonanceLevel || "—"}</p>
          </div>
          <div>
            <p className="text-gray-400">Created At</p>
            <p>{new Date(m.createdAt).toLocaleString("no-NO")}</p>
          </div>
        </div>
      </div>

      {/* User A */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User A</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Name</p>
            <p>
              {m.userA?.profile?.firstName || m.userA?.profile?.lastName
                ? `${m.userA?.profile?.firstName ?? ""} ${m.userA?.profile?.lastName ?? ""}`.trim()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">ID</p>
            <p>{m.userAId}</p>
          </div>
          <div>
            <p className="text-gray-400">Age</p>
            <p>{m.userA?.profile?.age || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Bio</p>
            <p>{m.userA?.profile?.bio || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* User B */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User B</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Name</p>
            <p>
              {m.userB?.profile?.firstName || m.userB?.profile?.lastName
                ? `${m.userB?.profile?.firstName ?? ""} ${m.userB?.profile?.lastName ?? ""}`.trim()
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-400">ID</p>
            <p>{m.userBId}</p>
          </div>
          <div>
            <p className="text-gray-400">Age</p>
            <p>{m.userB?.profile?.age || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-400">Bio</p>
            <p>{m.userB?.profile?.bio || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
