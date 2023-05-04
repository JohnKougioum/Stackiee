<script setup lang='ts'>
import type { LocaleObject } from '#i18n'

const { locales, locale, setLocale } = useI18n()
function changeLanguage(event: Event) {
  const newLocale = (event.target as HTMLSelectElement).value
  setLocale(newLocale)
  const localeCookie = useCookie('i18n_lang')
  localeCookie.value = newLocale
}
</script>

<template>
  <MainContent back>
    <template #title>
      <div class="textlg font-bold flex items-center gap-2" @click="$scrollToTop">
        <span>{{ $t('settings.language.title') }}</span>
      </div>
    </template>
    <div class="p-6">
      <label>
        <span class="block">{{ $t('settings.language.change') }}</span>
        <select
          class="p-3 border border-secondary-gray rounded w-full block bg-base"
          :value="locale"
          @change="changeLanguage"
        >
          <option
            v-for="item in (locales as LocaleObject[])"
            :key="item.code"
            :value="item.code"
          >
            {{ item.name }}
          </option>
        </select>
      </label>
    </div>
  </MainContent>
</template>
