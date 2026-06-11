
import { getMessages } from '@/lib/chat/pagination'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') ?? undefined
    const limit = parseInt(searchParams.get('limit') || '30')

    if (limit < 1 || limit > 100) {
      return new Response(JSON.stringify({ error: 'Limit must be between 1 and 100' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const { id } = await context.params
    const result = await getMessages(id, cursor, limit)

    return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[messages GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
