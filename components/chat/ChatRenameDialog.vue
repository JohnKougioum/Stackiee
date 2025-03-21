<script setup lang='ts'>
import { SocketEvents } from '~/types'

const props = defineProps<{
  chatId?: string
}>()

const inputText = ref('')

function closeModal() {
  isChatRenameOpen.value = false
}

const { t } = useI18n()
const errorMessage = ref('')
async function rename() {
  try {
    const chatId = props.chatId || useRoute().params.id as string
    await $fetch(`/api/conversations/update/name/${chatId}`, {
      method: 'PUT',
      body: {
        name: inputText.value,
      },
    })
    closeModal()
  }
  catch (error) {
    if (error && (error as any).response)
      errorMessage.value = (error as any).response?.status === 400 ? t('chat.renameNoPermission') : t('somethingWentWrong')
  }
}
</script>

<template>
  <div class="w-[400px] p-2">
    <div class="text-center">
      {{ $t('chat.renameConversation') }}
      <Icon class="float-right cursor-pointer" name="majesticons:close" size="1.4rem" @click="closeModal" />
    </div>
    <div
      class="mt-4 mx-auto border-[1px] h-10 rounded-xl focus-within:ring-1
    focus-within:ring-base-orange focus-within:border-transparent"
    >
      <input
        v-model="inputText"
        class="outline-none text-size-base w-full h-full bg-transparent
    rounded-md pl-2 pr-4 ml-1"
        :placeholder="$t('chat.enterNewName')"
        type="text"
        @keydown.enter="rename"
      >
    </div>
    <div v-if="errorMessage" class="text-center text-red-500 mt-1">
      {{ errorMessage }}
    </div>
    <button class="base-button my-2 float-right" @click="rename">
      {{ $t('chat.rename') }}
    </button>
  </div>
</template>
