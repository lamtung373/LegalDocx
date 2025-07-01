import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST() {
  try {
    await prisma.$connect()
    
    // Check if users already exist
    const existingUsers = await prisma.user.count()
    if (existingUsers > 0) {
      return NextResponse.json({
        status: 'info',
        message: 'Database already has data. Skipping seed.',
        existingRecords: existingUsers
      })
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const userPassword = await bcrypt.hash('user123', 12)

    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@notary.com',
        passwordHash: adminPassword,
        role: 'admin',
        fullName: 'Quản trị viên hệ thống'
      }
    })

    const user = await prisma.user.create({
      data: {
        username: 'user1',
        email: 'user1@notary.com',
        passwordHash: userPassword,
        role: 'user',
        fullName: 'Nhân viên công chứng'
      }
    })

    // Create contract categories
    const categories = await Promise.all([
      prisma.contractCategory.create({
        data: {
          name: 'Chuyển nhượng bất động sản',
          description: 'Các hợp đồng mua bán, chuyển nhượng nhà đất',
          sortOrder: 1
        }
      }),
      prisma.contractCategory.create({
        data: {
          name: 'Cho thuê',
          description: 'Hợp đồng cho thuê nhà, đất, tài sản',
          sortOrder: 2
        }
      }),
      prisma.contractCategory.create({
        data: {
          name: 'Thế chấp',
          description: 'Hợp đồng thế chấp tài sản',
          sortOrder: 3
        }
      }),
      prisma.contractCategory.create({
        data: {
          name: 'Khác',
          description: 'Các loại hợp đồng khác',
          sortOrder: 99
        }
      })
    ])

    // Create sample contract template
    const sampleTemplate = await prisma.contractTemplate.create({
      data: {
        categoryId: categories[0].id,
        name: 'Hợp đồng mua bán nhà đất',
        description: 'Mẫu hợp đồng mua bán nhà đất cơ bản',
        templateContent: `
        <h2>HỢP ĐỒNG MUA BÁN NHÀ ĐẤT</h2>
        
        <p><strong>Bên bán:</strong> {{seller_name}}</p>
        <p><strong>CMND/CCCD:</strong> {{seller_citizen_id}}</p>
        <p><strong>Địa chỉ:</strong> {{seller_address}}</p>
        
        <p><strong>Bên mua:</strong> {{buyer_name}}</p>
        <p><strong>CMND/CCCD:</strong> {{buyer_citizen_id}}</p>
        <p><strong>Địa chỉ:</strong> {{buyer_address}}</p>
        
        <h3>THÔNG TIN TÀI SẢN</h3>
        <p><strong>Tên tài sản:</strong> {{asset_name}}</p>
        <p><strong>Địa chỉ:</strong> {{asset_location}}</p>
        <p><strong>Diện tích:</strong> {{asset_area}} m²</p>
        <p><strong>Số giấy chứng nhận:</strong> {{certificate_number}}</p>
        
        <h3>GIÁ BÁN</h3>
        <p><strong>Tổng giá trị:</strong> {{transaction_value}} VNĐ</p>
        
        <p>Ngày ký hợp đồng: {{contract_date}}</p>
        `,
        requiredFields: [
          "seller_name", "seller_citizen_id", "seller_address",
          "buyer_name", "buyer_citizen_id", "buyer_address",
          "asset_name", "asset_location", "asset_area",
          "certificate_number", "transaction_value"
        ],
        variableFields: [
          "contract_date", "notary_fee", "additional_terms"
        ],
        createdBy: admin.id
      }
    })

    // Create sample party
    const sampleParty = await prisma.party.create({
      data: {
        type: 'individual',
        fullName: 'Nguyễn Văn A',
        citizenId: '123456789',
        phone: '0123456789',
        email: 'nguyenvana@example.com',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        birthDate: new Date('1980-01-01'),
        birthPlace: 'TP.HCM',
        gender: 'male',
        nationality: 'Việt Nam',
        occupation: 'Nhân viên văn phòng'
      }
    })

    // Create sample asset
    const sampleAsset = await prisma.asset.create({
      data: {
        type: 'real_estate',
        name: 'Căn hộ chung cư',
        description: 'Căn hộ 2 phòng ngủ tại chung cư XYZ',
        location: '456 Đường DEF, Quận 2, TP.HCM',
        area: 75.5,
        certificateNumber: 'SO001234',
        certificateDate: new Date('2020-01-15'),
        certificateAuthority: 'Sở Tài nguyên và Môi trường TP.HCM',
        marketValue: 2500000000,
        ownerId: sampleParty.id
      }
    })

    return NextResponse.json({
      status: 'success',
      message: 'Database seeded successfully',
      data: {
        users: 2,
        categories: categories.length,
        templates: 1,
        parties: 1,
        assets: 1
      },
      credentials: {
        admin: { username: 'admin', password: 'admin123' },
        user: { username: 'user1', password: 'user123' }
      }
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database seeding failed',
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
    message: 'Use POST method to seed database',
    warning: 'This will create sample data. Only run once.'
  })
}
