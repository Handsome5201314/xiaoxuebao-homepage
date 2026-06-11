import React, { useEffect, useState } from 'react'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getAdminStats, type AdminStats } from '@/lib/api'
import './admin.css'

function formatDelta(value: number) {
  const isPositive = value >= 0
  return {
    cls: isPositive ? 'positive' : 'negative',
    icon: isPositive ? <ArrowUp size={14} weight="bold" /> : <ArrowDown size={14} weight="bold" />,
    text: `${isPositive ? '+' : ''}${value}%`,
  }
}

const emptyStats: AdminStats = {
  statsOverview: {
    totalUsers: 0,
    activeToday: 0,
    totalQuestions: 0,
    installedSkills: 0,
    userGrowth: 0,
    questionGrowth: 0,
  },
  dailyQuestions: [],
  topicStats: [],
  recentLogs: [],
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>(emptyStats)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminStats()
      .then((nextStats) => {
        setStats(nextStats)
        setError('')
      })
      .catch((err) => setError(err instanceof Error ? err.message : '读取统计失败'))
  }, [])

  const kpiCards = [
    { label: '总用户数', value: stats.statsOverview.totalUsers, delta: stats.statsOverview.userGrowth },
    { label: '今日活跃', value: stats.statsOverview.activeToday },
    { label: '总提问数', value: stats.statsOverview.totalQuestions, delta: stats.statsOverview.questionGrowth },
    { label: '已装技能', value: stats.statsOverview.installedSkills },
  ]

  return (
    <>
      {error && <div className="admin-form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-kpi-row">
        {kpiCards.map((kpi) => {
          const delta = kpi.delta !== undefined ? formatDelta(kpi.delta) : null
          return (
            <div className="admin-kpi-card" key={kpi.label}>
              <span className="admin-kpi-label">{kpi.label}</span>
              <span className="admin-kpi-value">{kpi.value}</span>
              {delta && (
                <span className={`admin-kpi-delta ${delta.cls}`}>
                  {delta.icon}
                  {delta.text}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="admin-chart-row">
        <div className="admin-chart-card">
          <h3>每日提问趋势</h3>
          <div className="admin-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.dailyQuestions}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                <YAxis dataKey="count" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94A3B8' }} />
                <Line type="monotone" dataKey="count" stroke="#5BA4D9" strokeWidth={2} dot={{ r: 4, fill: '#5BA4D9', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-chart-card">
          <h3>热门话题 Top 5</h3>
          <div className="admin-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topicStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
                <YAxis type="category" dataKey="topic" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} width={50} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94A3B8' }} />
                <Bar dataKey="count" fill="#E8943A" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>最近提问</h3>
        </div>
        <div className="admin-activity-list">
          {stats.recentLogs.length > 0 ? stats.recentLogs.map((log) => (
            <div className="admin-activity-item" key={log.id}>
              <span className="admin-activity-time">{log.time.slice(11)}</span>
              <div className="admin-activity-content">
                <span className="admin-activity-user">{log.userName}</span>
                <p className="admin-activity-text">{log.question}</p>
              </div>
            </div>
          )) : (
            <div className="admin-activity-item">
              <div className="admin-activity-content">
                <p className="admin-activity-text">暂无记录</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

const tooltipStyle = {
  background: '#1E293B',
  border: '1px solid #334155',
  borderRadius: 6,
  color: '#F1F5F9',
  fontSize: 12,
}

export default DashboardOverview
