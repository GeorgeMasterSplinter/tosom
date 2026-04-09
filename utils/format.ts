export function formatName(name: string) {
  if (!name) return "";
  return name.trim().replace(/\s+/g, " ");
}

export function formatAge(age: number) {
  if (!age || age < 0) return null;
  return Math.floor(age);
}
