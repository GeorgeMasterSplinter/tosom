export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MatchesPage() {
  const matches = await prisma.match.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Matches</h1>

      <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700 text-left">
            <th className="px-4 py-3">Match ID</th>
            <th className="px-4 py-3">User A</th>
            <th className="px-4 py-3">User B</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {matches.map((match) => (
            <tr key={match.id} className="border-t border-gray-700">
              <td className="px-4 py-3">{match.id}</td>

              {/* USER A */}
              <td className="px-4 py-3">
                {match.userA?.profile?.firstName || match.userA?.profile?.lastName
                  ? `${match.userA?.profile?.firstName ?? ""} ${match.userA?.profile?.lastName ?? ""}`.trim()
                  : match.userAId}
                {" "}
                ({match.userAId})
              </td>

              {/* USER B */}
              <td className="px-4 py-3">
                {match.userB?.profile?.firstName || match.userB?.profile?.lastName
                  ? `${match.userB?.profile?.firstName ?? ""} ${match.userB?.profile?.lastName ?? ""}`.trim()
                  : match.userBId}
                {" "}
                ({match.userBId})
              </td>

              <td className="px-4 py-3">{match.score}</td>
              <td className="px-4 py-3">{match.status}</td>
              <td className="px-4 py-3">
                {new Date(match.createdAt).toLocaleString("no-NO")}
              </td>

              <td className="px-4 py-3">
                <Link
                  href={`/admin/matches/${match.id}`}
                  className="text-blue-400 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
