<script setup lang='ts'>
import type { User } from '@prisma/client'

const searchString = ref('')
const users = ref<User[]>([])

let abortController = new AbortController()
const pending = ref(false)
const { execute } = await useAsyncData(
  async () => await $fetch('/api/user/search', {
    body: {
      searchString: searchString.value,
    },
    method: 'POST',
    onRequest: () => {
      if (!searchString.value.trim()) {
        abortController.abort()
        abortController = new AbortController()
        users.value = []
      }

      pending.value = true
    },
    onResponse: ({ response }) => {
      users.value = response._data.data
      pending.value = false
    },
    onRequestError: () => {
      pending.value = false
    },
    onResponseError: () => {
      pending.value = false
    },
    signal: abortController.signal,
  }),
  { immediate: false },
)

const debouncedSearchString = refDebounced(searchString, 500, { maxWait: 1500 })
const noUsersMessage = computed(() => {
  if (pending.value)
    return ''
  return !debouncedSearchString.value.trim() ? 'searchForUsers' : 'noUsersFound'
})

watch(debouncedSearchString, async () => await execute())
</script>

<template>
  <div class="min-w-0 sm:min-w-[25rem]">
    <div class="p-2 mb-2">
      <div
        class="border-[1px] h-10 lg:ms-1 lg:me-5 rounded-xl flex flex-row
      items-center gap-3 px-4 focus-within:ring-1
      focus-within:ring-base-orange focus-within:border-transparent"
      >
        <input
          v-model="searchString"
          class="outline-none text-size-base w-full h-full bg-transparent
              rounded-md pr-4 ml-1"
          :placeholder="isHydrated ? $t('search') : ''"
          type="text"
        >
      </div>
    </div>
    <div class="border-t-[1px] border-secondary-gray">
      <div class="p-2">
        <span class="text-primary-gray">{{ $t('users') }}</span>
        <div class="mt-2 h-[18rem] overflow-auto">
          <CommonLoader v-if="pending" class="text-primary-dark" />
          <div v-else>
            <div v-if="!users.length">
              <div class="mt-20 text-center text-primary-gray">
                {{ $t(noUsersMessage) }}
              </div>
            </div>
            <template v-else>
              <div v-for="user in users" :key="user.id" class="mt-3 first:mt-0">
                <label class="flex items-center gap-2 p-2" :for="user.id">
                  <CommonCheckbox
                    :id="user.id"
                    :checked="false"
                  />
                  <span class="flex-1 ml-4 capitalize">
                    {{ displayUsernameLocale(user.fullName, user.fullNameEL, true) }}
                  </span>
                </label>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
