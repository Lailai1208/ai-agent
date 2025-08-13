# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Project Overview**: AI Agent application with Next.js frontend, FastAPI backend, and integrated Memory Bank system for rapid iteration development using adapted SPARC methodology.

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

### Documentation & Project Management
- The `docs/` directory is the single source of truth for all **formal project documentation**.
- The `memory-bank/` directory serves as the **dynamic development knowledge base** for iterative learning and task coordination.

**Documentation Hierarchy**:
- **`docs/`**: Stable, formal documentation (API specs, deployment guides, contribution rules)
- **`memory-bank/`**: Dynamic development memory (decisions, experiments, active tasks, failures)

**SPARC Methodology Integration**:
This project follows an adapted SPARC (Specification, Pseudocode, Architecture, Refinement, Completion) methodology optimized for rapid iteration:
- **Lightweight Specification**: Core features documented in `memory-bank/tasks/`
- **Iterative Architecture**: Key decisions tracked in `memory-bank/knowledge/architectural-decisions/`
- **Continuous Refinement**: Issues and solutions captured in `memory-bank/logs/`
- **Knowledge Completion**: Reusable patterns stored in `memory-bank/knowledge/code-patterns/`

### Memory Bank Slash Commands

Claude Code provides custom slash commands for Memory Bank operations:

**Daily Development**:
- `/mb-status` - Comprehensive project status overview
- `/mb-tasks [action]` - Interactive task management (list, add, complete, prioritize)
- `/mb-log-issue [title]` - Guided issue documentation with context analysis

**Knowledge Management**:
- `/mb-save-pattern [type]` - Extract reusable code patterns from selected code
- `/mb-log-decision [title]` - Record architectural decisions (quick or formal ADR)
- `/mb-search [query]` - Search memory bank for relevant information

**Analysis & Planning**:
- `/mb-review-sprint` - Sprint retrospective with insights and recommendations
- `/mb-help [command]` - Display help for Memory Bank commands

**Quick Usage Examples**:
```bash
/mb-status                          # Daily startup routine
/mb-log-issue "CORS API timeout"    # Log specific issue
/mb-save-pattern hook              # Save selected code as hook pattern
/mb-tasks add                      # Add new task to current sprint
/mb-search "API error handling"    # Search for related knowledge
/mb-review-sprint                  # End-of-sprint retrospective
/mb-help                           # Show all available commands
```

**Getting Help**:
- `/mb-help` - Overview of all Memory Bank commands
- `/mb-help [command]` - Help for specific command
- `[command] help` - Alternative help syntax (e.g., `/mb-status help`)

**Daily Memory Bank Workflow**:
1. **Start of day**: `/mb-status` - Review current project state and priorities
2. **During development**: 
   - `/mb-log-issue [title]` - Document problems as they arise
   - `/mb-save-pattern [type]` - Capture useful code patterns
   - `/mb-log-decision [title]` - Record important technical decisions
3. **Task management**: `/mb-tasks [action]` - Track and update sprint progress
4. **Knowledge search**: `/mb-search [query]` - Find relevant past solutions
5. **Sprint end**: `/mb-review-sprint` - Analyze progress and plan improvements

**Memory Bank Integration**:
- Commands automatically read/write to appropriate memory-bank files
- AI provides context analysis based on historical data
- Pattern recognition helps avoid repeated issues and promotes code reuse


## Project Status
Currently in Phase 3 (Frontend-Backend Integration) with working API communication between Next.js frontend and FastAPI backend. AI model endpoints (NVIDIA NIM) are functional with proper request validation and error handling.

**Memory Bank System**: ✅ **Active**
- Dynamic development knowledge base established in `memory-bank/`
- 8 custom slash commands implemented for efficient workflow
- Integration with SPARC methodology for rapid iteration development
- Automated knowledge capture and pattern recognition ready

**Active Memory Bank Status**: Use `/mb-status` for current project overview and `/mb-help` for command guidance.