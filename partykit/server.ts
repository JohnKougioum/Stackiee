import type * as Party from 'partykit/server'
import type { Message } from '@prisma/client'
import { SocketEvents } from '~/types'

export default class WebSocketServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  // options: Party.ServerOptions = { hibernate: true }

  // handling incoming requests
  async onRequest(request: Party.Request) {
    if (request.method === 'POST') {
      const payload = await request.json<{ message: Message & {
        sender: {
          id: string
          uid: string
        } } }>()

      for (const connection of this.room.getConnections()) {
        if (connection.id === payload.message.senderId)
          continue
        connection.send(JSON.stringify({ eventName: SocketEvents.NewMessage, message: payload.message }))
      }
      return new Response('OK')
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
