'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FileText, 
  Users, 
  Building2, 
  FolderOpen, 
  BarChart3, 
  Settings,
  FileSignature,
  Search,
  Plus,
  LogOut,
  User
} from 'lucide-react'

interface SidebarProps {
  user?: {
    id: number
    username: string
    fullName: string
    role: string
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Chọn hợp đồng',
      href: '/dashboard/contracts',
      icon: FileSignature,
      description: 'Chọn loại hợp đồng để soạn thảo'
    },
    {
      name: 'Hồ sơ',
      href: '/dashboard/files',
      icon: FolderOpen,
      description: 'Quản lý hồ sơ công chứng'
    },
    {
      name: 'Tra cứu',
      href: '/dashboard/search',
      icon: Search,
      description: 'Tra cứu thông tin'
    }
  ]

  const adminNavigation = [
    {
      name: 'Thống kê',
      href: '/dashboard/statistics',
      icon: BarChart3,
      description: 'Báo cáo và thống kê'
    },
    {
      name: 'Quản lý mẫu HĐ',
      href: '/dashboard/templates',
      icon: FileText,
      description: 'Quản lý mẫu hợp đồng'
    },
    {
      name: 'Đương sự',
      href: '/dashboard/parties',
      icon: Users,
      description: 'Quản lý đương sự'
    },
    {
      name: 'Tài sản',
      href: '/dashboard/assets',
      icon: Building2,
      description: 'Quản lý tài sản'
    },
    {
      name: 'Cài đặt',
      href: '/dashboard/settings',
      icon: Settings,
      description: 'Cài đặt hệ thống'
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {/* Logo */}
        <div className="sidebar-header">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <FileSignature className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-white">
              <div className="text-lg font-bold">CSDL</div>
              <div className="text-xs text-primary-200">Công chứng tỉnh BD</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-primary-700 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <div className="text-white font-medium text-sm">{user?.fullName}</div>
              <div className="text-primary-200 text-xs capitalize">{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-list">
            {/* Main Navigation */}
            <div className="sidebar-nav-item">
              <h3 className="text-xs font-semibold text-primary-200 uppercase tracking-wider mb-3">
                Nghiệp vụ
              </h3>
              <ul className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`sidebar-nav-link ${isActive ? 'sidebar-nav-link-active' : ''}`}
                      >
                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Admin Navigation */}
            {user?.role === 'admin' && (
              <div className="sidebar-nav-item">
                <h3 className="text-xs font-semibold text-primary-200 uppercase tracking-wider mb-3">
                  Quản trị
                </h3>
                <ul className="space-y-1">
                  {adminNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`sidebar-nav-link ${isActive ? 'sidebar-nav-link-active' : ''}`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                          <span className="truncate">{item.name}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Quick Actions */}
            <div className="sidebar-nav-item">
              <h3 className="text-xs font-semibold text-primary-200 uppercase tracking-wider mb-3">
                Thao tác nhanh
              </h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    href="/dashboard/files/create"
                    className="sidebar-nav-link"
                  >
                    <Plus className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">Tạo hồ sơ mới</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/parties/create"
                    className="sidebar-nav-link"
                  >
                    <Users className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">Thêm đương sự</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/assets/create"
                    className="sidebar-nav-link"
                  >
                    <Building2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="truncate">Thêm tài sản</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="sidebar-nav-link w-full text-left"
            >
              <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="truncate">Đăng xuất</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
