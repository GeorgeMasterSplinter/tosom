import { NextResponse } from 'next/server'

/* ------------------------------------------------------------------ */
/* ToSom — Debug route                                                */
/* Kun tilgjengeleg i development (NODE_ENV !== 'production')           */
/* ------------------------------------------------------------------ */

export async function GET() {
  /* Prod-sjekk: returner 404 i produksjon */
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
  })
}
