<script setup lang='ts'>
import { classes as items } from '@/types/index'

const selectedCourses = ref<number[]>([])
function addCourse(course: number) {
  if (selectedCourses.value.includes(course))
    selectedCourses.value = selectedCourses.value.filter(item => item !== course)
  else
    selectedCourses.value.push(course)
}

const selectedSemester = ref()
function selectSemester(semester: unknown, semesterIndex: number) {
  if (JSON.stringify(selectedSemester.value) === JSON.stringify(semester))
    return

  selectedSemester.value = {
    semesterIndex,
    ...semester as object,
  }
  selectedCourses.value = []
}

function clearFilters() {
  selectedSemester.value = null
  selectedCourses.value = []
}

const { applyFilters } = useFilters()
function saveFilters() {
  applyFilters(
    selectedSemester.value.semesterIndex,
    selectedCourses.value,
  )
}
</script>

<template>
  <div class="flex justify-between h-[calc(100%-2.5rem)]">
    <div class="w-32 flex flex-col h-full">
      <span
        v-for="(semester, semesterIndex) in items"
        :key="semesterIndex"
        class="flex-1 flex justify-center items-center hover:bg-secondary-gray cursor-pointer"
        :class="{ 'bg-base-orange bg-opacity-40': selectedSemester?.semesterIndex === semesterIndex }"
        @click="selectSemester(semester, semesterIndex)"
      >
        {{ semesterIndex }}
      </span>
    </div>
    <div class="divider-vertical" />
    <div class="flex-1 flex flex-col h-full overflow-auto" :class="{ 'justify-center': !selectedSemester }">
      <span v-if="!selectedSemester" class="text-center text-lg">
        {{ $t('select.semester') }}
      </span>
      <template v-if="selectedSemester">
        <span
          v-for="(course, courseId) in selectedSemester.courses"
          :key="courseId"
          class="flex-1 flex justify-center items-center hover:bg-secondary-gray cursor-pointer
          text-center border-b last:border-b-0"
          :class="{ 'bg-base-orange bg-opacity-40': selectedCourses.includes(courseId) }"
          @click="addCourse(courseId)"
        >
          {{ displayUsernameLocale(course.nameEN, course.nameEL) }}
        </span>
      </template>
    </div>
  </div>
  <div class="h-10">
    <div class="float-right my-1 mr-4 flex gap-2">
      <button class="base-button !bg-red-500 hover:!bg-red-400" @click="clearFilters">
        {{ $t('filters.clear') }}
      </button>
      <button
        class="base-button"
        :disabled="!selectedSemester?.semesterIndex"
        @click="saveFilters"
      >
        {{ $t('filters.apply') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* divider-vertical is a global class so i'm just increasing the height here from the original */
.divider-vertical{
    height: 100%;
}
</style>
