<script setup lang='ts'>
import stringLength from 'string-length'
import { EditorContent } from '@tiptap/vue-3'

const props = withDefaults(defineProps<{
  shouldExpand?: boolean
  buttonText: string
}>(), {
  shouldExpand: true,
})

const emits = defineEmits<{
  (event: 'publish', body: string): void
}>()

const editorHeight = computed(() => props.shouldExpand ? '15rem' : '8rem')

const content = ref('')

const { editor } = useTiptap({
  content: computed({
    get: () => content.value,
    set: newValue => (content.value = newValue),
  }),
  placeholder: computed(() => 'Write something...'),
  autofocus: true,
  onSubmit: publish,
  onFocus: () => {},
  onPaste: () => {},
})

const characterCount = computed(() => {
  const text = htmlToText(editor.value?.getHTML() || '')

  let length = stringLength(text)

  const linkRegex = /(https?:\/\/(www\.)?|xmpp:)\S+/g

  const maxLength = 23

  for (const [fullMatch] of text.matchAll(linkRegex))
    length -= fullMatch.length - Math.min(maxLength, fullMatch.length)

  return length
})

async function publish() {
  if (characterCount.value > 500)
    return
  if (characterCount.value <= 0)
    return
  emits('publish', htmlToText(editor.value?.getHTML() || ''))
  content.value = ''
}

const showCodeBlockHint = ref(false)

function shouldShowCodeBlockHint() {
  const codeBlockHintLocalStorage = localStorage.getItem('showCodeBlockHint')
  if (codeBlockHintLocalStorage)
    return

  showCodeBlockHint.value = true
  localStorage.setItem('showCodeBlockHint', 'true')
}
</script>

<template>
  <div>
    <div class="border-[1px] border-primary-dark rounded-xl">
      <PublishEditorTools
        v-if="editor"
        :editor="editor"
        class="border-b-[1px] border-primary-dark"
        @show-code-block-hint="shouldShowCodeBlockHint"
      />
      <div class="p-2">
        <EditorContent :editor="editor" />
      </div>
    </div>
    <PublishCharacterCount :character-count="characterCount" :max="500" />
    <div class="mt-2">
      <button
        class="base-button float-right" :aria-label="buttonText"
        :disabled="characterCount <= 0 || characterCount > 500"
        @click="publish"
      >
        {{ buttonText }}
      </button>
    </div>
    <div v-if="showCodeBlockHint" class="pt-10">
      <div class="py-2 px-4 bg-secondary-gray bg-opacity-50 rounded-xl flex justify-between gap-4 items-center">
        <div>
          <Icon name="majesticons:info-circle" size="1.5rem" color="#e69d17" />
        </div>
        <div>
          {{ $t('codeBlockHint') }}
        </div>
        <div class="cursor-pointer">
          <Icon name="majesticons:close" size="1.7rem" @click="showCodeBlockHint = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.content-rich{
  overflow-wrap: break-word;
  outline: none;
  min-height: v-bind(editorHeight);
}
</style>
