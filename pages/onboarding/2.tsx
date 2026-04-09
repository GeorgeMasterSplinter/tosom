import { useState } from "react";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function Step2() {
  const [form, setForm] = useState({
    dayRhythm: "",
    weekendStyle: "",
    travelStyle: "",
    activityLevel: "",
    socialLevel: "",
    financialStyle: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    window.location.href = "/onboarding/3";
  }

  return (
    <OnboardingLayout>
      <h1>Steg 2: Livsstil</h1>
      <p>Livsstil handler om rytmen i livet ditt. Dette hjelper oss å finne noen som passer inn i hverdagen din.</p>

      <form onSubmit={handleSubmit}>

        <label>Døgnrytme</label>
        <select
          value={form.dayRhythm}
          onChange={(e) => setForm({ ...form, dayRhythm: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="morning">Morgenmenneske</option>
          <option value="evening">Kveldsmenneske</option>
          <option value="flexible">Fleksibel</option>
        </select>

        <label>Helgevaner</label>
        <select
          value={form.weekendStyle}
          onChange={(e) => setForm({ ...form, weekendStyle: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="calm">Rolig hjemme</option>
          <option value="social">Sosial</option>
          <option value="active">Aktiv</option>
          <option value="family">Familieorientert</option>
        </select>

        <label>Reisestil</label>
        <select
          value={form.travelStyle}
          onChange={(e) => setForm({ ...form, travelStyle: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="hotel">Hotell</option>
          <option value="camping">Camping</option>
          <option value="roadtrip">Roadtrip</option>
          <option value="mc">MC</option>
          <option value="car">Bil</option>
          <option value="fly">Fly</option>
        </select>

        <label>Aktivitetsnivå</label>
        <select
          value={form.activityLevel}
          onChange={(e) => setForm({ ...form, activityLevel: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="low">Lavt</option>
          <option value="moderate">Moderat</option>
          <option value="high">Høyt</option>
        </select>

        <label>Sosialt nivå</label>
        <select
          value={form.socialLevel}
          onChange={(e) => setForm({ ...form, socialLevel: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="introvert">Introvert</option>
          <option value="ambivert">Ambivert</option>
          <option value="extrovert">Ekstrovert</option>
        </select>

        <label>Økonomisk stil</label>
        <select
          value={form.financialStyle}
          onChange={(e) => setForm({ ...form, financialStyle: e.target.value })}
        >
          <option value="">Velg</option>
          <option value="saver">Sparsom</option>
          <option value="balanced">Balansert</option>
          <option value="spontaneous">Spontan</option>
        </select>

        <button type="submit">Neste</button>
      </form>
    </OnboardingLayout>
  );
}
