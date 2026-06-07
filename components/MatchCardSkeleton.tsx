export default function MatchCardSkeleton() {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm border border-black/5 rounded-3xl shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-6">

        {/* Image placeholder */}
        <div className="w-20 h-20 rounded-2xl bg-neutral-200" />

        {/* Text placeholders */}
        <div className="flex-1 space-y-3">
          <div className="h-5 w-32 bg-neutral-200 rounded-full" />
          <div className="h-4 w-48 bg-neutral-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
