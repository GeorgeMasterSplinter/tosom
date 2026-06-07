import { NextRequest, NextResponse } from 'next/server'
import { listConversations } from '@/lib/admin/conversation'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const filter = {
      userId: searchParams.get('userId') || undefined,
      frozen: searchParams.get('frozen') ? searchParams.get('frozen') === 'true' : undefined,
      search: searchParams.get('search') || undefined,
    }

    const conversations = await listConversations(filter)

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error('[admin conversations GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
