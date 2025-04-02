<script setup lang='ts'>
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

  await $fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    server: false,
    body: {
      accessToken: (token as TokenRespone)?.access_token,
    },
  }).then(async (response) => {
    if (response.statusCode === 200) {
      $auth.loginCookie.value = 'true'
      response?.body?.user.id && await $connectWebsocket(response?.body?.user.id)
      userObject.value = response?.body?.user || null
      await navigateTo('/')
    }
  })
})
</script>

<template>
  <div class="h-screen w-full flex justify-center items-center">
    <Icon class="animate-spin" name="ri:loader-4-line" size="4rem" />
  </div>
</template>
