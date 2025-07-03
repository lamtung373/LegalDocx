import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function CreateDocument() {
  const [formData, setFormData] = useState({
    title: '',
    template_id: '',
    content: '',
    notary_date: '',
    notary_fee: ''
  })
  const [templates, setTemplates] = useState([])
  const [selectedPersonsA, setSelectedPersonsA] = useState([])
  const [selectedPersonsB, setSelectedPersonsB] = useState([])
  const [selectedProperties, setSelectedProperties] = useState([])
  const [persons, setPersons] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)
  const [showPersonModal, setShowPersonModal] = useState(false)
  const [showPropertyModal, setShowPropertyModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchTemplates()
    fetchPersons()
    fetchProperties()
  }, [])

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/contracts/templates', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const fetchPersons = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/persons', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setPersons(data)
      }
    } catch (error) {
      console.error('Error fetching persons:', error)
    }
  }

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTemplateChange = (e) => {
    const templateId = e.target.value
    setFormData(prev => ({ ...prev, template_id: templateId }))
    
    if (templateId) {
      const template = templates.find(t => t.id == templateId)
      if (template) {
        setFormData(prev => ({ 
          ...prev, 
          content: template.content,
          title: template.name 
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          party_a: selectedPersonsA,
          party_b: selectedPersonsB,
          properties: selectedProperties
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/documents/${data.document.id}`)
      } else {
        const error = await response.json()
        alert(error.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error creating document:', error)
      alert('Có lỗi xảy ra khi tạo hồ sơ')
    } finally {
      setLoading(false)
    }
  }

  const addPersonA = (person) => {
    if (!selectedPersonsA.find(p => p.id === person.id)) {
      setSelectedPersonsA([...selectedPersonsA, person])
    }
  }

  const addPersonB = (person) => {
    if (!selectedPersonsB.find(p => p.id === person.id)) {
      setSelectedPersonsB([...selectedPersonsB, person])
    }
  }

  const addProperty = (property) => {
    if (!selectedProperties.find(p => p.id === property.id)) {
      setSelectedProperties([...selectedProperties, property])
    }
  }

  const removePersonA = (personId) => {
    setSelectedPersonsA(selectedPersonsA.filter(p => p.id !== personId))
  }

  const removePersonB = (personId) => {
    setSelectedPersonsB(selectedPersonsB.filter(p => p.id !== personId))
  }

  const removeProperty = (propertyId) => {
    setSelectedProperties(selectedProperties.filter(p => p.id !== propertyId))
  }

  return (
    <Layout>
      <Head>
        <title>Tạo hồ sơ mới - Hệ thống Công chứng</title>
      </Head>
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo hồ sơ mới</h1>
            <p className="text-gray-600">Tạo hồ sơ công chứng mới từ mẫu có sẵn</p>
          </div>
          <button
            onClick={() => router.back()}
            className="btn-secondary"
          >
            ← Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Mẫu hợp đồng *</label>
                <select
                  name="template_id"
                  value={formData.template_id}
                  onChange={handleTemplateChange}
                  className="form-input"
                  required
                >
                  <option value="">Chọn mẫu hợp đồng</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Tiêu đề hồ sơ *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Nhập tiêu đề hồ sơ"
                  required
                />
              </div>

              <div>
                <label className="form-label">Ngày công chứng</label>
                <input
                  type="date"
                  name="notary_date"
                  value={formData.notary_date}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Phí công chứng (VNĐ)</label>
                <input
                  type="number"
                  name="notary_fee"
                  value={formData.notary_fee}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Parties */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Đương sự</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Party A */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Bên A</h3>
                  <button
                    type="button"
                    onClick={() => setShowPersonModal(true)}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    + Thêm người
                  </button>
                </div>
                
                <div className="space-y-2">
                  {selectedPersonsA.map(person => (
                    <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{person.full_name}</div>
                        <div className="text-sm text-gray-600">{person.id_number}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePersonA(person.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="text-gray-400">
                      <p className="text-sm">Chọn đương sự cho Bên A</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Party B */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Bên B</h3>
                  <button
                    type="button"
                    onClick={() => setShowPersonModal(true)}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    + Thêm người
                  </button>
                </div>
                
                <div className="space-y-2">
                  {selectedPersonsB.map(person => (
                    <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{person.full_name}</div>
                        <div className="text-sm text-gray-600">{person.id_number}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removePersonB(person.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <div className="text-gray-400">
                      <p className="text-sm">Chọn đương sự cho Bên B</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tài sản liên quan</h2>
              <button
                type="button"
                onClick={() => setShowPropertyModal(true)}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                + Thêm tài sản
              </button>
            </div>
            
            <div className="space-y-2">
              {selectedProperties.map(property => (
                <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{property.name}</div>
                    <div className="text-sm text-gray-600">{property.address}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProperty(property.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {selectedProperties.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <div className="text-gray-400">
                    <p className="text-sm">Chọn tài sản liên quan đến hồ sơ</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nội dung hợp đồng</h2>
            
            <div>
              <label className="form-label">Nội dung</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                className="form-input"
                placeholder="Nội dung hợp đồng sẽ được điền tự động khi chọn mẫu"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Đang tạo...' : 'Tạo hồ sơ'}
            </button>
          </div>
        </form>
      </div>

      {/* Person Selection Modal */}
      {showPersonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chọn đương sự</h3>
              <button
                onClick={() => setShowPersonModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2">
              {persons.map(person => (
                <div key={person.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{person.full_name}</div>
                    <div className="text-sm text-gray-600">{person.id_number}</div>
                  </div>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        addPersonA(person)
                        setShowPersonModal(false)
                      }}
                      className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      Bên A
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addPersonB(person)
                        setShowPersonModal(false)
                      }}
                      className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      Bên B
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Property Selection Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Chọn tài sản</h3>
              <button
                onClick={() => setShowPropertyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2">
              {properties.map(property => (
                <div key={property.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{property.name}</div>
                    <div className="text-sm text-gray-600">{property.address}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      addProperty(property)
                      setShowPropertyModal(false)
                    }}
                    className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded"
                  >
                    Chọn
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
