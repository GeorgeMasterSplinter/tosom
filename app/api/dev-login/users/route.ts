/**
 * Tosom — Dev Login Users API
 * 
 * GET /api/dev-login/users
 * Returnerer liste over tilgjengelege testbrukarar.
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
  // Fail-closed i produksjon (uavhengig av DEV_LOGIN_ENABLED-flagget)
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404 }
    );
  }

  if (!DEV_LOGIN_ENABLED) {
    return NextResponse.json(
      { error: 'Dev-login er ikke aktivert.' },
      { status: 503 }
    );
  }

  const users = Object.entries(TEST_USERS).map(([key, u]) => ({
    id: key,
    name: u.name,
    email: u.email,
    role: u.role,
    description: u.description,
  }));

  return NextResponse.json({ users });
}