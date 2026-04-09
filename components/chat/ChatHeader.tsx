export default function ChatHeader({ matchId }) {
  return (
    <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
      <div className="text-lg font-semibold">Match</div>
      <div className="text-sm text-neutral-400">Chat aktiv</div>
    </div>
  );
}
