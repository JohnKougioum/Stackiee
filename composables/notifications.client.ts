import type { Message, Notification } from '@prisma/client'

export const notifications = ref<Notification[]>([])

export async function handleNewMessageSSEEvent(data: { notification: Notification; newMessage: Message }) {
  Object.keys(data?.notification).length && notifications.value.push(data.notification)
  handleLastMessageUpdateSSEEvent(data.newMessage, data.notification.hasSeen ?? true)
  console.log('New message notification:', data)
  const route = useRoute()
  route.params?.id?.includes(data.notification.fromId) && await deleteNotification(data.notification.id)
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

export async function fetchAllNotifications() {
  const data = await $fetch('/api/notification/all', {
    method: 'GET',
  })
  notifications.value = data?.statusCode === 200 ? (data.body as unknown) as Notification[] : []
}

export async function updateNotificationStatus(fromId: string) {
  console.log('Updating notification status:', fromId, notifications.value, notifications.value.find(notification => notification.fromId === fromId))
  if (!fromId || !notifications.value.length || !notifications.value.find(notification => notification.fromId === fromId))
    return

  $fetch('/api/notification/update-status', {
    method: 'POST',
    body: { fromId },
  })
    .then((response) => {
      if (response.statusCode === 200)
        notifications.value[notifications.value.findIndex(notification => notification.fromId === fromId)].hasSeen = true
    })
    .catch((error) => {
      console.error('Error updating notification status:', error)
    })
}
