# API 客戶端模式

記錄後端 API 整合的有效模式。

## 統一的 HTTP 客戶端

**使用情境**: 建立統一的 API 請求介面，包含錯誤處理和逾時設定

**程式碼**:
```typescript
// lib/api/client.ts
class APIClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      timeout: this.timeout,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
```

**說明**: 
- 封裝通用的 HTTP 請求邏輯
- 統一錯誤處理和逾時設定
- 支援 TypeScript 泛型推斷

**相關檔案**: `frontend-nextjs/src/lib/api/client.ts`

## API 端點型別定義

**使用情境**: 為 API 端點提供型別安全的介面

**程式碼**:
```typescript
// lib/api/endpoints.ts
import { apiClient } from './client';

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface AIModelResponse {
  models: Array<{
    name: string;
    provider: string;
    status: 'available' | 'unavailable';
  }>;
}

export const healthAPI = {
  check: () => apiClient.get<HealthResponse>('/api/v1/health'),
};

export const aiAPI = {
  getModels: () => apiClient.get<AIModelResponse>('/api/v1/ai/models'),
  checkStatus: () => apiClient.get<{ ollama: boolean; nvidia: boolean }>('/api/v1/ai/status'),
  chatOllama: (message: string) => 
    apiClient.post<{ response: string }>('/api/v1/ai/chat/ollama', { message }),
  chatNvidia: (message: string) => 
    apiClient.post<{ response: string }>('/api/v1/ai/chat/nvidia', { message }),
};
```

**說明**: 
- 集中管理所有 API 端點
- 提供型別安全的請求介面
- 清晰的功能分組

**相關檔案**: `frontend-nextjs/src/lib/api/endpoints.ts`
