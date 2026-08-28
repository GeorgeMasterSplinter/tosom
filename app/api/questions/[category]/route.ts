/**
 * GET /api/questions/[category]
 * 
 * Hent GuidedQuestionar per kategori, sortert på order.
 * Kan filtrere på depthLevel og limit.
 * 
 * Query-params:
 *   - depth: 1, 2 eller 3 (valgfritt)
 *   - limit: antall spørsmål (valgfritt, max 15)
 *   - random: true/false (valgfritt, tilfeldig rekkefølgje)
 * 
 * Respons:
 * {
 *   "success": true,
 *   "category": { "id": "...", "name": "Trygghet", "color": "#D4AF37" },
 *   "questions": [
 *     { "id": "...", "content": "...", "depthLevel": 1, "order": 1 }
 *   ]
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category: categoryName } = await params
    const url = new URL(request.url)
    
    const depthParam = url.searchParams.get('depth')
    const limitParam = url.searchParams.get('limit')
    const randomParam = url.searchParams.get('random')

    // Finn kategorien
    const category = await prisma.questionCategory.findUnique({
      where: { name: categoryName },
      select: { id: true, name: true, color: true, description: true },
    })

    if (!category) {
      return NextResponse.json(
        { success: false, error: `Kategorien "${categoryName}" finnes ikke` },
        { status: 404 }
      )
    }

    // Filter
    const where = { categoryId: category.id }
    if (depthParam && ['1', '2', '3'].includes(depthParam)) {
      (where as any).depthLevel = parseInt(depthParam)
    }

    // Hent spørsmål
    let questions = await prisma.guidedQuestion.findMany({
      where,
      orderBy: randomParam === 'true' ? undefined : { order: 'asc' },
    })

    // Randomiser dersom ønska
    if (randomParam === 'true') {
      // Fisher-Yates shuffle
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[questions[i], questions[j]] = [questions[j], questions[i]]
      }
    } else {
      questions.sort((a, b) => a.order - b.order)
    }

    // Limit
    if (limitParam) {
      const limit = parseInt(limitParam)
      if (!isNaN(limit) && limit > 0) {
        questions = questions.slice(0, limit)
      }
    }

    const result = questions.map((q) => ({
      id: q.id,
      content: q.content,
      depthLevel: q.depthLevel,
      order: q.order,
    }))

    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        color: category.color ?? '#D4AF37',
        description: category.description ?? '',
      },
      questions: result,
    })
  } catch (error) {
    console.error('[GET /api/questions/[category]] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}