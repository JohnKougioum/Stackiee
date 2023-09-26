<script setup lang='ts'>
const selectedSemester = ref<number | null>(null)
function showSemesterClasses(semesterIndex: number) {
  selectedSemester.value = semesterIndex
}

function showSemesters() {
  selectedSemester.value = null
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
        <div v-for="index in 10" :key="index" class="h-12 w-full first:bg-green-300 first:bg-opacity-20 bg-slate-300 cursor-pointer" @click="showSemesterClasses(index)">
          <div class="flex justify-center items-center h-full">
            <span class="text-lg">
              {{ $t(`filters.semesters.${index}`) }}
            </span>
          </div>
        </div>
      </div>
      <div>
        <button class="base-button">
          Clear
        </button>
      </div>
    </div>
    <div v-else>
      <SearchFiltersClasses :semester="selectedSemester" @go-back="showSemesters" />
    </div>
  </Transition>
</template>
