<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

definePageMeta({ wideLayout: true })

/** Unified announcement interface */
interface UnifiedAnnouncement {
  id: string | number
  title: string
  body: string
  preview: string
  createdAt: string
  authorName: string
  tags: string[] // array of tag titles
  attachments?: any[]
}

/** Minimal interfaces for filter tags and authors */
interface FilterTag {
  id: number
  title: string
}

interface Author {
  id: number
  name: string
}

// --- Reactive State for Announcements ---
const announcements = ref<UnifiedAnnouncement[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(5) // default to 5 items
const meta = ref<{ total: number; last_page: number } | null>(null)

// --- Source Selection as Tabs ---
const selectedSource = ref<'aboard'>('aboard')

// --- Reactive State for Filter Dropdowns (for aboard) ---
const filterTags = ref<FilterTag[]>([])
const authors = ref<Author[]>([])
const selectedTagId = ref<number | null>(null)
const selectedAuthorId = ref<number | null>(null)
const searchText = ref<string>('')

// --- Transform Functions ---

function transformAboardData(item: any): UnifiedAnnouncement {
  return {
    id: item.id,
    title: item.title,
    body: item.body,
    preview: item.preview,
    createdAt: item.created_at,
    authorName: item.author?.name || 'Unknown',
    tags: (item.tags || []).map((t: any) => t.title),
    attachments: item.attachments || [],
  }
}

// --- Fetch Announcements ---
async function fetchAnnouncements(page: number = 1) {
  currentPage.value = page
  loading.value = true
  error.value = null
  try {
    const params = new URLSearchParams()
    params.append('sortId', '0')
    params.append('perPage', itemsPerPage.value.toString())
    params.append('page', page.toString())
    if (selectedTagId.value)
      params.append('tags[]', selectedTagId.value.toString())

    if (selectedAuthorId.value)
      params.append('users[]', selectedAuthorId.value.toString())

    if (searchText.value)
      params.append('title', searchText.value)

    const res = await $fetch(
      `https://aboard.iee.ihu.gr/api/v2/announcements?${params.toString()}`,
      {
        headers: { accept: 'application/json' },
      },
    )
    announcements.value = (res.data || []).map((item: any) =>
      transformAboardData(item),
    )
    meta.value = { total: res.meta.total, last_page: res.meta.last_page }
  }
  catch (err: any) {
    console.error(err)
    error.value = err.message || 'Failed to fetch announcements'
  }
  finally {
    loading.value = false
  }
}

// --- Fetch Filter Tags (for aboard) ---
async function fetchFilterTags() {
  try {
    const res = await $fetch('https://aboard.iee.ihu.gr/api/v2/filtertags', {
      headers: { accept: 'application/json' },
    })
    filterTags.value = (res || []).map((tag: any) => ({
      id: tag.id,
      title: tag.title,
    }))
  }
  catch (err: any) {
    console.error('Error fetching filter tags:', err)
  }
}

// --- Fetch Authors (for aboard) ---
async function fetchAuthors() {
  try {
    const res = await $fetch('https://aboard.iee.ihu.gr/api/v2/authors', {
      headers: { accept: 'application/json' },
    })
    authors.value = (res || []).map((author: any) => ({
      id: author.id,
      name: author.name,
    }))
  }
  catch (err: any) {
    console.error('Error fetching authors:', err)
  }
}

// --- Clear Filters Handler (for aboard) ---
function clearFilters() {
  selectedTagId.value = null
  selectedAuthorId.value = null
  searchText.value = ''
  fetchAnnouncements(1)
}

// --- Pagination Controls ---
function prevPage() {
  if (currentPage.value > 1)
    fetchAnnouncements(currentPage.value - 1)
}
function nextPage() {
  if (meta.value && currentPage.value < meta.value.last_page)
    fetchAnnouncements(currentPage.value + 1)
}

// --- Modal Controls ---
const selectedAnnouncement = ref<UnifiedAnnouncement | null>(null)
function openAnnouncement(ann: UnifiedAnnouncement) {
  selectedAnnouncement.value = ann
}
function closeAnnouncement() {
  selectedAnnouncement.value = null
}

function getFileMeta(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const map: Record<string, { icon: string; label: string }> = {
    pdf: { icon: '📕', label: 'PDF' },
    doc: { icon: '📘', label: 'Word' },
    docx: { icon: '📘', label: 'Word' },
    xls: { icon: '📊', label: 'Excel' },
    xlsx: { icon: '📊', label: 'Excel' },
    csv: { icon: '📊', label: 'CSV' },
    jpg: { icon: '📷', label: 'Image' },
    jpeg: { icon: '📷', label: 'Image' },
    png: { icon: '📷', label: 'Image' },
    gif: { icon: '📷', label: 'Image' },
    zip: { icon: '🗜️', label: 'Archive' },
    rar: { icon: '🗜️', label: 'Archive' },
    txt: { icon: '📄', label: 'Text' },
  }

  return map[ext] || { icon: '📄', label: ext.toUpperCase() || 'File' }
}

onMounted(() => {
  // Default source is "aboard"
  fetchFilterTags()
  fetchAuthors()
  fetchAnnouncements()
})
</script>

<template>
  <MainContent back>
    <template #title>
      <div class="timeline-title flex items-center gap-2" @click="$scrollToTop">
        <Icon name="majesticons:megaphone-line" size="1.5em" />
        {{ $t('nav.announcements') }}
      </div>
    </template>
    <div class="max-w-7xl mx-auto p-8 bg-base">
      <!-- Filter Section (only for aboard) -->
      <div
        v-if="selectedSource === 'aboard'"
        class="mb-6 flex flex-col md:flex-row md:flex-wrap md:items-end gap-4 px-4"
      >
        <!-- Search by Title -->
        <div class="flex flex-col w-full md:w-auto">
          <label
            for="searchInput"
            class="block text-sm font-medium text-primary-dark"
          >
            Αναζήτηση με τίτλο:
          </label>
          <div
            class="mt-1 flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0"
          >
            <input
              id="searchInput"
              v-model="searchText"
              type="text"
              placeholder="Search..."
              class="w-full md:w-40 rounded border border-secondary-gray px-2 py-1 text-sm text-primary-dark focus:ring-base-orange focus:border-base-orange"
            >
            <button
              class="w-full sm:w-auto px-3 py-1 bg-base-orange text-white rounded hover:bg-base-orange-darker transition-colors text-sm"
              @click="fetchAnnouncements(1)"
            >
              Search
            </button>
          </div>
        </div>

        <!-- Tag Filter -->
        <div class="flex flex-col w-full md:w-auto">
          <label
            for="tagFilter"
            class="block text-sm font-medium text-primary-dark"
          >
            Κατηγορία:
          </label>
          <select
            id="tagFilter"
            v-model.number="selectedTagId"
            class="mt-1 w-full md:w-40 rounded border border-secondary-gray px-2 py-1 text-sm text-primary-dark focus:ring-base-orange focus:border-base-orange"
            @change="fetchAnnouncements(1)"
          >
            <option value="">
              Όλες οι κατηγορίες
            </option>
            <option v-for="tag in filterTags" :key="tag.id" :value="tag.id">
              {{ tag.title }}
            </option>
          </select>
        </div>

        <!-- Author Filter -->
        <div class="flex flex-col w-full md:w-auto">
          <label
            for="authorFilter"
            class="block text-sm font-medium text-primary-dark"
          >
            Συντάκτης:
          </label>
          <select
            id="authorFilter"
            v-model.number="selectedAuthorId"
            class="mt-1 w-full md:w-40 rounded border border-secondary-gray px-2 py-1 text-sm text-primary-dark focus:ring-base-orange focus:border-base-orange"
            @change="fetchAnnouncements(1)"
          >
            <option value="">
              Όλοι
            </option>
            <option v-for="author in authors" :key="author.id" :value="author.id">
              {{ author.name }}
            </option>
          </select>
        </div>

        <!-- Clear Filters Button -->
        <div class="flex flex-col w-full md:w-auto">
          <label class="invisible" for="clearFilters">Καθαρισμός</label>
          <button
            class="mt-1 flex items-center justify-center w-full sm:w-10 h-10 bg-white border border-secondary-gray text-base-orange rounded shadow hover:bg-base-orange hover:text-white transition-colors text-sm"
            title="Clear Filters"
            @click="clearFilters"
          >
            🗑
          </button>
        </div>
      </div>

      <!-- Announcements Table with Loader Overlay -->
      <div class="relative hidden md:block">
        <table
          class="w-full border border-secondary-gray shadow-lg rounded-lg overflow-hidden"
        >
          <thead class="bg-base-orange">
            <tr>
              <!-- Author first -->
              <th class="px-6 py-2 text-left text-sm font-semibold text-white">
                Συντάκτης
              </th>
              <th class="px-6 py-2 text-left text-sm font-semibold text-white">
                Τίτλος
              </th>
              <th class="px-6 py-2 text-left text-sm font-semibold text-white">
                Κατηγορίες
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-secondary-gray">
            <tr
              v-for="(announcement, index) in announcements"
              :key="`${announcement.id}-${index}`"
              class="group duration-100 transition-colors group-hover:bg-secondary-gray group-focus-visible:ring-2 group-focus-visible:ring-primary-gray cursor-pointer"
              @click="openAnnouncement(announcement)"
            >
              <td class="px-6 py-2 text-sm text-primary-dark">
                {{ announcement.authorName }}
              </td>
              <td class="px-6 py-2 text-sm text-primary-dark">
                {{ announcement.title }}
              </td>
              <td class="px-6 py-2 text-sm text-primary-dark">
                <template v-for="(tag, i) in announcement.tags" :key="i">
                  <span
                    class="inline-block bg-secondary-gray text-primary-dark text-xs px-2 py-0.5 rounded mr-1"
                  >
                    {{ tag }}
                  </span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Loader Overlay -->
        <div
          v-if="loading"
          class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10"
        >
          <svg
            class="animate-spin h-10 w-10 text-base-orange"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      </div>

      <!-- Mobile Friendly List -->
      <div class="space-y-4 md:hidden">
        <div
          v-for="(announcement, index) in announcements"
          :key="`${announcement.id}-${index}`"
          class="p-4 rounded-lg border border-secondary-gray shadow cursor-pointer bg-white"
          @click="openAnnouncement(announcement)"
        >
          <div class="mb-2 text-sm text-primary-dark">
            <strong>Συντάκτης:</strong> {{ announcement.authorName }}
          </div>
          <div class="mb-2 text-sm text-primary-dark">
            <strong>Τίτλος:</strong> {{ announcement.title }}
          </div>
          <div class="text-sm text-primary-dark">
            <strong>Κατηγορίες:</strong>
            <div class="flex flex-wrap mt-1">
              <span
                v-for="(tag, i) in announcement.tags"
                :key="i"
                class="inline-block bg-secondary-gray text-primary-dark text-xs px-2 py-0.5 rounded mr-1 mb-1"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Controls: Pagination and Items per Page -->
      <div class="mt-8 flex flex-col md:flex-row md:justify-between items-center">
        <div class="flex space-x-4 mb-4 md:mb-0">
          <button
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-secondary-gray rounded disabled:opacity-50 hover:bg-primary-gray transition-colors text-sm text-primary-dark"
            @click="prevPage"
          >
            Προηγούμενη
          </button>
          <button
            :disabled="meta && currentPage === meta.last_page"
            class="px-4 py-2 bg-secondary-gray rounded disabled:opacity-50 hover:bg-primary-gray transition-colors text-sm text-primary-dark"
            @click="nextPage"
          >
            Επόμενη
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <label for="itemsPerPage" class="font-medium text-primary-dark text-sm">
            Ανά σελίδα:
          </label>
          <select
            id="itemsPerPage"
            v-model.number="itemsPerPage"
            class="border rounded px-2 py-1 text-sm text-primary-dark focus:ring-base-orange focus:border-base-orange"
            @change="fetchAnnouncements(1)"
          >
            <option :value="5">
              5
            </option>
            <option :value="10">
              10
            </option>
            <option :value="15">
              15
            </option>
            <option :value="20">
              20
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4 text-center text-sm text-primary-dark">
        Σελίδα {{ currentPage }} από {{ meta ? meta.last_page : "?" }}, Σύνολο:
        {{ meta ? meta.total : "?" }}
      </div>

      <!-- Announcement Detail Modal -->
      <div
        v-if="selectedAnnouncement"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div
          class="bg-white rounded-lg max-w-4xl w-full relative overflow-hidden max-h-[90vh] m-4 flex flex-col"
        >
          <!-- Fixed Header -->
          <div
            class="p-6 border-b border-secondary-gray relative flex flex-col gap-2"
          >
            <button
              class="absolute top-4 right-4 text-primary-dark text-3xl hover:text-primary-gray transition-colors"
              @click="closeAnnouncement"
            >
              &times;
            </button>
            <h2 class="text-2xl md:text-3xl font-bold text-primary-dark">
              {{ selectedAnnouncement.title }}
            </h2>
            <div class="flex items-center text-primary-dark text-sm">
              <span class="mr-2">{{ selectedAnnouncement.authorName }}</span>
              <span>&bull;</span>
              <span class="ml-2">{{ selectedAnnouncement.createdAt }}</span>
            </div>
          </div>

          <!-- Scrollable Body -->
          <div class="overflow-y-auto p-6 space-y-6">
            <div
              class="prose max-w-none text-primary-dark"
              v-html="selectedAnnouncement.body"
            />

            <!-- Attachments Section -->
            <div v-if="selectedAnnouncement.attachments?.length">
              <h3 class="text-lg font-semibold text-primary-dark mb-2">
                Συνημμένα:
              </h3>
              <ul class="grid gap-4 sm:grid-cols-2">
                <li
                  v-for="att in selectedAnnouncement.attachments"
                  :key="att.id"
                  class="flex items-center space-x-4 p-4 rounded-lg border border-secondary-gray bg-gray-50 hover:bg-base-orange/10 transition"
                >
                  <div class="text-3xl">
                    {{ getFileMeta(att.filename).icon }}
                  </div>

                  <div class="flex-1 overflow-hidden">
                    <div
                      class="text-sm font-medium text-primary-dark truncate"
                      :title="att.filename"
                    >
                      {{ att.filename }}
                    </div>
                    <div class="text-xs text-secondary-gray">
                      {{ getFileMeta(att.filename).label }}
                    </div>
                  </div>

                  <a
                    :href="att.attachment_url"
                    target="_blank"
                    class="text-xs px-3 py-1 bg-base-orange text-white rounded hover:bg-base-orange-darker transition"
                  >
                    Προβολή
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainContent>
</template>

<style scoped>
/* Optional: styling for active tabs */
button.active {
  border-bottom: 2px solid var(--tw-color-base-orange);
}
</style>
