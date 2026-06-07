import { NextRequest, NextResponse } from 'next/server'
import { getConversationMetadata } from '@/lib/admin/conversation'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const metadata = await getConversationMetadata(params.id)

    if (!metadata) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({ conversation: metadata })
  } catch (error) {
    console.error('[admin conversation GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
