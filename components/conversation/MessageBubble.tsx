"use client";

import { useSession } from "next-auth/react";

export default function MessageBubble({ message }: { message: any }) {
  const { data: session } = useSession();
  const isMe = message.senderId === session?.user?.id;

  const timeStr = message.sentAt
    ? new Date(message.sentAt).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })
    : "";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%]">
        <div
          className={`rounded-2xl px-4 py-3 shadow-md shadow-black/20 ${
            isMe
              ? "bg-white text-gray-900"
              : "bg-white/5 border border-white/10 backdrop-blur-sm text-gray-200"
          }`}
        >
          {message.content}
        </div>
        {timeStr && (
          <p className={`text-xs text-gray-500 mt-1 ${isMe ? "text-right" : "text-left"}`}>
            {timeStr}
          </p>
        )}
      </div>
    </div>
  );
}
