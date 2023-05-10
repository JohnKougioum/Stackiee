<script setup lang='ts'>
import { classes } from '@/types/index'
</script>

<template>
  <CommonDropdown class="w-fit ml-auto" placement="bottom">
    <button
      class="py-2 px-4 bg-base-orange text-white text-lg rounded-3xl
          cursor-pointer hover:bg-opacity-70 duration-75"
    >
      Filters
    </button>
    <template #popper>
      <div class="w-full md:w-[25rem] h-[30rem]">
        <SearchFiltersItem :items="classes" />
      </div>
    </template>
  </CommonDropdown>
</template>
