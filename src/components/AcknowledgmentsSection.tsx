import { acknowledgments } from '@/data/content'
import { useInView } from '@/hooks'
import { Heart } from '@phosphor-icons/react'
import type React from 'react'

export default function AcknowledgmentsSection() {
  const { ref, isVisible } = useInView()

  return (
    <section id="acknowledgments" className="section" style={styles.section}>
      <div
        ref={ref}
        className={`container fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="section-title">
          <h2>致谢</h2>
        </div>
        <p className="section-subtitle">
          小雪宝能走到今天，离不开这些人的支持和信任
        </p>

        <div style={styles.list}>
          {acknowledgments.map((item, i) => (
            <div key={i} style={styles.item}>
              <Heart
                size={16}
                weight="regular"
                style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '3px' }}
              />
              <div>
                <strong style={styles.target}>{item.target}</strong>
                <p style={styles.message}>{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: 'var(--color-surface-warm)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    maxWidth: '680px',
    margin: '0 auto',
  },
  item: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    padding: '20px 24px',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  },
  target: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    display: 'block',
    marginBottom: '4px',
  },
  message: {
    fontSize: '0.938rem',
    lineHeight: 1.65,
    color: 'var(--color-text-body)',
  },
}
