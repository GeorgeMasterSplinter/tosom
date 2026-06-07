export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full space-y-10 animate-pulse">

        {/* Header */}
        <div className="space-y-3">
          <div className="h-7 w-48 bg-neutral-200 rounded-full" />
          <div className="h-4 w-72 bg-neutral-200 rounded-full" />
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-3xl shadow-sm p-10 space-y-8">

          {/* Profile Summary */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-neutral-200" />

            <div className="space-y-2 flex-1">
              <div className="h-5 w-32 bg-neutral-200 rounded-full" />
              <div className="h-4 w-48 bg-neutral-200 rounded-full" />
            </div>
          </div>

          {/* Match Status */}
          <div className="space-y-3">
            <div className="h-5 w-40 bg-neutral-200 rounded-full" />
            <div className="h-4 w-full bg-neutral-200 rounded-full" />
            <div className="h-4 w-3/4 bg-neutral-200 rounded-full" />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <div className="flex-1 h-10 bg-neutral-200 rounded-full" />
            <div className="flex-1 h-10 bg-neutral-200 rounded-full" />
          </div>
        </div>

        {/* Footer */}
        <div className="h-3 w-40 bg-neutral-200 rounded-full mx-auto" />
      </div>
    </div>
  );
}
