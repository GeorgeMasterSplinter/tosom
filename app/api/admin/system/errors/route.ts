import { NextRequest, NextResponse } from 'next/server'
import { getErrorLogs } from '@/lib/admin/system'
import { requireAdmin } from '@/lib/admin/requireAuth'

export async function GET(request: NextRequest) {
  try {
    const { adminId } = await request.json()
    await requireAdmin(adminId)

    const { searchParams } = request.nextUrl
    const filter = {
      userId: searchParams.get('userId') || undefined,
      module: searchParams.get('module') || undefined,
      sinceHours: searchParams.get('sinceHours') ? parseInt(searchParams.get('sinceHours')) : undefined,
      search: searchParams.get('search') || undefined,
    }

    const errors = await getErrorLogs(filter)

    return NextResponse.json({ errors })
  } catch (error) {
    console.error('[admin system errors GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
