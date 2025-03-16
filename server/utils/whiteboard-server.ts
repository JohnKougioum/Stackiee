import { ActionTypes } from '~/types/whiteboardTypes'
import type { Element } from '~/types/whiteboardTypes'

const globalWhiteboardsElements = new Map<string, Map<string, Element>>()
const globalWhiteboardHistory = new Map<string, { history: Element[]; redo: Element[] }>()

const historyLimit = 15

export function whiteboardExists(id = '') {
  return globalWhiteboardsElements.has(id)
}

export function setWhiteboardEntry(id = '', data: Element) {
  const existingWhiteboard = globalWhiteboardsElements.get(id)
  if (!Object.keys(data).length && whiteboardExists(id)) {
    existingWhiteboard?.clear()
    globalWhiteboardHistory.set(id, { history: [], redo: [] })
  }
  else {
    existingWhiteboard?.set(data?.id.toString(), data)
    globalWhiteboardHistory.get(id)?.redo?.length && (globalWhiteboardHistory.get(id)!.redo.length = 0)
    return data
  }
  globalWhiteboardHistory.get(id)?.redo?.length && (globalWhiteboardHistory.get(id)!.redo.length = 0)
}

export function deleteWhiteboardEntry(chatId = '', elementId: string) {
  const existingWhiteboard = globalWhiteboardsElements.get(chatId)
  if (existingWhiteboard)
    existingWhiteboard.delete(elementId)
}

export function getWhiteboardData(id = '') {
  if (!globalWhiteboardsElements.has(id)) {
    globalWhiteboardsElements.set(id, new Map())
    globalWhiteboardHistory.set(id, { history: [], redo: [] })
  }

  return Object.fromEntries(globalWhiteboardsElements.get(id)!)
}

export function createHistoryPoint(chatId: string, data: Element) {
  const localHistory = globalWhiteboardHistory.get(chatId)
  if (localHistory) {
    if (localHistory.history.length >= historyLimit)
      localHistory.history.shift()
    localHistory.history.push(data)
    globalWhiteboardHistory.set(chatId, localHistory)
  }
}

export function createRedoPoint(chatId: string, data: Element) {
  const localHistory = globalWhiteboardHistory.get(chatId)
  if (localHistory) {
    localHistory.redo.push(data)
    globalWhiteboardHistory.set(chatId, localHistory)
  }
}

export function Undo(chatId: string) {
  const localHistory = globalWhiteboardHistory.get(chatId)
  if (localHistory) {
    const lastElement = localHistory.history.pop()
    if (lastElement) {
      const globalChatElements = globalWhiteboardsElements.get(chatId)
      if (lastElement?.actionType === ActionTypes.DRAWING) {
        createRedoPoint(chatId, globalChatElements!.get(lastElement.id.toString())!)
        globalChatElements?.delete(lastElement.id.toString())
      }
      else if (
        lastElement?.actionType === ActionTypes.DELETING
        || lastElement?.actionType === ActionTypes.RESIZING
        || lastElement?.actionType === ActionTypes.MOVING) {
        createRedoPoint(chatId, globalChatElements!.get(lastElement.id.toString())!)
        globalChatElements?.set(lastElement.id.toString(), lastElement)
      }
      return Array.from(globalChatElements!.values())
    }
  }
  else {
    return undefined
  }
}

export function Redo(chatId: string) {
  const localHistory = globalWhiteboardHistory.get(chatId)
  if (localHistory) {
    const firstElement = localHistory.redo.pop()
    if (firstElement) {
      const globalChatElements = globalWhiteboardsElements.get(chatId)
      if (firstElement?.actionType === ActionTypes.DRAWING
        || firstElement?.actionType === ActionTypes.RESIZING
        || firstElement?.actionType === ActionTypes.MOVING)
        globalChatElements?.set(firstElement.id.toString(), firstElement)
      else if (firstElement?.actionType === ActionTypes.DELETING)
        globalChatElements?.delete(firstElement.id.toString())

      localHistory.history.push(firstElement)
      return Array.from(globalChatElements!.values())
    }
    else {
      return undefined
    }
  }
}
