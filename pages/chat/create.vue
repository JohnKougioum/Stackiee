<script setup lang='ts'>
import type { ThinnedUser } from '~/types'

const visible = ref(true)
let isRedirecting = false

async function close() {
  visible.value = false
  const router = useRouter()
  if (isRedirecting) {
    isRedirecting = false
    return
  }
  router.back()
}
onActivated(() => {
  visible.value = true
})

async function createChat(users: ThinnedUser[]) {
  const data = await $fetch<{ status: string; conversation_id: string }>('/api/conversations/create', {
    body: {
      userIDs: [userObject.value?.id, ...users.map(user => user.id)],
    },
    method: 'POST',
  })
  isRedirecting = true
  await navigateTo(`/chat/${data?.conversation_id}`)
  await fetchChats()
}
</script>

<template>
  <ChatCreatePlaceholder />
  <ModalDialog v-model="visible" use-v-if :custom-close="true" @close="close">
    <ChatCreation @action-event="createChat" />
  </ModalDialog>
</template>
