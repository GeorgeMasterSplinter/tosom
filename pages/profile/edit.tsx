import { useState } from "react";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function EditProfile({ profile }: any) {
  const [form, setForm] = useState(profile);

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/profile";
  }

  return (
    <OnboardingLayout>
      <div style={{ padding: 40 }}>
        <h1>Rediger profil</h1>

        <form onSubmit={handleSubmit}>
          <label>Navn</label>
          <input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label>Alder</label>
          <input
            type="number"
            value={form.age || ""}
            onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
          />

          <label>Kjønn</label>
          <input
            value={form.gender || ""}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          />

          <label>Bio</label>
          <textarea
            value={form.bio || ""}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          <label>Interesser</label>
          <textarea
            value={form.interests || ""}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
          />

          <button type="submit">Lagre</button>
        </form>
      </div>
    </OnboardingLayout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return {
      redirect: { destination: "/onboarding", permanent: false },
    };
  }

  return {
    props: { profile },
  };
}
