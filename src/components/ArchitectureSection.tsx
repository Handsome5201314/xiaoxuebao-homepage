import { architectureSteps } from '@/data/content'
import { useInView } from '@/hooks'
import {
  UsersThree,
  Monitor,
  HardDrives,
  Package,
  Cpu,
} from '@phosphor-icons/react'
import type React from 'react'

const stepIcons = [UsersThree, Monitor, HardDrives, Package, Cpu]

export default function ArchitectureSection() {
  const { ref, isVisible } = useInView()

  return (
    <section id="architecture" className="section" style={styles.section}>
      <div
        ref={ref}
        className={`container fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="section-title">
          <h2>技术架构</h2>
        </div>
        <p className="section-subtitle">
          从家庭到服务层，小雪宝用清晰的分层架构保证每一次回答都可靠
        </p>

        <div style={styles.flow} data-arch-flow>
          {architectureSteps.map((step, i) => {
            const Icon = stepIcons[i]
            const isLast = i === architectureSteps.length - 1
            return (
              <div key={i} style={styles.stepGroup} data-arch-step>
                <div style={styles.node}>
                  <div style={styles.nodeIcon}>
                    <Icon size={22} weight="regular" />
                  </div>
                  <span style={styles.nodeLabel}>{step.label}</span>
                  <span style={styles.nodeSub}>{step.sublabel}</span>
                </div>
                {!isLast && (
                  <div style={styles.arrow} aria-hidden="true" data-arch-arrow>
                    <svg width="32" height="12" viewBox="0 0 32 12" fill="none">
                      <path
                        d="M0 6H28M28 6L22 1M28 6L22 11"
                        stroke="var(--color-primary)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <style>{`
          @media (max-width: 768px) {
            [data-arch-flow] {
              flex-direction: column !important;
              align-items: center !important;
              gap: 8px !important;
            }
            [data-arch-arrow] {
              transform: rotate(90deg);
            }
            [data-arch-step] {
              flex-direction: column !important;
              align-items: center !important;
            }
          }
        `}</style>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: 'var(--color-surface)',
  },
  flow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap' as const,
    padding: '16px 0',
  },
  stepGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  node: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '24px 20px',
    background: 'var(--color-surface-blue)',
    borderRadius: 'var(--radius-lg)',
    minWidth: '140px',
    textAlign: 'center' as const,
    border: '1px solid var(--color-border)',
  },
  nodeIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'var(--color-surface)',
    color: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-sm)',
  },
  nodeLabel: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.938rem',
    color: 'var(--color-text-heading)',
  },
  nodeSub: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
    lineHeight: 1.4,
  },
  arrow: {
    color: 'var(--color-primary)',
    flexShrink: 0,
    opacity: 0.6,
  },
}
