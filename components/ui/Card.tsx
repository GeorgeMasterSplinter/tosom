import clsx from "clsx";

export default function Card({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <div
      className={clsx(
        "flex flex-col rounded-xl bg-[var(--color-card)] p-[var(--space-md)] shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
