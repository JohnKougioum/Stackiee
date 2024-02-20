import { serverEventsConnections, useSSE } from '../utils/server-events'

export default defineEventHandler(async (event) => {
  useSSE(event, event.context?.uid?.uid)
})
