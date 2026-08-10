/**
 * GET /api/questions/categories
 * 
 * Hent alle QuestionCategoryar med tal på GuidedQuestion per kategori.
 * Brukes i chat-UI, journey-guide og admin-dashboard.
 * 
 * Respons:
 * [
 *   {
 *     "id": "cat_xxx",
 *     "name": "Trygghet",
 *     "color": "#D4AF37",
 *     "description": "Grunnleggjande trygghet i relasjon",
 *     "questionCount": 15,
 *     "depthLevels": { 1: 5, 2: 6, 3: 4 }
 *   },
 *   ...
 * ]
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await prisma.questionCategory.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { order: 'asc' },
    })

    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color ?? '#D4AF37',
      description: cat.description ?? '',
      questionCount: cat._count.questions,
      depthLevels: {
        1: 0,
        2: 0,
        3: 0,
      },
    }))

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('[GET /api/questions/categories] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}