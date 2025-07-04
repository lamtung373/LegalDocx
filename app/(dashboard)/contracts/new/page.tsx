'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Search, X } from 'lucide-react'

// Mock data cho mẫu hợp đồng
const contractTemplates = [
  { id: 1, name: 'Hợp đồng mua bán nhà đất', category: 'Bất động sản' },
  { id: 2, name: 'Hợp đồng mua bán căn hộ', category: 'Bất động sản' },
  { id: 3, name: 'Hợp đồng tặng cho', category: 'Tặng cho' },
  { id: 4, name: 'Hợp đồng ủy quyền', category: 'Ủy quyền' },
  { id: 5, name: 'Di chúc', category: 'Di chúc' },
]

export default function NewContractPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [searchParty, setSearchParty] = useState('')
  const [searchAsset, setSearchAsset] = useState('')
  const [selectedParties, setSelectedParties] = useState<any[]>([])
  const [selectedAssets, setSelectedAssets] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit form data to API
    console.log('Form submitted')
    router.push('/records')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Soạn hợp đồng mới</h1>
        <p className="text-gray-600 mt-1">Tạo hồ sơ công chứng mới</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Chọn mẫu hợp đồng */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Chọn mẫu hợp đồng</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {contractTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thông tin hồ sơ */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Thông tin hồ sơ</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số hồ sơ
              </label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Tự động tạo"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ngày lập
              </label>
              <input
                type="date"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        {/* Đương sự */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Đương sự</h2>
            <button
              type="button"
              className="flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm đương sự mới
            </button>
          </div>
          
          {/* Search đương sự */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchParty}
              onChange={(e) => setSearchParty(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Tìm kiếm đương sự..."
            />
          </div>

          {/* Danh sách đương sự đã chọn */}
          {selectedParties.length > 0 && (
            <div className="space-y-2 mb-4">
              {selectedParties.map((party, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div>
                    <p className="font-medium">{party.name}</p>
                    <p className="text-sm text-gray-500">CMND: {party.idNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedParties(selectedParties.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tài sản */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Tài sản</h2>
            <button
              type="button"
              className="flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Thêm tài sản mới
            </button>
          </div>
          
          {/* Search tài sản */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchAsset}
              onChange={(e) => setSearchAsset(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Tìm kiếm tài sản..."
            />
          </div>
        </div>

        {/* Phí công chứng */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Phí công chứng</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phí công chứng
              </label>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Thuế TNCN
              </label>
              <input
                type="number"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Lưu hồ sơ
          </button>
        </div>
      </form>
    </div>
  )
}