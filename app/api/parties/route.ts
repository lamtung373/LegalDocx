import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const where: any = {}

    // Search filter
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { citizenId: { contains: search } },
        { taxCode: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } }
      ]
    }

    // Type filter
    if (type && (type === 'individual' || type === 'organization')) {
      where.type = type
    }

    const [parties, total] = await Promise.all([
      prisma.party.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
        include: {
          ownedAssets: {
            select: {
              id: true,
              name: true,
              type: true
            }
          },
          _count: {
            select: {
              contractParties: true
            }
          }
        }
      }),
      prisma.party.count({ where })
    ])

    return NextResponse.json({
      status: 'success',
      parties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching parties:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch parties',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      fullName,
      citizenId,
      taxCode,
      phone,
      email,
      address,
      birthDate,
      birthPlace,
      gender,
      nationality = 'Việt Nam',
      occupation,
      representativeName,
      representativePosition,
      bankAccount,
      bankName,
      notes
    } = body

    // Validate required fields
    if (!type || !fullName) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Type and full name are required'
        },
        { status: 400 }
      )
    }

    // Check for duplicate citizenId or taxCode
    if (citizenId) {
      const existing = await prisma.party.findFirst({
        where: { citizenId }
      })
      if (existing) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'CMND/CCCD đã tồn tại trong hệ thống'
          },
          { status: 400 }
        )
      }
    }

    if (taxCode) {
      const existing = await prisma.party.findFirst({
        where: { taxCode }
      })
      if (existing) {
        return NextResponse.json(
          {
            status: 'error',
            message: 'Mã số thuế đã tồn tại trong hệ thống'
          },
          { status: 400 }
        )
      }
    }

    const party = await prisma.party.create({
      data: {
        type,
        fullName,
        citizenId,
        taxCode,
        phone,
        email,
        address,
        birthDate: birthDate ? new Date(birthDate) : null,
        birthPlace,
        gender,
        nationality,
        occupation,
        representativeName,
        representativePosition,
        bankAccount,
        bankName,
        notes
      },
      include: {
        ownedAssets: true,
        _count: {
          select: {
            contractParties: true
          }
        }
      }
    })

    return NextResponse.json({
      status: 'success',
      message: 'Party created successfully',
      party
    })
  } catch (error) {
    console.error('Error creating party:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create party',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
