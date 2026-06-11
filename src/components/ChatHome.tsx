import { useState, useRef, useEffect } from 'react'
import {
  PaperPlaneTilt,
  Phone,
  Plus,
  Trash,
  List,
  Warning,
  GearSix,
  UserCircle,
  Info,
} from '@phosphor-icons/react'
import {
  greeting,
  quickTopics,
  disclaimerShort,
} from '@/data/chatContent'
import { sendChat, type AuthUser, type ChatMessage } from '@/lib/api'
import type React from 'react'
import MarkdownMessage from './MarkdownMessage'

/* ---------- Mock conversation history (sidebar) ---------- */
interface ConversationItem {
  id: string
  title: string
  date: string
  active: boolean
}

const mockConversations: ConversationItem[] = [
  { id: 'c1', title: '化疗后饮食建议', date: '今天', active: true },
  { id: 'c2', title: '孩子发烧处理方法', date: '今天', active: false },
  { id: 'c3', title: '如何跟孩子解释病情', date: '昨天', active: false },
  { id: 'c4', title: '白细胞低怎么办', date: '昨天', active: false },
  { id: 'c5', title: '化疗副作用应对', date: '3天前', active: false },
  { id: 'c6', title: '孩子情绪低落', date: '3天前', active: false },
  { id: 'c7', title: '复查注意事项', date: '一周前', active: false },
  { id: 'c8', title: '营养补充方案', date: '一周前', active: false },
]

interface ChatHomeProps {
  currentUser: AuthUser | null
  onNavigateToIntro: () => void
  onNavigateToAdmin?: () => void
  onNavigateToUserLogin?: () => void
}

