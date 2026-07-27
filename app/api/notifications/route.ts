
import { prisma } from '@/lib/prisma'
import { markAllRead } from '@/lib/notifications/dispatcher'
export const dynamic = 'force-dynamic';

// GET /api/notifications — returner siste 50 + unreadCount
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId, readAt: null },
    })

    return new Response(JSON.stringify({ notifications, unreadCount }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[notifications GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

// POST /api/notifications/read-all — marker alle som lesne
export async function POST(
  request: Request
): Promise<Response> {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    await markAllRead(userId)

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[notifications read-all POST] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


