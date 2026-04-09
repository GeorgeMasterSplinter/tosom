import { useState } from "react";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function Step3() {
  const [form, setForm] = useState({
    structureVsSpontaneity: "",
    calmVsIntense: "",
    emotionalVsLogical: "",
    conflictStyle: "",
    planningStyle: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/onboarding/4";
  }

  return (
    <OnboardingLayout>
      <h1>Steg 3: Personlighet</h1>
      <p>Dette er ikke en test. Det er små indikatorer som hjelper oss å forstå hvordan du fungerer i relasjoner.</p>

      <form onSubmit={handleSubmit}>

        <label>Hvordan vil du beskrive deg selv?</label>
        <select
          value={form.structureVsSpontaneity}
          onChange={(e) =>
            setForm({ ...form, structureVsSpontaneity: e.target.value })
          }
        >
          <option value="">Velg</option>
          <option value="structured">Strukturert</option>
          <option value="balanced">Balansert</option>
          <option value="spontaneous">Spontan</option>
        </select>

        <label>Temperament</label>
        <select
          value={form.calmVsIntense}
          onChange={(e) =>
            setForm({ ...form, calmVsIntense: e.target.value })
          }
        >
          <option value="">Velg</option>
          <option value="calm">Rolig</option>
          <option value="balanced">Balansert</option>
          <option value="intense">Intens</option>
        </select>

        <label>Hvordan tar du beslutninger?</label>
        <select
          value={form.emotionalVsLogical}
          onChange={(e) =>
            setForm({ ...form, emotionalVsLogical: e.target.value })
          }
        >
          <option value="">Velg</option>
          <option value="emotional">Følelsesstyrt</option>
          <option value="balanced">Balansert</option>
          <option value="logical">Logisk</option>
        </select>

        <label>Hvordan håndterer du konflikter?</label>
        <select
          value={form.conflictStyle}
          onChange={(e) =>
            setForm({ ...form, conflictStyle: e.target.value })
          }
        >
          <option value="">Velg</option>
          <option value="avoidant">Unngående</option>
          <option value="balanced">Balansert</option>
          <option value="direct">Direkte</option>
        </select>

        <label>Planlegging</label>
        <select
          value={form.planningStyle}
          onChange={(e) =>
            setForm({ ...form, planningStyle: e.target.value })
          }
        >
          <option value="">Velg</option>
          <option value="planner">Planlegger</option>
          <option value="balanced">Balansert</option>
          <option value="go_with_flow">Tar ting som de kommer</option>
        </select>

        <button type="submit">Neste</button>
      </form>
    </OnboardingLayout>
  );
}
