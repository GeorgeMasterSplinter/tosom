/**
 * Tosom — Onboarding steg 1: Start
 * 
 * Redirect til /register som hovedinngang.
 */

import { redirect } from "next/navigation";

export default function Page() {
  redirect("/register");
}