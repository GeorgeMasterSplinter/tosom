import { redirect } from "next/navigation";

export default function LoggInnRedirect() {
  redirect("/login");
}