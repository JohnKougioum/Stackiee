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
            <div>
              <NuxtLink class="base-button text-xl" to="/chat/create">
                {{ $t('create') }}
              </NuxtLink>
            </div>
          </div>
        </template>
        <div class="xl:w-[24.25rem] lg:w-[19.5rem]">
          <TimelineSkeleton v-if="isChatsListLoading" />
          <template v-else>
            <NuxtLink
              v-for="chat in chats"
              :key="chat.id"
              :to="`/chat/${chat.id}`"
            >
              <ChatName
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
