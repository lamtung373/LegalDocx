import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@congchung.vn',
      password: adminPassword,
      name: 'Quản trị viên',
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'user@congchung.vn',
      password: userPassword,
      name: 'Nhân viên',
      role: 'USER',
    },
  })

  // Create contract templates
  const templates = await prisma.contractTemplate.createMany({
    data: [
      {
        name: 'Hợp đồng mua bán nhà đất',
        category: 'Bất động sản',
        content: 'Mẫu hợp đồng mua bán nhà đất...',
        variables: JSON.stringify(['buyerName', 'sellerName', 'propertyAddress', 'price']),
      },
      {
        name: 'Hợp đồng mua bán căn hộ',
        category: 'Bất động sản',
        content: 'Mẫu hợp đồng mua bán căn hộ...',
        variables: JSON.stringify(['buyerName', 'sellerName', 'apartmentInfo', 'price']),
      },
      {
        name: 'Hợp đồng tặng cho',
        category: 'Tặng cho',
        content: 'Mẫu hợp đồng tặng cho...',
        variables: JSON.stringify(['giverName', 'receiverName', 'giftDescription']),
      },
      {
        name: 'Hợp đồng ủy quyền',
        category: 'Ủy quyền',
        content: 'Mẫu hợp đồng ủy quyền...',
        variables: JSON.stringify(['principalName', 'agentName', 'authorizedActions']),
      },
      {
        name: 'Di chúc',
        category: 'Di chúc',
        content: 'Mẫu di chúc...',
        variables: JSON.stringify(['testatorName', 'beneficiaries', 'assets']),
      },
    ],
  })

  // Create sample parties
  const parties = await prisma.party.createMany({
    data: [
      {
        name: 'Nguyễn Văn A',
        idNumber: '012345678901',
        birthDate: new Date('1980-01-01'),
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        phone: '0901234567',
        email: 'nguyenvana@email.com',
      },
      {
        name: 'Trần Thị B',
        idNumber: '012345678902',
        birthDate: new Date('1985-05-15'),
        address: '456 Lê Lợi, Q1, TP.HCM',
        phone: '0907654321',
        email: 'tranthib@email.com',
      },
      {
        name: 'Lê Văn C',
        idNumber: '012345678903',
        birthDate: new Date('1975-12-20'),
        address: '789 Hai Bà Trưng, Q3, TP.HCM',
        phone: '0909876543',
        email: 'levanc@email.com',
      },
    ],
  })

  // Create sample assets
  const assets = await prisma.asset.createMany({
    data: [
      {
        type: 'Nhà',
        description: 'Nhà 2 tầng mặt tiền đường Nguyễn Huệ',
        location: '123 Nguyễn Huệ, Q1, TP.HCM',
        value: 5000000000,
        details: JSON.stringify({
          area: '100m2',
          floors: 2,
          rooms: 4,
        }),
      },
      {
        type: 'Căn hộ',
        description: 'Căn hộ 2PN tại Vinhomes Central Park',
        location: 'Vinhomes Central Park, Bình Thạnh, TP.HCM',
        value: 3000000000,
        details: JSON.stringify({
          area: '75m2',
          bedrooms: 2,
          floor: 15,
        }),
      },
      {
        type: 'Đất',
        description: 'Đất nông nghiệp 1000m2',
        location: 'Xã Tân Phú, Củ Chi, TP.HCM',
        value: 500000000,
        details: JSON.stringify({
          area: '1000m2',
          landType: 'Nông nghiệp',
        }),
      },
    ],
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })