export default defineNuxtPlugin(() => {
  const ws = ref<WebSocket | undefined>()

  return {
    provide: {
      ws,
      connectWebsocket: async (userId: string) => {
        const isSecure = location.protocol === 'https:'
        const url = `${(isSecure ? 'wss://' : 'ws://') + location.host}/api/chat-ws?userId=${userId}`
        if (ws.value)
          ws.value.close()

        ws.value = new WebSocket(url)
        await new Promise(resolve => ws.value!.addEventListener('open', resolve))
      },
    },
  }
})
