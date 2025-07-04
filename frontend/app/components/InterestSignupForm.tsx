'use client'

import { useState } from 'react'

export default function InterestSignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/interest/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setMessage(data.message)
        setFormData({ name: '', email: '' })
      } else {
        setSuccess(false)
        setMessage(data.message)
      }
    } catch (error) {
      setSuccess(false)
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-2xl mb-2">✅</div>
        <h3 className="text-green-800 font-semibold mb-2">Welcome to Vigil!</h3>
        <p className="text-green-700">{message}</p>
        <button
          onClick={() => {
            setSuccess(false)
            setMessage('')
          }}
          className="mt-4 text-green-600 hover:text-green-800 text-sm underline"
        >
          Sign up another email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Your name"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900"
        />
      </div>
      
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
          required
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-accent focus:border-transparent text-gray-900"
        />
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          success 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Joining...' : 'Join Interest List'}
      </button>
    </form>
  )
} 