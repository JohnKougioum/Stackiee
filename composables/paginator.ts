import { defineStore } from 'pinia'
import type { Ref } from 'vue'

export function usePaginator(page: Ref<number>, pending: Ref<boolean>, next: Ref<boolean>) {
  const endAnchor = ref<HTMLDivElement>()
  const bound = reactive(useElementBounding(endAnchor))
  const isInScreen = $computed(() => bound.top < window.innerHeight * 2)
  const deactivated = useDeactivated()

  if (process.client) {
    useIntervalFn(() => {
      bound.update()
    }, 1000)

    watch(() => isInScreen, () => {
      if (
        isInScreen
        && deactivated.value === false
        && !pending.value
        && next.value
      )
        page.value++
    })
  }

  return {
    endAnchor,
  }
}

export const useFilters = defineStore('filters', () => {
  const filters = ref<string[]>([])
  const { t } = useI18n()

  function applyFilters(selectedSemester: number, selectedCourses: number[] | []) {
    // TODO: fix locales when switching languages
    selectedCourses.length
      ? filters.value = selectedCourses.map((course: number) => course.toString())
      : filters.value = [`${t('filters.semester')} ${selectedSemester.toString()}`]
  }

  return {
    filters,
    applyFilters,
  }
})
