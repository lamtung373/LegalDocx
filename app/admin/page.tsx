'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Users, 
  Building, 
  Settings, 
  Database,
  Plus,
  BarChart,
  ArrowLeft
} from 'lucide-react'

interface SystemStats {
  users: number
  categories: number
  templates: number
  parties: number
  assets: number
  contracts: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/db-test')
      const data = await response.json()
      if (data.status === 'success') {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSeedDatabase = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/seed', { method: 'POST' })
      const data = await response.json()
      setMessage(data.message)
      if (data.status === 'success') {
        fetchStats() // Refresh stats
      }
    } catch (error) {
      setMessage('Lỗi khi tạo dữ liệu mẫu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Trang chủ
              </Link>
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">
                Quản trị hệ thống
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tổng quan hệ thống</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats?.users || 0}</div>
                <div className="text-sm text-gray-600">Người dùng</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats?.categories || 0}</div>
                <div className="text-sm text-gray-600">Danh mục</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats?.templates || 0}</div>
                <div className="text-sm text-gray-600">Mẫu HĐ</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats?.parties || 0}</div>
                <div className="text-sm text-gray-600">Đương sự</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats?.assets || 0}</div>
                <div className="text-sm text-gray-600">Tài sản</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats?.contracts || 0}</div>
                <div className="text-sm text-gray-600">Hợp đồng</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={handleSeedDatabase}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
            >
              <Database className="h-5 w-5" />
              <span>Tạo dữ liệu mẫu</span>
            </button>
            
            <Link
              href="/admin/templates"
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Quản lý mẫu HĐ</span>
            </Link>
            
            <Link
              href="/admin/categories"
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors font-medium"
            >
              <Settings className="h-5 w-5" />
              <span>Quản lý danh mục</span>
            </Link>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/templates"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mẫu hợp đồng
            </h3>
            <p className="text-gray-600 text-sm">
              Tạo và chỉnh sửa các mẫu hợp đồng công chứng
            </p>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Danh mục
            </h3>
            <p className="text-gray-600 text-sm">
              Quản lý các danh mục hợp đồng
            </p>
          </Link>

          <Link
            href="/parties"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đương sự
            </h3>
            <p className="text-gray-600 text-sm">
              Xem và quản lý thông tin đương sự
            </p>
          </Link>

          <Link
            href="/assets"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tài sản
            </h3>
            <p className="text-gray-600 text-sm">
              Quản lý thông tin tài sản
            </p>
          </Link>
        </div>

        {/* Message Display */}
        {message && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* API Test Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/api/test"
              target="_blank"
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-center transition-colors"
            >
              Test API cơ bản
            </a>
            <a
              href="/api/db-test"
              target="_blank"
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-center transition-colors"
            >
              Test Database
            </a>
            <a
              href="/api/setup-db"
              target="_blank"
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-center transition-colors"
            >
              Setup Database
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
