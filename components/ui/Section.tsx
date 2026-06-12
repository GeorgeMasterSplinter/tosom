export default function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`w-full max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-6 ${className}`}>
      {children}
    </section>
  );
}
