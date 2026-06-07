export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-[#777] text-[13px] px-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-[#CCC] rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-[#CCC] rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-[#CCC] rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      skriver…
    </div>
  );
}
