/**
 * Tosom — Dev Login Status API
 * 
 * GET /api/dev-login/status
 * Returnerer om dev-login er aktivert og hva testbrukarar som er tilgjengelege.
 */

import { NextResponse } from 'next/server';

const DEV_LOGIN_ENABLED = process.env.DEV_LOGIN_ENABLED === 'true';

const TEST_USERS: Record<string, {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  description: string;
}> = {
  'testA': {
    id: 'testA@tosom.dev',
    email: 'testA@tosom.dev',
    name: 'Test A',
    role: 'USER',
    description: 'E2E testbruker — full onboarding + match + journey dag 1 EARLY',
  },
  'testB': {
    id: 'testB@tosom.dev',
    email: 'testB@tosom.dev',
    name: 'Test B',
    role: 'USER',
    description: 'E2E testbruker — full onboarding + match + journey dag 1 EARLY',
  },
  'admin': {
    id: 'admin@tosom.dev',
    email: 'admin@tosom.dev',
    name: 'Admin Test',
    role: 'ADMIN',
    description: 'Admin-testbruker med tilgang til admin-panel',
  },
};

export async function GET() {
  // Fail-closed i produksjon
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    enabled: DEV_LOGIN_ENABLED,
    availableUsers: Object.keys(TEST_USERS),
    usage: 'GET /api/dev-login?userId=xxx eller POST /api/dev-login { userId: "xxx" }',
  });
}