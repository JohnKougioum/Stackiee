<script setup lang='ts'>
const visible = ref(true)

const router = useRouter()
function close() {
  router.push({ name: 'chat' })
}
onActivated(() => {
  visible.value = true
})
</script>

<template>
  <ChatCreatePlaceholder />
  <ModalDialog v-model="visible" use-v-if @close="close">
    <ChatCreation />
  </ModalDialog>
</template>
