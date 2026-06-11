import { disclaimerText, openSourceLink } from '@/data/content'
import { useInView } from '@/hooks'
import { Warning, GithubLogo, ArrowSquareOut } from '@phosphor-icons/react'
import type React from 'react'

export default function DisclaimerSection() {
  const { ref, isVisible } = useInView(0.1)

  return (
    <section id="disclaimer" className="section" style={styles.section}>
      <div
        ref={ref}
        className={`container fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        {/* Medical Disclaimer */}
        <div style={styles.disclaimerBox}>
          <div style={styles.disclaimerIcon}>
            <Warning size={22} weight="regular" />
          </div>
          <div>
            <h3 style={styles.disclaimerTitle}>医疗免责声明</h3>
            <p style={styles.disclaimerText}>{disclaimerText}</p>
          </div>
        </div>

        {/* Open Source Link */}
        <div style={styles.openSource}>
          <h3 style={styles.osTitle}>开源共建</h3>
          <p style={styles.osDesc}>
            小雪宝是一个开源公益项目，欢迎开发者、医疗工作者和志愿者参与共建。
          </p>
          <a
            href={openSourceLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >
            <GithubLogo size={18} weight="regular" />
            {openSourceLink.label}
            <ArrowSquareOut size={14} weight="regular" />
          </a>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerDivider} />
          <p style={styles.copyright}>
            &copy; {new Date().getFullYear()} 小雪宝 LeukemiaPal &mdash; 给儿童白血病家庭的 AI 关爱伙伴
          </p>
          <p style={styles.footerNote}>
            本项目为公益开源项目，不收取任何费用。
          </p>
        </footer>
      </div>
    </section>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: 'var(--color-surface)',
  },
  disclaimerBox: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    maxWidth: '720px',
    margin: '0 auto 48px',
    padding: '24px 28px',
    background: 'var(--color-accent-wash)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)',
  },
  disclaimerIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'color-mix(in srgb, var(--color-accent) 12%, var(--color-surface))',
    color: 'var(--color-accent)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  disclaimerTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.05rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    marginBottom: '8px',
  },
  disclaimerText: {
    fontSize: '0.938rem',
    lineHeight: 1.7,
    color: 'var(--color-text-body)',
  },
  openSource: {
    textAlign: 'center' as const,
    marginBottom: '48px',
  },
  osTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  osDesc: {
    color: 'var(--color-text-muted)',
    fontSize: '0.938rem',
    maxWidth: '480px',
    margin: '0 auto',
  },
  footer: {
    textAlign: 'center' as const,
    paddingTop: '32px',
  },
  footerDivider: {
    height: '1px',
    background: 'var(--color-border)',
    marginBottom: '24px',
  },
  copyright: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    marginBottom: '4px',
  },
  footerNote: {
    fontSize: '0.8rem',
    color: 'var(--color-text-disabled)',
  },
}
