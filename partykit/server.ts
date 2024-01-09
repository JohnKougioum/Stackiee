import type * as Party from 'partykit/server'
import type { Message } from '@prisma/client'

export default class WebSocketServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  // async onConnect(connection: Party.Connection) {
  // }

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
        connection.send(JSON.stringify(payload.message))
      }
      return new Response('OK')
    }
    return new Response('Not found', { status: 404 })
  }

  // when a client disconnects
  onClose(connection: Party.Connection) {
    this.room.broadcast(`So sad! ${connection.id} left the party!`)
  }
}
