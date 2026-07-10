/**
 * GET /api/chat/categories
 * 
 * Hent alle aktive ChatCategory med spørsmål.
 * Brukes av ChatWindow for kategori-panel.
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const categories = await prisma.chatCategory.findMany({
      where: { isActive: true },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            text: true,
            hint: true,
            sortOrder: true,
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('GET /api/chat/categories error:', error)
    return NextResponse.json(
      { error: 'Kunne ikke hente kategoriar' },
      { status: 500 }
    )
  }
}