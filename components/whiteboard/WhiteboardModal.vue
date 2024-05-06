<script setup lang='ts'>
const deactivated = useDeactivated()

const route = useRoute()
const routePath = ref(route.path)

const notInCurrentPage = computed(() => deactivated.value || routePath.value !== route.path)
watch(notInCurrentPage, (value) => {
  if (value)
    close()
})

const chatSectionVisible = ref(true)

function close() {
  isWhiteboardOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 overflow-y-auto scrollbar-hide overscroll-none z-10 bg-base">
      <div class="w-full h-full p-4 flex gap-2">
        <WhiteboardWidget class="flex-[2] border-primary" @close="close" @toggle-chat-visibility="chatSectionVisible = !chatSectionVisible" />
        <template v-if="chatSectionVisible">
          <slot />
        </template>
      </div>
    </div>
  </Teleport>
</template>
