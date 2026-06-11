export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  pending?: boolean
  error?: boolean
}

export interface AuthUser {
  id: string
  phone: string
  name: string
  role: string
  is_admin: boolean
}

export interface HistoryRecord {
  id: string
  userId: string
  date: string
  time: string
  question: string
  answer: string
  topic: string
}

export interface AdminUser {
  id: string
  phone: string
  name: string
  registerDate: string
  questionCount: number
  lastActive: string
  status: 'active' | 'inactive'
  role: '家长' | '医护' | '志愿者' | '管理员'
}

export interface AdminChatLog {
  id: string
  userId: string
  userName: string
  time: string
  question: string
  answer: string
  topic: string
}

export interface AdminStats {
  statsOverview: {
    totalUsers: number
    activeToday: number
    totalQuestions: number
    installedSkills: number
    userGrowth: number
    questionGrowth: number
  }
  dailyQuestions: { date: string; count: number }[]
  topicStats: { topic: string; count: number }[]
  recentLogs: AdminChatLog[]
}

interface ApiErrorPayload {
  detail?: string
  error?: string
}

export function buildChatPayload(messages: ChatMessage[]) {
  return {
    messages: messages
      .map((message) => ({
        role: message.role,
        content: message.content.trim(),
      }))
      .filter((message) => message.content.length > 0),
  }
}

export function extractAssistantAnswer(payload: unknown): string {
  if (isRecord(payload) && typeof payload.answer === 'string') {
    return payload.answer
  }
  if (isRecord(payload) && Array.isArray(payload.choices)) {
    const first = payload.choices[0]
    if (isRecord(first) && isRecord(first.message) && typeof first.message.content === 'string') {
      return first.message.content
    }
  }
  return '小雪宝暂时没有拿到有效回答，请稍后再试。'
}

export async function sendChat(messages: ChatMessage[]): Promise<{ answer: string; topic: string; saved: boolean }> {
  const payload = await apiFetch<unknown>('/api/chat', {
    method: 'POST',
    body: JSON.stringify(buildChatPayload(messages)),
  })
  const topic = isRecord(payload) && typeof payload.topic === 'string' ? payload.topic : '其他'
  const saved = isRecord(payload) && payload.saved === true
  return { answer: extractAssistantAnswer(payload), topic, saved }
}

export async function login(identifier: string, password: string): Promise<AuthUser> {
  return apiFetch<AuthUser>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  })
}

export async function logout(): Promise<void> {
  await apiFetch('/api/auth/logout', { method: 'POST' })
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return apiFetch<AuthUser | null>('/api/auth/me')
}

export async function listHistory(): Promise<HistoryRecord[]> {
  return apiFetch<HistoryRecord[]>('/api/history')
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  return apiFetch<AdminUser[]>('/api/admin/users')
}

export async function createAdminUser(input: {
  phone: string
  password: string
  name: string
  role: string
}): Promise<AdminUser> {
  return apiFetch<AdminUser>('/api/admin/users', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function setAdminUserStatus(userId: string, status: 'active' | 'inactive'): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

export async function listAdminLogs(): Promise<AdminChatLog[]> {
  return apiFetch<AdminChatLog[]>('/api/admin/history')
}

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>('/api/admin/stats')
}

async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const response = await fetch(path, {
    ...init,
    headers,
    credentials: 'include',
  })
  if (response.status === 204) {
    return undefined as T
  }
  const contentType = response.headers.get('Content-Type') || ''
  const payload = contentType.includes('application/json') ? await response.json() : await response.text()
  if (!response.ok) {
    const message = isRecord(payload)
      ? String((payload as ApiErrorPayload).detail || (payload as ApiErrorPayload).error || '请求失败')
      : String(payload || '请求失败')
    throw new Error(message)
  }
  return payload as T
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}
