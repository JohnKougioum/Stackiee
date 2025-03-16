<script setup lang='ts'>
import type { IhuApiProfile } from '@/types/index'

definePageMeta({
  layout: 'none',
})

const route = useRoute()
const config = useRuntimeConfig()

const body = {
  client_id: config.public.CLIENT_ID,
  client_secret: config.public.CLIENT_SECRET,
  grant_type: 'authorization_code',
  code: route.query.code,
}

interface TokenRespone {
  access_token: string
  expires_in: number
  user: number
}
const { $auth, $connectWebsocket } = useNuxtApp()
onMounted(async () => {
  const token = await $fetch('https://login.iee.ihu.gr/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(Object.entries(body) as string[][]).toString(),
  })

  if (!(token as TokenRespone)?.access_token)
    return

  const profileResponse = await $fetch<IhuApiProfile>('https://api.iee.ihu.gr/profile', {
    method: 'GET',
    headers: {
      'x-access-token': (token as TokenRespone)?.access_token,
    },
  })

  await $fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      uid: profileResponse?.uid,
      am: profileResponse?.am,
      fullName: profileResponse?.cn,
      fullNameEL: profileResponse!['cn;lang-el'],
      email: profileResponse?.mail,
      eduPersonAffiliation: profileResponse?.eduPersonAffiliation,
      eduPersonPrimaryAffiliation: profileResponse?.eduPersonPrimaryAffiliation,
      regyear: profileResponse?.regyear,
    },
    async onResponse({ response }) {
      if (response.status === 200) {
        $auth.loginCookie.value = 'true'
        response._data.body?.userId && $connectWebsocket(response._data.body?.userId)
        await navigateTo('/')
      }
    },
  },
  )
})
</script>

<template>
  <div class="h-screen w-full flex justify-center items-center">
    <Icon class="animate-spin" name="ri:loader-4-line" size="4rem" />
  </div>
</template>
