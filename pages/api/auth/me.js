import jwt from 'jsonwebtoken'
import { queryOne } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Lấy thông tin user từ database
    const user = await queryOne(
      'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = ?',
      [decoded.userId]
    )

    if (!user) {
      return res.status(401).json({ message: 'User không tồn tại' })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(401).json({ message: 'Token không hợp lệ' })
  }
}
