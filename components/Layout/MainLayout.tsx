import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FileText, 
  Users, 
  Building, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  UserCircle,
  Search,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  user?: {
    id: number;
    full_name: string;
    role: 'admin' | 'user';
    email: string;
  };
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  { title: 'Trang chủ', href: '/dashboard', icon: Home },
  { title: 'Chọn hợp đồng', href: '/contracts/select', icon: FileText },
  { title: 'Hồ sơ', href: '/files', icon: FolderOpen },
  { title: 'Đương sự', href: '/parties', icon: Users },
  { title: 'Tài sản', href: '/assets', icon: Building },
  { title: 'Thống kê', href: '/statistics', icon: BarChart3, adminOnly: true },
  { title: 'Quản lý mẫu', href: '/templates', icon: Settings, adminOnly: true },
];

export default function MainLayout({ children, user }: MainLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || user?.role === 'admin'
  );

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-white border-r border-gray-200 shadow-sm">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Công chứng
                </h1>
                <p className="text-xs text-gray-500">Bình Dương</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = router.pathname === item.href || 
                             router.pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon 
                    className={cn(
                      'mr-3 h-5 w-5 transition-colors',
                      isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'
                    )} 
                  />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="px-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-3 py-2">
              <UserCircle className="w-8 h-8 text-gray-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name || 'Người dùng'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-2 flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Công chứng</h1>
                <p className="text-xs text-gray-500">Bình Dương</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {filteredMenuItems.map((item) => {
              const isActive = router.pathname === item.href || 
                             router.pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon 
                    className={cn(
                      'mr-3 h-5 w-5 transition-colors',
                      isActive ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'
                    )} 
                  />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold text-gray-900">
                  {getPageTitle(router.pathname)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Search button */}
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Search className="h-5 w-5" />
              </button>

              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <UserCircle className="w-8 h-8 text-gray-500" />
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function getPageTitle(pathname: string): string {
  const titleMap: Record<string, string> = {
    '/dashboard': 'Trang chủ',
    '/contracts': 'Chọn hợp đồng',
    '/files': 'Hồ sơ',
    '/parties': 'Đương sự',
    '/assets': 'Tài sản',
    '/statistics': 'Thống kê',
    '/templates': 'Quản lý mẫu',
  };

  // Check for exact match first
  if (titleMap[pathname]) {
    return titleMap[pathname];
  }

  // Check for partial match
  for (const [path, title] of Object.entries(titleMap)) {
    if (pathname.startsWith(path + '/')) {
      return title;
    }
  }

  return 'Hệ thống công chứng';
}
