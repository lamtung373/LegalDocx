import { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '@/lib/db';
import { verifyToken, handleApiError } from '@/lib/utils';
import type { DbUser } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies['auth-token'];
    
    if (!token) {
      return res.status(401).json({ message: 'Không có token xác thực' });
    }

    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Token không hợp lệ' });
    }

    // Get user from database
    const users = await executeQuery<DbUser>(
      'SELECT * FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }

    const user = users[0];
    
    // Check if session exists and is not expired
    const sessions = await executeQuery(
      'SELECT * FROM user_sessions WHERE user_id = ? AND expires_at > NOW()',
      [user.id]
    );

    if (sessions.length === 0) {
      return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn' });
    }

    // Return user data (without password)
    const { password_hash, ...userData } = user;
    
    res.status(200).json({
      user: userData,
    });

  } catch (error) {
    const { message, status } = handleApiError(error);
    res.status(status).json({ message });
  }
}
