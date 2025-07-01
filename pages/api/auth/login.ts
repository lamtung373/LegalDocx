import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
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

    // Set HTTP-only cookie
    const cookie = serialize('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

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

// API endpoint for logout
export async function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Clear cookie
    const cookie = serialize('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });

    res.setHeader('Set-Cookie', cookie);

    // TODO: Remove session from database if we stored it
    
    res.status(200).json({ message: 'Đăng xuất thành công' });

  } catch (error) {
    const { message, status } = handleApiError(error);
    res.status(status).json({ message });
  }
}
