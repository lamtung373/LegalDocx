'use client'

import { useState } from 'react'
import { Bell, Search, Menu, X } from 'lucide-react'

interface HeaderProps {
  title?: string
  showMobileMenu?: boolean
  onToggleMobileMenu?: () => void
}

export default function Header({ 
  title = "Dashboard",
  showMobileMenu = false,
  onToggleMobileMenu 
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    {
      id: 1,
      title: 'Hồ sơ mới cần xử lý',
      message: 'Có 3 hồ sơ mới chờ công chứng',
      time: '5 phút trước',
      unread: true
    },
    {
      id: 2,
      title: 'Thanh toán hoàn tất',
      message: 'Hồ sơ #2526 đã thanh toán phí',
      time: '1 giờ trước',
      unread: true
    },
    {
      id: 3,
      title: 'Nhắc nhở hẹn làm việc',
      message: 'Cuộc hẹn với khách hàng lúc 14:00',
      time: '2 giờ trước',
      unread: false
    }
  ]

  return (
    <header className="header">
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden -m-2.5 p-2.5 text-gray-700"
        onClick={onToggleMobileMenu}
      >
        <span className="sr-only">Mở menu</span>
        {showMobileMenu ? (
          <X className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      {/* Page title */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Search */}
        <div className="flex flex-1 justify-end">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* Search button */}
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Tìm kiếm</span>
              <Search className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="sr-only">Thông báo</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Thông báo</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                          notification.unread 
                            ? 'border-primary-500 bg-primary-50' 
                            : 'border-transparent'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                          {notification.unread && (
                            <div className="h-2 w-2 bg-primary-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200">
                    <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                      Xem tất cả thông báo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="-m-1.5 flex items-center p-1.5"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Mở menu người dùng</span>
                <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">NT</span>
                </div>
                <span className="hidden lg:flex lg:items-center">
                  <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                    Nguyễn Thị Như Trang
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
