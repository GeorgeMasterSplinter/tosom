/**
 * ToSom — Chat Layout
 *
 * This layout wraps chat pages. The chat page manages its own
 * WarmFlow context since Next.js layouts only accept `params` and
 * `searchParams` as props.
 */

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}