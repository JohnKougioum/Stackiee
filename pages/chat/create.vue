<script setup lang='ts'>
import type { ThinnedUser } from '~/types'

const visible = ref(true)
let isRedirecting = false

async function close() {
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
  const { data } = await useFetch<{ status: string; conversation_id: string }>('/api/conversations/create', {
    body: {
      userIDs: [userObject.value?.id, ...users.map(user => user.id)],
    },
    method: 'POST',
  })
  isRedirecting = true
  await navigateTo(`/chat/${data.value?.conversation_id}`)
  await fetchChats()
}
</script>

<template>
  <ChatCreatePlaceholder />
  <ModalDialog v-model="visible" use-v-if @close="close">
    <ChatCreation @action-event="createChat" />
  </ModalDialog>
</template>
