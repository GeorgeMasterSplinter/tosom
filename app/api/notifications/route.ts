import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { markAllRead } from '@/lib/notifications/dispatcher'

// GET /api/notifications — returner siste 50 + unreadCount
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId, readAt: null },
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('[notifications GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/notifications/read-all — marker alle som lesne
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    await markAllRead(userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[notifications read-all POST] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
