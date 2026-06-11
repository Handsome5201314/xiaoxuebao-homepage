import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { listAdminLogs, type AdminChatLog } from '@/lib/api'

const TRUNCATE_LEN = 25

export default function ChatLogs() {
  const [logs, setLogs] = useState<AdminChatLog[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [topicFilter, setTopicFilter] = useState('')
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    listAdminLogs()
      .then((items) => {
        setLogs(items)
        setError('')
      })
      .catch((err) => setError(err instanceof Error ? err.message : '读取日志失败'))
  }, [])

  const uniqueTopics = useMemo(() => Array.from(new Set(logs.map(log => log.topic))), [logs])

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q || log.question.toLowerCase().includes(q) || log.userName.toLowerCase().includes(q)
      const matchesTopic = !topicFilter || log.topic === topicFilter
      return matchesSearch && matchesTopic
    })
  }, [logs, searchQuery, topicFilter])

  const truncate = (text: string) => text.length > TRUNCATE_LEN ? text.slice(0, TRUNCATE_LEN) + '…' : text

  return (
    <div>
      <div className="admin-section-header">
        <h2>问答日志</h2>
        <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>共 {filteredLogs.length} 条记录</span>
      </div>
      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-filter-bar">
        <div className="admin-search">
          <MagnifyingGlass size={16} style={{ color: 'var(--admin-text-muted)' }} />
          <input placeholder="搜索提问内容或用户名…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <select className="admin-filter-select" value={topicFilter} onChange={e => setTopicFilter(e.target.value)}>
          <option value="">全部话题</option>
          {uniqueTopics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>用户</th>
              <th>提问</th>
              <th>话题</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(log => (
              <>
                <tr key={log.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{log.time}</td>
                  <td style={{ color: 'var(--admin-text)', fontWeight: 700 }}>{log.userName}</td>
                  <td title={log.question}>{truncate(log.question)}</td>
                  <td><span className="admin-badge admin-badge--info">{log.topic}</span></td>
                  <td>
                    <button className="admin-expand-btn" onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}>
                      {expandedLogId === log.id ? '收起' : '展开'}
                    </button>
                  </td>
                </tr>
                {expandedLogId === log.id && (
                  <tr>
                    <td colSpan={5}>
                      <div className="admin-expand-panel">
                        <p><strong>提问：</strong>{log.question}</p>
                        <p><strong>回答：</strong>{log.answer}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        <div className="admin-mobile-cards">
          {filteredLogs.map(log => {
            const isExpanded = expandedLogId === log.id
            return (
              <div key={log.id} className="admin-mobile-card-item">
                <div className="admin-mobile-card-row"><span className="label">时间</span><span className="value">{log.time}</span></div>
                <div className="admin-mobile-card-row"><span className="label">用户</span><span className="value" style={{ fontWeight: 700 }}>{log.userName}</span></div>
                <div className="admin-mobile-card-row"><span className="label">提问</span><span className="value" style={{ maxWidth: '60%', textAlign: 'right' }}>{truncate(log.question)}</span></div>
                <div className="admin-mobile-card-row"><span className="label">话题</span><span className="value"><span className="admin-badge admin-badge--info">{log.topic}</span></span></div>
                <button className="admin-expand-btn" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={() => setExpandedLogId(isExpanded ? null : log.id)}>
                  {isExpanded ? '收起详情' : '展开详情'}
                </button>
                {isExpanded && (
                  <div className="admin-expand-panel" style={{ marginTop: 8, borderRadius: 'var(--admin-radius-sm)' }}>
                    <p><strong>提问：</strong>{log.question}</p>
                    <p><strong>回答：</strong>{log.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
