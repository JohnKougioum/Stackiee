<script setup lang='ts'>
defineEmits<{
  toggleChatVisibility: []
  closeWhiteboard: []
  action: [id: number]
}>()
</script>

<template>
  <div class="whiteboard-toolbar absolute top-1/2 -translate-y-1/2 border-primary rounded-md left-2 p-1 flex flex-col gap-2">
    <WhiteboardToolbarItem icon="clarity:pencil-line" size="1.3rem" />
    <WhiteboardToolbarItem icon="fluent:shapes-28-regular" size="1.3rem" />
    <WhiteboardToolbarItem icon="solar:eraser-outline" size="1.3rem" />
    <WhiteboardToolbarItem icon="majesticons:undo" size="1.3rem" />
    <WhiteboardToolbarItem icon="majesticons:redo" size="1.3rem" />
    <WhiteboardToolbarItem icon="solar:trash-bin-trash-linear" size="1.3rem" />
    <WhiteboardToolbarItem icon="solar:chat-dots-linear" size="1.3rem" @click="$emit('toggleChatVisibility')" />
    <WhiteboardToolbarItem icon="fluent:whiteboard-off-24-regular" size="1.3rem" @click="$emit('closeWhiteboard')" />
  </div>
</template>
