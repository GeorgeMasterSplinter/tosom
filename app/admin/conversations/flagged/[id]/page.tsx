import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminFlaggedConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: {
      id: true,
      userAId: true,
      userBId: true,
      flaggedById: true,
      flagReason: true,
      flaggedAt: true,
      status: true,
    }
  });

  if (!conversation) {
    notFound();
  }

  const handleAction = async (action: string) => {
    'use server';
    try {
      const response = await fetch(`/api/admin/conversations/${id}/${action}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        alert('Success');
      } else {
        alert('Failed to perform action');
      }
    } catch (error) {
      alert('Failed to perform action');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin/conversations/flagged" className="text-blue-600 hover:text-blue-800 mb-6 block">
        &larr; Back to flagged conversations
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Flagged Conversation Details</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Conversation Information</h2>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Conversation ID</p>
              <p className="text-gray-900">{conversation.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">User A</p>
              <p className="text-gray-900">{conversation.userAId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">User B</p>
              <p className="text-gray-900">{conversation.userBId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Flagged By</p>
              <p className="text-gray-900">{conversation.flaggedById}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Reason</p>
              <p className="text-gray-900">{conversation.flagReason}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Flagged At</p>
              <p className="text-gray-900">{new Date(conversation.flaggedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                ${conversation.status === 'FLAGGED' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${conversation.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' : ''}
                ${conversation.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' : ''}
              `}>
                {conversation.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Moderation Actions</h2>
        </div>
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-4">
            <form action={handleAction.bind(null, 'close')} className="inline">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Close Conversation
              </button>
            </form>
            
            <form action={handleAction.bind(null, 'review')} className="inline">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Mark as Reviewed
              </button>
            </form>
            
            <form action={handleAction.bind(null, 'block')} className="inline">
              <button
                type="submit"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Block Users
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
