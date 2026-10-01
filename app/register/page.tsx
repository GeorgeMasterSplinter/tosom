import { redirect } from 'next/navigation';

/**
 * Registrering skjer via /login (e-post, passord eller Vipps med
 * auto-registrering). Denne ruten returer til /login.
 */
export default function RegisterPage() {
  redirect('/login');
}