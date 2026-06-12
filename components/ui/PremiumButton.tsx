export default function PremiumButton({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  const baseClasses =
    "rounded-xl px-6 py-3 font-medium transition-all duration-200 inline-flex items-center justify-center";

  const variantClasses =
    variant === "primary"
      ? "bg-gold text-dark hover:bg-gold/90 shadow-md"
      : "bg-white/10 border border-white/20 text-white hover:bg-white/20";

  const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className} ${disabledClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}