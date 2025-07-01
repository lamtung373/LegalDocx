import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Users, 
  Building, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Plus,
  Eye
} from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, Button, Badge, LoadingSpinner } from '@/components/UI';
import { withPageAuth } from '@/lib/middleware';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardStats {
  totalFiles: number;
  completedFiles: number;
  pendingFiles: number;
  totalRevenue: number;
  totalParties: number;
  totalAssets: number;
  monthlyGrowth: number;
}

interface RecentFile {
  id: number;
  file_number: string;
  file_title: string;
  status: 'Đã công chứng' | 'Chờ công chứng' | 'Hủy bỏ';
  created_at: string;
  total_fee: number;
  template_name: string;
}

interface DashboardProps {
  user: {
    id: number;
    full_name: string;
    role: 'admin' | 'user';
    email: string;
  };
}

function Dashboard({ user }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, filesResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/recent-files')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (filesResponse.ok) {
        const filesData = await filesResponse.json();
        setRecentFiles(filesData.files || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã công chứng':
        return 'success';
      case 'Chờ công chứng':
        return 'warning';
      case 'Hủy bỏ':
        return 'error';
      default:
        return 'default';
    }
  };

  const quickActions = [
    {
      title: 'Tạo hồ sơ mới',
      description: 'Soạn hợp đồng công chứng',
      href: '/contracts/select',
      icon: Plus,
      color: 'bg-primary-500',
    },
    {
      title: 'Tra cứu hồ sơ',
      description: 'Xem danh sách hồ sơ',
      href: '/files',
      icon: Eye,
      color: 'bg-green-500',
    },
    {
      title: 'Quản lý đương sự',
      description: 'Thêm/sửa thông tin đương sự',
      href: '/parties',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Quản lý tài sản',
      description: 'Thêm/sửa thông tin tài sản',
      href: '/assets',
      icon: Building,
      color: 'bg-purple-500',
    },
  ];

  if (loading) {
    return (
      <MainLayout user={user}>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Chào mừng, {user.full_name}!
              </h1>
              <p className="text-primary-100 mt-1">
                Hôm nay là {formatDate(new Date(), 'long')}
              </p>
            </div>
            <div className="hidden sm:block">
              <Calendar className="w-16 h-16 text-primary-200" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Tổng hồ sơ</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalFiles}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Đã hoàn thành</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.completedFiles}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Đang chờ</p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingFiles}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card title="Thao tác nhanh" subtitle="Các chức năng thường dùng">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="group relative bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent Files */}
        <Card 
          title="Hồ sơ gần đây" 
          subtitle="10 hồ sơ được tạo gần nhất"
          action={
            <Link href="/files">
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          }
        >
          {recentFiles.length > 0 ? (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số hồ sơ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tiêu đề
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phí
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                        <Link href={`/files/${file.id}`}>
                          {file.file_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">{file.file_title}</div>
                        <div className="text-xs text-gray-500">{file.template_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusColor(file.status) as any}>
                          {file.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(file.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(file.total_fee || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có hồ sơ nào được tạo</p>
              <Link href="/contracts/select">
                <Button className="mt-4">Tạo hồ sơ đầu tiên</Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Admin Only Section */}
        {user.role === 'admin' && stats && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card title="Thống kê tổng quan">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đương sự trong hệ thống</span>
                  <span className="font-semibold">{stats.totalParties}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tài sản trong hệ thống</span>
                  <span className="font-semibold">{stats.totalAssets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tỷ lệ hoàn thành</span>
                  <span className="font-semibold">
                    {stats.totalFiles > 0 
                      ? Math.round((stats.completedFiles / stats.totalFiles) * 100)
                      : 0
                    }%
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Hành động quản trị">
              <div className="space-y-3">
                <Link href="/templates">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Quản lý mẫu hợp đồng
                  </Button>
                </Link>
                <Link href="/statistics">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Xem báo cáo thống kê
                  </Button>
                </Link>
                <Link href="/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Quản lý người dùng
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default withPageAuth(Dashboard);
