'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Search, Filter } from 'lucide-react'

interface ContractTemplate {
  id: number
  name: string
  category: string
  description: string
  isActive: boolean
}

const contractCategories = [
  'Tất cả',
  'Chuyển nhượng',
  'Mua bán', 
  'Đặt cọc',
  'Tặng cho',
  'Thuê và mượn',
  'Thế chấp',
  'Cầm cố',
  'Bảo lãnh',
  'Ủy quyền (hợp đồng)',
  'Ủy quyền (giấy ủy quyền)',
  'Chuyển đổi và trao đổi',
  'Góp vốn',
  'Di chúc',
  'Thừa kế (thỏa thuận phân chia DSTK)',
  'Tài sản vợ chồng (phân chia tài sản)',
  'Tài sản vợ chồng (nhập tài sản)',
  'Cam kết tài sản riêng',
  'Vay (không thế chấp tài sản)',
  'Vay (có thế chấp tài sản)',
  'Giao dịch khác'
]

export default function ContractsPage() {
  const [templates, setTemplates] = useState<ContractTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const router = useRouter()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/contract-templates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tất cả' || template.category === selectedCategory
    return matchesSearch && matchesCategory && template.isActive
  })

  const handleSelectTemplate = (template: ContractTemplate) => {
    router.push(`/dashboard/files/create?templateId=${template.id}`)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card">
              <div className="card-content">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chọn hợp đồng</h1>
        <p className="text-gray-600 mt-1">Chọn mẫu hợp đồng để bắt đầu soạn thảo</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Tìm kiếm mẫu hợp đồng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="sm:w-64">
          <select
            className="select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {contractCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Tìm thấy {filteredTemplates.length} mẫu hợp đồng
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="card hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => handleSelectTemplate(template)}
          >
            <div className="card-content">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm leading-5 mb-1">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {template.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {template.category}
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Chọn
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy mẫu hợp đồng nào
          </h3>
          <p className="text-gray-600">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục
          </p>
        </div>
      )}
    </div>
  )
}
