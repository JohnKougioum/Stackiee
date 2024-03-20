<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { classes } from '@/types/index'

const props = defineProps<{
  semester: number
}>()

defineEmits<{
  (event: 'goBack'): void
}>()

const { tempFilters } = storeToRefs(useFilters())
const { isWholeSemesterSelected, semesterClasses } = useFilters()
const allClassesSelected = ref(false)
allClassesSelected.value = isWholeSemesterSelected(props.semester)

function selectAll(event: InputEvent, semester: number) {
  const checkboxes = document.getElementsByName(`semester-${semester}-courses`)
  if ((event.target as HTMLInputElement).checked) {
    for (const checkbox of checkboxes)
      (checkbox.children[0] as HTMLInputElement).checked = true

    tempFilters.value.push(...Object.keys(classes[semester].courses))
    tempFilters.value = [...new Set(tempFilters.value)]
    allClassesSelected.value = true
  }
  else {
    for (const checkbox of checkboxes)
      (checkbox.children[0] as HTMLInputElement).checked = false
    Object.keys(classes[semester].courses).forEach(item =>
      tempFilters.value = tempFilters.value.filter(i => i !== item))
  }
}

function addToTempFilter(event: InputEvent, code: number) {
  const codeToString = code.toString();
  (event.target as HTMLInputElement).checked
    ? tempFilters.value.push(codeToString)
    : tempFilters.value = tempFilters.value.filter(item => item !== codeToString)

  allClassesSelected.value = isWholeSemesterSelected(props.semester)
}
</script>

<template>
  <button class="mb-1" @click="$emit('goBack')">
    <Icon name="ri:arrow-left-line" size="1.3rem" />
  </button>
  <div class="my-1 rounded-md">
    <label class="flex items-center gap-2 p-4" :for="`semester-${semester}`">
      <CommonCheckbox
        :id="`semester-${semester}`"
        :checked="allClassesSelected"
        @change="selectAll($event, semester)"
      />
      <span class="flex-1 ml-4">
        {{ $t('filters.selectAll') }}
      </span>
    </label>
  </div>
  <div
    v-for="(course, name) in semesterClasses(semester)" :key="name"
    class=" my-1 rounded-md"
  >
    <label class="flex items-center gap-2 p-4" :for="`course-${name}`">
      <CommonCheckbox
        :id="`course-${name}`"
        :name="`semester-${semester}-courses`"
        :checked="tempFilters.includes(name.toString())"
        @change="addToTempFilter($event, name)"
      />
      <span class="flex-1 ml-4">
        {{ displayUsernameLocale(course.nameEN, course.nameEL) }}
      </span>
    </label>
  </div>
</template>
