import { redirect } from 'next/navigation';

/**
 * BETA: Registreringssiden selger Vipps-innlogging som ikke finnes ennå.
 * All registrering skjer via /login (e-post + passord med auto-registrering).
 * Når Vipps-innlogging er på plass, bygges denne siden opp igjen.
 */
export default function RegisterPage() {
  redirect('/login');
}