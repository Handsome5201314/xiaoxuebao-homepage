import { describe, expect, it } from 'vitest'
import {
  buildChatPayload,
  extractAssistantAnswer,
  type ChatMessage,
} from './api'

describe('chat api helpers', () => {
  it('builds an ordered same-origin chat payload without empty messages', () => {
    const messages: ChatMessage[] = [
      { id: 'm1', role: 'assistant', content: '你好，我是小雪宝' },
      { id: 'm2', role: 'user', content: '  发烧了怎么办？  ' },
      { id: 'm3', role: 'assistant', content: '请联系主管医生。' },
      { id: 'm4', role: 'user', content: '   ' },
    ]

    expect(buildChatPayload(messages)).toEqual({
      messages: [
        { role: 'assistant', content: '你好，我是小雪宝' },
        { role: 'user', content: '发烧了怎么办？' },
        { role: 'assistant', content: '请联系主管医生。' },
      ],
    })
  })

  it('extracts assistant text from gateway and OpenAI-compatible responses', () => {
    expect(extractAssistantAnswer({ answer: '网关回答' })).toBe('网关回答')
    expect(
      extractAssistantAnswer({
        choices: [{ message: { content: 'Hermes 回答' } }],
      }),
    ).toBe('Hermes 回答')
  })
})
