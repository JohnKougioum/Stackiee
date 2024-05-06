<script setup lang='ts'>
defineEmits<{
  toggleChatVisibility: []
  close: []
}>()
</script>

<template>
  <div class="whiteboard-container relative bg-off-white rounded-md">
    <WhiteboardToolbar @close-whiteboard="$emit('close')" @toggle-chat-visibility="$emit('toggleChatVisibility')" />
    <canvas class="w-full h-full" />
  </div>
</template>
