import { events } from '../../../lib/realtime'

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const { userId } = req.query

  const send = (event) => {
    if (event.to === userId || event.from === userId) {
      res.write(`data: ${JSON.stringify(event)}\n\n`)
    }
  }

  events.on('message', send)
  events.on('typing', send)

  req.on('close', () => {
    events.off('message', send)
    events.off('typing', send)
  })
}
