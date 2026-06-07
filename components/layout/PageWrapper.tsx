export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#243447] to-[#1E2A38] text-[#EDEDED] container mx-auto px-6 max-w-5xl">
      {children}
    </div>
  )
}
