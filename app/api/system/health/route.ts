import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const db = await prisma.$queryRaw<{ count: number }[]>`SELECT 1 as count`)
    return NextResponse.json({ 
      status: 'ok', 
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: 'ok' as const
    })
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      db: 'error' as const
    }, { status: 500 })
  }
}
