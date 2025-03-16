<script setup lang='ts'>
const props = withDefaults(defineProps<{
  own?: boolean
  name: string
  message: string
  showName?: boolean
  date: Date
}>(), {
  showName: true,
})

const sentDate = new Date(props.date).toLocaleString('el-GR', {
  dateStyle: 'full',
  timeStyle: 'medium',
  hourCycle: 'h23',
})
</script>

<template>
  <div class="w-full mb-[2px] flex flex-col" :class="[own ? 'items-end' : 'items-start']">
    <div v-if="showName" class="mx-1 capitalize">
      {{ name }}
    </div>
    <div class="max-w-[65%]">
      <CommonTooltip class="w-full" placement="auto" :content="sentDate">
        <div class="px-4 py-2 rounded-xl max-w-full break-all" :class="[own ? 'bg-base-orange text-white' : 'bg-light-gray']">
          {{ message }}
        </div>
      </CommonTooltip>
    </div>
  </div>
</template>
