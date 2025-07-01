import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/middleware';
import { executeQuery } from '@/lib/db';
import { handleApiError } from '@/lib/utils';

interface DashboardStats {
  totalFiles: number;
  completedFiles: number;
  pendingFiles: number;
  totalRevenue: number;
  totalParties: number;
  totalAssets: number;
  monthlyGrowth: number;
}

async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get file statistics
    const fileStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_files,
        COUNT(CASE WHEN status = 'Đã công chứng' THEN 1 END) as completed_files,
        COUNT(CASE WHEN status = 'Chờ công chứng' THEN 1 END) as pending_files,
        SUM(CASE WHEN status = 'Đã công chứng' THEN COALESCE(total_fee, 0) ELSE 0 END) as total_revenue
      FROM notary_files 
      WHERE created_by = ? OR ? = 'admin'
    `, [req.user.id, req.user.role]);

    // Get parties count
    const partiesCount = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM parties 
      WHERE created_by = ? OR ? = 'admin'
    `, [req.user.id, req.user.role]);

    // Get assets count
    const assetsCount = await executeQuery(`
      SELECT COUNT(*) as count 
      FROM assets 
      WHERE created_by = ? OR ? = 'admin'
    `, [req.user.id, req.user.role]);

    // Calculate monthly growth (compare current month with previous month)
    const monthlyGrowth = await executeQuery(`
      SELECT 
        COUNT(CASE WHEN MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE()) THEN 1 END) as current_month,
        COUNT(CASE WHEN MONTH(created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH) AND YEAR(created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) THEN 1 END) as previous_month
      FROM notary_files
      WHERE (created_by = ? OR ? = 'admin')
        AND created_at >= DATE_SUB(CURDATE(), INTERVAL 2 MONTH)
    `, [req.user.id, req.user.role]);

    const stats: DashboardStats = {
      totalFiles: fileStats[0]?.total_files || 0,
      completedFiles: fileStats[0]?.completed_files || 0,
      pendingFiles: fileStats[0]?.pending_files || 0,
      totalRevenue: fileStats[0]?.total_revenue || 0,
      totalParties: partiesCount[0]?.count || 0,
      totalAssets: assetsCount[0]?.count || 0,
      monthlyGrowth: calculateGrowthPercentage(
        monthlyGrowth[0]?.current_month || 0,
        monthlyGrowth[0]?.previous_month || 0
      ),
    };

    res.status(200).json(stats);

  } catch (error) {
    const { message, status } = handleApiError(error);
    res.status(status).json({ message });
  }
}

function calculateGrowthPercentage(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

export default withAuth(handler);
