import { motion } from "framer-motion";

export default function MatchBreakdownSkeleton() {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-card-border)] backdrop-blur-xl rounded-xl p-6">
      <div className="mb-6">
        <motion.div
          className="h-6 w-32 bg-white/[0.08] rounded mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="h-8 w-16 bg-white/[0.1] rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="flex flex-col gap-[var(--space-sm)] mb-6">
        <div className="h-2 bg-white/[0.06] rounded w-full" />
        <div className="h-2 bg-white/[0.06] rounded w-3/4" />
      </div>

      <div className="flex flex-col gap-[var(--space-md)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-[var(--space-xs)]">
            <div className="h-4 w-1/3 bg-white/[0.08] rounded" />
            <div className="h-2 bg-white/[0.06] rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}