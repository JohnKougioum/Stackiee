<script setup lang='ts'>
import type { Editor } from '@tiptap/core'

const prop = defineProps<{
  editor: Editor
}>()

const emit = defineEmits<{
  (event: 'showCodeBlockHint'): void
}>()

function codeBlockClicked() {
  prop.editor.chain().focus().toggleCodeBlock().run()
  emit('showCodeBlockHint')
}
</script>

<template>
  <div class="px-4 py-2 w-full flex justify-between items-center">
    <CommonTooltip placement="bottom" content="Bold">
      <button
        class="btn-icon"
        aria-label="Bold"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'bg-secondary-gray': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <Icon name="material-symbols:format-bold" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Italic">
      <button
        class="btn-icon"
        aria-label="Italic"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'bg-secondary-gray': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <Icon name="material-symbols:format-italic" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Block Quote">
      <button
        class="btn-icon"
        aria-label="Block Quote"
        :disabled="!editor.can().chain().focus().toggleBlockquote().run()"
        :class="{ 'bg-secondary-gray': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <Icon name="material-symbols:format-quote-rounded" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Code Block">
      <button
        class="btn-icon"
        aria-label="Code Block"
        :disabled="!editor.can().chain().focus().toggleCodeBlock().run()"
        :class="{ 'bg-secondary-gray': editor.isActive('codeBlock') }"
        @click="codeBlockClicked"
      >
        <Icon name="mdi:code" size="1.2rem" />
      </button>
    </CommonTooltip>
    <div class="divider-vertical" />
    <CommonTooltip placement="bottom" content="Header Large">
      <button
        class="btn-icon"
        aria-label="Header Large"
        :disabled="!editor.can().chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'bg-secondary-gray': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <Icon name="ci:heading-h2" size="1.2rem" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Header Medium">
      <button
        class="btn-icon"
        aria-label="Header Medium"
        :disabled="!editor.can().chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'bg-secondary-gray': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <Icon name="ci:heading-h3" size="1.2rem" />
      </button>
    </CommonTooltip>
    <div class="divider-vertical" />
    <CommonTooltip placement="bottom" content="Undo">
      <button
        class="btn-icon"
        aria-label="Undo"
        :disabled="!editor.can().undo()"
        @click="editor.chain().focus().undo().run()"
      >
        <Icon name="majesticons:undo" size="1.2rem" :color="!editor.can().undo() ? '#737373' : ''" />
      </button>
    </CommonTooltip>
    <CommonTooltip placement="bottom" content="Redo">
      <button
        class="btn-icon"
        aria-label="Redo"
        :disabled="!editor.can().redo()"
        @click="editor.chain().focus().redo().run()"
      >
        <Icon name="majesticons:redo" size="1.2rem" :color="!editor.can().redo() ? '#737373' : ''" />
      </button>
    </CommonTooltip>
  </div>
</template>
