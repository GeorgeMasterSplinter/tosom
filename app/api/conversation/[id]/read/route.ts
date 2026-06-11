
import { prisma } from '@/lib/prisma'
import { markRead } from '@/lib/chat/messageState'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { messageId } = await request.json()
    const { id: conversationId } = await context.params

    if (!messageId) {
      return new Response(JSON.stringify({ error: 'messageId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // Verify user has access to this conversation
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userAId: true, userBId: true },
    })

    if (!conv) {
      return new Response(JSON.stringify({ error: 'Conversation not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
    }

    // Mark all messages in conversation as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: conv.userAId },
        deletedAt: null,
      },
      data: {
        state: 'READ',
        readAt: new Date(),
      },
    })

    // Also increment the read counter for this user
    const incrementField = conv.userAId === messageId ? 'unreadCountB' : 'unreadCountA'
    await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        [incrementField]: 0,
      },
    })

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[read POST] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
