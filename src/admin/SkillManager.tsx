import { useEffect, useMemo, useState } from 'react'
import { ClockCounterClockwise, Play, ShieldCheck, WarningOctagon } from '@phosphor-icons/react'
import {
  executeAdminCommand,
  listAdminCommands,
  previewAdminCommand,
  type AdminCommandLog,
  type AdminCommandPreview,
} from '@/lib/api'
import type React from 'react'

const QUICK_COMMANDS = [
  '检查小雪宝能力包状态',
  '升级小雪宝能力包',
  '校验小雪宝能力包',
  '从小雪宝能力包安装技能',
]

export default function SkillManager() {
  const [command, setCommand] = useState('升级小雪宝能力包')
  const [preview, setPreview] = useState<AdminCommandPreview | null>(null)
  const [logs, setLogs] = useState<AdminCommandLog[]>([])
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [error, setError] = useState('')

  const refreshLogs = () => {
    listAdminCommands()
      .then((items) => {
        setLogs(items)
        setError('')
      })
      .catch((err) => setError(err instanceof Error ? err.message : '读取命令日志失败'))
  }

  useEffect(() => {
    refreshLogs()
  }, [])

  const recentLogs = useMemo(() => logs.slice(0, 20), [logs])

  const createPreview = async () => {
    if (!command.trim()) {
      setError('请输入要执行的管理员指令')
      return
    }
    setIsPreviewing(true)
    setError('')
    try {
      const item = await previewAdminCommand(command.trim())
      setPreview(item)
      refreshLogs()
    } catch (err) {
      setPreview(null)
      setError(err instanceof Error ? err.message : '生成预览失败')
    } finally {
      setIsPreviewing(false)
    }
  }

  const executePreview = async () => {
    if (!preview) return
    setIsExecuting(true)
    setError('')
    try {
      await executeAdminCommand(preview.id, preview.confirmationToken)
      setPreview(null)
      refreshLogs()
    } catch (err) {
      setError(err instanceof Error ? err.message : '执行失败')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="admin-content-inner">
      <div className="admin-section-header">
        <h2>技能管理</h2>
        <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
          预览确认后执行
        </span>
      </div>

      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-chart-card" style={{ marginBottom: 24 }}>
        <h3>管理员指令</h3>
        <div style={{ display: 'grid', gap: 14 }}>
          <textarea
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            rows={3}
            style={textareaStyle}
            placeholder="例如：升级小雪宝能力包"
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {QUICK_COMMANDS.map((item) => (
              <button
                key={item}
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => setCommand(item)}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => void createPreview()}
            disabled={isPreviewing}
            type="button"
            style={{ justifySelf: 'start' }}
          >
            <ShieldCheck size={16} weight="bold" />
            {isPreviewing ? '生成中…' : '生成执行预览'}
          </button>
        </div>
      </div>

      {preview && (
        <div className="admin-chart-card" style={{ marginBottom: 24, borderColor: 'var(--admin-warning)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <WarningOctagon size={18} weight="fill" color="var(--admin-warning)" />
            待确认：{preview.preview.title}
          </h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <span className={preview.preview.riskLevel === 'low' ? 'admin-badge admin-badge--success' : 'admin-badge admin-badge--warn'} style={{ width: 'fit-content' }}>
              风险等级：{preview.preview.riskLevel}
            </span>
            <ul style={stepListStyle}>
              {preview.preview.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => void executePreview()}
                disabled={isExecuting}
                type="button"
              >
                <Play size={16} weight="bold" />
                {isExecuting ? '执行中…' : '确认执行'}
              </button>
              <button
                className="admin-btn admin-btn--ghost"
                onClick={() => setPreview(null)}
                type="button"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>命令审计</h3>
          <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
            最近 {recentLogs.length} 条
          </span>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>时间</th>
              <th>动作</th>
              <th>状态</th>
              <th>输出摘要</th>
            </tr>
          </thead>
          <tbody>
            {recentLogs.map((item) => (
              <tr key={item.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{item.executedAt !== '--' ? item.executedAt : item.createdAt}</td>
                <td>{item.preview.title || item.action}</td>
                <td>
                  <span className={statusClass(item.status)}>
                    {statusText(item.status)}
                  </span>
                </td>
                <td title={item.errorSummary || item.outputSummary}>
                  {truncate(item.errorSummary || item.outputSummary || item.command)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-mobile-cards">
          {recentLogs.map((item) => (
            <div key={item.id} className="admin-mobile-card-item">
              <div className="admin-mobile-card-row"><span className="label">时间</span><span className="value">{item.executedAt !== '--' ? item.executedAt : item.createdAt}</span></div>
              <div className="admin-mobile-card-row"><span className="label">动作</span><span className="value">{item.preview.title || item.action}</span></div>
              <div className="admin-mobile-card-row"><span className="label">状态</span><span className="value"><span className={statusClass(item.status)}>{statusText(item.status)}</span></span></div>
              <div className="admin-expand-panel" style={{ marginTop: 8, borderRadius: 'var(--admin-radius-sm)' }}>
                <p><strong>指令：</strong>{item.command}</p>
                <p><strong>摘要：</strong>{item.errorSummary || item.outputSummary || '暂无输出'}</p>
              </div>
            </div>
          ))}
        </div>

        {recentLogs.length === 0 && (
          <div style={emptyStyle}>
            <ClockCounterClockwise size={20} />
            暂无命令记录
          </div>
        )}
      </div>
    </div>
  )
}

function statusClass(status: AdminCommandLog['status']) {
  switch (status) {
    case 'executed':
      return 'admin-badge admin-badge--success'
    case 'failed':
      return 'admin-badge admin-badge--error'
    case 'expired':
      return 'admin-badge admin-badge--inactive'
    default:
      return 'admin-badge admin-badge--pending'
  }
}

function statusText(status: AdminCommandLog['status']) {
  switch (status) {
    case 'executed':
      return '已执行'
    case 'failed':
      return '失败'
    case 'expired':
      return '已过期'
    default:
      return '待确认'
  }
}

function truncate(text: string) {
  return text.length > 72 ? `${text.slice(0, 72)}…` : text
}

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 96,
  resize: 'vertical',
  border: '1px solid var(--admin-border)',
  borderRadius: 'var(--admin-radius)',
  background: 'var(--admin-bg)',
  color: 'var(--admin-text)',
  padding: 14,
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  lineHeight: 1.5,
  outline: 'none',
}

const stepListStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  color: 'var(--admin-text-secondary)',
  lineHeight: 1.8,
}

const emptyStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  color: 'var(--admin-text-muted)',
  padding: 24,
}
