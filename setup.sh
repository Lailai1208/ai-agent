#!/bin/bash

# AI Agent Project Setup Script
# This script helps new developers set up the project environment

echo "🚀 AI Agent Project Setup"
echo "=========================="
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js (v18 or later)"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2)
echo "✅ Node.js found: v$NODE_VERSION"

# Check npm
if ! command_exists npm; then
    echo "❌ npm not found. Please install npm"
    exit 1
fi
echo "✅ npm found"

# Check Python
if ! command_exists python3; then
    echo "❌ Python 3 not found. Please install Python 3.10 or later"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✅ Python found: $PYTHON_VERSION"

# Check uv
if ! command_exists uv; then
    echo "❌ uv not found. Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    source $HOME/.cargo/env
    if ! command_exists uv; then
        echo "❌ Failed to install uv. Please install manually:"
        echo "   Visit: https://docs.astral.sh/uv/getting-started/installation/"
        exit 1
    fi
fi
echo "✅ uv found"

echo ""
echo "📦 Setting up project dependencies..."

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend-nextjs

if [ ! -f ".env.local" ]; then
    echo "📝 Creating frontend environment file..."
    cp .env.local-example .env.local
    echo "   Please edit frontend-nextjs/.env.local if needed"
fi

echo "📚 Installing frontend dependencies..."
npm install

cd ..

# Setup backend
echo "🐍 Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "📝 Creating backend environment file..."
    cp .env-example .env
    echo "   Please edit backend/.env with your API keys"
fi

echo "📚 Setting up Python environment and dependencies..."
uv venv
uv pip install -r requirements.txt

cd ..

# Setup git hooks (if .git exists)
if [ -d ".git" ]; then
    echo "🔧 Setting up git hooks..."
    if [ -f "package.json" ]; then
        npm install
    fi
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your API keys (especially NIM_DEEPSEEK_R1_API)"
echo "2. Edit frontend-nextjs/.env.local if needed"
echo "3. Start development with: ./dev-start.sh"
echo ""
echo "📚 For more information, see:"
echo "   - README.md for project overview"
echo "   - DEVELOPMENT.md for development guidelines"
echo ""
echo "🎉 Happy coding!"
