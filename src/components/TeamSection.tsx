import { useInView } from '@/hooks'
import {
  UserCircle,
  GithubLogo,
  ArrowSquareOut,
  Rocket,
  Sparkle,
  Package,
  Globe,
  Lightbulb,
} from '@phosphor-icons/react'
import type React from 'react'

/* ---------- Data ---------- */

const projectTimeline = [
  {
    date: '2024 年末',
    title: '构想诞生',
    desc: '在儿科血液肿瘤临床实践中，发现家庭在漫长治疗过程中迫切需要可靠的医学科普和情感支持，萌生了用 AI 帮助白血病家庭的想法。',
    icon: Lightbulb,
  },
  {
    date: '2025 年初',
    title: '能力包架构搭建',
    desc: '基于 Hermes + Skill 架构完成小雪宝能力包设计，包含儿童友好科普、家庭照护问答、医生审核友好等核心技能模块。',
    icon: Package,
  },
  {
    date: '2025 年中',
    title: '前端交互与 Web UI',
    desc: '完成 Web 端和移动端自适应界面开发，融入小雪宝吉祥物形象和温暖视觉风格，支持对话式交互和知识检索。',
    icon: Globe,
  },
  {
    date: '2025 - 2026',
    title: '持续迭代与社区共建',
    desc: '开源能力包仓库，邀请医护、开发者和志愿者参与内容审核与功能扩展，探索 AI 与儿童血液肿瘤诊疗的深度融合。',
    icon: Rocket,
  },
]

const otherMembers = [
  { role: '医学内容顾问', bio: '负责医学知识的准确性审核，确保科普内容符合最新诊疗指南。' },
  { role: 'AI / 后端工程', bio: '负责能力包架构、Hermes 后端接入和模型服务调度。' },
  { role: '前端与视觉设计', bio: '负责用户界面和视觉体验，让技术产品传递温暖感。' },
  { role: '社区共创者', bio: '来自开源社区和医疗领域的志愿者，共同参与小雪宝的建设。' },
]

/* ---------- Component ---------- */

