import { useState } from 'react'
import { skills, knowledgeBase, type Skill } from './adminData'

export default function SkillManager() {
  const [installedSkills, setInstalledSkills] = useState<Skill[]>(
    skills.filter((s) => s.installed)
  )
  const availableSkills = skills.filter((s) => !s.installed)

  const handleToggle = (id: string) => {
    setInstalledSkills((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: (s.status === 'active' ? 'inactive' : 'active') as Skill['status'] }
          : s
      )
    )
  }

  const badgeClass = (status: string) => {
    switch (status) {
      case '已审核': return 'admin-badge admin-badge--success'
      case '待审核': return 'admin-badge admin-badge--pending'
      case '需更新': return 'admin-badge admin-badge--warn'
      default:      return 'admin-badge'
    }
  }

  return (
    <div className="admin-content-inner">

      {/* ── Section Header ── */}
      <div className="admin-section-header">
        <h2>技能管理</h2>
      </div>

      {/* ── Installed Skills ── */}
      <div style={{ marginBottom: 32 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--admin-text)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          已安装技能
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'var(--admin-bg-muted)',
              color: 'var(--admin-text-secondary)',
              padding: '2px 8px',
              borderRadius: 10,
            }}
          >
            {installedSkills.length}
          </span>
        </h3>

        <div className="admin-skill-grid">
          {installedSkills.map((skill) => (
            <div key={skill.id} className="admin-skill-card">
              <div className="admin-skill-card-header">
                <h4>{skill.name}</h4>
                <button
                  className={`admin-toggle${skill.status === 'active' ? ' on' : ''}`}
                  onClick={() => handleToggle(skill.id)}
                  aria-label={`切换 ${skill.name}`}
                />
              </div>

              <p>{skill.description}</p>

              <div className="admin-skill-card-meta">
                <span>{skill.version}</span>
                <span className="admin-badge admin-badge--info">{skill.category}</span>
              </div>

              <div className="admin-skill-actions">
                <button className="admin-btn admin-btn--ghost admin-btn--sm">配置</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Available Skills ── */}
      {availableSkills.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--admin-text)',
              marginBottom: 16,
            }}
          >
            可安装技能
          </h3>

          <div className="admin-skill-grid">
            {availableSkills.map((skill) => (
              <div key={skill.id} className="admin-skill-card">
                <div className="admin-skill-card-header">
                  <h4>{skill.name}</h4>
                </div>

                <p>{skill.description}</p>

                <div className="admin-skill-card-meta">
                  <span>{skill.version}</span>
                  <span className="admin-badge admin-badge--info">{skill.category}</span>
                </div>

                <div className="admin-skill-actions">
                  <button className="admin-btn admin-btn--primary admin-btn--sm">安装</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Knowledge Base ── */}
      <div style={{ marginBottom: 32 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--admin-text)',
            marginBottom: 16,
          }}
        >
          知识库
        </h3>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>名称</th>
                <th>来源</th>
                <th>条目数</th>
                <th>审核状态</th>
                <th>最后更新</th>
              </tr>
            </thead>
            <tbody>
              {knowledgeBase.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--admin-text)', fontWeight: 600 }}>{item.name}</td>
                  <td>{item.source}</td>
                  <td>{item.items.toLocaleString()}</td>
                  <td>
                    <span className={badgeClass(item.status)}>{item.status}</span>
                  </td>
                  <td>{item.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
