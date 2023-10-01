<script setup lang='ts'>
import { storeToRefs } from 'pinia'
const { filters } = storeToRefs(useFilters())

function getChipText(chip: string) {
  const { t } = useI18n()
  return chip.length === 4
    ? chip
    : t(`filters.semesters.${chip}`)
}

const dropDownOpen = ref(false)
</script>

<template>
  <div class="mt-2 flex justify-between">
    <div class="flex gap-1">
      <div class="ml-4 flex gap-2 flex-wrap h-12 overflow-hidden" :class="{ 'h-fit': dropDownOpen }">
        <SearchFiltersChips v-for="item in filters" :key="item">
          {{ getChipText(item) }}
        </SearchFiltersChips>
      </div>
      <button class="btn-icon h-fit">
        <CommonTooltip placement="bottom" :content="$t('filters.showMore')">
          <Icon name="ri:arrow-down-s-line" size="1.3rem" @click="dropDownOpen = !dropDownOpen" />
        </CommonTooltip>
      </button>
    </div>
    <CommonDropdown class="w-fit">
      <button
        class="base-button text-xl select-none"
      >
        {{ $t('filters.title') }}
      </button>
      <template #popper>
        <div class="w-[18rem] md:w-[25rem] h-[35rem]">
          <SearchFiltersNew />
        </div>
      </template>
    </CommonDropdown>
  </div>
</template>
