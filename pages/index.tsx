import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoadingSpinner } from '@/components/UI';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          // User is authenticated, redirect to dashboard
          router.replace('/dashboard');
        } else {
          // User is not authenticated, redirect to login
          router.replace('/login');
        }
      } catch (error) {
        // Error checking auth, redirect to login
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg mx-auto mb-4">
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Hệ thống Công chứng
        </h1>
        <p className="text-gray-600 mb-8">Bình Dương</p>
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500 mt-4">Đang tải...</p>
      </div>
    </div>
  );
}
