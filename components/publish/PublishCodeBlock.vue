<script setup lang="ts">
import { NodeViewContent, NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps(nodeViewProps)

const languages = [
  'c',
  'cpp',
  'csharp',
  'css',
  'bash',
  'html',
  'java',
  'javascript',
  'jsx',
  'kotlin',
  'python',
  'rust',
  'svelte',
  'swift',
  'tsx',
  'typescript',
  'vue',
  'php',
]

const selectedLanguage = computed({
  get() {
    return props.node.attrs.language
  },
  set(language) {
    props.updateAttributes({ language })
  },
})
</script>

<template>
  <NodeViewWrapper>
    <div class="relative my-2">
      <select
        v-model="selectedLanguage"
        contenteditable="false"
        class="absolute top-1 right-1 rounded px-2 opacity-0 hover:opacity-100 focus:opacity-100 transition
        outline-none border-[1px] border-base"
      >
        <option :value="null">
          plain
        </option>
        <option v-for="(language, index) in languages" :key="index" :value="language">
          {{ language }}
        </option>
      </select>
      <pre class="code-block"><code><NodeViewContent /></code></pre>
    </div>
  </NodeViewWrapper>
</template>
