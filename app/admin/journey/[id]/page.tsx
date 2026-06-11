export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function JourneyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const user = await prisma.user.findUnique({
    where: { id },
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
          bio: true,
          gender: true,
        }
      },
      journey: {
        select: {
          phase: true,
          day: true,
          milestones: true,
        }
      }
    }
  });

  if (!user) {
    notFound();
  }

  const displayName = `${user.profile?.firstName ?? ""} ${user.profile?.lastName ?? ""}`.trim() || user.email || "N/A";

  return (
    <div className="p-6">
      <Link href="/admin/journey" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
        &larr; Back to Journey Overview
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Journey Details - {displayName}</h1>
      
      {/* Admin Actions */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
        <div className="flex flex-wrap gap-4">
          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/journey/${id}/reset`, {
                method: 'POST',
              });
              if (response.ok) {
                alert('Journey reset successfully');
                revalidatePath(`/admin/journey/${id}`);
              } else {
                alert('Failed to reset journey');
              }
            } catch (error) {
              alert('Error: ' + error);
            }
          }}>
            <button
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Reset Journey
            </button>
          </form>
          
          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/journey/${id}/next-step`, {
                method: 'POST',
              });
              if (response.ok) {
                alert('Advanced to next step successfully');
                revalidatePath(`/admin/journey/${id}`);
              } else {
                alert('Failed to advance to next step');
              }
            } catch (error) {
              alert('Error: ' + error);
            }
          }}>
            <button
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors"
            >
              Next Step
            </button>
          </form>
          
          <form action={async () => {
            try {
              const response = await fetch(`/api/admin/journey/${id}/complete`, {
                method: 'POST',
              });
              if (response.ok) {
                alert('Journey marked as completed successfully');
                revalidatePath(`/admin/journey/${id}`);
              } else {
                alert('Failed to mark journey as completed');
              }
            } catch (error) {
              alert('Error: ' + error);
            }
          }}>
            <button
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Mark as Completed
            </button>
          </form>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p><span className="text-gray-400">ID:</span> {user.id}</p>
            <p><span className="text-gray-400">Name:</span> {displayName}</p>
            <p><span className="text-gray-400">Email:</span> {user.email || 'N/A'}</p>
            <p><span className="text-gray-400">Age:</span> {user.profile?.age || 'N/A'}</p>
            <p><span className="text-gray-400">Created At:</span> {new Date(user.createdAt).toLocaleString("no-NO")}</p>
            <p><span className="text-gray-400">Onboarding Step:</span> {user.onboardingStep}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Journey Progress</h2>
          <div className="space-y-2">
            <p><span className="text-gray-400">Phase:</span> {user.journey?.phase || 'Not Started'}</p>
            <p><span className="text-gray-400">Day:</span> {user.journey?.day || 1}</p>
            <p><span className="text-gray-400">Milestones:</span> {user.journey?.milestones ? (typeof user.journey.milestones === 'object' ? Object.keys(user.journey.milestones).length : 0) : 0}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
        <div className="space-y-2">
          <p><span className="text-gray-400">First Name:</span> {user.profile?.firstName || 'N/A'}</p>
          <p><span className="text-gray-400">Last Name:</span> {user.profile?.lastName || 'N/A'}</p>
          <p><span className="text-gray-400">Bio:</span> {user.profile?.bio || 'N/A'}</p>
          <p><span className="text-gray-400">Gender:</span> {user.profile?.gender || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
