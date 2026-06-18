export default function Skeleton({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-lg",
  className = "",
}: {
  width?: string;
  height?: string;
  rounded?: string;
  className?: string;
}) {
  return (
    <div
      className={`${width} ${height} rounded-[var(--radius-sm)] bg-[var(--glass-bg)] animate-pulse ${className}`}
    />
  );
}
