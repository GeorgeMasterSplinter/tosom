import { useState } from "react";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function Step6() {
  const [form, setForm] = useState({
    wantChildren: "",
    wantCohabitation: "",
    wantMarriage: "",
    futureVision: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/onboarding/7";
  }

  return (
    <OnboardingLayout>
      <h1>Steg 6: Fremtidsønsker</h1>
      <p>
        Dette handler ikke om press. Det handler om å finne noen som ønsker det samme som deg.
      </p>

      <form onSubmit={handleSubmit}>

        <label>Ønsker du barn?</label>
        <select
          value={form.wantChildren}
          onChange={(e) => setForm({ ...form, wantChildren: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="yes">Ja</option>
          <option value="no">Nei</option>
          <option value="maybe">Kanskje</option>
          <option value="later">Senere</option>
        </select>

        <label>Ønsker du samboerskap?</label>
        <select
          value={form.wantCohabitation}
          onChange={(e) =>
            setForm({ ...form, wantCohabitation: e.target.value })
          }
        >
          <option value="">Velg</option>
          <option value="yes">Ja</option>
          <option value="no">Nei</option>
          <option value="maybe">Kanskje</option>
        </select>

        <label>Ønsker du ekteskap?</label>
        <select
          value={form.wantMarriage}
          onChange={(e) =>
            setForm({ ...form, wantMarriage: e.target.value })
          }
        >
          <option value="">Velg</option>
          <option value="yes">Ja</option>
          <option value="no">Nei</option>
          <option value="maybe">Kanskje</option>
        </select>

        <label>Hvordan ser du for deg fremtiden din?</label>
        <textarea
          value={form.futureVision}
          onChange={(e) =>
            setForm({ ...form, futureVision: e.target.value })
          }
          placeholder="Hva drømmer du om? Hvordan ønsker du at livet ditt skal se ut?"
        />

        <button type="submit">Neste</button>
      </form>
    </OnboardingLayout>
  );
}
