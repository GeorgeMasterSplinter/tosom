import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken } from '@/lib/auth/admin-jwt';
import { recordFailedLogin, clearFailedLogin } from '@/lib/security/bruteforce';
import { loadAdminPasswordHash, verifyAdminPassword, safeCompare } from '@/lib/admin-hash';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Hent IP fra request (støtter både standard og Cloudflare headers)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    const adminEmail = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME;
    const adminPasswordHash = loadAdminPasswordHash();

    if (!adminEmail || !adminPasswordHash) {
      return NextResponse.json(
        { error: 'Admin-oppsett manglende i miljøvariabler' },
        { status: 500 }
      );
    }

    // B-5: timing-safe — epost via safeCompare, passord mot scrypt-hash i env
    // (ADMIN_PASSWORD_HASH), aldri klartext.
    const emailOk = safeCompare(email ?? '', adminEmail);
    const passOk = verifyAdminPassword(password ?? '', adminPasswordHash);
    if (!emailOk || !passOk) {
      // BF FIX: Registrer feilet loginforsøk (kun ved FEILET login)
      const bfCheck = await recordFailedLogin(ip, email || '');

      if (bfCheck.blocked) {
        // Returner generisk feil for ikke å lekke om brukeren eksisterer
        return NextResponse.json(
          { error: 'For mange forsøk. Vent 15 minutter og prøv igjen.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Ugyldige innloggingsopplysninger' },
        { status: 401 }
      );
    }

    // BF FIX: Rydd feil-registrering ved vellykket login
    clearFailedLogin(ip, email);

    const token = await signAdminToken(email);

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 timer (kortere enn tidligere 24h for bedre sikkerhet)
      path: '/',
    });

    return response;
  } catch {
      return NextResponse.json(
        { error: 'Ugyldig forespørsel' },
        { status: 400 }
      );
  }
}
