'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  FileText, 
  Users, 
  Building, 
  FolderOpen, 
  Home,
  Settings,
  BarChart,
  FileSignature,
  UserCog,
  FolderPlus
} from 'lucide-react'
import { useSession } from 'next-auth/react'

const navigation = [
  { name: 'Trang chủ', href: '/', icon: Home },
  { name: 'Hồ sơ', href: '/records', icon: FolderOpen },
  { name: 'Soạn hợp đồng', href: '/contracts/new', icon: FileSignature },
  { name: 'Đương sự', href: '/parties', icon: Users },
  { name: 'Tài sản', href: '/assets', icon: Building },
]

const adminNavigation = [
  { name: 'Mẫu hợp đồng', href: '/admin/templates', icon: FileText },
  { name: 'Người dùng', href: '/admin/users', icon: UserCog },
  { name: 'Thống kê', href: '/admin/statistics', icon: BarChart },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="bg-primary-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      {/* Logo */}
      <div className="flex items-center space-x-2 px-4">
        <Building className="h-8 w-8" />
        <span className="text-xl font-bold">Công chứng</span>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        <div className="px-4 py-2">
          <h3 className="text-xs font-semibold text-primary-200 uppercase tracking-wider">
            Nghiệp vụ
          </h3>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-900 text-white'
                  : 'text-primary-100 hover:bg-primary-700 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}

        {/* Admin section */}
        {isAdmin && (
          <>
            <div className="px-4 py-2 mt-6">
              <h3 className="text-xs font-semibold text-primary-200 uppercase tracking-wider">
                Quản trị
              </h3>
            </div>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-900 text-white'
                      : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User info */}
      <div className="absolute bottom-0 w-full border-t border-primary-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-600 rounded-full p-2">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{session?.user?.name}</p>
            <p className="text-xs text-primary-200">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}