<script setup lang='ts'>
import type { Notification } from '@prisma/client'
import { NotificationTypes } from '@/types'

interface NotificationBody {
  value?: string
  en?: string
  el?: string
}

const props = defineProps<{
  notification: Notification & { body: NotificationBody }
}>()

const name = computed(() => {
  const body = props.notification?.body as NotificationBody
  if (Object.keys(body).length <= 1)
    return body.value || ''
  else
    return displayUsernameLocale(body.en, body.el, true)
})

const timeAgoOptions = useTimeAgoOptions(true)
const timeAgo = props.notification.createdAt && useTimeAgo(props.notification.createdAt, timeAgoOptions)

async function gotoOrigin() {
  const fromId = props.notification.fromId
  if (!fromId)
    return
  if (props.notification.type === NotificationTypes.NewMessage)
    await navigateTo(`/chat/${fromId}`)
}
</script>

<template>
  <div
    class="notification-item rounded-lg px-3 border-[1px] flex justify-between items-center"
    :class="[!notification.hasSeen ? 'border-base-orange bg-off-white bg-opacity-65 shadow-lg' : 'border-primary-dark']"
  >
    <div class="flex justify-between py-3 flex-1">
      <div class="cursor-pointer" @click="gotoOrigin">
        {{ $t('notifications.sentMessage') }}
        <span class="font-semibold" :class="{ capitalize: !props.notification?.body?.value }">
          "{{ name }}"
        </span>
      </div>
      <div class="text-primary-gray">
        {{ timeAgo }}
      </div>
    </div>
    <div class="flex items-center border-l-[1px] border-primary-dark ml-2 pl-2 cursor-pointer" @click="deleteNotification(notification.id)">
      <Icon name="majesticons:close" size="1.3rem" />
    </div>
  </div>
</template>
