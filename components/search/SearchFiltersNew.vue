<script setup lang='ts'>
import { storeToRefs } from 'pinia'

const selectedSemester = ref<number | null>(null)
function showSemesterClasses(semesterIndex: number) {
  selectedSemester.value = semesterIndex
}

function showSemesters() {
  selectedSemester.value = null
}

const {
  isWholeSemesterSelected,
  semesterClasses,
  resetTempFilters,
} = useFilters()

const { coursesSelectedFromSemester } = storeToRefs(useFilters())

function semesterCoursesLength(semester: number) {
  return Object.keys(semesterClasses(semester)).length
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-250 ease-out children:transition children:duration-250 children:ease-out"
    enter-from-class="opacity-0 children:transform children:translate-y-full"
    enter-to-class="opacity-100 children:transform children:translate-y-0"
    leave-active-class="transition duration-250 ease-in  children:transition children:duration-250 children:ease-in"
    leave-from-class="opacity-100 children:transform children:translate-y-0"
    leave-to-class="opacity-0 children:transform children:translate-y-full"
    mode="out-in"
  >
    <div v-if="!selectedSemester">
      <div>
        <div
          v-for="index in 10"
          :key="index"
          class="py-3 w-full relative cursor-pointer border-secondary-gray border-b-[1px] last:border-b-0"
          :class="{ 'all-selected bg-opacity-20': isWholeSemesterSelected(index) }"
          @click="showSemesterClasses(index)"
        >
          <div class="flex justify-center items-center h-full">
            <span class="text-lg">
              {{ $t(`filters.semesters.${index}`) }}
            </span>
          </div>
          <div
            v-if="coursesSelectedFromSemester(index) && !isWholeSemesterSelected(index)"
            class="absolute flex justify-center items-center top-1/2 right-10 -translate-y-1/2"
          >
            <span class="italic">
              {{ coursesSelectedFromSemester(index) }} / {{ semesterCoursesLength(index) }}
            </span>
          </div>
        </div>
      </div>
      <div class="float-right px-2 mb-1">
        <button class="base-button mr-4 !bg-primary-red hover:opacity-70" @click="resetTempFilters">
          {{ $t('filters.clear') }}
        </button>
        <button class="base-button">
          {{ $t('filters.apply') }}
        </button>
      </div>
    </div>
    <div v-else>
      <SearchFiltersClasses :semester="selectedSemester" @go-back="showSemesters" />
    </div>
  </Transition>
</template>

<style lang="postcss" scoped>
.all-selected {
  background-color: #b2d8ce;
  color: white;
}
</style>