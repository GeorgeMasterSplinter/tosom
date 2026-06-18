export default function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`mx-auto max-w-[var(--section-max-w, 56rem)] px-[var(--space-lg)] py-[var(--space-2xl)] md:py-[var(--space-3xl)] gap-[var(--space-xl)] ${className}`}
    >
      {children}
    </section>
  );
}
