import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        // Redirect to login if on protected route
        if (router.pathname !== '/login' && !router.pathname.startsWith('/public')) {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    loading,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
}

// HOC để protect pages
interface WithAuthProps {
  user?: User;
}

export function withPageAuth<T extends WithAuthProps = WithAuthProps>(
  WrappedComponent: React.ComponentType<T>,
  options: { adminOnly?: boolean } = {}
) {
  const AuthenticatedComponent = (props: Omit<T, 'user'>) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
          return;
        }
        
        if (options.adminOnly && user.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="text-gray-600">Đang tải...</span>
          </div>
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect in useEffect
    }

    if (options.adminOnly && user.role !== 'admin') {
      return null; // Will redirect in useEffect
    }

    return <WrappedComponent {...(props as T)} user={user} />;
  };

  AuthenticatedComponent.displayName = `withPageAuth(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AuthenticatedComponent;
}
