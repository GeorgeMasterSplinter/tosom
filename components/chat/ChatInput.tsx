import { useState } from "react";

export default function ChatInput({ matchId }) {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, content: text }),
    });

    setText("");
  };

  return (
    <div className="p-4 border-t border-neutral-800 flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 bg-neutral-900 text-white px-4 py-2 rounded-xl outline-none"
        placeholder="Skriv en melding…"
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 px-4 py-2 rounded-xl"
      >
        Send
      </button>
    </div>
  );
}
