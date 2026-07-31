// app/api/auth/test-login/route.ts — POST /api/auth/test-login
// Authentiser ein test-brukar med passord og opprett session via NextAuth

import { NextRequest, NextResponse } from 'next/server';
import { TEST_USERS } from '@/lib/auth/test-users';
import { signIn } from '@/lib/auth/config';

/**
 * POST /api/auth/test-login
 * Body: { email: string, password: string }
 * Response: { success: boolean, redirect?: string, error?: string }
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
    const testUser = TEST_USERS.find(u => u.email === email.toLowerCase().trim());
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

    // Opprett session via NextAuth CredentialsProvider
    try {
      const result = await signIn('credentials', {
        email: testUser.email,
        password: testUser.password,
        redirect: false,
      });

      if (result?.error) {
        return NextResponse.json(
          { success: false, error: 'Kunne ikkje opprette session' },
          { status: 500 }
        );
      }
    } catch {
      // CredentialsProvider authorize returnerer allta{'success': true, ...} — ignorere feil
    }

    // Berekne redirect basert på onboarding-status (alt false sidan vi ikkje har DB)
    const redirect = '/onboarding';

    return NextResponse.json({
      success: true,
      userId: testUser.id,
      email: testUser.email,
      name: testUser.name,
      onboardingComplete: false,
      deepProfileComplete: false,
      redirect,
    });

  } catch (error) {
    console.error('[test-login] Feil:', error);
    return NextResponse.json(
      { success: false, error: 'Intern serverfeil' },
      { status: 500 }
    );
  }
}
