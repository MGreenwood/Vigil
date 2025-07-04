'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'

interface Monitor {
  id: string
  name: string
  type: 'http' | 'ssl' | 'webhook'
  url: string
  status: 'up' | 'down' | 'warning'
  interval: number
  timeout: number
  lastCheck: string
  uptime: number
  responseTime: number
  expectedStatus: number
  isActive: boolean
  createdAt: string
}

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'up' | 'down' | 'warning'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockMonitors: Monitor[] = [
      {
        id: '1',
        name: 'API Health Check',
        type: 'http',
        url: 'https://api.example.com/health',
        status: 'up',
        interval: 60,
        timeout: 30,
        lastCheck: '2024-01-15T10:30:00Z',
        uptime: 99.9,
        responseTime: 245,
        expectedStatus: 200,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'Website Homepage',
        type: 'http',
        url: 'https://example.com',
        status: 'down',
        interval: 120,
        timeout: 30,
        lastCheck: '2024-01-15T10:25:00Z',
        uptime: 98.5,
        responseTime: 0,
        expectedStatus: 200,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'SSL Certificate',
        type: 'ssl',
        url: 'https://example.com',
        status: 'warning',
        interval: 3600,
        timeout: 30,
        lastCheck: '2024-01-15T10:30:00Z',
        uptime: 100,
        responseTime: 0,
        expectedStatus: 0,
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        name: 'Payment Webhook',
        type: 'webhook',
        url: 'https://webhook.site/abc123',
        status: 'up',
        interval: 300,
        timeout: 30,
        lastCheck: '2024-01-15T10:28:00Z',
        uptime: 99.8,
        responseTime: 180,
        expectedStatus: 200,
        isActive: false,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]

    setMonitors(mockMonitors)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'text-green-600 bg-green-100'
      case 'down': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up': return '🟢'
      case 'down': return '🔴'
      case 'warning': return '🟡'
      default: return '⚪'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'http': return '🌐'
      case 'ssl': return '🔒'
      case 'webhook': return '🔗'
      default: return '📡'
    }
  }

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  const filteredMonitors = monitors.filter(monitor => {
    const matchesFilter = filter === 'all' || monitor.status === filter
    const matchesSearch = monitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         monitor.url.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Monitors</h1>
          <Link
            href="/monitors/new"
            className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent-light transition-colors"
          >
            Add Monitor
          </Link>
        </div>
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search monitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('up')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'up' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Up
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'warning' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Warning
              </button>
              <button
                onClick={() => setFilter('down')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'down' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Down
              </button>
            </div>
          </div>
        </div>

        {/* Monitors List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredMonitors.length} Monitor{filteredMonitors.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          {filteredMonitors.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📡</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No monitors found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first monitor'
                }
              </p>
              {!searchTerm && filter === 'all' && (
                <Link
                  href="/monitors/new"
                  className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors"
                >
                  Add Your First Monitor
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredMonitors.map((monitor) => (
                <div key={monitor.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span>{getStatusIcon(monitor.status)}</span>
                        <span>{getTypeIcon(monitor.type)}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">{monitor.name}</h3>
                          {!monitor.isActive && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                              PAUSED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{monitor.url}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                          <span>Check every {formatInterval(monitor.interval)}</span>
                          <span>•</span>
                          <span>{monitor.uptime}% uptime</span>
                          <span>•</span>
                          <span>Last check: {new Date(monitor.lastCheck).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(monitor.status)}`}>
                        {monitor.status.toUpperCase()}
                      </span>
                      <div className="flex space-x-2">
                        <Link
                          href={`/monitors/${monitor.id}`}
                          className="text-accent hover:text-accent-light text-sm font-medium"
                        >
                          View
                        </Link>
                        <Link
                          href={`/monitors/${monitor.id}/edit`}
                          className="text-gray-600 hover:text-primary text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 