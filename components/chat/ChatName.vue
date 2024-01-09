<script setup lang='ts'>
import type { ConversationParticipant } from '@prisma/client'
import type { ThinnedUser } from '~/types/index'

const props = withDefaults(defineProps<{
  name: string
  lastMessageDate?: string
  participants: Array<ConversationParticipant & { user: ThinnedUser }>
  showTimeAgo?: boolean
}>(), {
  showTimeAgo: true,
})

const participantsWithoutSelf = [...props.participants].filter(
  participant => participant.user.uid !== userObject.value?.uid,
)

function getConversationName() {
  if (participantsWithoutSelf.length === 1)
    return displayUsernameLocale(participantsWithoutSelf[0].user.fullName, participantsWithoutSelf[0].user.fullNameEL, true)

  return participantsWithoutSelf
    .map(participant => displayUsernameLocale(participant.user.fullName, participant.user.fullNameEL, true))
    .join(', ')
}

const timeAgoOptions = useTimeAgoOptions(true)
const timeAgo = props.lastMessageDate && useTimeAgo(props.lastMessageDate, timeAgoOptions)
</script>

<template>
  <div>
    <div class="flex justify-between">
      <span class="capitalize inline-block w-3/4 overflow-hidden whitespace-nowrap text-ellipsis">
        {{ getConversationName() }}
        <span v-if="participantsWithoutSelf.length === 1" class="italic text-gray-400"> @{{ participantsWithoutSelf[0].user.uid }}</span>
      </span>
      <div v-if="showTimeAgo">
        {{ timeAgo }}
      </div>
    </div>
    <div />
  </div>
</template>
