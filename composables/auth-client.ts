export const loginCookie = useCookie('loggedIn')

export const isLoggedIn = computed(() => !!loginCookie.value)

export function redirectToLogin() {
  window.location.href = `https://login.iee.ihu.gr/authorization/?client_id=${
        useRuntimeConfig().public.CLIENT_ID
      }&response_type=code&scope=profile&redirect_uri=http://localhost:8080/login/auth`
}

export async function logout() {
  const { data } = await useFetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (data.value?.status === 'success')
    location.reload()
}
