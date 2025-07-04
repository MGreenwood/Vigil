'use client'

import { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'organization' | 'notifications' | 'security'>('profile')

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: '2024-01-01T00:00:00Z'
    }

    const mockOrganization: Organization = {
      id: '1',
      name: 'Acme Corp',
      slug: 'acme-corp',
      ownerId: '1',
      createdAt: '2024-01-01T00:00:00Z'
    }

    setUser(mockUser)
    setOrganization(mockOrganization)
    setLoading(false)
  }, [])

  const tabs = [
    { id: 'profile', name: 'Profile', icon: '👤' },
    { id: 'organization', name: 'Organization', icon: '🏢' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'security', name: 'Security', icon: '🔒' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-300 rounded"></div>
              </div>
              <div className="lg:col-span-3">
                <div className="h-96 bg-gray-300 rounded"></div>
              </div>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account, organization, and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-accent text-primary'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Picture
                      </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-primary font-semibold text-xl">
                          {user?.name?.charAt(0)}
                        </div>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                          Change Photo
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="bg-accent text-primary px-6 py-2 rounded-lg font-semibold hover:bg-accent-light transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Organization Tab */}
              {activeTab === 'organization' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Organization Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        defaultValue={organization?.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Slug
                      </label>
                      <input
                        type="text"
                        defaultValue={organization?.slug}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The organization slug cannot be changed once set
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <button className="bg-accent text-primary px-6 py-2 rounded-lg font-semibold hover:bg-accent-light transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-accent">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Slack Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications in Slack</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                        <p className="text-sm text-gray-500">Receive weekly monitoring reports</p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-accent">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                      </button>
                    </div>

                    <div className="flex justify-end">
                      <button className="bg-accent text-primary px-6 py-2 rounded-lg font-semibold hover:bg-accent-light transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button className="bg-accent text-primary px-6 py-2 rounded-lg font-semibold hover:bg-accent-light transition-colors">
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent-light transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Danger Zone</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-red-800 mb-2">Delete Account</h4>
                        <p className="text-sm text-red-600 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 