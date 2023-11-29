<script setup lang='ts'>
import type { ChatParticipant } from '~/types/index'

const props = defineProps<{
  name: string
  lastMessageDate: string
  participants: ChatParticipant[]
}>()

const participantsWithoutSelf = [...props.participants].filter(
  participant => participant.user.uid !== userId.value,
)

function getConversationName() {
  if (participantsWithoutSelf.length === 1)
    return displayUsernameLocale(participantsWithoutSelf[0].user.fullName, participantsWithoutSelf[0].user.fullNameEL, true)

  return participantsWithoutSelf
    .map(participant => displayUsernameLocale(participant.user.fullName, participant.user.fullNameEL, true))
    .join(', ')
}

const timeAgoOptions = useTimeAgoOptions(true)
const timeAgo = useTimeAgo(props.lastMessageDate, timeAgoOptions)
</script>

<template>
  <div class="border-[1px] border-primary-dark rounded-md my-4 mx-2 px-2">
    <div class="flex justify-between">
      <span class="capitalize inline-block w-3/4 overflow-hidden whitespace-nowrap text-ellipsis">
        {{ getConversationName() }}
        <span v-if="participantsWithoutSelf.length === 1" class="italic text-gray-400"> @{{ participantsWithoutSelf[0].user.uid }}</span>
      </span>
      <div>
        {{ timeAgo }}
      </div>
    </div>
    <div />
  </div>
</template>
