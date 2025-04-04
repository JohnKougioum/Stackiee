import type { Peer } from 'crossws'
import { getQuery } from 'ufo'
import { addMessageDB } from '~/server/utils/chat-utils'
import { SocketEvents } from '~/types'
import { Redo, Undo, createHistoryPoint, getWhiteboardData, setWhiteboardEntry } from '~/server/utils/whiteboard-server'

const users = new Map<string, { online: boolean }>()

export default defineWebSocketHandler({
  async open(peer) {
    const userId = getUserId(peer)
    users.set(userId, { online: true })
    peer.send({
      user: 'server',
      message: 'Connected',
    })
  },
  async message(peer, event) {
    const data = JSON.parse(await event.text())
    const userId = getUserId(peer)
    if (data.eventName === SocketEvents.JoinChat) {
      peer.subscribe(data.chatId)
      peer.send({
        eventName: SocketEvents.JoinChat,
      })
    }
    if (data.eventName === SocketEvents.LeaveChat) {
      peer.unsubscribe(data.chatId)
      peer.send({
        eventName: SocketEvents.LeaveChat,
        chatId: data.chatId,
      })
    }
    if (data.eventName === SocketEvents.NewMessage) {
      try {
        const message = await addMessageDB(userId, data.chatId, data.message)
        const _message = {
          user: userId,
          message,
          chatId: data.chatId,
          eventName: data.eventName,
        }
        peer.send(_message)
        peer.publish(data.chatId, _message)
      }
      catch (error) {
        console.error('Error adding message to db', error)
        peer.send({
          eventName: SocketEvents.MessageError,
          message: 'There was an error adding the message to the database. Please try again.',
        })
      }
    }
    if (data.eventName === SocketEvents.WhiteboardJoined) {
      const chatId = data.chatId
      peer.subscribe(`whiteboard-${chatId}`)
      peer.send({
        user: 'sever',
        message: `joined ${chatId} whiteboard`,
        eventName: SocketEvents.WhiteboardJoined,
        data: getWhiteboardData(chatId),
      })
    }
    if (data.eventName === SocketEvents.WhiteboardLeft) {
      peer.unsubscribe(`whiteboard-${data.chatId}`)
      peer.send({
        user: 'server',
        message: 'left whiteboard',
      })
    }
    if (data.eventName === SocketEvents.WhiteboardEvent) {
      const entry = setWhiteboardEntry(data.chatId, data.data)
      peer.publish(`whiteboard-${data.chatId}`, {
        eventName: SocketEvents.WhiteboardEvent,
        data: entry,
      })
    }
    if (data.eventName === SocketEvents.WhiteboardDeleteElement) {
      peer.publish(`whiteboard-${data.chatId}`, {
        eventName: SocketEvents.WhiteboardDeleteElement,
        data: data.data,
      })
    }
    if (data.eventName === SocketEvents.WhiteboardHistoryPointCreation)
      createHistoryPoint(data.chatId, data.data)
    if (data.eventName === SocketEvents.WhiteboardUndo) {
      const undoData = Undo(data.chatId)
      peer.send({
        eventName: SocketEvents.WhiteboardUndo,
        data: undoData,
      })
      peer.publish(`whiteboard-${data.chatId}`, {
        eventName: SocketEvents.WhiteboardUndo,
        data: undoData,
      })
    }
    if (data.eventName === SocketEvents.WhiteboardRedo) {
      const redoData = Redo(data.chatId)
      peer.send({
        eventName: SocketEvents.WhiteboardRedo,
        data: redoData,
      })
      peer.publish(`whiteboard-${data.chatId}`, {
        eventName: SocketEvents.WhiteboardRedo,
        data: redoData,
      })
    }
  },

  close(peer) {
    const userId = getUserId(peer)
    users.set(userId, { online: false })
  },

  error(peer, error) {
    console.log(`[ws] error ${peer}`, error)
  },
})

function getUserId(peer: Peer) {
  const query = getQuery(peer.request.url)
  return query.userId as string
}
