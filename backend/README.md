# Backend API Documentation

本文件詳細說明了 AI Agent 專案後端 API 的架構、端點、配置和開發指南。

## 目錄
- [技術棧](#技術棧)
- [開始使用](#開始使用)
  - [前置需求](#前置需求)
  - [安裝](#安裝)
  - [啟動服務](#啟動服務)
- [專案結構](#專案結構)
- [API 端點](#api-端點)
  - [POST /api/v1/ai/chat/nvidia](#post-apiv1aichatnvidia)
  - [POST /api/v1/ai/chat/ollama](#post-apiv1aichatollama)
  - [GET /api/v1/ai/status](#get-apiv1aistatus)
  - [GET /api/v1/health](#get-apiv1health)
- [請求/響應模型](#請求響應模型)
- [錯誤處理](#錯誤處理)
- [日誌與調試](#日誌與調試)
- [環境變數配置](#環境變數配置)
- [測試](#測試)

## 技術棧

- **Framework**: FastAPI 0.104+
- **Language**: Python 3.10+
- **Package Manager**: uv (推薦) 或 pip
- **AI Models**: 
  - Ollama (本地模型)
  - NVIDIA NIM (雲端模型)
- **HTTP Client**: httpx (異步)
- **Configuration**: Pydantic Settings
- **Documentation**: OpenAPI/Swagger 自動生成

## 開始使用

### 前置需求
- Python 3.10 或更高版本
- `uv` (建議) 或 `pip`
- 可選：Ollama (用於本地 AI 模型)

### 安裝

```bash
# 進入後端目錄
cd backend

# 創建並激活虛擬環境 (如果使用 pip)
python -m venv .venv
source .venv/bin/activate  # Linux/macOS
# .venv\Scripts\activate    # Windows

# 安裝依賴 (使用 uv - 推薦)
uv pip install -r requirements.txt

# 或使用 pip
pip install -r requirements.txt
```

### 啟動服務

```bash
# 使用啟動腳本 (推薦)
./start.sh

# 或手動啟動
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

服務將運行在：
- **API 服務**: http://localhost:8000
- **API 文檔**: http://localhost:8000/docs
- **ReDoc 文檔**: http://localhost:8000/redoc

## 專案結構

```
backend/
├── app/
│   ├── __init__.py
│   ├── api/                     # API 路由
│   │   ├── __init__.py
│   │   └── v1/                  # API 版本 1
│   │       ├── __init__.py
│   │       ├── api.py           # 主 API 路由器
│   │       └── endpoints/       # 各端點模組
│   │           ├── __init__.py
│   │           ├── health.py    # 健康檢查端點
│   │           └── ai_models.py # AI 模型端點
│   └── core/                    # 核心應用邏輯
│       ├── __init__.py
│       ├── config.py            # 應用配置
│       └── ai_models.py         # AI 模型工具
├── .env                         # 環境變數 (從 .env-example 複製)
├── .env-example                 # 環境變數範例
├── main.py                      # FastAPI 應用程式入口
├── requirements.txt             # Python 依賴
├── start.sh                     # 啟動腳本
└── README.md                    # 本文件
```

## API 端點

### POST /api/v1/ai/chat/nvidia

**功能**: 與 NVIDIA NIM DeepSeek-R1 模型聊天

**請求格式**:
```json
{
  "message": "Your chat message",
  "model": "deepseek-ai/deepseek-r1",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**響應格式**:
```json
{
  "response": "AI model response",
  "model": "deepseek-r1", 
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

**所需環境變數**:
- `NIM_DEEPSEEK_R1_API`: NVIDIA NIM API 金鑰

**curl 測試範例**:
```bash
curl -X 'POST' \
  'http://localhost:8000/api/v1/ai/chat/nvidia' \
  -H 'Content-Type: application/json' \
  -d '{
    "message": "Hello, how are you?",
    "model": "deepseek-ai/deepseek-r1",
    "temperature": 0.7,
    "max_tokens": 1000
  }'
```

### POST /api/v1/ai/chat/ollama

**功能**: 與本地 Ollama 模型聊天

**請求格式**:
```json
{
  "message": "Your chat message",
  "temperature": 0.7,
  "max_tokens": 1000
}
```

**響應格式**:
```json
{
  "response": "AI model response",
  "model": "qwen2:7b",
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

**所需環境變數**:
- `OLLAMA_API_BASE`: Ollama 服務地址 (預設: http://127.0.0.1:11434)
- `OLLAMA_MODEL`: 使用的模型名稱 (預設: qwen2:7b)

### GET /api/v1/ai/status

**功能**: 檢查 AI 服務狀態

**響應格式**:
```json
{
  "ollama": {
    "available": true,
    "url": "http://127.0.0.1:11434",
    "models_count": 3
  },
  "nvidia_nim": {
    "available": true
  }
}
```

### GET /api/v1/health

**功能**: 健康檢查端點

**響應格式**:
```json
{
  "status": "healthy",
  "timestamp": "2025-06-08T11:07:33.717811"
}
```

## 請求/響應模型

### Pydantic 模型定義

```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ChatRequest(BaseModel):
    """聊天請求模型"""
    message: str
    model: Optional[str] = None
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1000

class ChatResponse(BaseModel):
    """聊天響應模型"""
    response: str
    model: str
    timestamp: str

class HealthResponse(BaseModel):
    """健康檢查響應模型"""
    status: str
    timestamp: str
```

## 錯誤處理

### HTTP 狀態碼

- **200 OK**: 請求成功
- **400 Bad Request**: 請求參數錯誤或配置缺失
- **422 Unprocessable Entity**: 請求格式錯誤
- **500 Internal Server Error**: 服務器內部錯誤

### 錯誤響應格式

```json
{
  "detail": "Error message description"
}
```

### 常見錯誤

#### 422 Unprocessable Entity
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
**解決方案**: 檢查請求體是否包含所有必要字段，確認 Content-Type 為 `application/json`

#### 400 Bad Request
```json
{
  "detail": "NVIDIA NIM API key not configured"
}
```
**解決方案**: 設定相應的環境變數 (如 `NIM_DEEPSEEK_R1_API`)

#### 500 Internal Server Error
```json
{
  "detail": "Error communicating with NVIDIA NIM: [specific error]"
}
```
**解決方案**: 檢查 AI 服務連接，確認 API 金鑰有效

## 日誌與調試

### 請求日誌中間件

應用包含詳細的請求日誌記錄：

```python
# 在控制台中會看到類似輸出：
🌐 Incoming request to /api/v1/ai/chat/nvidia
  - Method: POST
  - Headers: {'content-type': 'application/json', ...}
  - Body (parsed): {'message': 'Hello', 'model': 'deepseek-ai/deepseek-r1', ...}
  - Body type: <class 'dict'>
```

### 調試端點請求

```python
# ai_models.py 中的調試信息
🔍 NVIDIA endpoint received request:
  - Type: <class 'app.api.v1.endpoints.ai_models.ChatRequest'>
  - Message: Hello
  - Model: deepseek-ai/deepseek-r1
  - Temperature: 0.7
  - Max tokens: 1000
```

### 日誌級別配置

```bash
# .env 文件中設定
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR
DEBUG=true      # 開發環境調試模式
```

## 環境變數配置

### 必要配置

```bash
# AI 模型 API 金鑰
NIM_DEEPSEEK_R1_API=your_nvidia_api_key_here

# Ollama 配置
OLLAMA_API_BASE=http://127.0.0.1:11434
OLLAMA_MODEL=qwen2:7b
OLLAMA_CONTEXT_LENGTH=8192

# 應用配置
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# 安全性 (生產環境必要)
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS 設定
ALLOWED_HOSTS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

### 配置驗證

```bash
# 使用健康檢查腳本驗證配置
cd ..  # 返回根目錄
./health-check.sh
```

## 測試

### 單元測試

```bash
# 執行所有測試
python -m pytest

# 執行特定測試文件
python -m pytest test_ai_models.py -v

# 執行特定測試
python -m pytest test_ai_models.py::test_nvidia_chat -v
```

### API 測試

```bash
# 使用提供的測試腳本
python test.py

# 手動 curl 測試
curl -X GET http://localhost:8000/api/v1/health
curl -X GET http://localhost:8000/api/v1/ai/status
```

### 負載測試

```bash
# 使用 ab (Apache Bench)
ab -n 100 -c 10 http://localhost:8000/api/v1/health

# 使用 hey
hey -n 100 -c 10 http://localhost:8000/api/v1/health
```

## 性能考量

### AI 模型響應時間
- **NVIDIA NIM**: 通常 10-60 秒
- **Ollama**: 取決於本地硬體，通常 5-30 秒
- **建議**: 前端設置至少 120 秒超時

### 並發處理
- FastAPI 支援異步處理
- 使用 `httpx.AsyncClient` 進行非阻塞 HTTP 請求
- 建議生產環境使用 Gunicorn + Uvicorn

### 資源監控

```bash
# 監控服務狀態
curl http://localhost:8000/api/v1/ai/status

# 檢查記憶體使用
ps aux | grep python

# 檢查網絡連接
netstat -an | grep 8000
```

## API 客戶端整合指南

### 必要 Headers

```javascript
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### 錯誤處理最佳實踐

```javascript
try {
  const response = await fetch('/api/v1/ai/chat/nvidia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail);
  }
  
  const result = await response.json();
  return result;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

### 超時處理

```javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), 120000); // 120 秒

fetch(url, {
  signal: controller.signal,
  // ... other options
});
```

---

**如需更多技術支援，請查看 FastAPI 官方文檔或在專案中開啟 issue。**
