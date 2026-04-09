export default function MessageBubble({ message }) {
  const isMe = message.isMine;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl ${
          isMe
            ? "bg-blue-600 text-white"
            : "bg-neutral-800 text-neutral-200"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
