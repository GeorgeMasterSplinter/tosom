import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminTokenFromRequest } from '@/lib/auth/admin-jwt';
import { trackError } from '@/lib/errorTracker';

export async function GET(req: NextRequest) {
  try {
    const payload = await verifyAdminTokenFromRequest(req);

    return NextResponse.json({ authenticated: !!payload });
  } catch (error) {
    await trackError(error, 'api/admin/session');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}