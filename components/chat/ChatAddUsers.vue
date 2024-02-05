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
  loading.value = true
  const newParticipantsIdList = [...props.participants.map(participant => participant.userId), ...users.map(user => user.id)]
  await $fetch(`/api/conversations/update/participants/${props.chatId}`, {
    method: 'PUT',
    body: {
      participantIDs: newParticipantsIdList,
    },
  })
  loading.value = false
  isParticipantsDropdownOpen.value = false
}
</script>

<template>
  <ChatCreation :filter-participants="participantsIds" :loading="loading" @action-event="addNewUsers" />
</template>
