// API service for communicating with the Vigil backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

class ApiService {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add auth token if available
    const token = this.getAuthToken()
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`
    }

    const config: RequestInit = {
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.message || `HTTP ${response.status}: ${response.statusText}`,
        }
      }

      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token')
    }
    return null
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  // Monitors
  async getMonitors() {
    return this.request<any[]>('/monitors')
  }

  async getMonitor(id: string) {
    return this.request<any>(`/monitors/${id}`)
  }

  async createMonitor(monitor: any) {
    return this.request<any>('/monitors', {
      method: 'POST',
      body: JSON.stringify(monitor),
    })
  }

  async updateMonitor(id: string, monitor: any) {
    return this.request<any>(`/monitors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(monitor),
    })
  }

  async deleteMonitor(id: string) {
    return this.request<void>(`/monitors/${id}`, {
      method: 'DELETE',
    })
  }

  // Alerts
  async getAlerts() {
    return this.request<any[]>('/alerts')
  }

  async getAlert(id: string) {
    return this.request<any>(`/alerts/${id}`)
  }

  async acknowledgeAlert(id: string) {
    return this.request<any>(`/alerts/${id}/acknowledge`, {
      method: 'POST',
    })
  }

  async resolveAlert(id: string) {
    return this.request<any>(`/alerts/${id}/resolve`, {
      method: 'POST',
    })
  }

  // Dashboard
  async getDashboardStats() {
    return this.request<any>('/dashboard/stats')
  }

  async getDashboardMonitors() {
    return this.request<any[]>('/dashboard/monitors')
  }

  async getDashboardAlerts() {
    return this.request<any[]>('/dashboard/alerts')
  }

  // Notifications
  async getNotificationChannels() {
    return this.request<any[]>('/notifications/channels')
  }

  async createNotificationChannel(channel: any) {
    return this.request<any>('/notifications/channels', {
      method: 'POST',
      body: JSON.stringify(channel),
    })
  }

  async updateNotificationChannel(id: string, channel: any) {
    return this.request<any>(`/notifications/channels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(channel),
    })
  }

  async deleteNotificationChannel(id: string) {
    return this.request<void>(`/notifications/channels/${id}`, {
      method: 'DELETE',
    })
  }

  // Organizations
  async getOrganization() {
    return this.request<any>('/organizations/current')
  }

  async updateOrganization(organization: any) {
    return this.request<any>('/organizations/current', {
      method: 'PUT',
      body: JSON.stringify(organization),
    })
  }

  // User Profile
  async getUserProfile() {
    return this.request<any>('/auth/profile')
  }

  async updateUserProfile(profile: any) {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    })
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  // Webhooks
  async getWebhooks() {
    return this.request<any[]>('/webhooks')
  }

  async getWebhook(id: string) {
    return this.request<any>(`/webhooks/${id}`)
  }

  async createWebhook(webhook: any) {
    return this.request<any>('/webhooks', {
      method: 'POST',
      body: JSON.stringify(webhook),
    })
  }

  async updateWebhook(id: string, webhook: any) {
    return this.request<any>(`/webhooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(webhook),
    })
  }

  async deleteWebhook(id: string) {
    return this.request<void>(`/webhooks/${id}`, {
      method: 'DELETE',
    })
  }

  async getWebhookDeliveries(webhookId: string) {
    return this.request<any[]>(`/webhooks/${webhookId}/deliveries`)
  }
}

// Export a singleton instance
export const api = new ApiService()

// Export types for better TypeScript support
export interface Monitor {
  id: string
  name: string
  type: 'http' | 'ssl' | 'webhook'
  url: string
  status: 'up' | 'down' | 'warning'
  interval: number
  timeout: number
  expectedStatus: number
  customHeaders?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Alert {
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

export interface NotificationChannel {
  id: string
  name: string
  type: 'email' | 'slack' | 'discord' | 'webhook'
  config: any
  isActive: boolean
  createdAt: string
  lastUsed?: string
}

export interface DashboardStats {
  totalMonitors: number
  activeMonitors: number
  downMonitors: number
  overallUptime: number
  totalAlerts: number
  pendingAlerts: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
} 