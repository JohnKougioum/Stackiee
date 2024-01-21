<script setup lang='ts'>
import type { ConversationParticipant } from '@prisma/client'
import type { ThinnedUser } from '~/types'

defineProps<{
  participant: ConversationParticipant & { user: ThinnedUser }
  showRemove?: boolean
}>()
defineEmits<{
  (event: 'removeParticipant', id: string): void
}>()

// TODO: what should happen when the last remaining user is remove from the chat? Probably the chat should be deleted
</script>

<template>
  <div class="capitalize flex gap-2 justify-between items-center py-1 px-2 rounded-lg hover:bg-slate-200 duration-100">
    <div>
      {{ displayUsernameLocale(participant.user.fullName, participant.user.fullNameEL, true) }}
    </div>
    <div>
      <Icon v-if="participant.isAdmin" name="eos-icons:admin" size="1.3rem" />
      <Icon
        v-if="showRemove"
        name="ic:sharp-person-remove"
        size="1.3rem"
        class="ml-2 cursor-pointer"
        @click="$emit('removeParticipant', participant.userId)"
      />
    </div>
  </div>
</template>
