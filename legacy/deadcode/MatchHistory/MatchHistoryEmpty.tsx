export default function MatchHistoryEmpty() {
  return (
    <div className="bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-xl p-8 text-center">
      <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-white font-medium mb-2">Ingen match-historikk enda</h3>
      <p className="text-neutral-400 text-sm">
        Når du har fullført dine første matcher, vil de vises her.
      </p>
    </div>
  );
}