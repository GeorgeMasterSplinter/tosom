export default function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/5 dark:bg-dark-card/70 backdrop-blur-md shadow-md p-6 space-y-3 ${className}`}>
      {children}
    </div>
  );
}
