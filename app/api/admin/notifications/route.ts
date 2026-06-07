import { NextRequest, NextResponse } from 'next/server'
import { listNotifications } from '@/lib/admin/notifications'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const filter = {
      userId: searchParams.get('userId') || undefined,
      type: searchParams.get('type') || undefined,
      read: searchParams.get('read') ? searchParams.get('read') === 'true' : undefined,
      search: searchParams.get('search') || undefined,
    }

    const notifications = await listNotifications(filter)

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error('[admin notifications GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
