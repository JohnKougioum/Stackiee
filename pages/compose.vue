<script setup lang='ts'>
import { classes } from '@/types/index'
const semester = ref<number | undefined>(undefined)
const lectures = computed(() => classes[semester.value as keyof typeof classes].courses)
const selectedLecture = ref<string | undefined>(undefined)

const t = ref()
const vnode = computed(() => t.value)

async function publishPost(body: string) {
  t.value = contentToVNode(body)
}
</script>

<template>
  <div class="my-10 px-10 flex justify-between gap-4">
    <select
      v-model="semester"
      class="w-1/2 rounded px-2 py-1 outline-none border-[1px] border-primary-dark bg-base"
      @change="selectedLecture = undefined"
    >
      <option :value="undefined" disabled>
        {{ $t('select.semester') }}
      </option>
      <option v-for="i in 10" :key="i" :value="i">
        {{ i }}
      </option>
    </select>
    <select
      id="classes-select"
      v-model="selectedLecture"
      class="w-1/2 rounded px-2 py-1 outline-none border-[1px] border-primary-dark bg-base"
      name="classes-select"
    >
      <option :value="undefined" disabled>
        {{ $t('select.course') }}
      </option>
      <template v-if="semester">
        <option v-for="(lecture, index) of lectures" :key="lecture.nameEL" :value="index">
          {{ lecture.nameEL }}
        </option>
      </template>
    </select>
  </div>
  <PublishWidget @publish="publishPost" />
  <component :is="vnode" />
</template>
