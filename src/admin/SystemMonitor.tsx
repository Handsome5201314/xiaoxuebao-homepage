import { Warning, XCircle, Info, Cpu, HardDrives, Memory } from '@phosphor-icons/react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
} from 'recharts'
import { systemHealth, apiCalls24h, modelUsage, errorLogs } from './adminData'

/* ── helpers ── */

const progressColor = (pct: number) =>
  pct > 80 ? 'var(--admin-danger)' : pct >= 60 ? 'var(--admin-warning)' : 'var(--admin-success)'

const statusDotColor = (status: string) => {
  switch (status) {
    case 'healthy':  return 'green'
    case 'warning':  return 'yellow'
    default:         return 'red'
  }
}

const LogIcon = ({ type }: { type: 'warn' | 'error' | 'info' }) => {
  switch (type) {
    case 'warn':
      return <Warning size={18} weight="fill" color="var(--admin-warning)" />
    case 'error':
      return <XCircle size={18} weight="fill" color="var(--admin-danger)" />
    case 'info':
      return <Info size={18} weight="fill" color="var(--admin-primary)" />
  }
}

/* ── component ── */

export default function SystemMonitor() {
  const dotColor = statusDotColor(systemHealth.status)

  return (
    <div className="admin-content-inner">

      {/* ── Health Status Row ── */}
      <div className="admin-health-row">
        {/* 系统状态 */}
        <div className="admin-health-card">
          <span className="admin-health-label">系统状态</span>
          <div className="admin-health-indicator">
            <span className={`admin-health-dot ${dotColor}`} />
            <span className="admin-health-value" style={{ fontSize: '1.15rem' }}>
              正常运行
            </span>
          </div>
          <span className="admin-health-sub">运行时间: {systemHealth.uptime}</span>
        </div>

        {/* API 延迟 */}
        <div className="admin-health-card">
          <span className="admin-health-label">API 延迟</span>
          <span className="admin-health-value">{systemHealth.apiLatency}</span>
          <span className="admin-health-sub">平均响应时间</span>
        </div>

        {/* 今日调用 */}
        <div className="admin-health-card">
          <span className="admin-health-label">今日调用</span>
          <span className="admin-health-value">
            {systemHealth.totalApiCallsToday.toLocaleString()}
          </span>
          <span className="admin-health-sub">API 请求</span>
        </div>
      </div>

      {/* ── Resource Usage Row ── */}
      <div className="admin-health-row">
        {/* CPU */}
        <div className="admin-health-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <Cpu size={20} color="var(--admin-primary)" />
            <span className="admin-health-label" style={{ margin: 0 }}>
              CPU
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <span className="admin-health-value">{systemHealth.cpu}%</span>
          </div>
          <div className="admin-progress">
            <div
              className="admin-progress-bar"
              style={{
                width: `${systemHealth.cpu}%`,
                background: progressColor(systemHealth.cpu),
              }}
            />
          </div>
        </div>

        {/* 内存 */}
        <div className="admin-health-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <Memory size={20} color="var(--admin-primary)" />
            <span className="admin-health-label" style={{ margin: 0 }}>
              内存
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <span className="admin-health-value">{systemHealth.memory}%</span>
          </div>
          <div className="admin-progress">
            <div
              className="admin-progress-bar"
              style={{
                width: `${systemHealth.memory}%`,
                background: progressColor(systemHealth.memory),
              }}
            />
          </div>
        </div>

        {/* 磁盘 */}
        <div className="admin-health-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <HardDrives size={20} color="var(--admin-primary)" />
            <span className="admin-health-label" style={{ margin: 0 }}>
              磁盘
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <span className="admin-health-value">{systemHealth.disk}%</span>
          </div>
          <div className="admin-progress">
            <div
              className="admin-progress-bar"
              style={{
                width: `${systemHealth.disk}%`,
                background: progressColor(systemHealth.disk),
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Chart Row ── */}
      <div className="admin-chart-row">
        {/* Left: 24-hour API call line chart */}
        <div className="admin-chart-card">
          <h3>24小时 API 调用量</h3>
          <div className="admin-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apiCalls24h}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                >
                  <Label
                    value="时间"
                    position="insideBottomRight"
                    offset={-5}
                    fill="#64748B"
                    fontSize={11}
                  />
                </XAxis>
                <YAxis
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  axisLine={{ stroke: '#334155' }}
                  tickLine={{ stroke: '#334155' }}
                >
                  <Label
                    value="调用量"
                    angle={-90}
                    position="insideLeft"
                    fill="#64748B"
                    fontSize={11}
                  />
                </YAxis>
                <Tooltip
                  contentStyle={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    color: '#F1F5F9',
                    fontSize: 13,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#5BA4D9"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#5BA4D9', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#5BA4D9', strokeWidth: 0 }}
                  name="调用量"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: model usage pie chart */}
        <div className="admin-chart-card">
          <h3>模型使用分布</h3>
          <div className="admin-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelUsage}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ cx, cy, x, y, name }) => (
                    <text
                      x={x}
                      y={y}
                      dx={cx > x ? -8 : 8}
                      dy={cy > y ? -4 : 12}
                      fill="#94A3B8"
                      fontSize={12}
                      fontWeight={600}
                      textAnchor={cx > x ? 'end' : 'start'}
                    >
                      {name}
                    </text>
                  )}
                >
                  {modelUsage.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: 8,
                    color: '#F1F5F9',
                    fontSize: 13,
                  }}
                  formatter={(value) => [`${value}%`, '占比']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom legend */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 12,
              flexWrap: 'wrap',
            }}
          >
            {modelUsage.map((m) => (
              <div
                key={m.name}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: m.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--admin-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {m.name} {m.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error Logs ── */}
      <div className="admin-table-wrap" style={{ marginTop: 24 }}>
        <div className="admin-table-header">
          <h3>系统日志</h3>
        </div>

        {errorLogs.map((log) => (
          <div key={log.id} className="admin-log-item">
            <div className="admin-log-icon">
              <LogIcon type={log.type} />
            </div>
            <div className="admin-log-content">
              <p>{log.message}</p>
              <div className="log-time">{log.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
