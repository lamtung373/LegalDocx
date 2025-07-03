import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { queryOne } from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username và password không được để trống' })
  }

  try {
    // Tìm user trong database
    const user = await queryOne(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )

    if (!user) {
      return res.status(401).json({ message: 'Tài khoản không tồn tại' })
    }

    // Kiểm tra password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác' })
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Trả về thông tin user (không bao gồm password)
    const { password_hash, ...userWithoutPassword } = user

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}
