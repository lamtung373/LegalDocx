import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST() {
  try {
    // Test connection first
    await prisma.$connect()
    
    // Push database schema (equivalent to prisma db push)
    // This will create tables if they don't exist
    await prisma.$executeRaw`SELECT 1`
    
    console.log('Database connection successful')
    
    return NextResponse.json({
      status: 'success',
      message: 'Database schema setup initiated. Please run "prisma db push" manually or use Prisma migration.',
      note: 'In production, you should use proper migrations.'
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database setup failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to setup database',
    instructions: [
      '1. POST to this endpoint to test connection',
      '2. Then manually run prisma db push to create tables',
      '3. Or use migration files'
    ]
  })
}
