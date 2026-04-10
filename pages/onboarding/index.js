

export default function OnboardingWelcome() {
  return (
    <>
    

      <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-32">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Velkommen til ToSom
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Før vi matcher deg med noen som faktisk passer deg, trenger vi å bli litt
          bedre kjent med deg. Det tar bare et par minutter.
        </p>

        <a
          href="/onboarding/step1"
          className="mt-10 px-8 py-4 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
        >
          Start
        </a>
      </main>
    </>
  )
}
