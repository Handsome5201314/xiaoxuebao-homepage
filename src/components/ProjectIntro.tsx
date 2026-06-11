import { Snowflake, ArrowLeft } from '@phosphor-icons/react'
import HeroSection from '@/components/HeroSection'
import IntroSection from '@/components/IntroSection'
import CapabilitiesSection from '@/components/CapabilitiesSection'
import ArchitectureSection from '@/components/ArchitectureSection'
import TeamSection from '@/components/TeamSection'
import AcknowledgmentsSection from '@/components/AcknowledgmentsSection'
import DisclaimerSection from '@/components/DisclaimerSection'
import type React from 'react'

interface ProjectIntroProps {
  onNavigateToChat: () => void
}

export default function ProjectIntro({ onNavigateToChat }: ProjectIntroProps) {
  return (
    <div className="page-enter">
      {/* Top nav */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <button onClick={onNavigateToChat} style={styles.backLink}>
            <ArrowLeft size={16} weight="bold" />
            返回首页
          </button>
          <div style={styles.logo}>
            <Snowflake size={20} weight="regular" style={{ color: 'var(--color-primary)' }} />
            <span>小雪宝</span>
          </div>
          <div style={{ width: '80px' }} />
        </div>
      </nav>

      {/* All existing sections */}
      <main>
        <HeroSection />
        <IntroSection />
        <CapabilitiesSection />
        <ArchitectureSection />
        <TeamSection />
        <AcknowledgmentsSection />
        <DisclaimerSection />
      </main>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    height: '56px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    background: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
  },
  navInner: {
    maxWidth: 'var(--max-width)',
    width: '100%',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--color-primary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 14px',
    borderRadius: 'var(--radius-pill)',
    transition: 'background 0.2s',
    letterSpacing: '0.01em',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: '1.05rem',
    color: 'var(--color-text-heading)',
    letterSpacing: '-0.01em',
  },
}
