export default function BliKjentCard({ card, matchId }) {
  const sendCard = async () => {
    await fetch("/api/chat/send-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, cardId: card.id }),
    });
  };

  return (
    <button
      onClick={sendCard}
      className="w-full text-left bg-neutral-800 p-3 rounded-xl hover:bg-neutral-700 transition"
    >
      <div className="text-neutral-200">{card.text}</div>
      <div className="text-xs text-neutral-500 mt-1">
        {card.category.toLowerCase()}
      </div>
    </button>
  );
}
