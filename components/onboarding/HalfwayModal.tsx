interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HalfwayModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto px-4 w-full shadow-xl text-center">
        <h2 className="text-xl font-semibold mb-6 leading-tight text-[#1A1A1A]">
          Du er halvveis
        </h2>

        <p className="text-sm leading-relaxed text-[#4A4A4A] mb-8">
          Du er på vei! Du har nå kommet halfway. Ta det rolig – vi er her for å hjelpe deg.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-black text-white py-3 rounded-xl text-lg hover:bg-gray-900 transition-all duration-150 ease-out leading-relaxed"
        >
          Fortsett
        </button>
      </div>
    </div>
  );
}
