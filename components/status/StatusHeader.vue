<script setup lang='ts'>
import type { User } from '~/types/index'

defineProps<{
  user: User
  timeAgo: string
}>()
</script>

<template>
  <div class="py-2 px-2 md:px-4 flex gap-2 md:gap-3 w-full h-fit" v-bind="$attrs" :class="[isTabletOrMobileScreen ? 'flex-col' : 'flex-row']">
    <div class="flex gap-1 justify-start" :class="[isTabletOrMobileScreen ? 'flex-row items-start' : 'flex-col items-center']">
      <div>
        <Icon name="carbon:user-avatar-filled" size="45" />
        <StatusAffiliationTag :affiliation="user.eduPersonAffiliation" />
      </div>
      <div v-if="isTabletOrMobileScreen" class="flex justify-between items-center flex-wrap flex-1">
        <NuxtLink class="text-sm text-primary-gray cursor-pointer rounded-lg hover:bg-secondary-gray hover:ring-1 ring-secondary-gray" :to="`/profile/${user.uid}`">
          <span v-if="user" class="text-primary-dark font-bold capitalize">{{ displayUsernameLocale(user.fullName, user.fullNameEL, true) }}</span>
          <br>
          <span>
            @{{ user.uid }}
          </span>
        </NuxtLink>
        <span class="text-sm text-primary-gray">
          {{ timeAgo }}
        </span>
      </div>
    </div>
    <div class="w-full">
      <div v-if="!isTabletOrMobileScreen" class="flex justify-between items-center">
        <NuxtLink class="text-sm text-primary-gray cursor-pointer rounded-lg hover:bg-secondary-gray hover:ring-1 ring-secondary-gray" :to="`/profile/${user.uid}`">
          <span v-if="user" class="text-primary-dark font-bold capitalize">{{ displayUsernameLocale(user.fullName, user.fullNameEL, true) }}</span> @{{ user.uid }}
        </NuxtLink>
        <span class="text-sm text-primary-gray">
          {{ timeAgo }}
        </span>
      </div>
      <slot />
    </div>
  </div>
</template>
