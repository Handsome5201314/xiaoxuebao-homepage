import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import MarkdownMessage from './MarkdownMessage'

describe('MarkdownMessage', () => {
  it('renders structured markdown for readable assistant answers', () => {
    const html = renderToStaticMarkup(
      <MarkdownMessage
        content={[
          '## 可以吃什么',
          '',
          '- **优先选择**：蒸蛋、软面条',
          '- 少量多餐',
          '',
          '> 发热或精神差时请及时联系医生。',
          '',
          '| 食物 | 建议 |',
          '| --- | --- |',
          '| 粥 | 温热软烂 |',
        ].join('\n')}
      />,
    )

    expect(html).toContain('<h2')
    expect(html).toContain('<strong>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<blockquote>')
    expect(html).toContain('<table>')
  })

  it('removes unsafe html and javascript links', () => {
    const html = renderToStaticMarkup(
      <MarkdownMessage content={'<script>alert(1)</script>\n\n[点我](javascript:alert(1))'} />,
    )

    expect(html).not.toContain('<script')
    expect(html).not.toContain('javascript:')
  })

  it('renders only same-origin images and downgrades remote images to links', () => {
    const html = renderToStaticMarkup(
      <MarkdownMessage
        content={[
          '![本地图](/media/xiaoxuebao/food-safety.jpg)',
          '',
          '![外部图](https://example.com/track.png)',
        ].join('\n')}
      />,
    )

    expect(html).toContain('<img')
    expect(html).toContain('/media/xiaoxuebao/food-safety.jpg')
    expect(html).toContain('外部图片链接')
    expect(html).not.toContain('src="https://example.com/track.png"')
  })
})
