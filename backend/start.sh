#!/bin/bash

# AI Agent Backend Start Script

echo "🚀 Starting AI Agent Backend..."

# Check if uv is available
if ! command -v uv &> /dev/null; then
    echo "❌ uv package tool not found. Please install uv first."
    echo "   Visit: https://docs.astral.sh/uv/getting-started/installation/"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d ".venv" ] || [ ! -f ".venv/pyvenv.cfg" ]; then
    echo "📦 Creating virtual environment with uv..."
    uv venv
else
    echo "✅ Virtual environment already exists"
fi

# Install/update dependencies using uv
echo "📚 Installing dependencies with uv..."
uv pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Copying from .env-example..."
    cp .env-example .env
    echo "📝 Please edit .env file with your API keys and configuration."
fi

# Start the server using uv with proper Python path
echo "🌐 Starting FastAPI server on http://localhost:8000"
echo "📖 API Documentation will be available at http://localhost:8000/docs"
echo ""

export PYTHONPATH=/home/master/ai-agent/backend:$PYTHONPATH
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
