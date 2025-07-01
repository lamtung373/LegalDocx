import React from 'react';
import Link from 'next/link';
import { FileText, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/UI';

export default function Custom500() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* 500 Text */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-600 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Lỗi máy chủ
          </h2>
          <p className="text-gray-600 mb-8">
            Xin lỗi, đã xảy ra lỗi từ phía máy chủ. Vui lòng thử lại sau.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Button 
            className="w-full sm:w-auto" 
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </Button>
          
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2025 Hệ thống Công chứng Bình Dương
          </p>
        </div>
      </div>
    </div>
  );
}
