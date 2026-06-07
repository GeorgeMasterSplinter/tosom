import { motion } from "framer-motion";

export default function MatchBreakdownSkeleton() {
  return (
    <div className="bg-[#1E2A38]/60 border border-[#CBAA7A]/20 rounded-xl p-6">
      <div className="mb-6">
        <motion.div 
          className="h-6 w-32 bg-neutral-800 rounded mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="h-8 w-16 bg-neutral-800 rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <div className="space-y-4 mb-6">
        <div className="h-2 bg-neutral-800 rounded w-full"></div>
        <div className="h-2 bg-neutral-800 rounded w-3/4"></div>
      </div>

      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/3 bg-neutral-800 rounded"></div>
            <div className="h-2 bg-neutral-800 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}