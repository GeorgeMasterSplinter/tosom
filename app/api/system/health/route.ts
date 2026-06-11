
import { prisma } from '@/lib/prisma'
import { isProd } from '@/config/runtime'

export async function GET(): Promise<Response> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return new Response(JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: isProd ? process.memoryUsage() : undefined,
      database: 'connected',
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      database: 'disconnected',
    }), { status: 503, headers: { 'Content-Type': 'application/json' } })
  }
}
