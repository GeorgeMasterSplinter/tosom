/**
 * ToSom — Loading Skeleton (Premium)
 * 
 * Gjenbrukbare skeleton-komponentar for alle sider.
 * Bruk under data-innlasting i staden for generisk "Laster..." tekst.
 */

/* ─── CardSkeleton ─── */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div
      className="rounded-[20px] p-6 animate-pulse"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 mb-3 rounded-full"
          style={{
            width: i === lines - 1 ? `${60 + i * 10}%` : "100%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── ChatSkeleton ─── */
export function ChatSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 animate-pulse"
          style={{ marginLeft: i % 2 === 0 ? "0" : "24px" }}
        >
          <div
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-3 rounded-full"
              style={{
                width: `${40 + (i % 3) * 20}%`,
                background: "rgba(255,255,255,0.08)",
              }}
            />
            {i % 2 === 0 && (
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${30 + (i % 4) * 15}%`,
                  background: "rgba(255,255,255,0.05)",
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── DashboardSkeleton ─── */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="animate-pulse space-y-3">
        <div
          className="h-8 rounded-full w-48"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />
        <div
          className="h-4 rounded-full w-72"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 animate-pulse"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div
                className="w-8 h-8 rounded-full"
                style={{ background: "rgba(212,175,55,0.15)" }}
              />
              <div
                className="h-3 rounded-full w-20"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
              <div
                className="h-6 rounded-full w-16"
                style={{ background: "rgba(255,255,255,0.12)" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Content cards */}
      <CardSkeleton lines={4} />
      <CardSkeleton lines={3} />
    </div>
  );
}

/* ─── AdminListSkeleton ─── */
export function AdminListSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl animate-pulse"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="h-3 rounded-full w-48"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
            <div
              className="h-2 rounded-full w-32"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>
          <div
            className="px-3 py-1 rounded-md h-6 flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── ProfileSkeleton ─── */
export function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Avatar + name */}
      <div className="flex items-center gap-5">
        <div
          className="w-24 h-24 rounded-full flex-shrink-0"
          style={{ background: "rgba(212,175,55,0.15)" }}
        />
        <div className="space-y-3">
          <div
            className="h-6 rounded-full w-48"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="h-4 rounded-full w-32"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
        </div>
      </div>

      {/* Info sections */}
      <CardSkeleton lines={3} />
      <CardSkeleton lines={4} />
      <CardSkeleton lines={2} />
    </div>
  );
}

/* ─── MatchingSkeleton ─── */
export function MatchingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="text-center space-y-4">
        <div
          className="h-8 rounded-full w-64 mx-auto"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />
        <div
          className="h-4 rounded-full w-96 mx-auto"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      </div>

      {/* Match card */}
      <div
        className="rounded-[20px] p-8 text-center"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <div
          className="w-32 h-32 rounded-full mx-auto mb-6"
          style={{ background: "rgba(212,175,55,0.15)" }}
        />
        <div
          className="h-5 rounded-full w-48 mx-auto mb-3"
          style={{ background: "rgba(255,255,255,0.12)" }}
        />
        <div
          className="h-4 rounded-full w-64 mx-auto"
          style={{ background: "rgba(255,255,255,0.08)" }}
        />

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div
                className="h-4 rounded-full w-12 mx-auto"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />
              <div
                className="h-3 rounded-full w-8 mx-auto"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── LoadingOverlay ─── */
export function LoadingOverlay({ message = "Lastar..." }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(11,21,32,0.85)", backdropFilter: "blur(4px)" }}
    >
      <div className="text-center space-y-4">
        <div
          className="w-10 h-10 rounded-full mx-auto border-2 border-[rgba(212,175,55,0.2)] border-t-[#D4AF37]"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          {message}
        </p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}