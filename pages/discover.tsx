import { useEffect, useState } from "react";

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch("/api/discover")
      .then((res) => res.json())
      .then((data) => setProfiles(data));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Oppdag</h1>

      {profiles.length === 0 && <p>Ingen profiler funnet.</p>}

      {profiles.map((p: any) => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <h3>{p.name}</h3>
          <p>Alder: {p.age}</p>
          <p>Kjønn: {p.gender}</p>
          <p>Bio: {p.bio}</p>
        </div>
      ))}
    </div>
  );
}
