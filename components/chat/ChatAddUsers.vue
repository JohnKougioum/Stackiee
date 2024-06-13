<script setup lang='ts'>
import type { ConversationParticipant } from '@prisma/client'
import { SocketEvents } from '~/types'
import type { ThinnedUser } from '~/types'

const props = defineProps<{
  participants: Array<ConversationParticipant & { user: ThinnedUser }>
  chatId: string
}>()

const participantsIds = computed(() => props.participants.map(participant => participant.userId))

const loading = ref(false)
async function addNewUsers(users: ThinnedUser[]) {
  const { $ws } = useNuxtApp()

  loading.value = true
  const newParticipantsIdList = [...props.participants.map(participant => participant.userId), ...users.map(user => user.id)]
  const data = await $fetch(`/api/conversations/update/participants/${props.chatId}`, {
    method: 'PUT',
    body: {
      participantIDs: newParticipantsIdList,
    },
  })
  loading.value = false
  isParticipantsDropdownOpen.value = false
  if ((data as any).statusCode === 200) {
    updateParticipantsList(props.chatId, (data as any).body.participantsList)
    $ws.value?.send(JSON.stringify({
      eventName: SocketEvents.ConversationParticipantsUpdate,
      chatId: props.chatId,
      participants: (data as any).body.participantsList,
    }))
  }
}
</script>

<template>
  <ChatCreation :filter-participants="participantsIds" :loading="loading" @action-event="addNewUsers" />
</template>
