<script setup lang='ts'>
const { data, pending } = await useLazyFetch('/api/user/all')

const searchString = ref('')
const users = ref(data.value?.data)

function searchUser() {
  if (!data.value?.data)
    return
  if (!searchString.value) {
    users.value = data.value.data
    return
  }

  const search = removeAccents(searchString.value.toLowerCase())
  users.value = data.value.data.filter((user) => {
    const fullName = user.fullName.toLowerCase()
    const fullNameEL = user.fullNameEL.toLowerCase()
    return fullName.includes(search)
     || fullNameEL.includes(search)
     || user.email.includes(search)
     || user.uid.includes(search)
  })
}

watchOnce(data, () => {
  users.value = data.value?.data
})
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
          @input="searchUser"
        >
      </div>
    </div>
    <div class="border-t-[1px] border-secondary-gray">
      <div class="p-2">
        <span class="text-primary-gray">{{ $t('users') }}</span>
        <div class="mt-2 h-[18rem] overflow-auto">
          <CommonLoader v-if="pending" class="text-primary-dark" />
          <div v-else>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
