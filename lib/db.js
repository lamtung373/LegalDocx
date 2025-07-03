import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  }
})

export default pool

export async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export async function queryOne(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows[0] || null
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}
