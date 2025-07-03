import jwt from 'jsonwebtoken'
import { query } from '../../lib/db'

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
    
    // Lấy thống kê từ database
    const [documentsResult] = await query(
      'SELECT COUNT(*) as total FROM documents'
    )
    
    const [pendingResult] = await query(
      'SELECT COUNT(*) as total FROM documents WHERE status = "pending"'
    )
    
    const [personsResult] = await query(
      'SELECT COUNT(*) as total FROM persons'
    )
    
    const [propertiesResult] = await query(
      'SELECT COUNT(*) as total FROM properties'
    )

    const stats = {
      totalDocuments: documentsResult.total || 0,
      pendingDocuments: pendingResult.total || 0,
      totalPersons: personsResult.total || 0,
      totalProperties: propertiesResult.total || 0
    }

    res.status(200).json(stats)
  } catch (error) {
    console.error('Statistics error:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}
