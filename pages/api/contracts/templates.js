import jwt from 'jsonwebtoken'
import { query } from '../../../lib/db'

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
        return await getTemplates(req, res, decoded)
      case 'POST':
        return await createTemplate(req, res, decoded)
      default:
        return res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Templates API error:', error)
    return res.status(401).json({ message: 'Token không hợp lệ' })
  }
}

async function getTemplates(req, res, decoded) {
  try {
    const templates = await query(`
      SELECT 
        ct.*,
        u.full_name as created_by_name
      FROM contract_templates ct
      LEFT JOIN users u ON ct.created_by = u.id
      ORDER BY ct.created_at DESC
    `)

    res.status(200).json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

async function createTemplate(req, res, decoded) {
  try {
    const { name, category, content, variables } = req.body

    if (!name || !category || !content) {
      return res.status(400).json({ message: 'Tên, danh mục và nội dung không được để trống' })
    }

    const result = await query(`
      INSERT INTO contract_templates 
      (name, category, content, variables, created_by) 
      VALUES (?, ?, ?, ?, ?)
    `, [name, category, content, JSON.stringify(variables), decoded.userId])

    const newTemplate = await query(
      'SELECT * FROM contract_templates WHERE id = ?',
      [result.insertId]
    )

    res.status(201).json({
      message: 'Tạo mẫu hợp đồng thành công',
      template: newTemplate[0]
    })
  } catch (error) {
    console.error('Error creating template:', error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}
