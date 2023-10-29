<script setup lang='ts'>
const chatId = useRoute().params.id

const { data, pending } = await useFetch(`/api/conversations/${chatId}`)
console.log(data.value)
</script>

<template>
  <MainContent back>
    <template #title>
      <div class="textlg font-bold flex items-center gap-2" @click="$scrollToTop">
        <span>{{ $t('nav.messages') }}</span>
      </div>
    </template>
    <div class="p-6">
      {{ data }}
    </div>
  </MainContent>
</template>
