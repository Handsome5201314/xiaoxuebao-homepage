import { useState, useRef, useEffect } from 'react'
import {
  PaperPlaneTilt,
  Phone,
  List,
  Plus,
  Trash,
  X,
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

/* ---------- Mock conversation history ---------- */
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
  { id: 'c6', title: '孩子情绪低落', date: '一周前', active: false },
]

interface ChatHomeMobileProps {
  currentUser: AuthUser | null
  onNavigateToIntro: () => void
  onNavigateToAdmin?: () => void
  onNavigateToUserLogin?: () => void
}

export default function ChatHomeMobile({
  currentUser,
  onNavigateToIntro,
  onNavigateToAdmin,
  onNavigateToUserLogin,
}: ChatHomeMobileProps) {
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [conversations, setConversations] = useState(mockConversations)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length, isSending])

  const handleNewChat = () => {
    setMessages([])
    setInputValue('')
    setDrawerOpen(false)
    setConversations((prev) => prev.map((c) => ({ ...c, active: false })))
  }

  const handleSelectConversation = (id: string) => {
    setConversations((prev) => prev.map((c) => ({ ...c, active: c.id === id })))
    setMessages([])
    setDrawerOpen(false)
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConversations((prev) => prev.filter((c) => c.id !== id))
  }

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? inputValue).trim()
    if (!text || isSending) return
    const userMessage: ChatMessage = { id: createMessageId(), role: 'user', content: text }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInputValue('')
    setIsSending(true)

    if (messages.length === 0) {
      const newConv: ConversationItem = {
        id: `c-${Date.now()}`,
        title: text.slice(0, 20),
        date: '今天',
        active: true,
      }
      setConversations((prev) => [newConv, ...prev.map((c) => ({ ...c, active: false }))])
    }

    try {
      const result = await sendChat(nextMessages)
      setMessages((current) => [
        ...current,
        { id: createMessageId(), role: 'assistant', content: result.answer },
      ])
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: createMessageId(),
          role: 'assistant',
          content: error instanceof Error ? error.message : '网络暂时不可用，请稍后再试。',
          error: true,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const hasMessages = messages.length > 0

  const groupedConversations = conversations.reduce<Record<string, ConversationItem[]>>((acc, conv) => {
    if (!acc[conv.date]) acc[conv.date] = []
    acc[conv.date].push(conv)
    return acc
  }, {})

  return (
    <div style={styles.page}>
      {/* ===== Drawer overlay ===== */}
      {drawerOpen && (
        <div style={styles.drawerOverlay} onClick={() => setDrawerOpen(false)}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div style={styles.drawerHeader}>
              <div style={styles.logo}>
                <img src="/assets/mascot-avatar-sm.png" alt="" width={22} height={22} style={{ borderRadius: '50%' }} />
                <span>小雪宝</span>
              </div>
              <button style={styles.drawerCloseBtn} onClick={() => setDrawerOpen(false)}>
                <X size={20} weight="regular" />
              </button>
            </div>

            <button style={styles.newChatBtn} onClick={handleNewChat}>
              <Plus size={16} weight="bold" />
              <span>新对话</span>
            </button>

            <div style={styles.drawerConvList}>
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
                      >
                        <Trash size={14} weight="regular" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div style={styles.drawerFooter}>
              {onNavigateToUserLogin && (
                <button style={styles.drawerFooterBtn} onClick={() => { setDrawerOpen(false); onNavigateToUserLogin() }}>
                  <UserCircle size={18} weight="regular" />
                  <span>{currentUser ? currentUser.name : '登录 / 我的记录'}</span>
                </button>
              )}
              <div style={styles.drawerFooterIcons}>
                <button style={styles.drawerIconBtn} onClick={() => { setDrawerOpen(false); onNavigateToIntro() }}>
                  <Info size={18} weight="regular" />
                </button>
                {onNavigateToAdmin && (
                  <button style={styles.drawerIconBtn} onClick={() => { setDrawerOpen(false); onNavigateToAdmin() }}>
                    <GearSix size={18} weight="regular" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== Top bar ===== */}
      <header style={styles.topBar}>
        <button style={styles.menuBtn} onClick={() => setDrawerOpen(true)} aria-label="对话列表">
          <List size={22} weight="regular" />
        </button>
        <div style={styles.topBarCenter}>
          <img src="/assets/mascot-avatar-sm.png" alt="" width={20} height={20} style={{ borderRadius: '50%' }} />
          <span style={styles.topBarTitle}>小雪宝</span>
        </div>
        <div style={{ width: 44 }} />
      </header>

      {/* ===== Scroll area ===== */}
      <div ref={scrollRef} style={styles.scrollArea}>
        {!hasMessages ? (
          /* Empty state */
          <div style={styles.emptyState}>
            <h1 style={styles.greetTitle}>{greeting.title}</h1>
            <p style={styles.greetSubtitle}>{greeting.subtitle}</p>

            <div style={styles.emptyTopics}>
              {quickTopics.map((topic) => (
                <button
                  key={topic.label}
                  className="mobile-topic-card"
                  onClick={() => void handleSend(topic.label)}
                  disabled={isSending}
                >
                  <span className="topic-icon" style={{ background: topic.bgColor, color: topic.color }}>
                    <topic.icon size={14} weight="bold" />
                  </span>
                  <span style={styles.topicLabel}>{topic.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active chat */
          <div style={styles.chatContent}>
            {messages.map((msg) => renderBubble(msg.id, msg.role, msg.content, msg.error))}
            {isSending && renderTyping()}
          </div>
        )}
      </div>

      {/* ===== Bottom input bar ===== */}
      <div style={styles.bottomBar}>
        <div style={styles.bottomBarInner}>
          <div className="mobile-input-wrap">
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
              className="mobile-send-btn"
              aria-label="发送"
              disabled={isSending || !inputValue.trim()}
              onClick={() => void handleSend()}
            >
              <PaperPlaneTilt size={18} weight="bold" />
            </button>
          </div>
          <button className="mobile-voice-btn" aria-label={greeting.voiceLabel}>
            <Phone size={18} weight="bold" />
          </button>
        </div>
        <div style={styles.disclaimerBar}>
          <Warning size={10} weight="regular" style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          <span>{disclaimerShort}</span>
        </div>
      </div>
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
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>家</span>
        ) : (
          <img
            src="/assets/mascot-avatar-sm.png"
            alt="小雪宝"
            width={30}
            height={30}
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

function renderTyping() {
  return (
    <div className="chat-bubble-row chat-bubble-row--assistant">
      <div className="chat-avatar" style={{ background: 'transparent' }}>
        <img
          src="/assets/mascot-avatar-sm.png"
          alt="小雪宝"
          width={30}
          height={30}
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
  )
}

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/* ============ STYLES ============ */
const styles: Record<string, React.CSSProperties> = {
  page: {
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--color-bg)',
    overflow: 'hidden',
    position: 'relative',
  },

  /* --- Drawer --- */
  drawerOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 100,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
  },
  drawer: {
    width: '280px',
    height: '100%',
    background: 'var(--color-surface)',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
    animation: 'drawerSlideIn 0.25s ease-out',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 16px 12px',
    paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
    flexShrink: 0,
  },
  drawerCloseBtn: {
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
  },
  drawerConvList: {
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
    opacity: 0.4,
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-disabled)',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: '4px',
  },
  drawerFooter: {
    flexShrink: 0,
    borderTop: '1px solid var(--color-border)',
    padding: '8px 12px',
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
  },
  drawerFooterBtn: {
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
  },
  drawerFooterIcons: {
    display: 'flex',
    gap: '4px',
    padding: '4px 0',
  },
  drawerIconBtn: {
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
  },

  /* --- Top bar --- */
  topBar: {
    flexShrink: 0,
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px',
    paddingTop: 'env(safe-area-inset-top, 0px)',
    borderBottom: '1px solid var(--color-border)',
    background: 'var(--color-bg)',
    zIndex: 50,
  },
  menuBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    border: 'none',
    background: 'transparent',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  topBarCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  topBarTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1rem',
    color: 'var(--color-text-heading)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1rem',
    color: 'var(--color-text-heading)',
  },

  /* --- Scroll area --- */
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
    padding: '0 16px',
  },

  /* --- Empty state --- */
  emptyState: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 0',
    gap: '8px',
  },
  greetTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    fontWeight: 800,
    color: 'var(--color-text-heading)',
    textAlign: 'center',
  },
  greetSubtitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: 'var(--color-text-muted)',
    textAlign: 'center',
    marginBottom: '16px',
  },
  emptyTopics: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    maxWidth: '320px',
  },
  topicLabel: {
    fontSize: '0.82rem',
    whiteSpace: 'nowrap',
  },

  /* --- Active chat --- */
  chatContent: {
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  /* --- Bottom bar --- */
  bottomBar: {
    flexShrink: 0,
    background: 'var(--color-bg)',
    borderTop: '1px solid var(--color-border)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    zIndex: 50,
  },
  bottomBarInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px 4px',
  },
  disclaimerBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '4px 16px 8px',
    fontSize: '0.65rem',
    lineHeight: 1.4,
    color: 'var(--color-text-disabled)',
    textAlign: 'center',
  },
}
