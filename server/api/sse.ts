import { createConnection, serverEventsConnections } from '../utils/server-events'

export default defineEventHandler(async (event) => {
  return await createConnection(event.context.id.id, event)
})
