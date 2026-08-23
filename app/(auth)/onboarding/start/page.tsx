/**
 * Tosom — Onboarding steg 1: Start
 * 
 * BETA: Redirect til /login som hovedinngang.
 * (Registrering skjer via auto-registrering på /login.)
 */

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/login");
}
