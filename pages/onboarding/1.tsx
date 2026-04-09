import { useState } from "react";
import { useRouter } from "next/router";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function Step1() {
  const router = useRouter();

  const [form, setForm] = useState({
    age: "",
    gender: "",
    height: "",
    location: "",
    children: "",
    relationshipStatus: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    router.push("/onboarding/2"); // ← riktig redirect for steg 1
  }

  return (
    <OnboardingLayout>
      <h1>Steg 1: Grunnleggende informasjon</h1>
      <p>Dette er trygg og enkel informasjon som hjelper oss å forstå deg.</p>

      <form onSubmit={handleSubmit}>
        <label>Alder</label>
        <input
          type="number"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <label>Kjønn</label>
        <select
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="male">Mann</option>
          <option value="female">Kvinne</option>
          <option value="other">Annet</option>
        </select>

        <label>Høyde (cm)</label>
        <input
          type="number"
          value={form.height}
          onChange={(e) => setForm({ ...form, height: e.target.value })}
        />

        <label>Bosted</label>
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <label>Barn</label>
        <select
          value={form.children}
          onChange={(e) => setForm({ ...form, children: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="none">Ingen</option>
          <option value="yes_fulltime">Ja, fulltid</option>
          <option value="yes_shared">Ja, delt</option>
          <option value="want">Ønsker</option>
          <option value="dont_want">Ønsker ikke</option>
        </select>

        <label>Relasjonsstatus</label>
        <select
          value={form.relationshipStatus}
          onChange={(e) =>
            setForm({ ...form, relationshipStatus: e.target.value })
          }
        >
          <option value="">Velg</option>
          <option value="single">Singel</option>
          <option value="divorced">Skilt</option>
          <option value="widowed">Enke/enkemann</option>
        </select>

        <button type="submit">Neste</button>
      </form>
    </OnboardingLayout>
  );
}
