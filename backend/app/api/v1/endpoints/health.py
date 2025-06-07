# filepath: /home/master/ai-agent/backend/app/api/v1/endpoints/health.py
"""
Health check endpoints for the AI Agent Backend API.
"""

from fastapi import APIRouter
from datetime import datetime
from app.core.config import settings

router = APIRouter()

@router.get("/")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "message": "AI Agent Backend API is running",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }

@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with system information."""
    return {
        "status": "healthy",
        "message": "AI Agent Backend API is running",
        "timestamp": datetime.utcnow().isoformat(),
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "api_version": settings.API_V1_STR,
        "ollama_configured": bool(settings.OLLAMA_API_BASE),
        "nim_api_configured": bool(settings.NIM_DEEPSEEK_R1_API),
        "debug_mode": settings.DEBUG
    }