import type * as Party from 'partykit/server'

export default class WebSocketServer implements Party.Server {
  constructor(readonly room: Party.Room) {}
  async onConnect(connection: Party.Connection) {
    // welcome the new joiner
    connection.send(`Welcome, ${connection.id}`)
    // let everyone else know that a new connection joined
    this.room.broadcast(`Heads up! ${connection.id} joined the party!`, [
      connection.id,
    ])
  }

  // handling incoming requests
  async onRequest(request: Party.Request) {
    // push new message
    if (request.method === 'POST') {
      const payload = await request.json<{ message: string }>()
      this.room.broadcast(payload.message)
      return new Response('OK')
    }
  }

  // when a client disconnects
  onClose(connection: Party.Connection) {
    this.room.broadcast(`So sad! ${connection.id} left the party!`)
  }
}
