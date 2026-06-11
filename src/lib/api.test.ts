import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  buildChatPayload,
  executeAdminCommand,
  extractAssistantAnswer,
  listAdminSearchLogs,
  previewAdminCommand,
  register,
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

  it('registers a normal user through the same-origin API', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({
        id: 'u_1',
        phone: '13800001001',
        name: '注册用户',
        role: '家长',
        is_admin: false,
      }),
    )

    const user = await register({
      phone: '13800001001',
      password: 'StrongPass123',
      name: '注册用户',
      role: '家长',
    })

    expect(user.is_admin).toBe(false)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/auth/register',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          phone: '13800001001',
          password: 'StrongPass123',
          name: '注册用户',
          role: '家长',
        }),
      }),
    )
  })

  it('uses admin command preview and execute endpoints with a confirmation token', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'cmd_1',
          action: 'ability_pack_update',
          status: 'previewed',
          confirmationToken: 'confirm-token',
          expiresAt: '2026-06-11T12:00:00+00:00',
          preview: {
            title: '升级小雪宝能力包',
            riskLevel: 'medium',
            steps: ['fast-forward 更新'],
          },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          id: 'cmd_1',
          action: 'ability_pack_update',
          status: 'executed',
          outputSummary: 'Already up to date.',
          errorSummary: '',
        }),
      )

    const preview = await previewAdminCommand('升级小雪宝能力包')
    const executed = await executeAdminCommand(preview.id, preview.confirmationToken)

    expect(executed.status).toBe('executed')
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/admin/commands/preview',
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/admin/commands/cmd_1/execute',
      expect.objectContaining({
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ confirmationToken: 'confirm-token' }),
      }),
    )
  })

  it('loads admin-only search logs', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse([
        {
          id: 'search_1',
          profileId: 'default',
          userId: null,
          userName: '',
          role: 'visitor',
          query: '儿童白血病护理',
          provider: 'searxng',
          resultCount: 2,
          status: 'ok',
          errorSummary: '',
          time: '2026-06-11 12:00',
        },
      ]),
    )

    const logs = await listAdminSearchLogs()

    expect(logs).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/search-logs',
      expect.objectContaining({ credentials: 'include' }),
    )
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
