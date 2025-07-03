# Vigil: SaaS Monitoring Platform - Design Document

## 🎯 Product Vision

### Mission Statement
Vigil is a developer-focused monitoring platform that keeps watch over your SaaS infrastructure, alerting you to downtime, webhook failures, and SSL expirations so you can serve your customers better, even while you sleep.

### Core Value Proposition
- **Proactive Monitoring**: Catch issues before customers do
- **Developer-First**: Simple API, clean dashboard, familiar tools
- **Cost-Effective**: Credit-based model with self-hosting options
- **Reliable**: Instant alerts via Slack, Discord, or email

## 🎨 Brand & Visual Identity

### Color Palette
- **Primary**: Deep Navy `#0C1B33` - Represents seriousness, trust, and calm
- **Accent**: Amber `#FFB300` - Alert highlights, warning without harsh red
- **Neutral**: Soft Gray `#F4F5F7` - Backgrounds and subtle elements
- **White**: `#FFFFFF` - Cards and content areas
- **Text**: Dark Gray `#2D3748` - Primary text
- **Success**: Green `#38A169` - Healthy status
- **Error**: Red `#E53E3E` - Critical alerts

### Typography
- **Primary Font**: Inter (clean, modern, highly readable)
- **Fallback**: IBM Plex Sans
- **Code Font**: JetBrains Mono (for API examples and technical content)

### Logo Concept
- **Primary**: Simple eye icon representing watchfulness and monitoring
- **Alternative**: Small flame/lantern symbolizing vigilance and alertness
- **Style**: Minimalist, scalable, works in monochrome

## 🏗️ Technical Architecture

### System Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Monitoring    │
│   (React/Next)  │◄──►│   (FastAPI)     │◄──►│   Engine        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Database      │
                       │   (PostgreSQL)  │
                       └─────────────────┘
```

### Core Components

#### 1. Monitoring Engine
- **HTTP/HTTPS Endpoint Monitoring**: Status codes, response times, content validation
- **SSL Certificate Monitoring**: Expiration tracking, certificate validation
- **Webhook Delivery Tracking**: Success/failure rates, retry mechanisms
- **Custom Health Checks**: User-defined validation rules

#### 2. Alert System
- **Multi-Channel Notifications**: Slack, Discord, Email, Webhook
- **Escalation Rules**: Progressive alerting based on failure duration
- **Alert Aggregation**: Prevent notification spam
- **Custom Alert Conditions**: Thresholds, time windows, failure patterns

#### 3. Dashboard & API
- **Real-time Status Board**: Overview of all monitored services
- **Historical Data**: Uptime percentages, response time trends
- **Developer API**: RESTful endpoints for integration
- **Webhook Management**: Incoming webhook monitoring and retry logic

### Database Schema

#### Core Tables
```sql
-- Users and Organizations
users (id, email, name, created_at, subscription_tier)
organizations (id, name, owner_id, created_at)
organization_members (org_id, user_id, role)

-- Monitoring Targets
monitors (id, org_id, name, type, url, interval_seconds, timeout_seconds, 
         expected_status, custom_headers, created_at, updated_at)

-- Monitoring Results
monitor_checks (id, monitor_id, status, response_time, status_code, 
               error_message, checked_at, response_body)

-- Alerts and Notifications
alerts (id, monitor_id, type, message, severity, created_at, resolved_at)
notification_channels (id, org_id, type, config, is_active)
alert_notifications (alert_id, channel_id, sent_at, status)

-- Webhook Management
webhooks (id, org_id, name, url, secret, retry_count, timeout_seconds)
webhook_deliveries (id, webhook_id, payload, status, response_code, 
                   delivered_at, retry_count)
