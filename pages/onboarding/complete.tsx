import OnboardingLayout from "../../components/OnboardingLayout";

export default function Complete() {
  return (
    <OnboardingLayout>
      <h1>Profilen din er fullført</h1>
      <p>
        Vi begynner nå å analysere profilen din for å finne dine beste matcher.
        Dette kan ta litt tid — vi prioriterer kvalitet over hastighet.
      </p>

      <a href="/dashboard">Gå til dashboard</a>
    </OnboardingLayout>
  );
}
