# AI Agent Project Configuration

## Environment Setup

### Required Tools
- Node.js (v18+)
- Python (3.10+)
- uv (Python package manager)
- Git

### Development Ports
- Frontend: 3000
- Backend: 8000

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME="AI Agent"
```

### Backend (.env)
```
# Application Settings
ENVIRONMENT=development
DEBUG=true

# AI Model Configuration
OLLAMA_API_BASE=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2:7b
OLLAMA_CONTEXT_LENGTH=8192

# NVIDIA NIM API
NIM_DEEPSEEK_R1_API=your_api_key_here

# CORS Settings
ALLOWED_HOSTS=http://localhost:3000,http://127.0.0.1:3000

# Database (Future)
DATABASE_URL=sqlite:///./ai_agent.db
```

## Development Commands

### Quick Start
```bash
# Start both frontend and backend
./dev-start.sh

# Or start individually:
cd backend && ./start.sh
cd frontend-nextjs && npm run dev
```

### Code Quality
```bash
# Frontend
cd frontend-nextjs
npm run lint
npm run type-check
npm run format

# Backend
cd backend
uv run python -m black .
uv run python -m isort .
```

## Project Structure Guidelines

### Frontend
- Use feature-based component organization
- Implement proper TypeScript types
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Implement proper error boundaries

### Backend
- Follow FastAPI best practices
- Use proper HTTP status codes
- Implement request/response models
- Add proper error handling
- Use dependency injection where appropriate

## Git Workflow

1. Create feature branch from main
2. Make changes with clear commit messages
3. Run tests and linting
4. Create pull request
5. Code review and merge

## Testing Strategy

### Frontend
- Unit tests with Jest/React Testing Library
- Integration tests for components
- E2E tests with Playwright

### Backend
- Unit tests with pytest
- API integration tests
- Load testing for AI endpoints

## Performance Considerations

### Frontend
- Code splitting with Next.js
- Image optimization
- Bundle size monitoring
- Caching strategies

### Backend
- Database query optimization
- Caching for AI responses
- Rate limiting
- Background task processing
