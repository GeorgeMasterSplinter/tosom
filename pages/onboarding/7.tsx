import { useState } from "react";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function Step7() {
  const [form, setForm] = useState({
    selfView: "",
    workingOn: "",
    proudOf: "",
    fears: "",
    partnerHope: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/onboarding/8";
  }

  return (
    <OnboardingLayout>
      <h1>Steg 7: Selvrefleksjon</h1>
      <p>
        Dette er din mulighet til å vise hvem du er — ikke bare hva du gjør.
        Svarene dine hjelper oss å forstå deg på et dypere nivå.
      </p>

      <form onSubmit={handleSubmit}>

        <label>Hvordan ser du på deg selv som partner?</label>
        <textarea
          value={form.selfView}
          onChange={(e) => setForm({ ...form, selfView: e.target.value })}
          placeholder="Hvordan er du i relasjoner? Hva er dine styrker?"
        />

        <label>Hva jobber du med i deg selv?</label>
        <textarea
          value={form.workingOn}
          onChange={(e) => setForm({ ...form, workingOn: e.target.value })}
          placeholder="Hva ønsker du å utvikle eller forbedre?"
        />

        <label>Hva er du stolt av?</label>
        <textarea
          value={form.proudOf}
          onChange={(e) => setForm({ ...form, proudOf: e.target.value })}
          placeholder="Hva er du stolt av?"
        />

        <label>Hva frykter du i relasjoner?</label>
        <textarea
          value={form.fears}
          onChange={(e) => setForm({ ...form, fears: e.target.value })}
          placeholder="Hva er du redd for skal skje?"
        />

        <label>Hva håper du å finne i en partner?</label>
        <textarea
          value={form.partnerHope}
          onChange={(e) => setForm({ ...form, partnerHope: e.target.value })}
          placeholder="Hva ønsker du deg i en relasjon?"
        />

        <button type="submit">Neste</button>
      </form>
    </OnboardingLayout>
  );
}
