export default function GlassPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-md dark:bg-dark-card/80">
      {children}
    </div>
  )
}
