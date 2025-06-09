# AI Agent Project

A full-stack AI Agent application with Next.js frontend and FastAPI backend.

## 📁 Project Structure

```
ai-agent/
├── 📁 frontend-nextjs/          # Next.js Frontend Application
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   ├── components/          # React Components
│   │   │   ├── features/        # Feature-specific components
│   │   │   ├── common/          # Shared components
│   │   │   └── ui/              # UI components
│   │   ├── context/             # React Context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript type definitions
│   │   └── utils/               # Utility functions
│   ├── public/                  # Static assets
│   └── package.json             # Frontend dependencies
│
├── 📁 backend/                  # FastAPI Backend API
│   ├── app/
│   │   ├── api/                 # API routes
│   │   │   └── v1/              # API version 1
│   │   │       ├── endpoints/   # Individual endpoint modules
│   │   │       └── api.py       # Main API router
│   │   └── core/                # Core application logic
│   │       ├── config.py        # Application configuration
│   │       └── ai_models.py     # AI model utilities
│   ├── main.py                  # FastAPI application entry point
│   ├── requirements.txt         # Python dependencies
│   └── start.sh                 # Backend startup script
│
├── .husky/                      # Git hooks configuration
├── package.json                 # Root package.json for Husky
└── README.md                    # This file
```

## 🚀 Quick Start

## 🚀 Quick Start

### One-Command Setup
```bash
# Clone the repository and navigate to the project
git clone <repository-url>
cd ai-agent

# Run the setup script (first time only)
./setup.sh

# Start both frontend and backend
./dev-start.sh
```

### Manual Setup

#### Prerequisites
- **Node.js** (v18 or later)
- **Python** (v3.10 or later)
- **uv** (Python package manager)
- **Git**

#### 1. Frontend (Next.js)

```bash
cd frontend-nextjs
cp .env.local-example .env.local  # Copy and edit environment variables
npm install
npm run dev
```

Frontend will be available at: http://localhost:3000

#### 2. Backend (FastAPI)

```bash
cd backend
cp .env-example .env              # Copy and edit environment variables
./start.sh                        # This will setup venv and install dependencies
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs

### Development Scripts

```bash
# Root directory commands
npm run setup          # Run initial project setup
npm run dev            # Start both frontend and backend
npm run dev:frontend   # Start only frontend
npm run dev:backend    # Start only backend
npm run build          # Build the frontend
npm run lint           # Lint the frontend code

# Project health check
./health-check.sh      # Check if everything is configured correctly
```

## 🔧 Development

### Frontend Development

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Mantine UI
- **State Management**: React Context + TanStack Query
- **TypeScript**: Full type safety

### Backend Development

- **Framework**: FastAPI
- **AI Models**: 
  - Ollama (local models)
  - NVIDIA NIM (cloud models)
- **Package Manager**: uv
- **Environment**: Python virtual environment

### Key Features

- 🎨 **Theme Control**: Light/Dark mode switching
- 💾 **Local Storage**: Data persistence
- 🔔 **Notifications**: User feedback system
- 🤖 **AI Integration**: Multiple AI model support
- 📱 **Responsive Design**: Mobile-first approach

## 📊 Architecture

### Frontend Architecture

```
Components (React) → Context (State) → Services (API) → Backend
```

### Backend Architecture

```
Endpoints → API Router → Core Logic → AI Models → External APIs
```

## 🔗 Frontend-Backend Integration Guide

### Quick Integration Test

1. **Start Both Services**:
   ```bash
   ./dev-start.sh
   ```

2. **Verify Integration**:
   - Visit http://localhost:3000
   - Click "AI 模型測試" button
   - Select NVIDIA NIM or Ollama provider
   - Check response results

### Common Issues & Solutions

#### 422 Unprocessable Entity
- **Problem**: Request format missing required fields
- **Solution**: Ensure request includes `message`, `model`, `temperature`, `max_tokens`
- **Debug**: Check browser DevTools → Network tab for request payload

#### CORS Errors
- **Problem**: Cross-origin request blocked
- **Solution**: Verify backend CORS settings include frontend URL
- **Debug**: Check if backend returns 500 error (causes missing CORS headers)

#### Timeout Errors  
- **Problem**: AI model responses take time
- **Solution**: Frontend uses 120-second timeout for AI endpoints
- **Debug**: Monitor backend logs for actual processing time

### Environment Setup

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

#### Backend (.env)
```bash
# AI Model APIs
NIM_DEEPSEEK_R1_API=your_nvidia_api_key
OLLAMA_API_BASE=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2:7b

# Server Configuration
DEBUG=true
LOG_LEVEL=INFO
```

### Development Workflow

1. **Backend Development** → Test with curl
2. **Frontend Service Development** → Mock data testing  
3. **Integration Testing** → Frontend ↔ Backend communication
4. **Error Handling** → Log analysis and debugging
5. **Performance Optimization** → Timeout and retry configuration

### API Integration Architecture

```
Frontend TypeScript → ApiClient → Endpoints → Backend FastAPI
     ↓                   ↓           ↓            ↓
Error Handling    Request Format  Timeout     Response Format
```

#### Request Flow Example (NVIDIA NIM):

1. **Frontend**: User clicks test button
2. **BackendService**: Constructs `AIModelRequest` object
3. **ApiClient**: Sets headers, serializes JSON, applies timeout
4. **Backend**: Validates request, calls NVIDIA NIM API
5. **Response**: AI model result returned to frontend

#### Critical Integration Points:

- **Content-Type**: Must be `application/json`
- **Request Structure**: Complete `AIModelRequest` with all required fields
- **Timeout Handling**: 120s for AI endpoints, 60s for others
- **Error Serialization**: Detailed error information for debugging

## 🔐 Environment Configuration

### Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)

```bash
# Copy from .env-example and configure
NIM_DEEPSEEK_R1_API="your_api_key"
OLLAMA_API_BASE="http://127.0.0.1:11434"
OLLAMA_MODEL="qwen2:7b"
```

## 📈 Development Phases

- ✅ **Phase 1**: Frontend Internal Refactoring
- 🔄 **Phase 2**: Backend Refactoring & Root Directory Organization  
- ⏳ **Phase 3**: Frontend-Backend Integration
- ⏳ **Phase 4**: Testing & Documentation
- ⏳ **Phase 5**: Production Optimization

## 🛠️ Available Scripts

### Root Directory
```bash
npm run prepare    # Setup Husky git hooks
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

### Backend
```bash
./start.sh         # Start development server
uv pip install -r requirements.txt  # Install dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Documentation

📋 **[Documentation Overview](./DOCUMENTATION_OVERVIEW.md)** - Complete guide to all project documentation

### 📖 Core Documentation
- **[Getting Started](#🚀-quick-start)** - Quick setup and installation
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation with examples
- **[Frontend-Backend Integration](#🔗-frontend-backend-integration-guide)** - Integration guide and troubleshooting

### 📋 Comprehensive Guides
- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to the project
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment strategies
- **[Testing Guide](./TESTING.md)** - Complete testing framework and strategies
- **[Security Guide](./SECURITY.md)** - Security best practices and implementation

### 📊 Project Status
- **[Development Guide](./DEVELOPMENT.md)** - Development workflow and standards
- **[Project Status](./PROJECT_STATUS.md)** - Current development status and roadmap

### 🔧 Technical Guides
- **[Error Display Testing](./ERROR_DISPLAY_TEST_GUIDE.md)** - Error handling and display testing
- **[Provider Selection Summary](./PROVIDER_SELECTION_SUMMARY.md)** - AI provider integration summary

---

**Built with ❤️ using Next.js, FastAPI, and modern web technologies.**
