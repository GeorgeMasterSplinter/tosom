export default function MatchHistorySkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-neutral-800 rounded-full animate-pulse"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-neutral-800 rounded w-1/3 animate-pulse"></div>
              <div className="h-3 bg-neutral-800 rounded w-1/2 animate-pulse"></div>
              <div className="h-3 bg-neutral-800 rounded w-1/4 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 bg-neutral-800 rounded w-full animate-pulse"></div>
            <div className="h-2 bg-neutral-800 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}