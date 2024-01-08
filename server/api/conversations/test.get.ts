import PartySocket from 'partysocket'

export default defineEventHandler(async () => {
  await PartySocket.fetch(
    { host: 'http://localhost:1999', room: 'chat' },
    {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello from server!' }),
    },
  )
  return {
    body: 'ok',
  }
})
