import { useState } from "react";
import { getSession } from "next-auth/react";

export default function EditProfile({ profile }) {
  const [form, setForm] = useState(profile);

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("Profil oppdatert");
  }

  return (
    <div>
      <h1>Rediger profil</h1>

      <form onSubmit={handleSubmit}>
        <label>Navn</label>
        <input
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Bio</label>
        <textarea
          value={form.bio || ""}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <button type="submit">Lagre</button>
      </form>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Import Prisma *only on the server*
  const prisma = (await import("../../lib/prisma")).default;

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
}
