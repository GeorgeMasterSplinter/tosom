export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full flex flex-col gap-10 animate-pulse">

        {/* Header */}
        <div className="flex flex-col gap-[var(--space-sm)]">
          <div className="h-7 w-48 bg-white/[0.08] rounded-full" />
          <div className="h-4 w-72 bg-white/[0.06] rounded-full" />
        </div>

        {/* Main Card */}
        <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-xl rounded-2xl shadow-md p-10 flex flex-col gap-8">

          {/* Profile Summary */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/[0.06] border border-white/[0.04]" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-5 w-32 bg-white/[0.08] rounded-full" />
              <div className="h-4 w-48 bg-white/[0.06] rounded-full" />
            </div>
          </div>

          {/* Match Status */}
          <div className="flex flex-col gap-3">
            <div className="h-5 w-40 bg-white/[0.08] rounded-full" />
            <div className="h-4 w-full bg-white/[0.06] rounded-full" />
            <div className="h-4 w-3/4 bg-white/[0.06] rounded-full" />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <div className="flex-1 h-10 bg-white/[0.06] rounded-full" />
            <div className="flex-1 h-10 bg-white/[0.06] rounded-full" />
          </div>
        </div>

        {/* Footer */}
        <div className="h-3 w-40 bg-white/[0.06] rounded-full mx-auto" />
      </div>
    </div>
  );
}