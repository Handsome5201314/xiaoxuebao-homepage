import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlass, CaretUp, CaretDown } from '@phosphor-icons/react'
import {
  createAdminUser,
  listAdminLogs,
  listAdminUsers,
  setAdminUserStatus,
  type AdminChatLog,
  type AdminUser,
} from '@/lib/api'
import type React from 'react'

type SortField = 'name' | 'role' | 'registerDate' | 'questionCount' | 'lastActive' | 'status'

const COLUMNS: { key: SortField; label: string }[] = [
  { key: 'name', label: '用户名' },
  { key: 'role', label: '角色' },
  { key: 'registerDate', label: '注册时间' },
  { key: 'questionCount', label: '提问次数' },
  { key: 'lastActive', label: '最近活跃' },
  { key: 'status', label: '状态' },
]

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [logs, setLogs] = useState<AdminChatLog[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [form, setForm] = useState({ phone: '', password: '', name: '', role: '家长' })
  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const refresh = async () => {
    const [nextUsers, nextLogs] = await Promise.all([listAdminUsers(), listAdminLogs()])
    setUsers(nextUsers)
    setLogs(nextLogs)
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : '读取用户失败'))
  }, [])

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const processedUsers = useMemo(() => {
    const filtered = users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery))
    return filtered.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      const mul = sortDirection === 'asc' ? 1 : -1
      if (typeof aVal === 'number' && typeof bVal === 'number') return (aVal - bVal) * mul
      return String(aVal).localeCompare(String(bVal)) * mul
    })
  }, [users, searchQuery, sortField, sortDirection])

  const getUserLogs = (userId: string) => logs.filter(log => log.userId === userId)

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <CaretDown size={12} style={{ opacity: 0.3 }} />
    return sortDirection === 'asc' ? <CaretUp size={12} /> : <CaretDown size={12} />
  }

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setIsCreating(true)
    try {
      const created = await createAdminUser(form)
      setUsers((current) => [created, ...current])
      setForm({ phone: '', password: '', name: '', role: '家长' })
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建用户失败')
    } finally {
      setIsCreating(false)
    }
  }

  const toggleStatus = async (user: AdminUser) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active'
    try {
      const updated = await setAdminUserStatus(user.id, nextStatus)
      setUsers((current) => current.map((item) => item.id === updated.id ? updated : item))
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新用户状态失败')
    }
  }

  const renderExpandPanel = (user: AdminUser) => {
    const userLogs = getUserLogs(user.id)
    return (
      <tr>
        <td colSpan={COLUMNS.length + 1}>
          <div className="admin-expand-panel">
            {userLogs.length > 0
              ? userLogs.map(log => (
                  <p key={log.id}><strong>{log.time}</strong> — {log.question}</p>
                ))
              : <p>暂无提问记录</p>
            }
            <p style={{ marginTop: 8, fontWeight: 700 }}>该用户共提问 {user.questionCount} 次</p>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div>
      <div className="admin-section-header">
        <h2>用户管理</h2>
        <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>共 {users.length} 位用户</span>
      </div>

      <form className="admin-create-user" onSubmit={(event) => void handleCreateUser(event)}>
        <input placeholder="手机号或账号" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
        <input placeholder="姓名" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option value="家长">家长</option>
          <option value="医护">医护</option>
          <option value="志愿者">志愿者</option>
        </select>
        <input placeholder="初始密码" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={6} />
        <button className="admin-btn admin-btn--primary" type="submit" disabled={isCreating}>
          {isCreating ? '创建中…' : '创建用户'}
        </button>
      </form>
      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div style={{ marginBottom: 16 }}>
        <div className="admin-search">
          <MagnifyingGlass size={16} style={{ color: 'var(--admin-text-muted)' }} />
          <input placeholder="搜索用户名或账号…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {renderSortIcon(col.key)}
                  </span>
                </th>
              ))}
              <th style={{ cursor: 'default' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {processedUsers.map(user => (
              <>
                <tr key={user.id}>
                  <td style={{ color: 'var(--admin-text)', fontWeight: 700 }}>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.registerDate}</td>
                  <td>{user.questionCount}</td>
                  <td>{user.lastActive}</td>
                  <td>
                    <span className={`admin-badge ${user.status === 'active' ? 'admin-badge--active' : 'admin-badge--inactive'}`}>
                      {user.status === 'active' ? '活跃' : '停用'}
                    </span>
                  </td>
                  <td>
                    <button className="admin-expand-btn" onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}>
                      {expandedUserId === user.id ? '收起' : '展开'}
                    </button>
                    <button className="admin-expand-btn" onClick={() => void toggleStatus(user)}>
                      {user.status === 'active' ? '停用' : '启用'}
                    </button>
                  </td>
                </tr>
                {expandedUserId === user.id && renderExpandPanel(user)}
              </>
            ))}
          </tbody>
        </table>

        <div className="admin-mobile-cards">
          {processedUsers.map(user => {
            const userLogs = getUserLogs(user.id)
            const isExpanded = expandedUserId === user.id
            return (
              <div key={user.id} className="admin-mobile-card-item">
                <div className="admin-mobile-card-row"><span className="label">用户名</span><span className="value" style={{ fontWeight: 700 }}>{user.name}</span></div>
                <div className="admin-mobile-card-row"><span className="label">角色</span><span className="value">{user.role}</span></div>
                <div className="admin-mobile-card-row"><span className="label">注册时间</span><span className="value">{user.registerDate}</span></div>
                <div className="admin-mobile-card-row"><span className="label">提问次数</span><span className="value">{user.questionCount}</span></div>
                <div className="admin-mobile-card-row"><span className="label">状态</span><span className="value">{user.status === 'active' ? '活跃' : '停用'}</span></div>
                <button className="admin-expand-btn" style={{ alignSelf: 'flex-start', marginTop: 4 }} onClick={() => setExpandedUserId(isExpanded ? null : user.id)}>
                  {isExpanded ? '收起提问记录' : '查看提问记录'}
                </button>
                <button className="admin-expand-btn" style={{ alignSelf: 'flex-start' }} onClick={() => void toggleStatus(user)}>
                  {user.status === 'active' ? '停用用户' : '启用用户'}
                </button>
                {isExpanded && (
                  <div className="admin-expand-panel" style={{ marginTop: 8, borderRadius: 'var(--admin-radius-sm)' }}>
                    {userLogs.length > 0
                      ? userLogs.map(log => <p key={log.id}><strong>{log.time}</strong> — {log.question}</p>)
                      : <p>暂无提问记录</p>
                    }
                    <p style={{ marginTop: 8, fontWeight: 700 }}>该用户共提问 {user.questionCount} 次</p>
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
