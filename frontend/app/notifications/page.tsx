'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '../components/Navigation'

interface NotificationChannel {
  id: string
  name: string
  type: 'email' | 'slack' | 'discord' | 'webhook'
  config: any
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

export default function NotificationsPage() {
  const [channels, setChannels] = useState<NotificationChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockChannels: NotificationChannel[] = [
      {
        id: '1',
        name: 'Team Email',
        type: 'email',
        config: {
          email: 'team@example.com',
          name: 'Team Notifications'
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        lastUsed: '2024-01-15T10:25:00Z'
      },
      {
        id: '2',
        name: 'Slack Alerts',
        type: 'slack',
        config: {
          webhookUrl: 'https://hooks.slack.com/services/...',
          channel: '#alerts'
        },
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        lastUsed: '2024-01-15T08:45:00Z'
      },
      {
        id: '3',
        name: 'Discord Notifications',
        type: 'discord',
        config: {
          webhookUrl: 'https://discord.com/api/webhooks/...',
          channel: 'monitoring'
        },
        isActive: false,
        createdAt: '2024-01-01T00:00:00Z'
      }
    ]

    setChannels(mockChannels)
    setLoading(false)
  }, [])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return '📧'
      case 'slack': return '💬'
      case 'discord': return '🎮'
      case 'webhook': return '🔗'
      default: return '📡'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'slack': return 'bg-purple-100 text-purple-800'
      case 'discord': return 'bg-indigo-100 text-indigo-800'
      case 'webhook': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleToggleActive = async (channelId: string) => {
    // TODO: Replace with actual API call
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, isActive: !channel.isActive }
        : channel
    ))
  }

  const handleDelete = async (channelId: string) => {
    // TODO: Replace with actual API call
    if (confirm('Are you sure you want to delete this notification channel?')) {
      setChannels(prev => prev.filter(channel => channel.id !== channelId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
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
          <h1 className="text-2xl font-bold text-primary">Notification Channels</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent-light transition-colors"
          >
            Add Channel
          </button>
        </div>

        {/* Notification Channels List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {channels.length} Notification Channel{channels.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure how you receive alerts when monitors fail
            </p>
          </div>
          
          {channels.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">📧</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notification channels</h3>
              <p className="text-gray-500 mb-6">
                Add notification channels to receive alerts when your monitors fail
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors"
              >
                Add Your First Channel
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {channels.map((channel) => (
                <div key={channel.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span>{getTypeIcon(channel.type)}</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(channel.type)}`}>
                          {channel.type.toUpperCase()}
                        </span>
                        {!channel.isActive && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                            INACTIVE
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{channel.name}</h3>
                        <p className="text-sm text-gray-500">
                          {channel.type === 'email' && channel.config.email}
                          {channel.type === 'slack' && `#${channel.config.channel}`}
                          {channel.type === 'discord' && `#${channel.config.channel}`}
                          {channel.type === 'webhook' && 'Webhook URL'}
                        </p>
                        {channel.lastUsed && (
                          <p className="text-xs text-gray-400 mt-1">
                            Last used: {new Date(channel.lastUsed).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleActive(channel.id)}
                        className={`text-sm font-medium ${
                          channel.isActive 
                            ? 'text-green-600 hover:text-green-800' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        {channel.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <Link
                        href={`/notifications/${channel.id}/edit`}
                        className="text-accent hover:text-accent-light text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(channel.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Channel Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Notification Channel</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This feature is coming soon! You'll be able to configure email, Slack, Discord, and webhook notifications.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 