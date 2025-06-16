<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { classes } from '@/types/index'

const { filters } = storeToRefs(useFilters())
const { removeFiltersItem } = useFilters()

function getChipText(chip: string) {
  if (chip.length === 4) {
    let course
    for (const semesters of Object.values(classes)) {
      for (const courses of Object.values(semesters)) {
        const courseTemp = Object.entries(courses).find(([key, value]) => {
          return key === chip
        })
        if (courseTemp) {
          course = courseTemp
          break
        }
      }
    }
    return course?.length
      ? displayUsernameLocale(course[1].nameEN, course[1].nameEL)
      : chip
  }
  const { t } = useI18n()
  return t(`filters.semesters.${chip}`)
}

const dropDownOpen = ref(false)
const collapseEl = ref<HTMLElement>()!
const maxHeightComputed = computed(() => {
  return {
    maxHeight: `${dropDownOpen.value ? collapseEl.value?.scrollHeight : 40}px`,
  }
})
</script>

<template>
  <div class="mt-2 flex flex-col-reverse sm:flex-row justify-between pr-2 md:pr-0">
    <div class="flex gap-1">
      <div ref="collapseEl" class="ml-4 flex gap-2 flex-wrap collapse-body" :style="maxHeightComputed">
        <SearchFiltersChips v-for="item in filters" :key="item" :chip-name="getChipText(item)" @delete-action="removeFiltersItem(item)" />
      </div>
      <button v-if="filters.length > 2" class="btn-icon h-fit">
        <CommonTooltip placement="bottom" :content="$t('filters.showMore')">
          <Icon name="ri:arrow-down-s-line" size="1.3rem" class="duration-100" :class="{ 'rotate-180': dropDownOpen }" @click="dropDownOpen = !dropDownOpen" />
        </CommonTooltip>
      </button>
    </div>
    <CommonDropdown class="w-fit ml-4 mb-2 sm:mb-0 self-end sm:self-baseline">
      <button
        class="base-button text-xl select-none"
      >
        {{ $t('filters.title') }}
      </button>
      <template #popper="{ hide }">
        <div class="w-[18rem] md:w-[25rem] h-[35rem]">
          <SearchFiltersNew :hide-fn="hide" />
        </div>
      </template>
    </CommonDropdown>
  </div>
</template>

<style scoped>
.collapse-body {
  overflow: hidden;
  max-height: 40px;
  transition: max-height .3s cubic-bezier(.4,0,.2,1);
}
</style>
