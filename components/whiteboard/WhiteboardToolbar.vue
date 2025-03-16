<script setup lang='ts'>
import type { ElementType } from '@/types/whiteboardTypes'
import { ToolTypes } from '@/types/whiteboardTypes'

const emits = defineEmits<{
  (e: 'toggleChatVisibility'): void
  (e: 'closeWhiteboard'): void
  (e: 'emptyWhiteboard'): void
  (e: 'toolSelection', id: ElementType): void
}>()

const selectedToolType = ref<ElementType>(ToolTypes.SELECTION)

const tools = [
  { id: ToolTypes.SELECTION, icon: 'solar:cursor-outline' },
  { id: ToolTypes.PENCIL, icon: 'clarity:pencil-line' },
  { id: ToolTypes.RECTANGLE, icon: 'mdi:square-rounded-outline' },
  { id: ToolTypes.ARROW, icon: 'majesticons:arrow-right' },
  { id: ToolTypes.LINE, icon: 'majesticons:minus-line' },
  { id: ToolTypes.DELETE, icon: 'solar:eraser-outline' },
]

function selectTool(toolId: ElementType) {
  selectedToolType.value = toolId
  emits('toolSelection', toolId)
}

const isToolSelected = computed(() => (toolId: ElementType) => selectedToolType.value === toolId)
</script>

<template>
  <div class="whiteboard-toolbar absolute top-1/2 -translate-y-1/2 border-primary rounded-md left-2 p-1 flex flex-col gap-2 shadow-xl z-10 bg-white">
    <WhiteboardToolbarItem
      v-for="tool in tools"
      :key="tool.id"
      :icon="tool.icon"
      size="1.3rem"
      :class="{ 'bg-orange-200 bg-opacity-80': isToolSelected(tool.id) }"
      @click="selectTool(tool.id)"
    />
    <WhiteboardToolbarItem icon="solar:trash-bin-trash-linear" size="1.3rem" @click="$emit('emptyWhiteboard')" />
    <WhiteboardToolbarItem icon="solar:chat-dots-linear" size="1.3rem" @click="$emit('toggleChatVisibility')" />
    <WhiteboardToolbarItem icon="fluent:whiteboard-off-24-regular" size="1.3rem" @click="$emit('closeWhiteboard')" />
  </div>
</template>
