import { useState } from "react";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function Step5() {
  const [form, setForm] = useState({
    dailyLife: "",
    relaxStyle: "",
    energySources: "",
    energyDrainers: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/onboarding/6";
  }

  return (
    <OnboardingLayout>
      <h1>Steg 5: Hverdagsbeskrivelse</h1>
      <p>
        Hverdagen er der relasjoner bygges. Dette hjelper oss å finne noen som passer inn i livet ditt.
      </p>

      <form onSubmit={handleSubmit}>

        <label>Hvordan ser en vanlig dag ut for deg?</label>
        <textarea
          value={form.dailyLife}
          onChange={(e) => setForm({ ...form, dailyLife: e.target.value })}
          placeholder="Beskriv rytmen din, jobb, rutiner, hva som er viktig i hverdagen."
        />

        <label>Hvordan liker du å slappe av?</label>
        <textarea
          value={form.relaxStyle}
          onChange={(e) => setForm({ ...form, relaxStyle: e.target.value })}
          placeholder="Hva gjør deg rolig? Hvordan lader du batteriene?"
        />

        <label>Hva gir deg energi?</label>
        <textarea
          value={form.energySources}
          onChange={(e) => setForm({ ...form, energySources: e.target.value })}
          placeholder="Hva får deg til å føle deg levende, motivert og glad?"
        />

        <label>Hva tapper deg for energi?</label>
        <textarea
          value={form.energyDrainers}
          onChange={(e) => setForm({ ...form, energyDrainers: e.target.value })}
          placeholder="Hva gjør deg sliten, stresset eller overveldet?"
        />

        <button type="submit">Neste</button>
      </form>
    </OnboardingLayout>
  );
}
