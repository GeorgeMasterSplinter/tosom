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

    // Finn brukar — berre id+email+name (garantert eksisterer i alle DB-ar)
    let userData = await prisma.user.findUnique({
      where: { email: testUser.email },
      select: { id: true, email: true, name: true },
    });

    if (!userData) {
      // Opprett ny brukar — berre grunnfelt (ingen onboardingComplete/deepProfileComplete pga manglande kolonnar)
      try {
        userData = await prisma.user.create({
          data: {
            email: testUser.email,
            name: testUser.name,
            verified: true,
            role: 'USER',
          },
          select: { id: true, email: true, name: true },
        });

        // Opprett profil med default verdiar (ignorer feil om det mislukkar)
        const profileAge = testUser.id === 'test-user-1' ? 28 : 31;
        try {
          await prisma.profile.create({
            data: {
              userId: userData.id!,
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
        } catch {
          // Profil kan allereie eksistere — ignorer
        }
      } catch {
        // Brukar finst kanskje allereie men findUnique feila — ignorer
      }
    }

    // Dersom userData framleis null, returner feil
    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'Kunne ikkje opprette eller finne brukar' },
        { status: 500 }
      );
    }

    // Alltid returnere false for desse — kolonnane eksisterer ikkje i DB-en din
    return NextResponse.json({
      success: true,
      userId: userData.id!,
      email: userData.email,
      name: userData.name || testUser.name,
      onboardingComplete: false,
      deepProfileComplete: false,
    });

  } catch (error) {
    console.error('[test-login] Feil:', error);
    return NextResponse.json(
      { success: false, error: 'Intern serverfeil' },
      { status: 500 }
    );
  }
}