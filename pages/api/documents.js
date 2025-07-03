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
        return await getDocuments(req, res, decoded)
      case 'POST':
        return await createDocument(req, res, decoded)
      default:
        return res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Documents API error:', error)
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

async function getDocuments(req, res, decoded) {
  try {
    const documents = await query(`
      SELECT 
        d.*,
        ct.name as template_name,
        u.full_name as created_by_name
      FROM documents d
      LEFT JOIN contract_templates ct ON d.template_id = ct.id
      LEFT JOIN users u ON d.created_by = u.id
      ORDER BY d.created_at DESC
    `)

    res.status(200).json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

async function createDocument(req, res, decoded) {
  try {
    const { title, template_id, content, notary_date, notary_fee } = req.body

    if (!title) {
      return res.status(400).json({ message: 'Tiêu đề không được để trống' })
    }

    // Tạo số hồ sơ tự động
    const currentYear = new Date().getFullYear()
    const lastDoc = await query(
      'SELECT document_number FROM documents WHERE document_number LIKE ? ORDER BY document_number DESC LIMIT 1',
      [`${currentYear}%`]
    )

    let newDocNumber
    if (lastDoc.length > 0) {
      const lastNumber = parseInt(lastDoc[0].document_number.slice(-4))
      newDocNumber = `${currentYear}${(lastNumber + 1).toString().padStart(4, '0')}`
    } else {
      newDocNumber = `${currentYear}0001`
    }

    const result = await query(`
      INSERT INTO documents 
      (document_number, title, template_id, content, notary_date, notary_fee, created_by, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')
    `, [newDocNumber, title, template_id, content, notary_date, notary_fee, decoded.userId])

    const newDocument = await query(
      'SELECT * FROM documents WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json({
      message: 'Tạo hồ sơ thành công',
      document: newDocument[0]
    })
  } catch (error) {
    console.error('Error creating document:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}
