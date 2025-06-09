# API Reference

Complete API reference documentation for the AI Agent project.

## 📚 Table of Contents

- [Base URL & Authentication](#base-url--authentication)
- [Common Response Formats](#common-response-formats)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [AI Model Endpoints](#ai-model-endpoints)
- [Health & Status Endpoints](#health--status-endpoints)
- [Request Examples](#request-examples)
- [SDK & Client Libraries](#sdk--client-libraries)

## 🌐 Base URL & Authentication

### Base URL
```
Development: http://localhost:8000
Production: https://api.yourdomain.com
```

### Authentication
Currently, the API uses API key-based authentication for AI model providers:

```bash
# Environment variables required
export NIM_DEEPSEEK_R1_API="your_nvidia_nim_api_key"
export OLLAMA_API_BASE="http://127.0.0.1:11434"
```

### Request Headers
```http
Content-Type: application/json
Accept: application/json
User-Agent: AI-Agent-Client/1.0
```

## 📋 Common Response Formats

### Success Response
```json
{
  "response": "AI model response text",
  "model": "model_name",
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

### Error Response
```json
{
  "detail": "Error message description",
  "error_code": "INVALID_REQUEST",
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

### Validation Error Response
```json
{
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Description | Common Causes |
|------|-------------|---------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Missing configuration, invalid parameters |
| 422 | Unprocessable Entity | Invalid request format, validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | AI model API errors, server issues |
| 503 | Service Unavailable | AI model service down |

### Error Codes

| Error Code | Description | Solution |
|------------|-------------|----------|
| `API_KEY_MISSING` | AI model API key not configured | Set environment variables |
| `INVALID_MODEL` | Unsupported model specified | Use supported model names |
| `REQUEST_TIMEOUT` | AI model request timed out | Retry with shorter message |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait before retrying |
| `VALIDATION_ERROR` | Request validation failed | Check request format |

## 🚦 Rate Limiting

### Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/v1/ai/chat/*` | 10 requests | per minute |
| `/api/v1/health` | 100 requests | per minute |
| `/api/v1/ai/status` | 60 requests | per minute |

### Rate Limit Headers
```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1640995200
```

## 🤖 AI Model Endpoints

### POST /api/v1/ai/chat/nvidia

Chat with NVIDIA NIM DeepSeek-R1 model.

#### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `message` | string | ✅ | - | User message (1-10000 chars) |
| `model` | string | ❌ | `deepseek-ai/deepseek-r1` | Model identifier |
| `temperature` | float | ❌ | `0.7` | Response randomness (0.0-2.0) |
| `max_tokens` | integer | ❌ | `1000` | Maximum response length (1-4000) |

#### Example Request
```bash
curl -X POST "http://localhost:8000/api/v1/ai/chat/nvidia" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing in simple terms",
    "model": "deepseek-ai/deepseek-r1",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

#### Example Response
```json
{
  "response": "Quantum computing is a revolutionary approach to processing information that leverages the principles of quantum mechanics...",
  "model": "deepseek-r1",
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

#### Error Responses
```json
// API key not configured
{
  "detail": "NVIDIA NIM API key not configured",
  "error_code": "API_KEY_MISSING"
}

// Invalid request format
{
  "detail": [
    {
      "loc": ["body", "message"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### POST /api/v1/ai/chat/ollama

Chat with local Ollama model.

#### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `message` | string | ✅ | - | User message (1-10000 chars) |
| `temperature` | float | ❌ | `0.7` | Response randomness (0.0-2.0) |
| `max_tokens` | integer | ❌ | `1000` | Maximum response length (1-4000) |

#### Example Request
```bash
curl -X POST "http://localhost:8000/api/v1/ai/chat/ollama" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the capital of France?",
    "temperature": 0.5,
    "max_tokens": 500
  }'
```

#### Example Response
```json
{
  "response": "The capital of France is Paris. It is located in the northern part of the country...",
  "model": "qwen2:7b",
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

#### Error Responses
```json
// Ollama service not available
{
  "detail": "Error communicating with Ollama: Connection refused",
  "error_code": "SERVICE_UNAVAILABLE"
}
```

## 🏥 Health & Status Endpoints

### GET /api/v1/health

Basic health check endpoint.

#### Example Request
```bash
curl -X GET "http://localhost:8000/api/v1/health"
```

#### Example Response
```json
{
  "status": "healthy",
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

### GET /api/v1/ai/status

Check AI model service availability.

#### Example Request
```bash
curl -X GET "http://localhost:8000/api/v1/ai/status"
```

#### Example Response
```json
{
  "ollama": {
    "available": true,
    "url": "http://127.0.0.1:11434",
    "models_count": 3,
    "models": ["qwen2:7b", "llama2:7b", "codellama:7b"]
  },
  "nvidia_nim": {
    "available": true,
    "configured": true
  },
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

#### Partial Service Availability
```json
{
  "ollama": {
    "available": false,
    "error": "Connection refused",
    "url": "http://127.0.0.1:11434"
  },
  "nvidia_nim": {
    "available": true,
    "configured": true
  },
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

### GET /

Root endpoint with project information.

#### Example Response
```json
{
  "name": "AI Agent API",
  "version": "1.0.0",
  "description": "FastAPI backend for AI Agent application",
  "docs_url": "/docs",
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

## 📝 Request Examples

### Complete Workflow Example

```bash
#!/bin/bash
# Complete API workflow example

BASE_URL="http://localhost:8000"

echo "1. Check API health"
curl -X GET "$BASE_URL/api/v1/health"

echo -e "\n\n2. Check AI service status"
curl -X GET "$BASE_URL/api/v1/ai/status"

echo -e "\n\n3. Test NVIDIA NIM chat"
curl -X POST "$BASE_URL/api/v1/ai/chat/nvidia" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "model": "deepseek-ai/deepseek-r1",
    "temperature": 0.7,
    "max_tokens": 1000
  }'

echo -e "\n\n4. Test Ollama chat"
curl -X POST "$BASE_URL/api/v1/ai/chat/ollama" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain machine learning briefly",
    "temperature": 0.5,
    "max_tokens": 500
  }'
```

### JavaScript/TypeScript Example

```typescript
// API client example
class AIAgentClient {
  private baseURL: string;
  private defaultTimeout: number = 120000; // 2 minutes for AI endpoints

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
  }

  async chatWithNvidia(
    message: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<AIResponse> {
    const requestBody = {
      message,
      model: options.model || 'deepseek-ai/deepseek-r1',
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    };

    const response = await fetch(`${this.baseURL}/api/v1/ai/chat/nvidia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.defaultTimeout),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async chatWithOllama(
    message: string,
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<AIResponse> {
    const requestBody = {
      message,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    };

    const response = await fetch(`${this.baseURL}/api/v1/ai/chat/ollama`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.defaultTimeout),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/health`);
    return response.json();
  }

  async getAIStatus(): Promise<AIStatusResponse> {
    const response = await fetch(`${this.baseURL}/api/v1/ai/status`);
    return response.json();
  }
}

// Type definitions
interface AIResponse {
  response: string;
  model: string;
  timestamp: string;
}

interface HealthResponse {
  status: string;
  timestamp: string;
}

interface AIStatusResponse {
  ollama: {
    available: boolean;
    url?: string;
    models_count?: number;
    models?: string[];
    error?: string;
  };
  nvidia_nim: {
    available: boolean;
    configured: boolean;
  };
  timestamp: string;
}

// Usage example
const client = new AIAgentClient();

try {
  const response = await client.chatWithNvidia('Hello AI!');
  console.log('AI Response:', response.response);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Python Example

```python
# API client example in Python
import httpx
import asyncio
from typing import Optional, Dict, Any

class AIAgentClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.timeout = 120.0  # 2 minutes for AI endpoints

    async def chat_with_nvidia(
        self,
        message: str,
        model: str = "deepseek-ai/deepseek-r1",
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> Dict[str, Any]:
        """Chat with NVIDIA NIM model"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/v1/ai/chat/nvidia",
                json={
                    "message": message,
                    "model": model,
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
            )
            response.raise_for_status()
            return response.json()

    async def chat_with_ollama(
        self,
        message: str,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> Dict[str, Any]:
        """Chat with Ollama model"""
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/v1/ai/chat/ollama",
                json={
                    "message": message,
                    "temperature": temperature,
                    "max_tokens": max_tokens
                }
            )
            response.raise_for_status()
            return response.json()

    async def get_health(self) -> Dict[str, Any]:
        """Get API health status"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/api/v1/health")
            response.raise_for_status()
            return response.json()

    async def get_ai_status(self) -> Dict[str, Any]:
        """Get AI services status"""
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{self.base_url}/api/v1/ai/status")
            response.raise_for_status()
            return response.json()

# Usage example
async def main():
    client = AIAgentClient()
    
    try:
        # Check health
        health = await client.get_health()
        print(f"API Status: {health['status']}")
        
        # Check AI services
        ai_status = await client.get_ai_status()
        print(f"Ollama Available: {ai_status['ollama']['available']}")
        print(f"NVIDIA NIM Available: {ai_status['nvidia_nim']['available']}")
        
        # Chat with AI
        response = await client.chat_with_nvidia("Hello, how are you?")
        print(f"AI Response: {response['response']}")
        
    except httpx.HTTPStatusError as e:
        print(f"HTTP Error: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        print(f"Error: {e}")

# Run the example
if __name__ == "__main__":
    asyncio.run(main())
```

## 📦 SDK & Client Libraries

### Frontend Integration

The project includes a TypeScript client library:

```typescript
// Import the client
import { apiClient } from '@/lib/api/client';
import { aiModelApi } from '@/lib/api/endpoints';

// Use the endpoints
const response = await aiModelApi.chatNvidia({
  message: 'Hello AI!',
  model: 'deepseek-ai/deepseek-r1',
  temperature: 0.7,
  max_tokens: 1000
});
```

### Custom Client Implementation

When implementing your own client, ensure:

1. **Proper timeout handling** (120s for AI endpoints)
2. **Content-Type header** set to `application/json`
3. **Error handling** for various HTTP status codes
4. **Rate limiting** respect and retry logic
5. **Request/response logging** for debugging

### OpenAPI Schema

The complete OpenAPI schema is available at:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

**For the most up-to-date API documentation, always refer to the interactive documentation at `/docs` when the server is running.**
