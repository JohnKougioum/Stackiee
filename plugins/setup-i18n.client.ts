import type { VueI18n } from 'vue-i18n'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const i18n = useNuxtApp().$i18n

    const { setLocale } = i18n
    const lang = useCookie('i18n_lang')

    watch([lang, isHydrated], () => {
      if (isHydrated.value && lang.value && lang.value !== i18n.locale)
        setLocale(lang.value)
    }, { immediate: true })
  }
})
