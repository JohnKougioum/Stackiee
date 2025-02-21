import type { Element } from '~/types/whiteboardTypes'

const globalWhiteboardsElements = new Map<string, Map<string, Element>>()

export function whiteboardExists(id = '') {
  return globalWhiteboardsElements.has(id)
}

export function setWhiteboardEntry(id = '', data: Element) {
  const existingWhiteboard = globalWhiteboardsElements.get(id)
  if (!Object.keys(data).length && whiteboardExists(id)) {
    existingWhiteboard?.clear()
  }
  else {
    existingWhiteboard?.set(data?.id.toString(), data)
    return data
  }
}

export function getWhiteboardData(id = '') {
  if (!globalWhiteboardsElements.has(id))
    globalWhiteboardsElements.set(id, new Map())

  return Object.fromEntries(globalWhiteboardsElements.get(id)!)
}
