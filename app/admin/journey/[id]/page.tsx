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
      name: true,
      email: true,
      createdAt: true,
      onboardingStep: true,
      profile: {
        select: {
          age: true,
          bio: true,
          gender: true,
        }
      },
      journeyTasks: {
        select: {
          id: true,
          step: true,
          question: true,
          answer: true,
          completed: true,
          createdAt: true,
        },
        orderBy: {
          step: 'asc'
        }
      }
    }
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="p-6">
      <Link href="/admin/journey" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
        &larr; Back to Journey Overview
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Journey Details - {user.name || user.email || user.id}</h1>
      
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
            <p><span className="text-gray-400">Name:</span> {user.name || 'N/A'}</p>
            <p><span className="text-gray-400">Email:</span> {user.email || 'N/A'}</p>
            <p><span className="text-gray-400">Age:</span> {user.profile?.age || 'N/A'}</p>
            <p><span className="text-gray-400">Created At:</span> {new Date(user.createdAt).toLocaleString("no-NO")}</p>
            <p><span className="text-gray-400">Onboarding Step:</span> {user.onboardingStep}</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Journey Progress</h2>
          <div className="space-y-2">
            <p><span className="text-gray-400">Total Tasks:</span> {user.journeyTasks.length}</p>
            <p><span className="text-gray-400">Completed Tasks:</span> {user.journeyTasks.filter(t => t.completed).length}</p>
            <p><span className="text-gray-400">Completion Rate:</span> {user.journeyTasks.length > 0 ? Math.round((user.journeyTasks.filter(t => t.completed).length / user.journeyTasks.length) * 100) : 0}%</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Journey Tasks</h2>
        <div className="space-y-4">
          {user.journeyTasks.length > 0 ? (
            user.journeyTasks.map((task) => (
              <div key={task.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Step {task.step}</h3>
                    <p className="text-sm text-gray-300">{task.question}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${task.completed ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                    {task.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
                {task.answer && (
                  <div className="mt-2 p-2 bg-gray-750 rounded">
                    <p className="text-sm">{task.answer}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(task.createdAt).toLocaleString("no-NO")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No journey tasks found for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
}
