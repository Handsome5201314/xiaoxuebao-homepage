import { heroContent } from '@/data/content'
import { useInView } from '@/hooks'
import { Button } from '@/components/ui/Button'

export default function HeroSection() {
  const { ref, isVisible } = useInView(0.1)

  return (
    <section
      id="hero"
      style={styles.section}
    >
      <div
        ref={ref}
        className={`fade-in-up ${isVisible ? 'visible' : ''}`}
        style={styles.inner}
        data-hero-inner
      >
        {/* Text column */}
        <div style={styles.textCol}>
          <span className="spark-badge" style={{ marginBottom: '12px' }}>儿童白血病 AI 关爱助手</span>
          <h1 style={styles.title}>{heroContent.title}</h1>
          <p style={styles.subtitle}>{heroContent.subtitle}</p>
          <p style={styles.description}>{heroContent.description}</p>
          <div style={styles.ctaRow} data-hero-cta>
            <Button
              variant="primary"
              as="anchor"
              href={heroContent.ctaPrimary.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {heroContent.ctaPrimary.label}
            </Button>
            <Button
              variant="secondary"
              as="anchor"
              href={heroContent.ctaSecondary.href}
            >
              {heroContent.ctaSecondary.label}
            </Button>
            <Button
              variant="secondary"
              as="anchor"
              href={heroContent.ctaTertiary.href}
            >
              {heroContent.ctaTertiary.label}
            </Button>
          </div>
        </div>

        {/* Mascot column */}
        <div style={styles.mascotCol}>
          <div className="float-animation" style={styles.mascotFrame} data-hero-mascot-frame>
            <img
              src="/assets/mascot-snow.webp"
              alt={heroContent.mascotAlt}
              style={styles.mascotImg}
              onError={(e) => {
                const target = e.currentTarget
                target.style.display = 'none'
                const fallback = target.nextElementSibling as HTMLElement
                if (fallback) fallback.style.display = 'flex'
              }}
            />
            {/* SVG fallback mascot */}
            <div style={{ display: 'none', ...styles.fallbackWrap }}>
              <svg
                width="220"
                height="260"
                viewBox="0 0 220 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label={heroContent.mascotAlt}
              >
                {/* Body */}
                <ellipse cx="110" cy="195" rx="65" ry="55" fill="#E8F4FD" />
                <ellipse cx="110" cy="195" rx="65" ry="55" stroke="#BEE3F8" strokeWidth="2" />
                {/* Head */}
                <circle cx="110" cy="110" r="52" fill="#E8F4FD" />
                <circle cx="110" cy="110" r="52" stroke="#BEE3F8" strokeWidth="2" />
                {/* Eyes */}
                <path d="M90 105 Q95 100 100 105" stroke="#5BA4D9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M120 105 Q125 100 130 105" stroke="#5BA4D9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                {/* Smile */}
                <path d="M100 120 Q110 130 120 120" stroke="#5BA4D9" strokeWidth="2" strokeLinecap="round" fill="none" />
                {/* Nurse cap */}
                <rect x="88" y="55" width="44" height="28" rx="4" fill="white" stroke="#BEE3F8" strokeWidth="1.5" />
                <rect x="105" y="60" width="10" height="18" rx="1" fill="#5BA4D9" opacity="0.6" />
                <rect x="99" y="66" width="22" height="6" rx="1" fill="#5BA4D9" opacity="0.6" />
                {/* Orange ribbon */}
                <path d="M98 155 L110 170 L122 155 L116 155 L110 163 L104 155 Z" fill="#E8943A" />
                <circle cx="110" cy="152" r="5" fill="#E8943A" />
                {/* Arms */}
                <path d="M50 180 Q40 170 45 160" stroke="#BEE3F8" strokeWidth="12" strokeLinecap="round" fill="none" />
                <path d="M170 180 Q180 170 175 160" stroke="#BEE3F8" strokeWidth="12" strokeLinecap="round" fill="none" />
                {/* Snowflake on top */}
                <g transform="translate(110, 45)">
                  <line x1="0" y1="-8" x2="0" y2="8" stroke="#5BA4D9" strokeWidth="1.5" />
                  <line x1="-7" y1="-4" x2="7" y2="4" stroke="#5BA4D9" strokeWidth="1.5" />
                  <line x1="-7" y1="4" x2="7" y2="-4" stroke="#5BA4D9" strokeWidth="1.5" />
                  <circle cx="0" cy="0" r="2" fill="#5BA4D9" />
                </g>
              </svg>
            </div>
          </div>
          {/* Decorative snowflakes */}
          <div style={styles.snowflakes} aria-hidden="true">
            <SnowflakeIcon size={14} style={{ top: '10%', right: '5%', opacity: 0.25 }} />
            <SnowflakeIcon size={10} style={{ top: '30%', left: '8%', opacity: 0.18 }} />
            <SnowflakeIcon size={18} style={{ bottom: '15%', right: '12%', opacity: 0.2 }} />
            <SnowflakeIcon size={8} style={{ bottom: '35%', left: '3%', opacity: 0.15 }} />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={styles.scrollHint} aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M7 13l5 5 5-5M7 7l5 5 5-5" />
        </svg>
      </div>

      <style>{`
        @media (max-width: 768px) {
          [data-hero-inner] {
            flex-direction: column-reverse !important;
            text-align: center !important;
            gap: 32px !important;
          }
          [data-hero-cta] {
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          [data-hero-mascot-frame] {
            width: 240px !important;
            height: 180px !important;
          }
        }
      `}</style>
    </section>
  )
}

function SnowflakeIcon({ size, style }: { size: number; style: React.CSSProperties }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#5BA4D9"
      strokeWidth="1.5"
      style={{ position: 'absolute', ...style }}
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="4" y1="7" x2="20" y2="17" />
      <line x1="4" y1="17" x2="20" y2="7" />
      <line x1="8" y1="2" x2="12" y2="6" />
      <line x1="16" y1="2" x2="12" y2="6" />
      <line x1="8" y1="22" x2="12" y2="18" />
      <line x1="16" y1="22" x2="12" y2="18" />
    </svg>
  )
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'calc(var(--nav-height) + 32px) var(--space-5) var(--space-7)',
    position: 'relative',
    background: 'linear-gradient(180deg, var(--color-surface-blue) 0%, var(--color-bg) 80%)',
  },
  inner: {
    maxWidth: 'var(--max-width)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '64px',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-accent)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    marginBottom: 'var(--space-3)',
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
    letterSpacing: '-0.03em',
    marginBottom: 'var(--space-3)',
    color: 'var(--color-text-heading)',
  },
  subtitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
    fontWeight: 600,
    color: 'var(--color-primary)',
    marginBottom: 'var(--space-4)',
    lineHeight: 1.3,
  },
  description: {
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: 'var(--color-text-body)',
    maxWidth: '520px',
    marginBottom: 'var(--space-6)',
  },
  ctaRow: {
    display: 'flex',
    gap: 'var(--space-3)',
    flexWrap: 'wrap' as const,
  },
  mascotCol: {
    flex: '0 0 auto',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotFrame: {
    width: '340px',
    height: '260px',
    borderRadius: 'var(--radius-xl)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e8f4fd 0%, #d6eaf8 100%)',
    boxShadow: '0 8px 32px rgba(91, 164, 217, 0.15)',
  },
  mascotImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain' as const,
    borderRadius: 'var(--radius-xl)',
  },
  fallbackWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    background: 'var(--color-surface-blue)',
    borderRadius: 'var(--radius-xl)',
  },
  snowflakes: {
    position: 'absolute' as const,
    inset: 0,
    pointerEvents: 'none' as const,
  },
  scrollHint: {
    position: 'absolute' as const,
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'var(--color-text-muted)',
    opacity: 0.5,
    animation: 'gentle-float 2s ease-in-out infinite',
  },
}
