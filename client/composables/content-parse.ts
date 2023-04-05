import { ELEMENT_NODE, TEXT_NODE, parse, render } from 'ultrahtml'
import type { Node } from 'ultrahtml'
import { decode } from 'tiny-decode'
import type { VNode } from 'vue'
import { Fragment, h, isVNode } from 'vue'
import ContentCode from '~/components/content/ContentCode.vue'

const sanitizerBasicClasses = filterClasses(/^(h-\S*|p-\S*|u-\S*|dt-\S*|e-\S*|mention|hashtag|ellipsis|invisible)$/u)

const sanitizer = sanitize({
  br: {},
  p: {},
  a: {
    href: filterHref(),
    class: sanitizerBasicClasses,
    rel: set('nofollow noopener noreferrer'),
    target: set('_blank'),
  },
  span: {
    class: sanitizerBasicClasses,
  },
  // Allow elements potentially created for Markdown code blocks above
  pre: {},
  code: {
    class: filterClasses(/^language-\w+$/),
  },
  abbr: {
    title: keep,
  },
  del: {},
  blockquote: {
    cite: filterHref(),
  },
  b: {},
  strong: {},
  u: {},
  sub: {},
  sup: {},
  i: {},
  em: {},
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  ul: {},
  ol: {
    start: keep,
    reversed: keep,
  },
  li: {
    value: keep,
  },
})

type Transform = (node: Node, root: Node) => (Node | string)[] | Node | string | null

// Helpers for transforming (filtering, modifying, ...) a parsed HTML tree
// by running the given chain of transform functions one-by-one.
function transformSync(doc: Node, transforms: Transform[]) {
  function visit(node: Node, transform: Transform, root: Node) {
    if (Array.isArray(node.children)) {
      const children = [] as (Node | string)[]
      for (let i = 0; i < node.children.length; i++) {
        const result = visit(node.children[i], transform, root)
        if (Array.isArray(result))
          children.push(...result)

        else if (result)
          children.push(result)
      }

      node.children = children.map((value) => {
        if (typeof value === 'string')
          return { type: TEXT_NODE, value, parent: node }
        value.parent = node
        return value
      })
    }
    return transform(node, root)
  }

  for (const transform of transforms)
    doc = visit(doc, transform, doc) as Node

  return doc
}

type AttrSanitizers = Record<string, (value: string | undefined) => string | undefined>
function sanitize(allowedElements: Record<string, AttrSanitizers>): Transform {
  return (node) => {
    if (node.type !== ELEMENT_NODE)
      return node

    if (!Object.prototype.hasOwnProperty.call(allowedElements, node.name))
      return null

    const attrSanitizers = allowedElements[node.name]
    const attrs = {} as Record<string, string>
    for (const [name, func] of Object.entries(attrSanitizers)) {
      const value = func(node.attributes[name])
      if (value !== undefined)
        attrs[name] = value
    }
    node.attributes = attrs
    return node
  }
}

