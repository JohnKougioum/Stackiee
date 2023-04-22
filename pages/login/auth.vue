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
const { $auth } = useNuxtApp()
onMounted(async () => {
  const token = await useFetch('https://login.iee.ihu.gr/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(Object.entries(body) as string[][]).toString(),
  })

  if (!(token?.data?.value as TokenRespone)?.access_token)
    return

  const profileResponse = await useFetch<IhuApiProfile>('https://api.iee.ihu.gr/profile', {
    method: 'GET',
    headers: {
      'x-access-token': (token?.data?.value as TokenRespone)?.access_token,
    },
  })

  const profileResponseMapped: any = {}
  for (const [key, value] of Object.entries(profileResponse.data.value as IhuApiProfile))
    profileResponseMapped[key.replace(';', '_')] = value

  await useFetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: {
      uid: profileResponseMapped.uid,
      am: profileResponseMapped.am,
      fullName: profileResponseMapped.cn,
      fullNameEL: profileResponseMapped['cn_lang-el'],
      email: profileResponseMapped.mail,
      eduPersonAffiliation: profileResponseMapped.eduPersonAffiliation,
      eduPersonPrimaryAffiliation: profileResponseMapped.eduPersonPrimaryAffiliation,
      regyear: profileResponseMapped.regyear,
    },
    async onResponse({ response }) {
      if (response.status === 200) {
        $auth.loginCookie.value = 'true'
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
