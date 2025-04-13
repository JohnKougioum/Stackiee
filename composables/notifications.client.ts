import type { Message, Notification } from '@prisma/client'

export const notifications = ref<Notification[]>([])
export const notificationsLoading = ref(false)

export async function handleNewMessageSSEEvent(data: { notification: Notification; newMessage: Message }) {
  const route = useRoute()
  if (Object.keys(data?.notification).length) {
    route.params?.id?.includes(data.notification.fromId)
      ? await deleteNotification(data.notification.id)
      : notifications.value.unshift(data.notification)
  }
  handleLastMessageUpdateSSEEvent(data.newMessage, data.notification.hasSeen ?? true)
}

export async function deleteNotification(notificationId: string) {
  if (!notificationId)
    return

  $fetch('/api/notification/delete', {
    method: 'POST',
    body: { notificationId },
  })
    .then((response) => {
      response.statusCode === 200 && (notifications.value = notifications.value.filter(notification => notification.id !== notificationId))
    })
    .catch((error) => {
      console.error('Error deleting notification:', error)
    })
}

export async function fetchAllNotifications() {
  notificationsLoading.value = true
  const data = await $fetch('/api/notification/all', {
    method: 'GET',
  })
  notificationsLoading.value = false
  notifications.value = data?.statusCode === 200 ? (data.body as unknown) as Notification[] : []
}

export async function updateNotificationStatus(fromId: string) {
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
