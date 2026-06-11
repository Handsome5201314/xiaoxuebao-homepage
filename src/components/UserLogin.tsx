import { useState } from 'react'
import {
  Snowflake,
  Phone,
  Lock,
  Eye,
  EyeSlash,
  ArrowLeft,
  X,
  CheckCircle,
  WarningOctagon,
} from '@phosphor-icons/react'
import { privacyConsent } from '@/data/privacyConsent'
import { login, type AuthUser } from '@/lib/api'
import type React from 'react'

interface UserLoginProps {
  onLogin: (user: AuthUser) => void
  onBack: () => void
}

export default function UserLogin({ onLogin, onBack }: UserLoginProps) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!phone.trim()) {
      setError('请输入手机号')
      return
    }
    if (!password.trim()) {
      setError('请输入密码')
      return
    }
    if (!consentChecked) {
      setError('请先阅读并同意隐私知情同意书')
      return
    }

    setIsSubmitting(true)
    try {
      const user = await login(phone.trim(), password)
      if (user.is_admin) {
        setError('管理员请从管理后台入口登录')
        return
      }
      onLogin(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后再试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConsentAgree = () => {
    setConsentChecked(true)
    setShowConsentModal(false)
    setError('')
  }

  const handleConsentClose = () => {
    setShowConsentModal(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Brand header */}
        <div style={styles.brand}>
          <div style={styles.brandIconWrap}>
            <Snowflake size={24} weight="fill" color="var(--color-primary)" />
          </div>
          <h1 style={styles.brandTitle}>小雪宝</h1>
          <p style={styles.brandSubtitle}>用户登录</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Phone input */}
          <div style={styles.fieldGroup}>
            <label htmlFor="user-phone" style={styles.label}>
              <Phone size={14} weight="bold" style={{ flexShrink: 0 }} />
              手机号
            </label>
            <input
              id="user-phone"
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                setError('')
              }}
              autoComplete="tel"
              style={styles.input}
            />
          </div>

          {/* Password input */}
          <div style={styles.fieldGroup}>
            <label htmlFor="user-password" style={styles.label}>
              <Lock size={14} weight="bold" style={{ flexShrink: 0 }} />
              密码
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="user-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                autoComplete="current-password"
                style={{ ...styles.input, paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Privacy consent */}
          <div style={styles.consentRow}>
            <label style={styles.consentLabel}>
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => {
                  setConsentChecked(e.target.checked)
                  if (e.target.checked) setError('')
                }}
                style={styles.checkbox}
              />
              {consentChecked ? (
                <CheckCircle
                  size={18}
                  weight="fill"
                  style={{ color: 'var(--color-success)', flexShrink: 0 }}
                />
              ) : (
                <span style={styles.checkboxVisual} />
              )}
              <span style={styles.consentText}>
                我已阅读并同意
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowConsentModal(true)}
              style={styles.consentLink}
            >
              《隐私风险知情同意书》
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div style={styles.errorBox}>
              <WarningOctagon
                size={16}
                weight="fill"
                style={{ flexShrink: 0 }}
              />
              <span>{error}</span>
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={!consentChecked || isSubmitting}
            style={{
              ...styles.loginBtn,
              ...(consentChecked && !isSubmitting ? {} : styles.loginBtnDisabled),
            }}
          >
            {isSubmitting ? '登录中…' : '登录'}
          </button>
        </form>

        {/* Hint */}
        <p style={styles.hint}>
          账号由管理员创建，登录后可查看自己的对话记录。
        </p>

        {/* Back button */}
        <button onClick={onBack} style={styles.backBtn}>
          <ArrowLeft size={16} />
          返回用户端
        </button>
      </div>

      {/* Privacy consent modal */}
      {showConsentModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            {/* Close button */}
            <button
              onClick={handleConsentClose}
              aria-label="关闭"
              style={styles.modalCloseBtn}
            >
              <X size={22} weight="bold" />
            </button>

            {/* Modal header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{privacyConsent.title}</h2>
              <div style={styles.modalMeta}>
                <span style={styles.modalBadge}>{privacyConsent.version}</span>
                <span style={styles.modalDate}>
                  生效日期：{privacyConsent.effectiveDate}
                </span>
              </div>
            </div>

            {/* Modal body */}
            <div style={styles.modalBody}>
              {privacyConsent.sections.map((section, i) => (
                <div key={i} style={styles.consentSection}>
                  <h3 style={styles.consentHeading}>{section.heading}</h3>
                  <p style={styles.consentContent}>{section.content}</p>
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div style={styles.modalFooter}>
              <button onClick={handleConsentAgree} style={styles.agreeBtn}>
                <CheckCircle size={18} weight="fill" />
                我已阅读，关闭并同意
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  /* Page */
  page: {
    minHeight: '100vh',
    background: 'var(--color-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    fontFamily: 'var(--font-body)',
  },

  /* Card */
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    padding: '36px 32px 28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  /* Brand */
  brand: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '28px',
  },
  brandIconWrap: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'var(--color-primary-wash)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--color-text-heading)',
    letterSpacing: '-0.02em',
    margin: 0,
  },
  brandSubtitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--color-text-muted)',
    marginTop: '4px',
  },

  /* Form */
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    fontSize: '0.825rem',
    color: 'var(--color-text-body)',
  },
  input: {
    width: '100%',
    height: '46px',
    padding: '0 16px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--color-border)',
    background: 'var(--color-surface)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.938rem',
    color: 'var(--color-text-body)',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
  },

  /* Consent */
  consentRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '2px',
    padding: '4px 0',
  },
  consentLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '0.84rem',
    color: 'var(--color-text-body)',
    fontWeight: 500,
  },
  checkbox: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    opacity: 0,
    pointerEvents: 'none',
  },
  checkboxVisual: {
    width: '18px',
    height: '18px',
    borderRadius: '4px',
    border: '2px solid var(--color-border)',
    flexShrink: 0,
    display: 'inline-block',
  },
  consentText: {
    color: 'var(--color-text-body)',
  },
  consentLink: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    fontSize: '0.84rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'underline',
    textDecorationColor: 'transparent',
    transition: 'text-decoration-color 0.2s',
  },

  /* Error */
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    background: '#FFF5F5',
    color: 'var(--color-danger)',
    fontSize: '0.84rem',
    fontWeight: 600,
  },

  /* Buttons */
  loginBtn: {
    width: '100%',
    height: '48px',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--color-primary)',
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-button)',
    transition: 'background 0.2s, transform 0.15s, box-shadow 0.2s',
    marginTop: '4px',
  },
  loginBtnDisabled: {
    background: 'var(--color-text-disabled)',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  hint: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'var(--color-text-disabled)',
    marginTop: '16px',
    textAlign: 'center',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    marginTop: '16px',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontSize: '0.84rem',
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: 'var(--radius-sm)',
    transition: 'color 0.15s',
  },

  /* Modal */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  modalCard: {
    position: 'relative',
    width: '100%',
    maxWidth: '640px',
    maxHeight: '85vh',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 2,
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'var(--color-surface-secondary)',
    color: 'var(--color-text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  },
  modalHeader: {
    padding: '28px 28px 16px',
    borderBottom: '1px solid var(--color-border)',
  },
  modalTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--color-text-heading)',
    margin: 0,
    paddingRight: '40px',
  },
  modalMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  modalBadge: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#FFFFFF',
    background: 'var(--color-primary)',
    padding: '2px 10px',
    borderRadius: 'var(--radius-pill)',
  },
  modalDate: {
    fontSize: '0.8rem',
    color: 'var(--color-text-muted)',
    fontWeight: 500,
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 28px',
  },
  consentSection: {
    marginBottom: '20px',
  },
  consentHeading: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--color-text-heading)',
    marginBottom: '8px',
  },
  consentContent: {
    fontSize: '0.88rem',
    lineHeight: 1.7,
    color: 'var(--color-text-body)',
  },
  modalFooter: {
    padding: '16px 28px 24px',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'center',
  },
  agreeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    height: '46px',
    padding: '0 32px',
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    background: 'var(--color-primary)',
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: '0.938rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-button)',
    transition: 'background 0.2s, transform 0.15s',
  },
}
