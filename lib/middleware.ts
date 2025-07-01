import { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '@/lib/db';
import { verifyToken } from '@/lib/utils';
import type { DbUser } from '@/lib/db';

export interface AuthenticatedRequest extends NextApiRequest {
  user: Omit<DbUser, 'password_hash'>;
}

export function withAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void> | void
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.cookies['auth-token'];
      
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token' });
      }

      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }

      // Get user from database
      const users = await executeQuery<DbUser>(
        'SELECT * FROM users WHERE id = ? AND is_active = 1',
        [decoded.userId]
      );

      if (users.length === 0) {
        return res.status(401).json({ message: 'Unauthorized - User not found' });
      }

      const user = users[0];
      
      // Check if session exists and is not expired
      const sessions = await executeQuery(
        'SELECT * FROM user_sessions WHERE user_id = ? AND expires_at > NOW()',
        [user.id]
      );

      if (sessions.length === 0) {
        return res.status(401).json({ message: 'Unauthorized - Session expired' });
      }

      // Add user to request object (without password)
      const { password_hash, ...userData } = user;
      (req as AuthenticatedRequest).user = userData;

      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

export function withAdminAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void> | void
) {
  return withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
    
    return handler(req, res);
  });
}

// Hook để sử dụng trong React components
import { useState, useEffect } from 'react';
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
import React from 'react';

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
