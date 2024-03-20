import type { H3Event } from 'h3'

let connections: Array<{
  id: string
  eventSteam: any
}> = []

export const serverEventsConnections = {
  connections,
}

export async function createConnection(id: string, event: H3Event) {
  const eventStream = createEventStream(event)

  serverEventsConnections.connections.push({
    id,
    eventSteam: eventStream,
  })
  setTimeout(async () => {
    await eventStream.push('Hello world')
  }, 1000)

  eventStream.onClosed(async () => {
    await eventStream.close()
    connections = connections.filter(c => c.id !== id)
  })

  return eventStream.send()
}

export async function sendSSeEvent(id: string, data: string) {
  const connection = connections.find(c => c.id === id)
  if (connection)
    await connection.eventSteam.push(data)
}
