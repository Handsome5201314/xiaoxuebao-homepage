import { teamMembers } from '@/data/content'
import { useInView } from '@/hooks'
import { UserCircle } from '@phosphor-icons/react'
import type React from 'react'

export default function TeamSection() {
  const { ref, isVisible } = useInView()

  return (
    <section id="team" className="section" style={styles.section}>
      <div
        ref={ref}
        className={`container fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="section-title">
          <h2>团队</h2>
        </div>
        <p className="section-subtitle">
          一群因为相信"技术可以传递温暖"而走到一起的人
        </p>

        <div style={styles.grid}>
          {teamMembers.map((member, i) => (
            <div key={i} style={styles.card} data-team-card>
              <div style={styles.avatar}>
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={`${member.name}的头像`}
                    style={styles.avatarImg}
                  />
                ) : (
                  <UserCircle size={28} weight="light" style={{ color: 'var(--color-primary)' }} />
                )}
              </div>
              <h3 style={styles.name}>{member.name}</h3>
              <span style={styles.role}>{member.role}</span>
              <p style={styles.bio}>{member.bio}</p>
            </div>
          ))}
        </div>

        <style>{`
          [data-team-card] {
            transition: transform var(--motion-base) var(--motion-ease),
                        box-shadow var(--motion-base) var(--motion-ease);
          }
          [data-team-card]:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-card-hover);
          }
          @media (max-width: 960px) {
            [data-team-grid] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            [data-team-grid] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: 'var(--color-bg)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  card: {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px 24px',
    textAlign: 'center' as const,
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'var(--color-surface-blue)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px',
    overflow: 'hidden',
    border: '2px solid var(--color-border)',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
  },
  role: {
    fontSize: '0.825rem',
    fontWeight: 600,
    color: 'var(--color-primary)',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.02em',
  },
  bio: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    color: 'var(--color-text-muted)',
    marginTop: '4px',
  },
}
