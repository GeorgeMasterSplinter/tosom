import Header from '../../components/Header'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function ChatPage() {
  const router = useRouter()
  const { id } = router.query

  // Midlertidige dummy-meldinger
  const initialMessages = [
    { from: 'them', text: 'Hei! Hvordan går det?' },
    { from: 'me', text: 'Hei! Det går bra, hva med deg?' },
    { from: 'them', text: 'Bare fint 😊' },
  ]

  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return

    setMessages([...messages, { from: 'me', text: input }])
    setInput('')

    // Her kan du senere legge til:
    // - WebSocket send
    // - DB lagring
    // - Typing indicator
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-black text-white flex flex-col px-6 py-6">
        <h1 className="text-2xl font-semibold text-center mt-4 mb-6">
          Samtale med bruker #{id}
        </h1>

        {/* Meldingsområde */}
        <div className="flex-1 overflow-y-auto border border-gray-800 rounded-lg p-4 flex flex-col gap-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-xs px-4 py-3 rounded-lg ${
                msg.from === 'me'
                  ? 'bg-white text-black self-end'
                  : 'bg-gray-800 text-white self-start'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Inputfelt */}
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black border border-gray-700 rounded-md px-4 py-3 text-white focus:outline-none focus:border-gray-400"
            placeholder="Skriv en melding..."
          />

          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition"
          >
            Send
          </button>
        </div>
      </main>
    </>
  )
}
