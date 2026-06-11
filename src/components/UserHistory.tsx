import { useEffect, useMemo, useState } from 'react'
import {
  Snowflake,
  SignOut,
  ChatText,
  Calendar,
  CaretDown,
  CaretUp,
  ChatCircle,
} from '@phosphor-icons/react'
import { listHistory, type AuthUser, type HistoryRecord } from '@/lib/api'
import type React from 'react'
import MarkdownMessage from './MarkdownMessage'

interface UserHistoryProps {
  user: AuthUser
  onBack: () => void
  onLogout: () => void
}

const topicColors: Record<string, { color: string; bgColor: string }> = {
  饮食: { color: '#E8943A', bgColor: '#FFF3E0' },
  症状: { color: '#E53E3E', bgColor: '#FFF5F5' },
  生活: { color: '#5BA4D9', bgColor: '#E8F4FD' },
  心理: { color: '#D53F8C', bgColor: '#FFF0F7' },
  发烧: { color: '#E53E3E', bgColor: '#FFF5F5' },
  护理: { color: '#38A169', bgColor: '#F0FFF4' },
  医学: { color: '#5BA4D9', bgColor: '#E8F4FD' },
  用药: { color: '#5BA4D9', bgColor: '#E8F4FD' },
}

const defaultTopicColor = { color: '#718096', bgColor: '#EDF2F7' }

function groupByDate(records: HistoryRecord[]): { date: string; items: HistoryRecord[] }[] {
  const map = new Map<string, HistoryRecord[]>()
  for (const record of records) {
    map.set(record.date, [...(map.get(record.date) || []), record])
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] > b[0] ? -1 : 1))
    .map(([date, items]) => ({ date, items }))
}

