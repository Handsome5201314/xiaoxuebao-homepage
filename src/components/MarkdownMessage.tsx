import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import type { Components, UrlTransform } from 'react-markdown'

interface MarkdownMessageProps {
  content: string
}

const ALLOWED_IMAGE_PREFIXES = ['/assets/', '/media/', '/api/media/']

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="markdown-message">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={markdownComponents}
        urlTransform={safeUrlTransform}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

function isSafeLink(url: string | undefined): url is string {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true
  if (trimmed.startsWith('#')) return true
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

function isAllowedImage(url: string | undefined): url is string {
  if (!url) return false
  return ALLOWED_IMAGE_PREFIXES.some((prefix) => url.startsWith(prefix))
}

const safeUrlTransform: UrlTransform = (url, key, node) => {
  if (key === 'src' && node.tagName === 'img') {
    return isAllowedImage(url) ? url : ''
  }
  return isSafeLink(url) ? url : ''
}

const markdownComponents: Components = {
  a({ href, children }) {
    if (!isSafeLink(href)) {
      return <span>{children}</span>
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
  img({ src, alt }) {
    if (!isAllowedImage(src)) {
      return (
        <a
          className="markdown-message__image-link"
          href={isSafeLink(src) ? src : undefined}
          target="_blank"
          rel="noopener noreferrer"
        >
          外部图片链接：{alt || src || '未命名图片'}
        </a>
      )
    }
    return <img src={src} alt={alt || ''} loading="lazy" />
  },
  table({ children }) {
    return <div className="markdown-message__table-wrap"><table>{children}</table></div>
  },
}
