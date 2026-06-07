import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { markRead } from '@/lib/chat/messageState'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { messageId } = await request.json()
    const conversationId = params.id

    if (!messageId) {
      return NextResponse.json({ error: 'messageId is required' }, { status: 400 })
    }

    // Verify user has access to this conversation
    const conv = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userAId: true, userBId: true },
    })

    if (!conv) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Mark all messages in conversation as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: conv.userAId }, // Mark messages from B as read when A views
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[read POST] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
