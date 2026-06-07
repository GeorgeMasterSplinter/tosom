export default function SystemMessage({ content }: { content: string }) {
  return (
    <div className="text-center text-[13px] text-[#777] px-6 leading-relaxed">
      {content}
    </div>
  );
}
