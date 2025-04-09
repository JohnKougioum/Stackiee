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

const filterInputText = ref('')
const filteredChats = computed(() => {
  return chats.value.filter(chat =>
    chat.name.toLowerCase().includes(filterInputText.value.toLowerCase())
    || chat.participants.some(participant =>
      participant.user.fullName.toLowerCase().includes(filterInputText.value.toLowerCase())
      || participant.user.fullNameEL.toLowerCase().includes(removeAccents(filterInputText.value.toLowerCase()))),
  )
})
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
                v-model="filterInputText"
                type="text" class="outline-none text-size-base w-full h-full bg-transparent
              rounded-md pr-4 ml-1"
                :placeholder="$t('searchForChat')"
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
              active-class="sd"
            >
              <div class="border-[1px] border-primary-dark rounded-md my-4 mx-2 px-2 py-1">
                <ChatName
                  :name="chat.name"
                  :last-message-date="chat.updatedAt.toString()"
                  :participants="[...chat.participants]"
                />
                <div class="text-size-base text-primary-gray" :class="{ italic: !chat.latestMessage }">
                  {{ chat.latestMessage || $t('chat.noMessages') }}
                </div>
              </div>
            </NuxtLink>
          </template>
        </div>
      </MainContent>
    </div>
    <div class="flex-1" :class="isRootPath ? 'hidden lg:block' : 'block'">
      <NuxtPage :key="route.fullPath" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.sd {
  & > div {
    @apply shadow-xl bg-off-white transition duration-75;
  }
}
</style>
