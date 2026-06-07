"use client";

import { useSession } from "next-auth/react";

export default function MessageBubble({ message }: { message: any }) {
  const { data: session } = useSession();
  const isMe = message.senderId === session?.user?.id;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 rounded-lg text-[15px] max-w-[75%] ${
          isMe
            ? "bg-[#1A1A1A] text-white"
            : "bg-white border border-[#E5E5E5] text-[#1A1A1A]"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
