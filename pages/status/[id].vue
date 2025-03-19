<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const route = useRoute()

const postData = ref(null)
const decryptedFileUrl = ref('')
const isDecrypting = ref(false)

const loading = ref(true)
async function fetchPost() {
  try {
    loading.value = true
    const data = await $fetch(`/api/posts/searchById/${route.params.id}`, {
      method: 'GET',
    })
    loading.value = false

    if (data?.body) {
      postData.value = data.body

      // If there's a file, decrypt it
      if (postData.value!.File?.length > 0)
        decryptFile(postData.value!.File[0].encryptedDetails)
    }
  }
  catch (error) {
    console.log('Error fetching post:', error)
  }
}

async function decryptFile(encryptedMetadata: string) {
  try {
    isDecrypting.value = true

    const response = await $fetch('/api/files/decrypt', {
      method: 'POST',
      body: JSON.stringify({ encryptedMetadata }),
      headers: { 'Content-Type': 'application/json' },
    })

    decryptedFileUrl.value = response.url || response
  }
  catch (error) {
    console.error('Error decrypting file:', error)
  }
  finally {
    isDecrypting.value = false
  }
}

const fileExtension = computed(() => {
  if (!decryptedFileUrl.value)
    return 'unknown'
  return decryptedFileUrl.value.split('.').pop()?.toLowerCase() || 'unknown'
})

const fileIcons: Record<string, string> = {
  pdf: 'mdi:file-pdf-box',
  doc: 'mdi:file-word-box',
  docx: 'mdi:file-word-box',
  xls: 'mdi:file-excel-box',
  xlsx: 'mdi:file-excel-box',
  ppt: 'mdi:file-powerpoint-box',
  pptx: 'mdi:file-powerpoint-box',
  txt: 'mdi:file-document-outline',
  png: 'mdi:file-image',
  jpg: 'mdi:file-image',
  jpeg: 'mdi:file-image',
  zip: 'mdi:file-zip-box',
  mp4: 'mdi:file-video',
}

function openFile() {
  if (decryptedFileUrl.value && decryptedFileUrl.value.startsWith('http'))
    window.open(decryptedFileUrl.value, '_blank')
  else
    console.error('Invalid file URL:', decryptedFileUrl.value)
}

onMounted(async () => {
  await fetchPost()
})
</script>

<template>
  <MainContent back>
    <div class="mt-4">
      <CommonLoader v-if="loading" class="text-primary-dark" />
      <template v-else-if="postData">
        <StatusDetails
          :user="postData.User!"
          :time-ago="postData.createdAt!"
          inline
        >
          <ContentRenderer :body="postData.body" />
          <div v-if="postData.File?.length > 0" class="mt-4">
            <div
              v-if="isDecrypting"
              class="flex items-center space-x-2 text-gray-500"
            >
              <div
                class="animate-spin w-6 h-6 border-2 border-t-transparent border-gray-600 rounded-full"
              />
              <span>Decrypting file...</span>
            </div>

            <button
              v-else-if="decryptedFileUrl"
              class="flex items-center space-x-3 bg-base-gray hover:bg-secondary-gray text-primary-dark px-4 py-2 rounded-lg shadow transition cursor-pointer"
              @click="openFile"
            >
              <Icon
                :name="fileIcons[fileExtension] || 'mdi:file-document-outline'"
                class="w-6 h-6 text-base-orange"
              />
              <span class="text-sm font-medium truncate">
                Open resource
              </span>
            </button>
          </div>
        </StatusDetails>
        <CommentSection :id="postData.id" class="mt-2" />
      </template>
      <template v-else>
        <div class="text-center mt-4">
          {{ $t('somethingWentWrong') }}
        </div>
      </template>
    </div>
  </MainContent>
</template>

<style scoped>
button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  border: none;
  outline: none;
  cursor: pointer;
}
</style>
