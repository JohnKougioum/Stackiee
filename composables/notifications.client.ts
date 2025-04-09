import type { Message, Notification } from '@prisma/client'

export const notifications = ref<Notification[]>([])

export async function handleNewMessageSSEEvent(data: Notification & { newMessage: Message }) {
  Object.keys(data).length && notifications.value.push(data)
  handleLastMessageUpdateSSEEvent(data.newMessage)
  console.log('New message notification:', data.fromId)
  const route = useRoute()
  route.params?.id?.includes(data.fromId) && await deleteNotification(data.id)
}

export async function deleteNotification(notificationId: string) {
  if (!notificationId)
    return

  $fetch('/api/notification/delete', {
    method: 'POST',
    body: { notificationId },
  }).catch((error) => {
    console.error('Error deleting notification:', error)
  })
}
