import { useState } from 'react'
import { Snowflake, Eye, EyeSlash, ArrowLeft } from '@phosphor-icons/react'
import { login, logout, type AuthUser } from '@/lib/api'

interface AdminLoginProps {
  onLogin: (user: AuthUser) => void
  onBack: () => void
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('请输入用户名')
      return
    }
    if (!password.trim()) {
      setError('请输入密码')
      return
    }

    setIsSubmitting(true)
    try {
      const user = await login(username.trim(), password)
      if (!user.is_admin) {
        await logout()
        setError('该账号没有管理员权限')
        return
      }
      onLogin(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后再试')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand header */}
        <div className="admin-login-brand">
          <Snowflake size={28} weight="fill" color="#5BA4D9" />
          <h1>小雪宝</h1>
        </div>
        <p className="admin-login-subtitle">管理后台</p>

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-username">用户名</label>
            <input
              id="admin-username"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={e => { setUsername(e.target.value); setError('') }}
              autoComplete="username"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">密码</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                autoComplete="current-password"
                style={{ paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? '隐藏密码' : '显示密码'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--admin-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
              >
                {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-form-error">{error}</div>
          )}

          <button type="submit" className="admin-login-btn" style={{ marginTop: '4px' }} disabled={isSubmitting}>
            {isSubmitting ? '登录中…' : '登录'}
          </button>
        </form>

        <p className="admin-login-hint">管理员账号由服务器环境文件初始化</p>

        {/* Back to user-facing app */}
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            margin: '20px auto 0',
            background: 'none',
            border: 'none',
            color: 'var(--admin-text-muted)',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: 'var(--admin-radius-sm)',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--admin-text)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--admin-text-muted)' }}
        >
          <ArrowLeft size={16} />
          返回用户端
        </button>
      </div>
    </div>
  )
}
