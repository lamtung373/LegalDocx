import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: 'Trang chủ', href: '/dashboard', icon: '🏠' },
    { name: 'Hồ sơ', href: '/documents', icon: '📄' },
    { name: 'Đương sự', href: '/persons', icon: '👥' },
    { name: 'Tài sản', href: '/properties', icon: '🏘️' },
    { name: 'Hợp đồng', href: '/contracts', icon: '📋' },
  ]

  const adminNavigation = [
    { name: 'Quản lý mẫu', href: '/admin/templates', icon: '📝' },
    { name: 'Thống kê', href: '/admin/statistics', icon: '📊' },
    { name: 'Người dùng', href: '/admin/users', icon: '👤' },
  ]

  const isActive = (path) => {
    return router.pathname === path || router.pathname.startsWith(path + '/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0">
        <div className="flex items-center justify-center h-16 bg-primary-600">
          <span className="text-white text-xl font-bold">Công chứng</span>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          {user?.role === 'admin' && (
            <div className="mt-8 px-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Quản trị
              </div>
              <div className="space-y-2">
                {adminNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button
                  type="button"
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <span className="sr-only">Open sidebar</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="ml-4 text-xl font-semibold text-gray-900">
                  Hệ thống Công chứng
                </h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.full_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-500 p-2 rounded-md hover:bg-gray-100"
                  title="Đăng xuất"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
