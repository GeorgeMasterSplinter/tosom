export default function SystemMessage({ content }: { content: string }) {
  return (
    <div className="text-center text-gray-400 text-sm py-2">
      {content}
    </div>
  );
}
