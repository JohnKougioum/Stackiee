<script setup lang="ts">
const user = computed(() => userObject.value)
</script>

<template>
  <div class="px-0 pt-0 xl:px-2 xl:pt-8 lg:flex flex-col hidden">
    <CommonDropdown placement="top">
      <button class="w-full">
        <div
          v-if="Object.keys(user || {}).length > 0"
          class="flex items-center justify-between gap-1 xl:bg-base-orange xl:bg-opacity-20 rounded-3xl
          cursor-pointer hover:bg-opacity-40 duration-75"
        >
          <div class="flex gap-2">
            <Icon name="carbon:user-avatar-filled" size="3rem" />
            <div class="text-sm flex-1 flex flex-col sm:hidden xl:flex">
              <span class="w-[10rem] text-start capitalize text-ellipsis whitespace-nowrap overflow-hidden">
                {{ displayUsernameLocale(user?.fullName, user?.fullNameEL, true) }}
              </span>
              <span class="w-fit text-primary-gray">@{{ user?.uid }}</span>
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
