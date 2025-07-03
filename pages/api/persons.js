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
        return await getPersons(req, res, decoded)
      case 'POST':
        return await createPerson(req, res, decoded)
      default:
        return res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Persons API error:', error)
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

async function getPersons(req, res, decoded) {
  try {
    const persons = await query(`
      SELECT 
        p.*,
        u.full_name as created_by_name
      FROM persons p
      LEFT JOIN users u ON p.created_by = u.id
      ORDER BY p.created_at DESC
    `)

    res.status(200).json(persons)
  } catch (error) {
    console.error('Error fetching persons:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

async function createPerson(req, res, decoded) {
  try {
    const { 
      full_name, 
      id_number, 
      id_issued_date, 
      id_issued_place, 
      birth_date, 
      gender, 
      phone, 
      email, 
      address, 
      nationality 
    } = req.body

    if (!full_name || !id_number) {
      return res.status(400).json({ message: 'Tên và số CMND/CCCD không được để trống' })
    }

    // Kiểm tra trùng CMND/CCCD
    const existingPerson = await query(
      'SELECT id FROM persons WHERE id_number = ?',
      [id_number]
    )

    if (existingPerson.length > 0) {
      return res.status(400).json({ message: 'Số CMND/CCCD đã tồn tại' })
    }

    const result = await query(`
      INSERT INTO persons 
      (full_name, id_number, id_issued_date, id_issued_place, birth_date, gender, phone, email, address, nationality, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [full_name, id_number, id_issued_date, id_issued_place, birth_date, gender, phone, email, address, nationality || 'Việt Nam', decoded.userId])

    const newPerson = await query(
      'SELECT * FROM persons WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json({
      message: 'Tạo đương sự thành công',
      person: newPerson[0]
    })
  } catch (error) {
    console.error('Error creating person:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}
