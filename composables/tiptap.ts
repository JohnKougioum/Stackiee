import type { Editor } from '@tiptap/vue-3'
import { Extension, useEditor } from '@tiptap/vue-3'
import Placeholder from '@tiptap/extension-placeholder'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Mention from '@tiptap/extension-mention'
import HardBreak from '@tiptap/extension-hard-break'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Blockquote from '@tiptap/extension-blockquote'
import History from '@tiptap/extension-history'
import Heading from '@tiptap/extension-heading'
import Bulletlist from '@tiptap/extension-bullet-list'
import Orderlist from '@tiptap/extension-ordered-list'
import Listitem from '@tiptap/extension-list-item'

import type { Ref } from 'vue'
import { TiptapPluginCodeBlockShiki } from './shikit-editor'

export interface UseTiptapOptions {
  content: Ref<string>
  placeholder: Ref<string | undefined>
  onSubmit: () => void
  onFocus: () => void
  onPaste: (event: ClipboardEvent) => void
  autofocus: boolean
}

export function useTiptap(options: UseTiptapOptions) {
  if (process.server)
    return { editor: ref<Editor | undefined>() }

  const {
    autofocus,
    content,
    placeholder,
  } = options

  const editor = useEditor({
    content: content.value,
    extensions: [
      Document,
      Paragraph,
      HardBreak,
      Bold,
      Italic,
      Blockquote,
      Text,
      Heading,
      Bulletlist,
      Orderlist,
      Listitem,
      Mention
        .configure({
          HTMLAttributes: {
            class: 'mention',
          },
        }),
      Placeholder.configure({
        placeholder: () => placeholder.value!,
      }),
      TiptapPluginCodeBlockShiki,
      History.configure({
        depth: 10,
      }),
      Extension.create({
        name: 'api',
        addKeyboardShortcuts() {
          return {
            'Mod-Enter': () => {
              options.onSubmit()
              return true
            },
          }
        },
        onFocus() {
          options.onFocus()
        },
      }),
    ],
    onUpdate({ editor }) {
      content.value = editor.getHTML()
    },
    editorProps: {
      attributes: {
        class: 'content-editor content-rich',
      },
    },
    autofocus,
    editable: true,
  })

  watch(content, (value) => {
    if (editor.value?.getHTML() === value)
      return
    editor.value?.commands.setContent(value || '', false)
  })
  watch(placeholder, () => {
    editor.value?.view.dispatch(editor.value?.state.tr)
  })

  return {
    editor,
  }
}
