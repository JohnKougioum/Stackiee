import type * as Party from 'partykit/server'
import type { Message } from '@prisma/client'
import { SocketEvents } from '~/types'

export default class WebSocketServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  // options: Party.ServerOptions = { hibernate: true }

  // handling incoming requests
  async onRequest(request: Party.Request) {
    if (request.method === 'POST') {
      const payload = await request.json<{ socketEvent: SocketEvents; message: any }>()
      if (payload.socketEvent === SocketEvents.NewMessage) {
        const message = payload.message as Message
        for (const connection of this.room.getConnections()) {
          if (connection.id === message.senderId)
            continue
          connection.send(JSON.stringify({ eventName: SocketEvents.NewMessage, message }))
        }
        return new Response('OK')
      }

      if (payload.socketEvent === SocketEvents.ConversationNameUpdate) {
        this.room.broadcast(JSON.stringify({ eventName: SocketEvents.ConversationNameUpdate, message: payload.message }))
        return new Response('OK')
      }
      if (payload.socketEvent === SocketEvents.ConversationParticipantsUpdate) {
        this.room.broadcast(JSON.stringify({ eventName: SocketEvents.ConversationParticipantsUpdate, message: payload.message }))
        return new Response('OK')
      }
    }
    return new Response('Not found', { status: 404 })
  }

  onMessage(message: string, sender: Party.Connection<unknown>): void | Promise<void> {
    const messageString = JSON.parse(message) as { eventName: number; message: any }
    if (messageString.eventName === SocketEvents.ConversationUpdated)
      this.room.broadcast(JSON.stringify({ eventName: SocketEvents.ConversationUpdated, message: '' }))
  }

  // when a client disconnects
  onClose(connection: Party.Connection) {
    this.room.broadcast(`So sad! ${connection.id} left the party!`)
  }
}
