'use client'

import { useState, useEffect } from 'react'

interface DateInputProps {
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  className?: string
  required?: boolean
}

export default function DateInput({ 
  name, 
  value, 
  onChange, 
  placeholder = "dd/mm/yyyy", 
  className = "",
  required = false 
}: DateInputProps) {
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    // Convert ISO date to display format
    if (value && value.includes('-')) {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        setDisplayValue(`${day}/${month}/${year}`)
      }
    } else if (value && value.includes('/')) {
      setDisplayValue(value)
    } else {
      setDisplayValue('')
    }
  }, [value])

  const formatDateInput = (input: string) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '')
    
    if (digits.length === 0) return ''
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    if (digits.length <= 8) return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
    
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
  }

  const convertToISODate = (dateStr: string) => {
    if (!dateStr || dateStr.length < 8) return ''
    
    const parts = dateStr.split('/')
    if (parts.length !== 3) return ''
    
    const day = parseInt(parts[0])
    const month = parseInt(parts[1])
    const year = parseInt(parts[2])
    
    // Validate date
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
      return ''
    }
    
    const date = new Date(year, month - 1, day)
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return ''
    }
    
    return date.toISOString().split('T')[0]
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const formatted = formatDateInput(inputValue)
    setDisplayValue(formatted)
    
    // Convert to ISO format for backend and call parent onChange
    const isoDate = convertToISODate(formatted)
    
    // Create a synthetic event compatible with the original handler
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        name,
        value: isoDate
      }
    } as React.ChangeEvent<HTMLInputElement>
    
    onChange(syntheticEvent)
  }

  return (
    <input
      type="text"
      name={name}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 ${className}`}
      maxLength={10}
    />
  )
}
