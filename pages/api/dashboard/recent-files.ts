import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/middleware';
import { executeQuery } from '@/lib/db';
import { handleApiError } from '@/lib/utils';

interface RecentFile {
  id: number;
  file_number: string;
  file_title: string;
  status: 'Đã công chứng' | 'Chờ công chứng' | 'Hủy bỏ';
  created_at: string;
  total_fee: number;
  template_name: string;
}

async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const recentFiles = await executeQuery<RecentFile>(`
      SELECT 
        nf.id,
        nf.file_number,
        nf.file_title,
        nf.status,
        nf.created_at,
        nf.total_fee,
        ct.template_name
      FROM notary_files nf
      LEFT JOIN contract_templates ct ON nf.template_id = ct.id
      WHERE nf.created_by = ? OR ? = 'admin'
      ORDER BY nf.created_at DESC
      LIMIT ?
    `, [req.user.id, req.user.role, limit]);

    res.status(200).json({
      files: recentFiles,
      total: recentFiles.length,
    });

  } catch (error) {
    const { message, status } = handleApiError(error);
    res.status(status).json({ message });
  }
}

export default withAuth(handler);
