<script setup lang='ts'>
import type { User } from '~/types/index'
defineProps<{
  user: User
  timeAgo: string
}>()
</script>

<template>
  <div class="py-2 gap-4 w-full h-fit" v-bind="$attrs">
    <div class="flex gap-2 items-center">
      <Icon name="carbon:user-avatar-filled" size="45" />
      <div class="text-sm flex flex-col text-primary-gray cursor-pointer rounded-lg hover:bg-secondary-gray hover:ring-1 ring-secondary-gray">
        <span v-if="user" class="text-primary-dark font-bold capitalize">
          {{ displayUsernameLocale(user.fullName, user.fullNameEL) }}
        </span>
        <span>
          @{{ user.uid }}
        </span>
      </div>
      <StatusAffiliationTag class="ml-auto" :affiliation="user.eduPersonAffiliation" />
    </div>
    <div class="w-full mt-4">
      <slot />
    </div>
  </div>
  <span class="text-sm text-primary-gray">
    {{ timeAgo }}
  </span>
</template>
