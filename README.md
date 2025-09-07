# Kisan Express

A hackathon-ready AI-Based Farmer Query Support and Advisory System built with modern web technologies.

![Kisan Express](https://via.placeholder.com/800x400/22c55e/ffffff?text=Kissan+Express)

## 🌾 Problem Statement

**SIH Problem**: AI-Based Farmer Query Support and Advisory System

Empowering farmers with AI-driven agricultural advice, real-time alerts, and expert guidance to bridge the knowledge gap in Indian agriculture through technology.

## 🚀 Tech Stack

- **Frontend**: Vite + React 18 + TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Routing**: React Router 6 with lazy loading + Suspense
- **State Management**: Zustand
- **Forms**: react-hook-form + Zod validation
- **API Mocking**: MSW (Mock Service Worker)
- **Icons**: Lucide React
- **Build Tool**: Vite

## ✨ Features

### Core Functionality
- 🤖 **AI-Powered Query System**: Text, image, and voice query support
- 👨‍🌾 **Expert Advisory**: Professional agricultural guidance
- 🚨 **Real-time Alerts**: Weather, pest, and disease notifications
- 📋 **Government Schemes**: Access to subsidies and programs
- 📊 **Officer Dashboard**: Query management for agricultural officers

### Technical Features
- 🎨 **Custom Earthy Design**: Agricultural-themed color palette
- 📱 **Fully Responsive**: Mobile-first design approach
- ♿ **Accessibility**: WCAG compliant with skip links and focus management
- 🔄 **Lazy Loading**: Optimized performance with code splitting
- 🧪 **Type Safe**: Full TypeScript implementation
- 🎯 **Form Validation**: Robust validation with Zod schemas

## 📁 Project Structure

```
client/
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── Layout.tsx          # Main layout wrapper
├── pages/
│   ├── Home.tsx           # Landing page with hero
│   ├── AskQuery.tsx       # Query submission form
│   ├── Advisory.tsx       # Query results & feedback
│   ├── Alerts.tsx         # District-based alerts
│   ├── Schemes.tsx        # Government schemes
│   ├── Dashboard.tsx      # Officer dashboard
│   ├── About.tsx          # Team & project info
│   └── NotFound.tsx       # 404 page
├── store/
│   └── farmerStore.ts     # Zustand state management
├── lib/
│   ├── validation/        # Zod schemas
│   ├── mocks/            # MSW API handlers
│   └── utils.ts          # Utility functions
├── App.tsx               # Main app with routing
└── global.css           # Global styles & variables
```

## 🛠️ Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Type checking
pnpm typecheck
```

### Development Server

The app runs on `http://localhost:8080` with:
- ⚡ Hot reload for both client and server
- 🔄 MSW for API mocking
- 🎨 Live CSS updates
- 📱 Mobile-responsive preview

## 🎯 Key Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Hero section, features, CTAs |
| `/query` | AskQuery | Multi-modal query submission |
| `/advisory/:id` | Advisory | Query results & feedback form |
| `/alerts` | Alerts | Location-based alerts |
| `/schemes` | Schemes | Government scheme listings |
| `/dashboard` | Dashboard | Officer query management |
| `/about` | About | Team & project information |

## 🔧 Configuration

### Environment Variables

```bash
# Development
VITE_API_URL=http://localhost:8080/api
VITE_ENV=development

# Production (set via deployment platform)
VITE_API_URL=https://your-api-domain.com
VITE_ENV=production
```

### Tailwind Theme

Custom agricultural color palette:
- **Forest**: Primary greens (#065f46 to #ecfdf5)
- **Wheat**: Golden yellows (#92400e to #fefce8)
- **Harvest**: Warm oranges (#9a3412 to #fff7ed)
- **Earth**: Rich browns (#78350f to #fef3c7)

## 📱 Responsive Design

Breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+
- **Large**: 1280px+

## 🧪 API Endpoints (Mocked)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/query` | Submit farmer query |
| `GET` | `/api/query/:id` | Get query details |
| `GET` | `/api/advisory/:queryId` | Get advisory response |
| `GET` | `/api/alerts` | Get location alerts |
| `GET` | `/api/schemes` | Get government schemes |
| `POST` | `/api/feedback` | Submit feedback |
| `GET` | `/api/dashboard/queries` | Get escalated queries |

## 🎨 Design System

### Components
- **Buttons**: Primary, secondary, outline variants
- **Cards**: Elevated content containers
- **Forms**: Input, textarea, select with validation
- **Navigation**: Responsive header with mobile menu
- **Alerts**: Contextual status messages
- **Badges**: Category and status indicators

### Typography
- **Font**: Inter (Google Fonts)
- **Sizes**: 12px - 48px scale
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

## ♿ Accessibility Features

- ✅ Skip to main content link
- ✅ Keyboard navigation support
- ✅ Focus visible indicators
- ✅ Semantic HTML structure
- ✅ Alt text for images
- ✅ ARIA labels and descriptions
- ✅ Color contrast compliance

## 🔄 State Management

### Zustand Store Structure

```typescript
interface FarmerState {
  // Profile management
  profile: FarmerProfile | null;
  setProfile: (profile: FarmerProfile) => void;
  
  // Query management
  queries: Query[];
  addQuery: (query: Omit<Query, 'id'>) => void;
  
  // Alerts & schemes
  alerts: Alert[];
  schemes: Scheme[];
}
```

## 📋 Form Validation

Zod schemas for:
- ✅ Farmer profile validation
- ✅ Query submission
- ✅ File upload constraints
- ✅ Feedback forms
- ✅ Search and filters

## 🚀 Deployment

### Build Process

```bash
# Production build
pnpm build

# Preview build locally
pnpm preview
```

### Deployment Options

1. **Netlify**: Connect GitHub repo and deploy
2. **Vercel**: Import project and configure
3. **Traditional hosting**: Upload `dist/` folder

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Agricultural Expert**: Dr. Priya Sharma
- **Lead Developer**: Rajesh Kumar
- **Soil Specialist**: Dr. Meera Joshi
- **Product Manager**: Arjun Patil

## 🎯 Hackathon Ready

This project is fully functional and hackathon-ready with:
- ✅ Complete UI/UX implementation
- ✅ Working forms and validation
- ✅ Responsive design
- ✅ API integration (mocked)
- ✅ State management
- ✅ Modern tech stack
- ✅ Production build ready
- ✅ Documentation complete

---

**Built with ❤️ for Indian farmers**
