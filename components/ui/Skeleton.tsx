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
      className={`${width} ${height} bg-white/10 animate-pulse ${rounded} ${className}`}
    />
  );
}
