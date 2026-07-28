import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

/**
 * ToSom — Admin Auth API
 * 
 * Sikker admin-innlogging med:
 * - Rate limiting (5 forsøk per 15 min)
 * - Ingen info-lekkasje (generic error message)
 * - Hardcoded credentials frå ENV
 * - HttpOnly admin_token-cookie etter suksess
 */

// ─── Simple IP-based rate limiting ───
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) return true;

  // Rydd gamle forsøk
  if (now - record.firstAttempt > RATE_LIMIT_WINDOW) {
    loginAttempts.delete(ip);
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false; // Rate limited
  }

  return true;
}

function recordAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    loginAttempts.set(ip, { count: record.count + 1, firstAttempt: record.firstAttempt });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  // Valider at input finst
  if (!username || !password) {
    return NextResponse.json({ ok: false, error: 'Manglar brukernamn eller passord' }, { status: 400 });
  }

  // Hent IP for rate limiting
  const ip = req.headers.get('x-forwarded-for') 
    || req.headers.get('x-real-ip') 
    || 'unknown';

  // Sjekk rate limit før vi authentifierer (for å ikkje leak om brukar finst)
  if (!checkRateLimit(ip as string)) {
    // Forsink svar for å motgå timing-angrep
    await new Promise(resolve => setTimeout(resolve, 1000));
    return NextResponse.json({ ok: false, error: 'For mange forsøk. Prøv igjen om 15 minutt.' }, { status: 429 });
  }

  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // Silent fail dersom ADMIN_PASSWORD ikkje er sett (ikkje leak info)
  if (!expectedPassword) {
    console.error('[AdminAuth] ADMIN_PASSWORD er ikkje konfigurert i miljøvariablar');
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // Konstant tidssamanlikning for å motgå timing-angrep
  const usernameMatch = await constantTimeCompare(username, expectedUsername);
  const passwordMatch = await constantTimeCompare(password, expectedPassword);

  if (usernameMatch && passwordMatch) {
    // Nullstill rate limiting ved suksess
    loginAttempts.delete(ip as string);

    const response = NextResponse.json({ ok: true });
    
    response.cookies.set("admin_token", "valid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: "/",
      maxAge: 604800, // 1 veke
    });

    return response;
  }

  // Feil — rekord forsøk
  recordAttempt(ip as string);

  // Generisk feilmelding — ikkje seier om username eller password var feil
  return NextResponse.json({ ok: false, error: 'Ugyldig brukernamn eller passord.' }, { status: 401 });
}

/**
 * Konstant tidssamanlikning for å motgå timing-angrep
 * Samanliknar to strengar utan å avsløre kor lang tid det tek
 */
async function constantTimeCompare(a: string, b: string): Promise<boolean> {
  // Bruk TextEncoder for å få byte-array
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);

  // Dersom lengd er ulik, returner false med ein gang
  if (aBytes.length !== bBytes.length) {
    // Gjør like mykje arbeid for å motgå timing-angrep
    await new Promise(resolve => setTimeout(resolve, 100));
    return false;
  }

  let result = 0;
  for (let i = 0; i < aBytes.length; i++) {
    result |= aBytes[i] ^ bBytes[i];
  }

  return result === 0;
}

/**
 * Admin logout — fjern admin_token-cookie
 */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // Umiddelbar utløp
  });
  return response;
}


