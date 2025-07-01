'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, User, Building } from 'lucide-react'
import DateInput from '../../../components/DateInput'

interface FormData {
  type: 'individual' | 'organization'
  fullName: string
  citizenId: string
  taxCode: string
  phone: string
  email: string
  address: string
  birthDate: string
  birthPlace: string
  gender: 'male' | 'female' | 'other' | ''
  nationality: string
  occupation: string
  representativeName: string
  representativePosition: string
  bankAccount: string
  bankName: string
  notes: string
}

export default function NewPartyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<FormData>({
    type: 'individual',
    fullName: '',
    citizenId: '',
    taxCode: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    birthPlace: '',
    gender: '',
    nationality: 'Việt Nam',
    occupation: '',
    representativeName: '',
    representativePosition: '',
    bankAccount: '',
    bankName: '',
    notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/parties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.status === 'success') {
        setMessage('Thêm đương sự thành công!')
        setTimeout(() => {
          router.push('/parties')
        }, 1500)
      } else {
        setMessage(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra khi thêm đương sự')
    } finally {
      setLoading(false)
    }
  }

  const isIndividual = formData.type === 'individual'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/parties" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Đương sự
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                Thêm đương sự mới
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Loại đương sự</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'individual' 
                  ? 'border-blue-500 bg-blue-50 text-blue-900' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="individual"
                  checked={formData.type === 'individual'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <User className={`h-6 w-6 mr-3 ${formData.type === 'individual' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">Cá nhân</span>
              </label>
              
              <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.type === 'organization' 
                  ? 'border-blue-500 bg-blue-50 text-blue-900' 
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="organization"
                  checked={formData.type === 'organization'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Building className={`h-6 w-6 mr-3 ${formData.type === 'organization' ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className="font-medium">Tổ chức</span>
              </label>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isIndividual ? 'Họ và tên' : 'Tên tổ chức'} *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder={isIndividual ? "Nhập họ và tên" : "Nhập tên tổ chức"}
                />
              </div>

              {isIndividual ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CMND/CCCD
                  </label>
                  <input
                    type="text"
                    name="citizenId"
                    value={formData.citizenId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Nhập số CMND/CCCD"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã số thuế
                  </label>
                  <input
                    type="text"
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Nhập mã số thuế"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Nhập địa chỉ đầy đủ"
                />
              </div>
            </div>
          </div>

          {/* Personal Information (Individual only) */}
          {isIndividual && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                    <span className="text-xs text-gray-500 ml-2">(Nhập liền: 12112002 → 12/11/2002)</span>
                  </label>
                  <DateInput
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    placeholder="dd/mm/yyyy (ví dụ: 12112002)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nơi sinh
                  </label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Nhập nơi sinh"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-500">Chọn giới tính</option>
                    <option value="male" className="text-gray-900">Nam</option>
                    <option value="female" className="text-gray-900">Nữ</option>
                    <option value="other" className="text-gray-900">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quốc tịch
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Nhập quốc tịch"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nghề nghiệp
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Nhập nghề nghiệp"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Representative Information (Organization only) */}
          {!isIndividual && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Người đại diện pháp luật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên người đại diện
                  </label>
                  <input
                    type="text"
                    name="representativeName"
                    value={formData.representativeName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Nhập tên người đại diện"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chức vụ
                  </label>
                  <input
                    type="text"
                    name="representativePosition"
                    value={formData.representativePosition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                    placeholder="Nhập chức vụ"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Banking Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin ngân hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Nhập số tài khoản"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên ngân hàng
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                  placeholder="Nhập tên ngân hàng"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h2>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
              placeholder="Nhập ghi chú bổ sung..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/parties"
              className="px-6 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? 'Đang lưu...' : 'Lưu đương sự'}</span>
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('thành công') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message}
            </div>
          )}
        </form>
      </main>
    </div>
  )
}
