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

const participantsWithoutSelf = computed(() => [...props.participants].filter(
  participant => participant.user.uid !== userObject.value?.uid,
))

const getConversationName = computed(() => {
  if (props.name)
    return props.name

  if (participantsWithoutSelf.value.length === 1)
    return displayUsernameLocale(participantsWithoutSelf.value[0].user.fullName, participantsWithoutSelf.value[0].user.fullNameEL, true)

  return participantsWithoutSelf.value
    .map(participant => displayUsernameLocale(participant.user.fullName, participant.user.fullNameEL, true))
    .join(', ')
})

const timeAgoOptions = useTimeAgoOptions(true)
const timeAgo = props.lastMessageDate && useTimeAgo(props.lastMessageDate, timeAgoOptions)
</script>

<template>
  <div>
    <div class="flex justify-between">
      <span class="capitalize inline-block overflow-hidden whitespace-nowrap text-ellipsis">
        {{ getConversationName }}
        <span v-if="participantsWithoutSelf.length === 1 && !name" class="italic text-gray-400 hidden sm:inline"> @{{ participantsWithoutSelf[0].user.uid }}</span>
      </span>
      <div v-if="showTimeAgo" class="ml-1">
        {{ timeAgo }}
      </div>
    </div>
    <div />
  </div>
</template>
