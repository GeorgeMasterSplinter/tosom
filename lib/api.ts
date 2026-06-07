export async function fetchMatchById(id: string) {
  const res = await fetch(`/api/match/${id}`);
  if (!res.ok) throw new Error("Failed to fetch match");
  return res.json();
}

export async function fetchUserById(id: string) {
  const res = await fetch(`/api/user/${id}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}
