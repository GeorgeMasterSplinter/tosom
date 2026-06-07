import { NextRequest, NextResponse } from 'next/server'
import { getSystemLogs } from '@/lib/admin/system'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const filter = {
      level: searchParams.get('level') || undefined,
      module: searchParams.get('module') || undefined,
      sinceHours: searchParams.get('sinceHours') ? parseInt(searchParams.get('sinceHours')) : undefined,
      search: searchParams.get('search') || undefined,
    }

    const logs = await getSystemLogs(filter)

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('[admin system logs GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
