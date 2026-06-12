/* ------ Demo-mode helpers ------ */

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;

  try {
    if (localStorage.getItem("tosom_demo") === "true") return true;
  } catch {
    /* ignore */
  }

  if (typeof window !== "undefined" && typeof URLSearchParams !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "1") return true;
  }

  return false;
}

export function enableDemoMode(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("tosom_demo", "true");
  } catch {
    /* ignore */
  }
}

export function disableDemoMode(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem("tosom_demo");
  } catch {
    /* ignore */
  }
}
