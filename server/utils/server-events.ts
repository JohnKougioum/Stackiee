import type { H3Event } from 'h3'

const connections = new Map<string, any>()

export const serverEventsConnections = {
  connections,
}

export async function createConnection(id: string, event: H3Event) {
  const eventStream = createEventStream(event)

  connections.set(id, eventStream)

  setTimeout(async () => {
    await eventStream.push(JSON.stringify({ type: 'initialize', message: 'Connected' }))
  }, 1000)

  eventStream.onClosed(async () => {
    await eventStream.close()
    connections.delete(id)
  })

  return eventStream.send()
}

export async function sendSSEEvent(id: string, data: string) {
  const connection = connections.get(id)
  if (connection)
    await connection.push(data)
}
