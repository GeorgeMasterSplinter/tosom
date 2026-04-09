import { useState } from "react";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function Step4() {
  const [form, setForm] = useState({
    loveLanguage: "",
    whatIGive: "",
    whatINeed: "",
    expectations: "",
    dealbreakers: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/onboarding/5";
  }

  return (
    <OnboardingLayout>
      <h1>Steg 4: Relasjonsstil</h1>
      <p>
        Dette handler ikke om å dømme deg. Det handler om å finne noen som passer deg — 
        ikke forandre deg.
      </p>

      <form onSubmit={handleSubmit}>

        <label>Kjærlighetsspråk</label>
        <select
          value={form.loveLanguage}
          onChange={(e) => setForm({ ...form, loveLanguage: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="words">Ord</option>
          <option value="time">Tid</option>
          <option value="gifts">Gaver</option>
          <option value="service">Tjenester</option>
          <option value="touch">Berøring</option>
        </select>

        <label>Hva tilbyr du i en relasjon?</label>
        <textarea
          value={form.whatIGive}
          onChange={(e) => setForm({ ...form, whatIGive: e.target.value })}
          placeholder="Hvordan er du som partner? Hva bringer du til bordet?"
        />

        <label>Hva trenger du for å føle deg trygg og sett?</label>
        <textarea
          value={form.whatINeed}
          onChange={(e) => setForm({ ...form, whatINeed: e.target.value })}
          placeholder="Hva gjør at du føler deg trygg, rolig og ivaretatt?"
        />

        <label>Hva forventer du av en partner?</label>
        <textarea
          value={form.expectations}
          onChange={(e) => setForm({ ...form, expectations: e.target.value })}
          placeholder="Hva er viktig for deg i en relasjon?"
        />

        <label>Hva er dine dealbreakers?</label>
        <textarea
          value={form.dealbreakers}
          onChange={(e) => setForm({ ...form, dealbreakers: e.target.value })}
          placeholder="Hva fungerer ikke for deg i et forhold?"
        />

        <button type="submit">Neste</button>
      </form>
    </OnboardingLayout>
  );
}
