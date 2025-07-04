import Link from 'next/link'
import InterestSignupForm from './components/InterestSignupForm'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 py-20">
                  <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Vigil Logo"
              width={120}
              height={120}
              className="rounded-lg"
              priority
            />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            Vigil: Keep Watch Over Your SaaS
          </h1>
            <p className="text-xl mb-8 text-gray-200">
              Downtime, webhook failures, and SSL expirations can cost you customers. 
              Vigil monitors your endpoints, APIs, and certificates, alerting you instantly 
              via Slack, Discord, or email—so you can serve your customers better, even while you sleep.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/dashboard" 
                className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors"
              >
                Start Watching Now
              </Link>
              <Link 
                href="/monitors" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                View Monitors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Vigil Monitors</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">APIs & Endpoints</h3>
              <p className="text-gray-600">
                Monitor HTTP/HTTPS endpoints with response time tracking and custom status code validation.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">SSL Certificates</h3>
              <p className="text-gray-600">
                Get alerts before your SSL certificates expire, preventing security warnings.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Webhook Delivery</h3>
              <p className="text-gray-600">
                Track webhook success rates with automatic retry mechanisms and failure alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neutral">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Monitors</h3>
              <p className="text-gray-600">
                Configure endpoints, APIs, or webhooks you want to monitor with custom intervals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Vigil Watches</h3>
              <p className="text-gray-600">
                Our monitoring engine continuously checks your services and tracks performance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Instant Alerts</h3>
              <p className="text-gray-600">
                Receive immediate notifications via Slack, Discord, or email when issues are detected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interest List Signup Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Be First to Know When We Launch</h2>
          <p className="text-xl mb-8 text-gray-200">
            Join our interest list and get early access, exclusive updates, and special pricing when Vigil goes live.
          </p>
          
          <div className="max-w-md mx-auto">
            <InterestSignupForm />
          </div>
          
          <p className="text-sm text-gray-300 mt-6">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">👁️</span>
                <span className="text-xl font-bold">Vigil</span>
              </div>
              <p className="text-gray-400 mb-4">
                Keep watch over your SaaS infrastructure with reliable monitoring and instant alerts.
              </p>
              <p className="text-gray-400">
                Need help? Contact us at{' '}
                <a href="mailto:support@vigil.rest" className="text-accent hover:text-accent-light">
                  support@vigil.rest
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/monitors" className="hover:text-white transition-colors">Monitors</a></li>
                <li><a href="/alerts" className="hover:text-white transition-colors">Alerts</a></li>
                <li><a href="/notifications" className="hover:text-white transition-colors">Notifications</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:support@vigil.rest" className="hover:text-white transition-colors">Contact Support</a></li>
                <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/api" className="hover:text-white transition-colors">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a 
                    href="https://bsky.app/profile/vigilofficial.bsky.social" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">🔵</span>
                    Bluesky
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/MGreenwood/vigil" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2">🐙</span>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Vigil. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 