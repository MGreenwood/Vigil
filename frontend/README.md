# Vigil Frontend

A modern, responsive web interface for the Vigil monitoring platform built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Pages
- **Dashboard** (`/dashboard`) - Overview of monitoring status, stats, and recent activity
- **Monitors** (`/monitors`) - Manage HTTP, SSL, and webhook monitors
- **Alerts** (`/alerts`) - View and manage alerts with filtering and search
- **Notifications** (`/notifications`) - Configure notification channels
- **Settings** (`/settings`) - User profile, organization, and security settings

### Key Components
- **Navigation** - Responsive navigation with mobile menu
- **Monitor Management** - Add, edit, and delete monitors with comprehensive forms
- **Alert Management** - Acknowledge and resolve alerts
- **Real-time Status** - Visual indicators for monitor health
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)
- **API Integration**: Custom API service with fetch
- **Icons**: Emoji icons (can be replaced with heroicons or similar)

## 📁 Project Structure

```
frontend/
├── app/
│   ├── components/
│   │   └── Navigation.tsx          # Main navigation component
│   ├── lib/
│   │   └── api.ts                  # API service and types
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard overview
│   ├── monitors/
│   │   ├── page.tsx                # Monitors list
│   │   └── new/
│   │       └── page.tsx            # Add new monitor form
│   ├── alerts/
│   │   └── page.tsx                # Alerts management
│   ├── notifications/
│   │   └── page.tsx                # Notification channels
│   ├── settings/
│   │   └── page.tsx                # User settings
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🎨 Design System

### Colors
- **Primary**: Deep Navy `#0C1B33`
- **Accent**: Amber `#FFB300`
- **Neutral**: Soft Gray `#F4F5F7`
- **Success**: Green `#38A169`
- **Warning**: Yellow `#D69E2E`
- **Error**: Red `#E53E3E`

### Components
- **Cards**: White background with shadow and rounded corners
- **Buttons**: Primary (accent background), Secondary (outline), Danger (red)
- **Status Indicators**: Color-coded badges for monitor and alert status
- **Forms**: Clean inputs with focus states and validation

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd frontend
npm install
```

### Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Building for Production
```bash
npm run build
npm start
```

### Docker
```bash
docker build -t vigil-frontend .
docker run -p 3000:3000 vigil-frontend
```

## 🔌 API Integration

The frontend is designed to work with the Vigil Go backend. The API service (`app/lib/api.ts`) provides:

### Authentication
- Login/Register
- JWT token management
- Profile management

### Monitors
- CRUD operations for HTTP, SSL, and webhook monitors
- Status tracking and uptime statistics

### Alerts
- View and manage alerts
- Acknowledge and resolve alerts
- Filtering by status and severity

### Notifications
- Configure email, Slack, Discord, and webhook channels
- Channel management and testing

### Dashboard
- Real-time statistics
- Recent activity feeds
- Quick actions

## 🎯 Current Status

### ✅ Implemented
- Complete UI for all core pages
- Responsive navigation
- Monitor management forms
- Alert management interface
- Settings pages with tabs
- API service layer
- TypeScript types
- Mock data for development

### 🔄 Next Steps
1. **API Integration** - Replace mock data with real API calls
2. **Authentication** - Add login/register pages and auth flow
3. **Real-time Updates** - WebSocket integration for live status
4. **Charts & Analytics** - Add monitoring charts and trends
5. **Advanced Features** - Custom health checks, escalation rules
6. **Testing** - Unit and integration tests
7. **Performance** - Optimize loading and bundle size

## 🚀 Deployment

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080  # Backend API URL
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Frontend URL
```

### Docker Compose
The frontend is included in the main `docker-compose.yml` and will be available at `http://localhost:3000` when running the full stack.

## 📱 Responsive Design

The interface is fully responsive with:
- **Desktop**: Full navigation bar, side-by-side layouts
- **Tablet**: Collapsible navigation, adjusted grid layouts
- **Mobile**: Hamburger menu, stacked layouts, touch-friendly buttons

## 🎨 Customization

### Styling
- Colors and spacing are defined in `tailwind.config.js`
- Component styles use Tailwind utility classes
- Custom CSS can be added to `globals.css`

### Components
- All components are modular and reusable
- Props interfaces are defined for TypeScript support
- Components follow consistent patterns and naming

### Adding New Pages
1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Import and use the `Navigation` component
4. Follow the existing layout patterns
5. Add the page to the navigation in `Navigation.tsx`

## 🤝 Contributing

1. Follow the existing code patterns and TypeScript conventions
2. Use Tailwind CSS for styling
3. Add proper TypeScript interfaces for new data types
4. Include loading states and error handling
5. Test on different screen sizes

## 📄 License

This frontend is part of the Vigil monitoring platform. See the main project license for details. 