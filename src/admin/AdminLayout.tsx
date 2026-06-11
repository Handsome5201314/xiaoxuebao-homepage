import {
  Snowflake,
  ChartPieSlice,
  UsersThree,
  ChatText,
  PuzzlePiece,
  HardDrives,
  SignOut,
} from '@phosphor-icons/react'

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: string) => void
  onLogout: () => void
}

const NAV_ITEMS = [
  { page: 'overview', label: '数据总览', Icon: ChartPieSlice },
  { page: 'users',    label: '用户管理', Icon: UsersThree },
  { page: 'logs',     label: '问答日志', Icon: ChatText },
  { page: 'skills',   label: '技能管理', Icon: PuzzlePiece },
  { page: 'monitor',  label: '系统监控', Icon: HardDrives },
] as const

export default function AdminLayout({ children, currentPage, onNavigate, onLogout }: AdminLayoutProps) {
  const activeItem = NAV_ITEMS.find(item => item.page === currentPage)
  const currentTitle = activeItem ? activeItem.label : '管理后台'

  return (
    <div className="admin-layout">

      {/* ── Sidebar (desktop) ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Snowflake size={24} weight="fill" color="#5BA4D9" />
          <h2>小雪宝</h2>
          <span>管理后台</span>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ page, label, Icon }) => (
            <button
              key={page}
              className={`admin-nav-item${currentPage === page ? ' active' : ''}`}
              onClick={() => onNavigate(page)}
            >
              <Icon size={20} weight={currentPage === page ? 'fill' : 'regular'} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main column ── */}
      <div className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">
          <h1 className="admin-topbar-title">{currentTitle}</h1>
          <div className="admin-topbar-user">
            <span>管理员</span>
            <button className="admin-logout-btn" onClick={onLogout}>
              <SignOut size={16} />
              退出
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="admin-mobile-nav">
        <div className="admin-mobile-nav-inner">
          {NAV_ITEMS.map(({ page, label, Icon }) => (
            <button
              key={page}
              className={`admin-mobile-nav-item${currentPage === page ? ' active' : ''}`}
              onClick={() => onNavigate(page)}
            >
              <Icon size={20} weight={currentPage === page ? 'fill' : 'regular'} />
              {label}
            </button>
          ))}
        </div>
      </nav>

    </div>
  )
}
