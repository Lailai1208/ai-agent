# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Quick Start
```bash
# Initial setup (first time only)
./setup.sh

# Start both frontend and backend
./dev-start.sh
# OR
npm run dev

# Individual services
npm run dev:frontend    # Next.js on :3000
npm run dev:backend     # FastAPI on :8000

# Health verification
./health-check.sh
```

### Frontend Commands (frontend-nextjs/)
```bash
npm run dev            # Start with Turbopack
npm run build          # Production build
npm run lint           # ESLint check
npm run lint:fix       # Auto-fix linting issues
npm run type-check     # TypeScript validation
npm run format         # Prettier formatting
```

### Backend Commands (backend/)
```bash
./start.sh                           # Start FastAPI with uv
uv pip install -r requirements.txt   # Install dependencies
```

### Common Testing/Verification
```bash
# API Documentation
http://localhost:8000/docs

# Health endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/health
```

## Architecture Overview

### Full-Stack Structure
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Mantine UI
- **Backend**: FastAPI + Python + uv package manager
- **AI Integration**: Ollama (local) + NVIDIA NIM (cloud)
- **State Management**: React Context + TanStack Query

### Key Architectural Patterns

**Frontend Architecture (frontend-nextjs/src/)**:
```
app/                    # Next.js App Router
├── layout.tsx          # Root layout with providers
├── providers.tsx       # Context + Query client setup
└── page.tsx           # Homepage

components/
├── features/          # Feature-specific (HomePage/, Integration/)
├── common/           # Shared components
└── ui/              # Reusable UI (JsonViewer, StatusBadge)

lib/api/              # Centralized API client
├── client.ts         # HTTP client with timeouts
└── endpoints.ts      # Typed API endpoints

services/             # Business logic layer
context/              # React Context providers
types/               # TypeScript definitions
```

**Backend Architecture (backend/)**:
```
app/
├── api/v1/
│   ├── api.py           # Main API router
│   └── endpoints/       # Individual endpoint modules
└── core/
    ├── config.py        # Pydantic settings
    └── ai_models.py     # AI provider utilities
```

### AI Model Integration
- **NVIDIA NIM**: Cloud-based DeepSeek-R1 via `/api/v1/ai/chat/nvidia`
- **Ollama**: Local models via `/api/v1/ai/chat/ollama`
- **Request Format**: `{message, model?, temperature?, max_tokens?}`
- **Timeouts**: 120s for AI endpoints, 60s for others

### Configuration System
**Environment Variables**:
- Frontend: `NEXT_PUBLIC_BACKEND_URL=http://localhost:8000`
- Backend: `NIM_DEEPSEEK_R1_API`, `OLLAMA_API_BASE`, `OLLAMA_MODEL`

**Config Files**:
- Root: `.env-example` (project-wide)
- Frontend: `frontend-nextjs/.env.local-example`
- Backend: `backend/.env-example`

### Development Workflow Patterns

**State Management**: 
- Global state via React Context (`AppContext`)
- Server state via TanStack Query
- Local storage via custom hooks (`useLocalStorage`)

**API Communication**:
- Centralized client in `lib/api/client.ts`
- Type-safe endpoints in `lib/api/endpoints.ts`
- Service layer in `services/backendService.ts`

**Error Handling**:
- Frontend: Comprehensive error boundaries and user-friendly messages
- Backend: Proper HTTP status codes with detailed error responses
- Integration: Request/response logging for debugging

## Important Development Notes

### Package Management
- Frontend: npm with standard package.json
- Backend: uv (modern Python package manager) instead of pip

### Code Organization
- Feature-based component structure over generic folders
- Centralized API client with consistent error handling
- Environment-based configuration with Pydantic validation

### Development Standards
- TypeScript strict mode with path mapping (`@/*` aliases)
- ESLint + Prettier for code quality
- Conventional Commits for git messages
- Husky git hooks for pre-commit checks

### Testing Strategy
- Integration tests via health check endpoints
- Manual API testing with comprehensive logging
- Frontend error boundaries for graceful failure handling

## Project Status
Currently in Phase 3 (Frontend-Backend Integration) with working API communication between Next.js frontend and FastAPI backend. AI model endpoints (NVIDIA NIM) are functional with proper request validation and error handling.