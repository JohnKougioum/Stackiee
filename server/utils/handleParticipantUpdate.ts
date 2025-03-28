export type UpdateAction =
  | { action: 'delete'; conversationId: string }
  | { action: 'create'; conversationId: string }
  | { action: 'update'; updatedIds: string[] }
  | { action: 'pong' }
  | { action: 'error'; message: string }

export function handleParticipantUpdateLogic({
  currentParticipants,
  newParticipants,
  conversationId,
}: {
  currentParticipants: string[]
  newParticipants: string[]
  conversationId: string
}): UpdateAction {
  const newSet = [...new Set(newParticipants)].sort()
  const currentSet = [...new Set(currentParticipants)].sort()

  const added = newSet.filter(id => !currentSet.includes(id))
  const removed = currentSet.filter(id => !newSet.includes(id))

  const newCount = newSet.length
  const currentCount = currentSet.length

  if (currentCount === 3 && newCount === 2) {
    return { action: 'delete', conversationId }
  }

  if (currentCount === 2 && newCount === 1) {
    return { action: 'delete', conversationId }
  }

  if (currentCount === 2 && newCount === 3) {
    return { action: 'create', conversationId }
  }

  if (currentCount === 3 && newCount === 4) {
    return { action: 'update', updatedIds: newSet }
  }

  if (currentCount >= 4 && newCount === currentCount - 1) {
    return { action: 'update', updatedIds: newSet }
  }

  if (JSON.stringify(newSet) === JSON.stringify(currentSet)) {
    return { action: 'pong' }
  }

  return { action: 'error', message: 'Unsupported participant change pattern' }
}
