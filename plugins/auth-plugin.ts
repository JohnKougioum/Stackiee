export default defineNuxtPlugin(() => {
  const loginCookie = useCookie('loggedIn', {
    sameSite: 'lax',
  })
  const isLoggedIn = computed(() => !!loginCookie.value)

  return {
    provide: {
      auth: {
        redirectToLogin: () => {
          if (process.client) {
            const redirect_uri = `${window.location.origin}/login/auth`
            window.location.href = `https://login.iee.ihu.gr/authorization/?client_id=${
                    useRuntimeConfig().public.CLIENT_ID
                }&response_type=code&scope=profile&redirect_uri=${redirect_uri}`
          }
        },
        logout: async () => {
          if (process.server)
            return

          const response = await $fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
          })
          if (response.status === 'success') {
            loginCookie.value = ''
            location.reload()
          }
        },
        loginCookie,
        isLoggedIn,
      },
    },
  }
})