export default function UserHistory({ user, onBack, onLogout }: UserHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    setIsLoading(true)
    listHistory()
      .then((records) => {
        if (mounted) {
          setHistory(records)
          setError('')
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : '读取历史记录失败')
        }
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const groups = useMemo(() => groupByDate(history), [history])
  const totalCount = history.length
  const latestDate = history.length > 0 ? history[0].date : null

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <Snowflake size={20} weight="regular" style={{ color: 'var(--color-primary)' }} />
            <span>小雪宝</span>
          </div>
          <div style={styles.navRight}>
            <div style={styles.userBadge}>
              <span style={styles.userAvatar}>{user.name.charAt(0)}</span>
              <span style={styles.userName}>{user.name}</span>
            </div>
            <button onClick={onBack} style={styles.navBtn}>
              <ChatText size={16} />
              <span>对话</span>
            </button>
            <button onClick={onLogout} style={styles.logoutBtn}>
              <SignOut size={16} />
              <span>退出</span>
            </button>
          </div>
        </div>
      </nav>

      <main style={styles.main}>
        <section style={styles.welcomeSection}>
          <h1 style={styles.welcomeTitle}>你好，{user.name}</h1>
          <p style={styles.welcomeSubtitle}>以下是你的对话历史</p>
        </section>

        {error && <div style={styles.errorBox}>{error}</div>}

        {totalCount > 0 && (
          <section style={styles.statsRow}>
            <div style={styles.statCard}>
              <ChatCircle size={18} weight="fill" style={{ color: 'var(--color-primary)' }} />
              <div>
                <div style={styles.statValue}>{totalCount}</div>
                <div style={styles.statLabel}>总提问数</div>
              </div>
            </div>
            <div style={styles.statCard}>
              <Calendar size={18} weight="fill" style={{ color: 'var(--color-accent)' }} />
              <div>
                <div style={styles.statValue}>{latestDate || '--'}</div>
                <div style={styles.statLabel}>最近对话</div>
              </div>
            </div>
          </section>
        )}

        {isLoading ? (
          <section style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>正在读取记录…</h3>
          </section>
        ) : groups.length > 0 ? (
          <section style={styles.historySection}>
            {groups.map((group) => (
              <div key={group.date} style={styles.dateGroup}>
                <div style={styles.dateHeader}>
                  <Calendar size={14} weight="bold" />
                  <span>{group.date}</span>
                  <span style={styles.dateCount}>{group.items.length} 条对话</span>
                </div>
                <div style={styles.recordsList}>
                  {group.items.map((record) => {
                    const isExpanded = expandedId === record.id
                    const topicStyle = topicColors[record.topic] || defaultTopicColor
                    return (
                      <div key={record.id} style={styles.recordCard}>
                        <button onClick={() => toggleExpand(record.id)} style={styles.recordHeader}>
                          <div style={styles.recordMeta}>
                            <span style={styles.recordTime}>{record.time}</span>
                            <span style={{ ...styles.topicBadge, color: topicStyle.color, background: topicStyle.bgColor }}>
                              {record.topic}
                            </span>
                          </div>
                          <div style={styles.recordQuestion}>{record.question}</div>
                          <div style={styles.expandIcon}>
                            {isExpanded ? <CaretUp size={18} weight="bold" /> : <CaretDown size={18} weight="bold" />}
                          </div>
                        </button>
                        {isExpanded && (
                          <div style={styles.answerArea}>
                            <div style={styles.qBubbleRow}>
                              <div style={styles.qAvatar}>
                                <span style={styles.qAvatarText}>{user.name.charAt(0)}</span>
                              </div>
                              <div style={styles.qBubble}>{record.question}</div>
                            </div>
                            <div style={styles.aBubbleRow}>
                              <div style={styles.aAvatar}>
                                <Snowflake size={14} weight="fill" style={{ color: 'var(--color-accent)' }} />
                              </div>
                              <div style={styles.aBubble}>
                                <MarkdownMessage content={record.answer} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section style={styles.emptyState}>
            <div style={styles.emptyIconWrap}>
              <ChatText size={36} weight="duotone" style={{ color: 'var(--color-text-disabled)' }} />
            </div>
            <h3 style={styles.emptyTitle}>暂无对话记录</h3>
            <p style={styles.emptyText}>开始和小雪宝聊天，你的对话历史会保存在这里</p>
            <button onClick={onBack} style={styles.emptyBtn}>
              <ChatCircle size={16} />
              开始提问
            </button>
          </section>
        )}
      </main>

      <button onClick={onBack} style={styles.fab}>
        <ChatCircle size={22} weight="fill" color="#FFFFFF" />
        <span style={styles.fabText}>继续提问</span>
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-body)',
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
    borderBottom: '1px solid var(--color-border)',
  },
  navInner: {
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
    padding: '0 24px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.05rem',
    color: 'var(--color-text-heading)',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  userBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 12px 4px 4px',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--color-surface-secondary)',
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'var(--color-primary)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.78rem',
  },
  userName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.82rem',
    color: 'var(--color-text-body)',
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    border: '1.5px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-body)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    border: '1.5px solid var(--color-border)',
    background: 'var(--color-surface)',
    color: 'var(--color-text-muted)',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.82rem',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
    padding: '0 24px 80px',
  },
  welcomeSection: {
    paddingTop: '36px',
    paddingBottom: '20px',
  },
  welcomeTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
    fontWeight: 800,
    color: 'var(--color-text-heading)',
    margin: 0,
  },
  welcomeSubtitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--color-text-muted)',
    marginTop: '6px',
  },
  errorBox: {
    padding: '12px 16px',
    borderRadius: 'var(--radius-sm)',
    background: '#FFF5F5',
    color: 'var(--color-danger)',
    fontWeight: 700,
    marginBottom: '16px',
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '24px',
    flexWrap: 'wrap',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 20px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    minWidth: '180px',
    flex: '1 1 0',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.1rem',
    color: 'var(--color-text-heading)',
    lineHeight: 1.2,
  },
  statLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.72rem',
    color: 'var(--color-text-muted)',
  },
  historySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  dateGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dateHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.88rem',
    color: 'var(--color-text-heading)',
    paddingBottom: '4px',
    borderBottom: '1px solid var(--color-border)',
  },
  dateCount: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.75rem',
    color: 'var(--color-text-disabled)',
  },
  recordsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  recordCard: {
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
  },
  recordHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  recordMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    flexShrink: 0,
    minWidth: '60px',
  },
  recordTime: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.82rem',
    color: 'var(--color-text-body)',
  },
  topicBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 10px',
    borderRadius: 'var(--radius-pill)',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.7rem',
    whiteSpace: 'nowrap',
  },
  recordQuestion: {
    flex: 1,
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--color-text-body)',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  expandIcon: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    color: 'var(--color-text-muted)',
  },
  answerArea: {
    padding: '4px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderTop: '1px solid var(--color-border)',
  },
  qBubbleRow: {
    display: 'flex',
    flexDirection: 'row-reverse',
    gap: '10px',
    marginTop: '12px',
  },
  qAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'var(--color-primary-wash)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  qAvatarText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.72rem',
    color: 'var(--color-primary)',
  },
  qBubble: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    background: 'var(--color-primary)',
    color: '#FFFFFF',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  aBubbleRow: {
    display: 'flex',
    gap: '10px',
  },
  aAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'var(--color-accent-wash)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aBubble: {
    maxWidth: '80%',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    background: 'var(--color-surface-secondary)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-body)',
    fontSize: '0.875rem',
    lineHeight: 1.6,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    textAlign: 'center',
  },
  emptyIconWrap: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'var(--color-surface-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '0.9rem',
    color: 'var(--color-text-muted)',
    maxWidth: '320px',
    lineHeight: 1.6,
    marginBottom: '20px',
  },
  emptyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    background: 'var(--color-primary)',
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-button)',
  },
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 40,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '52px',
    padding: '0 24px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    background: 'var(--color-primary)',
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-lg)',
  },
  fabText: {
    letterSpacing: '0.02em',
  },
}
