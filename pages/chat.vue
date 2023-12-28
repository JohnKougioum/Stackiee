<script setup lang='ts'>
definePageMeta({
  wideLayout: true,
})

useSeoMeta({
  title: 'Chat',
  description: 'Chat page',
})

const { chats, isChatsListLoading } = await fetchChats()

const route = useRoute()
const isRootPath = computedEager(() => route.name === 'chat')

const filteredChats = ref(chats.value)
function filterChatInput(value: string) {
  filteredChats.value = [...chats.value].filter(chat =>
    chat.name.toLowerCase().includes(value.toLowerCase())
    || chat.participants.some(participant =>
      participant.user.fullName.toLowerCase().includes(value.toLowerCase())
      || participant.user.fullNameEL.toLowerCase().includes(removeAccents(value.toLowerCase()))),
  )
}
</script>

<template>
  <div class="min-h-screen flex">
    <div class="border-r-2" :class="isRootPath ? 'block lg:flex-none flex-1' : 'hidden lg:block'">
      <MainContent>
        <template #title>
          <div class="w-full flex justify-between items-center">
            <div class="timeline-title flex items-center gap-2" @click="$scrollToTop">
              <Icon name="majesticons:messages-line" size="1.5rem" />
              <span class="text-xl font-bold">{{ $t('nav.messages') }}</span>
            </div>
          </div>
        </template>
        <div class="xl:w-[24.25rem] lg:w-[19.5rem]">
          <div class="flex items-center gap-3 p-2">
            <div
              class="border-[1px] border-secondary-gray flex-1 h-10 lg:ms-1 lg:me-5 rounded-xl flex flex-row
      items-center gap-3 px-2 md:px-4 focus-within:ring-1
      focus-within:ring-base-orange focus-within:border-transparent"
            >
              <input
                type="text" class="outline-none text-size-base w-full h-full bg-transparent
              rounded-md pr-4 ml-1"
                :placeholder="$t('searchForChat')"
                @input="filterChatInput(($event.target as HTMLInputElement).value)"
              >
            </div>
            <NuxtLink class="base-button text-xl" to="/chat/create">
              {{ $t('create') }}
            </NuxtLink>
          </div>
          <TimelineSkeleton v-if="isChatsListLoading" />
          <template v-else>
            <NuxtLink
              v-for="chat in filteredChats"
              :key="chat.id"
              :to="`/chat/${chat.id}`"
            >
              <ChatName
                class="border-[1px] border-primary-dark rounded-md my-4 mx-2 px-2"
                :name="chat.name"
                :last-message-date="chat.updatedAt.toString()"
                :participants="[...chat.participants]"
              />
            </NuxtLink>
          </template>
        </div>
      </MainContent>
    </div>
    <div class="flex-1" :class="isRootPath ? 'hidden lg:block' : 'block'">
      <NuxtPage />
    </div>
  </div>
</template>
