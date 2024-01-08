<script setup lang='ts'>
import PartySocket from 'partysocket'
import type { FullConversationType } from '~/composables/chat'

const chatId = useRoute().params.id

const { data, pending } = await useFetch<{ statusCode: number; body: FullConversationType }>(`/api/conversations/${chatId}`)

const inputText = ref('')
function sentMessage() {
  inputText.value = ''
}
const ws = new PartySocket({
  host: 'localhost:1999',
  room: 'chat',
  id: userObject.value?.id,
})

await useFetch('/api/conversations/test')
</script>

<template>
  <MainContent back full-height>
    <template #title>
      <div class="textlg font-bold flex items-center gap-2" @click="$scrollToTop">
        <span>{{ $t('nav.messages') }}</span>
      </div>
    </template>
    <div class="py-4 px-0 sm:px-2 lg:px-4 h-full flex flex-col gap-4">
      <div class="rounded-2xl bg-off-white border-primary p-3 flex items-center gap-2">
        <ChatName class="flex-1" :name="data!.body.name" :participants="data!.body.participants" />
        <div class="flex items-center gap-2">
          <CommonTooltip placement="bottom" :content="$t('participants')">
            <img src="~/assets/UserGroupPlus.svg" class="h-8 w-8 fill-primary-dark cursor-pointer">
          </CommonTooltip>
          <CommonTooltip placement="bottom" :content="$t('whiteboard')">
            <Icon class="cursor-pointer" name="fluent:whiteboard-16-regular" size="1.8rem" />
          </CommonTooltip>
          <CommonTooltip placement="bottom" :content="$t('settings.title')">
            <Icon class="cursor-pointer" name="iconamoon:options-duotone" size="1.8rem" />
          </CommonTooltip>
        </div>
      </div>
      <div class="flex-1 rounded-2xl bg-off-white border-primary" />
      <form class="rounded-2xl py-2 bg-off-white border-primary w-full flex items-center gap-3 px-2" @submit.prevent="sentMessage">
        <div class="flex-1">
          <input
            v-model="inputText"
            type="text" class="outline-none text-size-base w-full h-full bg-transparent"
            :placeholder="$t('chat.sentMessage')"
          >
        </div>
        <button type="submit">
          <Icon name="majesticons:send" size="1.5rem" class="text-base-orange cursor-pointer hover:text-base-orange-darker" />
        </button>
      </form>
    </div>
  </MainContent>
</template>
