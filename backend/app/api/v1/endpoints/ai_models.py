"""
AI model interaction endpoints.
"""

from fastapi import APIRouter, HTTPException, Request  # Add Request
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.core.config import settings
import httpx
import os
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class ChatRequest(BaseModel):
    """Chat request model."""
    message: str
    model: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000

class ChatResponse(BaseModel):
    """Chat response model."""
    response: str
    model: str
    timestamp: str

@router.get("/models")
async def list_available_models():
    """List available AI models."""
    models = []
    
    # Check Ollama availability
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{settings.OLLAMA_API_BASE}/api/tags")
            if response.status_code == 200:
                ollama_models = response.json().get("models", [])
                for model in ollama_models:
                    models.append({
                        "name": model.get("name", "unknown"),
                        "provider": "ollama",
                        "size": model.get("size", 0),
                        "available": True
                    })
    except Exception:
        models.append({
            "name": settings.OLLAMA_MODEL,
            "provider": "ollama",
            "available": False,
            "error": "Ollama server not accessible"
        })
    
    # Check NVIDIA NIM availability
    if settings.NIM_DEEPSEEK_R1_API:
        models.append({
            "name": "deepseek-r1",
            "provider": "nvidia-nim",
            "available": True
        })
    else:
        models.append({
            "name": "deepseek-r1",
            "provider": "nvidia-nim", 
            "available": False,
            "error": "API key not configured"
        })
    
    return {"models": models}

@router.post("/chat/ollama")
async def chat_with_ollama(request: ChatRequest):
    """Chat with Ollama model."""
    # Add debugging information
    print(f"🔍 Ollama endpoint received request:")
    print(f"  - Type: {type(request)}")
    print(f"  - Message: {request.message}")
    print(f"  - Model: {request.model}")
    print(f"  - Temperature: {request.temperature}")
    print(f"  - Max tokens: {request.max_tokens}")
    
    try:
        model_name = request.model or settings.OLLAMA_MODEL
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            payload = {
                "model": model_name,
                "prompt": request.message,
                "stream": False,
                "options": {
                    "temperature": request.temperature,
                    "num_predict": request.max_tokens
                }
            }
            
            response = await client.post(
                f"{settings.OLLAMA_API_BASE}/api/generate",
                json=payload
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=500,
                    detail=f"Ollama API error: {response.text}"
                )
            
            result = response.json()
            return ChatResponse(
                response=result.get("response", ""),
                model=model_name,
                timestamp=result.get("created_at", "")
            )
            
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=408,
            detail="Request to Ollama timed out"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with Ollama: {str(e)}"
        )

@router.post("/chat/nvidia")
async def chat_with_nvidia(request: Request, payload: ChatRequest):  # Add request: Request
    """Chat with NVIDIA NIM model."""
    # Add debugging information
    print(f"🔍 NVIDIA endpoint received request:")
    print(f"  - Type: {type(payload)}")
    print(f"  - Message: {payload.message}")
    print(f"  - Model: {payload.model}")
    print(f"  - Temperature: {payload.temperature}")
    print(f"  - Max tokens: {payload.max_tokens}")
    
    # Log headers
    logger.info(f"NVIDIA chat request headers: {request.headers}")

    # Log raw body
    raw_body = await request.body()
    logger.info(f"NVIDIA chat raw request body: {raw_body.decode()}")
    
    if not settings.NIM_DEEPSEEK_R1_API:
        raise HTTPException(
            status_code=400,
            detail="NVIDIA NIM API key not configured"
        )
    
    try:
        # Import here to avoid errors if packages not installed
        from langchain_nvidia_ai_endpoints import ChatNVIDIA
        from datetime import datetime
        
        llm = ChatNVIDIA(
            model="deepseek-ai/deepseek-r1",
            api_key=settings.NIM_DEEPSEEK_R1_API,
            temperature=payload.temperature or 0.6,
            max_tokens=payload.max_tokens or 1000,
        )
        
        response = llm.invoke(payload.message)
        
        return ChatResponse(
            response=response.content,
            model="deepseek-r1",
            timestamp=datetime.utcnow().isoformat()
        )
        
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="NVIDIA AI endpoints package not available"
        )
    except Exception as e:
        logger.error(f"Error in NVIDIA chat endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with NVIDIA NIM: {str(e)}"
        )

@router.get("/status")
async def ai_status():
    """Get AI services status."""
    status = {
        "ollama": {"available": False, "url": settings.OLLAMA_API_BASE},
        "nvidia_nim": {"available": bool(settings.NIM_DEEPSEEK_R1_API)}
    }
    
    # Check Ollama status
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{settings.OLLAMA_API_BASE}/api/tags")
            status["ollama"]["available"] = response.status_code == 200
            if response.status_code == 200:
                status["ollama"]["models_count"] = len(response.json().get("models", []))
    except Exception as e:
        status["ollama"]["error"] = str(e)
    
    return status
