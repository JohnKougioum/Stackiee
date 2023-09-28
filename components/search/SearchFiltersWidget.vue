<script setup lang='ts'>
import { storeToRefs } from 'pinia'
const { filters } = storeToRefs(useFilters())
</script>

<template>
  <div class="mt-2 flex justify-between items-center">
    <div class="ml-4 flex gap-2">
      <SearchFiltersChips v-for="item in filters" :key="item">
        {{ item }}
      </SearchFiltersChips>
    </div>
    <CommonDropdown class="w-fit">
      <button
        class="base-button text-xl"
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
