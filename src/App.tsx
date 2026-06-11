import { useEffect, useState } from 'react'
import ChatHome from '@/components/ChatHome'
import ChatHomeMobile from '@/components/ChatHomeMobile'
import ProjectIntro from '@/components/ProjectIntro'
import UserLogin from '@/components/UserLogin'
import UserHistory from '@/components/UserHistory'
import AdminLogin from '@/admin/AdminLogin'
import AdminLayout from '@/admin/AdminLayout'
import DashboardOverview from '@/admin/DashboardOverview'
import UserManagement from '@/admin/UserManagement'
import ChatLogs from '@/admin/ChatLogs'
import SkillManager from '@/admin/SkillManager'
import SystemMonitor from '@/admin/SystemMonitor'
import { useIsMobile } from '@/hooks/useIsMobile'
import { getCurrentUser, logout, type AuthUser } from '@/lib/api'

type Page = 'chat' | 'intro' | 'user-login' | 'user-history' | 'admin-login' | 'admin-dashboard'
type AdminPage = 'overview' | 'users' | 'logs' | 'skills' | 'monitor'

export default function App() {
  const [page, setPage] = useState<Page>('chat')
  const [adminPage, setAdminPage] = useState<AdminPage>('overview')
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    let mounted = true
    getCurrentUser()
      .then((user) => {
        if (mounted) setCurrentUser(user)
      })
      .catch(() => {
        if (mounted) setCurrentUser(null)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const handleAdminLogin = (user: AuthUser) => {
    setCurrentUser(user)
    setPage('admin-dashboard')
    setAdminPage('overview')
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      setCurrentUser(null)
      setPage('chat')
    }
  }

  const handleUserLogin = (user: AuthUser) => {
    setCurrentUser(user)
    setPage('user-history')
  }

  const renderAdminContent = () => {
    switch (adminPage) {
      case 'overview': return <DashboardOverview />
      case 'users': return <UserManagement />
      case 'logs': return <ChatLogs />
      case 'skills': return <SkillManager />
      case 'monitor': return <SystemMonitor />
      default: return <DashboardOverview />
    }
  }

  const chatProps = {
    currentUser,
    onNavigateToIntro: () => setPage('intro'),
    onNavigateToAdmin: () => {
      if (currentUser?.is_admin) {
        setPage('admin-dashboard')
      } else {
        setPage('admin-login')
      }
    },
    onNavigateToUserLogin: () => {
      if (currentUser) {
        setPage('user-history')
      } else {
        setPage('user-login')
      }
    },
  }

  return (
    <div data-style="snow-warm" data-theme="light">
      {page === 'chat' && (
        isMobile ? <ChatHomeMobile {...chatProps} /> : <ChatHome {...chatProps} />
      )}

      {page === 'intro' && (
        <ProjectIntro onNavigateToChat={() => setPage('chat')} />
      )}

      {page === 'user-login' && (
        <UserLogin onLogin={handleUserLogin} onBack={() => setPage('chat')} />
      )}

      {page === 'user-history' && currentUser && (
        <UserHistory
          user={currentUser}
          onBack={() => setPage('chat')}
          onLogout={handleLogout}
        />
      )}

      {page === 'admin-login' && (
        <AdminLogin onLogin={handleAdminLogin} onBack={() => setPage('chat')} />
      )}

      {page === 'admin-dashboard' && currentUser?.is_admin && (
        <AdminLayout
          currentPage={adminPage}
          onNavigate={(p) => setAdminPage(p as AdminPage)}
          onLogout={handleLogout}
        >
          {renderAdminContent()}
        </AdminLayout>
      )}
    </div>
  )
}
