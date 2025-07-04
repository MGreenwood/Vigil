'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '../../components/Navigation'

interface MonitorForm {
  name: string
  type: 'http' | 'ssl' | 'webhook'
  url: string
  interval: number
  timeout: number
  expectedStatus: number
  customHeaders: string
  isActive: boolean
  description: string
}

export default function NewMonitorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<MonitorForm>({
    name: '',
    type: 'http',
    url: '',
    interval: 60,
    timeout: 30,
    expectedStatus: 200,
    customHeaders: '',
    isActive: true,
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Replace with actual API call
      console.log('Creating monitor:', form)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to monitors list
      router.push('/monitors')
    } catch (error) {
      console.error('Error creating monitor:', error)
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof MonitorForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const intervalOptions = [
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' },
    { value: 300, label: '5 minutes' },
    { value: 600, label: '10 minutes' },
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '1 hour' },
    { value: 7200, label: '2 hours' },
    { value: 14400, label: '4 hours' },
    { value: 28800, label: '8 hours' },
    { value: 86400, label: '1 day' }
  ]

  const timeoutOptions = [
    { value: 10, label: '10 seconds' },
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' }
  ]

  return (
    <div className="min-h-screen bg-neutral">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            href="/monitors"
            className="text-gray-600 hover:text-primary"
          >
            ← Back to Monitors
          </Link>
          <h1 className="text-2xl font-bold text-primary">Add New Monitor</h1>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Monitor Configuration</h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure your monitor settings. All fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Basic Information</h3>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Monitor Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., API Health Check"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Optional description of what this monitor checks"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Monitor Type *
                </label>
                <select
                  id="type"
                  required
                  value={form.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="http">HTTP/HTTPS Endpoint</option>
                  <option value="ssl">SSL Certificate</option>
                  <option value="webhook">Webhook Delivery</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {form.type === 'http' && 'Monitor HTTP/HTTPS endpoints for availability and response times'}
                  {form.type === 'ssl' && 'Check SSL certificate expiration dates'}
                  {form.type === 'webhook' && 'Monitor webhook delivery success and failure rates'}
                </p>
              </div>
            </div>

            {/* URL Configuration */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">URL Configuration</h3>
              
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="url"
                  id="url"
                  required
                  value={form.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder={form.type === 'http' ? 'https://api.example.com/health' : 
                              form.type === 'ssl' ? 'https://example.com' : 
                              'https://webhook.site/your-unique-id'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.type === 'http' && 'Enter the full URL including protocol (http:// or https://)'}
                  {form.type === 'ssl' && 'Enter the domain name to check SSL certificate expiration'}
                  {form.type === 'webhook' && 'Enter your webhook endpoint URL'}
                </p>
              </div>

              {form.type === 'http' && (
                <div>
                  <label htmlFor="expectedStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Status Code
                  </label>
                  <input
                    type="number"
                    id="expectedStatus"
                    value={form.expectedStatus}
                    onChange={(e) => handleInputChange('expectedStatus', parseInt(e.target.value))}
                    placeholder="200"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The HTTP status code that indicates a successful response (default: 200)
                  </p>
                </div>
              )}
            </div>

            {/* Timing Configuration */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Timing Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="interval" className="block text-sm font-medium text-gray-700 mb-1">
                    Check Interval *
                  </label>
                  <select
                    id="interval"
                    required
                    value={form.interval}
                    onChange={(e) => handleInputChange('interval', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    {intervalOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How often to check this monitor
                  </p>
                </div>

                <div>
                  <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 mb-1">
                    Timeout *
                  </label>
                  <select
                    id="timeout"
                    required
                    value={form.timeout}
                    onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    {timeoutOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum time to wait for a response
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-900">Advanced Options</h3>
              
              {form.type === 'http' && (
                <div>
                  <label htmlFor="customHeaders" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Headers (JSON)
                  </label>
                  <textarea
                    id="customHeaders"
                    value={form.customHeaders}
                    onChange={(e) => handleInputChange('customHeaders', e.target.value)}
                    placeholder='{"Authorization": "Bearer token", "User-Agent": "Vigil/1.0"}'
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional custom headers to send with the request (JSON format)
                  </p>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Monitor is active
                </label>
              </div>
              <p className="text-xs text-gray-500">
                Inactive monitors will not be checked but can be reactivated later
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/monitors"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Monitor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 