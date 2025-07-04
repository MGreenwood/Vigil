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
  lastCheck: string
  uptime: number
  responseTime: number
}

interface Alert {
  id: string
  monitorId: string
  monitorName: string
  type: 'down' | 'ssl_expiring' | 'webhook_failed'
  message: string
  severity: 'low' | 'medium' | 'high'
  createdAt: string
  resolved: boolean
}

interface DashboardStats {
  totalMonitors: number
  activeMonitors: number
  downMonitors: number
  overallUptime: number
  totalAlerts: number
  pendingAlerts: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMonitors: 0,
    activeMonitors: 0,
    downMonitors: 0,
    overallUptime: 0,
    totalAlerts: 0,
    pendingAlerts: 0
  })
  const [monitors, setMonitors] = useState<Monitor[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API calls
    // For now, using mock data
    const mockStats: DashboardStats = {
      totalMonitors: 12,
      activeMonitors: 11,
      downMonitors: 1,
      overallUptime: 99.7,
      totalAlerts: 3,
      pendingAlerts: 1
    }

    const mockMonitors: Monitor[] = [
      {
        id: '1',
        name: 'API Health Check',
        type: 'http',
        url: 'https://api.example.com/health',
        status: 'up',
        lastCheck: '2024-01-15T10:30:00Z',
        uptime: 99.9,
        responseTime: 245
      },
      {
        id: '2',
        name: 'Website Homepage',
        type: 'http',
        url: 'https://example.com',
        status: 'down',
        lastCheck: '2024-01-15T10:25:00Z',
        uptime: 98.5,
        responseTime: 0
      },
      {
        id: '3',
        name: 'SSL Certificate',
        type: 'ssl',
        url: 'https://example.com',
        status: 'warning',
        lastCheck: '2024-01-15T10:30:00Z',
        uptime: 100,
        responseTime: 0
      }
    ]

    const mockAlerts: Alert[] = [
      {
        id: '1',
        monitorId: '2',
        monitorName: 'Website Homepage',
        type: 'down',
        message: 'Website is down - HTTP 500 error',
        severity: 'high',
        createdAt: '2024-01-15T10:25:00Z',
        resolved: false
      },
      {
        id: '2',
        monitorId: '3',
        monitorName: 'SSL Certificate',
        type: 'ssl_expiring',
        message: 'SSL certificate expires in 7 days',
        severity: 'medium',
        createdAt: '2024-01-15T09:00:00Z',
        resolved: false
      }
    ]

    setStats(mockStats)
    setMonitors(mockMonitors)
    setAlerts(mockAlerts)
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded"></div>
              <div className="h-96 bg-gray-300 rounded"></div>
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
          <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
          <Link
            href="/monitors/new"
            className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent-light transition-colors"
          >
            Add Monitor
          </Link>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  📊
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Monitors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMonitors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  ✅
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overall Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overallUptime}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  ⚠️
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monitors List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Monitors</h2>
                <Link
                  href="/monitors"
                  className="text-accent hover:text-accent-light text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {monitors.map((monitor) => (
                <div key={monitor.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="mr-3">{getStatusIcon(monitor.status)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{monitor.name}</p>
                        <p className="text-sm text-gray-500">{monitor.url}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(monitor.status)}`}>
                        {monitor.status.toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">{monitor.uptime}% uptime</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
                <Link
                  href="/alerts"
                  className="text-accent hover:text-accent-light text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {alerts.map((alert) => (
                <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">{alert.monitorName}</p>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    {!alert.resolved && (
                      <button className="ml-4 text-sm text-accent hover:text-accent-light">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 