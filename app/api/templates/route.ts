import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    
    const templates = await prisma.contractTemplate.findMany({
      where: categoryId ? {
        categoryId: parseInt(categoryId)
      } : {},
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json({
      status: 'success',
      templates
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch templates',
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
      name,
      description,
      categoryId,
      templateContent,
      requiredFields,
      variableFields,
      isActive = true
    } = body

    // Validate required fields
    if (!name || !templateContent) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Name and template content are required'
        },
        { status: 400 }
      )
    }

    const template = await prisma.contractTemplate.create({
      data: {
        name,
        description,
        categoryId: categoryId ? parseInt(categoryId) : null,
        templateContent,
        requiredFields,
        variableFields,
        isActive,
        // TODO: Get from auth session
        createdBy: 1 // Temporary hardcoded
      },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            username: true,
            fullName: true
          }
        }
      }
    })

    return NextResponse.json({
      status: 'success',
      message: 'Template created successfully',
      template
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create template',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
