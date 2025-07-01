import { NextApiRequest, NextApiResponse } from 'next';
import { executeQuery } from '@/lib/db';
import { verifyPassword, createToken, handleApiError } from '@/lib/utils';
import type { DbUser } from '@/lib/db';

interface LoginRequest {
  email: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email và mật khẩu là bắt buộc' 
      });
    }

    // Find user by email
    const users = await executeQuery<DbUser>(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        message: 'Email hoặc mật khẩu không chính xác' 
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Email hoặc mật khẩu không chính xác' 
      });
    }

    // Create JWT token
    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    }, '24h');

    // Create session in database
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await executeQuery(
      'INSERT INTO user_sessions (id, user_id, expires_at) VALUES (?, ?, ?)',
      [sessionId, user.id, expiresAt]
    );

    // Set HTTP-only cookie using res.setHeader
    res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`);

    // Return user data (without password)
    const { password_hash, ...userData } = user;
    
    res.status(200).json({
      message: 'Đăng nhập thành công',
      user: userData,
    });

  } catch (error) {
    const { message, status } = handleApiError(error);
    res.status(status).json({ message });
  }
}
