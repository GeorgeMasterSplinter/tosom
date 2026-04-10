import { EventEmitter } from 'events'

export const events = new EventEmitter()

// Hvis du har andre funksjoner, behold dem:
export function sendMessage(payload) {
  events.emit('message', payload)
}

export function sendTyping(payload) {
  events.emit('typing', payload)
}
