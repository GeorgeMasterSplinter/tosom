
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request
): Promise<Response> {
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const latencyMs = Date.now() - start

    return new Response(JSON.stringify({ latencyMs }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('[system latency GET] Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


