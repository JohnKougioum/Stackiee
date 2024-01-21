<script setup lang='ts'>
import type { ConversationParticipant } from '@prisma/client'
import type PartySocket from 'partysocket'
import { SocketEvents } from '~/types'
import type { ThinnedUser } from '~/types'

const props = defineProps<{
  participants: Array<ConversationParticipant & { user: ThinnedUser }>
  chatId: string
  ws: PartySocket
}>()

const participantsIds = computed(() => props.participants.map(participant => participant.userId))
const adminsList = computed(() => props.participants.filter(participant => participant.isAdmin))
const isUserAdmin = computed(() => adminsList.value?.some(admin => admin.userId === userObject.value?.id))

async function updateConversationsParticipantsCall(newParticipantsIdList: string[]) {
  await $fetch(`/api/conversations/update/participants/${props.chatId}`, {
    method: 'PUT',
    body: {
      participantIDs: newParticipantsIdList,
    },
  })
  props.ws.send(JSON.stringify({
    eventName: SocketEvents.ConversationUpdated,
    message: '',
  }))
}

async function removeParticipant(id: string) {
  const newParticipantsIdList = props.participants.filter(participant => participant.userId !== id).map(participant => participant.userId)
  await updateConversationsParticipantsCall(newParticipantsIdList)
}

const visible = ref(false)
async function addNewUsers(users: ThinnedUser[]) {
  const newParticipantsIdList = [...props.participants.map(participant => participant.userId), ...users.map(user => user.id)]
  await updateConversationsParticipantsCall(newParticipantsIdList)
  visible.value = false
}
</script>

<template>
  <div class="px-1 py-2">
    <ChatDropdownUser
      v-for="participant in participants"
      :key="participant.id"
      :participant="participant"
      :show-remove="isUserAdmin"
      @remove-participant="removeParticipant"
    />
    <div class="mt-2 select-none underline flex items-center justify-center gap-2 cursor-pointer" @click="visible = true">
      {{ $t('chat.addParticipant') }}
      <Icon name="ic:sharp-person-add-alt" size="1.3rem" />
    </div>
  </div>
  <ModalDialog v-model="visible" :custom-z-index="10001" use-v-if>
    <ChatCreation :filter-participants="participantsIds" @action-event="addNewUsers" />
  </ModalDialog>
</template>
