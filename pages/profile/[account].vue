<script setup lang='ts'>
import type { User } from '@prisma/client'

definePageMeta({
  key: route => route.path,
  keepalive: false,
})

const route = useRoute().params
const accoutUid = computed(() => route.account)

onMounted(async () => {
  const unwatch = watch(userObject, async () => {
    if ((accoutUid.value === undefined || accoutUid.value === 'undefined') && userObject.value?.uid) {
      await navigateTo({ path: `/profile/${userObject.value?.uid}` })
      unwatch()
    }
  }, { immediate: true })
})

const { data: account, status } = await useAsyncData(`${accoutUid.value}-profile`, () => {
  return $fetch('/api/user/search', {
    method: 'POST',
    body: JSON.stringify({ searchString: accoutUid.value }),
  })
}, {
  immediate: true,
  server: false,
})

const accountData = computed(() => account.value?.data[0] as User || [])
useHead({
  title: displayUsernameLocale(accountData.value.fullName, accountData.value.fullNameEL),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <div class="timeline-title flex items-center gap-2" @click="$scrollToTop">
        <Icon name="majesticons:home-analytics-line" size="1.5em" />
        {{ $t('nav.profile') }}
      </div>
    </template>
    <CommonLoader v-if="status === 'pending' || status === 'idle'" class="mt-24" />
    <div
      v-else
      class="profile-container p-4"
    >
      <div class="w-28 h-28 rounded-full flex items-center justify-center">
        <Icon name="carbon:user-avatar-filled" size="7rem" />
      </div>
      <div class="profile-details mt-2">
        <div class="profile-info">
          <div class="profile-name">
            <span class="text-2xl font-bold capitalize">{{ displayUsernameLocale(accountData.fullName, accountData.fullNameEL, true) }}</span>
            <span class="text-sm text-primary-gray block">@{{ accountData.uid }}</span>
          </div>
          <div class="mt-2 text-primary-gray flex items-center gap-1">
            <Icon name="material-symbols:calendar-month" size="1.3em" />
            <span>{{ $t('joined') }} {{ accountData.regyear }}</span>
          </div>
          <div class="mt-1 text-primary-gray flex items-center gap-1">
            <Icon name="majesticons:mail-line" size="1.3em" />
            <NuxtLink class="text-sky-700" :to="`mailto:${accountData.email}`">
              {{ accountData.email }}
            </NuxtLink>
          </div>
        </div>
        <div class="profile-actions mt-4">
          <UserProfileContent :account-id="accountData.id" />
        </div>
      </div>
    </div>
  </MainContent>
</template>
