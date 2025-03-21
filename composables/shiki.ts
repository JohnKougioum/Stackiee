import type { Highlighter, Lang } from 'shiki-es'
import { getHighlighter } from 'shiki-es'

const shiki = ref<Highlighter>()

const registeredLang = ref(new Map<string, boolean>())
let shikiImport: Promise<void> | undefined

export function useHighlighter(lang: Lang, loadLanguagesDynamically = false) {
  if (!shikiImport) {
    shikiImport = import('shiki-es')
      .then(async () => {
        shiki.value = await getHighlighter({
          theme: 'github-dark',
          langs: loadLanguagesDynamically
            ? [lang]
            : ['c',
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
                'vue-html',
                'vue',
                'php',
              ],
        })
      })
  }

  if (!shiki.value)
    return undefined

  if (!registeredLang.value.get(lang)) {
    shiki.value.loadLanguage(lang)
      .then(() => {
        registeredLang.value.set(lang, true)
      })
      .catch(() => {
        const fallbackLang = 'md'
        shiki.value?.loadLanguage(fallbackLang).then(() => {
          registeredLang.value.set(fallbackLang, true)
        })
      })
    return undefined
  }

  return shiki.value
}

export function useShikiTheme() {
  return 'github-dark'
}

const HTML_ENTITIES = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '\'': '&apos;',
  '"': '&quot;',
} as Record<string, string>

function escapeHtml(text: string) {
  return text.replace(/[<>&'"]/g, ch => HTML_ENTITIES[ch])
}

export function highlightCode(code: string, lang: Lang) {
  const shiki = useHighlighter(lang, true)
  if (!shiki)
    return escapeHtml(code)

  return shiki.codeToHtml(code, {
    lang,
    theme: useShikiTheme(),
  })
}

export function useShiki() {
  return shiki
}
