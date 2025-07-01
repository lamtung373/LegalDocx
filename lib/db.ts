import mysql from 'mysql2/promise';

// Cấu hình kết nối database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'notary_system',
  charset: 'utf8mb4',
  timezone: '+07:00',
  acquireTimeout: 60000,
  timeout: 60000,
};

// Tạo connection pool để tối ưu hiệu suất
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  reconnect: true,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Hàm thực hiện query với error handling
export async function executeQuery<T = any>(
  query: string, 
  params: any[] = []
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database query failed: ${error}`);
  }
}

// Hàm thực hiện transaction
export async function executeTransaction<T = any>(
  queries: Array<{ query: string; params?: any[] }>
): Promise<T[]> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results: T[] = [];
    
    for (const { query, params = [] } of queries) {
      const [rows] = await connection.execute(query, params);
      results.push(rows as T);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    console.error('Transaction error:', error);
    throw new Error(`Transaction failed: ${error}`);
  } finally {
    connection.release();
  }
}

// Hàm insert và trả về ID của record vừa tạo
export async function insertAndGetId(
  query: string, 
  params: any[] = []
): Promise<number> {
  try {
    const [result] = await pool.execute(query, params) as any;
    return result.insertId;
  } catch (error) {
    console.error('Insert query error:', error);
    throw new Error(`Insert query failed: ${error}`);
  }
}

// Hàm kiểm tra kết nối database
export async function testConnection(): Promise<boolean> {
  try {
    await pool.execute('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

// Hàm đóng connection pool (dùng khi shutdown app)
export async function closePool(): Promise<void> {
  try {
    await pool.end();
  } catch (error) {
    console.error('Error closing database pool:', error);
  }
}

// Export pool để sử dụng trực tiếp nếu cần
export { pool };

// Types cho database
export interface DbUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DbContractTemplate {
  id: number;
  template_code: string;
  template_name: string;
  category: string;
  content: string;
  description?: string;
  is_active: boolean;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbParty {
  id: number;
  full_name: string;
  citizen_id?: string;
  birth_date?: Date;
  gender: 'Nam' | 'Nữ' | 'Khác';
  nationality: string;
  phone?: string;
  email?: string;
  permanent_address?: string;
  current_address?: string;
  id_issue_date?: Date;
  id_issue_place?: string;
  occupation?: string;
  marital_status?: string;
  notes?: string;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbAssetType {
  id: number;
  type_name: string;
  type_code: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
}

export interface DbAsset {
  id: number;
  asset_type_id: number;
  asset_name: string;
  asset_code?: string;
  owner_id?: number;
  location_province?: string;
  location_district?: string;
  location_ward?: string;
  detailed_address?: string;
  area?: number;
  land_use_purpose?: string;
  land_use_duration?: string;
  land_use_origin?: string;
  certificate_number?: string;
  certificate_issue_date?: Date;
  certificate_issue_place?: string;
  market_value?: number;
  description?: string;
  notes?: string;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface DbNotaryFile {
  id: number;
  file_number: string;
  file_code?: string;
  template_id: number;
  file_title: string;
  contract_date: Date;
  contract_value?: number;
  status: 'Đã công chứng' | 'Chờ công chứng' | 'Hủy bỏ';
  notary_fee?: number;
  other_fees?: number;
  total_fee?: number;
  payment_status: 'Đã thanh toán' | 'Chưa thanh toán' | 'Thanh toán một phần';
  content?: string;
  notes?: string;
  notarized_by?: number;
  notarized_at?: Date;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}
