import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Count records in each table
    const userCount = await prisma.user.count()
    const categoryCount = await prisma.contractCategory.count()
    const templateCount = await prisma.contractTemplate.count()
    const partyCount = await prisma.party.count()
    const assetCount = await prisma.asset.count()
    const contractCount = await prisma.contract.count()

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        users: userCount,
        categories: categoryCount,
        templates: templateCount,
        parties: partyCount,
        assets: assetCount,
        contracts: contractCount
      }
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
