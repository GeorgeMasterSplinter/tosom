// app/api/auth/test-login/route.ts — POST /api/auth/test-login
// Authentiser ein test-brukar med passord og opprett brukar i DB dersom ikkje eksisterande

import { NextRequest, NextResponse } from 'next/server';
import { getTestUserByEmail } from '@/lib/auth/test-users';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/auth/test-login
 * Body: { email: string, password: string }
 * Response: { success: boolean, userId?: string, email?: string, name?: string, error?: string }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Manglar e-post eller passord' },
        { status: 400 }
      );
    }

    // Finn test-brukar
    const testUser = getTestUserByEmail(email.toLowerCase().trim());
    if (!testUser) {
      return NextResponse.json(
        { success: false, error: 'Ugyldig e-post eller passord' },
        { status: 401 }
      );
    }

    // Valider passord (plaintext for test — ikkje i produksjon!)
    if (password !== testUser.password) {
      return NextResponse.json(
        { success: false, error: 'Ugyldig e-post eller passord' },
        { status: 401 }
      );
    }

    // Finn brukar — berre henting av spesifikke felt for å unngå "phone column does not exist"
    let user = await prisma.user.findUnique({
      where: { email: testUser.email },
      select: {
        id: true,
        email: true,
        name: true,
        onboardingComplete: true,
        deepProfileComplete: true,
      },
    });

    if (!user) {
      // Opprett ny brukar om ikkje eksisterande
      user = await prisma.user.create({
        data: {
          email: testUser.email,
          name: testUser.name,
          verified: true,
          role: 'USER',
          onboardingComplete: false,
          deepProfileComplete: false,
        },
        select: {
          id: true,
          email: true,
          name: true,
          onboardingComplete: true,
          deepProfileComplete: true,
        },
      });

      // Opprett profil med default verdiar
      const profileAge = testUser.id === 'test-user-1' ? 28 : 31;
      await prisma.profile.create({
        data: {
          userId: user.id!,
          firstName: testUser.name,
          lastName: '',
          age: profileAge,
          identityName: testUser.name,
          deepProfileStep: 'IDENTITY',
          deepProfileData: {},
          bio: '',
          interests: [],
          matchTags: testUser.id === 'test-user-1' 
            ? ['rolig', 'dyp', 'familienær', 'kreativ', 'trygg']
            : ['tenkande', 'rolig', 'familiefamilie', 'vekstorientert', 'trygg'],
        },
      });
    }

    return NextResponse.json({
      success: true,
      userId: user.id!,
      email: user.email,
      name: user.name || testUser.name,
      onboardingComplete: user.onboardingComplete,
      deepProfileComplete: user.deepProfileComplete,
    });

  } catch (error) {
    console.error('[test-login] Feil:', error);
    return NextResponse.json(
      { success: false, error: 'Intern serverfeil' },
      { status: 500 }
    );
  }
}
