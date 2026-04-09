import { useEffect, useState } from "react";
import BliKjentCard from "./BliKjentCard";

export default function BliKjentDrawer({ matchId }) {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetch("/api/bli-kjent/list")
      .then((res) => res.json())
      .then(setCards);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-20 right-4 bg-neutral-800 p-3 rounded-full shadow-lg"
      >
        💬
      </button>

      {open && (
        <div className="absolute bottom-0 left-0 right-0 bg-neutral-900 p-4 border-t border-neutral-700 max-h-[50%] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Bli bedre kjent</h2>

          <div className="space-y-2">
            {cards.map((card) => (
              <BliKjentCard key={card.id} card={card} matchId={matchId} />
            ))}
          </div>

          <button
            onClick={() => setOpen(false)}
            className="mt-4 text-neutral-400"
          >
            Lukk
          </button>
        </div>
      )}
    </>
  );
}
