

export default function MessagesList() {
  // Midlertidige dummy-samtaler
  const conversations = [
    {
      id: 1,
      name: 'Maria, 32',
      lastMessage: 'Høres koselig ut 😊',
      time: 'I dag',
    },
    {
      id: 2,
      name: 'Thomas, 29',
      lastMessage: 'Skal vi ta en kaffe en dag?',
      time: 'I går',
    },
    {
      id: 3,
      name: 'Elise, 35',
      lastMessage: 'Haha, den var bra 😂',
      time: '2 dager siden',
    },
  ]

  return (
    <>
    

      <main className="min-h-screen bg-black text-white px-6 py-24 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-center">
          Meldinger
        </h1>

        <p className="text-gray-400 text-lg mt-4 max-w-xl text-center leading-relaxed">
          Her finner du alle samtalene dine.
        </p>

        <div className="mt-16 w-full max-w-2xl flex flex-col gap-4">
          {conversations.map((conv) => (
            <a
              key={conv.id}
              href={`/messages/${conv.id}`}
              className="border border-gray-800 rounded-lg p-4 flex justify-between items-center hover:border-gray-600 transition"
            >
              <div>
                <h2 className="text-xl font-semibold">{conv.name}</h2>
                <p className="text-gray-400 text-sm mt-1">{conv.lastMessage}</p>
              </div>

              <span className="text-gray-500 text-sm">{conv.time}</span>
            </a>
          ))}
        </div>

        <p className="text-gray-600 text-sm mt-10">
          Flere samtaler vises her etter hvert.
        </p>
      </main>
    </>
  )
}
