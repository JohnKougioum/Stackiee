<script setup lang='ts'>
import stringLength from 'string-length'
import { EditorContent } from '@tiptap/vue-3'
const props = withDefaults(defineProps<{
  shouldExpand?: boolean
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
</script>

<template>
  <div class="pt-10 pb-12 px-10">
    <div class="border-[1px] border-primary-dark rounded-xl">
      <PublishEditorTools v-if="editor" :editor="editor" class="border-b-[1px] border-primary-dark" />
      <div class="p-2">
        <EditorContent :editor="editor" />
      </div>
    </div>
    <PublishCharacterCount :character-count="characterCount" :max="500" />
    <div class="mt-2">
      <button
        class="base-button float-right" :aria-label="$t('publish')"
        :disabled="characterCount <= 0 || characterCount > 500"
        @click="publish"
      >
        {{ $t('publish') }}
      </button>
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
