import { useEffect, useState } from "react";
import OnboardingLayout from "../../components/OnboardingLayout";

export default function Step8() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/getProfile");
      const data = await res.json();
      setProfile(data);
    }
    loadProfile();
  }, []);

  async function handleComplete() {
    window.location.href = "/onboarding/complete";
  }

  if (!profile) return <OnboardingLayout><p>Laster...</p></OnboardingLayout>;

  return (
    <OnboardingLayout>
      <h1>Steg 8: Oppsummering</h1>
      <p>
        Se gjennom informasjonen din. Du kan gå tilbake og endre hvis du ønsker.
        Profilen din er privat — ingen andre brukere får se den.
      </p>

      <div style={{ marginTop: 20 }}>
        <h2>Oppsummering</h2>

        <pre style={{
          background: "#f5f5f5",
          padding: 20,
          borderRadius: 8,
          whiteSpace: "pre-wrap"
        }}>
{JSON.stringify(profile, null, 2)}
        </pre>
      </div>

      <button onClick={handleComplete} style={{ marginTop: 20 }}>
        Fullfør profil
      </button>
    </OnboardingLayout>
  );
}
