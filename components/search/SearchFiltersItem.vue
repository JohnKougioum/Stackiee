<script setup lang='ts'>
import type { classes } from '@/types/index'

defineProps<{
  items: typeof classes
}>()

const selectedSemester = ref()
</script>

<template>
  <div class="flex justify-between h-[calc(100%-2.5rem)]">
    <div class="w-32 flex flex-col h-full">
      <span
        v-for="(semester, index) in items"
        :key="index"
        class="flex-1 flex justify-center items-center hover:bg-secondary-gray cursor-pointer"
        @click="selectedSemester = semester"
      >
        {{ index }}
      </span>
    </div>
    <div class="divider-vertical" />
    <div class="flex-1 flex flex-col h-full overflow-auto" :class="{ 'justify-center': !selectedSemester }">
      <span v-if="!selectedSemester" class="text-center text-lg">
        {{ $t('select.semester') }}
      </span>
      <template v-if="selectedSemester">
        <span
          v-for="(semester, index) in selectedSemester.courses"
          :key="index"
          class="flex-1 flex justify-center items-center hover:bg-secondary-gray cursor-pointer
          text-center border-b"
        >
          {{ displayUsernameLocale(semester.nameEN, semester.nameEL) }}
        </span>
      </template>
    </div>
  </div>
  <div class="h-10">
    <div>
      <button>Clear</button>
      <button>Ok</button>
    </div>
  </div>
</template>

<style scoped>
.divider-vertical{
    height: 100%;
}
</style>
