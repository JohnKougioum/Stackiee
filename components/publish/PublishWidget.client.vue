<script setup lang='ts'>
import stringLength from 'string-length'
import { EditorContent } from '@tiptap/vue-3'

const emits = defineEmits<{
  (event: 'publish', body: string): void
}>()

const content = ref('')

const { editor } = useTiptap({
  content: computed({
    get: () => content.value,
    set: newValue => (content.value = newValue),
  }),
  placeholder: computed(() => 'Write something...'),
  autofocus: true,
  onSubmit: publish,
  onFocus: () => console.log('focus'),
  onPaste: handlePaste,
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

const t = ref()
async function publish() {
  t.value = contentToVNode(editor.value?.getHTML() || '')
  emits('publish', htmlToText(editor.value?.getHTML() || ''))
  // TODO: publish to server -> see markdownReplacements for sanatized html
}

const vnode = computed(() => t.value)

function handlePaste(evt: ClipboardEvent) {
  console.log(evt.clipboardData)
}
</script>

<template>
  <div class="my-10 px-10">
    <div class="border-[1px] border-primary-dark rounded-xl">
      <PublishEditorTools v-if="editor" :editor="editor" class="border-b-[1px] border-primary-dark" />
      <div class="p-2 min-h-[10rem]">
        <EditorContent :editor="editor" />
      </div>
    </div>
    <div class="text-right" :class="{ 'text-red-500': characterCount > 500 }">
      {{ characterCount ?? 0 }}<span text-secondary-light>/</span><span text-secondary-light>{{ 500 }}</span>
    </div>
    <div class="mt-2">
      <button class="base-button float-right" :aria-label="$t('publish')" @click="publish">
        {{ $t('publish') }}
      </button>
    </div>
    <component :is="vnode" />
  </div>
</template>

<style>
.content-rich{
  outline: none;
  min-height: 15rem;
}
</style>