```

## 🎨 UI/UX Design

### Landing Page Structure

#### Hero Section
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [Logo] Vigil: Keep Watch Over Your SaaS                   │
│                                                             │
│  Downtime, webhook failures, and SSL expirations can       │
│  cost you customers. Vigil monitors your endpoints, APIs,  │
│  and certificates, alerting you instantly via Slack,       │
│  Discord, or email—so you can serve your customers         │
│  better, even while you sleep.                             │
│                                                             │
│  [Start Watching Now] [View Demo]                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Key Sections
1. **Hero** - Value proposition and primary CTA
2. **Features** - Core monitoring capabilities
3. **How It Works** - Simple 3-step process
4. **Pricing** - Transparent credit-based model
5. **Testimonials** - Social proof (future)
6. **FAQ** - Common questions
7. **Footer** - Links and contact

### Dashboard Design

#### Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Vigil                    [User Menu] [Settings]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Overview                                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ Uptime      │ │ Monitors    │ │ Alerts      │          │
│  │ 99.9%       │ │ 12 Active   │ │ 0 Pending   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  Recent Activity                                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ [Time] API Check Failed - api.example.com              │ │
│  │ [Time] SSL Certificate Expiring Soon - example.com     │ │
│  │ [Time] Webhook Delivered Successfully - payment-webhook │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Component Library

#### Buttons
- **Primary**: Deep navy background, white text, amber hover
- **Secondary**: White background, navy border and text
- **Danger**: Red background for destructive actions
- **Success**: Green background for positive actions

#### Cards
- **Status Cards**: Color-coded borders (green=healthy, red=down, yellow=warning)
- **Metric Cards**: Large numbers with descriptive labels
- **Action Cards**: Interactive elements with hover states

#### Forms
- **Input Fields**: Clean borders, focus states with amber accent
- **Validation**: Real-time feedback with helpful error messages
- **Loading States**: Skeleton screens and progress indicators

## 🚀 Implementation Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Basic FastAPI backend with PostgreSQL
- [ ] Simple monitoring engine (HTTP status checks)
- [ ] Email notifications
- [ ] Basic dashboard (React/Next.js)
- [ ] User authentication
- [ ] Landing page

### Phase 2: Core Features (Weeks 5-8)
- [ ] SSL certificate monitoring
- [ ] Webhook delivery tracking
- [ ] Slack/Discord integrations
- [ ] Alert escalation rules
- [ ] Historical data and charts
- [ ] API documentation

### Phase 3: Advanced Features (Weeks 9-12)
- [ ] Custom health checks
- [ ] Retry mechanisms for webhooks
- [ ] Advanced alerting conditions
- [ ] Team collaboration features
- [ ] Self-hosting via Cloudflare Tunnel
- [ ] Mobile-responsive design

### Phase 4: Scale & Polish (Weeks 13-16)
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] API rate limiting
- [ ] Multi-region monitoring
- [ ] Enterprise features
- [ ] Launch preparation

## 💰 Business Model

### Pricing Strategy
- **Free Tier**: 5 monitors, basic alerts, 7-day history
- **Starter**: $9/month - 25 monitors, all alert channels, 30-day history
- **Pro**: $29/month - 100 monitors, advanced features, 90-day history
- **Enterprise**: Custom pricing for large organizations

### Credit System
- **Monitoring Credits**: Each check consumes credits based on frequency
- **Webhook Credits**: Per delivery attempt
- **API Credits**: For external integrations
- **Rollover**: Unused credits carry over (with limits)

## 🔧 Technical Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Task Queue**: Celery with Redis
- **Monitoring**: Custom engine with asyncio
- **Authentication**: JWT tokens

### Frontend
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS
- **State Management**: Zustand or Redux Toolkit
- **Charts**: Chart.js or Recharts
- **Icons**: Lucide React

### Infrastructure
- **Hosting**: Vercel (frontend) + Railway/Render (backend)
- **Database**: Supabase or Railway PostgreSQL
- **Monitoring**: Self-monitoring + external uptime monitoring
- **CDN**: Cloudflare for global performance

## 📊 Success Metrics

### Product Metrics
- **Uptime**: 99.9%+ for Vigil's own services
- **Response Time**: <200ms for API endpoints
- **User Engagement**: Daily active users, feature adoption
- **Customer Satisfaction**: NPS score, support ticket volume

### Business Metrics
- **MRR Growth**: Monthly recurring revenue
- **Churn Rate**: Customer retention
- **LTV/CAC**: Customer lifetime value vs acquisition cost
- **Feature Usage**: Most/least used monitoring types

## 🎯 Go-to-Market Strategy

### Target Audience
- **Primary**: Small to medium SaaS companies
- **Secondary**: Developers and DevOps engineers
- **Tertiary**: Startups and indie hackers

### Marketing Channels
- **Content Marketing**: Technical blog posts, monitoring best practices
- **Community**: Reddit (r/SaaS, r/webdev), IndieHackers, HackerNews
- **Social Media**: Twitter, LinkedIn for developer audience
- **Partnerships**: Integration with popular developer tools

### Launch Plan
1. **Pre-launch**: Build in public, gather feedback
2. **Soft Launch**: Limited beta users, refine product
3. **Public Launch**: Product Hunt, social media campaign
4. **Growth**: Content marketing, community engagement

## 🔒 Security & Compliance

### Security Measures
- **Data Encryption**: At rest and in transit
- **API Security**: Rate limiting, authentication, input validation
- **Monitoring**: Security event logging and alerting
- **Backups**: Regular automated backups with encryption

### Compliance
- **GDPR**: Data privacy and user rights
- **SOC 2**: Security controls and procedures
- **ISO 27001**: Information security management

## 📝 Next Steps

### Immediate Actions
1. **Domain Registration**: Secure vigil.watch or alternative
2. **Technical Setup**: Initialize FastAPI project with database
3. **Design System**: Create component library and style guide
4. **Landing Page**: Build initial marketing site
5. **MVP Development**: Core monitoring functionality

### Week 1 Deliverables
- [ ] Project repository setup
- [ ] Basic FastAPI structure
- [ ] Database schema implementation
- [ ] Landing page wireframes
- [ ] Brand assets (logo, colors, typography)

---

*This design document serves as the foundation for building Vigil into a trusted, developer-focused monitoring platform. Regular updates and iterations will ensure alignment with user needs and market demands.* 