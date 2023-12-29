import { defineStore } from 'pinia'
import type { Ref } from 'vue'
import { classes } from '@/types/index'

export function usePaginator(
  page: globalThis.Ref<number | undefined>,
  pending: Ref<boolean>,
  next: Ref<boolean>) {
  const endAnchor = ref<HTMLDivElement>()
  const bound = reactive(useElementBounding(endAnchor))
  const isInScreen = computed(() => bound.top < window.innerHeight * 2)
  const deactivated = useDeactivated()

  if (process.client) {
    useIntervalFn(() => {
      bound.update()
    }, 1000)

    watch(isInScreen, () => {
      if (
        isInScreen.value
        && deactivated.value === false
        && !pending.value
        && next.value
        && page.value
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
  const tempFilters = ref<string[]>([])

  function isWholeSemesterSelected(semester: number) {
    return Object.keys(classes[semester].courses).every((course: string) => tempFilters.value.includes(course.toString()))
  }

  const coursesSelectedFromSemester = computed(() => {
    return (semester: number) => {
      return Object.keys(classes[semester].courses).filter((course: string) => tempFilters.value.includes(course.toString())).length
    }
  })

  function semesterClasses(semester: number) {
    return classes[semester].courses
  }

  function resetTempFilters() {
    tempFilters.value = []
  }

  function applyFilters() {
    Object.keys(classes).forEach((semester) => {
      if (isWholeSemesterSelected(Number(semester))) {
        tempFilters.value = tempFilters.value.filter(course => !Object.keys(classes[Number(semester)].courses).includes(course))
        tempFilters.value.push(semester)
      }
    })
    filters.value = [...tempFilters.value]
    transformFiltersToTemp()
  }

  function transformFiltersToTemp() {
    Object.keys(classes).forEach((semester) => {
      if (filters.value.includes(semester)) {
        tempFilters.value = tempFilters.value.filter(item => semester !== item)
        tempFilters.value.push(...Object.keys(classes[Number(semester)].courses))
      }
    })
  }

  let timeoutId: ReturnType<typeof setTimeout>
  function removeFiltersItem(item: string) {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      filters.value = filters.value.filter(filter => filter !== item)
      tempFilters.value = [...filters.value]
      transformFiltersToTemp()
    }, 200)
  }

  return {
    filters,
    tempFilters,
    isWholeSemesterSelected,
    coursesSelectedFromSemester,
    semesterClasses,
    resetTempFilters,
    applyFilters,
    removeFiltersItem,
  }
})
