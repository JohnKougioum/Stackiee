export default defineNuxtPlugin(() => {
  let ws: WebSocket | undefined

  return {
    provide: {
      ws,
      connectWebsocket: async (userId: string) => {
        const isSecure = location.protocol === 'https:'
        const url = `${(isSecure ? 'wss://' : 'ws://') + location.host}/api/chat-ws?userId=${userId}`
        if (ws)
          ws.close()

        ws = new WebSocket(url)

        await new Promise(resolve => ws!.addEventListener('open', resolve))
      },
    },
  }
})
