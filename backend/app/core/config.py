"""
Core configuration settings for the AI Agent Backend API.
"""

import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings."""
    
    # Project information
    PROJECT_NAME: str = "AI Agent Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS settings
    ALLOWED_HOSTS: List[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3001",
        ]
    )
    
    # AI Model settings
    OLLAMA_API_BASE: str = Field(default="http://127.0.0.1:11434", env="OLLAMA_API_BASE")
    OLLAMA_MODEL: str = Field(default="qwen2:7b", env="OLLAMA_MODEL")
    OLLAMA_CONTEXT_LENGTH: int = Field(default=8192, env="OLLAMA_CONTEXT_LENGTH")
    
    # NVIDIA NIM API settings
    NIM_DEEPSEEK_R1_API: str = Field(default="", env="NIM_DEEPSEEK_R1_API")
    
    # Environment
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    DEBUG: bool = Field(default=True, env="DEBUG")
    
    # Database (for future use)
    DATABASE_URL: str = Field(default="sqlite:///./ai_agent.db", env="DATABASE_URL")
    
    # Security
    SECRET_KEY: str = Field(default="dev-secret-key", env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = Field(default=60, env="RATE_LIMIT_PER_MINUTE")
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()
