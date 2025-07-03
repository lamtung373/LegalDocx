import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalDocuments: 0,
    pendingDocuments: 0,
    totalPersons: 0,
    totalProperties: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const quickActions = [
    {
      name: 'Tạo hồ sơ mới',
      href: '/documents/create',
      icon: '📄',
      color: 'bg-blue-500',
      description: 'Tạo hồ sơ công chứng mới'
    },
    {
      name: 'Thêm đương sự',
      href: '/persons/create',
      icon: '👥',
      color: 'bg-green-500',
      description: 'Thêm thông tin đương sự'
    },
    {
      name: 'Thêm tài sản',
      href: '/properties/create',
      icon: '🏘️',
      color: 'bg-purple-500',
      description: 'Thêm thông tin tài sản'
    },
    {
      name: 'Soạn hợp đồng',
      href: '/contracts/create',
      icon: '📋',
      color: 'bg-orange-500',
      description: 'Soạn hợp đồng từ mẫu'
    }
  ]

  const statCards = [
    {
      name: 'Tổng hồ sơ',
      value: stats.totalDocuments,
      icon: '📄',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'Hồ sơ chờ xử lý',
      value: stats.pendingDocuments,
      icon: '⏳',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      name: 'Đương sự',
      value: stats.totalPersons,
      icon: '👥',
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'Tài sản',
      value: stats.totalProperties,
      icon: '🏘️',
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  return (
    <Layout>
      <Head>
        <title>Trang chủ - Hệ thống Công chứng</title>
      </Head>
      
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Chào mừng, {user?.full_name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Vai trò</div>
              <div className="text-lg font-semibold text-primary-600">
                {user?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Thao tác nhanh</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <span className="text-white text-xl">{action.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.name}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hoạt động gần đây</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📄</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Hồ sơ #2025001 đã được tạo
                </p>
                <p className="text-sm text-gray-600">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">👥</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Đương sự Nguyễn Văn A đã được thêm
                </p>
                <p className="text-sm text-gray-600">5 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">🏘️</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Tài sản BDS-001 đã được cập nhật
                </p>
                <p className="text-sm text-gray-600">1 ngày trước</p>
              </div>
            </div>
            <div className="text-center py-4">
              <Link href="/documents" className="text-primary-600 hover:text-primary-800 font-medium">
                Xem tất cả hoạt động →
              </Link>
            </div>
          </div>
        </div>

        {/* System info for admin */}
        {user?.role === 'admin' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin hệ thống</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">1.2GB</div>
                <div className="text-sm text-gray-600">Dung lượng DB</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">2 người</div>
                <div className="text-sm text-gray-600">Đang online</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
