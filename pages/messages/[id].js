
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Chat() {
  const router = useRouter()
  const { id: otherId } = router.query

  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    if (!otherId) return

    const userId = localStorage.getItem('userId')

    // Hent historikk
    fetch(`/api/chat/history?userId=${userId}&otherId=${otherId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))

    // Start realtime stream
    const stream = new EventSource(`/api/chat/stream?userId=${userId}`)

    stream.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'message') {
        setMessages((prev) => [...prev, data])
      }

      if (data.type === 'typing' && data.from === otherId) {
        setTyping(true)
        setTimeout(() => setTyping(false), 1500)
      }
    }

    return () => stream.close()
  }, [otherId])

  const sendMessage = async () => {
    const userId = localStorage.getItem('userId')

    await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: userId,
        to: otherId,
        text: input,
      }),
    })

    setInput('')
  }

  const sendTyping = () => {
    const userId = localStorage.getItem('userId')

    fetch('/api/chat/typing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: userId,
        to: otherId,
      }),
    })
  }

  return (
    <>
      

      <main className="min-h-screen bg-black text-white px-6 py-20">
        <h1 className="text-2xl font-semibold mb-6">Chat</h1>

        <div className="flex flex-col gap-4 mb-20">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg max-w-xs ${
                m.from === localStorage.getItem('userId')
                  ? 'bg-blue-600 self-end'
                  : 'bg-gray-800 self-start'
              }`}
            >
              {m.text}
            </div>
          ))}

          {typing && (
            <p className="text-gray-500 text-sm italic">Skriver…</p>
          )}
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 p-4 flex gap-2">
          <input
            className="flex-1 bg-gray-900 text-white p-3 rounded-md"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              sendTyping()
            }}
            placeholder="Skriv en melding…"
          />

          <button
            onClick={sendMessage}
            className="px-6 bg-white text-black rounded-md font-medium"
          >
            Send
          </button>
        </div>
      </main>
    </>
  )
}
