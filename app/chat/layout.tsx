/**
 * Tosom — Chat Layout (Premium Nordic Gold 2026) ⭐
 * Wrapper for chat-sider med max-width og sentrering.
 */

export const dynamic = "force-dynamic";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen overflow-hidden" style={{ background: "#0B1520" }}>
      {children}
    </div>
  );
}
