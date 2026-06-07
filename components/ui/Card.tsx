export default function Card({ children }) {
  return (
        <div className="bg-[#EDEAE6] border border-[#E5E5E5] rounded-xl p-6 shadow-sm hover:scale-101 transition-transform duration-300 ease-in-out">
      {children}
    </div>
  )
}
