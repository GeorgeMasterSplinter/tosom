import { NextRequest, NextResponse } from 'next/server';
import { adminAuthGuard } from '@/lib/auth/adminAuthGuard';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await adminAuthGuard();
  if (auth) return auth; // returnerar 401/403

  const { id } = await params;
  
  // TODO: Implement block feature - userBlock model not yet in schema
  return NextResponse.json({ ok: true, blockedConversationId: id });
}
