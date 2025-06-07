#!/bin/bash

# AI Agent Project Development Starter
# This script helps you start both frontend and backend simultaneously

echo "🚀 Starting AI Agent Development Environment..."
echo ""

# Check if required tools are installed
echo "🔍 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js (v18 or later)"
    exit 1
fi

# Check uv
if ! command -v uv &> /dev/null; then
    echo "❌ uv not found. Please install uv package manager"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Function to start backend
start_backend() {
    echo "🐍 Starting Backend (FastAPI)..."
    cd backend
    ./start.sh &
    BACKEND_PID=$!
    cd ..
    echo "Backend started with PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "⚛️  Starting Frontend (Next.js)..."
    cd frontend-nextjs
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    echo "Frontend started with PID: $FRONTEND_PID"
}

# Start both services
start_backend
sleep 3  # Give backend time to start
start_frontend

echo ""
echo "🎉 Development environment started!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

# Keep script running
wait
