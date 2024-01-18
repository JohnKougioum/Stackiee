<script setup lang='ts'>
// @ts-expect-error missing types
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import type { ConversationParticipant, Message } from '@prisma/client'
import type { ThinnedUser } from '~/types/index'

const props = defineProps<{
  chatId: string
  participants: Array<ConversationParticipant & { user: ThinnedUser } >
}>()
defineExpose({
  addMessage,
})

onReactivated(async () => {
  await scrollToBottom()
})

const chatContainer = ref<HTMLElement>()!

const lastDate = ref<Date>()
const lastScrollHeight: number[] = []

const messages = ref<Message[]>([])
let allMessagesSeen = false
const { pending } = await useFetch(`/api/messages/${props.chatId}`, {
  method: 'POST',
  body: {
    lastDate,
  },
  async onResponse({ response }) {
    const data = response._data as { statusCode: number; body: Message[] }

    allMessagesSeen = data.body.length === 0
    messages.value.unshift(...data.body.reverse())
    if (chatContainer.value?.scrollHeight) {
      const scrollerHeight = await getScrollerHeight()
      chatContainer.value.scrollTop += scrollerHeight - lastScrollHeight[0]
      lastScrollHeight.length = 0
    }
  },
})

onMounted(async () => {
  await nextTick()
  await scrollToBottom()
})
onActivated(async () => {
  await scrollToBottom()
})

async function scrollToBottom() {
  await nextTick()
  chatContainer.value?.scrollHeight && (chatContainer.value.scrollTop = chatContainer.value?.scrollHeight)
}

function getScrollerHeight(): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dyncamicScroller = document.getElementsByClassName('vue-recycle-scroller__item-wrapper')[0]
      const styles = getComputedStyle(dyncamicScroller)
      resolve(Number(styles.minHeight.replace('px', '')))
    })
  })
}

async function addMessage(message: Message) {
  messages.value.push(message)
  await scrollToBottom()
}

function displayName(id = '') {
  if (!id)
    return ''
  const participant = props.participants.find(participant => participant.user.id === id)
  if (!participant)
    return ''
  return displayUsernameLocale(participant.user.fullName, participant.user.fullNameEL, true)
}

const scroll = useScroll(chatContainer)
const isScrolledTop = computed(() => scroll.y.value < 150)

let enteringDuringFirstRender = true
watch(isScrolledTop, async () => {
  if (pending.value)
    return

  isScrolledTop.value && !allMessagesSeen && (lastDate.value = messages.value[0].createdAt)
  lastScrollHeight.push(await getScrollerHeight())

  if (enteringDuringFirstRender) {
    enteringDuringFirstRender = false
    lastScrollHeight.pop()
  }
})
</script>

<template>
  <div ref="chatContainer" class="flex-grow basis-0 overflow-auto p-1">
    <div v-if="pending">
      loading ...
    </div>
    <template v-if="messages.length">
      <DynamicScroller
        class="scoller"
        :items="messages"
        :min-item-size="200"
        key-field="id"
        page-mode
      >
        <template #default="{ item, active, index } : { item: Message, active: number, index: number}">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :size-dependencies="[
              item.body,
            ]"
            :data-index="index"
            tag="article"
          >
            <ChatMessage
              :key="item.id"
              class="pb-1"
              :own="item.senderId === userObject?.id"
              :message="item.body"
              :name="displayName(item.senderId)"
              :date="new Date(item.createdAt)"
              :show-name="index === 0 || messages[index - 1].senderId !== item.senderId"
            />
          </DynamicScrollerItem>
        </template>
      </DynamicScroller>
    </template>
    <slot />
  </div>
</template>
