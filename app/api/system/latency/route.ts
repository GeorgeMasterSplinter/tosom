import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const latencyMs = Date.now() - start

    return NextResponse.json({ latencyMs })
  } catch (error) {
    console.error('[system latency GET] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
