#!/bin/bash

# AI Agent Project Health Check
# This script checks if the project environment is properly configured

echo "🏥 AI Agent Project Health Check"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

# Function to check status
check_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}❌ $2${NC}"
        ((CHECKS_FAILED++))
    fi
}

check_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Node.js
node --version > /dev/null 2>&1
check_status $? "Node.js is installed"

# npm
npm --version > /dev/null 2>&1
check_status $? "npm is available"

# Python
python3 --version > /dev/null 2>&1
check_status $? "Python 3 is installed"

# uv
uv --version > /dev/null 2>&1
check_status $? "uv package manager is installed"

echo ""
echo "📁 Checking project structure..."

# Check main directories
[ -d "frontend-nextjs" ]
check_status $? "Frontend directory exists"

[ -d "backend" ]
check_status $? "Backend directory exists"

[ -d "backend/app" ]
check_status $? "Backend app structure exists"

echo ""
echo "📄 Checking configuration files..."

# Check environment files
[ -f "backend/.env" ]
check_status $? "Backend .env file exists"

[ -f "frontend-nextjs/.env.local" ]
if [ $? -ne 0 ]; then
    check_warning "Frontend .env.local file missing (optional)"
else
    echo -e "${GREEN}✅ Frontend .env.local file exists${NC}"
    ((CHECKS_PASSED++))
fi

[ -f "backend/requirements.txt" ]
check_status $? "Backend requirements.txt exists"

[ -f "frontend-nextjs/package.json" ]
check_status $? "Frontend package.json exists"

echo ""
echo "🔧 Checking dependencies..."

# Check frontend dependencies
if [ -d "frontend-nextjs/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    ((CHECKS_PASSED++))
else
    check_warning "Frontend dependencies not installed (run: cd frontend-nextjs && npm install)"
fi

# Check backend virtual environment
if [ -d "backend/.venv" ]; then
    echo -e "${GREEN}✅ Backend virtual environment exists${NC}"
    ((CHECKS_PASSED++))
else
    check_warning "Backend virtual environment not found (run: cd backend && uv venv)"
fi

echo ""
echo "🚀 Checking startup scripts..."

[ -x "dev-start.sh" ]
check_status $? "Development start script is executable"

[ -x "backend/start.sh" ]
check_status $? "Backend start script is executable"

[ -x "setup.sh" ]
check_status $? "Setup script is executable"

echo ""
echo "📊 Health Check Summary"
echo "======================"
echo -e "✅ Checks passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "❌ Checks failed: ${RED}$CHECKS_FAILED${NC}"
echo -e "⚠️  Warnings: ${YELLOW}$WARNINGS${NC}"

echo ""
if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Project is healthy and ready for development!${NC}"
    echo ""
    echo "Quick start commands:"
    echo "  ./dev-start.sh    - Start both frontend and backend"
    echo "  npm run dev       - Same as above"
    echo "  npm run setup     - Run initial setup"
else
    echo -e "${RED}🚨 Some issues found. Please address the failed checks above.${NC}"
    echo ""
    echo "Suggested actions:"
    echo "  ./setup.sh        - Run initial project setup"
    echo "  npm install       - Install root dependencies"
    echo "  cd frontend-nextjs && npm install  - Install frontend deps"
    echo "  cd backend && uv venv && uv pip install -r requirements.txt  - Setup backend"
fi

echo ""
