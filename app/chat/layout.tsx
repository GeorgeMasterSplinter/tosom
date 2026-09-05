/**
 * Tosom — Chat Layout (Premium Nordic Gold 2026) ⭐
 * Wrapper for chat-sider med max-width og sentrering.
 *
 * CHAT-POLISH (C-4): responsivt
 *  - 100dvh (dynamisk viewporthøgd) — på mobil legg adresselinja no lenger
 *    ikke inputfeltet bak seg (h-screen/100vh ignorerer nettleser-kromen).
 *    Fallback: 100vh for nettlesarar uten dvh-støtte.
 *  - Desktop (≥768px): samtalen blir et sentrert kort i staden for
 *    fullbredd-mørk vegg (samarbeid med .tosom-chat-card på ChatContainer).
 */

export const dynamic = "force-dynamic";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        .tosom-chat-layout { height: 100vh; }
        @supports (height: 100dvh) {
          .tosom-chat-layout { height: 100dvh; }
        }
        /* Samtalen fyller hele skjermen — kant til kant på alle størrelser */
        .tosom-chat-card {
          width: 100%;
          height: 100%;
        }
        @media (min-width: 768px) {
          .tosom-chat-card {
            height: calc(100% - 0px);
          }
        }
        /* Samtalelista: lite padding på mobil, luftig på desktop */
        .tosom-chat-list-wrap { padding: 16px; }
        @media (min-width: 768px) {
          .tosom-chat-list-wrap { padding: 96px; }
        }
      `}</style>
      <main
        className="tosom-chat-layout w-full overflow-hidden"
        style={{ background: "#0B1520" }}
      >
        {children}
      </main>
    </>
  );
}
