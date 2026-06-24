export default function KnowYouCard({ question, onAnswer }) {
  return (
    <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-8 max-w-xl mx-auto shadow-lg">
      <h2 className="text-2xl font-light mb-4">{question}</h2>

      <button
        onClick={onAnswer}
        className="px-6 py-3 rounded-full bg-[#CBAA7A] text-black font-medium hover:bg-[#d8b98b] transition"
      >
        Svar
      </button>
    </div>
  );
}
