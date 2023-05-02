<script setup lang='ts'>
const router = useRouter()

const inputRef = ref<HTMLInputElement>()
const query = ref('')

defineExpose({ inputRef })

function search() {
  if (query.value.trim() === '')
    return

  router.push(`/search?query=${query.value.trim()}`)
  query.value = ''
  inputRef.value?.blur()
}
</script>

<template>
  <div
    class="border-[1px] h-10 lg:ms-1 lg:me-5 rounded-xl flex flex-row
    items-center gap-3 px-4 focus-within:ring-1
    focus-within:ring-base-orange focus-within:border-transparent"
  >
    <Icon name="majesticons:search-line" />
    <input
      ref="inputRef"
      v-model="query"
      class="outline-none text-size-base w-full h-full bg-transparent
    rounded-md pr-4 ml-1"
      :placeholder="isHydrated ? $t('search') : ''"
      type="text"
      @keydown.enter="search"
    >
  </div>
</template>

<style scoped>
.ms-1{
    -webkit-margin-start: 0.25rem;
    margin-inline-start: 0.25rem;
}
.me-5{
    -webkit-margin-end: 1.25rem;
    margin-inline-end: 1.25rem;
}
</style>
