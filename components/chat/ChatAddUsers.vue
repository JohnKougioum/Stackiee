<script setup lang='ts'>
import type { ConversationParticipant } from '@prisma/client'
import { SocketEvents } from '~/types'
import type { ThinnedUser } from '~/types'

const props = defineProps<{
  participants: Array<ConversationParticipant & { user: ThinnedUser }>
  chatId: string
}>()

const participantsIds = computed(() => props.participants.map(participant => participant.userId))

async function addNewUsers(users: ThinnedUser[]) {
  const newParticipantsIdList = [...props.participants.map(participant => participant.userId), ...users.map(user => user.id)]
  await $fetch(`/api/conversations/update/participants/${props.chatId}`, {
    method: 'PUT',
    body: {
      participantIDs: newParticipantsIdList,
    },
  })
  isParticipantsDropdownOpen.value = false
  socketsList.value?.get(props.chatId)?.send(JSON.stringify({
    eventName: SocketEvents.ConversationUpdated,
    message: '',
  }))
}
</script>

<template>
  <ChatCreation :filter-participants="participantsIds" @action-event="addNewUsers" />
</template>
