<script setup lang='ts'>
defineProps<{
  isUserAdmin: boolean
}>()

function openModal() {
  isChatRenameOpen.value = true
}
</script>

<template>
  <div class="py-2 px-1">
    <div class="p-1 rounded-lg hover:bg-slate-200 duration-100 cursor-pointer" @click="openModal">
      {{ $t('chat.renameConversation') }}
    </div>
  </div>
</template>
