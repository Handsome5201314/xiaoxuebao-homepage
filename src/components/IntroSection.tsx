import { introContent } from '@/data/content'
import { useInView } from '@/hooks'

export default function IntroSection() {
  const { ref, isVisible } = useInView()

  return (
    <section id="intro" className="section" style={styles.section}>
      <div
        ref={ref}
        className={`container fade-in-up ${isVisible ? 'visible' : ''}`}
      >
        <div className="section-title">
          <h2>关于小雪宝</h2>
        </div>
        <p className="section-subtitle">
          一个为儿童白血病家庭而生的 AI 关爱项目
        </p>

        <div style={styles.content} data-intro-content>
          <div style={styles.textBlock}>
            {introContent.paragraphs.map((p, i) => (
              <p key={i} style={styles.paragraph}>
                {p}
              </p>
            ))}
          </div>

          <div style={styles.visualBlock}>
            <img
              src="/assets/scene-warm.webp"
              alt="小雪宝的温暖魔法——一个可爱的白色角色戴着恐龙帽，手持放大镜，站在雪地里"
              style={styles.image}
              onError={(e) => {
                const target = e.currentTarget
                target.parentElement!.style.background = 'var(--color-surface-blue)'
                target.style.display = 'none'
              }}
            />
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            [data-intro-content] {
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
    background: 'var(--color-surface)',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    alignItems: 'center',
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  paragraph: {
    fontSize: '1.05rem',
    lineHeight: 1.8,
    color: 'var(--color-text-body)',
    maxWidth: '560px',
  },
  visualBlock: {
    display: 'flex',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    maxWidth: '420px',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-lg)',
    objectFit: 'cover' as const,
    aspectRatio: '4 / 3',
  },
}
