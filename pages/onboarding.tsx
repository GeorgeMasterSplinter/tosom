import { useState } from "react";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age, gender, bio, interests }),
    });

    window.location.href = "/dashboard";
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Onboarding</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br/><br/>

        <input
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        /><br/><br/>

        <input
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        /><br/><br/>

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        /><br/><br/>

        <input
          placeholder="Interests"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
        /><br/><br/>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
