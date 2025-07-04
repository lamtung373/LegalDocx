import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { FileText, Users, Building, FolderOpen, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

// Mock data - sau này sẽ lấy từ database
const stats = [
  { name: 'Tổng hồ sơ', value: '1,234', icon: FolderOpen, color: 'bg-blue-500' },
  { name: 'Đương sự', value: '456', icon: Users, color: 'bg-green-500' },
  { name: 'Tài sản', value: '789', icon: Building, color: 'bg-purple-500' },
  { name: 'Hợp đồng tháng này', value: '123', icon: FileText, color: 'bg-yellow-500' },
]

const recentRecords = [
  { id: 1, number: 'HS-2025-001', type: 'Mua bán nhà đất', client: 'Nguyễn Văn A', date: '2025-01-04', status: 'Hoàn thành' },
  { id: 2, number: 'HS-2025-002', type: 'Ủy quyền', client: 'Trần Thị B', date: '2025-01-04', status: 'Đang xử lý' },
  { id: 3, number: 'HS-2025-003', type: 'Di chúc', client: 'Lê Văn C', date: '2025-01-03', status: 'Chờ ký' },
]

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Xin chào, {session?.user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Đây là tổng quan về hoạt động của văn phòng công chứng
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Thao tác nhanh</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/contracts/new"
              className="flex items-center justify-center px-4 py-3 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
            >
              <FileText className="h-5 w-5 mr-2" />
              Soạn hợp đồng mới
            </Link>
            <Link
              href="/parties/new"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Thêm đương sự
            </Link>
            <Link
              href="/assets/new"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Building className="h-5 w-5 mr-2" />
              Thêm tài sản
            </Link>
          </div>
        </div>
      </div>

      {/* Recent records */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Hồ sơ gần đây</h2>
          <Link href="/records" className="text-sm text-primary-600 hover:text-primary-700">
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số hồ sơ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại hợp đồng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đương sự
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    <Link href={`/records/${record.id}`}>
                      {record.number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'Hoàn thành' 
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'Đang xử lý'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}