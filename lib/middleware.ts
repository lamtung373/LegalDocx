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
