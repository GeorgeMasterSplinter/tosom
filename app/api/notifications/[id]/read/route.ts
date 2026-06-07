import { NextRequest, NextResponse } from 'next/server'
import { markRead } from '@/lib/notifications/dispatcher'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const notificationId = params.id

    await markRead(notificationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[notifications read POST] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
