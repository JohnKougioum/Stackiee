<script setup lang='ts'>
import type { User } from '~/types/index'
const props = defineProps<{
  user: User
  timeAgo: string
}>()
const date = new Date(props.timeAgo)
</script>

<template>
  <div class="py-2 px-2 sm:px-0 w-full h-fit" v-bind="$attrs">
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
  <div class="w-full whitespace-nowrap text-ellipsis overflow-hidden">
    <span class="text-sm text-primary-gray px-2 sm:px-0">
      {{ date }}
    </span>
  </div>
</template>
