"""
AI Agent Backend API

A FastAPI-based backend service for the AI Agent application.
Provides endpoints for health checks, AI model interactions, and utility functions.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
import json

# Create FastAPI instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI Agent Backend API with FastAPI",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Add request debugging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests for debugging."""
    if request.url.path.startswith("/api/v1/ai/chat/"):
        print(f"🌐 Incoming request to {request.url.path}")
        print(f"  - Method: {request.method}")
        print(f"  - Headers: {dict(request.headers)}")
        
        # Read the request body
        body = await request.body()
        if body:
            try:
                body_json = json.loads(body.decode())
                print(f"  - Body (parsed): {body_json}")
                print(f"  - Body type: {type(body_json)}")
            except Exception as e:
                print(f"  - Body (raw): {body}")
                print(f"  - Body parse error: {e}")
        
        # Create a new request with the same body
        from fastapi import Request
        from starlette.requests import Request as StarletteRequest
        
        # Recreate request with body
        class CustomRequest(StarletteRequest):
            def __init__(self, original_request, body_bytes):
                super().__init__(original_request.scope)
                self._body = body_bytes
                
            async def body(self):
                return self._body
        
        new_request = CustomRequest(request, body)
        response = await call_next(new_request)
    else:
        response = await call_next(request)
    
    return response

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with basic API information."""
    return {
        "message": "AI Agent Backend API",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
