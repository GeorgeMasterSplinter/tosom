import { NextRequest, NextResponse } from 'next/server'
import { getNotification } from '@/lib/admin/notifications'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const notification = await getNotification(params.id)

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error('[admin notification GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
