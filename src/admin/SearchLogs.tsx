import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { listAdminSearchLogs, type AdminSearchLog } from '@/lib/api'

const TRUNCATE_LEN = 38

export default function SearchLogs() {
  const [logs, setLogs] = useState<AdminSearchLog[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    listAdminSearchLogs()
      .then((items) => {
        setLogs(items)
        setError('')
      })
      .catch((err) => setError(err instanceof Error ? err.message : '读取搜索日志失败'))
  }, [])

  const filteredLogs = useMemo(() => {
    const q = query.trim().toLowerCase()
    return logs.filter((item) => {
      const matchesQuery = !q || item.query.toLowerCase().includes(q) || item.profileId.toLowerCase().includes(q)
      const matchesStatus = !statusFilter || item.status === statusFilter
      return matchesQuery && matchesStatus
    })
  }, [logs, query, statusFilter])

  return (
    <div className="admin-content-inner">
      <div className="admin-section-header">
        <h2>搜索日志</h2>
        <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
          共 {filteredLogs.length} 条记录
        </span>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-filter-bar">
        <div className="admin-search">
          <MagnifyingGlass size={16} style={{ color: 'var(--admin-text-muted)' }} />
          <input
            placeholder="搜索关键词或 profile…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          className="admin-filter-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="">全部状态</option>
          <option value="ok">成功</option>
          <option value="error">失败</option>
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>身份</th>
              <th>查询</th>
              <th>来源</th>
              <th>结果数</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((item) => (
              <tr key={item.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{item.time}</td>
                <td>{roleText(item)}</td>
                <td title={item.query}>{truncate(item.query)}</td>
                <td>{item.provider}</td>
                <td>{item.resultCount}</td>
                <td>
                  <span className={item.status === 'ok' ? 'admin-badge admin-badge--success' : 'admin-badge admin-badge--error'}>
                    {item.status === 'ok' ? '成功' : '失败'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-mobile-cards">
          {filteredLogs.map((item) => (
            <div key={item.id} className="admin-mobile-card-item">
              <div className="admin-mobile-card-row"><span className="label">时间</span><span className="value">{item.time}</span></div>
              <div className="admin-mobile-card-row"><span className="label">身份</span><span className="value">{roleText(item)}</span></div>
              <div className="admin-mobile-card-row"><span className="label">查询</span><span className="value" style={{ maxWidth: '62%', textAlign: 'right' }}>{truncate(item.query)}</span></div>
              <div className="admin-mobile-card-row"><span className="label">结果数</span><span className="value">{item.resultCount}</span></div>
              <div className="admin-mobile-card-row"><span className="label">状态</span><span className="value">{item.status === 'ok' ? '成功' : '失败'}</span></div>
              {item.errorSummary && (
                <div className="admin-expand-panel" style={{ marginTop: 8, borderRadius: 'var(--admin-radius-sm)' }}>
                  {item.errorSummary}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div style={{ color: 'var(--admin-text-muted)', padding: 24, textAlign: 'center' }}>
            暂无搜索日志
          </div>
        )}
      </div>
    </div>
  )
}

function roleText(item: AdminSearchLog) {
  if (item.role === 'visitor') return '游客'
  if (item.role === 'admin') return item.userName ? `管理员：${item.userName}` : '管理员'
  return item.userName ? `用户：${item.userName}` : '普通用户'
}

function truncate(text: string) {
  return text.length > TRUNCATE_LEN ? `${text.slice(0, TRUNCATE_LEN)}…` : text
}
