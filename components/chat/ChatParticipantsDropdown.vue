<script setup lang='ts'>
import type { ConversationParticipant } from '@prisma/client'
import { SocketEvents } from '~/types'
import type { ThinnedUser } from '~/types'

const props = defineProps<{
  participants: Array<ConversationParticipant & { user: ThinnedUser }>
  chatId: string
  isUserAdmin: boolean
}>()

async function updateConversationsParticipantsCall(newParticipantsIdList: string[]) {
  try {
    await $fetch(`/api/conversations/update/participants/${props.chatId}`, {
      method: 'PUT',
      body: {
        participantIDs: newParticipantsIdList,
      },
    })
  }
  catch (error) {

  }
}

async function removeParticipant(id: string) {
  const newParticipantsIdList = props.participants.filter(participant => participant.userId !== id).map(participant => participant.userId)
  await updateConversationsParticipantsCall(newParticipantsIdList)
}

function openModal() {
  isParticipantsDropdownOpen.value = true
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
    <div class="mt-2 select-none underline flex items-center justify-center gap-2 cursor-pointer" @click="openModal">
      {{ $t('chat.addParticipant') }}
      <Icon name="ic:sharp-person-add-alt" size="1.3rem" />
    </div>
  </div>
</template>
