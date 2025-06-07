"""
AI model management utilities.
"""

from app.core.config import settings
from smolagents import LiteLLMModel

def get_ollama_model():
    """Get configured Ollama model instance."""
    return LiteLLMModel(
        model_id=f"ollama_chat/{settings.OLLAMA_MODEL}",
        api_base=settings.OLLAMA_API_BASE,
        num_ctx=settings.OLLAMA_CONTEXT_LENGTH,
    )

def get_nvidia_model():
    """Get configured NVIDIA model instance."""
    if not settings.NIM_DEEPSEEK_R1_API:
        raise ValueError("NVIDIA NIM API key not configured")
    
    from langchain_nvidia_ai_endpoints import ChatNVIDIA
    
    return ChatNVIDIA(
        model="deepseek-ai/deepseek-r1",
        api_key=settings.NIM_DEEPSEEK_R1_API,
        temperature=0.6,
        top_p=0.7,
        max_tokens=4096,
    )