export default function ChatHome({
  currentUser,
  onNavigateToIntro,
  onNavigateToAdmin,
  onNavigateToUserLogin,
}: ChatHomeProps) {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [conversations, setConversations] = useState(mockConversations)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, isSending])

  const handleNewChat = () => {
    setMessages([])
    setInputValue('')
    setConversations((prev) =>
      prev.map((c) => ({ ...c, active: false }))
    )
  }

  const handleSelectConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => ({ ...c, active: c.id === id }))
    )
    setMessages([])
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? inputValue).trim()
    if (!text || isSending) return

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: 'user',
      content: text,
    }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInputValue('')
    setIsSending(true)

    // If first message, create a new conversation
    if (messages.length === 0) {
      const newConv: ConversationItem = {
        id: `c-${Date.now()}`,
        title: text.slice(0, 20),
        date: '今天',
        active: true,
      }
      setConversations((prev) => [
        newConv,
        ...prev.map((c) => ({ ...c, active: false })),
      ])
    }

    try {
      const result = await sendChat(nextMessages)
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'assistant',
          content: result.answer,
        },
      ])
    } catch (error) {
      const message = error instanceof Error ? error.message : '网络暂时不可用，请稍后再试。'
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'assistant',
          content: message,
          error: true,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const hasMessages = messages.length > 0

  /* Group conversations by date */
  const groupedConversations = conversations.reduce<Record<string, ConversationItem[]>>((acc, conv) => {
    if (!acc[conv.date]) acc[conv.date] = []
    acc[conv.date].push(conv)
    return acc
  }, {})

  return (
    <div className="page-enter" style={styles.page}>
      {/* ===== Left Sidebar ===== */}
      {!sidebarCollapsed && (
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.logo}>
              <img src="/assets/mascot-avatar-md.png" alt="" width={24} height={24} style={{ borderRadius: '50%' }} />
              <span>小雪宝</span>
            </div>
          </div>

          <button style={styles.newChatBtn} onClick={handleNewChat}>
            <Plus size={16} weight="bold" />
            <span>新对话</span>
          </button>

          <div style={styles.convList}>
            {Object.entries(groupedConversations).map(([date, convs]) => (
              <div key={date}>
                <div style={styles.convDateLabel}>{date}</div>
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    style={{
                      ...styles.convItem,
                      ...(conv.active ? styles.convItemActive : {}),
                    }}
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    <span style={styles.convTitle}>{conv.title}</span>
                    <button
                      style={styles.convDeleteBtn}
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      aria-label="删除对话"
                    >
                      <Trash size={14} weight="regular" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={styles.sidebarFooter}>
            {onNavigateToUserLogin && (
              <button style={styles.sidebarFooterBtn} onClick={onNavigateToUserLogin}>
                <UserCircle size={18} weight="regular" />
                <span>{currentUser ? currentUser.name : '登录 / 我的记录'}</span>
              </button>
            )}
            <div style={styles.sidebarFooterLinks}>
              <button style={styles.sidebarFooterIconBtn} onClick={onNavigateToIntro} aria-label="项目介绍">
                <Info size={18} weight="regular" />
              </button>
              {onNavigateToAdmin && (
                <button style={styles.sidebarFooterIconBtn} onClick={onNavigateToAdmin} aria-label="管理后台">
                  <GearSix size={18} weight="regular" />
                </button>
              )}
            </div>
          </div>
        </aside>
      )}

      {/* ===== Main Chat Area ===== */}
      <main style={styles.main}>
        {/* Top bar */}
        <header style={styles.topBar}>
          <button
            style={styles.toggleSidebarBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? '展开侧栏' : '收起侧栏'}
          >
            <List size={20} weight="regular" />
          </button>
          <div style={styles.topBarTitle}>
            <span style={styles.topBarModelName}>小雪宝</span>
            <span style={styles.topBarModelTag}>AI 关爱助手</span>
          </div>
          <div style={{ width: 40 }} />
        </header>

        {/* Scrollable chat area */}
        <div ref={scrollRef} style={styles.scrollArea}>
          {!hasMessages ? (
            /* Empty state — centered greeting + input + topics */
            <div style={styles.emptyState}>
              <div style={styles.emptyGreeting}>
                <h1 style={styles.greetTitle}>{greeting.title}</h1>
                <p style={styles.greetSubtitle}>{greeting.subtitle}</p>
              </div>

              {/* Inline input */}
              <div style={styles.emptyInputArea}>
                <div className="chat-input-wrap" style={{ maxWidth: '600px' }}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={greeting.placeholder}
                    aria-label="向小雪宝提问"
                    disabled={isSending}
                    onKeyDown={(e) => { if (e.key === 'Enter') void handleSend() }}
                  />
                  <button
                    className="chat-input-send"
                    aria-label="发送"
                    disabled={isSending || !inputValue.trim()}
                    onClick={() => void handleSend()}
                  >
                    <PaperPlaneTilt size={18} weight="bold" />
                  </button>
                </div>

                <div style={styles.topicsGrid}>
                  {quickTopics.map((topic) => (
                    <button
                      key={topic.label}
                      className="topic-card"
                      onClick={() => void handleSend(topic.label)}
                      disabled={isSending}
                    >
                      <span className="topic-icon" style={{ background: topic.bgColor, color: topic.color }}>
                        <topic.icon size={16} weight="regular" />
                      </span>
                      {topic.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active chat — message bubbles */
            <div style={styles.chatContent}>
              {messages.map((msg) => renderBubble(msg.id, msg.role, msg.content, msg.error))}
              {isSending && (
                <div className="chat-bubble-row chat-bubble-row--assistant">
                  <div className="chat-avatar" style={{ background: 'transparent' }}>
                    <img
                      src="/assets/mascot-avatar-md.png"
                      alt="小雪宝"
                      width={36}
                      height={36}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  </div>
                  <div className="chat-bubble chat-bubble--assistant">
                    <div className="typing-dots" aria-label="小雪宝正在输入">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom input bar — always visible */}
        {hasMessages && (
          <div style={styles.bottomInputArea}>
            <div className="chat-input-wrap" style={{ maxWidth: '720px', margin: '0 auto' }}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={greeting.placeholder}
                aria-label="向小雪宝提问"
                disabled={isSending}
                onKeyDown={(e) => { if (e.key === 'Enter') void handleSend() }}
              />
              <button
                className="chat-input-send"
                aria-label="发送"
                disabled={isSending || !inputValue.trim()}
                onClick={() => void handleSend()}
              >
                <PaperPlaneTilt size={18} weight="bold" />
              </button>
            </div>
            <button className="voice-btn" aria-label={greeting.voiceLabel} title={greeting.voiceLabel}>
              <Phone size={20} weight="regular" />
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div style={styles.disclaimerBar}>
          <Warning size={12} weight="regular" style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <span>{disclaimerShort}</span>
        </div>
      </main>
    </div>
  )
}

function renderBubble(key: string, role: ChatMessage['role'], content: string, error = false) {
  const isUser = role === 'user'
  return (
    <div key={key} className={`chat-bubble-row chat-bubble-row--${role}`}>
      <div
        className="chat-avatar"
        style={{
          background: isUser ? 'var(--color-primary-wash)' : 'transparent',
        }}
      >
        {isUser ? (
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
            家
          </span>
        ) : (
          <img
            src="/assets/mascot-avatar-md.png"
            alt="小雪宝"
            width={36}
            height={36}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
          />
        )}
      </div>
      <div className={`chat-bubble chat-bubble--${role}`} style={error ? { borderColor: 'var(--color-danger)' } : undefined}>
        {isUser ? content : <MarkdownMessage content={content} />}
      </div>
    </div>
  )
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/* ============ STYLES ============ */
const SIDEBAR_WIDTH = 260

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: '100vh',
    display: 'flex',
    background: 'var(--color-bg)',
    overflow: 'hidden',
  },

  /* --- Sidebar --- */
  sidebar: {
    width: `${SIDEBAR_WIDTH}px`,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-surface)',
    borderRight: '1px solid var(--color-border)',
    overflow: 'hidden',
  },
  sidebarHeader: {
    padding: '16px 20px 12px',
    flexShrink: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.1rem',
    color: 'var(--color-text-heading)',
  },
  newChatBtn: {
    margin: '0 12px 8px',
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px dashed var(--color-border)',
    background: 'transparent',
    color: 'var(--color-primary)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.875rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  convList: {
    flex: 1,
    overflowY: 'auto',
    padding: '4px 8px',
  },
  convDateLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--color-text-disabled)',
    padding: '12px 12px 4px',
    letterSpacing: '0.04em',
  },
  convItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.15s',
    marginBottom: '2px',
  },
  convItemActive: {
    background: 'var(--color-primary-wash)',
  },
  convTitle: {
    fontSize: '0.84rem',
    color: 'var(--color-text-body)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    flex: 1,
    lineHeight: 1.4,
  },
  convDeleteBtn: {
    opacity: 0,
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-disabled)',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: '4px',
    transition: 'opacity 0.15s, color 0.15s',
  },
  sidebarFooter: {
    flexShrink: 0,
    borderTop: '1px solid var(--color-border)',
    padding: '8px 12px',
  },
  sidebarFooterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-body)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.84rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  sidebarFooterLinks: {
    display: 'flex',
    gap: '4px',
    padding: '4px 0',
  },
  sidebarFooterIconBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },

  /* --- Main area --- */
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  },
  topBar: {
    flexShrink: 0,
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
  },
  toggleSidebarBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  topBarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  topBarModelName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.95rem',
    color: 'var(--color-text-heading)',
  },
  topBarModelTag: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
    background: 'var(--color-primary-wash)',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '0 24px',
  },

  /* --- Empty state (no messages) --- */
  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 0',
  },
  emptyGreeting: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  greetTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 800,
    color: 'var(--color-text-heading)',
    marginBottom: '8px',
  },
  greetSubtitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.05rem',
    fontWeight: 500,
    color: 'var(--color-text-muted)',
  },
  emptyInputArea: {
    width: '100%',
    maxWidth: '660px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  topicsGrid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
  },

  /* --- Active chat --- */
  chatContent: {
    maxWidth: '760px',
    margin: '0 auto',
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  /* --- Bottom input (when chat active) --- */
  bottomInputArea: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
  },

  /* --- Disclaimer --- */
  disclaimerBar: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '8px 24px',
    fontSize: '0.72rem',
    lineHeight: 1.5,
    color: 'var(--color-text-disabled)',
    borderTop: '1px solid color-mix(in srgb, var(--color-border) 50%, transparent)',
  },
}
