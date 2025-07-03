import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
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
                href="/demo" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors"
              >
                View Demo
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

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Monitoring?</h2>
          <p className="text-xl mb-8 text-gray-200">
            Join thousands of developers who trust Vigil to keep their services running smoothly.
          </p>
          <Link 
            href="/register" 
            className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent-light transition-colors inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
} 