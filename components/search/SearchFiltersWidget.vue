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
        Filters
      </button>
      <template #popper>
        <div class="w-full md:w-[25rem] h-[34rem]">
          <SearchFiltersNew />
        </div>
      </template>
    </CommonDropdown>
  </div>
</template>
