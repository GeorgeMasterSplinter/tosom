import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/questions
 * 
 * Query params:
 * - categoryId: string — hent spørsmål i ein kategori
 * - depth: number — filtrer på dybde (1, 2, 3)
 * - random: boolean — hent tilfeldig spørsmål
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    const depth = parseInt(url.searchParams.get('depth') || '0', 10);
    const random = url.searchParams.get('random') === 'true';

    // Alle kategorier med spørsmål-antall
    if (!categoryId && !random) {
      const categories = await prisma.questionCategory.findMany({
        orderBy: { order: 'asc' },
      });

      // Hent count for hvar kategori
      const categoriesWithCount = await Promise.all(
        categories.map(async (c) => {
          const count = await prisma.guidedQuestion.count({
            where: { categoryId: c.id },
          });
          return { ...c, count };
        })
      );

      return NextResponse.json({
        success: true,
        categories: categoriesWithCount,
      });
    }

    // Tilfeldig spørsmål
    if (random) {
      const where: any = {};
      if (categoryId) where.categoryId = categoryId;
      if (depth > 0) where.depthLevel = depth;

      const count = await prisma.guidedQuestion.count({ where });
      if (count === 0) return NextResponse.json({ success: true, question: null });

      const skip = Math.floor(Math.random() * count);
      const questions = await prisma.guidedQuestion.findMany({
        where,
        take: 1,
        skip,
      });

      return NextResponse.json({
        success: true,
        question: questions[0] || null,
      });
    }

    // Spørsmål i ein kategori
    if (categoryId) {
      const where: any = { categoryId };
      if (depth > 0) where.depthLevel = depth;

      const questions = await prisma.guidedQuestion.findMany({
        where,
        orderBy: { order: 'asc' },
      });

      return NextResponse.json({
        success: true,
        questions,
      });
     }

    return NextResponse.json(
      { error: 'Ugyldig forespørsel' },
      { status: 400 }
    );
  } catch (error) {
    console.error('GET /api/questions feil:', error);
    return NextResponse.json(
      { error: 'Intern serverfeil' },
      { status: 500 }
    );
  }
}