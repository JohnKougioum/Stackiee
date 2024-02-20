import type { H3Event } from 'h3'
import { createHooks } from 'hookable'

const connections: Array<{
  id: string
  send: (data: unknown) => void
}> = []
export const serverEventsConnections = {
  connections,
}

export interface ServerSentEvent {
  [key: string]: <T, R>(data: T) => R | void
}

export const sseHooks = createHooks<ServerSentEvent>()

export function useSSE(event: H3Event, userId: string) {
  setHeader(event, 'content-type', 'text/event-stream')
  setHeader(event, 'cache-control', 'no-cache')
  setHeader(event, 'connection', 'keep-alive')
  setResponseStatus(event, 200)

  let counter = 0
  sseHooks.hook('sse:event', (data: unknown) => {
    event.node.res.write(`id: ${++counter}\n`)
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
  })

  const sendEvent = (data: unknown) => {
    sseHooks.callHook('sse:event', data)
  }
  sendEvent({ message: 'connected' })

  const close = () => {
    event.node.res.end()
  }

  event._handled = true
  event.node.req.on('close', close)

  connections.push({
    id: userId,
    send: (data: unknown) => sendEvent(data),
  })

  return { sendEvent, close }
}
