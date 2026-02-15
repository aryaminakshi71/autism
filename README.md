# Autism Care Platform

A unified autism care and ecosystem platform for clinics, therapists, schools, families, and insurers.

## ✨ Features

- **Patient Management** - Comprehensive client/patient records with diagnosis, preferences, and care history
- **Goal Tracking (ABA)** - Create and track ABA therapy goals with progress monitoring
- **Session Management** - Schedule and document therapy sessions with detailed notes
- **Visual Schedules** - Build daily routines and visual supports for individuals with autism
- **AAC Communication Tools** - Create and manage communication boards and symbol cards
- **Assessment Tools** - Track screening tools (M-CHAT) and assessments (ADOS-2, VB-MAPP, CARS-2)
- **Parent Resources** - Training materials and educational resources for families
- **Role-Based Access** - Support for therapists, parents, and administrators

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ or Bun 1.3+
- PostgreSQL database
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/aryaminakshi71/autism-platform.git
cd autism-legacy-20260205

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
bun run db:migrate

# Start development server
bun run dev
```

## 📚 Tech Stack

- **Frontend**: React with TanStack Router
- **Backend**: Hono API with oRPC (Cloudflare Workers)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth
- **Storage**: Cloudflare R2
- **Caching**: Cloudflare KV
- **Deployment**: Cloudflare Pages + Workers
- **Package Manager**: Bun

## 🏗️ Project Structure

```
autism-legacy-20260205/
├── apps/
│   ├── web/          # Frontend application
│   └── api/          # Backend API (Cloudflare Workers)
├── packages/         # Shared packages
│   ├── auth/         # Authentication package
│   ├── storage/      # Database package
│   ├── core/         # Core utilities
│   └── logger/       # Logging package
└── ...
```

## 🔧 Development

```bash
# Run development server
bun run dev

# Run type checking
bun run typecheck

# Run linter
bun run lint

# Format code
bun run format

# Run database migrations
bun run db:migrate

# Open database studio
bun run db:studio
```

## 📦 Deployment

### Cloudflare Pages (Frontend)

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - Build command: `bun run build --filter=@autism-legacy-20260205/web`
   - Output directory: `apps/web/dist`
3. Add environment variables in Cloudflare dashboard

### Cloudflare Workers (Backend)

The API is automatically deployed via GitHub Actions when you push to `main` branch.

**Required GitHub Secrets:**
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

The API uses:
- Cloudflare R2 for file storage
- Cloudflare KV for caching
- Hyperdrive for PostgreSQL connection

## 📝 Environment Variables

See `.env.example` for required environment variables.

**Important:** The app supports demo mode via `x-demo-mode` header for testing purposes. When demo mode is enabled, a mock authentication context is created with a demo user. This is intentional for demonstration purposes and uses a placeholder token (`demo-token`) that should not be used in production.

## 🧪 Testing

```bash
# Run E2E tests
bun run test:links

# Run E2E tests with UI
bun run test:links:ui
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- Documentation: update with your product wiki or docs site

## 👤 Author

Arya Labs

---

Made with ❤️ by Arya Labs
