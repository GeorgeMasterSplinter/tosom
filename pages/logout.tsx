import { signOut } from "next-auth/react";

export default function Logout() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Logging out…</h1>
      {signOut({ callbackUrl: "/login" })}
    </div>
  );
}
