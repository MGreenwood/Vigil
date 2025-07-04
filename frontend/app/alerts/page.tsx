'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'

interface Alert {
  id: string
  monitorId: string
  monitorName: string
  type: 'down' | 'ssl_expiring' | 'webhook_failed' | 'timeout' | 'status_mismatch'
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'active' | 'resolved' | 'acknowledged'
  createdAt: string
  resolvedAt?: string
  acknowledgedAt?: string
  acknowledgedBy?: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'acknowledged'>('all')
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockAlerts: Alert[] = [
      {
        id: '1',
        monitorId: '2',
        monitorName: 'Website Homepage',
        type: 'down',
        message: 'Website is down - HTTP 500 error',
        severity: 'high',
        status: 'active',
        createdAt: '2024-01-15T10:25:00Z'
      },
      {
        id: '2',
        monitorId: '3',
        monitorName: 'SSL Certificate',
        type: 'ssl_expiring',
        message: 'SSL certificate expires in 7 days',
        severity: 'medium',
        status: 'acknowledged',
        createdAt: '2024-01-15T09:00:00Z',
        acknowledgedAt: '2024-01-15T09:30:00Z',
        acknowledgedBy: 'john@example.com'
      },
      {
        id: '3',
        monitorId: '4',
        monitorName: 'Payment Webhook',
        type: 'webhook_failed',
        message: 'Webhook delivery failed after 3 retries',
        severity: 'critical',
        status: 'active',
        createdAt: '2024-01-15T08:45:00Z'
      },
      {
        id: '4',
        monitorId: '1',
        monitorName: 'API Health Check',
        type: 'timeout',
        message: 'Request timed out after 30 seconds',
        severity: 'medium',
        status: 'resolved',
        createdAt: '2024-01-15T07:30:00Z',
        resolvedAt: '2024-01-15T08:00:00Z'
      },
      {
        id: '5',
        monitorId: '5',
        monitorName: 'Database Connection',
        type: 'down',
        message: 'Database connection failed',
        severity: 'critical',
        status: 'active',
        createdAt: '2024-01-15T06:15:00Z'
      }
    ]

    setAlerts(mockAlerts)
    setLoading(false)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100'
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100'
      case 'acknowledged': return 'text-yellow-600 bg-yellow-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'down': return '🔴'
      case 'ssl_expiring': return '🔒'
      case 'webhook_failed': return '🔗'
      case 'timeout': return '⏰'
      case 'status_mismatch': return '❌'
      default: return '⚠️'
    }
  }

  const handleAcknowledge = async (alertId: string) => {
    // TODO: Replace with actual API call
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date().toISOString(), acknowledgedBy: 'current-user@example.com' }
        : alert
    ))
  }

  const handleResolve = async (alertId: string) => {
    // TODO: Replace with actual API call
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved', resolvedAt: new Date().toISOString() }
        : alert
    ))
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesStatus = filter === 'all' || alert.status === filter
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter
    const matchesSearch = alert.monitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSeverity && matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
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
          <h1 className="text-2xl font-bold text-primary">Alerts</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {alerts.filter(a => a.status === 'active').length} active alerts
            </span>
          </div>
        </div>
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="all">All Severity</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? 's' : ''}
            </h2>
          </div>
          
          {filteredAlerts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-500">
                {searchTerm || filter !== 'all' || severityFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Great! No active alerts at the moment.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAlerts.map((alert) => (
                <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center space-x-2">
                        <span>{getTypeIcon(alert.type)}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900">{alert.monitorName}</h3>
                          <Link
                            href={`/monitors/${alert.monitorId}`}
                            className="text-accent hover:text-accent-light text-xs"
                          >
                            View Monitor
                          </Link>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                          <span>Created: {new Date(alert.createdAt).toLocaleString()}</span>
                          {alert.acknowledgedAt && (
                            <>
                              <span>•</span>
                              <span>Acknowledged: {new Date(alert.acknowledgedAt).toLocaleString()}</span>
                              <span>by {alert.acknowledgedBy}</span>
                            </>
                          )}
                          {alert.resolvedAt && (
                            <>
                              <span>•</span>
                              <span>Resolved: {new Date(alert.resolvedAt).toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {alert.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                      {alert.status === 'acknowledged' && (
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Resolve
                        </button>
                      )}
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