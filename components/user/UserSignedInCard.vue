<script setup lang='ts'>
import { SocketEvents } from '~/types'

const { data: user, pending, error } = await useFetch('/api/user/info', {
  method: 'GET',
  credentials: 'include',
})
if (error.value && import.meta.client)
  window.location.href = '/login'

userObject.value = user.value?.data || null
onMounted(() => {
  const source = new EventSource(`/api/sse?user=${userObject.value?.id}`)

  source.addEventListener('open', (event) => {
    console.log('SSE connection opened:', event)
  })

  source.addEventListener('message', async (event) => {
    const data = JSON.parse(event.data)
    if (data.type === SocketEvents.NewConversationCreated)
      await handleNewChatSSEEvent()
    console.log('Received event:', data.type, '- Message:', data.message)
  })

  source.addEventListener('error', (event) => {
    console.error('Error with SSE connection:', event)
  })
})
</script>

<template>
  <div class="px-0 pt-0 xl:px-2 xl:pt-8 lg:flex flex-col hidden">
    <CommonDropdown placement="top">
      <button class="w-full">
        <div
          v-if="!pending"
          class="flex items-center justify-between gap-1 xl:bg-base-orange xl:bg-opacity-20 rounded-3xl
          cursor-pointer hover:bg-opacity-40 duration-75"
        >
          <div class="flex gap-2">
            <Icon name="carbon:user-avatar-filled" size="3rem" />
            <div class="text-sm flex-1 flex flex-col sm:hidden xl:flex">
              <span v-if="user" class="w-[10rem] text-start capitalize text-ellipsis whitespace-nowrap overflow-hidden">
                {{ displayUsernameLocale(user.data.fullName, user.data.fullNameEL, true) }}
              </span>
              <span class="w-fit text-primary-gray">@{{ user?.data.uid }}</span>
            </div>
          </div>
          <div class="hidden xl:block">
            <Icon name="majesticons:more-menu-vertical" size="2.3rem" />
          </div>
        </div>

        <div v-else class="h-12 w-12 xl:w-full rounded-3xl bg-secondary-gray opacity-70  animate-pulse" />
      </button>
      <template #popper>
        <CommonDropdownItem
          icon="ri:logout-box-line"
          @click="$auth.logout"
        >
          <div>{{ $t('user.signOut') }}</div>
        </CommonDropdownItem>
      </template>
    </CommonDropdown>
  </div>
</template>
