<script setup lang='ts'>
const props = defineProps<{
  chatId?: string
}>()

const inputText = ref('')

function closeModal() {
  isChatRenameOpen.value = false
}

async function rename() {
  const chatId = props.chatId || useRoute().params.id as string
  await $fetch(`/api/conversations/update/name/${chatId}`, {
    method: 'PUT',
    body: {
      name: inputText.value,
    },
  })
  closeModal()
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
    <button class="base-button my-2 float-right" @click="rename">
      {{ $t('chat.rename') }}
    </button>
  </div>
</template>
