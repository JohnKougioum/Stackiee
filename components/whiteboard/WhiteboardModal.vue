<script setup lang='ts'>
const deactivated = useDeactivated()

const route = useRoute()
const routePath = ref(route.path)

const notInCurrentPage = computed(() => deactivated.value || routePath.value !== route.path)
watch(notInCurrentPage, (value) => {
  if (value)
    close()
})

function close() {
  isWhiteboardOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 overflow-y-auto scrollbar-hide overscroll-none z-10 bg-black bg-opacity-20">
      <div class="w-full h-full p-4 flex gap-2">
        <WhiteboardWidget class="flex-[2]" />
        <slot />
      </div>
    </div>
  </Teleport>
</template>
