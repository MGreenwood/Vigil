'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface NavigationItem {
  name: string
  href: string
  icon: string
  description: string
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    description: 'Overview of your monitoring status'
  },
  {
    name: 'Monitors',
    href: '/monitors',
    icon: '📡',
    description: 'Manage your monitoring endpoints'
  },
  {
    name: 'Alerts',
    href: '/alerts',
    icon: '🔔',
    description: 'View and manage alerts'
  },
  {
    name: 'Notifications',
    href: '/notifications',
    icon: '📧',
    description: 'Configure notification channels'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: '⚙️',
    description: 'Account and organization settings'
  }
]

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <Image
                  src="/logo.png"
                  alt="Vigil Logo"
                  width={32}
                  height={32}
                  className="rounded"
                />
                <span className="text-xl font-bold text-primary">Vigil</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'border-accent text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - User menu and mobile menu button */}
          <div className="flex items-center">
            {/* User menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary transition-colors">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary font-semibold">
                    JD
                  </div>
                  <span>John Doe</span>
                  <span>▼</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <span className="text-xl">✕</span>
                ) : (
                  <span className="text-xl">☰</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-accent border-accent text-primary'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <span className="mr-3">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Mobile user menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary font-semibold">
                  JD
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">John Doe</div>
                <div className="text-sm font-medium text-gray-500">john@example.com</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => {
                  // TODO: Handle logout
                  setMobileMenuOpen(false)
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 