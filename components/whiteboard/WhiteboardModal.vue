<script setup lang='ts'>
const deactivated = useDeactivated()

const route = useRoute()
const routePath = ref(route.path)

const notInCurrentPage = computed(() => deactivated.value || routePath.value !== route.path)
watch(notInCurrentPage, (value) => {
  if (value)
    close()
})

const chatSectionVisible = ref(false)

function close() {
  isWhiteboardOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 overflow-y-auto scrollbar-hide overscroll-none z-10 bg-base">
      <div class="w-full h-full">
        <WhiteboardWidget class="h-full border-primary" @close="close" @toggle-chat-visibility="chatSectionVisible = !chatSectionVisible" />
        <div v-if="chatSectionVisible" class="absolute top-0 right-0 h-full w-1/3 bg-white z-10 shadow-md">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
