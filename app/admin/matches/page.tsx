import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const matches = await prisma.match.findMany({
    include: {
      userA: true,
      userB: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Matches</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">User A</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">User B</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Score</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="px-4 py-3">{match.id}</td>
                <td className="px-4 py-3">
                  {match.userA?.name || match.userAId} ({match.userAId})
                </td>
                <td className="px-4 py-3">
                  {match.userB?.name || match.userBId} ({match.userBId})
                </td>
                <td className="px-4 py-3">{match.matchScore}</td>
                <td className="px-4 py-3">{match.status}</td>
                <td className="px-4 py-3">{new Date(match.createdAt).toLocaleString("no-NO")}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/matches/${match.id}`} className="text-blue-400 hover:text-blue-300">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
