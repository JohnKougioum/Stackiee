<script setup lang="ts">
import { ref, computed } from 'vue'
import { classes } from '@/types/index'

definePageMeta({
  title: 'Compose',
  description: 'Compose a new post',
})

// State for semester and lecture selection
const semester = ref<number | undefined>(undefined)
const lectures = computed(() => {
  // Safeguard: if semester is undefined, return an empty array
  return semester.value ? classes[semester.value as keyof typeof classes].courses : []
})
const selectedLecture = ref<string | undefined>(undefined)

// State for file upload
const selectedFile = ref<File | null>(null)

// Handle file input changes
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

// Upload the file and return its id (or null if no file was uploaded)
async function uploadFile(): Promise<string | null> {
  if (!selectedFile.value) return null

  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const response = await fetch('/api/files/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('File upload failed')
    }

    const result = await response.json()
    // Expecting a response structure like:
    // { success: true, files: [{ id: "file-uuid", encryptedMetadata: "..." }] }
    return result.files && result.files[0]?.id ? result.files[0].id : null
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

// Publish post by first uploading the file then creating the post
async function publishPost(postBody: string) {
  const fileId = await uploadFile()

  const { data } = await useFetch('/api/posts/create', {
    method: 'POST',
    body: {
      postBody,
      semester: semester.value,
      course: selectedLecture.value,
      fileId,
    },
  })

  if (data.value?.statusCode === 200) {
    semester.value = undefined
    selectedLecture.value = undefined
    selectedFile.value = null
    await navigateTo('/')
  }
}
</script>

<template>
  <div class="my-10 px-10 flex justify-between gap-4">
    <!-- Semester selection -->
    <select
      v-model="semester"
      class="w-1/2 rounded px-2 py-1 outline-none border-[1px] border-primary-dark bg-base"
      @change="selectedLecture = undefined"
    >
      <option :value="undefined" disabled>
        {{ $t('select.semester') }}
      </option>
      <option v-for="i in 10" :key="i" :value="i">
        {{ i }}
      </option>
    </select>

    <!-- Lecture/Course selection -->
    <select
      id="classes-select"
      v-model="selectedLecture"
      class="w-1/2 rounded px-2 py-1 outline-none border-[1px] border-primary-dark bg-base"
      name="classes-select"
    >
      <option :value="undefined" disabled>
        {{ $t('select.course') }}
      </option>
      <template v-if="semester">
        <option v-for="(lecture, index) of lectures" :key="lecture.nameEL" :value="index">
          {{ lecture.nameEL }}
        </option>
      </template>
    </select>
  </div>

  <!-- File upload input -->
  <div class="px-10 pb-4">
    <label for="fileUpload" class="block mb-2">
      {{ $t('upload.file') }}
    </label>
    <input
      type="file"
      id="fileUpload"
      @change="handleFileChange"
      class="block"
    />
  </div>

  <PublishWidget
    class="pt-10 pb-12 px-10"
    :button-text="$t('publish')"
    @publish="publishPost"
  />
</template>
