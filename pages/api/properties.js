import jwt from 'jsonwebtoken'
import { query } from '../../lib/db'

export default async function handler(req, res) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    switch (req.method) {
      case 'GET':
        return await getProperties(req, res, decoded)
      case 'POST':
        return await createProperty(req, res, decoded)
      default:
        return res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Properties API error:', error)
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

async function getProperties(req, res, decoded) {
  try {
    const properties = await query(`
      SELECT 
        p.*,
        per.full_name as owner_name,
        u.full_name as created_by_name
      FROM properties p
      LEFT JOIN persons per ON p.owner_id = per.id
      LEFT JOIN users u ON p.created_by = u.id
      ORDER BY p.created_at DESC
    `)

    res.status(200).json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

async function createProperty(req, res, decoded) {
  try {
    const { 
      type, 
      name, 
      description, 
      address, 
      area, 
      value, 
      ownership_certificate, 
      certificate_date, 
      owner_id 
    } = req.body

    if (!type || !name) {
      return res.status(400).json({ message: 'Loại tài sản và tên tài sản không được để trống' })
    }

    const result = await query(`
      INSERT INTO properties 
      (type, name, description, address, area, value, ownership_certificate, certificate_date, owner_id, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [type, name, description, address, area, value, ownership_certificate, certificate_date, owner_id, decoded.userId])

    const newProperty = await query(
      'SELECT * FROM properties WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json({
      message: 'Tạo tài sản thành công',
      property: newProperty[0]
    })
  } catch (error) {
    console.error('Error creating property:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}
