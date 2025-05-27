import { NotificationTypes, SocketEvents } from '@/types'

let sseSource: EventSource | null = null

export function connectSSE(userId: string = '') {
  sseSource = new EventSource(`/api/sse?userId=${userId}`)
  sseSource.addEventListener('open', handleOpen)
  sseSource.addEventListener('message', handleMessage)
  sseSource.addEventListener('error', handleError)
}

export function disconnectSSE() {
  if (sseSource) {
    sseSource.removeEventListener('open', handleOpen)
    sseSource.removeEventListener('message', handleMessage)
    sseSource.removeEventListener('error', handleError)
    sseSource.close()
    sseSource = null
  }
}

function handleOpen(event: MessageEvent) {
  console.log('SSE connection opened:', event)
}

async function handleMessage(event: MessageEvent) {
  const data = JSON.parse(event.data)
  switch (data.type) {
    case SocketEvents.NewConversationCreated:
      handleNewChatSSEEvent()
      break
    case SocketEvents.ConversationParticipantsUpdate:
      handleParticipantsUpdateSSEEvent(data.body.chatId, data.body.participants)
      break
    case SocketEvents.ConversationNameUpdate:
      handleChatNameUpdateSSEEvent(data.body.chatId, data.body.name)
      break
    case NotificationTypes.NewMessage:
      await handleNewMessageSSEEvent(data.body)
      break
    default:
      console.warn('Unknown SSE event type:', data.type)
  }
}

function handleError(error: MessageEvent) {
  console.error('SSE error:', error)
}
