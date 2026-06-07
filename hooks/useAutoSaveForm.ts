export function useAutoSaveForm(step: number) {
  return (formData: FormData) => {
    formData.append("step", String(step));
    fetch("/api/onboarding/save", {
      method: "POST",
      body: formData,
    });
  };
}
