import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { executeQuery } from '@/lib/db';
import { verifyToken, handleApiError } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies['auth-token'];
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded?.userId) {
        // Remove all sessions for this user
        await executeQuery(
          'DELETE FROM user_sessions WHERE user_id = ?',
          [decoded.userId]
        );
      }
    }

    // Clear cookie
    const cookie = serialize('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);
    
    res.status(200).json({ message: 'Đăng xuất thành công' });

  } catch (error) {
    const { message, status } = handleApiError(error);
    res.status(status).json({ message });
  }
}
