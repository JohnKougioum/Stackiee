export const loginCookie = useCookie('loggedIn')

export const isLoggedIn = computed(() => !!loginCookie.value)

const redirect_uri = process.dev ? 'http://localhost:8080/login/auth' : 'http://localhost:3000/login/auth'

export function redirectToLogin() {
  window.location.href = `https://login.iee.ihu.gr/authorization/?client_id=${
        useRuntimeConfig().public.CLIENT_ID
      }&response_type=code&scope=profile&redirect_uri=${redirect_uri}`
}

export async function logout() {
  const { data } = await useFetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (data.value?.status === 'success')
    location.reload()
}