export function parseHTML(
  html: string,
) {
  // Handle code blocks
  html = html
    .replace(/>(```|~~~)(\w*)([\s\S]+?)\1/g, (_1, _2, lang: string, raw: string) => {
      const code = htmlToText(raw)
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/`/g, '&#96;')
      const classes = lang ? ` class="language-${lang}"` : ''
      return `><pre><code${classes}>${code}</code></pre>`
    })
    .replace(/`([^`\n]*)`/g, (_1, raw) => {
      return raw ? `<code>${htmlToText(raw).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>` : ''
    })

  return transformSync(parse(html), [sanitizer])
}

export function convertHTML(html: string) {
  const tree = parseHTML(html)
  return render(tree)
}

export function htmlToText(html: string) {
  try {
    const tree = parse(html)
    return (tree.children as Node[]).map(n => treeToText(n)).join('').trim()
  }
  catch (err) {
    console.error(err)
    return ''
  }
}

export function treeToText(input: Node): string {
  let pre = ''
  let body = ''
  let post = ''

  if (input.type === TEXT_NODE)
    return decode(input.value)

  if (input.name === 'br')
    return '\n'

  if (['p', 'pre'].includes(input.name))
    pre = '\n'

  if (input.attributes?.['data-type'] === 'mention') {
    const acct = input.attributes['data-id']
    if (acct)
      return acct.startsWith('@') ? acct : `@${acct}`
  }

  if (input.name === 'code') {
    if (input.parent?.name === 'pre') {
      const lang = input.attributes.class?.replace('language-', '')

      pre = `\`\`\`${lang || ''}\n`
      post = '\n```'
    }
    else {
      pre = '`'
      post = '`'
    }
  }
  else if (input.name === 'b' || input.name === 'strong') {
    pre = '**'
    post = '**'
  }
  else if (input.name === 'i' || input.name === 'em') {
    pre = '*'
    post = '*'
  }
  else if (input.name === 'del') {
    pre = '~~'
    post = '~~'
  }
  else if (input.name === 'ul') {
    pre = '__'
    post = '__'
  }
  else if (input.name === 'ol') {
    pre = '~_'
    post = '~_'
  }
  else if (input.name === 'li') {
    pre = '--'
    post = '--'
  }
  else if (input.name === 'h2') {
    pre = '##'
    post = '##'
  }
  else if (input.name === 'h3') {
    pre = '###'
    post = '###'
  }

  if ('children' in input)
    body = (input.children as Node[]).map(n => treeToText(n)).join('')

  return pre + body + post
}

function getTexualAstComponents(astChildren: Node[]): string {
  return astChildren
    .filter(({ type }) => type === TEXT_NODE)
    .map(({ value }) => value)
    .reduce((accumulator, current) => accumulator + current, '')
    .trim()
}

function filterClasses(allowed: RegExp) {
  return (c: string | undefined) => {
    if (!c)
      return undefined

    return c.split(/\s/g).filter(cls => allowed.test(cls)).join(' ')
  }
}

function keep(value: string | undefined) {
  return value
}

function set(value: string) {
  return () => value
}

function filterHref() {
  const LINK_PROTOCOLS = new Set([
    'http:',
    'https:',
    'dat:',
    'dweb:',
    'ipfs:',
    'ipns:',
    'ssb:',
    'gopher:',
    'xmpp:',
    'magnet:',
    'gemini:',
  ])

  return (href: string | undefined) => {
    if (href === undefined)
      return undefined

    // Allow relative links
    if (href.startsWith('/') || href.startsWith('.'))
      return href

    let url
    try {
      url = new URL(href)
    }
    catch (err) {
      if (err instanceof TypeError)
        return undefined
      throw err
    }

    if (LINK_PROTOCOLS.has(url.protocol))
      return url.toString()
    return '#'
  }
}

export function contentToVNode(
  content: string,
): VNode {
  let tree = parseHTML(content)

  const textContents = getTexualAstComponents(tree.children)

  if (textContents.length === 0)
    tree = parseHTML(content)

  return h(Fragment, (tree.children as Node[] || []).map(n => treeToVNode(n)))
}

function treeToVNode(
  input: Node,
): VNode | string | null {
  if (input.type === TEXT_NODE)
    return decode(input.value)

  if ('children' in input) {
    const node = handleCodeBlock(input) || input
    if (node == null)
      return null
    if (isVNode(node))
      return node
    return nodeToVNode(node)
  }
  return null
}

function nodeToVNode(node: Node): VNode | string | null {
  if (node.type === TEXT_NODE)
    return node.value

  if ('children' in node) {
    return h(
      node.name,
      node.attributes,
      node.children.map(treeToVNode),
    )
  }
  return null
}

function handleCodeBlock(el: Node) {
  if (el.name === 'pre' && el.children[0]?.name === 'code') {
    const codeEl = el.children[0] as Node
    const classes = codeEl.attributes.class as string
    const lang = classes?.split(/\s/g).find(i => i.startsWith('language-'))?.replace('language-', '')
    console.log(lang)
    const code = codeEl.children[0] ? treeToText(codeEl.children[0]) : ''
    return h(ContentCode, { lang, code: encodeURIComponent(code) })
  }
}
