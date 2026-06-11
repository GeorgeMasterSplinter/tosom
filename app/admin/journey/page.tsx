import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function Page() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      onboardingStep: true,
      profile: {
        select: {
          firstName: true,
          lastName: true,
          age: true,
        }
      },
      journey: {
        select: {
          phase: true,
          day: true,
        }
      }
    },
    orderBy: { 
      createdAt: 'desc' 
    }
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold leading-tight mb-6 text-[#1A1A1A]">Journey Overview</h1>
      
      <div className="bg-white border border-[#CBAA7A]/20 rounded-xl overflow-hidden">
        <table className="w-full divide-y divide-[#CBAA7A]/20">
          <thead>
            <tr className="bg-[#1A1A1A]/5">
              <th className="px-6 py-4 text-left text-xs font-medium leading-tight tracking-wider uppercase text-[#4A4A4A]">User</th>
              <th className="px-6 py-4 text-left text-xs font-medium leading-tight tracking-wider uppercase text-[#4A4A4A]">Age</th>
              <th className="px-6 py-4 text-left text-xs font-medium leading-tight tracking-wider uppercase text-[#4A4A4A]">Journey Status</th>
              <th className="px-6 py-4 text-left text-xs font-medium leading-tight tracking-wider uppercase text-[#4A4A4A]">Created At</th>
              <th className="px-6 py-4 text-left text-xs font-medium leading-tight tracking-wider uppercase text-[#4A4A4A]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#CBAA7A]/10">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#1A1A1A]/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium leading-relaxed text-[#1A1A1A]">
                    {user.profile?.firstName && user.profile?.lastName
                      ? `${user.profile.firstName} ${user.profile.lastName}`.trim()
                      : user.email || 'N/A'}
                  </p>
                  <p className="text-xs leading-relaxed text-[#4A4A4A]">ID: {user.id}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm leading-relaxed text-[#4A4A4A]">
                  {user.profile?.age || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm leading-relaxed text-[#1A1A1A]">
                    {user.journey 
                      ? `Step ${user.journey.day || 1} — ${user.journey.phase || 'Not Started'}`
                      : 'Not Started'
                    }
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm leading-relaxed text-[#4A4A4A]">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("no-NO") : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link 
                    href={`/admin/journey/${user.id}`} 
                    className="text-[#CBAA7A] hover:text-[#CBAA7A]/80 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="p-6 text-center text-[#4A4A4A]">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}
