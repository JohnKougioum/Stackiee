<script setup lang='ts'>
import type { ThinnedUser } from '~/types'

const visible = ref(true)

const router = useRouter()
let isRedirecting = false

function close() {
  if (isRedirecting) {
    isRedirecting = false
    return
  }
  router.push({ name: 'chat' })
}
onActivated(() => {
  visible.value = true
})

async function createChat(users: ThinnedUser[]) {
  const { data } = await useFetch<{ status: string; conversation_id: string }>('/api/conversations/create', {
    body: {
      userIDs: users.map(user => user.id),
    },
    method: 'POST',
  })
  isRedirecting = true
  await navigateTo(`/chat/${data.value?.conversation_id}`)
}
</script>

<template>
  <ChatCreatePlaceholder />
  <ModalDialog v-model="visible" use-v-if @close="close">
    <ChatCreation @action-event="createChat" />
  </ModalDialog>
</template>
