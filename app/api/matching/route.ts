/**
 * ToSom — Matching API Endpoint
 * Kaller matching-motoren og returnerer beste match for brukeren.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';
import { findBestMatchFor } from '@/lib/matching';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  try {
    const bestMatch = await findBestMatchFor(userId);
    return NextResponse.json({ success: true, match: bestMatch });
  } catch (error) {
    console.error('Matching API error:', error);
    return NextResponse.json(
      { error: 'Matching failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId query parameter required' }, { status: 400 });
  }

  try {
    const match = await findBestMatchFor(userId);
    return NextResponse.json({ success: true, match });
  } catch (error) {
    console.error('Matching API error:', error);
    return NextResponse.json(
      { error: 'Matching failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}