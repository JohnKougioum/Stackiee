import io from 'socket.io-client'

export default defineNuxtPlugin(() => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const socket = io(`${wsProtocol}//${window.location.host}`)

  return {
    provide: {
      socket,
    },
  }
})
