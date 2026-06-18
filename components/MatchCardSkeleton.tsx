export default function MatchCardSkeleton() {
  return (
    <div className="w-full bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-xl rounded-3xl shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-6">
        {/* Image placeholder */}
        <div className="w-20 h-20 rounded-2xl bg-white/[0.06] border border-white/[0.04]" />

        {/* Text placeholders */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-5 w-32 bg-white/[0.08] rounded-full" />
          <div className="h-4 w-48 bg-white/[0.06] rounded-full" />
        </div>
      </div>
    </div>
  );
}