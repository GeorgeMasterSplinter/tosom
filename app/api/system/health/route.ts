import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isProd } from '@/config/runtime'

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: isProd ? process.memoryUsage() : undefined,
      database: 'connected',
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
    }, { status: 503 })
  }
}
