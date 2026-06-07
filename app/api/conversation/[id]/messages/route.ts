import { NextRequest, NextResponse } from 'next/server'
import { getMessages } from '@/lib/chat/pagination'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { searchParams } = request.nextUrl
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '30')

    if (limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Limit must be between 1 and 100' }, { status: 400 })
    }

    const result = await getMessages(params.id, cursor, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[messages GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