export default function TeamSection() {
  const { ref, isVisible } = useInView()

  return (
    <section id="team" className="section" style={styles.section}>
      <div ref={ref} className={`container fade-in-up ${isVisible ? 'visible' : ''}`}>
        <div className="section-title">
          <h2>团队</h2>
        </div>
        <p className="section-subtitle">
          一群因为相信"技术可以传递温暖"而走到一起的人
        </p>

        {/* ===== Featured Profile: 项目发起人 ===== */}
        <div style={styles.profileCard} data-team-card>
          {/* Header */}
          <div style={styles.profileHeader}>
            <div style={styles.profileAvatar}>
              <span style={styles.avatarText}>李</span>
            </div>
            <div style={styles.profileInfo}>
              <h3 style={styles.profileName}>李帅帅（Alan）</h3>
              <p style={styles.profileRole}>29岁 · 上海/北京 · AI 医疗</p>
            </div>
          </div>

          {/* Profile details — compact card style */}
          <div style={styles.detailGrid} data-contact-row>
            {/* Education */}
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>教育</div>
              <div style={styles.detailValue}>临床医学本科</div>
            </div>

            {/* Experience */}
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>经历</div>
              <div style={styles.detailValue}>
                <span>301医院儿科医生</span>
                <span>上海长征医院急诊/ICU</span>
                <span>美国 Nebraska 交流实习</span>
              </div>
            </div>

            {/* Projects */}
            <div style={styles.detailItemWide}>
              <div style={styles.detailLabel}>项目</div>
              <div style={styles.detailValue}>
                <span>AI 量表平台（孤独症大模型 API 直连解读系统）</span>
                <span>小雪宝 LeukemiaPal（白血病患儿游戏化 AI 助手）</span>
                <span>yourselfcompany（统一云端 API 架构开发平台）</span>
              </div>
            </div>

            {/* Tech */}
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>技术</div>
              <div style={styles.detailTags}>
                <span style={styles.tag}>Vibe Coding</span>
                <span style={styles.tag}>Python</span>
                <span style={styles.tag}>Node.js</span>
                <span style={styles.tag}>Next.js</span>
                <span style={styles.tag}>Docker</span>
              </div>
            </div>

            {/* Hardware */}
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>硬件</div>
              <div style={styles.detailValue}>RTX 3090 + 96GB RAM（本地模型优化与部署）</div>
            </div>

            {/* Certifications */}
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>证书</div>
              <div style={styles.detailValue}>
                <span>执业医师资格证</span>
                <span>心理咨询师高级证书</span>
                <span>赴美带薪实习优秀交流生</span>
              </div>
            </div>

            {/* Interest */}
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>意向</div>
              <div style={styles.detailValue}>AI 医疗 / 脑机接口研究 / 神经调控</div>
            </div>

            {/* GitHub */}
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>GitHub</div>
              <div style={styles.detailValue}>
                <a href="https://github.com/Handsome5201314" target="_blank" rel="noreferrer" style={styles.linkInline}>
                  <GithubLogo size={14} weight="fill" style={{ color: 'var(--color-primary)' }} />
                  github.com/Handsome5201314
                  <ArrowSquareOut size={11} weight="bold" style={{ opacity: 0.5 }} />
                </a>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div style={styles.commentBox}>
            <span style={styles.commentLabel}>评价</span>
            <span style={styles.commentText}>
              临床+技术复合背景，儿科神经医生转型 AI 医疗，持续探索 AI 与神经交叉学科
            </span>
          </div>
        </div>

        {/* ===== 小雪宝成长路径 ===== */}
        <div style={styles.timelineOuter} data-team-card>
          <h3 style={styles.timelineOuterTitle}>
            <Sparkle size={18} weight="fill" style={{ color: 'var(--color-accent)' }} />
            小雪宝的成长路径
          </h3>
          <div style={styles.timeline}>
            {projectTimeline.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.timelineDotWrap}>
                    <div style={styles.timelineDot} />
                    {i < projectTimeline.length - 1 && <div style={styles.timelineLine} />}
                  </div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineHeader}>
                      <Icon size={16} weight="regular" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <span style={styles.timelineDate}>{item.date}</span>
                    </div>
                    <h5 style={styles.timelineTitle}>{item.title}</h5>
                    <p style={styles.timelineDesc}>{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ===== Other team members ===== */}
        <div style={styles.othersSection}>
          <h3 style={styles.othersTitle}>协作伙伴</h3>
          <div style={styles.othersGrid} data-others-grid>
            {otherMembers.map((member, i) => (
              <div key={i} style={styles.otherCard} data-team-card>
                <div style={styles.otherAvatar}>
                  <UserCircle size={24} weight="light" style={{ color: 'var(--color-primary)' }} />
                </div>
                <span style={styles.otherRole}>{member.role}</span>
                <p style={styles.otherBio}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          [data-team-card] {
            transition: transform var(--motion-base) var(--motion-ease),
                        box-shadow var(--motion-base) var(--motion-ease);
          }
          [data-team-card]:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-card-hover);
          }
          @media (max-width: 700px) {
            [data-others-grid] {
              grid-template-columns: 1fr !important;
            }
            [data-contact-row] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}

/* ---------- Styles ---------- */

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: 'var(--color-bg)',
  },

  /* Profile card */
  profileCard: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 20,
    padding: '32px 28px',
    boxShadow: 'var(--shadow-md)',
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-active))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(91, 164, 217, 0.25)',
  },
  avatarText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.5rem',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--color-text-heading)',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: 'var(--color-primary)',
    fontFamily: 'var(--font-display)',
  },

  /* Detail grid */
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px 20px',
    marginBottom: 16,
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'var(--color-surface-secondary)',
    border: '1px solid var(--color-border)',
  },
  detailItemWide: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 4,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'var(--color-surface-secondary)',
    border: '1px solid var(--color-border)',
    gridColumn: '1 / -1',
  },
  detailLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
  },
  detailValue: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2,
    fontSize: '0.84rem',
    lineHeight: 1.6,
    color: 'var(--color-text-body)',
  },
  detailTags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 5,
  },
  tag: {
    padding: '2px 8px',
    borderRadius: 6,
    background: 'var(--color-primary-wash)',
    color: 'var(--color-primary)',
    fontSize: '0.72rem',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
  },
  linkInline: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: 'var(--color-primary)',
    textDecoration: 'none',
    fontSize: '0.84rem',
  },

  /* Comment box */
  commentBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '12px 16px',
    borderRadius: 10,
    background: 'var(--color-accent-wash)',
    border: '1px solid var(--color-border)',
  },
  commentLabel: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--color-accent)',
    flexShrink: 0,
    marginTop: 1,
  },
  commentText: {
    fontSize: '0.84rem',
    lineHeight: 1.6,
    color: 'var(--color-text-body)',
  },

  /* Timeline outer (小雪宝) */
  timelineOuter: {
    marginTop: 32,
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 20,
    padding: '28px 28px 24px',
    boxShadow: 'var(--shadow-md)',
  },
  timelineOuterTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '1px solid var(--color-border)',
  },

  /* Timeline */
  timeline: {
    display: 'flex',
    flexDirection: 'column' as const,
    paddingLeft: 4,
  },
  timelineItem: {
    display: 'flex',
    gap: 14,
  },
  timelineDotWrap: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    flexShrink: 0,
    width: 12,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'var(--color-accent)',
    border: '2px solid var(--color-bg)',
    boxShadow: '0 0 0 2px var(--color-accent-wash)',
    flexShrink: 0,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    background: 'var(--color-border)',
    marginTop: 4,
  },
  timelineContent: {
    paddingBottom: 20,
    flex: 1,
  },
  timelineHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--color-primary)',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.02em',
  },
  timelineTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: '0.82rem',
    lineHeight: 1.6,
    color: 'var(--color-text-muted)',
  },

  /* Other team members */
  othersSection: {
    marginTop: 32,
  },
  othersTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  othersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  } as React.CSSProperties,
  otherCard: {
    background: 'var(--color-surface)',
    borderRadius: 16,
    padding: '24px 16px',
    textAlign: 'center' as const,
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 6,
  },
  otherAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'var(--color-surface-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    border: '2px solid var(--color-border)',
  },
  otherRole: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    fontFamily: 'var(--font-display)',
  },
  otherBio: {
    fontSize: '0.78rem',
    lineHeight: 1.55,
    color: 'var(--color-text-muted)',
  },
}
