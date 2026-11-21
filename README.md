# SpectrumAI — Autism Care Platform

[![CI](https://github.com/aryaminakshi71/autism/actions/workflows/ci.yml/badge.svg)](https://github.com/aryaminakshi71/autism/actions/workflows/ci.yml)

A unified autism care platform for clinics, therapists, schools, families, and insurers — with AI on the intake and clinical sides.

## AI features

- AI lead scoring with reasoning and factors
- AI email suggestions (follow-up, intro, proposal, meeting request)
- AI meeting/session summaries
- AI contact enrichment

## Quick start

```bash
bun install
cp .env.example .env   # fill DATABASE_URL, BETTER_AUTH_SECRET, OPENAI_API_KEY
bun run dev            # web on :3080, API on :8787
```

## ✨ Features

- **Patient Management** - Comprehensive client/patient records with diagnosis, preferences, and care history
- **Goal Tracking (ABA)** - Create and track ABA therapy goals with progress monitoring
- **Session Management** - Schedule and document therapy sessions with detailed notes
- **Visual Schedules** - Build daily routines and visual supports for individuals with autism
- **AAC Communication Tools** - Create and manage communication boards and symbol cards
- **Assessment Tools** - Track screening tools (M-CHAT-R/F) and assessments (ADOS-2, VB-MAPP, CARS-2)
  - Supports multiple assessment types with customizable scoring
  - Track assessment history and progress over time
  - Generate recommendations based on results
  - Schedule follow-up assessments automatically
- **Parent Resources** - Training materials and educational resources for families
- **Role-Based Access** - Support for therapists, parents, and administrators
- **Real-time Dashboard** - Analytics with period-over-period comparisons

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

# Build with bundle analysis
bun run build:analyze
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
# Run unit tests
bun run test

# Run E2E tests
bun run test:e2e

# Run E2E smoke tests only
bun run test:e2e:smoke

# Run E2E tests with UI
bun run test:e2e:ui

# Run health check
bun run health
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - System health status with database and cache checks

### Assessment Management
- `GET /api/rpc/assessments.list` - List all assessments
- `GET /api/rpc/assessments.get` - Get single assessment
- `POST /api/rpc/assessments.create` - Create new assessment
- `PATCH /api/rpc/assessments.update` - Update assessment
- `DELETE /api/rpc/assessments.delete` - Delete assessment

Supported assessment types:
- ADOS-2 (Autism Diagnostic Observation Schedule)
- VB-MAPP (Verbal Behavior Milestones Assessment)
- CARS-2 (Childhood Autism Rating Scale)
- M-CHAT-R/F (Modified Checklist for Autism in Toddlers)

### Data Collection System
- `GET /api/rpc/dataCollectionTemplates.list` - List ABA data collection templates
- `GET /api/rpc/dataCollectionTemplates.get` - Get template details
- `POST /api/rpc/dataCollectionTemplates.create` - Create custom template
- `GET /api/rpc/dataCollectionSheets.list` - List data collection sheets
- `POST /api/rpc/dataCollectionSheets.create` - Create new data collection sheet
- `POST /api/rpc/dataCollectionSheets.addEntry` - Add data entry to sheet
- `POST /api/rpc/dataCollectionSheets.complete` - Complete data collection
- `GET /api/rpc/dataCollectionSheets.getStats` - Get data collection statistics

Built-in templates:
- Discrete Trial Training (DTT)
- Task Analysis
- Frequency Recording
- Duration Recording
- Latency Recording
- Partial/Whole Interval Recording
- Momentary Time Sampling

### Reports & Analytics
- `POST /api/rpc/reports.generateSessionSummary` - Generate session summary report
- `POST /api/rpc/reports.generateProgressReport` - Generate progress report (weekly/monthly)
- `POST /api/rpc/reports.generateAssessmentReport` - Generate assessment report
- `POST /api/rpc/reports.generateParentReport` - Generate parent-friendly report
- `GET /api/rpc/reports.list` - List generated reports

Report types:
- Session summaries with goal progress and behavior tracking
- Progress reports with trend analysis and skill acquisition
- Assessment reports (ADOS-2, VB-MAPP, CARS-2, M-CHAT-R/F)
- Parent-friendly reports with simplified language and visuals

### Parent Portal
- `GET /api/rpc/parentPortal.listNotes` - List parent session notes
- `POST /api/rpc/parentPortal.createNote` - Create session note for parents
- `POST /api/rpc/parentPortal.acknowledgeNote` - Acknowledge parent note
- `GET /api/rpc/parentPortal.listMessages` - List parent messages
- `POST /api/rpc/parentPortal.sendMessage` - Send message to parent
- `POST /api/rpc/parentPortal.markMessageRead` - Mark message as read
- `GET /api/rpc/parentPortal.getHomeActivities` - Get recommended home activities
- `GET /api/rpc/parentPortal.getDashboardStats` - Get parent dashboard statistics

Parent portal features:
- Daily session notes with photos and home practice suggestions
- Secure messaging with therapy team
- Home activity recommendations
- Progress visualization with celebrations
- Resource library with curated content

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
