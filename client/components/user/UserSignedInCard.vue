<script setup lang='ts'>
const { data: user, pending } = await useLazyFetch('/api/user/info', {
  method: 'GET',
  credentials: 'include',
  server: false,
})
const { locale } = useI18n()
function displayUsernameLocale() {
  if (locale.value === 'en')
    return user.value?.data.fullName.toLocaleLowerCase()

  else
    return user.value?.data.fullNameEL.toLocaleLowerCase()
}
</script>

<template>
  <div class="px-2 pt-8 lg:flex flex-col hidden">
    <div
      v-if="!pending"
      class="flex items-center justify-between gap-1 xl:bg-base-orange xl:bg-opacity-20 rounded-3xl
        cursor-pointer hover:bg-opacity-40 duration-75"
    >
      <div class="flex gap-2">
        <Icon name="carbon:user-avatar-filled" size="3rem" />
        <div class="text-sm flex-1 flex flex-col sm:hidden xl:flex">
          <span class="w-[10rem] capitalize text-ellipsis whitespace-nowrap overflow-hidden">
            {{ displayUsernameLocale() }}
          </span>
          <span class="text-primary-gray">@{{ user?.data.uid }}</span>
        </div>
      </div>
      <Icon class="block sm:hidden xl:block" name="majesticons:more-menu-vertical" size="2.3rem" />
    </div>

    <div v-else class="h-12 rounded-3xl bg-secondary-gray opacity-70  animate-pulse" />
  </div>
</template>
