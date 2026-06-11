import { capabilities } from '@/data/content'
import { useInView } from '@/hooks'
import { Card } from '@/components/ui/Card'
import type React from 'react'

export default function CapabilitiesSection() {
  const { ref, isVisible } = useInView()

  return (
    <section id="capabilities" className="section" style={styles.section}>
      <div
        ref={ref}
        className={`container fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="section-title">
          <h2>核心能力</h2>
        </div>
        <p className="section-subtitle">
          小雪宝为家庭照护场景设计，每一项能力都围绕"可靠、可追溯、有温度"展开
        </p>

        <div style={styles.grid} data-cap-grid>
          {capabilities.map((cap, i) => (
            <Card key={i} data-capability-card style={{ cursor: 'default' }}>
              <div style={styles.iconWrap}>
                <cap.icon size={24} weight="regular" />
              </div>
              <h3 style={styles.cardTitle}>{cap.title}</h3>
              <p style={styles.cardDesc}>{cap.description}</p>
            </Card>
          ))}
        </div>

        <style>{`
          [data-capability-card] {
            transition: transform var(--motion-base) var(--motion-ease),
                        box-shadow var(--motion-base) var(--motion-ease);
          }
          [data-capability-card]:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-card-hover);
          }
          @media (max-width: 960px) {
            [data-cap-grid] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 600px) {
            [data-cap-grid] {
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
    padding: '32px 28px',
    border: '1px solid var(--color-border)',
    cursor: 'default',
  },
  iconWrap: {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-primary-wash)',
    color: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'var(--color-text-heading)',
  },
  cardDesc: {
    fontSize: '0.938rem',
    lineHeight: 1.65,
    color: 'var(--color-text-muted)',
  },
}
